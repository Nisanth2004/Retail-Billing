import { createContext, useEffect, useState } from "react";
import { fetchCategories } from "../Service/CategoryService";
import { fetchItems } from "../Service/ItemService";
import { toast } from "react-hot-toast";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import stringSimilarity from "string-similarity";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [auth, setAuth] = useState({ token: null, role: null });
  const [itemsData, setItemsData] = useState([]);
  const [cartItems, setCartItems] = useState([]);

  // -----------------------------
  // Cart Functions
  // -----------------------------
  const addToCart = (item) => {
    const existingItem = cartItems.find(
      (cartItem) => cartItem.itemId === item.itemId
    );

    if (existingItem) {
      setCartItems(
        cartItems.map((cartItem) =>
          cartItem.itemId === item.itemId
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      );
    } else {
      setCartItems([...cartItems, { ...item, quantity: 1 }]);
    }
  };

  const removeFromCart = (itemId) => {
    setCartItems(cartItems.filter((item) => item.itemId !== itemId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const updateQuantity = (itemId, newQuantity) => {
    setCartItems(
      cartItems.map((item) =>
        item.itemId === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // -----------------------------
  // Initial Data Loading
  // -----------------------------
  useEffect(() => {
    async function loadData() {
      try {
        if (localStorage.getItem("token") && localStorage.getItem("role")) {
          setAuthData(
            localStorage.getItem("token"),
            localStorage.getItem("role")
          );
        }

        const response = await fetchCategories();
        const itemResponse = await fetchItems();

        setCategories(response.data);
        setItemsData(itemResponse.data);
      } catch (err) {
        console.error("Error fetching categories or items:", err);
      }
    }

    loadData();
  }, []);


  // -----------------------------
  // Voice Recognition Integration (Improved with Fuzzy Matching)
  // -----------------------------
  const { transcript, listening, resetTranscript } = useSpeechRecognition();

  const aliasMap = {
    "life by": "lifebuoy",
    "coco cola": "coca cola",
    "thumbs up": "thums up",
  };

  useEffect(() => {
    if (transcript) {
      const spokenWord = transcript.toLowerCase().trim();
      console.log("🎤 Voice detected:", spokenWord);

      const normalizedWord = aliasMap[spokenWord] || spokenWord;

      let matchedItem = itemsData.find(
        (it) => it.name.toLowerCase() === normalizedWord
      );

      if (!matchedItem) {
        const productNames = itemsData.map((it) => it.name.toLowerCase());
        const match = stringSimilarity.findBestMatch(
          normalizedWord,
          productNames
        );

        if (match.bestMatch.rating > 0.7) {
          matchedItem = itemsData.find(
            (it) => it.name.toLowerCase() === match.bestMatch.target
          );
        } else if (match.bestMatch.rating > 0.5) {
          const possibleItem = itemsData.find(
            (it) => it.name.toLowerCase() === match.bestMatch.target
          );
          toast((t) => (
            <span>
              🎤 Did you mean <b>{possibleItem.name}</b>?
              <button
                style={{ marginLeft: "10px", color: "green" }}
                onClick={() => {
                  addToCart(possibleItem);
                  toast.dismiss(t.id);
                }}
              >
                ✅ Yes
              </button>
              <button
                style={{ marginLeft: "5px", color: "red" }}
                onClick={() => toast.dismiss(t.id)}
              >
                ❌ No
              </button>
            </span>
          ));
        }
      }

      if (matchedItem) {
        toast.success(`🎤 Voice added: ${matchedItem.name}`);
        addToCart(matchedItem);
        resetTranscript();
      }
    }
  }, [transcript, itemsData]);

  const startListening = () =>
    SpeechRecognition.startListening({ continuous: true });
  const stopListening = () => SpeechRecognition.stopListening();

  // -----------------------------
  // Auth
  // -----------------------------
  const setAuthData = (token, role) => {
    setAuth({ token, role });
  };

  // -----------------------------
  // Context Value
  // -----------------------------
  const contextvalue = {
    categories,
    setCategories,
    auth,
    setAuthData,
    itemsData,
    setItemsData,
    addToCart,
    cartItems,
    removeFromCart,
    updateQuantity,
    clearCart,
    // voice control
    transcript,
    listening,
    startListening,
    stopListening,
  };

  return (
    <AppContext.Provider value={contextvalue}>
      {children}
    </AppContext.Provider>
  );
};
