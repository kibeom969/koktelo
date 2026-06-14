import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, Wine } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import Input from '../components/common/Input'
import Button from '../components/common/Button'
import { validateEmail } from '../utils/helpers'
import './Auth.css'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState('')
  
  const { login } = useAuth()
  const navigate = useNavigate()

  const validate = () => {
    const newErrors = {}
    
    if (!email) {
      newErrors.email = '이메일을 입력해주세요'
    } else if (!validateEmail(email)) {
      newErrors.email = '유효하지 않은 이메일 형식입니다'
    }
    
    if (!password) {
      newErrors.password = '비밀번호를 입력해주세요'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setServerError('')
    
    if (!validate()) return
    
    setLoading(true)
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const result = login(email, password)
    
    if (result.success) {
      navigate('/')
    } else {
      setServerError(result.error)
    }
    
    setLoading(false)
  }


  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <div className="auth-logo">
            <Wine size={40} className="auth-logo-icon" />
          </div>
          <h1 className="auth-title">다시 오신 것을 환영합니다</h1>
          <p className="auth-subtitle">Koktelo 계정에 로그인하세요</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
         
          {serverError && (
            <div className="auth-error-banner">
              {'serverError'}
            </div>
          )}

          <Input
            label="이메일"
            type="email"
            placeholder="이메일을 입력하세요"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
            icon={<Mail size={18} />}
            fullWidth
          />

          <Input
            label="비밀번호"
            type="password"
            placeholder="비밀번호를 입력하세요"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
            icon={<Lock size={18} />}
            fullWidth
          />

          <Button 
            type="submit" 
            fullWidth 
            size="large"
            loading={loading}
          >
            로그인
          </Button>
        </form>

        <div className="auth-footer">
          <p>
            {"계정이 없으신가요? "}
            <Link to="/signup" className="auth-link">회원가입</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
