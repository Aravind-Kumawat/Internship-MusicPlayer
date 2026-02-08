import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import validator from 'validator';
import { setError, clearError, setLoading, setUser } from '../../redux/slices/authSlice.js';
import Input from '../common/input.jsx';
import axios from 'axios';
import '../../css/auth/Login.css';
import { switchAuthMode } from '../../redux/slices/uiSlice.js';

const Login = () => {
  // Login State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Forgot Password State
  const [resetEmail, setResetEmail] = useState(''); // Renamed for clarity
  const [statusMsg, setStatusMsg] = useState(''); // Separate message state

  // Redux
  const authMode = useSelector((state) => state.ui.authMode); // Ensure you access the specific property
  const { isLoading, error } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  // Helper to check current mode
  const isForgot = authMode === "forgot";

  const handleLogin = async (e) => {
    e.preventDefault();
    dispatch(clearError());

    if (!validator.isEmail(email)) {
      dispatch(setError('Please enter a valid email address'));
      return;
    }

    if (!password) {
      dispatch(setError('Please enter your password'));
      return;
    }

    dispatch(setLoading(true));
    try {
      const res = await axios.post("http://localhost:8001/api/auth/login", {
        email,
        password,
      });

      const data = res.data || {};
      dispatch(setUser({ user: data.user, token: data.token }));
      localStorage.setItem('token', data.token);
      
      // No need to console log, state change will redirect or update UI
    } catch (err) {
      const serverErrorMessage = err.response?.data?.message || 'An error occurred during login';
      dispatch(setError(serverErrorMessage));
    } finally {
        dispatch(setLoading(false));
    }
  };

  const handleForgotPassword = async (e) => {
    // Prevent form submission refreshing page
    if(e) e.preventDefault();
    
    dispatch(clearError());
    setStatusMsg("");

    if (!resetEmail || !validator.isEmail(resetEmail)) {
      setStatusMsg("Please enter a valid email address.");
      return;
    }

    try {
      setStatusMsg("Sending reset link..."); // Set message, NOT the email state
      
      await axios.post("http://localhost:8001/api/auth/forgot-password", {
        email: resetEmail,
      });

      setStatusMsg("If an account exists, a reset link has been sent to your email.");
    }
    catch (error) {
      console.log("Forgot Password Error", error);
      setStatusMsg(error.response?.data?.message || "Failed to send reset link");
    }
  }

  return (
    <div className='login-wrapper'>
      {/* 1. Dynamic Title */}
      <h3 className='login-title'>
        {isForgot ? "Reset Password" : "Welcome Back"}
      </h3>
      
      <p className='login-subtitle'>
        {isForgot 
          ? "Enter your email to receive a recovery link" 
          : "Please enter your credentials to login"}
      </p>

      {/* 2. Main Form Area */}
      <form className='login-form' onSubmit={isForgot ? handleForgotPassword : handleLogin}>
        
        {/* LOGIN MODE INPUTS */}
        {!isForgot && (
          <>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              label="Email"
              placeholder="jhondoe@gmail.com"
              type="email"
            />
            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              label="Password"
              placeholder="Minimum 8 characters"
              type="password"
            />
            
            {/* Login Error Display */}
            {error && <div className='login-error'>{error}</div>}

            {/* Login Buttons & Links */}
            <div className="forgot-wrapper">
              <span 
                className="forgot-link" // Fixed typo here
                onClick={() => {
                  dispatch(clearError());
                  dispatch(switchAuthMode("forgot"));
                }}
              >
                Forgot Password?
              </span>
              
              <span 
                className='forgot-link' 
                onClick={() => {
                  dispatch(clearError());
                  dispatch(switchAuthMode("signup"));
                }}
              >
                Don't have an account? Sign up
              </span>
            </div>

            <button type="submit" className='login-submit-btn' disabled={isLoading}>
              {isLoading ? "Loading..." : "Login"}
            </button>
          </>
        )}

        {/* FORGOT PASSWORD MODE INPUTS */}
        {isForgot && (
          <div className='forgot-box'>
            <Input 
                label="Email Address" 
                placeholder="Enter your registered email" 
                value={resetEmail} 
                onChange={(e) => setResetEmail(e.target.value)} 
                type="email" 
            />
            
            {/* Specific Status Message for Forgot Password */}
            {statusMsg && (
                <p className={`forgot-msg ${statusMsg.includes("sent") ? "text-green-400" : "text-red-300"}`}>
                    {statusMsg}
                </p>
            )}

            <button 
                type="button" // Important: button type, not submit, to prevent form conflict
                className='forgot-btn' 
                onClick={handleForgotPassword}
            >
              Send Reset Link
            </button>

            {/* Back to Login Link */}
            <p 
                className="forgot-link" 
                style={{marginTop: '15px', textAlign: 'center'}}
                onClick={() => {
                    dispatch(clearError());
                    setStatusMsg("");
                    dispatch(switchAuthMode("login"));
                }}
            >
              Back to Login
            </p>
          </div>
        )}
      </form>
    </div>
  );
};

export default Login;