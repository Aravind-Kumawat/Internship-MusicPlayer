import { useState } from 'react'
import '../../css/auth/ResetPassword.css';
import Input from '../common/input.jsx';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
const ResetPassword = () => {
    const {token} = useParams();
    const navigate = useNavigate(); 
    const [password, setPassword] = useState('');
    const [status, setStatus] = useState(''); // 'success' or 'error'
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const handleReset = async () => {
        if(!password || password.length < 6) {
            setStatus("error");
            setMessage("Password must be at least 6 characters long.");
            return;
        }
        try {
            setLoading(true);
            setStatus("info");
            setMessage("Resetting Password...");
             await axios.post(`http://localhost:8001/api/auth/reset-password/${token}`, {
                password
            });
            setStatus("success");
            setMessage("Password reset successful! Redirecting...");
            setTimeout(() => {
                navigate('/'); // Redirect to homepage or login page after successful reset
            }, 2000);
        } catch (error) {
            setStatus("error");
            setMessage(error.response?.data?.message || "Failed to reset password.");
        } finally {
            setLoading(false);
        }
    };
    return (
    <div className='reset-wrapper'>
        <h3 className='reset-title'>Reset Password</h3>
        <p className='reset-subtitle'>Please enter your new password to regain access</p>
        <div className='reset-form'>
            <Input
                label="New Password"
                type="password"
                placeholder={"Enter new Password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            {status === "error" && <div className='reset-error'>{message}</div>}
            {status === "success" && <div className='reset-success'>{message}</div>}

            <button className='reset-submit-btn' onClick={handleReset} disabled={loading}><span>{loading ? "Resetting..." : "Reset Password"}</span></button>
        </div>


    </div>
  )
}

export default ResetPassword