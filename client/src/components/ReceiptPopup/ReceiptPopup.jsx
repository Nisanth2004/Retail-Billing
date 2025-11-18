import React, { useState } from "react";
import "./ReceiptPopup.css";
import "./Print.css";
import toast from "react-hot-toast";
import axios from "axios";
import { jsPDF } from "jspdf";

const ReceiptPopup = ({ orderDetails, onClose, onPrint }) => {
  const [sending, setSending] = useState(false);

  const buildSMSText = (od) => {
    const itemsText = od.items
      .map((it) => {
        const sub = Number(it.price || 0) * Number(it.quantity || 0);
        const cgstAmt = (sub * Number(it.cgstRate || 0)) / 100;
        const sgstAmt = (sub * Number(it.sgstRate || 0)) / 100;

        return `${it.name} x${it.quantity} - ₹${sub.toFixed(2)} (CGST ₹${cgstAmt.toFixed(
          2
        )}, SGST ₹${sgstAmt.toFixed(2)})`;
      })
      .join(" | ");

    return `INVOICE: ${od.orderId}
Name: ${od.customerName}
Items: ${itemsText}
Subtotal: ₹${od.subtotal.toFixed(2)}
CGST: ₹${od.cgstTotal.toFixed(2)}, SGST: ₹${od.sgstTotal.toFixed(2)}
Total GST: ₹${od.totalGST.toFixed(2)}
Grand Total: ₹${od.grandTotal.toFixed(2)}
Thank you!`;
  };

  const generatePDF = () => {
    const pdf = new jsPDF();
    pdf.setFontSize(18);
    pdf.text("INVOICE", 105, 15, { align: "center" });

    pdf.setFontSize(11);
    pdf.text(`Order ID: ${orderDetails.orderId}`, 12, 30);
    pdf.text(`Customer: ${orderDetails.customerName}`, 12, 38);
    pdf.text(`Phone: ${orderDetails.phoneNumber || "-"}`, 12, 46);
    pdf.text(`Payment: ${orderDetails.paymentMethod}`, 12, 54);

    pdf.text("Items:", 12, 68);
    let y = 78;

    orderDetails.items.forEach((it) => {
      const sub = Number(it.price) * Number(it.quantity);
      const cgstAmt = (sub * Number(it.cgstRate)) / 100;
      const sgstAmt = (sub * Number(it.sgstRate)) / 100;

      const line = `${it.name} x${it.quantity} - ₹${sub.toFixed(
        2
      )} (CGST ₹${cgstAmt.toFixed(2)}, SGST ₹${sgstAmt.toFixed(2)})`;

      pdf.text(line, 12, y);
      y += 8;

      if (y > 265) {
        pdf.addPage();
        y = 20;
      }
    });

    y += 8;
    pdf.text(`Subtotal: ₹${orderDetails.subtotal.toFixed(2)}`, 12, y);
    y += 8;
    pdf.text(`CGST Total: ₹${orderDetails.cgstTotal.toFixed(2)}`, 12, y);
    y += 8;
    pdf.text(`SGST Total: ₹${orderDetails.sgstTotal.toFixed(2)}`, 12, y);
    y += 8;
    pdf.text(`Total GST: ₹${orderDetails.totalGST.toFixed(2)}`, 12, y);
    y += 8;
    pdf.text(`Grand Total: ₹${orderDetails.grandTotal.toFixed(2)}`, 12, y);

    return pdf;
  };

  const sendSMSWithInvoice = async () => {
    if (!orderDetails?.phoneNumber) {
      toast.error("Customer phone number missing!");
      return;
    }

    setSending(true);

    try {
      const pdf = generatePDF();
      const pdfBlob = pdf.output("blob");

      const formData = new FormData();
      formData.append("file", pdfBlob, `invoice_${orderDetails.orderId}.pdf`);

      const upload = await axios.post("https://tmpfiles.org/api/v1/upload", formData);
      const fileUrl = upload.data?.data?.url;

      const message =
        buildSMSText(orderDetails) +
        (fileUrl ? `\nDownload Invoice: ${fileUrl}` : "");

      await axios.post(
        "http://localhost:8080/admin/sms/send",
        { phone: orderDetails.phoneNumber, message },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      toast.success("Invoice sent via SMS!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to send invoice");
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

        <h3 className="text-center mb-3">Order Receipt</h3>

        <p><strong>Order ID:</strong> {orderDetails.orderId}</p>
        <p><strong>Customer:</strong> {orderDetails.customerName}</p>
        <p><strong>Phone:</strong> {orderDetails.phoneNumber}</p>

        <hr />

        <h5 className="mb-3">Items Purchased</h5>

        <div className="cart-items-scrollable">
          {orderDetails.items.map((item, index) => {
            const price = Number(item.price) || 0;
            const qty = Number(item.quantity) || 0;
            const sub = price * qty;

            const cgstAmt = (sub * Number(item.cgstRate)) / 100;
            const sgstAmt = (sub * Number(item.sgstRate)) / 100;

            return (
              <div key={index} className="d-flex flex-column mb-2">
                <div className="d-flex justify-content-between">
                  <span>{item.name} × {qty}</span>
                  <strong>₹{sub.toFixed(2)}</strong>
                </div>

                <small className="text-secondary">
                  CGST {item.cgstRate}% = ₹{cgstAmt.toFixed(2)} · SGST {item.sgstRate}% = ₹{sgstAmt.toFixed(2)}
                </small>
              </div>
            );
          })}
        </div>

        <hr />

        <div className="d-flex justify-content-between">
          <strong>Subtotal:</strong>
          <span>₹{orderDetails.subtotal.toFixed(2)}</span>
        </div>

        <div className="d-flex justify-content-between">
          <strong>CGST Total:</strong>
          <span>₹{orderDetails.cgstTotal.toFixed(2)}</span>
        </div>

        <div className="d-flex justify-content-between">
          <strong>SGST Total:</strong>
          <span>₹{orderDetails.sgstTotal.toFixed(2)}</span>
        </div>

        <div className="d-flex justify-content-between">
          <strong>Total GST:</strong>
          <span>₹{orderDetails.totalGST.toFixed(2)}</span>
        </div>

        <div className="d-flex justify-content-between">
          <strong>Grand Total:</strong>
          <span>₹{orderDetails.grandTotal.toFixed(2)}</span>
        </div>

        <hr />

        <div className="d-flex justify-content-end gap-3 mt-3">
          <button className="btn btn-warning" onClick={onPrint}>Print</button>

          <button className="btn btn-primary" onClick={sendSMSWithInvoice} disabled={sending}>
            {sending ? "Sending..." : "Send Invoice"}
          </button>

          <button className="btn btn-danger" onClick={onClose}>Close</button>
        </div>

      </div>
    </div>
  );
};

export default ReceiptPopup;
