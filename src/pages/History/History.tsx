import { useState, useMemo } from 'react';
import { FiFileText, FiUser, FiCalendar, FiDollarSign, FiChevronDown, FiChevronUp, FiClock } from 'react-icons/fi';
import './History.css';

export type OrderProps = {
    id: string;
    tableId: string | null;
    name: string | null;
    waiter_name?: string | null;
    status: string;
    total: number;
    updatedAt: string;
    table?: {
        number?: number | string;
        name?: string;
    };
    items?: {
        id: string;
        quantity: number;
        price: number;
        product: { name: string; }
    }[];
}

type FilterType = 'hoje' | 'semana' | 'mes' | 'custom';

// ==========================================
// 🟢 GERADOR DE DATAS E MOCK DATA
// ==========================================
const hoje = new Date();

const ontem = new Date();
ontem.setDate(hoje.getDate() - 1);

const cincoDiasAtras = new Date();
cincoDiasAtras.setDate(hoje.getDate() - 5);

const mesPassado = new Date();
mesPassado.setDate(hoje.getDate() - 20);

const MOCK_ORDERS: OrderProps[] = [
    {
        id: '1', tableId: '05', name: 'Carlos Andrade', waiter_name: 'João Silva', status: 'Fechado', total: 0,
        updatedAt: hoje.toISOString(),
        items: [
            { id: 'i1', quantity: 2, price: 35.00, product: { name: 'Fritas com Cheddar' } },
            { id: 'i2', quantity: 4, price: 14.00, product: { name: 'Heineken Long Neck' } }
        ]
    },
    {
        id: '2', tableId: null, name: 'Marcos (Balcão)', waiter_name: 'Caixa Principal', status: 'Fechado', total: 0,
        updatedAt: hoje.toISOString(),
        items: [
            { id: 'i3', quantity: 1, price: 42.00, product: { name: 'Isca de Peixe' } },
            { id: 'i4', quantity: 1, price: 6.00, product: { name: 'Coca Cola Lata' } }
        ]
    },
    {
        id: '3', tableId: '12', name: 'Família Souza', waiter_name: 'Ana Costa', status: 'Fechado', total: 0,
        updatedAt: ontem.toISOString(),
        items: [
            { id: 'i5', quantity: 3, price: 35.00, product: { name: 'X-Burger Duplo' } },
            { id: 'i6', quantity: 3, price: 6.00, product: { name: 'Coca Cola Lata' } }
        ]
    },
    {
        id: '4', tableId: '02', name: 'Grupo Empresa', waiter_name: 'João Silva', status: 'Fechado', total: 350.00,
        updatedAt: cincoDiasAtras.toISOString(),
        items: [
            { id: 'i7', quantity: 10, price: 35.00, product: { name: 'Chopp Artesanal' } }
        ]
    },
    {
        id: '5', tableId: '08', name: 'Casal', waiter_name: 'Ana Costa', status: 'Fechado', total: 85.00,
        updatedAt: mesPassado.toISOString(),
        items: [
            { id: 'i8', quantity: 1, price: 85.00, product: { name: 'Combo Casal Premium' } }
        ]
    }
];

export default function History() {
    const [filterType, setFilterType] = useState<FilterType>('hoje');
    const [customDate, setCustomDate] = useState('');
    const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

    // ==========================================
    // LÓGICA DE FILTRAGEM INTELIGENTE
    // ==========================================
    const filteredOrders = useMemo(() => {
        const hojeISO = hoje.toISOString().split('T')[0];

        // Lógica de tempo para os filtros
        const dataLimiteSemana = new Date();
        dataLimiteSemana.setDate(hoje.getDate() - 7);

        const dataLimiteMes = new Date();
        dataLimiteMes.setDate(hoje.getDate() - 30);

        return MOCK_ORDERS.filter(order => {
            const orderDateStr = order.updatedAt.split('T')[0];
            const orderDateObj = new Date(order.updatedAt);

            if (filterType === 'hoje') {
                return orderDateStr === hojeISO;
            }
            if (filterType === 'semana') {
                return orderDateObj >= dataLimiteSemana;
            }
            if (filterType === 'mes') {
                return orderDateObj >= dataLimiteMes;
            }
            if (filterType === 'custom') {
                if (!customDate) return true;
                return orderDateStr === customDate;
            }
            return true;
        });
    }, [filterType, customDate]);

    // ==========================================
    // CÁLCULOS E FORMATAÇÕES
    // ==========================================
    function calculateOrderTotal(order: OrderProps) {
        if (order.total && Number(order.total) > 0) return Number(order.total);
        if (order.items && order.items.length > 0) {
            return order.items.reduce((acc, item) => acc + (Number(item.price) * item.quantity), 0);
        }
        return 0;
    }

    const faturamentoTotal = filteredOrders.reduce((acc, order) => acc + calculateOrderTotal(order), 0);

    function formatTime(dateString: string) {
        return new Date(dateString).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    }

    function formatDate(dateString: string) {
        return new Date(dateString).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    }

    function formatMoney(value: number) {
        return Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }

    function toggleOrderDetails(orderId: string) {
        setExpandedOrder(expandedOrder === orderId ? null : orderId);
    }

    return (
        <div className="history-container">
            <main className="history-main">

                <div className="history-header">
                    <h1 className="history-title">Histórico de Vendas</h1>
                    <div className="revenue-card">
                        <FiDollarSign size={24} />
                        <span className="revenue-text">
                            Faturamento: <strong className="revenue-value">{formatMoney(faturamentoTotal)}</strong>
                        </span>
                    </div>
                </div>

                {/* 🟢 BARRA DE FILTROS COM PÍLULAS */}
                <div className="filter-bar">
                    <div className="filters-wrapper">
                        <div className="filter-pills">
                            {['hoje', 'semana', 'mes', 'custom'].map((tipo) => (
                                <button
                                    key={tipo}
                                    onClick={() => {
                                        setFilterType(tipo as FilterType);
                                        if (tipo !== 'custom') setCustomDate('');
                                    }}
                                    className={`filter-btn ${filterType === tipo ? 'active' : ''}`}
                                >
                                    {tipo === 'custom' ? <FiCalendar size={16} /> : tipo.charAt(0).toUpperCase() + tipo.slice(1)}
                                </button>
                            ))}
                        </div>

                        {filterType === 'custom' && (
                            <input
                                type="date"
                                value={customDate}
                                onChange={(e) => setCustomDate(e.target.value)}
                                className="filter-input"
                            />
                        )}
                    </div>

                    <span className="filter-count">
                        Mostrando {filteredOrders.length} comanda(s)
                    </span>
                </div>

                {/* 🟢 LISTA DE COMANDAS (ACORDEÃO / SANFONA) */}
                <div className="orders-list">
                    {filteredOrders.length === 0 && (
                        <span className="empty-state-text">
                            Nenhuma comanda encontrada neste período.
                        </span>
                    )}

                    {filteredOrders.map(order => {
                        const identificadorMesa = order.tableId ? order.tableId : 'Avulsa';
                        const isExpanded = expandedOrder === order.id;

                        return (
                            <article key={order.id} className="order-card-wrapper">

                                {/* CABEÇALHO DO CARD */}
                                <div className="order-card-header" onClick={() => toggleOrderDetails(order.id)}>

                                    <div className="card-section">
                                        <div className="tag-mesa">
                                            <FiFileText size={18} />
                                            <span>Mesa {identificadorMesa}</span>
                                        </div>
                                    </div>

                                    <div className="card-section">
                                        <div className="info-row">
                                            <FiUser size={18} className="info-icon" />
                                            <span className="info-text">{order.name || 'Cliente Avulso'}</span>
                                        </div>
                                        <div className="info-row">
                                            <FiCalendar size={18} className="info-icon" />
                                            <span className="info-text">{formatDate(order.updatedAt)}</span>

                                            <span style={{ color: 'var(--border-color)' }}>|</span>

                                            <FiClock size={16} className="info-icon" />
                                            <span className="info-text" style={{ fontSize: '14px' }}>{formatTime(order.updatedAt)}</span>
                                        </div>

                                        <div className="waiter-info">
                                            <span className="waiter-label">Fechado por:</span>
                                            <span className="waiter-name">
                                                {order.waiter_name || 'Desconhecido'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="card-section-right">
                                        <span className="total-label">Total Pago</span>
                                        <span className="total-value">{formatMoney(calculateOrderTotal(order))}</span>

                                        <div className="expand-hint">
                                            {isExpanded ? <FiChevronUp size={20} /> : <FiChevronDown size={20} />}
                                            <span>{isExpanded ? 'Ocultar Detalhes' : 'Ver Detalhes'}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* 🟢 DETALHES DA COMANDA (ITENS EXPANDIDOS) */}
                                {isExpanded && (
                                    <div className="items-container">
                                        <h3 className="items-title">Itens Consumidos:</h3>

                                        {(!order.items || order.items.length === 0) ? (
                                            <span className="empty-state-text" style={{ marginTop: '10px', textAlign: 'left' }}>
                                                Nenhum detalhe de item salvo para esta comanda antiga.
                                            </span>
                                        ) : (
                                            order.items?.map(item => (
                                                <div key={item.id} className="item-row">
                                                    <span className="item-quantity">{item.quantity}x</span>
                                                    <span className="item-name">{item.product.name}</span>
                                                    <span className="item-price">{formatMoney(Number(item.price) * item.quantity)}</span>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                )}
                            </article>
                        )
                    })}
                </div>

            </main>
        </div>
    );
}