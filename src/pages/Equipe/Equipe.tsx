import { useState, useEffect, type FormEvent } from 'react';
import { FiUserPlus, FiUsers, FiLock, FiPercent, FiCheck, FiX, FiEdit2, FiShield } from 'react-icons/fi';
import './Equipe.css';

type Permissions = {
    canDiscount: boolean;
    canCancel: boolean;
};

type StaffProps = {
    id: string;
    name: string;
    role: string;
    pin: string;
    commission: number;
    isActive: boolean;
    permissions: Permissions;
};

// 🟢 MOCK DE DADOS
const INITIAL_STAFF: StaffProps[] = [
    { id: '1', name: 'João Silva', role: 'Garçom', pin: '1234', commission: 10, isActive: true, permissions: { canDiscount: false, canCancel: false } },
    { id: '2', name: 'Maria Souza', role: 'Gerente', pin: '9999', commission: 0, isActive: true, permissions: { canDiscount: true, canCancel: true } },
    { id: '3', name: 'Carlos Oliveira', role: 'Caixa', pin: '5555', commission: 0, isActive: false, permissions: { canDiscount: true, canCancel: false } },
];

export default function Team() {
    const [staffList, setStaffList] = useState<StaffProps[]>(INITIAL_STAFF);

    // Estados do Formulário
    const [editingId, setEditingId] = useState<string | null>(null);
    const [name, setName] = useState('');
    const [role, setRole] = useState('Garçom');
    const [pin, setPin] = useState('');
    const [commission, setCommission] = useState('10');

    // Permissões
    const [canDiscount, setCanDiscount] = useState(false);
    const [canCancel, setCanCancel] = useState(false);

    // 🟢 UX MÁGICA: Muda as permissões padrão dependendo do cargo selecionado
    function handleRoleChange(newRole: string) {
        setRole(newRole);
        if (newRole === 'Gerente') {
            setCanDiscount(true);
            setCanCancel(true);
            setCommission('0');
        } else if (newRole === 'Caixa') {
            setCanDiscount(true);
            setCanCancel(false);
            setCommission('0');
        } else if (newRole === 'Garçom') {
            setCanDiscount(false);
            setCanCancel(false);
            setCommission('10');
        } else {
            // Cozinha
            setCanDiscount(false);
            setCanCancel(false);
            setCommission('0');
        }
    }

    function handleSave(e: FormEvent) {
        e.preventDefault();

        if (pin.length !== 4) {
            alert('O PIN de acesso deve ter exatamente 4 dígitos numéricos.');
            return;
        }

        const newStaff: StaffProps = {
            id: editingId || Math.random().toString(),
            name,
            role,
            pin,
            commission: Number(commission),
            isActive: true, // Sempre cria como ativo
            permissions: { canDiscount, canCancel }
        };

        if (editingId) {
            // Edita mantendo o status de atividade atual
            setStaffList(staffList.map(s => s.id === editingId ? { ...newStaff, isActive: s.isActive } : s));
        } else {
            setStaffList([newStaff, ...staffList]);
        }

        resetForm();
        alert(editingId ? 'Usuário atualizado!' : 'Usuário cadastrado com sucesso!');
    }

    function handleEdit(staff: StaffProps) {
        setEditingId(staff.id);
        setName(staff.name);
        setRole(staff.role);
        setPin(staff.pin);
        setCommission(String(staff.commission));
        setCanDiscount(staff.permissions.canDiscount);
        setCanCancel(staff.permissions.canCancel);
    }

    function handleToggleStatus(id: string) {
        setStaffList(staffList.map(s => s.id === id ? { ...s, isActive: !s.isActive } : s));
    }

    function resetForm() {
        setEditingId(null);
        setName('');
        setRole('Garçom');
        setPin('');
        setCommission('10');
        setCanDiscount(false);
        setCanCancel(false);
    }

    return (
        <div className="team-container">
            <main className="team-main">

                <header className="team-header">
                    <h1 className="team-title">Gestão de Equipe</h1>
                    <p className="team-subtitle">Cadastre funcionários, defina comissões e controle permissões de acesso.</p>
                </header>

                <div className="team-grid">

                    {/* LADO ESQUERDO: FORMULÁRIO */}
                    <section className="team-card form-section">
                        <div className="card-header">
                            <FiUserPlus className="card-icon" />
                            <h2>{editingId ? 'Editar Funcionário' : 'Novo Funcionário'}</h2>
                        </div>

                        <form onSubmit={handleSave} className="team-form">
                            <div className="input-group">
                                <label>Nome Completo</label>
                                <input type="text" required placeholder="Ex: João Silva" className="team-input" value={name} onChange={(e) => setName(e.target.value)} />
                            </div>

                            <div className="input-group">
                                <label>E-mail</label>
                                <input type="text" required placeholder="Ex: joao@gmail.com" className="team-input" value={name} onChange={(e) => setName(e.target.value)} />
                            </div>

                            <div className="input-group">
                                <label>Cargo / Perfil de Acesso</label>
                                <select className="team-input" value={role} onChange={(e) => handleRoleChange(e.target.value)}>
                                    <option value="Garçom">Garçom (App Atendimento)</option>
                                    <option value="Gerente">Gerente (Acesso Total)</option>
                                    <option value="Caixa">Operador de Caixa</option>
                                    <option value="Cozinha">Cozinheiro (Monitor KDS)</option>
                                </select>
                            </div>

                            <div className="form-row">
                                <div className="input-group">
                                    <label>PIN de Acesso (4 números) <FiLock size={14} /></label>
                                    <input type="text" required maxLength={4} pattern="\d{4}" placeholder="Ex: 1234" className="team-input text-center font-mono" value={pin} onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))} />
                                </div>

                                <div className="input-group">
                                    <label>Comissão (%) <FiPercent size={14} /></label>
                                    <input type="number" min="0" max="100" className="team-input text-center" value={commission} onChange={(e) => setCommission(e.target.value)} disabled={role !== 'Garçom'} />
                                </div>
                            </div>

                            {/* PERMISSÕES EXTRAS (Switches visuais) */}
                            <div className="permissions-box">
                                <h3 className="permissions-title"><FiShield size={16} /> Permissões Especiais no PDV</h3>

                                <label className="permission-toggle">
                                    <input type="checkbox" checked={canDiscount} onChange={(e) => setCanDiscount(e.target.checked)} />
                                    <span className="toggle-slider"></span>
                                    <span>Pode aplicar descontos na comanda</span>
                                </label>

                                <label className="permission-toggle">
                                    <input type="checkbox" checked={canCancel} onChange={(e) => setCanCancel(e.target.checked)} />
                                    <span className="toggle-slider"></span>
                                    <span>Pode cancelar itens já preparados</span>
                                </label>
                            </div>

                            <div className="form-actions">
                                {editingId && (
                                    <button type="button" className="btn-cancel" onClick={resetForm}>Cancelar</button>
                                )}
                                <button type="submit" className="team-button">
                                    {editingId ? 'Salvar Alterações' : 'Cadastrar'}
                                </button>
                            </div>
                        </form>
                    </section>

                    {/* LADO DIREITO: LISTA */}
                    <section className="team-card list-section">
                        <div className="card-header">
                            <FiUsers className="card-icon" />
                            <h2>Equipe Cadastrada</h2>
                            <span className="badge-count">{staffList.length}</span>
                        </div>

                        <div className="team-list-wrapper custom-scrollbar">
                            <div className="team-list">
                                {staffList.map(staff => (
                                    <div key={staff.id} className={`team-list-item ${!staff.isActive ? 'item-inactive' : ''}`}>

                                        <div className="item-info-wrapper">
                                            <div className={`avatar-box ${staff.role.toLowerCase()}`}>
                                                {staff.name.charAt(0)}
                                            </div>
                                            <div className="staff-details">
                                                <span className="staff-name">{staff.name}</span>
                                                <div className="staff-badges">
                                                    <span className={`role-badge ${staff.role.toLowerCase()}`}>{staff.role}</span>
                                                    {staff.role === 'Garçom' && <span className="commission-badge">{staff.commission}%</span>}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="staff-actions">
                                            <button onClick={() => handleEdit(staff)} className="btn-icon edit" title="Editar">
                                                <FiEdit2 size={18} />
                                            </button>

                                            {/* BOTÃO DE INATIVAR/REATIVAR (SOFT DELETE) */}
                                            <button
                                                onClick={() => handleToggleStatus(staff.id)}
                                                className={`btn-status ${staff.isActive ? 'active' : 'inactive'}`}
                                                title={staff.isActive ? 'Inativar Usuário' : 'Reativar Usuário'}
                                            >
                                                {staff.isActive ? <FiX size={18} /> : <FiCheck size={18} />}
                                                <span>{staff.isActive ? 'Inativar' : 'Reativar'}</span>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                </div>
            </main>
        </div>
    );
}