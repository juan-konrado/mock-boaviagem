import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Header } from '../components/Header';
import { FiAlertCircle, FiCheckCircle, FiCalendar, FiTrendingUp, FiDollarSign  } from 'react-icons/fi';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { format, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { io } from 'socket.io-client';

const DESPESAS = {
    barFixas: 6000 + 1600 + 300 + 150 + 300 + 150 + 600, // 9100
    barVariaveis: (3000 + 3000 + 1000 + 500) * 4 + 500,  // 30500
    barLimpeza: 250 + 32 + 30 + 100 + 60 + 100,          // 572
    casaFixas: 2700 + 250 + 150 + 100 + 150 + 500 + 1200 + 500 + 250 + 400 + (480 * 4) // 8120
};

const CUSTO_TOTAL_MES = DESPESAS.barFixas + DESPESAS.barVariaveis + DESPESAS.barLimpeza + DESPESAS.casaFixas; // R$ 48.292

type Venda = {
    data: Date;
    valor: number;
}

export default function Dashboard() {
    const [dateRange, setDateRange] = useState<[Date, Date] | null>(null);
    const [vendasReais, setVendasReais] = useState<Venda[]>([]);

    async function loadSales() {
        try {
            const response = await api.get('/sales');

            const vendasFormatadas = response.data.map((item: { date: string, total: number }) => {
                const [year, month, day] = item.date.split('-');
                return {
                    data: new Date(Number(year), Number(month) - 1, Number(day)),
                    valor: item.total
                }
            });

            setVendasReais(vendasFormatadas);
        } catch (err) {
            console.log("Erro ao carregar faturamento", err);
        }
    }

    useEffect(() => {
        loadSales();
    }, []);

    useEffect(() => {
        const socket = io('http://localhost:3333');
        socket.on('finance_updated', () => {
            loadSales(); 
        });
        return () => {
            socket.disconnect();
        };
    }, []);

    const faturamentoMesAtual = vendasReais.reduce((acc, venda) => acc + venda.valor, 0);
    const lucroLiquido = faturamentoMesAtual - CUSTO_TOTAL_MES;
    const noVermelho = lucroLiquido < 0;

    function calcularVendasSelecionadas() {
        if (!dateRange) return 0;
        const [start, end] = dateRange;

        return vendasReais.reduce((total, venda) => {
            if (venda.data >= start && venda.data <= end) {
                return total + venda.valor;
            }
            return total;
        }, 0);
    }

    // 🟢 UX: Em vez de texto solto vermelho, criamos uma "badge" bonitinha para os dias que tem venda
    function renderTileContent({ date, view }: any) {
        if (view === 'month') {
            const vendaDia = vendasReais.find(v => isSameDay(v.data, date));
            if (vendaDia) {
                return (
                    <div className="mt-1 flex justify-center">
                        <span className="text-[10px] font-bold bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 px-1.5 py-0.5 rounded-full whitespace-nowrap">
                            R$ {vendaDia.valor}
                        </span>
                    </div>
                );
            }
        }
        return null;
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-100 transition-colors duration-300">
            <Header />
            
            {/* 🟢 CSS INJETADO PARA DEIXAR O CALENDÁRIO MODERNO E COMPATÍVEL COM DARK MODE */}
            <style>{`
                .react-calendar { width: 100%; border: none !important; background: transparent !important; font-family: inherit !important; }
                .react-calendar__navigation button { color: inherit !important; min-width: 44px; background: none; font-size: 1.2rem; font-weight: bold; border-radius: 8px; transition: 0.2s; }
                .react-calendar__navigation button:hover, .react-calendar__navigation button:enabled:hover { background-color: rgba(148, 163, 184, 0.2) !important; }
                .react-calendar__month-view__weekdays { text-transform: uppercase; font-weight: bold; font-size: 0.75rem; color: #64748b; }
                .dark .react-calendar__month-view__weekdays { color: #94a3b8; }
                .react-calendar__tile { color: inherit !important; padding: 12px 8px; border-radius: 12px; transition: 0.2s; display: flex; flex-direction: column; align-items: center; justify-content: center; }
                .react-calendar__tile:enabled:hover, .react-calendar__tile:enabled:focus { background-color: rgba(148, 163, 184, 0.1) !important; }
                .react-calendar__tile--now { background: rgba(234, 179, 8, 0.1) !important; border-radius: 12px; }
                .react-calendar__tile--now:enabled:hover { background: rgba(234, 179, 8, 0.2) !important; }
                .react-calendar__tile--active { background: #3b82f6 !important; color: white !important; font-weight: bold; border-radius: 12px; }
                .react-calendar__tile--hasActive { background: #60a5fa !important; }
                .dark .react-calendar__tile--active { background: #2563eb !important; }
                .react-calendar__month-view__days__day--weekend { color: #f43f5e !important; }
                .dark .react-calendar__month-view__days__day--weekend { color: #fb7185 !important; }
                .react-calendar__month-view__days__day--neighboringMonth { color: #cbd5e1 !important; }
                .dark .react-calendar__month-view__days__day--neighboringMonth { color: #475569 !important; }
            `}</style>

            <main className="max-w-[1200px] mx-auto px-4 py-8 md:px-8">
                
                <header className="mb-8">
                    <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Gestão Financeira</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">Acompanhamento de metas e resultados do Boa Viagem Pub</p>
                </header>

                {/* 🟢 GRIDS DOS CARDS */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    
                    {/* CARD 1: Faturamento */}
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 transition-colors">
                        <div className="flex justify-between items-start mb-4">
                            <span className="text-slate-500 dark:text-slate-400 font-bold text-sm uppercase tracking-wider">Faturamento (Mês)</span>
                            <div className="p-2 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-lg">
                                <FiTrendingUp size={20} />
                            </div>
                        </div>
                        <h2 className="text-3xl font-black text-slate-800 dark:text-white mb-2">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(faturamentoMesAtual)}
                        </h2>
                        <span className="text-sm font-medium text-slate-400 dark:text-slate-500">
                            Meta de Equilíbrio: <span className="font-bold">R$ {CUSTO_TOTAL_MES.toLocaleString('pt-BR')}</span>
                        </span>
                    </div>

                    {/* CARD 2: Custo Fixo */}
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 transition-colors">
                        <div className="flex justify-between items-start mb-4">
                            <span className="text-slate-500 dark:text-slate-400 font-bold text-sm uppercase tracking-wider">Custo Operacional</span>
                            <div className="p-2 bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 rounded-lg">
                                <FiDollarSign size={20} />
                            </div>
                        </div>
                        <h2 className="text-3xl font-black text-slate-800 dark:text-white mb-2">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(CUSTO_TOTAL_MES)}
                        </h2>
                        <span className="text-sm font-medium text-slate-400 dark:text-slate-500">
                            Inclui fixos, variáveis e pessoal
                        </span>
                    </div>

                    {/* CARD 3: Lucro/Prejuízo (Muda de cor dinamicamente) */}
                    <div className={`p-6 rounded-3xl shadow-sm border transition-colors duration-300 ${
                        noVermelho 
                        ? 'bg-rose-50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/50' 
                        : 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/50'
                    }`}>
                        <div className="flex justify-between items-start mb-4">
                            <span className={`font-bold text-sm uppercase tracking-wider ${noVermelho ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                                {noVermelho ? 'Prejuízo Atual' : 'Lucro Líquido'}
                            </span>
                            <div className={`p-2 rounded-lg ${noVermelho ? 'bg-rose-100 dark:bg-rose-500/20 text-rose-600' : 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600'}`}>
                                {noVermelho ? <FiAlertCircle size={20} /> : <FiCheckCircle size={20} />}
                            </div>
                        </div>
                        <h2 className={`text-3xl font-black mb-2 ${noVermelho ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(lucroLiquido)}
                        </h2>
                        <span className={`text-sm font-medium ${noVermelho ? 'text-rose-500/80 dark:text-rose-400/70' : 'text-emerald-600/80 dark:text-emerald-400/70'}`}>
                            {noVermelho ? 'Ainda não batemos as contas do mês.' : 'Já pagamos tudo! Estamos no azul.'}
                        </span>
                    </div>

                </div>

                {/* 🟢 SEÇÃO DO CALENDÁRIO */}
                <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 transition-colors">
                    
                    <div className="flex items-center gap-3 mb-8 border-b border-slate-100 dark:border-slate-800 pb-6">
                        <div className="p-3 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl">
                            <FiCalendar size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-800 dark:text-white">Calendário de Faturamento</h2>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Selecione um período (arraste ou clique em dois dias) para somar os valores.</p>
                        </div>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
                        
                        {/* Calendário */}
                        <div className="w-full lg:w-2/3 lg:max-w-xl bg-slate-50 dark:bg-slate-800/30 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
                            <Calendar
                                onChange={(value) => setDateRange(value as [Date, Date])}
                                selectRange={true}
                                tileContent={renderTileContent}
                                locale="pt-BR"
                            />
                        </div>

                        {/* Resultado da Seleção */}
                        <div className="w-full lg:w-1/3 bg-blue-600 dark:bg-slate-800 rounded-3xl p-8 text-center shadow-lg shadow-blue-600/20 dark:shadow-none relative overflow-hidden flex flex-col justify-center min-h-[350px]">
                            
                            {/* Círculos decorativos de fundo */}
                            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-white/10 blur-2xl"></div>
                            <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-24 h-24 rounded-full bg-black/10 blur-xl"></div>

                            <div className="relative z-10">
                                <h3 className="text-blue-100 dark:text-slate-400 font-bold uppercase tracking-widest text-sm mb-6">Resultado do Período</h3>
                                
                                {dateRange ? (
                                    <>
                                        <p className="text-white dark:text-slate-200 font-medium text-lg mb-6 leading-relaxed bg-black/10 dark:bg-slate-900/50 py-2 px-4 rounded-xl inline-block border border-white/10">
                                            De <span className="font-bold">{format(dateRange[0], "dd 'de' MMM", { locale: ptBR })}</span> <br />
                                            até <span className="font-bold">{format(dateRange[1], "dd 'de' MMM", { locale: ptBR })}</span>
                                        </p>
                                        <h1 className="text-4xl lg:text-5xl font-black text-white dark:text-blue-400 drop-shadow-md">
                                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(calcularVendasSelecionadas())}
                                        </h1>
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center justify-center text-blue-200 dark:text-slate-500 opacity-80">
                                        <FiCalendar size={48} className="mb-4 opacity-50" />
                                        <p className="font-medium text-lg max-w-[200px]">Selecione dias no calendário ao lado.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                </div>

            </main>
        </div>
    );
}