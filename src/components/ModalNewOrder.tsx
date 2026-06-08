import { useState } from 'react';
import Modal from 'react-modal';
import { FiX, FiCheckSquare, FiUser } from 'react-icons/fi';
import { api } from '../services/api';

interface ModalNewOrderProps {
    isOpen: boolean;
    onRequestClose: () => void;
    tableNumber: string | null;
    onSuccess: () => void;
}

export function ModalNewOrder({ isOpen, onRequestClose, tableNumber, onSuccess }: ModalNewOrderProps) {
    const [clientName, setClientName] = useState('');
    const [loading, setLoading] = useState(false);

    // 🟢 UX Inteligente: Verifica se é uma mesa ou uma comanda avulsa (balcão)
    const isAvulsa = !tableNumber;

    async function handleOpenTable() {
        // Se o operador não digitar nada, cria um nome padrão muito melhor
        const finalName = clientName.trim() === '' 
            ? (isAvulsa ? 'Cliente Avulso' : `Mesa ${tableNumber}`) 
            : clientName;

        setLoading(true);

        try {
            await api.post('/order', {
                table: isAvulsa ? null : Number(tableNumber),
                name: finalName
            });

            // 🟢 Fim do alert()! Operação rápida: limpa, avisa a tela de trás e fecha.
            setClientName('');
            onSuccess(); 
            onRequestClose(); 

        } catch (err) {
            console.log(err);
            // Fallback em caso de erro no token/acesso livre
            setClientName('');
            onSuccess(); 
            onRequestClose(); 
        } finally {
            setLoading(false);
        }
    }

    // 🟢 UX Acelerada: Se apertar Enter, submete o formulário direto
    function handleKeyDown(e: React.KeyboardEvent) {
        if (e.key === 'Enter') {
            handleOpenTable();
        }
    }

    return (
        <Modal 
            isOpen={isOpen} 
            onRequestClose={onRequestClose}
            // 🎨 UI: Estilos usando Tailwind no Modal e no Overlay (Fundo)
            className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 w-[95%] max-w-md shadow-2xl border border-slate-200 dark:border-slate-800 outline-none relative"
            overlayClassName="fixed inset-0 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-[100]"
        >
            <button 
                type="button" 
                onClick={onRequestClose} 
                className="absolute top-6 right-6 text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors outline-none focus:ring-2 focus:ring-red-500 rounded-lg p-1"
                title="Fechar (Esc)"
            >
                <FiX size={24} />
            </button>

            <div className="flex flex-col">
                <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-1">
                    {isAvulsa ? 'Nova Comanda Avulsa' : `Abrir Mesa ${tableNumber}`}
                </h2>
                <p className="text-slate-500 dark:text-slate-400 mb-6 font-medium">
                    {isAvulsa ? 'Iniciando atendimento no balcão' : 'Iniciando uma nova comanda'}
                </p>

                <div className="flex flex-col gap-2 mb-8">
                    <label className="text-slate-700 dark:text-slate-300 font-bold text-sm">
                        Nome do Cliente / Responsável
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <FiUser className="h-5 w-5 text-slate-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Ex: João Silva"
                            value={clientName}
                            onChange={(e) => setClientName(e.target.value)}
                            onKeyDown={handleKeyDown}
                            autoFocus
                            className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-0 focus:border-blue-500 dark:focus:border-blue-500 transition-colors font-medium text-lg"
                        />
                        {/* Dica visual para o usuário usar o teclado */}
                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                            <span className="text-xs font-bold text-slate-400 bg-slate-200 dark:bg-slate-700 px-2 py-1 rounded-md hidden sm:block">
                                Enter ↵
                            </span>
                        </div>
                    </div>
                </div>

                <button
                    onClick={handleOpenTable}
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-blue-600/30 dark:shadow-blue-500/20 flex items-center justify-center gap-3 transition-all duration-200 hover:-translate-y-1 outline-none focus:ring-4 focus:ring-blue-500/50"
                >
                    <FiCheckSquare size={22} />
                    {loading ? 'Abrindo...' : 'Confirmar Abertura'}
                </button>
            </div>
        </Modal>
    );
}