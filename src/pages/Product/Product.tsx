import { useState, type ChangeEvent, type FormEvent } from 'react';
import { FiSearch, FiPlus, FiEdit2, FiTrash2, FiImage, FiUploadCloud, FiX } from 'react-icons/fi';
import './Product.css';

// ==========================================
// 🟢 TIPAGENS E MOCK DATA
// ==========================================
type CategoryProps = { id: string; name: string; }
type ProductProps = {
    id: string;
    name: string;
    price: number;
    costPrice: number;
    description: string;
    categoryId: string;
    imageUrl?: string;
}

const MOCK_CATEGORIES: CategoryProps[] = [
    { id: '1', name: 'Hambúrgueres' },
    { id: '2', name: 'Bebidas' },
    { id: '3', name: 'Porções' },
    { id: '4', name: 'Sobremesas' }
];

const MOCK_PRODUCTS: ProductProps[] = [
    { id: 'p1', name: 'X-Burger Duplo', price: 35.90, costPrice: 12.00, description: 'Pão brioche, 2x carne 150g, queijo cheddar.', categoryId: '1' },
    { id: 'p2', name: 'Coca-Cola Lata 350ml', price: 6.00, costPrice: 2.50, description: 'Refrigerante gelado.', categoryId: '2' },
    { id: 'p3', name: 'Batata Frita Cheddar/Bacon', price: 42.00, costPrice: 15.00, description: 'Porção de 500g serve 2 pessoas.', categoryId: '3' },
    { id: 'p4', name: 'Pudim de Leite Condensado', price: 12.50, costPrice: 4.00, description: 'Pudim caseiro com calda.', categoryId: '4' },
    { id: 'p5', name: 'Smash Burger', price: 25.00, costPrice: 8.50, description: 'Pão, 2x smash 90g, american cheese.', categoryId: '1' },
];

export default function Product() {
    // Estados da Tela
    const [products, setProducts] = useState<ProductProps[]>(MOCK_PRODUCTS);
    const [search, setSearch] = useState('');
    const [filterCategory, setFilterCategory] = useState('');

    // Estados do Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    // Estados do Formulário
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [costPrice, setCostPrice] = useState('');
    const [description, setDescription] = useState('');
    const [categorySelected, setCategorySelected] = useState(MOCK_CATEGORIES[0]?.id || '');
    const [avatarUrl, setAvatarUrl] = useState('');
    const [imageAvatar, setImageAvatar] = useState<File | null>(null);

    // ==========================================
    // LÓGICA DE ABRIR/FECHAR MODAL
    // ==========================================
    function handleOpenCreate() {
        setEditingId(null);
        setName('');
        setPrice('');
        setCostPrice('');
        setDescription('');
        setCategorySelected(MOCK_CATEGORIES[0]?.id || '');
        setAvatarUrl('');
        setImageAvatar(null);
        setIsModalOpen(true);
    }

    function handleOpenEdit(product: ProductProps) {
        setEditingId(product.id);
        setName(product.name);
        setPrice(String(product.price));
        setCostPrice(String(product.costPrice));
        setDescription(product.description);
        setCategorySelected(product.categoryId);
        setAvatarUrl(product.imageUrl || '');
        setImageAvatar(null);
        setIsModalOpen(true);
    }

    function handleCloseModal() {
        setIsModalOpen(false);
    }

    // ==========================================
    // LÓGICA DE IMAGEM E SUBMIT (SIMULADO)
    // ==========================================
    function handleFile(e: ChangeEvent<HTMLInputElement>) {
        if (!e.target.files) return;
        const image = e.target.files[0];
        if (!image) return;
        if (image.type === 'image/jpeg' || image.type === 'image/png') {
            setImageAvatar(image);
            setAvatarUrl(URL.createObjectURL(image));
        }
    }

    function handleSave(event: FormEvent) {
        event.preventDefault();
        if (!name || !price) {
            alert('Preencha pelo menos o nome e o preço!');
            return;
        }

        // Simulação de Salvamento no Backend
        if (editingId) {
            // Editando
            const updatedProducts = products.map(p => p.id === editingId ? {
                ...p, name, price: Number(price), costPrice: Number(costPrice), description, categoryId: categorySelected, imageUrl: avatarUrl
            } : p);
            setProducts(updatedProducts);
            alert('Produto atualizado com sucesso!');
        } else {
            // Criando
            const newProduct: ProductProps = {
                id: Math.random().toString(),
                name, price: Number(price), costPrice: Number(costPrice), description, categoryId: categorySelected, imageUrl: avatarUrl
            };
            setProducts([...products, newProduct]);
            alert('Produto criado com sucesso!');
        }

        handleCloseModal();
    }

    function handleDelete(id: string) {
        if (window.confirm('Deseja realmente excluir este produto?')) {
            setProducts(products.filter(p => p.id !== id));
        }
    }

    // ==========================================
    // FILTROS DE TELA
    // ==========================================
    const searchLower = search.toLowerCase();
    const filteredProducts = products.filter(product => {
        const matchCategory = filterCategory === '' || product.categoryId === filterCategory;
        const matchSearch = product.name.toLowerCase().includes(searchLower);
        return matchCategory && matchSearch;
    });

    return (
        <div className="product-container">
            <main className="product-main">

                {/* CABEÇALHO */}
                <header className="product-header">
                    <h1 className="product-title">Catálogo de Produtos</h1>
                    <button onClick={handleOpenCreate} className="btn-primary">
                        <FiPlus size={20} />
                        Novo Produto
                    </button>
                </header>

                {/* BARRA DE FILTROS */}
                <div className="product-filters">
                    <div className="search-wrapper">
                        <FiSearch className="search-icon" size={20} />
                        <input
                            type="text"
                            placeholder="Buscar produto por nome..."
                            className="search-input"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <select
                        className="filter-select"
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                    >
                        <option value="">Todas as Categorias</option>
                        {MOCK_CATEGORIES.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                </div>

                {/* GRID DE PRODUTOS */}
                {filteredProducts.length === 0 ? (
                    <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '40px' }}>
                        Nenhum produto encontrado.
                    </div>
                ) : (
                    <div className="product-grid">
                        {filteredProducts.map(product => {
                            const categoryName = MOCK_CATEGORIES.find(c => c.id === product.categoryId)?.name;

                            return (
                                <article key={product.id} className="product-card">
                                    <div className="card-image-wrapper">
                                        <div className="card-category-badge">{categoryName}</div>
                                        {product.imageUrl ? (
                                            <img src={product.imageUrl} alt={product.name} className="card-image" />
                                        ) : (
                                            <FiImage size={48} className="card-no-image" />
                                        )}
                                    </div>

                                    <div className="card-content">
                                        <h3 className="card-title">{product.name}</h3>

                                        <div className="card-price-row">
                                            <div>
                                                <div className="card-cost">Custo: R$ {Number(product.costPrice).toFixed(2)}</div>
                                                <div className="card-price">R$ {Number(product.price).toFixed(2)}</div>
                                            </div>
                                        </div>

                                        <div className="card-actions">
                                            <button onClick={() => handleOpenEdit(product)} className="btn-edit">
                                                <FiEdit2 size={16} /> Editar
                                            </button>
                                            <button onClick={() => handleDelete(product.id)} className="btn-delete" title="Excluir">
                                                <FiTrash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </article>
                            )
                        })}
                    </div>
                )}

            </main>

            {/* ==========================================
                MODAL UNIFICADO (CRIAR / EDITAR)
            ========================================== */}
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content-lg">
                        <div className="modal-header">
                            <h2 className="modal-title">{editingId ? 'Editar Produto' : 'Cadastrar Novo Produto'}</h2>
                            <button onClick={handleCloseModal} className="modal-close"><FiX size={24} /></button>
                        </div>

                        <div className="modal-body">
                            <form onSubmit={handleSave} className="form-grid">

                                {/* Upload de Imagem (Ocupa as duas colunas no topo) */}
                                <div className="form-group full-width">
                                    <span className="form-label">Foto do Produto</span>
                                    <label className="upload-area">
                                        <input type="file" accept="image/png, image/jpeg" onChange={handleFile} style={{ display: 'none' }} />
                                        {avatarUrl ? (
                                            <img src={avatarUrl} alt="Preview" className="upload-preview" />
                                        ) : (
                                            <div className="upload-placeholder">
                                                <FiUploadCloud size={40} />
                                                <span>Clique para enviar foto</span>
                                            </div>
                                        )}
                                    </label>
                                </div>

                                <div className="form-group full-width">
                                    <span className="form-label">Nome do Produto *</span>
                                    <input
                                        type="text" required
                                        className="form-input" placeholder="Ex: X-Salada Duplo"
                                        value={name} onChange={(e) => setName(e.target.value)}
                                    />
                                </div>

                                <div className="form-group full-width">
                                    <span className="form-label">Categoria *</span>
                                    <select className="form-input" value={categorySelected} onChange={(e) => setCategorySelected(e.target.value)}>
                                        {MOCK_CATEGORIES.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <span className="form-label">Preço de Custo (R$)</span>
                                    <input
                                        type="number" step="0.01"
                                        className="form-input" placeholder="Ex: 5.50"
                                        value={costPrice} onChange={(e) => setCostPrice(e.target.value)}
                                    />
                                </div>

                                <div className="form-group">
                                    <span className="form-label">Preço de Venda (R$) *</span>
                                    <input
                                        type="number" step="0.01" required
                                        className="form-input" placeholder="Ex: 25.90"
                                        value={price} onChange={(e) => setPrice(e.target.value)}
                                    />
                                </div>

                                <div className="form-group full-width">
                                    <span className="form-label">Descrição (Opcional)</span>
                                    <textarea
                                        className="form-textarea" placeholder="Ingredientes e detalhes..."
                                        value={description} onChange={(e) => setDescription(e.target.value)}
                                    />
                                </div>

                                <div className="form-group full-width">
                                    <button type="submit" className="btn-save-full">
                                        {editingId ? 'Salvar Alterações' : 'Cadastrar Produto'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}