import React, { useState } from "react";
import "./ReceiptPopup.css";
import "./Print.css";
import toast from "react-hot-toast";
import axios from "axios";
import { jsPDF } from "jspdf";

const ReceiptPopup = ({ orderDetails, onClose, onPrint }) => {
  const [sending, setSending] = useState(false);

  // Build SMS message
  const buildMessage = (order) => {
    const itemsText = order.items
      .map((it) => `${it.name} x${it.quantity}`)
      .join(" | ");

    return `Receipt
Order: ${order.orderId}
Items: ${itemsText}
Total: ₹${order.grandTotal.toFixed(2)}
Invoice sent to your phone.`;
  };

  // ⬇ Generate PDF Invoice using jsPDF
  const generatePDF = () => {
    const pdf = new jsPDF();

    pdf.setFontSize(18);
    pdf.text("INVOICE", 80, 15);

    pdf.setFontSize(12);
    pdf.text(`Order ID: ${orderDetails.orderId}`, 10, 30);
    pdf.text(`Customer: ${orderDetails.customerName}`, 10, 40);
    pdf.text(`Phone: ${orderDetails.phoneNumber}`, 10, 50);

    pdf.text("Items:", 10, 70);

    let y = 80;
    orderDetails.items.forEach((item) => {
      pdf.text(
        `${item.name} x${item.quantity} - ₹${(
          item.price * item.quantity
        ).toFixed(2)}`,
        10,
        y
      );
      y += 10;
    });

    y += 10;
    pdf.text(`Subtotal: ₹${orderDetails.subtotal}`, 10, y);
    y += 10;
    pdf.text(`Tax (1%): ₹${orderDetails.tax}`, 10, y);
    y += 10;
    pdf.text(`Grand Total: ₹${orderDetails.grandTotal}`, 10, y);

    return pdf;
  };

  // 📤 SEND SMS + PDF Link
  const sendSMSWithInvoice = async () => {
    if (!orderDetails?.phoneNumber) {
      toast.error("Customer phone number missing!");
      return;
    }

    setSending(true);

    try {
      const pdf = generatePDF();
      const pdfBlob = pdf.output("blob");

      // Upload PDF to free file host → get link
      const formData = new FormData();
      formData.append("file", pdfBlob, `invoice_${orderDetails.orderId}.pdf`);

      // USING free file host: tmpfiles.org
      const upload = await axios.post("https://tmpfiles.org/api/v1/upload", formData);

      const fileUrl = upload.data.data.url; // link to PDF

      // Now send SMS with PDF link
      const message = buildMessage(orderDetails) + ` Download PDF: ${fileUrl}`;

      await axios.post(
        "http://localhost:8080/admin/sms/send",
        {
          phone: orderDetails.phoneNumber,
          message: message,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      toast.success("SMS + Invoice PDF sent!");
    } catch (error) {
      console.error(error);
      toast.error("Error sending invoice");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="receipt-popup-overlay text-dark">
      <div className="receipt-popup">
        <div className="text-center mb-4">
          <i className="bi bi-check-circle-fill text-success fs-1"></i>
        </div>

        <h3 className="text-center mb-4">Order Receipt</h3>

        <p><strong>ORDER ID:</strong> {orderDetails.orderId}</p>
        <p><strong>Name:</strong> {orderDetails.customerName}</p>
        <p><strong>Phone:</strong> {orderDetails.phoneNumber}</p>

        <hr className="my-3" />

        <h5>Items Ordered</h5>
        <div className="cart-items-scrollable">
          {orderDetails.items.map((item, index) => (
            <div key={index} className="d-flex justify-content-between mb-2">
              <span>{item.name} x {item.quantity}</span>
              <span>₹{(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>

        <hr />

        <div className="d-flex justify-content-end gap-3 mt-4">
          <button className="btn btn-warning" onClick={onPrint}>
            Print Receipt
          </button>

          <button className="btn btn-primary" onClick={sendSMSWithInvoice} disabled={sending}>
            {sending ? "Sending..." : "Send SMS + Invoice"}
          </button>

          <button className="btn btn-danger" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default ReceiptPopup;
