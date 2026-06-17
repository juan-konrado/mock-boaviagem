import { useState } from 'react';
import { Header } from '../components/Header';
import {
    FiCheckCircle, FiCalendar, FiTrendingUp, FiTrendingDown,
    FiDollarSign, FiUsers, FiShoppingBag, FiAlertTriangle,
    FiPackage, FiTrendingDown as FiLoss, FiClock, FiX
} from 'react-icons/fi';

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
// COMPONENTES DE MODAL
// ==========================================
const ModalOverlay = ({ isOpen, onClose, title, children }: any) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[85vh]">
                <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white">{title}</h2>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-slate-800 rounded-full transition-colors">
                        <FiX size={24} />
                    </button>
                </div>
                <div className="p-6 overflow-y-auto">
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

    // Controles de Modais
    const [isProdutosModalOpen, setProdutosModalOpen] = useState(false);
    const [isEstoqueModalOpen, setEstoqueModalOpen] = useState(false);

    // Selecionador de Dados Dinâmico
    const currentData = periodoAtivo === 'custom' ? MOCK_DB['mes'] : MOCK_DB[periodoAtivo];

    const handlePeriodoChange = (tipo: PeriodoTipo) => {
        setPeriodoAtivo(tipo);
        setShowCustomDates(tipo === 'custom');
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-100 transition-colors duration-300 pb-12">
            <Header />

            <main className="max-w-[1400px] mx-auto px-4 py-8 md:px-8">

                {/* 🟢 CABEÇALHO E FILTROS */}
                <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
                    <div>
                        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Visão Geral</h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">Acompanhe a saúde financeira e operacional do negócio</p>
                    </div>

                    <div className="flex flex-col items-end gap-3">
                        {/* Pílulas de Filtro */}
                        <div className="flex flex-wrap bg-white dark:bg-slate-900 p-1.5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
                            {['hoje', 'ontem', 'semana', 'mes', 'ano', 'custom'].map((tipo) => (
                                <button
                                    key={tipo}
                                    onClick={() => handlePeriodoChange(tipo as PeriodoTipo)}
                                    className={`px-4 py-2 rounded-xl font-bold text-sm transition-all duration-300 ${periodoAtivo === tipo
                                        ? 'bg-blue-600 text-white shadow-md'
                                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                                        }`}
                                >
                                    {tipo === 'custom' ? <FiCalendar className="inline-block" /> : tipo.charAt(0).toUpperCase() + tipo.slice(1)}
                                </button>
                            ))}
                        </div>

                        {/* Campos Customizados Condicionais */}
                        {showCustomDates && (
                            <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-2 rounded-xl border border-slate-200 dark:border-slate-800 animate-in slide-in-from-top-2">
                                <input type="date" className="bg-transparent border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1 text-sm outline-none" />
                                <span className="text-slate-400">até</span>
                                <input type="date" className="bg-transparent border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1 text-sm outline-none" />
                            </div>
                        )}
                    </div>
                </header>

                {/* 🟢 CAMADA 1: KPIs Principais (Dinâmicos) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

                    {/* Faturamento */}
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800">
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-slate-500 dark:text-slate-400 font-bold text-sm uppercase tracking-wider">Faturamento</span>
                            <div className="p-2 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-lg"><FiDollarSign size={20} /></div>
                        </div>
                        <h2 className="text-3xl font-black text-slate-800 dark:text-white mb-2">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(currentData.kpis.fat)}
                        </h2>
                        <div className={`flex items-center gap-1.5 text-sm font-bold ${currentData.kpis.fatCresc >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                            {currentData.kpis.fatCresc >= 0 ? <FiTrendingUp /> : <FiTrendingDown />}
                            <span>{currentData.kpis.fatCresc}% vs ant.</span>
                        </div>
                    </div>

                    {/* Lucro */}
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800">
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-slate-500 dark:text-slate-400 font-bold text-sm uppercase tracking-wider">Lucro Bruto</span>
                            <div className="p-2 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg"><FiCheckCircle size={20} /></div>
                        </div>
                        <h2 className="text-3xl font-black text-slate-800 dark:text-white mb-2">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(currentData.kpis.lucro)}
                        </h2>
                        <div className={`flex items-center gap-1.5 text-sm font-bold ${currentData.kpis.lucroCresc >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                            {currentData.kpis.lucroCresc >= 0 ? <FiTrendingUp /> : <FiTrendingDown />}
                            <span>{currentData.kpis.lucroCresc}% vs ant.</span>
                        </div>
                    </div>

                    {/* Ticket Médio */}
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800">
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-slate-500 dark:text-slate-400 font-bold text-sm uppercase tracking-wider">Ticket Médio</span>
                            <div className="p-2 bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-lg"><FiShoppingBag size={20} /></div>
                        </div>
                        <h2 className="text-3xl font-black text-slate-800 dark:text-white mb-2">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(currentData.kpis.ticket)}
                        </h2>
                        <div className={`flex items-center gap-1.5 text-sm font-bold ${currentData.kpis.ticketCresc >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                            {currentData.kpis.ticketCresc >= 0 ? <FiTrendingUp /> : <FiTrendingDown />}
                            <span>{currentData.kpis.ticketCresc}% vs ant.</span>
                        </div>
                    </div>

                    {/* Clientes */}
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800">
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-slate-500 dark:text-slate-400 font-bold text-sm uppercase tracking-wider">Clientes Atendidos</span>
                            <div className="p-2 bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 rounded-lg"><FiUsers size={20} /></div>
                        </div>
                        <h2 className="text-3xl font-black text-slate-800 dark:text-white mb-2">
                            {currentData.kpis.clientes}
                        </h2>
                        <div className={`flex items-center gap-1.5 text-sm font-bold ${currentData.kpis.cliCresc >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                            {currentData.kpis.cliCresc >= 0 ? <FiTrendingUp /> : <FiTrendingDown />}
                            <span>{currentData.kpis.cliCresc}% vs ant.</span>
                        </div>
                    </div>
                </div>

                {/* 🟢 CAMADA 2: Produtos e Problemas Operacionais */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* COLUNA ESQUERDA: Produtos (2/3) */}
                    <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                🏆 Produtos em Destaque
                            </h3>
                            <button
                                onClick={() => setProdutosModalOpen(true)}
                                className="text-sm font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 transition-colors"
                            >
                                Ver todos
                            </button>
                        </div>

                        <div className="space-y-3">
                            <div className="grid grid-cols-12 gap-4 px-4 pb-2 border-b border-slate-100 dark:border-slate-800 text-xs font-bold text-slate-400 uppercase tracking-wider">
                                <div className="col-span-6 md:col-span-5">Produto</div>
                                <div className="col-span-3 text-center">Vendas</div>
                                <div className="col-span-4 hidden md:block text-right">Receita</div>
                            </div>

                            {/* Trocamos a key para forçar a animação ao mudar de período */}
                            {currentData.produtos.map((produto, index) => (
                                <div
                                    key={`${periodoAtivo}-${produto.id}`}
                                    className="grid grid-cols-12 gap-4 items-center p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all duration-300 animate-in fade-in slide-in-from-bottom-2"
                                    style={{ animationDelay: `${index * 50}ms` }}
                                >
                                    <div className="col-span-6 md:col-span-5 flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full flex items-center justify-center font-black text-sm bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                                            {index + 1}
                                        </div>
                                        <span className="font-bold text-slate-800 dark:text-slate-200">{produto.nome}</span>
                                    </div>
                                    <div className="col-span-3 text-center font-bold text-slate-600 dark:text-slate-400">
                                        {produto.vendas} un
                                    </div>
                                    <div className="col-span-4 hidden md:flex justify-end items-center gap-3">
                                        <span className="font-bold text-slate-800 dark:text-white">R$ {produto.receita}</span>
                                        {produto.status === 'lucrativo' ? (
                                            <span className="text-[10px] font-bold bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 px-2 py-1 rounded-md">ALTA MARGEM</span>
                                        ) : (
                                            <span className="text-[10px] font-bold bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 px-2 py-1 rounded-md">ALTO VOLUME</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* COLUNA DIREITA: Alertas de Ação (1/3) - Dividido em 3 domínios */}
                    <div className="flex flex-col gap-6">

                        {/* 1. Alertas de Estoque */}
                        <div className="bg-rose-50 dark:bg-rose-950/20 p-6 rounded-3xl border border-rose-200 dark:border-rose-900/50">
                            <h3 className="text-base font-bold text-rose-700 dark:text-rose-400 mb-4 flex items-center gap-2">
                                <FiPackage /> Estoque Crítico
                            </h3>
                            <div className="space-y-3">
                                {MOCK_ALERTAS.estoque.map(item => (
                                    <div key={item.id} className="flex justify-between items-center bg-white dark:bg-slate-900 p-3 rounded-xl shadow-sm border border-rose-100 dark:border-rose-900/30">
                                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{item.item}</span>
                                        <span className={`text-xs font-black px-2 py-1 rounded-md ${item.status === 'critico' ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-600'}`}>
                                            {item.nivel}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            <button
                                onClick={() => setEstoqueModalOpen(true)}
                                className="w-full mt-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-sm font-bold rounded-xl transition-colors"
                            >
                                Gerenciar Estoque
                            </button>
                        </div>

                        {/* 2. Margem Baixa */}
                        <div className="bg-orange-50 dark:bg-orange-950/20 p-6 rounded-3xl border border-orange-200 dark:border-orange-900/50">
                            <h3 className="text-base font-bold text-orange-700 dark:text-orange-400 mb-4 flex items-center gap-2">
                                <FiLoss /> Margem Baixa
                            </h3>
                            <div className="space-y-3">
                                {MOCK_ALERTAS.margemBaixa.map(item => (
                                    <div key={item.id} className="bg-white dark:bg-slate-900 p-3 rounded-xl shadow-sm border border-orange-100 dark:border-orange-900/30">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{item.item}</span>
                                            <span className="text-xs font-black text-orange-600">{item.margem}</span>
                                        </div>
                                        <span className="text-xs text-slate-500">{item.motivo}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 3. Produtos Parados */}
                        <div className="bg-slate-100 dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800">
                            <h3 className="text-base font-bold text-slate-700 dark:text-slate-300 mb-4 flex items-center gap-2">
                                <FiClock /> Produtos Parados
                            </h3>
                            <div className="space-y-3">
                                {MOCK_ALERTAS.parados.map(item => (
                                    <div key={item.id} className="flex justify-between items-center bg-white dark:bg-slate-950 p-3 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
                                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{item.item}</span>
                                        <span className="text-xs font-medium text-slate-500">{item.dias}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            </main>

            {/* ========================================= */}
            {/* MODAL 1: TODOS OS PRODUTOS                */}
            {/* ========================================= */}
            <ModalOverlay isOpen={isProdutosModalOpen} onClose={() => setProdutosModalOpen(false)} title="Ranking Completo de Produtos">
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Pesquisar produto..."
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="space-y-2">
                    {/* Lista simulada estendida baseada no mês */}
                    {[...MOCK_DB.mes.produtos, { id: 99, nome: "Água Mineral", vendas: 45, receita: 135, status: 'volume' }].map((prod, i) => (
                        <div key={i} className="flex justify-between items-center p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg border-b border-slate-100 dark:border-slate-800 last:border-0">
                            <div className="flex items-center gap-3">
                                <span className="text-slate-400 font-bold w-4 text-right">{i + 1}</span>
                                <span className="font-bold text-slate-700 dark:text-slate-200">{prod.nome}</span>
                            </div>
                            <div className="text-right">
                                <div className="text-sm font-bold text-slate-800 dark:text-slate-100">R$ {prod.receita}</div>
                                <div className="text-xs text-slate-500">{prod.vendas} unidades</div>
                            </div>
                        </div>
                    ))}
                </div>
            </ModalOverlay>

            {/* ========================================= */}
            {/* MODAL 2: GESTÃO DE ESTOQUE RÁPIDA         */}
            {/* ========================================= */}
            <ModalOverlay isOpen={isEstoqueModalOpen} onClose={() => setEstoqueModalOpen(false)} title="Ajuste Rápido de Estoque">
                <div className="bg-rose-50 dark:bg-rose-900/10 p-4 rounded-xl mb-6 flex items-start gap-3">
                    <FiAlertTriangle className="text-rose-500 shrink-0 mt-0.5" />
                    <p className="text-sm text-rose-700 dark:text-rose-400">Você tem 2 itens em estado crítico. Atualize o estoque ou solicite compra ao fornecedor.</p>
                </div>

                <div className="space-y-4">
                    {MOCK_ALERTAS.estoque.map(item => (
                        <div key={item.id} className="p-4 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <h4 className="font-bold text-slate-800 dark:text-slate-200">{item.item}</h4>
                                <span className="text-xs font-bold text-rose-500">Atual: {item.nivel}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <input type="number" placeholder="+ Adicionar" className="w-24 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm outline-none" />
                                <button className="px-4 py-2 bg-slate-800 dark:bg-slate-700 text-white font-bold text-sm rounded-lg hover:bg-slate-700">Salvar</button>
                            </div>
                        </div>
                    ))}
                </div>
            </ModalOverlay>

        </div>
    );
}