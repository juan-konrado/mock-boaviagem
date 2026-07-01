import { useState, useEffect, type ChangeEvent } from 'react';
import { FiUploadCloud, FiSave, FiLock } from 'react-icons/fi';
import './Settings.css';

export default function Settings() {
    const [activeTab, setActiveTab] = useState<'profile' | 'appearance'>('appearance');

    // Estados do Perfil
    const [companyName, setCompanyName] = useState('Boa Viagem Pub');
    const [cnpj, setCnpj] = useState('00.000.000/0001-00');
    const [password, setPassword] = useState('');
    const [logoUrl, setLogoUrl] = useState('');

    // 🟢 ESTADO DO TEMA (Aparência)
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem('@BoaViagem:theme-color') || 'default';
    });

    // 🟢 EFEITO: Aplica o tema globalmente no HTML
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('@BoaViagem:theme-color', theme);
    }, [theme]);

    function handleLogoUpload(e: ChangeEvent<HTMLInputElement>) {
        if (!e.target.files) return;
        const file = e.target.files[0];
        if (file) {
            setLogoUrl(URL.createObjectURL(file));
        }
    }

    function handleSaveProfile(e: React.FormEvent) {
        e.preventDefault();
        alert('Perfil atualizado com sucesso!');
        // Aqui iria a chamada para a API (api.put('/user/profile', ...))
    }

    // 🟢 DADOS DAS PALETAS (Inspirado na sua imagem)
    const palettes = [
        {
            id: 'default',
            name: 'Original',
            primary: '#3b82f6',
            secondary: '#10b981',
            tags: ['Profissional', 'Equilibrada', 'Confiável']
        },
        {
            id: 'purple',
            name: 'Criativa',
            primary: '#8b5cf6',
            secondary: '#c084fc',
            tags: ['Moderna', 'Criativa', 'Destaque']
        },
        {
            id: 'dark-ocean',
            name: 'Sóbria',
            primary: '#0f172a',
            secondary: '#475569',
            tags: ['Sóbria', 'Clara', 'Elegante']
        },
        // 🟢 Nova Paleta Verde
        {
            id: 'green',
            name: 'Vibrante',
            primary: '#749d3d',
            secondary: '#92c44e',
            tags: ['Orgânica', 'Frescor', 'Dinâmica']
        },
        // 🟢 Nova Paleta Amarelo Gema
        {
            id: 'yellow',
            name: 'Gema',
            primary: '#ff9f1c',
            secondary: '#ffb703',
            tags: ['Quente', 'Acolhedora', 'Energética']
        }
    ];

    return (
        <div className="settings-container">
            <main className="settings-main">

                <header className="settings-header">
                    <h1 className="settings-title">Configurações</h1>
                    <p className="settings-subtitle">Gerencie o perfil da sua empresa e a aparência do sistema.</p>
                </header>

                <div className="settings-tabs">
                    <button className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>Perfil da Empresa</button>
                    <button className={`tab-btn ${activeTab === 'appearance' ? 'active' : ''}`} onClick={() => setActiveTab('appearance')} >Aparência</button>
                </div>

                {/* 🟢 ABA 1: APARÊNCIA E PALETAS */}
                {activeTab === 'appearance' && (
                    <div className="settings-panel">
                        <h2 className="panel-section-title">Paletas de Cores</h2>
                        <p style={{ color: 'var(--text-secondary)' }}>
                            Essas paletas definem as cores principais utilizadas em botões, links, destaques e componentes do sistema. A aparência geral será aplicada automaticamente.
                        </p>

                        <div className="palette-grid">
                            {palettes.map(pal => (
                                <div
                                    key={pal.id}
                                    className={`palette-card ${theme === pal.id ? 'active' : ''}`}
                                    onClick={() => setTheme(pal.id)}
                                >
                                    <div className="palette-header">
                                        <div className="color-circles">
                                            <div className="circle" style={{ backgroundColor: pal.primary }}></div>
                                            <div className="circle" style={{ backgroundColor: pal.secondary }}></div>
                                        </div>
                                        <span className="palette-name">Paleta {pal.name}</span>
                                    </div>

                                    {/* O Mini-Dashboard CSS (Magia pura) */}
                                    <div className="mini-dashboard">
                                        <div className="mini-sidebar" style={{ backgroundColor: pal.primary }}></div>
                                        <div className="mini-content">
                                            <div className="mini-header"></div>
                                            <div className="mini-chart"></div>
                                            <div className="mini-row"></div>
                                            <div className="mini-row" style={{ width: '60%' }}></div>
                                        </div>
                                    </div>

                                    <div className="palette-tags">
                                        {pal.tags.map(tag => (
                                            <span key={tag} className="p-tag">• {tag}</span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* 🟢 ABA 2: PERFIL DA EMPRESA */}
                {activeTab === 'profile' && (
                    <div className="settings-panel">
                        <form onSubmit={handleSaveProfile}>

                            <h2 className="panel-section-title">Dados Gerais</h2>

                            <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px', marginBottom: '32px' }}>
                                {/* Upload de Logo */}
                                <div>
                                    <span style={{ display: 'block', marginBottom: '8px', fontWeight: 700, color: 'var(--text-secondary)' }}>Logotipo</span>
                                    <label className="upload-area" style={{ height: '160px' }}>
                                        <input type="file" accept="image/png, image/jpeg" onChange={handleLogoUpload} style={{ display: 'none' }} />
                                        {logoUrl ? (
                                            <img src={logoUrl} alt="Logo" className="upload-preview" style={{ objectFit: 'contain', padding: '8px' }} />
                                        ) : (
                                            <div className="upload-placeholder">
                                                <FiUploadCloud size={32} />
                                                <span style={{ fontSize: '12px' }}>Enviar Logo</span>
                                            </div>
                                        )}
                                    </label>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    <div className="form-group full-width">
                                        <span className="form-label">Nome do Estabelecimento</span>
                                        <input type="text" className="form-input" value={companyName} onChange={(e) => setCompanyName(e.target.value)} required />
                                    </div>
                                    <div className="form-group full-width">
                                        <span className="form-label">CNPJ (Opcional)</span>
                                        <input type="text" className="form-input" value={cnpj} onChange={(e) => setCnpj(e.target.value)} />
                                    </div>
                                </div>
                            </div>

                            <h2 className="panel-section-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <FiLock /> Segurança
                            </h2>

                            <div className="form-group" style={{ maxWidth: '400px', marginBottom: '32px' }}>
                                <span className="form-label">Nova Senha</span>
                                <input type="password" placeholder="Digite para alterar a senha" className="form-input" value={password} onChange={(e) => setPassword(e.target.value)} />
                            </div>

                            <button type="submit" className="btn-primary" style={{ padding: '16px 32px' }}>
                                <FiSave size={20} /> Salvar Alterações
                            </button>
                        </form>
                    </div>
                )}

            </main>
        </div>
    );
}