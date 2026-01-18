import React, { createContext, useContext, useEffect, useState } from 'react'
import { authDataContext } from './AuthContext'
import axios from 'axios'
import { userDataContext } from './UserContext'
import { toast } from 'react-toastify'

export const shopDataContext = createContext(null);

function ShopContext({ children }) {
  const [products, setProducts] = useState([])
  const [search, setSearch] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const [cartItem, setCartItem] = useState({});
  const [loading, setLoading] = useState(false)
  
  const { userData } = useContext(userDataContext);
  const { serverUrl } = useContext(authDataContext);

  const currency = '₹';
  const delivery_fee = 40;

  const getProducts = async () => {
    if (!serverUrl) return;
    try {
      const result = await axios.get(serverUrl + "/api/product/list")
      setProducts(result.data)
    } catch (error) {
      console.log(error)
      toast.error("Failed to load products")
    }
  }

  const addtoCart = async (itemId, size) => {
    if (!size) {
      toast.error("Select Product Size");
      return;
    }

    // Safer clone method than structuredClone
    let cartData = JSON.parse(JSON.stringify(cartItem));

    if (cartData[itemId]) {
      if (cartData[itemId][size]) {
        cartData[itemId][size] += 1;
      } else {
        cartData[itemId][size] = 1;
      }
    } else {
      cartData[itemId] = {};
      cartData[itemId][size] = 1;
    }

    setCartItem(cartData);

    if (userData) {
      setLoading(true)
      try {
        const token = localStorage.getItem('token'); // Use token header
        await axios.post(serverUrl + "/api/cart/add", 
          { itemId, size }, 
          { headers: { token }, withCredentials: true }
        )
        toast.success("Product Added")
      } catch (error) {
        console.log(error)
        toast.error("Add Cart Error")
      } finally {
        setLoading(false)
      }
    }
  }

  const getUserCart = async () => {
    if (!userData || !serverUrl) return; // Only fetch if user exists
    try {
      const token = localStorage.getItem('token');
      const result = await axios.post(serverUrl + '/api/cart/get', {}, { headers: { token }, withCredentials: true })
      setCartItem(result.data)
    } catch (error) {
      console.log(error)
    }
  }

  const updateQuantity = async (itemId, size, quantity) => {
    let cartData = JSON.parse(JSON.stringify(cartItem));
    cartData[itemId][size] = quantity
    setCartItem(cartData)

    if (userData) {
      try {
        const token = localStorage.getItem('token');
        await axios.post(serverUrl + "/api/cart/update", { itemId, size, quantity }, { headers: { token }, withCredentials: true })
      } catch (error) {
        console.log(error)
      }
    }
  }

  const getCartCount = () => {
    let totalCount = 0;
    for (const items in cartItem) {
      for (const item in cartItem[items]) {
        try {
          if (cartItem[items][item] > 0) {
            totalCount += cartItem[items][item]
          }
        } catch (error) {}
      }
    }
    return totalCount
  }

  const getCartAmount = () => {
    let totalAmount = 0;
    for (const items in cartItem) {
      let itemInfo = products.find((product) => product._id === items);
      if (itemInfo) { // Check if product exists
        for (const item in cartItem[items]) {
          try {
            if (cartItem[items][item] > 0) {
              totalAmount += itemInfo.price * cartItem[items][item];
            }
          } catch (error) {}
        }
      }
    }
    return totalAmount
  }

  useEffect(() => {
    getProducts()
  }, [serverUrl]) 

  useEffect(() => {
    getUserCart()
  }, [userData]) 

  const value = {
    products, currency, delivery_fee, getProducts, search, setSearch, showSearch, setShowSearch, cartItem, addtoCart, getCartCount, setCartItem, updateQuantity, getCartAmount, loading
  }

  return (
    <shopDataContext.Provider value={value}>
      {children}
    </shopDataContext.Provider>
  )
}

export default ShopContext