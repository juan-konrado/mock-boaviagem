import { useState, useMemo, type FormEvent, useEffect } from 'react';
import Modal from 'react-modal';
import { FiSearch, FiPlus, FiBox, FiLayers, FiAlertTriangle, FiEdit2, FiTrash2, FiChevronDown, FiChevronUp, FiX, FiCheckSquare } from 'react-icons/fi';
import './Estoque.css';

// ==========================================
// MOCKS E TIPAGENS
// ==========================================
const MOCK_CATEGORIES = [
    { id: 'c1', name: 'Hortifruti' }, { id: 'c2', name: 'Carnes e Frios' },
    { id: 'c3', name: 'Bebidas' }, { id: 'c4', name: 'Embalagens' }, { id: 'c5', name: 'Mercearia' },
];

const INITIAL_INSUMOS = [
    { id: '1', name: 'Pão de Hambúrguer Brioche', categoryId: 'c5', unit: 'UN', current: 12, min: 50, cost: 1.20 },
    { id: '2', name: 'Carne Bovina (Blend)', categoryId: 'c2', unit: 'KG', current: 15.5, min: 10, cost: 35.00 },
    { id: '3', name: 'Queijo Cheddar Fatiado', categoryId: 'c2', unit: 'KG', current: 0.8, min: 2, cost: 42.00 },
];

// MOCK DO CARDÁPIO 
const MOCK_MENU_CATEGORIES = [{ id: 'm1', name: 'Hambúrgueres' }, { id: 'm2', name: 'Bebidas' }];
const MOCK_MENU_PRODUCTS = [
    { id: 'prod1', categoryId: 'm1', name: 'X-Burger Duplo Especial' },
    { id: 'prod2', categoryId: 'm1', name: 'X-Salada Simples' },
    { id: 'prod3', categoryId: 'm2', name: 'Refrigerante 350ml' },
];

const INITIAL_RECEITAS = [
    {
        id: 'r1', productId: 'prod1', productName: 'X-Burger Duplo Especial',
        ingredients: [
            { insumoId: '1', name: 'Pão de Hambúrguer Brioche', qtd: 1, unit: 'UN' },
            { insumoId: '2', name: 'Carne Bovina (Blend)', qtd: 0.32, unit: 'KG' },
        ]
    }
];

export default function Estoque() {
    const [insumos, setInsumos] = useState(INITIAL_INSUMOS);
    const [receitas, setReceitas] = useState(INITIAL_RECEITAS);

    const [activeTab, setActiveTab] = useState<'insumos' | 'fichas'>('insumos');
    const [search, setSearch] = useState('');
    const [filterCategory, setFilterCategory] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [expandedRecipe, setExpandedRecipe] = useState<string | null>(null);

    // 🟢 ESTADOS DO MODAL INSUMO
    const [isModalInsumoOpen, setIsModalInsumoOpen] = useState(false);
    const [editingInsumoId, setEditingInsumoId] = useState<string | null>(null);
    const [formInsumo, setFormInsumo] = useState({ name: '', categoryId: 'c1', unit: 'UN', current: '', min: '', cost: '' });

    // 🟢 ESTADOS DO MODAL FICHA TÉCNICA
    const [isModalRecipeOpen, setIsModalRecipeOpen] = useState(false);
    const [editingRecipeId, setEditingRecipeId] = useState<string | null>(null);
    const [menuCatSelected, setMenuCatSelected] = useState(MOCK_MENU_CATEGORIES[0].id);
    const [menuProdSelected, setMenuProdSelected] = useState('');
    const [recipeIngredients, setRecipeIngredients] = useState<any[]>([]);

    // Auxiliares para compor a receita
    const [compInsumoId, setCompInsumoId] = useState('');
    const [compQtd, setCompQtd] = useState('');

    // ==========================================
    // LÓGICA DE INSUMOS
    // ==========================================
    function getStatusInfo(current: number, min: number) {
        if (current <= min * 0.3) return { status: 'critical', class: 'status-critical', icon: <FiAlertTriangle size={16} /> };
        if (current <= min) return { status: 'warning', class: 'status-warning', icon: <FiAlertTriangle size={16} /> };
        return { status: 'good', class: 'status-good', icon: null };
    }

    const filteredInsumos = useMemo(() => {
        return insumos.filter(item => {
            const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
            const matchCat = filterCategory ? item.categoryId === filterCategory : true;
            const itemStatus = getStatusInfo(item.current, item.min).status;
            const matchStatus = filterStatus ? itemStatus === filterStatus : true;
            return matchSearch && matchCat && matchStatus;
        });
    }, [insumos, search, filterCategory, filterStatus]);

    function handleDeleteInsumo(id: string, name: string) {
        if (window.confirm(`⚠️ Atenção: Tem certeza que deseja excluir permanentemente o insumo "${name}"?\nIsso pode afetar as fichas técnicas vinculadas.`)) {
            setInsumos(insumos.filter(i => i.id !== id));
        }
    }

    function handleSaveInsumo(e: FormEvent) {
        e.preventDefault();
        const novo = {
            ...formInsumo,
            id: editingInsumoId || Math.random().toString(),
            current: Number(formInsumo.current),
            min: Number(formInsumo.min),
            cost: Number(formInsumo.cost)
        };
        setInsumos(editingInsumoId ? insumos.map(i => i.id === editingInsumoId ? novo : i) : [novo, ...insumos]);
        setIsModalInsumoOpen(false);
    }

    // ==========================================
    // LÓGICA DE FICHAS TÉCNICAS
    // ==========================================
    const filteredReceitas = receitas.filter(item => item.productName.toLowerCase().includes(search.toLowerCase()));

    // 🟢 REGRA DE OURO: Só mostra produtos que AINDA NÃO TEM ficha técnica (ou o que está sendo editado agora)
    const availableMenuProducts = useMemo(() => {
        return MOCK_MENU_PRODUCTS.filter(p => {
            if (p.categoryId !== menuCatSelected) return false;

            const hasRecipe = receitas.some(r => r.productId === p.id);
            const isBeingEdited = editingRecipeId && receitas.find(r => r.id === editingRecipeId)?.productId === p.id;

            return !hasRecipe || isBeingEdited; // Mostra se não tiver receita, ou se for o dono da receita que estamos editando
        });
    }, [menuCatSelected, receitas, editingRecipeId]);

    // Seleciona automaticamente o primeiro produto válido da lista quando a categoria muda
    useEffect(() => {
        if (availableMenuProducts.length > 0) setMenuProdSelected(availableMenuProducts[0].id);
        else setMenuProdSelected('');
    }, [availableMenuProducts]);

    function handleOpenNewRecipe() {
        setEditingRecipeId(null);
        setMenuCatSelected(MOCK_MENU_CATEGORIES[0].id);
        setRecipeIngredients([]);
        setCompInsumoId(insumos[0]?.id || '');
        setCompQtd('');
        setIsModalRecipeOpen(true);
    }

    function handleEditRecipe(recipe: any) {
        // Encontra a categoria do produto no cardápio para setar os selects corretamente
        const prodRef = MOCK_MENU_PRODUCTS.find(p => p.id === recipe.productId);
        if (prodRef) {
            setMenuCatSelected(prodRef.categoryId);
            setMenuProdSelected(prodRef.id);
        }

        setEditingRecipeId(recipe.id);
        setRecipeIngredients([...recipe.ingredients]); // Cópia dos ingredientes
        setCompInsumoId(insumos[0]?.id || '');
        setCompQtd('');
        setIsModalRecipeOpen(true);
    }

    function handleAddIngredientToRecipe() {
        if (!compInsumoId || !compQtd) return;
        const insumoRef = insumos.find(i => i.id === compInsumoId);
        if (!insumoRef) return;

        const exists = recipeIngredients.find(i => i.insumoId === compInsumoId);
        if (exists) {
            setRecipeIngredients(recipeIngredients.map(i => i.insumoId === compInsumoId ? { ...i, qtd: i.qtd + Number(compQtd) } : i));
        } else {
            setRecipeIngredients([...recipeIngredients, { insumoId: insumoRef.id, name: insumoRef.name, qtd: Number(compQtd), unit: insumoRef.unit }]);
        }
        setCompQtd('');
    }

    function handleUpdateIngredientQtd(insumoId: string, novaQtd: string) {
        setRecipeIngredients(recipeIngredients.map(i => i.insumoId === insumoId ? { ...i, qtd: Number(novaQtd) } : i));
    }

    function handleRemoveIngredient(insumoId: string) {
        setRecipeIngredients(recipeIngredients.filter(i => i.insumoId !== insumoId));
    }

    function handleSaveRecipe(e: FormEvent) {
        e.preventDefault();
        const productRef = MOCK_MENU_PRODUCTS.find(p => p.id === menuProdSelected);
        if (!productRef) return;

        // 🟢 TRAVA DE SEGURANÇA: Impede salvar caso o filtro falhe por algum motivo
        const isDuplicate = receitas.some(r => r.productId === productRef.id && r.id !== editingRecipeId);
        if (isDuplicate) {
            alert('Atenção: Já existe uma Ficha Técnica cadastrada para este produto!');
            return;
        }

        const novaReceita = {
            id: editingRecipeId || Math.random().toString(),
            productId: productRef.id,
            productName: productRef.name,
            ingredients: recipeIngredients
        };

        setReceitas(editingRecipeId ? receitas.map(r => r.id === editingRecipeId ? novaReceita : r) : [novaReceita, ...receitas]);
        setIsModalRecipeOpen(false);
    }

    function handleDeleteRecipe(id: string, name: string) {
        if (window.confirm(`Deseja excluir a ficha técnica do produto "${name}"?`)) {
            setReceitas(receitas.filter(r => r.id !== id));
        }
    }

    return (
        <div className="estoque-container">
            <main className="estoque-main">
                <header className="estoque-header">
                    <div>
                        <h1 className="estoque-title">Controle de Estoque</h1>
                        <p className="estoque-subtitle">Gerencie matérias-primas e fichas técnicas de produtos</p>
                    </div>
                    <button className="btn-primary" onClick={activeTab === 'insumos' ? () => { setEditingInsumoId(null); setFormInsumo({ name: '', categoryId: MOCK_CATEGORIES[0].id, unit: 'UN', current: '', min: '', cost: '' }); setIsModalInsumoOpen(true); } : handleOpenNewRecipe}>
                        <FiPlus size={20} />
                        {activeTab === 'insumos' ? 'Novo Insumo' : 'Nova Ficha Técnica'}
                    </button>
                </header>

                <div className="estoque-tabs">
                    <button className={`tab-btn ${activeTab === 'insumos' ? 'active' : ''}`} onClick={() => setActiveTab('insumos')}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><FiBox size={18} /> Estoque de Insumos</div>
                    </button>
                    <button className={`tab-btn ${activeTab === 'fichas' ? 'active' : ''}`} onClick={() => setActiveTab('fichas')}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><FiLayers size={18} /> Fichas Técnicas</div>
                    </button>
                </div>

                <div className="estoque-actions">
                    <div className="search-wrapper" style={{ flex: 1, minWidth: '250px' }}>
                        <FiSearch className="search-icon" size={20} />
                        <input type="text" placeholder={activeTab === 'insumos' ? "Buscar insumo..." : "Buscar ficha..."} className="search-input" value={search} onChange={(e) => setSearch(e.target.value)} />
                    </div>

                    {activeTab === 'insumos' && (
                        <div className="filters-group">
                            <select className="filter-select" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
                                <option value="">Todas Categorias</option>
                                {MOCK_CATEGORIES.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                            </select>
                            <select className="filter-select" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                                <option value="">Todos Status</option>
                                <option value="critical">Crítico (Faltando)</option>
                                <option value="warning">Em Alerta</option>
                                <option value="good">Normal</option>
                            </select>
                        </div>
                    )}
                </div>

                {/* TELA 1: INSUMOS */}
                {activeTab === 'insumos' && (
                    <div className="table-wrapper">
                        <div className="table-header">
                            <div>Insumo / Categoria</div>
                            <div>Qtd Atual</div>
                            <div>Qtd Mínima</div>
                            <div>Custo (Medida)</div>
                            <div>Ações</div>
                        </div>

                        {filteredInsumos.map(item => {
                            const status = getStatusInfo(item.current, item.min);
                            const categoryName = MOCK_CATEGORIES.find(c => c.id === item.categoryId)?.name || 'Outros';

                            return (
                                <div key={item.id} className="table-row">
                                    <div className="item-info">
                                        <span className="item-name">{item.name}</span>
                                        <span className="item-category-badge">{categoryName}</span>
                                    </div>
                                    <div className={`stock-value ${status.class}`} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        {item.current} {item.unit} {status.icon}
                                    </div>
                                    <div style={{ color: 'var(--text-secondary)', fontWeight: 700 }}>{item.min} {item.unit}</div>
                                    <div style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>R$ {item.cost.toFixed(2).replace('.', ',')} / {item.unit}</div>

                                    <div className="actions-cell">
                                        <button className="btn-icon" onClick={() => { setEditingInsumoId(item.id); setFormInsumo({ name: item.name, categoryId: item.categoryId, unit: item.unit, current: String(item.current), min: String(item.min), cost: String(item.cost) }); setIsModalInsumoOpen(true); }}>
                                            <FiEdit2 size={18} />
                                        </button>
                                        <button className="btn-delete" onClick={() => handleDeleteInsumo(item.id, item.name)}>
                                            <FiTrash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}

                {/* TELA 2: FICHAS TÉCNICAS */}
                {activeTab === 'fichas' && (
                    <div className="recipes-wrapper">
                        {filteredReceitas.map(recipe => {
                            const isExpanded = expandedRecipe === recipe.id;

                            return (
                                <div key={recipe.id} className="recipe-card">
                                    <div className="recipe-header" onClick={() => setExpandedRecipe(isExpanded ? null : recipe.id)}>
                                        <div className="recipe-title">
                                            {recipe.productName}
                                            <span className="recipe-badge">{recipe.ingredients.length} Ingredientes</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                            <button className="btn-icon" onClick={(e) => { e.stopPropagation(); handleEditRecipe(recipe); }}>
                                                <FiEdit2 size={20} />
                                            </button>
                                            <button className="btn-delete" onClick={(e) => { e.stopPropagation(); handleDeleteRecipe(recipe.id, recipe.productName); }}>
                                                <FiTrash2 size={20} />
                                            </button>
                                            <div style={{ color: 'var(--text-secondary)', marginLeft: '12px' }}>
                                                {isExpanded ? <FiChevronUp size={24} /> : <FiChevronDown size={24} />}
                                            </div>
                                        </div>
                                    </div>

                                    {isExpanded && (
                                        <div className="recipe-body">
                                            <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '12px' }}>
                                                Baixa automática no estoque ao vender 1 unidade:
                                            </div>
                                            {recipe.ingredients.map((ing, idx) => (
                                                <div key={idx} className="ingredient-row">
                                                    <span>{ing.name}</span>
                                                    <span className="ingredient-qtd">- {ing.qtd} {ing.unit}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                )}
            </main>

            {/* ==========================================
                MODAL 1: CRIAR/EDITAR INSUMO
            ========================================== */}
            {isModalInsumoOpen && (
                <Modal isOpen={isModalInsumoOpen} onRequestClose={() => setIsModalInsumoOpen(false)} className="modal-box" overlayClassName="modal-overlay">
                    <div className="modal-header">
                        <h2 className="modal-title">{editingInsumoId ? 'Editar Insumo' : 'Novo Insumo'}</h2>
                        <button type="button" onClick={() => setIsModalInsumoOpen(false)} className="modal-close-btn" title="Fechar"><FiX size={24} /></button>
                    </div>

                    <form onSubmit={handleSaveInsumo} className="form-wrapper">
                        <div className="form-grid">
                            <div className="form-group full-width">
                                <label className="form-label">Nome da Matéria-Prima *</label>
                                <input required type="text" className="form-input" value={formInsumo.name} onChange={e => setFormInsumo({ ...formInsumo, name: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Categoria *</label>
                                <select className="form-select" value={formInsumo.categoryId} onChange={e => setFormInsumo({ ...formInsumo, categoryId: e.target.value })}>
                                    {MOCK_CATEGORIES.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Medido em *</label>
                                <select className="form-select" value={formInsumo.unit} onChange={e => setFormInsumo({ ...formInsumo, unit: e.target.value })}>
                                    <option value="UN">Unidade (UN)</option>
                                    <option value="KG">Quilo (KG)</option>
                                    <option value="L">Litro (L)</option>
                                    <option value="G">Grama (G)</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Estoque Atual *</label>
                                <input required type="number" step="0.01" className="form-input" value={formInsumo.current} onChange={e => setFormInsumo({ ...formInsumo, current: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Estoque Mínimo *</label>
                                <input required type="number" step="0.01" className="form-input" value={formInsumo.min} onChange={e => setFormInsumo({ ...formInsumo, min: e.target.value })} />
                            </div>
                            <div className="form-group full-width">
                                <label className="form-label">Preço de Custo (R$)</label>
                                <input required type="number" step="0.01" className="form-input" value={formInsumo.cost} onChange={e => setFormInsumo({ ...formInsumo, cost: e.target.value })} />
                            </div>
                        </div>

                        <div className="modal-actions">
                            <button type="button" className="btn-cancel" onClick={() => setIsModalInsumoOpen(false)}>Cancelar</button>
                            <button type="submit" className="btn-confirm-action" style={{ marginTop: 0, flex: 2 }}>
                                <FiCheckSquare size={20} /> {editingInsumoId ? 'Salvar Alterações' : 'Cadastrar Insumo'}
                            </button>
                        </div>
                    </form>
                </Modal>
            )}

            {/* ==========================================
                MODAL 2: CRIAR/EDITAR FICHA TÉCNICA
            ========================================== */}
            {isModalRecipeOpen && (
                <Modal isOpen={isModalRecipeOpen} onRequestClose={() => setIsModalRecipeOpen(false)} className="modal-box" overlayClassName="modal-overlay">
                    <div className="modal-header">
                        <h2 className="modal-title">{editingRecipeId ? 'Editar Ficha Técnica' : 'Nova Ficha Técnica'}</h2>
                        <button type="button" onClick={() => setIsModalRecipeOpen(false)} className="modal-close-btn"><FiX size={24} /></button>
                    </div>

                    <form onSubmit={handleSaveRecipe} className="form-wrapper">

                        <div className="form-grid">
                            <div className="form-group">
                                <label className="form-label">Filtrar Categoria do Cardápio</label>
                                <select className="form-select" value={menuCatSelected} onChange={(e) => setMenuCatSelected(e.target.value)}>
                                    {MOCK_MENU_CATEGORIES.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Produto que receberá a receita *</label>
                                <select className="form-select" value={menuProdSelected} onChange={(e) => setMenuProdSelected(e.target.value)} required disabled={availableMenuProducts.length === 0}>
                                    {availableMenuProducts.length === 0 && <option value="">Sem produtos sem ficha nesta categoria</option>}
                                    {availableMenuProducts.map(prod => <option key={prod.id} value={prod.id}>{prod.name}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="recipe-composer">
                            <h3 className="composer-title">Composição da Receita</h3>

                            <div className="add-ingredient-row">
                                <div className="form-group">
                                    <label className="form-label">Selecionar Insumo/Ingrediente</label>
                                    <select className="form-select" value={compInsumoId} onChange={e => setCompInsumoId(e.target.value)}>
                                        {insumos.map(i => <option key={i.id} value={i.id}>{i.name} ({i.unit})</option>)}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Qtd Gasta</label>
                                    <input type="number" step="0.001" min="0" className="form-input" placeholder="Ex: 0.15" value={compQtd} onChange={e => setCompQtd(e.target.value)} />
                                </div>
                                <button type="button" className="btn-add-ingredient" onClick={handleAddIngredientToRecipe}>Adicionar</button>
                            </div>

                            <div className="composition-list">
                                {recipeIngredients.length === 0 && <p style={{ color: 'var(--text-secondary)', textAlign: 'center', fontSize: '14px' }}>Nenhum ingrediente adicionado.</p>}

                                {recipeIngredients.map((item) => (
                                    <div key={item.insumoId} className="composition-item">
                                        <div className="composition-item-name">
                                            <FiLayers color="var(--text-secondary)" /> {item.name}
                                        </div>
                                        <div className="composition-item-actions">
                                            <input
                                                type="number"
                                                step="0.001"
                                                className="inline-qtd-input"
                                                value={item.qtd}
                                                onChange={(e) => handleUpdateIngredientQtd(item.insumoId, e.target.value)}
                                                title="Editar quantidade"
                                            />
                                            <span style={{ color: 'var(--text-secondary)', fontWeight: 700 }}>{item.unit}</span>

                                            <button type="button" className="btn-delete" onClick={() => handleRemoveIngredient(item.insumoId)}>
                                                <FiTrash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="modal-actions">
                            <button type="button" className="btn-cancel" onClick={() => setIsModalRecipeOpen(false)}>Cancelar</button>
                            <button type="submit" className="btn-confirm-action" style={{ marginTop: 0, flex: 2 }} disabled={!menuProdSelected}>
                                <FiCheckSquare size={20} /> Salvar Ficha Técnica
                            </button>
                        </div>
                    </form>
                </Modal>
            )}
        </div>
    );
}