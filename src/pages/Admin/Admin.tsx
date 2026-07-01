import { useState, useMemo, type FormEvent } from 'react';
import { FiBriefcase, FiMonitor, FiPieChart, FiList, FiTag, FiPackage, FiCheck, FiX, FiEdit2, FiSearch, FiMessageCircle, FiLock, FiDollarSign, FiClock, FiShield } from 'react-icons/fi';
import './Admin.css';

const AVAILABLE_MODULES = [
    { id: 'balcao', name: 'Frente de Caixa', icon: <FiMonitor /> },
    { id: 'dashboard', name: 'Estatísticas', icon: <FiPieChart /> },
    { id: 'historico', name: 'Histórico', icon: <FiList /> },
    { id: 'produtos', name: 'Catálogo', icon: <FiTag /> },
    { id: 'estoque', name: 'Estoque', icon: <FiPackage /> },
];

type TenantProps = {
    id: string;
    companyName: string;
    cnpj: string;
    whatsapp: string;
    login: string;
    passwordMock: string;
    isActive: boolean;
    modules: string[];
    startDate: string;
    initialPrice: number;
    finalPrice: number;
    promoMonths: number;
};

const INITIAL_TENANTS: TenantProps[] = [
    {
        id: 't1', companyName: 'Boa Viagem Pub', cnpj: '00.000.000/0001-00', whatsapp: '(41) 99999-9999',
        login: 'admin@boaviagem.com', passwordMock: 'Senha123', isActive: true,
        modules: ['balcao', 'dashboard', 'historico', 'produtos', 'estoque'],
        startDate: '2026-01-10', initialPrice: 149.90, finalPrice: 299.90, promoMonths: 10
    },
    {
        id: 't2', companyName: 'Lanchonete Esquina', cnpj: '11.111.111/0001-11', whatsapp: '(41) 98888-8888',
        login: 'maria@esquina.com', passwordMock: 'Lanches2026', isActive: true,
        modules: ['balcao', 'historico', 'produtos'],
        startDate: '2025-05-15', initialPrice: 99.90, finalPrice: 199.90, promoMonths: 10
    },
];

export default function SuperAdmin() {
    const [tenants, setTenants] = useState<TenantProps[]>(INITIAL_TENANTS);
    const [search, setSearch] = useState('');

    const [editingId, setEditingId] = useState<string | null>(null);
    const [companyName, setCompanyName] = useState('');
    const [cnpj, setCnpj] = useState('');
    const [whatsapp, setWhatsapp] = useState('');
    const [login, setLogin] = useState('');
    const [passwordMock, setPasswordMock] = useState('');

    const [initialPrice, setInitialPrice] = useState('149.90');
    const [finalPrice, setFinalPrice] = useState('299.90');
    const [promoMonths, setPromoMonths] = useState('10');
    const [selectedModules, setSelectedModules] = useState<string[]>(['balcao', 'produtos']);

    function handleToggleModule(moduleId: string) {
        if (selectedModules.includes(moduleId)) setSelectedModules(selectedModules.filter(m => m !== moduleId));
        else setSelectedModules([...selectedModules, moduleId]);
    }

    function handleSave(e: FormEvent) {
        e.preventDefault();
        if (selectedModules.length === 0) {
            alert('Libere pelo menos um módulo para este cliente.');
            return;
        }

        const newTenant: TenantProps = {
            id: editingId || Math.random().toString(),
            companyName, cnpj, whatsapp, login, passwordMock,
            isActive: true,
            modules: selectedModules,
            startDate: new Date().toISOString().split('T')[0],
            initialPrice: Number(initialPrice),
            finalPrice: Number(finalPrice),
            promoMonths: Number(promoMonths)
        };

        if (editingId) {
            setTenants(tenants.map(t => t.id === editingId ? { ...newTenant, isActive: t.isActive, startDate: t.startDate } : t));
        } else {
            setTenants([newTenant, ...tenants]);
        }
        resetForm();
    }

    function handleEdit(tenant: TenantProps) {
        setEditingId(tenant.id);
        setCompanyName(tenant.companyName);
        setCnpj(tenant.cnpj);
        setWhatsapp(tenant.whatsapp);
        setLogin(tenant.login);
        setPasswordMock(tenant.passwordMock);
        setInitialPrice(String(tenant.initialPrice));
        setFinalPrice(String(tenant.finalPrice));
        setPromoMonths(String(tenant.promoMonths));
        setSelectedModules(tenant.modules);
    }

    function handleToggleStatus(id: string) {
        setTenants(tenants.map(t => t.id === id ? { ...t, isActive: !t.isActive } : t));
    }

    function resetForm() {
        setEditingId(null);
        setCompanyName(''); setCnpj(''); setWhatsapp(''); setLogin(''); setPasswordMock('');
        setInitialPrice('149.90'); setFinalPrice('299.90'); setPromoMonths('10');
        setSelectedModules(['balcao', 'produtos']);
    }

    const filteredTenants = useMemo(() => {
        return tenants.filter(t => t.companyName.toLowerCase().includes(search.toLowerCase()));
    }, [tenants, search]);

    function getSubscriptionStatus(tenant: TenantProps) {
        const start = new Date(tenant.startDate);
        const today = new Date();

        const monthsPassed = (today.getFullYear() - start.getFullYear()) * 12 + (today.getMonth() - start.getMonth());
        const isInPromo = monthsPassed < tenant.promoMonths;
        const monthsLeft = tenant.promoMonths - monthsPassed;

        return {
            monthsPassed,
            isInPromo,
            monthsLeft,
            currentPrice: isInPromo ? tenant.initialPrice : tenant.finalPrice,
        };
    }

    return (
        <div className="admin-container">
            <main className="admin-main">

                <header className="admin-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div>
                            <h1 className="admin-title">Painel Administrativo SaaS</h1>
                            <p className="admin-subtitle">Gestão central de clientes, assinaturas e faturamento.</p>
                        </div>
                    </div>
                </header>

                <div className="admin-layout-vertical">

                    {/* 🟢 TOP SECTION: FORMULÁRIO DE CADASTRO (COMPACTO) */}
                    <section className="admin-card form-section">
                        <div className="card-header">
                            <FiBriefcase className="card-icon" />
                            <h2>{editingId ? 'Editar Contrato do Cliente' : 'Cadastrar Novo Cliente'}</h2>
                        </div>

                        <form onSubmit={handleSave} className="admin-form">

                            <div className="compact-sections-container">

                                {/* Linha 1: Empresa & Contato */}
                                <div className="compact-row-grid">
                                    <div className="form-group">
                                        <label>Nome do Estabelecimento *</label>
                                        <input type="text" required className="admin-input" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
                                    </div>
                                    <div className="form-group">
                                        <label>CNPJ *</label>
                                        <input type="text" required className="admin-input" value={cnpj} onChange={(e) => setCnpj(e.target.value)} />
                                    </div>
                                    <div className="form-group">
                                        <label>WhatsApp (Contato)</label>
                                        <input type="text" className="admin-input" placeholder="(41) 9..." value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} />
                                    </div>
                                </div>

                                {/* Linha 2: Acesso & Financeiro */}
                                <div className="compact-row-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
                                    <div className="form-group">
                                        <label>Login (Dono) *</label>
                                        <input type="email" required className="admin-input" value={login} onChange={(e) => setLogin(e.target.value)} />
                                    </div>
                                    <div className="form-group">
                                        <label>Senha Provisória *</label>
                                        <input type="text" required className="admin-input" value={passwordMock} onChange={(e) => setPasswordMock(e.target.value)} />
                                    </div>
                                    <div className="form-group">
                                        <label>Promoção (R$) *</label>
                                        <input type="number" step="0.01" required className="admin-input" value={initialPrice} onChange={(e) => setInitialPrice(e.target.value)} />
                                    </div>
                                    <div className="form-group">
                                        <label>Duração (Meses) *</label>
                                        <input type="number" required className="admin-input" value={promoMonths} onChange={(e) => setPromoMonths(e.target.value)} />
                                    </div>
                                    <div className="form-group">
                                        <label>Preço Fixo (R$) *</label>
                                        <input type="number" step="0.01" required className="admin-input" value={finalPrice} onChange={(e) => setFinalPrice(e.target.value)} />
                                    </div>
                                </div>

                            </div>

                            {/* MÓDULOS LIBERADOS */}
                            <div className="modules-compact-bar">
                                <h3 className="inline-label">Módulos Liberados:</h3>
                                <div className="modules-grid-inline">
                                    {AVAILABLE_MODULES.map(module => {
                                        const isSelected = selectedModules.includes(module.id);
                                        return (
                                            <button key={module.id} type="button" className={`module-toggle-btn ${isSelected ? 'selected' : ''}`} onClick={() => handleToggleModule(module.id)}>
                                                {module.icon}
                                                <span>{module.name}</span>
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>

                            <div className="form-actions">
                                {editingId && <button type="button" className="btn-cancel" onClick={resetForm}>Cancelar</button>}
                                <button type="submit" className="admin-button">
                                    {editingId ? 'Salvar Configurações' : 'Finalizar Cadastro'}
                                </button>
                            </div>
                        </form>
                    </section>

                    {/* 🟢 BOTTOM SECTION: LISTA E BUSCA (LADO A LADO) */}
                    <section className="admin-card list-section">
                        <div className="card-header" style={{ borderBottom: 'none', marginBottom: '0' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                                <FiBriefcase className="card-icon" />
                                <h2>Carteira de Clientes</h2>
                                <span className="badge-count">{filteredTenants.length}</span>
                            </div>

                            <div className="search-wrapper" style={{ width: '350px' }}>
                                <FiSearch className="search-icon" />
                                <input type="text" placeholder="Buscar estabelecimento..." value={search} onChange={(e) => setSearch(e.target.value)} className="search-input" />
                            </div>
                        </div>

                        <div className="admin-list-wrapper custom-scrollbar">
                            <div className="admin-list-grid">
                                {filteredTenants.map(tenant => {
                                    const statusPlan = getSubscriptionStatus(tenant);

                                    return (
                                        <div key={tenant.id} className={`admin-list-item ${!tenant.isActive ? 'item-inactive' : ''}`}>

                                            {/* Cabeçalho do Card */}
                                            <div className="tenant-header-row">
                                                <div>
                                                    <h3 className="tenant-name">{tenant.companyName}</h3>
                                                    <div className="tenant-contacts">
                                                        <span><FiBriefcase size={12} /> {tenant.cnpj}</span>
                                                        <span><FiMessageCircle size={12} /> {tenant.whatsapp || 'N/A'}</span>
                                                    </div>
                                                </div>
                                                <div className="tenant-actions">
                                                    <button onClick={() => handleEdit(tenant)} className="btn-icon edit" title="Editar Contrato"><FiEdit2 size={18} /></button>
                                                    <button onClick={() => handleToggleStatus(tenant.id)} className={`btn-status ${tenant.isActive ? 'active' : 'inactive'}`} title={tenant.isActive ? 'Suspender' : 'Reativar'}>
                                                        {tenant.isActive ? <FiX size={16} /> : <FiCheck size={16} />}
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Grid Interno do Card */}
                                            <div className="tenant-details-compact">
                                                <div className="details-box access-box">
                                                    <div className="box-title"><FiLock /> Acesso Master</div>
                                                    <div className="info-line"><span>Login:</span> {tenant.login}</div>
                                                    <div className="info-line"><span>Senha:</span> {tenant.passwordMock}</div>
                                                </div>

                                                <div className={`details-box finance-box ${statusPlan.isInPromo ? 'promo-active' : 'promo-ended'}`}>
                                                    <div className="box-title"><FiDollarSign /> Assinatura</div>
                                                    <div className="current-price">R$ {statusPlan.currentPrice.toFixed(2).replace('.', ',')} <span>/mês</span></div>
                                                    <div className="plan-timeline">
                                                        <FiClock size={12} />
                                                        {statusPlan.isInPromo
                                                            ? `Mês ${statusPlan.monthsPassed}/${tenant.promoMonths} (Vai para R$ ${tenant.finalPrice.toFixed(2).replace('.', ',')})`
                                                            : `Fixo. (Promoção expirada)`
                                                        }
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Módulos (Rodapé do Card) */}
                                            <div className="tenant-modules">
                                                <div className="modules-tag-list">
                                                    {tenant.modules.map(modId => {
                                                        const m = AVAILABLE_MODULES.find(x => x.id === modId);
                                                        return m ? <span key={modId} className="module-tag" title={m.name}>{m.icon}</span> : null;
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </section>

                </div>
            </main>
        </div>
    );
}