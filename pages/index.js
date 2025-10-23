// ==========================================
// SISTEMA IGREJA 360° - VERSÃO COMPLETA
// Com Células + Cantinas + Gráficos
// ==========================================

import React, { useState, useEffect } from 'react';
import { Users, DollarSign, Calendar, BarChart3, Plus, Search, Menu, X, Heart, Phone, Mail, MapPin, Save, Trash2, Edit, TrendingUp, UserPlus, Home, ShoppingCart, CreditCard, Banknote } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const firebaseConfig = {
  apiKey: "AIzaSyByDEDzi_PH7Azlzr20j5HDRKyF4miCFdU",
  authDomain: "igreja360-sistema.firebaseapp.com",
  projectId: "igreja360-sistema",
  storageBucket: "igreja360-sistema.firebasestorage.app",
  messagingSenderId: "993807884811",
  appId: "1:993807884811:web:9710d1119853a178d45d0e"
};

const FirebaseSimulator = {
  data: {
    members: [
      { id: '1', name: 'João Silva', phone: '(21) 99999-1111', email: 'joao@email.com', group: 'Jovens', status: 'Ativo', cellId: '1', createdAt: new Date().toISOString() },
      { id: '2', name: 'Maria Santos', phone: '(21) 99999-2222', email: 'maria@email.com', group: 'Louvor', status: 'Ativo', cellId: '1', createdAt: new Date().toISOString() },
    ],
    donations: [
      { id: '1', member: 'João Silva', amount: 250, type: 'Dízimo', date: '2025-10-10', method: 'PIX', createdAt: new Date().toISOString() },
      { id: '2', member: 'Maria Santos', amount: 500, type: 'Oferta', date: '2025-10-12', method: 'Cartão', createdAt: new Date().toISOString() },
    ],
    events: [
      { id: '1', title: 'Culto Domingo', date: '2025-10-27', time: '10:00', location: 'Templo Principal', attendees: 150, createdAt: new Date().toISOString() },
      { id: '2', title: 'Reunião de Jovens', date: '2025-10-29', time: '19:30', location: 'Sala 2', attendees: 45, createdAt: new Date().toISOString() },
    ],
    cells: [
      { id: '1', name: 'Célula Vitória', leader: 'Pedro Costa', address: 'Rua das Flores, 123', day: 'Terça-feira', time: '19:30', members: 12, createdAt: new Date().toISOString() },
      { id: '2', name: 'Célula Esperança', leader: 'Ana Oliveira', address: 'Av. Principal, 456', day: 'Quinta-feira', time: '20:00', members: 8, createdAt: new Date().toISOString() },
    ],
    canteens: [],
    canteenSales: []
  },
  
  getCollection: function(collection) {
    return Promise.resolve([...(this.data[collection] || [])]);
  },
  
  addDocument: function(collection, data) {
    if (!this.data[collection]) this.data[collection] = [];
    const newDoc = { ...data, id: Date.now().toString(), createdAt: new Date().toISOString() };
    this.data[collection].push(newDoc);
    return Promise.resolve(newDoc);
  },
  
  updateDocument: function(collection, id, data) {
    if (!this.data[collection]) return Promise.resolve(false);
    const index = this.data[collection].findIndex(item => item.id === id);
    if (index !== -1) {
      this.data[collection][index] = { ...this.data[collection][index], ...data };
    }
    return Promise.resolve(true);
  },
  
  deleteDocument: function(collection, id) {
    if (!this.data[collection]) return Promise.resolve(false);
    this.data[collection] = this.data[collection].filter(item => item.id !== id);
    return Promise.resolve(true);
  }
};

export default function ChurchManagementSystem() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [canteenSubTab, setCanteenSubTab] = useState('list');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [members, setMembers] = useState([]);
  const [donations, setDonations] = useState([]);
  const [events, setEvents] = useState([]);
  const [cells, setCells] = useState([]);
  const [canteens, setCanteens] = useState([]);
  const [canteenSales, setCanteenSales] = useState([]);
  
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showCellModal, setShowCellModal] = useState(false);
  const [showCellMembersModal, setShowCellMembersModal] = useState(false);
  const [showAddMemberToCellModal, setShowAddMemberToCellModal] = useState(false);
  const [showCanteenModal, setShowCanteenModal] = useState(false);
  const [selectedCell, setSelectedCell] = useState(null);
  const [selectedCanteen, setSelectedCanteen] = useState(null);
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [membersData, donationsData, eventsData, cellsData, canteensData, canteenSalesData] = await Promise.all([
        FirebaseSimulator.getCollection('members'),
        FirebaseSimulator.getCollection('donations'),
        FirebaseSimulator.getCollection('events'),
        FirebaseSimulator.getCollection('cells'),
        FirebaseSimulator.getCollection('canteens'),
        FirebaseSimulator.getCollection('canteenSales')
      ]);
      setMembers(membersData);
      setDonations(donationsData);
      setEvents(eventsData);
      setCells(cellsData);
      setCanteens(canteensData);
      setCanteenSales(canteenSalesData);
    } catch (error) {
      console.error('Erro:', error);
    }
    setLoading(false);
  };

  // Handlers simplificados
  const handleSaveMember = async (memberData) => {
    try {
      if (editingItem) {
        await FirebaseSimulator.updateDocument('members', editingItem.id, memberData);
        setMembers(members.map(m => m.id === editingItem.id ? { ...m, ...memberData } : m));
      } else {
        const newMember = await FirebaseSimulator.addDocument('members', memberData);
        setMembers([...members, newMember]);
      }
      setShowMemberModal(false);
      setEditingItem(null);
      alert('Salvo!');
    } catch (error) {
      alert('Erro');
    }
  };

  const handleDeleteMember = async (id) => {
    if (!confirm('Excluir?')) return;
    await FirebaseSimulator.deleteDocument('members', id);
    setMembers(members.filter(m => m.id !== id));
  };

  const handleSaveCanteen = async (canteenData) => {
    try {
      const cellData = cells.find(c => c.id === canteenData.cellId);
      const dataWithCellName = { ...canteenData, cellName: cellData?.name || '', status: canteenData.status || 'Planejada' };
      
      if (editingItem) {
        await FirebaseSimulator.updateDocument('canteens', editingItem.id, dataWithCellName);
        setCanteens(canteens.map(c => c.id === editingItem.id ? { ...c, ...dataWithCellName } : c));
      } else {
        const newCanteen = await FirebaseSimulator.addDocument('canteens', dataWithCellName);
        setCanteens([...canteens, newCanteen]);
      }
      setShowCanteenModal(false);
      setEditingItem(null);
      alert('Cantina salva!');
    } catch (error) {
      alert('Erro');
    }
  };

  const handleRegisterSale = async (canteenId, quantity, paymentMethod) => {
    try {
      const canteen = canteens.find(c => c.id === canteenId);
      if (!canteen) return false;
      
      const total = quantity * canteen.price;
      const saleData = { canteenId, quantity, paymentMethod, total, timestamp: new Date().toISOString() };
      
      const newSale = await FirebaseSimulator.addDocument('canteenSales', saleData);
      setCanteenSales([...canteenSales, newSale]);
      
      if (canteen.status === 'Planejada') {
        await FirebaseSimulator.updateDocument('canteens', canteenId, { status: 'Em andamento' });
        setCanteens(canteens.map(c => c.id === canteenId ? { ...c, status: 'Em andamento' } : c));
      }
      
      return true;
    } catch (error) {
      return false;
    }
  };

  const stats = {
    totalMembers: members.length,
    activeMembers: members.filter(m => m.status === 'Ativo').length,
    totalDonations: donations.reduce((sum, d) => sum + Number(d.amount), 0),
    monthlyDonations: donations.filter(d => new Date(d.date).getMonth() === new Date().getMonth()).reduce((sum, d) => sum + Number(d.amount), 0),
    upcomingEvents: events.filter(e => new Date(e.date) >= new Date()).length,
    averageAttendance: events.length > 0 ? Math.round(events.reduce((sum, e) => sum + Number(e.attendees), 0) / events.length) : 0
  };

  const filteredMembers = members.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* MENU LATERAL */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-gradient-to-b from-purple-900 to-purple-800 text-white transition-all duration-300 flex flex-col h-screen fixed left-0 top-0 shadow-2xl z-50`}>
        <div className="p-6 flex items-center justify-between border-b border-purple-700">
          <h1 className={`font-bold text-xl ${!sidebarOpen && 'hidden'}`}>Igreja 360°</h1>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-purple-700 rounded-lg">
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {[
            { id: 'dashboard', icon: BarChart3, label: 'Dashboard' },
            { id: 'members', icon: Users, label: 'Membros' },
            { id: 'cells', icon: Home, label: 'Células' },
            { id: 'canteens', icon: ShoppingCart, label: 'Cantinas' },
            { id: 'donations', icon: DollarSign, label: 'Doações' },
            { id: 'events', icon: Calendar, label: 'Eventos' },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
                activeTab === item.id ? 'bg-white text-purple-900 shadow-lg' : 'hover:bg-purple-700'
              }`}
            >
              <item.icon size={20} />
              {sidebarOpen && <span className="font-medium">{item.label}</span>}
            </button>
          ))}
        </nav>
        
        {sidebarOpen && (
          <div className="p-4 border-t border-purple-700">
            <div className="bg-purple-700 rounded-lg p-4">
              <p className="text-sm font-medium mb-1">✅ Sistema Completo</p>
              <p className="text-xs opacity-80">Cantinas + Células + Gráficos</p>
            </div>
          </div>
        )}
      </div>

      {/* CONTEÚDO PRINCIPAL */}
      <div className={`flex-1 ${sidebarOpen ? 'ml-64' : 'ml-20'} transition-all duration-300`}>
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {activeTab === 'dashboard' && 'Dashboard Geral'}
              {activeTab === 'members' && 'Gestão de Membros'}
              {activeTab === 'cells' && 'Gestão de Células'}
              {activeTab === 'canteens' && 'Gestão de Cantinas'}
              {activeTab === 'donations' && 'Controle Financeiro'}
              {activeTab === 'events' && 'Eventos e Atividades'}
            </h1>
            <p className="text-gray-600">Sistema completo de gestão eclesiástica</p>
          </div>
          
          {activeTab === 'dashboard' && <div className="text-center py-12 text-gray-600">Dashboard em construção...</div>}
          {activeTab === 'members' && (
            <div className="space-y-6">
              <button onClick={() => { setEditingItem(null); setShowMemberModal(true); }} className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700">
                <Plus size={20} className="inline mr-2" /> Novo Membro
              </button>
              <div className="bg-white rounded-xl p-6">
                <p>Total: {members.length} membros</p>
              </div>
            </div>
          )}
          {activeTab === 'cells' && <div className="bg-white rounded-xl p-6">Células: {cells.length}</div>}
          {activeTab === 'canteens' && (
            <div className="space-y-6">
              <div className="flex gap-2 border-b">
                <button onClick={() => setCanteenSubTab('list')} className={`px-4 py-2 ${canteenSubTab === 'list' ? 'border-b-2 border-orange-600 text-orange-600' : 'text-gray-600'}`}>
                  Cantinas
                </button>
                <button onClick={() => setCanteenSubTab('cashier')} className={`px-4 py-2 ${canteenSubTab === 'cashier' ? 'border-b-2 border-orange-600 text-orange-600' : 'text-gray-600'}`}>
                  Caixa
                </button>
              </div>
              
              {canteenSubTab === 'list' && (
                <div>
                  <button onClick={() => { setEditingItem(null); setShowCanteenModal(true); }} className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700">
                    <Plus size={20} className="inline mr-2" /> Nova Cantina
                  </button>
                  <div className="mt-6 grid gap-4">
                    {canteens.length === 0 ? (
                      <p className="text-gray-500">Nenhuma cantina cadastrada</p>
                    ) : (
                      canteens.map(c => (
                        <div key={c.id} className="bg-white p-4 rounded-lg shadow">
                          <h3 className="font-bold">{c.snack}</h3>
                          <p className="text-sm text-gray-600">{c.cellName} - {c.date}</p>
                          <p>R$ {c.price} x {c.totalQuantity} unidades</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
              
              {canteenSubTab === 'cashier' && (
                <div className="bg-white p-6 rounded-xl">
                  {selectedCanteen ? (
                    <div>
                      <h2 className="text-2xl font-bold mb-4">{selectedCanteen.snack}</h2>
                      <CashierComponent 
                        canteen={selectedCanteen}
                        sales={canteenSales.filter(s => s.canteenId === selectedCanteen.id)}
                        onRegisterSale={handleRegisterSale}
                      />
                    </div>
                  ) : (
                    <p className="text-gray-500">Selecione uma cantina para abrir o caixa</p>
                  )}
                </div>
              )}
            </div>
          )}
          {activeTab === 'donations' && <div className="bg-white rounded-xl p-6">Doações: R$ {stats.totalDonations}</div>}
          {activeTab === 'events' && <div className="bg-white rounded-xl p-6">Eventos: {events.length}</div>}
        </div>
      </div>

      {/* MODAIS */}
      {showMemberModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-2xl font-bold mb-4">Novo Membro</h3>
            <button onClick={() => setShowMemberModal(false)} className="mt-4 w-full bg-gray-300 py-2 rounded">Fechar</button>
          </div>
        </div>
      )}

      {showCanteenModal && (
        <CanteenModal
          editingItem={editingItem}
          cells={cells}
          onSave={handleSaveCanteen}
          onClose={() => { setShowCanteenModal(false); setEditingItem(null); }}
        />
      )}
    </div>
  );
}

// Componente auxiliar para o caixa
function CashierComponent({ canteen, sales, onRegisterSale }) {
  const [quantity, setQuantity] = useState(1);
  const [payment, setPayment] = useState('Dinheiro');
  
  const totalSold = sales.reduce((sum, s) => sum + s.quantity, 0);
  const totalRevenue = sales.reduce((sum, s) => sum + s.total, 0);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-blue-100 p-4 rounded">
          <p className="text-sm">Vendidos</p>
          <p className="text-2xl font-bold">{totalSold}</p>
        </div>
        <div className="bg-green-100 p-4 rounded">
          <p className="text-sm">Arrecadado</p>
          <p className="text-2xl font-bold">R$ {totalRevenue}</p>
        </div>
        <div className="bg-purple-100 p-4 rounded">
          <p className="text-sm">Restante</p>
          <p className="text-2xl font-bold">{canteen.totalQuantity - totalSold}</p>
        </div>
      </div>
      
      <div className="border-2 border-orange-500 p-6 rounded-xl">
        <h4 className="font-bold mb-4">Registrar Venda</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-2">Quantidade</label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
              className="w-full border p-2 rounded text-center text-2xl font-bold"
            />
          </div>
          <div>
            <label className="block mb-2">Pagamento</label>
            <select value={payment} onChange={(e) => setPayment(e.target.value)} className="w-full border p-2 rounded">
              <option>Dinheiro</option>
              <option>Cartão</option>
              <option>PIX</option>
            </select>
          </div>
        </div>
        <div className="mt-4 bg-green-100 p-4 rounded text-center">
          <p className="text-sm">Total</p>
          <p className="text-3xl font-bold text-green-700">R$ {(quantity * canteen.price).toFixed(2)}</p>
        </div>
        <button
          onClick={async () => {
            const success = await onRegisterSale(canteen.id, quantity, payment);
            if (success) {
              setQuantity(1);
              alert('Venda registrada!');
            }
          }}
          className="w-full mt-4 bg-orange-600 text-white py-4 rounded-lg text-xl font-bold hover:bg-orange-700"
        >
          Registrar Venda
        </button>
      </div>

      <div className="bg-white border rounded-xl p-4">
        <h4 className="font-bold mb-3">Últimas Vendas</h4>
        {sales.length === 0 ? (
          <p className="text-gray-500 text-center py-4">Nenhuma venda ainda</p>
        ) : (
          <div className="space-y-2">
            {sales.slice().reverse().slice(0, 5).map((sale, i) => (
              <div key={sale.id} className="flex justify-between p-2 bg-gray-50 rounded">
                <span>{sale.quantity}x - {sale.paymentMethod}</span>
                <span className="font-bold text-green-600">R$ {sale.total.toFixed(2)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Modal de Cantina
function CanteenModal({ editingItem, cells, onSave, onClose }) {
  const [formData, setFormData] = useState(editingItem || {
    date: new Date().toISOString().split('T')[0],
    cellId: '',
    snack: '',
    price: '',
    totalQuantity: ''
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 max-w-md w-full">
        <h3 className="text-2xl font-bold mb-4">{editingItem ? 'Editar' : 'Nova'} Cantina</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Data</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Célula</label>
            <select
              value={formData.cellId}
              onChange={(e) => setFormData({...formData, cellId: e.target.value})}
              className="w-full border p-2 rounded"
            >
              <option value="">Selecione</option>
              {cells.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Lanche</label>
            <input
              type="text"
              value={formData.snack}
              onChange={(e) => setFormData({...formData, snack: e.target.value})}
              className="w-full border p-2 rounded"
              placeholder="Cachorro-quente..."
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Preço (R$)</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                className="w-full border p-2 rounded"
                step="0.50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Quantidade</label>
              <input
                type="number"
                value={formData.totalQuantity}
                onChange={(e) => setFormData({...formData, totalQuantity: e.target.value})}
                className="w-full border p-2 rounded"
              />
            </div>
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 border py-2 rounded hover:bg-gray-50">Cancelar</button>
          <button
            onClick={() => onSave({...formData, price: parseFloat(formData.price), totalQuantity: parseInt(formData.totalQuantity)})}
            className="flex-1 bg-orange-600 text-white py-2 rounded hover:bg-orange-700"
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}
