import { useState, useEffect } from 'react';
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
      const token = data.user_token; // backend returns 'user_token'
      dispatch(setUser({ user: data.user, token }));
      localStorage.setItem('token', token);
      
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

// Merge: Add EditProfile component here (same code, no UI changes)
const EditProfile = ({ onClose }) => {
  const { user, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
    }
  }, [user]);

  const sendRequest = async (payload) => {
    try {
      const res = await axios.patch("http://localhost:8001/api/auth/profile", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      dispatch(setUser({ user: res.data.user, token }));
      setMessage("Profile updated successfully!");
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Update failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
    setError("");

    try {
      const payload = {
        name,
        email,
        currentPassword,
        newPassword,
      };

      if (avatar) {
        const reader = new FileReader();
        reader.readAsDataURL(avatar);
        reader.onloadend = async () => {
          payload.avatar = reader.result;
          await sendRequest(payload);
        };
      } else {
        await sendRequest(payload);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to update profile");
      setIsLoading(false);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setAvatar(e.target.files[0]);
    }
  };

  return (
    <div
      className="login-wrapper"
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 1000,
        background: "#121212",
        padding: "30px",
        borderRadius: "10px",
        border: "1px solid #333",
        width: "400px",
        boxShadow: "0 0 20px rgba(0,0,0,0.5)",
      }}
    >
      <h3 className="login-title">Edit Profile</h3>

      <form className="login-form" onSubmit={handleUpdate}>
        <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} type="text" />
        <Input label="Email" value={email} onChange={(e) => setEmail(e.target.value)} type="email" />

        <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
          <label style={{ color: "#b3b3b3", fontSize: "14px" }}>Avatar</label>
          <input type="file" onChange={handleFileChange} style={{ color: "white" }} />
        </div>

        <Input
          label="Current Password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          type="password"
          placeholder="Required to save changes"
        />
        <Input
          label="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          type="password"
          placeholder="Leave blank to keep current"
        />

        {error && <div className="login-error">{error}</div>}
        {message && <div style={{ color: "green", textAlign: "center" }}>{message}</div>}

        <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
          <button type="submit" className="login-submit-btn" disabled={isLoading} style={{ flex: 1 }}>
            {isLoading ? "Saving..." : "Save"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="login-submit-btn"
            style={{ flex: 1, background: "transparent", border: "1px solid #555" }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
