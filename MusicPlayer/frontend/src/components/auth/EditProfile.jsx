import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { setUser } from "../../redux/slices/authSlice";
import Input from "../common/input";
import "../../css/auth/Login.css"; // Reuse login styles

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

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
    setError("");

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      if (currentPassword) formData.append("currentPassword", currentPassword);
      if (newPassword) formData.append("newPassword", newPassword);
      if (avatar) formData.append("avatar", avatar);

      // Note: Backend expects JSON usually, but if sending file (avatar), use FormData.
      // However, previous code (authControllers.js) used req.body directly for fields.
      // If using imagekit in frontend or backend?
      // authController.js: const { name, email, avatar, ... } = req.body.
      // And: if (avatar) { const uploadResponse = await imageKit.upload({ file: avatar ... }) }
      // This implies 'avatar' in body is a base64 string or binary? 
      // ImageKit SDK usually takes base64 or buffer.
      // Let's assume we need to handle file reading here if we want to upload.
      // For now, let's stick to JSON and assume avatar is handled elsewhere or ignored if complex.
      // Wait, let's look at signup in authController.
      // It uses `req.body.avatar`. So it expects base64 string or similar if coming from JSON.
      
      // Let's implement simple JSON update first.
      
      const payload = {
        name,
        email,
        currentPassword,
        newPassword
      };
      
      // If we want to support avatar, we need to convert file to base64
      if (avatar) {
          const reader = new FileReader();
          reader.readAsDataURL(avatar);
          reader.onloadend = async () => {
              payload.avatar = reader.result;
              await sendRequest(payload);
          }
      } else {
          await sendRequest(payload);
      }

    } catch (err) {
      console.error(err);
      setError("Failed to update profile");
      setIsLoading(false);
    }
  };

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
  }

  const handleFileChange = (e) => {
      if(e.target.files[0]) {
          setAvatar(e.target.files[0]);
      }
  }

  return (
    <div className="login-wrapper" style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", zIndex: 1000, background: "#121212", padding: "30px", borderRadius: "10px", border: "1px solid #333", width: "400px", boxShadow: "0 0 20px rgba(0,0,0,0.5)" }}>
      <h3 className="login-title">Edit Profile</h3>
      
      <form className="login-form" onSubmit={handleUpdate}>
        <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} type="text" />
        <Input label="Email" value={email} onChange={(e) => setEmail(e.target.value)} type="email" />
        
        <div style={{display: 'flex', flexDirection: 'column', gap: '5px'}}>
            <label style={{color: '#b3b3b3', fontSize: '14px'}}>Avatar</label>
            <input type="file" onChange={handleFileChange} style={{color: 'white'}} />
        </div>

        <Input label="Current Password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} type="password" placeholder="Required to save changes" />
        <Input label="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} type="password" placeholder="Leave blank to keep current" />

        {error && <div className="login-error">{error}</div>}
        {message && <div style={{ color: "green", textAlign: "center" }}>{message}</div>}

        <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
          <button type="submit" className="login-submit-btn" disabled={isLoading} style={{ flex: 1 }}>
            {isLoading ? "Saving..." : "Save"}
          </button>
          <button type="button" onClick={onClose} className="login-submit-btn" style={{ flex: 1, background: "transparent", border: "1px solid #555" }}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;