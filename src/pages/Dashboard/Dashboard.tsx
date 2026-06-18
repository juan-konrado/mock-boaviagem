import { useState } from 'react';
import {
    FiCheckCircle, FiCalendar, FiTrendingUp, FiTrendingDown,
    FiDollarSign, FiUsers, FiShoppingBag, FiAlertTriangle,
    FiPackage, FiTrendingDown as FiLoss, FiClock, FiX
} from 'react-icons/fi';

import './Dashboard.css'; // 🟢 Importação do nosso CSS semântico

// ==========================================
// 🟢 BANCO DE DADOS FICTÍCIO (MOCK DB)
// ==========================================
const MOCK_DB = {
    hoje: {
        kpis: { fat: 1250.00, fatCresc: 5.2, lucro: 420.00, lucroCresc: 2.1, ticket: 45.00, ticketCresc: 1.5, clientes: 28, cliCresc: 3.0 },
        produtos: [
            { id: 1, nome: "Almoço Executivo", vendas: 15, receita: 450, status: 'volume' },
            { id: 2, nome: "Coca-Cola Lata", vendas: 12, receita: 72, status: 'lucrativo' },
            { id: 3, nome: "Pudim", vendas: 5, receita: 60, status: 'lucrativo' },
        ]
    },
    ontem: {
        kpis: { fat: 980.00, fatCresc: -12.0, lucro: 310.00, lucroCresc: -15.0, ticket: 42.60, ticketCresc: -5.0, clientes: 23, cliCresc: -8.0 },
        produtos: [
            { id: 4, nome: "X-Salada", vendas: 10, receita: 250, status: 'volume' },
            { id: 5, nome: "Suco Natural", vendas: 8, receita: 80, status: 'lucrativo' },
            { id: 2, nome: "Coca-Cola Lata", vendas: 7, receita: 42, status: 'lucrativo' },
        ]
    },
    semana: {
        kpis: { fat: 8450.00, fatCresc: 8.5, lucro: 2800.00, lucroCresc: 10.2, ticket: 65.00, ticketCresc: 4.1, clientes: 130, cliCresc: 5.0 },
        produtos: [
            { id: 1, nome: "X-Burger Duplo", vendas: 45, receita: 1575, status: 'lucrativo' },
            { id: 6, nome: "Porção de Fritas", vendas: 38, receita: 1140, status: 'lucrativo' },
            { id: 7, nome: "Chopp Artesanal", vendas: 80, receita: 1200, status: 'volume' },
        ]
    },
    mes: {
        kpis: { fat: 48250.00, fatCresc: 12.5, lucro: 12400.00, lucroCresc: 8.2, ticket: 85.50, ticketCresc: -2.1, clientes: 564, cliCresc: 15.0 },
        produtos: [
            { id: 1, nome: "X-Burger Duplo", vendas: 120, receita: 4200, status: 'lucrativo' },
            { id: 8, nome: "Heineken 600ml", vendas: 95, receita: 1805, status: 'volume' },
            { id: 9, nome: "Batata Frita Cheddar", vendas: 81, receita: 2835, status: 'lucrativo' },
            { id: 10, nome: "Caipirinha Limão", vendas: 65, receita: 1625, status: 'volume' },
        ]
    },
    ano: {
        kpis: { fat: 540200.00, fatCresc: 22.4, lucro: 150800.00, lucroCresc: 18.5, ticket: 78.00, ticketCresc: 5.5, clientes: 6925, cliCresc: 12.0 },
        produtos: [
            { id: 8, nome: "Heineken 600ml", vendas: 1240, receita: 23560, status: 'volume' },
            { id: 1, nome: "X-Burger Duplo", vendas: 980, receita: 34300, status: 'lucrativo' },
            { id: 6, nome: "Porção de Fritas", vendas: 850, receita: 25500, status: 'lucrativo' },
        ]
    }
};

const MOCK_ALERTAS = {
    estoque: [
        { id: 1, item: 'Bacon Fatiado', nivel: 'Restam 1.5kg', status: 'critico' },
        { id: 2, item: 'Cerveja IPA', nivel: '12 un', status: 'baixo' }
    ],
    margemBaixa: [
        { id: 3, item: 'Gin Tônica', margem: '15% (Ideal > 30%)', motivo: 'Custo do limão subiu' },
        { id: 4, item: 'Combo Família', margem: '18%', motivo: 'Desconto agressivo' }
    ],
    parados: [
        { id: 5, item: 'Vinho Tinto Seco', dias: '32 dias sem vendas' },
        { id: 6, item: 'Água Tônica', dias: '15 dias sem vendas' }
    ]
};

// ==========================================
// COMPONENTE DE MODAL (Refatorado para CSS)
// ==========================================
const ModalOverlay = ({ isOpen, onClose, title, children }: any) => {
    if (!isOpen) return null;
    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2 className="modal-title">{title}</h2>
                    <button onClick={onClose} className="modal-close-btn">
                        <FiX size={24} />
                    </button>
                </div>
                <div className="modal-body">
                    {children}
                </div>
            </div>
        </div>
    );
};

// ==========================================
// PÁGINA PRINCIPAL
// ==========================================
type PeriodoTipo = 'hoje' | 'ontem' | 'semana' | 'mes' | 'ano' | 'custom';

export default function Dashboard() {
    const [periodoAtivo, setPeriodoAtivo] = useState<PeriodoTipo>('mes');
    const [showCustomDates, setShowCustomDates] = useState(false);

    const [isProdutosModalOpen, setProdutosModalOpen] = useState(false);
    const [isEstoqueModalOpen, setEstoqueModalOpen] = useState(false);

    const currentData = periodoAtivo === 'custom' ? MOCK_DB['mes'] : MOCK_DB[periodoAtivo];

    const handlePeriodoChange = (tipo: PeriodoTipo) => {
        setPeriodoAtivo(tipo);
        setShowCustomDates(tipo === 'custom');
    };

    return (
        <div className="dashboard-layout">
            <main className="dashboard-container">

                {/* 🟢 CABEÇALHO E FILTROS */}
                <header className="dashboard-header">
                    <div>
                        <h1 className="dashboard-title">Visão Geral</h1>
                        <p className="dashboard-subtitle">Acompanhe a saúde financeira e operacional do negócio</p>
                    </div>

                    <div className="filters-wrapper">
                        {/* Pílulas de Filtro */}
                        <div className="filter-pills">
                            {['hoje', 'ontem', 'semana', 'mes', 'ano', 'custom'].map((tipo) => (
                                <button
                                    key={tipo}
                                    onClick={() => handlePeriodoChange(tipo as PeriodoTipo)}
                                    className={`filter-btn ${periodoAtivo === tipo ? 'active' : ''}`}
                                >
                                    {tipo === 'custom' ? <FiCalendar size={18} /> : tipo.charAt(0).toUpperCase() + tipo.slice(1)}
                                </button>
                            ))}
                        </div>

                        {/* Campos Customizados Condicionais */}
                        {showCustomDates && (
                            <div className="custom-date-picker">
                                <input type="date" className="custom-date-input" />
                                <span style={{ color: 'var(--text-secondary)' }}>até</span>
                                <input type="date" className="custom-date-input" />
                            </div>
                        )}
                    </div>
                </header>

                {/* 🟢 CAMADA 1: KPIs Principais (Dinâmicos) */}
                <div className="kpi-grid">
                    {/* Faturamento */}
                    <div className="kpi-card">
                        <div className="kpi-header">
                            <span className="kpi-title">Faturamento</span>
                            <div className="kpi-icon-box" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>
                                <FiDollarSign size={20} />
                            </div>
                        </div>
                        <h2 className="kpi-value">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(currentData.kpis.fat)}
                        </h2>
                        <div className={`kpi-trend ${currentData.kpis.fatCresc >= 0 ? 'trend-up' : 'trend-down'}`}>
                            {currentData.kpis.fatCresc >= 0 ? <FiTrendingUp /> : <FiTrendingDown />}
                            <span>{currentData.kpis.fatCresc}% vs ant.</span>
                        </div>
                    </div>

                    {/* Lucro Bruto */}
                    <div className="kpi-card">
                        <div className="kpi-header">
                            <span className="kpi-title">Lucro Bruto</span>
                            <div className="kpi-icon-box" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
                                <FiCheckCircle size={20} />
                            </div>
                        </div>
                        <h2 className="kpi-value">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(currentData.kpis.lucro)}
                        </h2>
                        <div className={`kpi-trend ${currentData.kpis.lucroCresc >= 0 ? 'trend-up' : 'trend-down'}`}>
                            {currentData.kpis.lucroCresc >= 0 ? <FiTrendingUp /> : <FiTrendingDown />}
                            <span>{currentData.kpis.lucroCresc}% vs ant.</span>
                        </div>
                    </div>

                    {/* Ticket Médio */}
                    <div className="kpi-card">
                        <div className="kpi-header">
                            <span className="kpi-title">Ticket Médio</span>
                            <div className="kpi-icon-box" style={{ backgroundColor: 'rgba(168, 85, 247, 0.1)', color: '#a855f7' }}>
                                <FiShoppingBag size={20} />
                            </div>
                        </div>
                        <h2 className="kpi-value">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(currentData.kpis.ticket)}
                        </h2>
                        <div className={`kpi-trend ${currentData.kpis.ticketCresc >= 0 ? 'trend-up' : 'trend-down'}`}>
                            {currentData.kpis.ticketCresc >= 0 ? <FiTrendingUp /> : <FiTrendingDown />}
                            <span>{currentData.kpis.ticketCresc}% vs ant.</span>
                        </div>
                    </div>

                    {/* Clientes Atendidos */}
                    <div className="kpi-card">
                        <div className="kpi-header">
                            <span className="kpi-title">Clientes Atendidos</span>
                            <div className="kpi-icon-box" style={{ backgroundColor: 'rgba(249, 115, 22, 0.1)', color: '#f97316' }}>
                                <FiUsers size={20} />
                            </div>
                        </div>
                        <h2 className="kpi-value">
                            {currentData.kpis.clientes}
                        </h2>
                        <div className={`kpi-trend ${currentData.kpis.cliCresc >= 0 ? 'trend-up' : 'trend-down'}`}>
                            {currentData.kpis.cliCresc >= 0 ? <FiTrendingUp /> : <FiTrendingDown />}
                            <span>{currentData.kpis.cliCresc}% vs ant.</span>
                        </div>
                    </div>
                </div>

                {/* 🟢 CAMADA 2: Produtos e Problemas Operacionais */}
                <div className="dashboard-content-grid">

                    {/* COLUNA ESQUERDA: Produtos (2/3) */}
                    <div className="dashboard-panel">
                        <div className="panel-header-row">
                            <h3 className="panel-title">🏆 Produtos em Destaque</h3>
                            <button onClick={() => setProdutosModalOpen(true)} className="btn-link">
                                Ver todos
                            </button>
                        </div>

                        <div className="products-list-wrapper">
                            <div className="products-header-row">
                                <div>Produto</div>
                                <div style={{ textAlign: 'center' }}>Vendas</div>
                                <div className="col-revenue" style={{ textAlign: 'right' }}>Receita</div>
                            </div>

                            {currentData.produtos.map((produto, index) => (
                                <div key={`${periodoAtivo}-${produto.id}`} className="product-row" style={{ animationDelay: `${index * 50}ms` }}>
                                    <div className="product-info">
                                        <div className="product-rank">{index + 1}</div>
                                        <span className="product-name">{produto.nome}</span>
                                    </div>
                                    <div className="product-sales">
                                        {produto.vendas} un
                                    </div>
                                    <div className="product-revenue col-revenue">
                                        <span className="revenue-value">R$ {produto.receita}</span>
                                        {produto.status === 'lucrativo' ? (
                                            <span className="badge badge-margin">ALTA MARGEM</span>
                                        ) : (
                                            <span className="badge badge-volume">ALTO VOLUME</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* COLUNA DIREITA: Alertas de Ação (1/3) */}
                    <div className="alerts-wrapper">

                        {/* 1. Alertas de Estoque */}
                        <div className="alert-box critical">
                            <h3 className="alert-title"><FiPackage /> Estoque Crítico</h3>
                            <div className="alert-list">
                                {MOCK_ALERTAS.estoque.map(item => (
                                    <div key={item.id} className="alert-item">
                                        <span className="alert-item-name">{item.item}</span>
                                        <span className={`alert-item-status ${item.status === 'critico' ? 'status-critical' : 'status-warning'}`}>
                                            {item.nivel}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            <button onClick={() => setEstoqueModalOpen(true)} className="btn-danger">
                                Gerenciar Estoque
                            </button>
                        </div>

                        {/* 2. Margem Baixa */}
                        <div className="alert-box warning">
                            <h3 className="alert-title"><FiLoss /> Margem Baixa</h3>
                            <div className="alert-list">
                                {MOCK_ALERTAS.margemBaixa.map(item => (
                                    <div key={item.id} className="alert-item" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '4px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                            <span className="alert-item-name">{item.item}</span>
                                            <span className="alert-item-status status-warning">{item.margem}</span>
                                        </div>
                                        <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{item.motivo}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 3. Produtos Parados */}
                        <div className="alert-box neutral">
                            <h3 className="alert-title"><FiClock /> Produtos Parados</h3>
                            <div className="alert-list">
                                {MOCK_ALERTAS.parados.map(item => (
                                    <div key={item.id} className="alert-item">
                                        <span className="alert-item-name">{item.item}</span>
                                        <span className="alert-item-status status-neutral">{item.dias}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* ========================================= */}
            {/* MODAIS */}
            {/* ========================================= */}

            {/* Modal: Ranking de Produtos */}
            <ModalOverlay isOpen={isProdutosModalOpen} onClose={() => setProdutosModalOpen(false)} title="Ranking Completo de Produtos">
                <input type="text" placeholder="Pesquisar produto..." className="modal-search" />
                <div>
                    {[...MOCK_DB.mes.produtos, { id: 99, nome: "Água Mineral", vendas: 45, receita: 135, status: 'volume' }].map((prod, i) => (
                        <div key={i} className="modal-list-item">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <span style={{ color: 'var(--text-secondary)', fontWeight: 700 }}>{i + 1}</span>
                                <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{prod.nome}</span>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>R$ {prod.receita}</div>
                                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{prod.vendas} unidades</div>
                            </div>
                        </div>
                    ))}
                </div>
            </ModalOverlay>

            {/* Modal: Estoque */}
            <ModalOverlay isOpen={isEstoqueModalOpen} onClose={() => setEstoqueModalOpen(false)} title="Ajuste Rápido de Estoque">
                <div style={{ backgroundColor: 'rgba(225, 29, 72, 0.1)', padding: '16px', borderRadius: '12px', display: 'flex', gap: '12px', marginBottom: '24px' }}>
                    <FiAlertTriangle color="#e11d48" size={20} />
                    <p style={{ color: '#e11d48', margin: 0, fontSize: '14px', fontWeight: 600 }}>Você tem 2 itens em estado crítico. Atualize o estoque ou solicite compra ao fornecedor.</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {MOCK_ALERTAS.estoque.map(item => (
                        <div key={item.id} className="alert-item" style={{ flexDirection: 'row', flexWrap: 'wrap', gap: '16px' }}>
                            <div>
                                <h4 style={{ margin: '0 0 4px 0', color: 'var(--text-primary)' }}>{item.item}</h4>
                                <span style={{ fontSize: '12px', fontWeight: 700, color: '#e11d48' }}>Atual: {item.nivel}</span>
                            </div>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <input type="number" placeholder="+ Adic." style={{ width: '80px', padding: '8px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-input)', color: 'var(--text-primary)' }} />
                                <button style={{ padding: '8px 16px', backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', borderRadius: '8px', cursor: 'pointer', fontWeight: 700 }}>
                                    Salvar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </ModalOverlay>

        </div>
    );
}