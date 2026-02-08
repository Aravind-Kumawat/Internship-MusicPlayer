import { useState } from 'react';
import Input from '../common/input.jsx';
import { CiUser } from 'react-icons/ci';
import { AiOutlineCamera } from 'react-icons/ai';
import { useDispatch, useSelector } from 'react-redux';
import { closeAuthModal, switchAuthMode } from '../../redux/slices/uiSlice.js';
import { setError, setLoading, setUser, clearError } from '../../redux/slices/authSlice.js';
import axios from 'axios';
import '../../css/auth/Signup.css';

const Signup = () => {
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state) => state.auth);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [previewImage, setPreviewImage] = useState('');
  const [base64Image, setBase64Image] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setPreviewImage(reader.result);
      setBase64Image(reader.result);
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearError());

    if (!fullName || !email || !password) {
      dispatch(setError("Please fill all the fields"));
      return;
    }

    dispatch(setLoading(true));

    try {
      const res = await axios.post("http://localhost:8001/api/auth/signup", {
        name: fullName,
        email,
        password,
        avatar: base64Image ? base64Image : undefined,
      });

      const data = res.data || {};
      dispatch(setUser({ user: data.user, token: data.token }));
      localStorage.setItem('token', data.token);
      dispatch(closeAuthModal());
      console.log("Signup successful");

    } catch (error) {
      const serverErrorMessage = error.response?.data?.message || 'An error occurred during signup';
      dispatch(setError(serverErrorMessage));
    }
  };

  return (
    <div className='signup-wrapper'>
      <h3 className='signup-title'>Create an Account</h3>
      <p className='signup-subtitle'>Join us today by entering the details</p>
      <form className='signup-form' onSubmit={handleSubmit}>
        
        {/* Avatar upload section */}
        <div className='profile-image-container'>
          {previewImage ? (
            <img src={previewImage} alt="avatar" className='profile-image' />
          ) : (
            <div className='profile-placeholder'>
              <CiUser size={40} />
            </div>
          )}
          <label className='image-upload-icon'>
            <AiOutlineCamera size={20} />
            <input type="file" accept="image/*" hidden onChange={handleImageChange} />
          </label>
        </div>

        {/* Input fields */}
        <Input
          label="Name"
          placeholder="Enter Your Name"
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
        <Input
          label="Email"
          placeholder="Enter Your Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          label="Password"
          placeholder="Enter Your Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <span
          className='forgot-link'
          onClick={() => {
            dispatch(clearError());
            dispatch(switchAuthMode("login"));
          }}
        >
          Do you already have an account?
        </span>

        {error && <div className='signup-error'>{error}</div>}

        <div className='signup-actions'>
          <button className='signup-btn-submit' type='submit' disabled={isLoading}>
            <span>{isLoading ? "Signing In" : "SignUp"}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default Signup;
