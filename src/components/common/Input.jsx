import { classNames } from '../../utils/helpers'
import './Input.css'

function Input({
  label,
  error,
  icon,
  fullWidth = false,
  className = '',
  ...props
}) {
  const inputClass = classNames(
    'input-wrapper',
    fullWidth && 'input-wrapper--full-width',
    error && 'input-wrapper--error',
    icon && 'input-wrapper--with-icon',
    className
  )

  return (
    <div className={inputClass}>
      {label && <label className="input-label">{label}</label>}
      <div className="input-container">
        {icon && <span className="input-icon">{icon}</span>}
        <input className="input" {...props} />
      </div>
      {error && <span className="input-error">{error}</span>}
    </div>
  )
}

export default Input
