import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { FiFileText, FiUser, FiCalendar, FiDollarSign, FiChevronDown, FiChevronUp } from 'react-icons/fi';
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
        product: {
            name: string;
        }
    }[];
}

export default function History() {
    const [orders, setOrders] = useState<OrderProps[]>([]);
    const [filterDate, setFilterDate] = useState('');
    const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

    useEffect(() => {
        async function loadHistory() {
            try {
                const response = await api.get('/orders/closed');
                setOrders(response.data);
            } catch (err) {
                console.error("Erro ao buscar histórico", err);
            }
        }
        loadHistory();
    }, []);

    const filteredOrders = orders.filter(order => {
        if (!filterDate) return true;
        const orderDate = new Date(order.updatedAt).toISOString().split('T')[0];
        return orderDate === filterDate;
    });

    function calculateOrderTotal(order: OrderProps) {
        if (order.total && Number(order.total) > 0) {
            return Number(order.total);
        }
        if (order.items && order.items.length > 0) {
            return order.items.reduce((acc, item) => acc + (Number(item.price) * item.quantity), 0);
        }
        return 0;
    }

    const faturamentoTotal = filteredOrders.reduce((acc, order) => acc + calculateOrderTotal(order), 0);

    function formatDate(dateString: string) {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    }

    function formatMoney(value: number) {
        return Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }

    function toggleOrderDetails(orderId: string) {
        if (expandedOrder === orderId) {
            setExpandedOrder(null);
        } else {
            setExpandedOrder(orderId);
        }
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

                {/* 🟢 BARRA DE FILTROS */}
                <div className="filter-bar">
                    <div className="filter-group">
                        <span className="filter-label">Filtrar por dia:</span>
                        <input
                            type="date"
                            value={filterDate}
                            onChange={(e) => setFilterDate(e.target.value)}
                            className="filter-input"
                        />
                        {filterDate && (
                            <button onClick={() => setFilterDate('')} className="btn-clear">
                                Limpar Filtro
                            </button>
                        )}
                    </div>
                    <span className="filter-count">
                        Mostrando {filteredOrders.length} comanda(s)
                    </span>
                </div>

                {/* 🟢 LISTA DE COMANDAS */}
                <div className="orders-list">
                    {filteredOrders.length === 0 && (
                        <span className="empty-state-text">
                            Nenhuma comanda encontrada para esta data.
                        </span>
                    )}

                    {filteredOrders.map(order => {
                        const identificadorMesa = order.table ? (order.table.number || order.table.name) : 'Balcão/Avulsa';
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
                                        </div>

                                        {/* Exibindo o nome do Atendente */}
                                        <div className="waiter-info">
                                            <span className="waiter-label">Atendente:</span>
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
                                            <span>{isExpanded ? 'Ocultar' : 'Ver Itens'}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* 🟢 DETALHES DA COMANDA (ITENS) */}
                                {isExpanded && (
                                    <div className="items-container">
                                        <h3 className="items-title">Consumo do Cliente:</h3>

                                        {order.items?.length === 0 ? (
                                            <span className="empty-state-text" style={{ marginTop: '10px', textAlign: 'left' }}>
                                                Nenhum item registrado nesta comanda.
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