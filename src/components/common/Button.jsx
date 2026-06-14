import { classNames } from '../../utils/helpers'
import './Button.css'

function Button({ 
  children, 
  variant = 'primary', 
  size = 'medium',
  fullWidth = false,
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  className = '',
  ...props 
}) {
  const buttonClass = classNames(
    'button',
    `button--${variant}`,
    `button--${size}`,
    fullWidth && 'button--full-width',
    loading && 'button--loading',
    className
  )

  return (
    <button 
      className={buttonClass} 
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="button-spinner" />
      ) : (
        <>
          {icon && iconPosition === 'left' && <span className="button-icon">{icon}</span>}
          {children}
          {icon && iconPosition === 'right' && <span className="button-icon">{icon}</span>}
        </>
      )}
    </button>
  )
}

export default Button
