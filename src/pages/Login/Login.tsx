import { useState, type FormEvent, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import './Login.css';

// ==========================================
// ÍCONES SVGS (Para o painel esquerdo)
// ==========================================
const WineSVG = ({ className = "w-12 h-12" }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ width: '100%', height: '100%' }}>
        <path d="M8 22h8" /><path d="M12 15v7" /><path d="M12 15a7.5 7.5 0 0 0 7.5-7.5V3a1 1 0 0 0-1-1H5.5a1 1 0 0 0-1 1v4.5A7.5 7.5 0 0 0 12 15z" /><path d="M5.5 8h13" />
    </svg>
);

const BeerSVG = ({ className = "w-12 h-12" }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ width: '100%', height: '100%' }}>
        <path d="M17 11h1a3 3 0 0 1 0 6h-1" /><path d="M9 12v6" /><path d="M13 12v6" />
        <path d="M14 7.5c-1 0-1.44.5-3 .5s-2-.5-3-.5-1.72.5-2.5.5a2.5 2.5 0 0 1 5-2.5 2.5 2.5 0 0 1 5 2.5c-.78 0-1.5-.5-2.5-.5Z" />
        <path d="M5 8v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V8" />
    </svg>
);

const BurgerSVG = ({ className = "w-12 h-12" }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ width: '100%', height: '100%' }}>
        <path d="M20 14.5c0-.83-.67-1.5-1.5-1.5h-13C4.67 13 4 13.67 4 14.5v1.5c0 .83.67 1.5 1.5 1.5h13c.83 0 1.5-.67 1.5-1.5v-1.5z" />
        <path d="M4 11h16" />
        <path d="M12 3a7 7 0 0 0-7 7h14a7 7 0 0 0-7-7z" />
    </svg>
);

const CoffeeSVG = ({ className = "w-12 h-12" }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ width: '100%', height: '100%' }}>
        <path d="M17 8h1a4 4 0 1 1 0 8h-1" /><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
        <line x1="6" y1="2" x2="6" y2="4" /><line x1="10" y1="2" x2="10" y2="4" /><line x1="14" y1="2" x2="14" y2="4" />
    </svg>
);

const StoreSVG = ({ className = "w-12 h-12" }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ width: '100%', height: '100%' }}>
        <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7" /><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" /><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4" /><path d="M2 7h20" />
        <path d="M22 7v3a2 2 0 0 1-2 2v0a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12v0a2 2 0 0 1-2-2V7" />
    </svg>
);

// ==========================================
// COMPONENTE PRINCIPAL
// ==========================================
export default function SignIn() {
    const { signIn } = useContext(AuthContext);
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleLogin(event: FormEvent) {
        event.preventDefault();

        if (email === '' || password === '') {
            alert('Preencha todos os campos!');
            return;
        }

        setLoading(true);

        try {
            await signIn({ email, password });
            navigate('/balcao');
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    }

    return (
        <div className="signin-layout">
            
            {/* LADO ESQUERDO: Branding e Ilustração */}
            <div className="signin-illustration-side">
                
                {/* 🟢 A CURVATURA MÁGICA EM SVG */}
                <svg className="magic-curve" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <path d="M0,0 C 0,40 100,60 100,100 L0,100 Z" fill="currentColor" />
                </svg>

                <div className="brand-header">
                    <div className="brand-logo-box">BV</div>
                    <span className="brand-name">Boa Viagem <span>Pub</span></span>
                </div>

                <div className="illustration-blob">
                    <div className="floating-item item-1" style={{ width: '48px', height: '48px' }}><BurgerSVG /></div>
                    <div className="floating-item item-2" style={{ width: '40px', height: '40px' }}><WineSVG /></div>
                    <div className="floating-item item-3" style={{ width: '44px', height: '44px' }}><BeerSVG /></div>
                    <div className="floating-item item-4" style={{ width: '36px', height: '36px' }}><CoffeeSVG /></div>
                    
                    <div className="item-center">
                        <StoreSVG />
                    </div>
                </div>
            </div>

            {/* LADO DIREITO: Formulário */}
            <div className="signin-form-side">
                <div className="signin-form-wrapper">
                    
                    <h1 className="form-title">Login</h1>

                    <form onSubmit={handleLogin} className="login-form">
                        
                        <div className="input-group">
                            <label className="input-label">E-mail</label>
                            <input
                                type="email"
                                placeholder="Digite seu e-mail"
                                className="login-input"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="input-group">
                            <label className="input-label">Senha</label>
                            <input
                                type="password"
                                placeholder="Sua senha secreta"
                                className="login-input"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <Link to="#" className="forgot-password">
                            Esqueceu a senha?
                        </Link>

                        <button type="submit" className="btn-login" disabled={loading}>
                            {loading ? 'Validando...' : 'Acessar Painel'}
                        </button>

                    </form>

                    <p className="register-link">
                        Ainda não possui conta? <Link to="#">Registre-se Agora</Link>
                    </p>

                </div>

                <Link to="#" className="terms-footer">Termos e Serviços</Link>
            </div>
            
        </div>
    );
}