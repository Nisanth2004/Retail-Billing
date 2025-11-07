import React from 'react'
import './ReceiptPopup.css'

import './Print.css'
const ReceiptPopup = ({orderDetails,onClose,onPrint}) => {
  return (
    <div className="receipt-popup-overlay text-dark">
        <div className="receipt-popup">
            <div className="text-center mb-4">
                <i className="bi bi-check-circle-fill text-success fs-1"></i>
            </div>
            <h3 className='text-center mb-4'>Order Receipt</h3>
            <p>
                <strong>ORDER ID: {orderDetails.orderId}</strong>
            </p>
            <p>
                <strong>Name: {orderDetails.customerName}</strong>
            </p>
            <p>
                <strong>Phone: {orderDetails.phoneNumber}</strong>
            </p>
            <hr className='my-3'></hr>
            <h5 className='mb-3'>Items Ordered</h5>
            <div className="cart-items-scrollable">
                {
                    orderDetails.items.map((item,index)=>(
                        <div key={index} className="d-flex justify-content-between mb-2">
                            <span>{item.name} x {item.quantity}</span>
                            <span>&#8377;{(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                    ))
                }
            </div>

            <hr className='my-3'/>
            <div className="d-flex justify-content-between mb-2">
                <span>
                    <strong>Subtotal:</strong>
                    
                </span>
                <span>&#8377;{orderDetails.subtotal.toFixed(2)}</span>


            </div>

            <div className="d-flex justify-content-between mb-2">
            <span>
                    <strong>Tax (1%):</strong>
                    
                </span>
                <span>&#8377;{orderDetails.tax.toFixed(2)}</span>
            </div>
            <div className="d-flex justify-content-between mb-2">
            <span>
                    <strong>Grand Total:</strong>
                    
                </span>
                <span>&#8377;{orderDetails.grandTotal.toFixed(2)}</span>
            </div>

            <p className='d-flex justify-content-between mb-2'>
                <strong>Payment Method:</strong>{orderDetails.paymentMethod}
            </p>
            <hr className='my-3'/>
            {
                // if its UPI display razorpay details 
                orderDetails.paymentMethod==="UPI" && (
                    <>
                     <p>
                        <strong>Razorpay Order ID:</strong>{orderDetails.razorpayOrderId}
                     </p>
                     <p>
                        <strong>Razorpay Payment ID:</strong>{orderDetails.razorpayPaymentId}
                     </p>

                    </>
                )
            }
            {/* if its CASH  */}
            <div className="d-flex justifu-content-end gap-3 mt-4">
                <button className='btn btn-warning' onClick={onPrint}>Print Receipt</button>
                <button className='btn btn-danger' onClick={onClose}>Close</button>
            </div>
        </div>
    </div>
  )
}

export default ReceiptPopup
