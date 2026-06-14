import { useEffect } from 'react'
import { X } from 'lucide-react'
import { classNames } from '../../utils/helpers'
import './Modal.css'

function Modal({ 
  isOpen, 
  onClose, 
  title, 
  children,
  size = 'medium',
  className = ''
}) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const modalClass = classNames(
    'modal-content',
    `modal-content--${size}`,
    className
  )

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className={modalClass}
        onClick={e => e.stopPropagation()}
      >
        <div className="modal-header">
          {title && <h2 className="modal-title">{title}</h2>}
          <button className="modal-close" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  )
}

export default Modal
