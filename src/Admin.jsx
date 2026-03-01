import React, { useState, useEffect } from 'react';
import './Admin.css';
import { useMenu } from './MenuContext';

const initialOrders = [
    { id: '#1204', customer: 'Зочин', items: 'Бууз (x10), Хуушуур (x5)', total: '27,000₮', locationType: 'table', locationNumber: '12', status: 'pending', time: '10:30' },
    { id: '#1205', customer: 'Зочин', items: 'Pizza Margherita (x1)', total: '35,000₮', locationType: 'room', locationNumber: '302', status: 'completed', time: '10:15' },
    { id: '#1206', customer: 'Зочин', items: 'Chef Special Burger (x2)', total: '44,000₮', locationType: 'table', locationNumber: '05', status: 'pending', time: '10:05' },
];

function Admin() {
    const {
        menuItems, addProduct, deleteProduct, updateProduct, toggleProductStatus,
        categories, addCategory, deleteCategory
    } = useMenu();
    const [activeTab, setActiveTab] = useState('orders');
    const [orders, setOrders] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newProduct, setNewProduct] = useState({
        title: '',
        category: 'buuz',
        price: '',
        description: '',
        tags: ''
    });

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [uploading, setUploading] = useState(false);

    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [newCategory, setNewCategory] = useState({
        id: '',
        name: '',
        icon: '🍽️'
    });

    // Load orders from localStorage
    useEffect(() => {
        const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
        // Merge initial mock orders with saved orders for demo purposes
        if (savedOrders.length === 0 && localStorage.getItem('orders_initialized') !== 'true') {
            localStorage.setItem('orders', JSON.stringify(initialOrders));
            localStorage.setItem('orders_initialized', 'true');
            setOrders(initialOrders);
        } else {
            setOrders(savedOrders);
        }
    }, []);

    const handleAddSubmit = (e) => {
        e.preventDefault();
        addProduct({
            ...newProduct,
            price: parseInt(newProduct.price) || 0
        });
        setNewProduct({ title: '', category: 'buuz', price: '', description: '', tags: '' });
        setIsModalOpen(false);
    };

    const handleEditClick = (product) => {
        setEditingProduct({
            ...product,
            tags: Array.isArray(product.tags) ? product.tags.join(', ') : product.tags
        });
        setIsEditModalOpen(true);
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        if (!editingProduct) return;

        const { id, ...data } = editingProduct;
        updateProduct(id, {
            ...data,
            price: parseInt(data.price) || 0
        });
        setIsEditModalOpen(false);
        setEditingProduct(null);
    };

    const handleCategorySubmit = (e) => {
        e.preventDefault();
        addCategory(newCategory);
        setNewCategory({ id: '', name: '', icon: '🍽️' });
        setIsCategoryModalOpen(false);
    };

    const updateOrderStatus = (id) => {
        const updated = orders.map(order =>
            order.id === id ? { ...order, status: 'completed' } : order
        );
        setOrders(updated);
        localStorage.setItem('orders', JSON.stringify(updated));
    };

    return (
        <div className="admin-container">
            <aside className="sidebar">
                <div className="sidebar-logo gradient-text">NOMAD ADMIN</div>
                <ul className="nav-menu">
                    <li className={`nav-item ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>📦 Захиалгууд</li>
                    <li className={`nav-item ${activeTab === 'products' ? 'active' : ''}`} onClick={() => setActiveTab('products')}>🍔 Хоолны цэс</li>
                    <li className={`nav-item ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>👥 Хэрэглэгчид</li>
                    <li className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>⚙️ Тохиргоо</li>
                </ul>
                <div className="nav-item" style={{ marginTop: 'auto' }}>🚪 Гарах</div>
            </aside>

            <main className="admin-main">
                <header className="admin-header">
                    <h2>
                        {activeTab === 'orders' && 'Resort-ын Захиалгууд'}
                        {activeTab === 'products' && 'Цэсний удирдлага'}
                        {activeTab === 'users' && 'Хэрэглэгчид'}
                        {activeTab === 'settings' && 'Системийн Тохиргоо'}
                    </h2>
                    {activeTab === 'products' && (
                        <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
                            + Шинэ хоол нэмэх
                        </button>
                    )}
                    {activeTab === 'orders' && (
                        <button className="btn-primary">
                            Тайлан татах
                        </button>
                    )}
                </header>

                <section className="stats-grid">
                    <div className="stat-card"><div className="stat-label">Өнөөдрийн орлого</div><div className="stat-value">1,250,000₮</div></div>
                    <div className="stat-card"><div className="stat-label">Нийт захиалга</div><div className="stat-value">{orders.length}</div></div>
                    <div className="stat-card"><div className="stat-label">Хүлээгдэж буй</div><div className="stat-value">{orders.filter(o => o.status === 'pending').length}</div></div>
                    <div className="stat-card"><div className="stat-label">Шинэ хэрэглэгч</div><div className="stat-value">5</div></div>
                </section>

                {activeTab === 'orders' && (
                    <table className="order-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Байршил</th>
                                <th>Захиалга</th>
                                <th>Дүн</th>
                                <th>Хугацаа</th>
                                <th>Төлөв</th>
                                <th>Үйлдэл</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(order => (
                                <tr key={order.id}>
                                    <td>{order.id}</td>
                                    <td>
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{order.locationType === 'room' ? 'Өрөө' : 'Ширээ'}</span>
                                            <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>{order.locationNumber}</span>
                                        </div>
                                    </td>
                                    <td style={{ maxWidth: '250px', fontSize: '0.9rem' }}>{order.items}</td>
                                    <td style={{ fontWeight: 700, color: 'var(--secondary)' }}>{order.total}</td>
                                    <td style={{ color: 'var(--text-muted)' }}>{order.time}</td>
                                    <td>
                                        <span className={`status-badge status-${order.status}`}>
                                            {order.status === 'pending' ? 'Хүлээгдэж буй' : 'Хүргэгдсэн'}
                                        </span>
                                    </td>
                                    <td>
                                        <button className="btn-icon">👁️</button>
                                        {order.status === 'pending' && <button className="btn-icon" onClick={() => updateOrderStatus(order.id)}>✅</button>}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                {activeTab === 'products' && (
                    <table className="order-table">
                        <thead>
                            <tr><th>Зураг</th><th>Нэр</th><th>Төрөл</th><th>Үнэ</th><th>Тайлбар</th><th>Үйлдэл</th></tr>
                        </thead>
                        <tbody>
                            {menuItems.map(item => (
                                <tr key={item.id} style={{ opacity: item.isActive === false ? 0.5 : 1 }}>
                                    <td>
                                        <div style={{ position: 'relative', width: '40px', height: '40px' }}>
                                            <img src={item.image} alt="" style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }} />
                                            {item.isActive === false && (
                                                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: 'white' }}>OFF</div>
                                            )}
                                        </div>
                                    </td>
                                    <td style={{ fontWeight: 600 }}>
                                        {item.title}
                                        {item.isActive === false && <span style={{ marginLeft: '10px', fontSize: '10px', padding: '2px 5px', background: '#ff4444', borderRadius: '4px', verticalAlign: 'middle' }}>Идэвхгүй</span>}
                                    </td>
                                    <td><span className="tag" style={{ background: 'var(--glass)', color: 'var(--primary)' }}>{item.category}</span></td>
                                    <td style={{ color: 'var(--secondary)', fontWeight: 700 }}>{item.price.toLocaleString()}₮</td>
                                    <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)', maxWidth: '200px' }}>{item.description}</td>
                                    <td>
                                        <button className="btn-icon" title="Засах" onClick={() => handleEditClick(item)}>✏️</button>
                                        <button className="btn-icon" title={item.isActive === false ? "Идэвхжүүлэх" : "Идэвхгүй болгох"} onClick={() => toggleProductStatus(item.id, item.isActive)}>
                                            {item.isActive === false ? '👁️‍🗨️' : '👁️'}
                                        </button>
                                        <button className="btn-icon" title="Устгах" onClick={() => { if (window.confirm('Устгахдаа итгэлтэй байна уу?')) deleteProduct(item.id) }}>🗑️</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                {activeTab === 'users' && (
                    <div style={{ textAlign: 'center', padding: '5rem', background: 'var(--bg-card)', borderRadius: '20px', border: '1px solid var(--glass-border)' }}>
                        <h3 style={{ marginBottom: '1rem' }}>Хэрэглэгчийн удирдлага удахгүй нэмэгдэнэ</h3>
                        <p style={{ color: 'var(--text-muted)' }}>Одоогоор зөнхөн үзүүлэх зорилгоор оруулсан болно.</p>
                    </div>
                )}

                {activeTab === 'settings' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <div style={{ background: 'var(--bg-card)', padding: '2.5rem', borderRadius: '20px', border: '1px solid var(--glass-border)' }}>
                            <h3 style={{ marginBottom: '2rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem' }}>Вэб сайтын тохиргоо</h3>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
                                <div className="form-group">
                                    <label>Рестораны нэр</label>
                                    <input type="text" defaultValue="NOMAD RESORT" />
                                </div>
                                <div className="form-group">
                                    <label>Холбоо барих утас</label>
                                    <input type="text" defaultValue="7700-0000" />
                                </div>
                                <div className="form-group">
                                    <label>Нээх цаг</label>
                                    <input type="time" defaultValue="09:00" />
                                </div>
                                <div className="form-group">
                                    <label>Хаах цаг</label>
                                    <input type="time" defaultValue="23:00" />
                                </div>
                            </div>

                            <div className="form-group" style={{ marginBottom: '2rem' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                    <input type="checkbox" defaultChecked style={{ width: 'auto' }} />
                                    <span>Захиалга авах (Идэвхтэй)</span>
                                </label>
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Энэ сонголтыг унтраавал хэрэглэгчид шинээр захиалга өгөх боломжгүй болно.</p>
                            </div>

                            <div className="form-group" style={{ marginBottom: '2rem' }}>
                                <label>Хүргэлтийн нэмэлт хураамж (₮)</label>
                                <input type="number" defaultValue="0" style={{ width: '50%' }} />
                            </div>

                            <button className="btn-primary">Хадгалах</button>
                        </div>

                        <div style={{ background: 'var(--bg-card)', padding: '2.5rem', borderRadius: '20px', border: '1px solid var(--glass-border)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem' }}>
                                <h3>Ангиллын удирдлага</h3>
                                <button className="btn-primary" onClick={() => setIsCategoryModalOpen(true)}>
                                    + Ангилал нэмэх
                                </button>
                            </div>

                            <table className="order-table">
                                <thead>
                                    <tr>
                                        <th>Дүрсэлбэр</th>
                                        <th>Ангиллын нэр</th>
                                        <th>ID</th>
                                        <th>Үйлдэл</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {categories.map((cat) => (
                                        <tr key={cat.id}>
                                            <td style={{ fontSize: '1.5rem' }}>
                                                {cat.icon.startsWith('/') ? <img src={cat.icon} alt="" style={{ width: '30px', height: '30px' }} /> : cat.icon}
                                            </td>
                                            <td style={{ fontWeight: 600 }}>{cat.name}</td>
                                            <td style={{ color: 'var(--text-muted)' }}>{cat.id}</td>
                                            <td>
                                                <button className="btn-icon">✏️</button>
                                                {cat.id !== 'all' && (
                                                    <button className="btn-icon" onClick={() => deleteCategory(cat.id)}>🗑️</button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </main>

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="admin-modal glass-morphism">
                        <h2 style={{ marginBottom: '1.5rem' }}>Шинэ хоол нэмэх</h2>
                        <form onSubmit={handleAddSubmit}>
                            <div className="form-group">
                                <label>Зураг сонгох</label>
                                <input type="file" accept="image/*" onChange={e => setNewProduct({ ...newProduct, imageFile: e.target.files[0] })} />
                            </div>
                            <div className="form-group">
                                <label>Хоолны нэр</label>
                                <input type="text" required value={newProduct.title} onChange={e => setNewProduct({ ...newProduct, title: e.target.value })} placeholder="ж.нь: Татсан махтай хуушуур" />
                            </div>
                            <div className="form-group">
                                <label>Ангилал</label>
                                <select value={newProduct.category} onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}>
                                    {categories.filter(c => c.id !== 'all').map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Үнэ (₮)</label>
                                <input type="number" required value={newProduct.price} onChange={e => setNewProduct({ ...newProduct, price: e.target.value })} placeholder="35000" />
                            </div>
                            <div className="form-group">
                                <label>Тайлбар</label>
                                <textarea rows="3" value={newProduct.description} onChange={e => setNewProduct({ ...newProduct, description: e.target.value })} placeholder="Хоолны дэлгэрэнгүй тайлбар..."></textarea>
                            </div>
                            <div className="form-group">
                                <label>Тагууд (таслалаар тусгаарлах)</label>
                                <input type="text" value={newProduct.tags} onChange={e => setNewProduct({ ...newProduct, tags: e.target.value })} placeholder="Best Seller, Spicy" />
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                                <button type="submit" className="btn-primary" style={{ flex: 1 }} disabled={uploading}>
                                    {uploading ? 'Хуулж байна...' : 'Нэмэх'}
                                </button>
                                <button type="button" className="btn-primary" onClick={() => setIsModalOpen(false)} style={{ flex: 1, background: 'var(--glass)' }}>Цуцлах</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {isEditModalOpen && editingProduct && (
                <div className="modal-overlay">
                    <div className="admin-modal glass-morphism">
                        <h2 style={{ marginBottom: '1.5rem' }}>Хоол засах</h2>
                        <form onSubmit={handleEditSubmit}>
                            <div className="form-group">
                                <label>Зураг солих</label>
                                <input type="file" accept="image/*" onChange={e => setEditingProduct({ ...editingProduct, imageFile: e.target.files[0] })} />
                            </div>
                            <div className="form-group">
                                <label>Хоолны нэр</label>
                                <input type="text" required value={editingProduct.title} onChange={e => setEditingProduct({ ...editingProduct, title: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label>Ангилал</label>
                                <select value={editingProduct.category} onChange={e => setEditingProduct({ ...editingProduct, category: e.target.value })}>
                                    {categories.filter(c => c.id !== 'all').map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Үнэ (₮)</label>
                                <input type="number" required value={editingProduct.price} onChange={e => setEditingProduct({ ...editingProduct, price: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label>Тайлбар</label>
                                <textarea rows="3" value={editingProduct.description} onChange={e => setEditingProduct({ ...editingProduct, description: e.target.value })}></textarea>
                            </div>
                            <div className="form-group">
                                <label>Тагууд (таслалаар тусгаарлах)</label>
                                <input type="text" value={editingProduct.tags} onChange={e => setEditingProduct({ ...editingProduct, tags: e.target.value })} />
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                                <button type="submit" className="btn-primary" style={{ flex: 1, background: 'var(--secondary)' }} disabled={uploading}>
                                    {uploading ? 'Хуулж байна...' : 'Хадгалах'}
                                </button>
                                <button type="button" className="btn-primary" onClick={() => setIsEditModalOpen(false)} style={{ flex: 1, background: 'var(--glass)' }}>Цуцлах</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {isCategoryModalOpen && (
                <div className="modal-overlay">
                    <div className="admin-modal glass-morphism">
                        <h2 style={{ marginBottom: '1.5rem' }}>Шинэ ангилал нэмэх</h2>
                        <form onSubmit={handleCategorySubmit}>
                            <div className="form-group">
                                <label>Ангиллын ID (англиар, хоосон зайгүй)</label>
                                <input type="text" required value={newCategory.id} onChange={e => setNewCategory({ ...newCategory, id: e.target.value.toLowerCase().replace(/\s+/g, '-') })} placeholder="ж.нь: soup" />
                            </div>
                            <div className="form-group">
                                <label>Ангиллын нэр (монголоор)</label>
                                <input type="text" required value={newCategory.name} onChange={e => setNewCategory({ ...newCategory, name: e.target.value })} placeholder="ж.нь: Шөл" />
                            </div>
                            <div className="form-group">
                                <label>Дүрсэлбэр (Emoji эсвэл зурагны зам)</label>
                                <input type="text" value={newCategory.icon} onChange={e => setNewCategory({ ...newCategory, icon: e.target.value })} placeholder="🥣" />
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                                <button type="submit" className="btn-primary" style={{ flex: 1 }}>Нэмэх</button>
                                <button type="button" className="btn-primary" onClick={() => setIsCategoryModalOpen(false)} style={{ flex: 1, background: 'var(--glass)' }}>Цуцлах</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Admin;
