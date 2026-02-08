import React from 'react'

const Modal = ({children, onClose}) => {
  return (
    <div className='modal-backdrop' onClick={onClose} role='dialog' aria-modal='true'>
      <div className='modal-content' onClick={(e) => e.stopPropagation()} style={{position: "relative"}}>
        <button className='modal-close' onClick={onClose}>X</button>
        {children}
      </div>
    </div>
  )
}

export default Modal