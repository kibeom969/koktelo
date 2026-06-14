import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, User, Wine } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import Input from '../components/common/Input'
import Button from '../components/common/Button'
import { validateEmail, validatePassword } from '../utils/helpers'
import './Auth.css'

function Signup() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState('')
  
  const { signup } = useAuth()
  const navigate = useNavigate()

  const validate = () => {
    const newErrors = {}
    
    if (!name) {
      newErrors.name = '이름을 입력해주세요'
    } else if (name.length < 2) {
      newErrors.name = '이름은 최소 2자 이상이어야 합니다'
    }
    
    if (!email) {
      newErrors.email = '이메일을 입력해주세요'
    } else if (!validateEmail(email)) {
      newErrors.email = '유효하지 않은 이메일 형식입니다'
    }
    
    if (!password) {
      newErrors.password = '비밀번호를 입력해주세요'
    } else if (!validatePassword(password)) {
      newErrors.password = '비밀번호는 최소 6자 이상이어야 합니다'
    }
    
    if (!confirmPassword) {
      newErrors.confirmPassword = '비밀번호를 다시 입력해주세요'
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다'
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
    
    const result = signup(email, password, name)
    
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
          <h1 className="auth-title">계정 만들기</h1>
          <p className="auth-subtitle">Koktelo에 가입하고 다양한 칵테일을 만나보세요</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {serverError && (
            <div className="auth-error-banner">
              {serverError}
            </div>
          )}

          <Input
            label="이름"
            type="text"
            placeholder="이름을 입력하세요"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={errors.name}
            icon={<User size={18} />}
            fullWidth
          />

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

          <Input
            label="비밀번호 확인"
            type="password"
            placeholder="비밀번호를 다시 입력하세요"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={errors.confirmPassword}
            icon={<Lock size={18} />}
            fullWidth
          />

          <Button 
            type="submit" 
            fullWidth 
            size="large"
            loading={loading}
          >
            계정 만들기
          </Button>
        </form>

        <div className="auth-footer">
          <p>
            {"이미 계정이 있으신가요? "}
            <Link to="/login" className="auth-link">로그인</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Signup
