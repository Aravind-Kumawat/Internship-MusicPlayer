import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from "./pages/Homepage.jsx";
import "./App.css";
import { useSelector } from "react-redux";
import { logout } from "./redux/slices/authSlice.js";
import { setError, setLoading, setUser, clearError } from "./redux/slices/authSlice.js";
import { useDispatch } from "react-redux";
import axios from "axios";
import ResetPassword from "./components/auth/ResetPassword.jsx";
function App() {
  const dispatch = useDispatch();
  const { token,user} = useSelector((state) => state.auth);

  useEffect(() => {
   const storedToken = token ||  localStorage.getItem('token') ;
   if(!storedToken || user) return;

   const fetchUser = async () => {
    try{
      dispatch(setLoading(true));
      dispatch(clearError());

      const res= await axios.get("http://localhost:8001/api/auth/get-me", {
        headers : {
          Authorization : `Bearer ${storedToken}`
        },
      });

      const data = res.data || {};
      dispatch(setUser({ user:data , token: storedToken }));
    } catch (error) {
      console.log("getMe Failed",error);
      dispatch(logout());
      dispatch(setError(error.response?.data?.message || 'Failed to fetch user data'));
    } finally {
      dispatch(setLoading(false));
    }
   };

   fetchUser();
  }, [dispatch, token,user ]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Home */}
        <Route path="/" element={<Homepage />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
