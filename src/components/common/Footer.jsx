import { Wine, Github, Heart } from 'lucide-react'
import './Footer.css'

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container container">
        <div className="footer-brand">
          <div className="footer-logo">
            <span>Koktelo</span>
          </div>
          <p className="footer-description">
            오늘의 나에게 딱 맞는 칵테일을!
          </p>
        </div>

        <div className="footer-section">
          <h4>탐색</h4>
          <ul>
            <li><a href="/encyclopedia">칵테일 도감</a></li>
            <li><a href="/recommend">칵테일 추천</a></li>
            <li><a href="/favorites">칵테일 즐겨찾기</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>외부 리소스</h4>
          <ul>
            <li><a href="https://aistudio.google.com" target="_blank" rel="noopener noreferrer">Google AI Studio</a></li>
            <li><a href="https://www.thecocktaildb.com" target="_blank" rel="noopener noreferrer">TheCocktailDB</a></li>
            <li><a href="https://www.themealdb.com" target="_blank" rel="noopener noreferrer">TheMealDB</a></li>
          </ul>
        </div>
        <div className="footer-section-name">
          <h4>Frontend Project 06 Team</h4>
          <ul>
            <li><a href="https://namu.wiki/w/%EC%A7%B1%EA%B5%AC%EB%8A%94%20%EB%AA%BB%EB%A7%90%EB%A0%A4" target="_blank" rel="noopener noreferrer">짱구</a></li>
            <li><a target="_blank" rel="noopener noreferrer">Choe</a></li>
            <li><a target="_blank" rel="noopener noreferrer">young</a></li>
          </ul>
        </div>
      </div>
    </footer>
  )
}

export default Footer
