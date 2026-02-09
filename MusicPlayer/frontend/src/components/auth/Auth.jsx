import React from "react";
import "../../css/auth/Login.css";
import { useDispatch, useSelector } from "react-redux";
import { closeAuthModal, openAuthModal } from "../../redux/slices/uiSlice.js";
import { clearError, logout } from "../../redux/slices/authSlice";
import Modal from "../common/Modal.jsx";
import '../../css/common/Modal.css';
import Signup from "../auth/Signup.jsx";
import Login from "../auth/Login.jsx";
import '../../css/auth/Login.css';
import '../../css/auth/Signup.css';

const Auth = () => {
  console.log("--- AUTH COMPONENT IS RENDERING ---"); // <--- Add this line
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { authModalOpen, authMode } = useSelector((state) => state.ui);

  return (
    <div className="auth-container">
      {!isAuthenticated ? (
        <>
          <button
            className="auth-btn signup"
            onClick={() => {
              dispatch(clearError());
              dispatch(openAuthModal("signup"));
            }}
          >
            Signup
          </button>
          <button
            className="auth-btn login"
            onClick={() => {
              dispatch(clearError());
              dispatch(openAuthModal("login"));
            }}
          >
            Login
          </button>
        </>
      ) : (
        <button
          className="auth-btn logout"
          onClick={() => dispatch(logout())}
        >
          Logout
        </button>
      )}

      {authModalOpen && (
        <Modal
          onClose={() => {
            dispatch(closeAuthModal());
            dispatch(clearError());
          }}
        >
          {authMode === "signup" && <Signup />}
          {(authMode === "login" || authMode === "forgot") && <Login />}
        </Modal>
      )}
    </div>
  );
};

export default Auth;
