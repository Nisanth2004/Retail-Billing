import React, { useContext, useState } from 'react'
import './Explore.css'
import { AppContext } from '../../context/AppContext'
import DisplayCategory from '../../components/DisplayCategory/DisplayCategory';
import DisplayItems from '../../components/DisplayItems/DisplayItems';
import CustomerForm from '../../components/CustomerForm/CustomerForm';
import CartItems from '../../components/CartItems/CartItems';
import CartSummary from '../../components/CartSummary/CartSummary';
import { toast } from "react-hot-toast";

const Explore = () => {
  const { categories, itemsData, addToCart } = useContext(AppContext);

  const [customerName, setCustomerName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [listening, setListening] = useState(false);

  // -----------------------------
  // Voice Recognition Logic
  // -----------------------------
  const handleVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      toast.error("❌ Your browser does not support Speech Recognition.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.start();
    setListening(true);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.toLowerCase();
      console.log("🎤 Heard:", transcript);

      // Match with product names
      const matchedItem = itemsData.find(it => it.name.toLowerCase() === transcript);

      if (matchedItem) {
        toast.success(`✅ Voice matched: ${matchedItem.name}, added to cart!`);
        addToCart(matchedItem);
      } else {
        toast.error(`⚠️ Product not found: ${transcript}`);
      }
    };

    recognition.onerror = (err) => {
      console.error("Speech error:", err);
      toast.error("❌ Voice input error");
    };

    recognition.onend = () => {
      setListening(false);
    };
  };

  return (
    <div className="explore-container text-light">
      <div className="left-column">
        <div className="first-row" style={{overflowY:'auto'}}>
          <DisplayCategory 
            categories={categories} 
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
        </div>

        <hr className="horizontal-line" />

        <div className="second-row" style={{overflowY:'auto'}}>
          <DisplayItems selectedCategory={selectedCategory}/>
        </div>
      </div>

      <div className="right-column d-flex flex-column">
        <div className="customer-form-container" style={{height:'15%'}}>
          <CustomerForm
            customerName={customerName}
            mobileNumber={mobileNumber}
            setMobileNumber={setMobileNumber}
            setCustomerName={setCustomerName}
          />
        </div>

        <hr className='my-3 text-light'/>

        <div className="cart-items-container" style={{height:'50%',overflowY:'auto'}}>
          <CartItems/>
        </div>

        {/* Small Voice Button */}
        <button 
          onClick={handleVoiceInput} 
          className="btn btn-sm btn-warning my-2"
        >
          🎤 {listening ? "Listening..." : "Voice Add"}
        </button>

        <div className="cart-summary-container" style={{height:'30%'}}>
          <CartSummary
            customerName={customerName}
            mobileNumber={mobileNumber}
            setMobileNumber={setMobileNumber}
            setCustomerName={setCustomerName}
          />
        </div>
      </div>
    </div>
  )
}

export default Explore;
