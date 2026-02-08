import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';
import '../../css/auth/Input.css';
import { useState } from 'react'
const Input = ({value, onChange, label, placeholder, type}) => {
  
    const [showPassword, setShowPassword] = useState(false);
    
    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    }

    return (
    <div className='input-wrapper'>
      <label>{label}</label>
      <div className='input-container'>
        <input 
            className='input-field'
            type={type === 'password' ? (showPassword ? 'text' : 'password') : type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
        />
        {type === 'password' && (
            <button className='input-eye-btn'>
                {showPassword ? (<FaRegEye size={22} onClick={toggleShowPassword} />) : (
                    <FaRegEyeSlash size={22} onClick={toggleShowPassword} />)}
            </button>
        )}
      </div>
    </div>
  )
}

export default Input;