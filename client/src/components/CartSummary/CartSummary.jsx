import React, { useContext, useState } from 'react';
import './CartSummary.css';
import { AppContext } from '../../context/AppContext';
import ReceiptPopup from '../ReceiptPopup/ReceiptPopup';
import { createOrder, deleteOrder } from '../../Service/OrderService';
import { toast } from 'react-hot-toast';
import { createRazorpayOrder, verifyPayment } from '../../Service/PaymentService';
import { AppConstants } from '../../util/constants';

const CartSummary = ({ customerName, mobileNumber, setMobileNumber, setCustomerName }) => {
  const { cartItems, clearCart } = useContext(AppContext);

  // totals
  const totals = cartItems.reduce(
    (acc, item) => {
      const price = Number(item.price) || 0;
      const qty = Number(item.quantity) || 0;
      const cgst = Number(item.cgstRate) || 0;
      const sgst = Number(item.sgstRate) || 0;

      const sub = price * qty;
      const cgstAmt = (sub * cgst) / 100;
      const sgstAmt = (sub * sgst) / 100;

      acc.subtotal += sub;
      acc.cgstTotal += cgstAmt;
      acc.sgstTotal += sgstAmt;
      acc.totalGST += cgstAmt + sgstAmt;
      acc.grandTotal += sub + cgstAmt + sgstAmt;

      return acc;
    },
    { subtotal: 0, cgstTotal: 0, sgstTotal: 0, totalGST: 0, grandTotal: 0 }
  );

  const { subtotal, cgstTotal, sgstTotal, totalGST, grandTotal } = totals;

  const [isProcessing, setIsProcessing] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  const loadRazorpayScript = () =>
    new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const deleteOrderOnFailure = async (orderId) => {
    try {
      await deleteOrder(orderId);
    } catch (error) {
      console.log(error);
      toast.error('Something went wrong');
    }
  };

  const clearAll = () => {
    setCustomerName('');
    setMobileNumber('');
    clearCart();
  };

  const handlePrintReceipt = () => window.print();

  const completePayment = async (paymentMode) => {
    if (!customerName || !mobileNumber) {
      toast.error('Please enter customer details');
      return;
    }

    if (cartItems.length === 0) {
      toast.error('Cart is empty');
      return;
    }

    const orderData = {
      customerName,
      phoneNumber: mobileNumber,
      cartItems,
      subtotal,
      cgstTotal,
      sgstTotal,
      totalGST,
      grandTotal,
      paymentMethod: paymentMode.toUpperCase(),
    };

    setIsProcessing(true);

    try {
      const response = await createOrder(orderData);
      const savedData = response.data;

      if (paymentMode === 'cash') {
        toast.success('Cash Received');
        setOrderDetails(savedData);
      } else if (paymentMode === 'upi') {
        const loaded = await loadRazorpayScript();
        if (!loaded) {
          toast.error('Unable to load payment system');
          await deleteOrderOnFailure(savedData.orderId);
          return;
        }

        const rpOrder = await createRazorpayOrder({
          amount: Math.round(grandTotal * 100),
          currency: 'INR',
        });

        const options = {
          key: AppConstants.RAZORPAY_KEY_ID,
          amount: rpOrder.data.amount,
          currency: rpOrder.data.currency,
          order_id: rpOrder.data.id,
          name: 'Nisafin',
          description: 'Order Payment',
          handler: async function (response) {
            await verifyPaymentHandler(response, savedData);
          },
          prefill: { name: customerName, contact: mobileNumber },
          theme: { color: '#3399cc' },
        };

        new window.Razorpay(options).open();
      }
    } catch (error) {
      console.log(error);
      toast.error('Payment failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const verifyPaymentHandler = async (response, savedOrder) => {
    const paymentData = {
      razorpayOrderId: response.razorpay_order_id,
      razorpayPaymentId: response.razorpay_payment_id,
      razorpaySignature: response.razorpay_signature,
      orderId: savedOrder.orderId,
    };

    try {
      const paymentResponse = await verifyPayment(paymentData);

      if (paymentResponse.status === 200) {
        toast.success('Payment successful');
        setOrderDetails({
          ...savedOrder,
          paymentDetails: paymentData,
        });
      } else {
        toast.error('Payment failed');
      }
    } catch (error) {
      console.log(error);
      toast.error('Payment failed');
    }
  };

  const placeOrder = () => {
    if (!orderDetails) {
      toast.error('Complete payment first!');
      return;
    }
    setShowPopup(true);
  };

  return (
    <div className="mt-2">
      <div className="card-summary-details">
        <div className="d-flex justify-content-between mb-2">
          <span className="text-light">Subtotal:</span>
          <span className="text-light">₹{subtotal.toFixed(2)}</span>
        </div>

        <div className="d-flex justify-content-between mb-2">
          <span className="text-light">GST Total:</span>
          <span className="text-light">₹{totalGST.toFixed(2)}</span>
        </div>

        <div className="d-flex justify-content-between mb-4">
          <span className="text-light">Grand Total:</span>
          <span className="text-light">₹{grandTotal.toFixed(2)}</span>
        </div>
      </div>

      <div className="d-flex gap-3">
        <button className="btn btn-success flex-grow-1" onClick={() => completePayment('cash')} disabled={isProcessing}>
          {isProcessing ? 'Processing..' : 'CASH'}
        </button>

        <button className="btn btn-primary flex-grow-1" onClick={() => completePayment('upi')} disabled={isProcessing}>
          {isProcessing ? 'Processing..' : 'UPI'}
        </button>
      </div>

      <div className="d-flex gap-3 mt-2">
        <button className="btn btn-warning flex-grow-1" onClick={placeOrder} disabled={!orderDetails}>
          Place Order
        </button>
      </div>

      {showPopup && orderDetails && (
        <ReceiptPopup
          orderDetails={{
            orderId: orderDetails.orderId,
            customerName: orderDetails.customerName,
            phoneNumber: orderDetails.phoneNumber,
            paymentMethod: orderDetails.paymentMethod,

            items: orderDetails.cartItems || orderDetails.items,

            subtotal,
            cgstTotal,
            sgstTotal,
            totalGST,
            grandTotal,
          }}
          onClose={() => {
            clearAll();
            setShowPopup(false);
          }}
          onPrint={handlePrintReceipt}
        />
      )}
    </div>
  );
};

export default CartSummary;
