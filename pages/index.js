);
  };

  const Canteens = () => {
    const todayCanteens = canteens.filter(c => c.date === new Date().toISOString().split('T')[0] && c.status !== 'Finalizada');
    
    const CanteensList = () => (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">Gestão de Cantinas</h2>
          <button onClick={() => { setEditingItem(null); setShowCanteenModal(true); }} className="flex items-center gap-2 bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors shadow-lg">
            <Plus size={20} /> Nova Cantina
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg">
            <p className="text-sm opacity-90 mb-2">Cantinas Agendadas</p>
            <p className="text-3xl font-bold">{canteens.filter(c => c.status === 'Planejada').length}</p>
          </div>
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
            <p className="text-sm opacity-90 mb-2">Em Andamento</p>
            <p className="text-3xl font-bold">{canteens.filter(c => c.status === 'Em andamento').length}</p>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
            <p className="text-sm opacity-90 mb-2">Total Arrecadado</p>
            <p className="text-3xl font-bold">R$ {canteenSales.reduce((sum, s) => sum + s.total, 0).toLocaleString('pt-BR')}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {canteens.sort((a, b) => new Date(b.date) - new Date(a.date)).map(canteen => {
            const sales = canteenSales.filter(s => s.canteenId === canteen.id);
            const totalSold = sales.reduce((sum, s) => sum + s.quantity, 0);
            const totalRevenue = sales.reduce((sum, s) => sum + s.total, 0);
            
            return (
              <div key={canteen.id} className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <ShoppingCart size={24} className="text-orange-600" />
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">{canteen.snack}</h3>
                        <p className="text-sm text-gray-600">{canteen.cellName}</p>
                      </div>
                    </div>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-gray-700">
                        <Calendar size={16} className="text-orange-600" />
                        <span className="text-sm">{canteen.date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <DollarSign size={16} className="text-green-600" />
                        <span className="text-sm font-semibold">R$ {canteen.price.toFixed(2)} por unidade</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <ShoppingCart size={16} className="text-blue-600" />
                        <span className="text-sm">Quantidade planejada: {canteen.totalQuantity}</span>
                      </div>
                    </div>
                    {sales.length > 0 && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-sm text-gray-600">Vendidos</p>
                            <p className="text-2xl font-bold text-green-700">{totalSold}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-600">Arrecadado</p>
                            <p className="text-2xl font-bold text-green-700">R$ {totalRevenue.toLocaleString('pt-BR')}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    canteen.status === 'Planejada' ? 'bg-blue-100 text-blue-700' :
                    canteen.status === 'Em andamento' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {canteen.status}
                  </span>
                </div>
                <div className="flex gap-2">
                  {canteen.status !== 'Finalizada' && (
                    <button onClick={() => { setSelectedCanteen(canteen); setCanteenSubTab('cashier'); }} className="flex-1 bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700 transition-all font-medium flex items-center justify-center gap-2">
                      <CreditCard size={18} /> Abrir Caixa
                    </button>
                  )}
                  <button onClick={() => { setEditingItem(canteen); setShowCanteenModal(true); }} className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-all">
                    <Edit size={18} />
                  </button>
                  <button onClick={() => handleDeleteCanteen(canteen.id)} className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-all">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {canteens.length === 0 && (
          <div className="bg-white rounded-xl p-12 text-center text-gray-500 shadow-lg">
            <ShoppingCart size={48} className="mx-auto mb-4 text-gray-400" />
            <p className="text-lg font-semibold mb-2">Nenhuma cantina cadastrada</p>
            <p className="text-sm">Comece criando sua primeira cantina!</p>
          </div>
        )}
      </div>
    );

    const CashierPDV = () => {
      if (!selectedCanteen) {
        if (todayCanteens.length === 0) {
          return (
            <div className="bg-white rounded-xl p-12 text-center shadow-lg">
              <ShoppingCart size={48} className="mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-semibold text-gray-700 mb-2">Nenhuma cantina hoje</p>
              <p className="text-sm text-gray-600 mb-6">Agende uma cantina para usar o caixa</p>
              <button onClick={() => setCanteenSubTab('list')} className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700">
                Ver Todas as Cantinas
              </button>
            </div>
          );
        }
        setSelectedCanteen(todayCanteens[0]);
        return null;
      }

      const [saleQuantity, setSaleQuantity] = useState(1);
      const [paymentMethod, setPaymentMethod] = useState('Dinheiro');
      
      const sales = canteenSales.filter(s => s.canteenId === selectedCanteen.id);
      const totalSold = sales.reduce((sum, s) => sum + s.quantity, 0);
      const totalRevenue = sales.reduce((sum, s) => sum + s.total, 0);
      
      const salesByMethod = {
        Dinheiro: sales.filter(s => s.paymentMethod === 'Dinheiro').reduce((sum, s) => sum + s.total, 0),
        Cartão: sales.filter(s => s.paymentMethod === 'Cartão').reduce((sum, s) => sum + s.total, 0),
        PIX: sales.filter(s => s.paymentMethod === 'PIX').reduce((sum, s) => sum + s.total, 0),
      };

      const handleQuickSale = async () => {
        if (saleQuantity < 1) {
          alert('Quantidade deve ser maior que zero!');
          return;
        }
        
        const success = await handleRegisterSale(selectedCanteen.id, saleQuantity, paymentMethod);
        if (success) {
          setSaleQuantity(1);
        }
      };

      return (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Caixa / PDV</h2>
              <p className="text-gray-600">{selectedCanteen.snack} - {selectedCanteen.cellName}</p>
            </div>
            <div className="flex gap-2">
              {selectedCanteen.status !== 'Finalizada' && (
                <button onClick={() => handleFinishCanteen(selectedCanteen.id)} className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700">
                  Finalizar Cantina
                </button>
              )}
              <button onClick={() => { setSelectedCanteen(null); setCanteenSubTab('list'); }} className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700">
                Voltar
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg">
              <p className="text-sm opacity-90 mb-2">Preço Unitário</p>
              <p className="text-3xl font-bold">R$ {selectedCanteen.price.toFixed(2)}</p>
            </div>
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
              <p className="text-sm opacity-90 mb-2">Vendidos</p>
              <p className="text-3xl font-bold">{totalSold} / {selectedCanteen.totalQuantity}</p>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
              <p className="text-sm opacity-90 mb-2">Total Arrecadado</p>
              <p className="text-3xl font-bold">R$ {totalRevenue.toLocaleString('pt-BR')}</p>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
              <p className="text-sm opacity-90 mb-2">Restante</p>
              <p className="text-3xl font-bold">{selectedCanteen.totalQuantity - totalSold}</p>
            </div>
          </div>

          {selectedCanteen.status !== 'Finalizada' && (
            <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-orange-500">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Registrar Venda</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Quantidade</label>
                  <input
                    type="number"
                    min="1"
                    value={saleQuantity}
                    onChange={(e) => setSaleQuantity(parseInt(e.target.value) || 1)}
                    className="w-full px-4 py-3 text-2xl font-bold border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 text-center"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Forma de Pagamento</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  >
                    <option>Dinheiro</option>
                    <option>Cartão</option>// ==========================================
// SISTEMA IGREJA 360° - VERSÃO COMPLETA
// Com Gráficos + Gestão de Células
// ==========================================

import React, { useState, useEffect } from 'react';
import { Users, DollarSign, Calendar, BarChart3, Plus, Search, Menu, X, Heart, Phone, Mail, MapPin, Save, Trash2, Edit, TrendingUp, UserPlus, Home, ShoppingCart, CreditCard, Banknote } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// ==========================================
// CONFIGURAÇÃO DO FIREBASE
// ==========================================
const firebaseConfig = {
  apiKey: "AIzaSyByDEDzi_PH7Azlzr20j5HDRKyF4miCFdU",
  authDomain: "igreja360-sistema.firebaseapp.com",
  projectId: "igreja360-sistema",
  storageBucket: "igreja360-sistema.firebasestorage.app",
  messagingSenderId: "993807884811",
  appId: "1:993807884811:web:9710d1119853a178d45d0e"
};

// ==========================================
// SIMULAÇÃO DE FIREBASE
// ==========================================
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
      { id: '1', title: 'Culto Domingo', date: '2025-10-20', time: '10:00', location: 'Templo Principal', attendees: 150, createdAt: new Date().toISOString() },
      { id: '2', title: 'Reunião de Jovens', date: '2025-10-22', time: '19:30', location: 'Sala 2', attendees: 45, createdAt: new Date().toISOString() },
    ],
    cells: [
      { id: '1', name: 'Célula Vitória', leader: 'Pedro Costa', address: 'Rua das Flores, 123', day: 'Terça-feira', time: '19:30', members: 12, createdAt: new Date().toISOString() },
      { id: '2', name: 'Célula Esperança', leader: 'Ana Oliveira', address: 'Av. Principal, 456', day: 'Quinta-feira', time: '20:00', members: 8, createdAt: new Date().toISOString() },
    ],
    canteens: [
      { id: '1', date: '2025-10-25', cellId: '1', cellName: 'Célula Vitória', snack: 'Cachorro-quente', price: 8, totalQuantity: 100, status: 'Planejada', createdAt: new Date().toISOString() },
      { id: '2', date: '2025-10-18', cellId: '2', cellName: 'Célula Esperança', snack: 'Coxinha + Refrigerante', price: 10, totalQuantity: 80, status: 'Finalizada', createdAt: new Date().toISOString() },
    ],
    canteenSales: [
      { id: '1', canteenId: '2', quantity: 5, paymentMethod: 'Dinheiro', total: 50, timestamp: new Date().toISOString() },
      { id: '2', canteenId: '2', quantity: 3, paymentMethod: 'PIX', total: 30, timestamp: new Date().toISOString() },
      { id: '3', canteenId: '2', quantity: 8, paymentMethod: 'Cartão', total: 80, timestamp: new Date().toISOString() },
    ]
  },
  
  getCollection: function(collection) {
    return Promise.resolve([...this.data[collection] || []]);
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
      console.error('Erro ao carregar dados:', error);
      alert('Erro ao carregar dados.');
    }
    setLoading(false);
  };

  const handleSaveMember = async (memberData) => {
    try {
      if (editingItem) {
        await FirebaseSimulator.updateDocument('members', editingItem.id, memberData);
        setMembers(members.map(m => m.id === editingItem.id ? { ...m, ...memberData } : m));
        alert('Membro atualizado!');
      } else {
        const newMember = await FirebaseSimulator.addDocument('members', memberData);
        setMembers([...members, newMember]);
        alert('Membro cadastrado!');
      }
      setShowMemberModal(false);
      setEditingItem(null);
    } catch (error) {
      alert('Erro ao salvar membro.');
    }
  };

  const handleDeleteMember = async (id) => {
    if (!confirm('Excluir este membro?')) return;
    try {
      await FirebaseSimulator.deleteDocument('members', id);
      setMembers(members.filter(m => m.id !== id));
      alert('Membro excluído!');
    } catch (error) {
      alert('Erro ao excluir.');
    }
  };

  const handleSaveDonation = async (donationData) => {
    try {
      if (editingItem) {
        await FirebaseSimulator.updateDocument('donations', editingItem.id, donationData);
        setDonations(donations.map(d => d.id === editingItem.id ? { ...d, ...donationData } : d));
        alert('Doação atualizada!');
      } else {
        const newDonation = await FirebaseSimulator.addDocument('donations', donationData);
        setDonations([...donations, newDonation]);
        alert('Doação registrada!');
      }
      setShowDonationModal(false);
      setEditingItem(null);
    } catch (error) {
      alert('Erro ao salvar doação.');
    }
  };

  const handleDeleteDonation = async (id) => {
    if (!confirm('Excluir esta doação?')) return;
    try {
      await FirebaseSimulator.deleteDocument('donations', id);
      setDonations(donations.filter(d => d.id !== id));
      alert('Doação excluída!');
    } catch (error) {
      alert('Erro ao excluir.');
    }
  };

  const handleSaveEvent = async (eventData) => {
    try {
      if (editingItem) {
        await FirebaseSimulator.updateDocument('events', editingItem.id, eventData);
        setEvents(events.map(e => e.id === editingItem.id ? { ...e, ...eventData } : e));
        alert('Evento atualizado!');
      } else {
        const newEvent = await FirebaseSimulator.addDocument('events', eventData);
        setEvents([...events, newEvent]);
        alert('Evento criado!');
      }
      setShowEventModal(false);
      setEditingItem(null);
    } catch (error) {
      alert('Erro ao salvar evento.');
    }
  };

  const handleDeleteEvent = async (id) => {
    if (!confirm('Excluir este evento?')) return;
    try {
      await FirebaseSimulator.deleteDocument('events', id);
      setEvents(events.filter(e => e.id !== id));
      alert('Evento excluído!');
    } catch (error) {
      alert('Erro ao excluir.');
    }
  };

  const handleSaveCell = async (cellData) => {
    try {
      if (editingItem) {
        await FirebaseSimulator.updateDocument('cells', editingItem.id, cellData);
        setCells(cells.map(c => c.id === editingItem.id ? { ...c, ...cellData } : c));
        alert('Célula atualizada!');
      } else {
        const newCell = await FirebaseSimulator.addDocument('cells', cellData);
        setCells([...cells, newCell]);
        alert('Célula criada!');
      }
      setShowCellModal(false);
      setEditingItem(null);
    } catch (error) {
      alert('Erro ao salvar célula.');
    }
  };

  const handleDeleteCell = async (id) => {
    if (!confirm('Excluir esta célula?')) return;
    try {
      await FirebaseSimulator.deleteDocument('cells', id);
      setCells(cells.filter(c => c.id !== id));
      alert('Célula excluída!');
    } catch (error) {
      alert('Erro ao excluir.');
    }
  };

  const handleRemoveMemberFromCell = async (memberId) => {
    if (!confirm('Remover este membro da célula?')) return;
    try {
      await FirebaseSimulator.updateDocument('members', memberId, { cellId: '' });
      setMembers(members.map(m => m.id === memberId ? { ...m, cellId: '' } : m));
      alert('Membro removido da célula!');
    } catch (error) {
      alert('Erro ao remover membro.');
    }
  };

  const handleAddMemberToCell = async (memberId, cellId) => {
    try {
      await FirebaseSimulator.updateDocument('members', memberId, { cellId: cellId });
      setMembers(members.map(m => m.id === memberId ? { ...m, cellId: cellId } : m));
      setShowAddMemberToCellModal(false);
      alert('Membro vinculado à célula com sucesso!');
    } catch (error) {
      alert('Erro ao vincular membro.');
    }
  };

  // ==========================================
  // FUNÇÕES DE CANTINAS
  // ==========================================
  const handleSaveCanteen = async (canteenData) => {
    try {
      const cellData = cells.find(c => c.id === canteenData.cellId);
      const dataWithCellName = { ...canteenData, cellName: cellData?.name || '' };
      
      if (editingItem) {
        await FirebaseSimulator.updateDocument('canteens', editingItem.id, dataWithCellName);
        setCanteens(canteens.map(c => c.id === editingItem.id ? { ...c, ...dataWithCellName } : c));
        alert('Cantina atualizada!');
      } else {
        const newCanteen = await FirebaseSimulator.addDocument('canteens', dataWithCellName);
        setCanteens([...canteens, newCanteen]);
        alert('Cantina cadastrada!');
      }
      setShowCanteenModal(false);
      setEditingItem(null);
    } catch (error) {
      alert('Erro ao salvar cantina.');
    }
  };

  const handleDeleteCanteen = async (id) => {
    if (!confirm('Excluir esta cantina?')) return;
    try {
      await FirebaseSimulator.deleteDocument('canteens', id);
      setCanteens(canteens.filter(c => c.id !== id));
      // Deletar vendas associadas
      const relatedSales = canteenSales.filter(s => s.canteenId === id);
      for (const sale of relatedSales) {
        await FirebaseSimulator.deleteDocument('canteenSales', sale.id);
      }
      setCanteenSales(canteenSales.filter(s => s.canteenId !== id));
      alert('Cantina excluída!');
    } catch (error) {
      alert('Erro ao excluir.');
    }
  };

  const handleRegisterSale = async (canteenId, quantity, paymentMethod) => {
    try {
      const canteen = canteens.find(c => c.id === canteenId);
      if (!canteen) return;
      
      const total = quantity * canteen.price;
      const saleData = {
        canteenId,
        quantity,
        paymentMethod,
        total,
        timestamp: new Date().toISOString()
      };
      
      const newSale = await FirebaseSimulator.addDocument('canteenSales', saleData);
      setCanteenSales([...canteenSales, newSale]);
      
      // Atualizar status da cantina para "Em andamento"
      if (canteen.status === 'Planejada') {
        await FirebaseSimulator.updateDocument('canteens', canteenId, { status: 'Em andamento' });
        setCanteens(canteens.map(c => c.id === canteenId ? { ...c, status: 'Em andamento' } : c));
      }
      
      return true;
    } catch (error) {
      alert('Erro ao registrar venda.');
      return false;
    }
  };

  const handleFinishCanteen = async (canteenId) => {
    if (!confirm('Finalizar esta cantina? Não será possível adicionar mais vendas.')) return;
    try {
      await FirebaseSimulator.updateDocument('canteens', canteenId, { status: 'Finalizada' });
      setCanteens(canteens.map(c => c.id === canteenId ? { ...c, status: 'Finalizada' } : c));
      alert('Cantina finalizada!');
      setCanteenSubTab('list');
    } catch (error) {
      alert('Erro ao finalizar.');
    }
  };

  const stats = {
    totalMembers: members.length,
    activeMembers: members.filter(m => m.status === 'Ativo').length,
    totalDonations: donations.reduce((sum, d) => sum + Number(d.amount), 0),
    monthlyDonations: donations.filter(d => {
      const donationDate = new Date(d.date);
      const now = new Date();
      return donationDate.getMonth() === now.getMonth();
    }).reduce((sum, d) => sum + Number(d.amount), 0),
    upcomingEvents: events.filter(e => new Date(e.date) >= new Date()).length,
    averageAttendance: events.length > 0 ? Math.round(events.reduce((sum, e) => sum + Number(e.attendees), 0) / events.length) : 0
  };

  const filteredMembers = members.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const Navigation = () => (
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
            <p className="text-xs opacity-80">Células + Cantinas + Gráficos</p>
          </div>
        </div>
      )}
    </div>
  );

  const Dashboard = () => {
    const memberGrowthData = [
      { mes: 'Mai', membros: members.length > 0 ? Math.max(1, members.length - 25) : 0 },
      { mes: 'Jun', membros: members.length > 0 ? Math.max(1, members.length - 20) : 0 },
      { mes: 'Jul', membros: members.length > 0 ? Math.max(1, members.length - 15) : 0 },
      { mes: 'Ago', membros: members.length > 0 ? Math.max(1, members.length - 10) : 0 },
      { mes: 'Set', membros: members.length > 0 ? Math.max(1, members.length - 5) : 0 },
      { mes: 'Out', membros: members.length || 0 },
    ];

    const donationGrowthData = [
      { mes: 'Mai', valor: stats.monthlyDonations > 0 ? Math.round(stats.monthlyDonations * 0.7) : 0 },
      { mes: 'Jun', valor: stats.monthlyDonations > 0 ? Math.round(stats.monthlyDonations * 0.75) : 0 },
      { mes: 'Jul', valor: stats.monthlyDonations > 0 ? Math.round(stats.monthlyDonations * 0.85) : 0 },
      { mes: 'Ago', valor: stats.monthlyDonations > 0 ? Math.round(stats.monthlyDonations * 0.9) : 0 },
      { mes: 'Set', valor: stats.monthlyDonations > 0 ? Math.round(stats.monthlyDonations * 0.95) : 0 },
      { mes: 'Out', valor: stats.monthlyDonations || 0 },
    ];

    const donationTypeData = [
      { name: 'Dízimo', value: donations.filter(d => d.type === 'Dízimo').length || 1 },
      { name: 'Oferta', value: donations.filter(d => d.type === 'Oferta').length || 1 },
      { name: 'Missões', value: donations.filter(d => d.type === 'Missões').length || 0 },
      { name: 'Outros', value: donations.filter(d => !['Dízimo', 'Oferta', 'Missões'].includes(d.type)).length || 0 },
    ].filter(item => item.value > 0);

    const COLORS = ['#8b5cf6', '#10b981', '#f59e0b', '#3b82f6'];

    const eventAttendanceData = events.slice(0, 6).map(event => ({
      nome: event.title.length > 15 ? event.title.substring(0, 15) + '...' : event.title,
      presença: event.attendees
    }));

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { label: 'Total de Membros', value: stats.totalMembers, icon: Users, color: 'from-blue-500 to-blue-600', change: `${stats.activeMembers} ativos` },
            { label: 'Doações do Mês', value: `R$ ${stats.monthlyDonations.toLocaleString('pt-BR')}`, icon: DollarSign, color: 'from-green-500 to-green-600', change: 'Este mês' },
            { label: 'Próximos Eventos', value: stats.upcomingEvents, icon: Calendar, color: 'from-purple-500 to-purple-600', change: 'Agendados' },
            { label: 'Membros Ativos', value: stats.activeMembers, icon: Heart, color: 'from-pink-500 to-pink-600', change: `${stats.totalMembers > 0 ? Math.round((stats.activeMembers/stats.totalMembers)*100) : 0}%` },
            { label: 'Total Arrecadado', value: `R$ ${stats.totalDonations.toLocaleString('pt-BR')}`, icon: DollarSign, color: 'from-yellow-500 to-yellow-600', change: 'Total geral' },
            { label: 'Total de Células', value: cells.length, icon: Home, color: 'from-indigo-500 to-indigo-600', change: `${cells.reduce((sum, c) => sum + Number(c.members), 0)} pessoas` },
          ].map((stat, i) => (
            <div key={i} className={`bg-gradient-to-br ${stat.color} rounded-xl p-6 text-white shadow-lg hover:scale-105 transition-transform`}>
              <div className="flex items-center justify-between mb-4">
                <stat.icon size={32} className="opacity-80" />
                <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">{stat.change}</span>
              </div>
              <p className="text-3xl font-bold mb-1">{stat.value}</p>
              <p className="text-sm opacity-90">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="text-blue-600" size={24} />
              <h3 className="text-lg font-bold text-gray-800">Crescimento de Membros</h3>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={memberGrowthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="mes" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
                <Line type="monotone" dataKey="membros" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6', r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="text-green-600" size={24} />
              <h3 className="text-lg font-bold text-gray-800">Evolução Financeira</h3>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={donationGrowthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="mes" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }} formatter={(value) => `R$ ${value.toLocaleString('pt-BR')}`} />
                <Bar dataKey="valor" fill="#10b981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="text-purple-600" size={24} />
              <h3 className="text-lg font-bold text-gray-800">Distribuição de Doações</h3>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={donationTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  dataKey="value"
                >
                  {donationTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="text-indigo-600" size={24} />
              <h3 className="text-lg font-bold text-gray-800">Frequência em Eventos</h3>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={eventAttendanceData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" stroke="#666" />
                <YAxis dataKey="nome" type="category" stroke="#666" width={100} />
                <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
                <Bar dataKey="presença" fill="#6366f1" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    );
  };

  const Members = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Buscar membros..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
        <button onClick={() => { setEditingItem(null); setShowMemberModal(true); }} className="ml-4 flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors shadow-lg">
          <Plus size={20} /> Novo Membro
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-purple-600 to-purple-700 text-white">
            <tr>
              <th className="text-left p-4 font-semibold">Nome</th>
              <th className="text-left p-4 font-semibold">Contato</th>
              <th className="text-left p-4 font-semibold">Grupo</th>
              <th className="text-left p-4 font-semibold">Status</th>
              <th className="text-left p-4 font-semibold">Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredMembers.map((member, i) => (
              <tr key={member.id} className={`border-b border-gray-100 hover:bg-purple-50 transition-colors ${i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                      {member.name.charAt(0)}
                    </div>
                    <span className="font-semibold text-gray-800">{member.name}</span>
                  </div>
                </td>
                <td className="p-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone size={14} />{member.phone}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail size={14} />{member.email}
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">{member.group}</span>
                </td>
                <td className="p-4">
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">{member.status}</span>
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <button onClick={() => { setEditingItem(member); setShowMemberModal(true); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                      <Edit size={18} />
                    </button>
                    <button onClick={() => handleDeleteMember(member.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredMembers.length === 0 && <div className="p-8 text-center text-gray-500">Nenhum membro encontrado</div>}
      </div>
    </div>
  );

  const Cells = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Gestão de Células</h2>
        <button onClick={() => { setEditingItem(null); setShowCellModal(true); }} className="flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors shadow-lg">
          <Plus size={20} /> Nova Célula
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
          <p className="text-sm opacity-90 mb-2">Total de Células</p>
          <p className="text-3xl font-bold">{cells.length}</p>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
          <p className="text-sm opacity-90 mb-2">Total de Participantes</p>
          <p className="text-3xl font-bold">{cells.reduce((sum, c) => sum + Number(c.members), 0)}</p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
          <p className="text-sm opacity-90 mb-2">Média por Célula</p>
          <p className="text-3xl font-bold">{cells.length > 0 ? Math.round(cells.reduce((sum, c) => sum + Number(c.members), 0) / cells.length) : 0}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cells.map(cell => (
          <div key={cell.id} className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center">
                    <Home size={24} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{cell.name}</h3>
                    <p className="text-sm text-gray-600">Líder: {cell.leader}</p>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-gray-700">
                    <MapPin size={16} className="text-purple-600" />
                    <span className="text-sm">{cell.address}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Calendar size={16} className="text-purple-600" />
                    <span className="text-sm">{cell.day} às {cell.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Users size={16} className="text-purple-600" />
                    <span className="text-sm font-semibold">{cell.members} participantes</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full transition-all" style={{ width: `${Math.min((cell.members / 15) * 100, 100)}%` }}></div>
                  </div>
                  <span className="text-xs text-gray-600">{cell.members}/15</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button onClick={() => { setEditingItem(cell); setShowCellModal(true); }} className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-all font-medium flex items-center justify-center gap-2">
                <Edit size={18} /> Editar
              </button>
              <button onClick={() => handleDeleteCell(cell.id)} className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-all font-medium flex items-center justify-center gap-2">
                <Trash2 size={18} />
              </button>
            </div>

            <button className="w-full mt-2 bg-purple-100 text-purple-700 py-2 rounded-lg hover:bg-purple-200 transition-all font-medium flex items-center justify-center gap-2" onClick={() => { setSelectedCell(cell); setShowCellMembersModal(true); }}>
              <UserPlus size={18} /> Ver Membros ({members.filter(m => m.cellId === cell.id).length})
            </button>
          </div>
        ))}
      </div>

      {cells.length === 0 && (
        <div className="bg-white rounded-xl p-12 text-center text-gray-500 shadow-lg">
          <Home size={48} className="mx-auto mb-4 text-gray-400" />
          <p className="text-lg font-semibold mb-2">Nenhuma célula cadastrada</p>
          <p className="text-sm">Comece criando sua primeira célula!</p>
        </div>
      )}
    </div>
  );

  const Donations = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Gestão Financeira</h2>
        <button onClick={() => { setEditingItem(null); setShowDonationModal(true); }} className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors shadow-lg">
          <Plus size={20} /> Registrar Doação
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
          <p className="text-sm opacity-90 mb-2">Total Arrecadado</p>
          <p className="text-3xl font-bold">R$ {stats.totalDonations.toLocaleString('pt-BR')}</p>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
          <p className="text-sm opacity-90 mb-2">Média Mensal</p>
          <p className="text-3xl font-bold">R$ {stats.monthlyDonations.toLocaleString('pt-BR')}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
          <p className="text-sm opacity-90 mb-2">Total de Doações</p>
          <p className="text-3xl font-bold">{donations.length}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-green-600 to-green-700 text-white">
            <tr>
              <th className="text-left p-4 font-semibold">Doador</th>
              <th className="text-left p-4 font-semibold">Tipo</th>
              <th className="text-left p-4 font-semibold">Valor</th>
              <th className="text-left p-4 font-semibold">Método</th>
              <th className="text-left p-4 font-semibold">Data</th>
              <th className="text-left p-4 font-semibold">Ações</th>
            </tr>
          </thead>
          <tbody>
            {donations.map((donation, i) => (
              <tr key={donation.id} className={`border-b border-gray-100 hover:bg-green-50 transition-colors ${i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                <td className="p-4 font-semibold text-gray-800">{donation.member}</td>
                <td className="p-4"><span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">{donation.type}</span></td>
                <td className="p-4 text-green-600 font-bold text-lg">R$ {Number(donation.amount).toLocaleString('pt-BR')}</td>
                <td className="p-4 text-gray-600">{donation.method}</td>
                <td className="p-4 text-gray-600">{donation.date}</td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <button onClick={() => { setEditingItem(donation); setShowDonationModal(true); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit size={18} /></button>
                    <button onClick={() => handleDeleteDonation(donation.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={18} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {donations.length === 0 && <div className="p-8 text-center text-gray-500">Nenhuma doação registrada</div>}
      </div>
    </div>
  );

  const Events = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Calendário de Eventos</h2>
        <button onClick={() => { setEditingItem(null); setShowEventModal(true); }} className="flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors shadow-lg">
          <Plus size={20} /> Criar Evento
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {events.map(event => (
          <div key={event.id} className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{event.title}</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-600"><Calendar size={16} /><span className="text-sm">{event.date} às {event.time}</span></div>
                  <div className="flex items-center gap-2 text-gray-600"><MapPin size={16} /><span className="text-sm">{event.location}</span></div>
                </div>
              </div>
              <div className="bg-purple-100 text-purple-700 px-4 py-2 rounded-lg text-center">
                <p className="text-2xl font-bold">{event.attendees}</p>
                <p className="text-xs">confirmados</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => { setEditingItem(event); setShowEventModal(true); }} className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-all font-medium flex items-center justify-center gap-2">
                <Edit size={18} /> Editar
              </button>
              <button onClick={() => handleDeleteEvent(event.id)} className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-all font-medium flex items-center justify-center gap-2">
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
      {events.length === 0 && <div className="bg-white rounded-xl p-12 text-center text-gray-500 shadow-lg">Nenhum evento cadastrado</div>}
    </div>
  );

  const MemberModal = () => {
    const [formData, setFormData] = useState(editingItem || { name: '', phone: '', email: '', group: 'Jovens', status: 'Ativo', cellId: '' });
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">{editingItem ? 'Editar Membro' : 'Novo Membro'}</h3>
          <div className="space-y-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label><input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500" placeholder="João Silva" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label><input type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500" placeholder="(21) 99999-9999" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Email</label><input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500" placeholder="joao@email.com" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Grupo</label><select value={formData.group} onChange={(e) => setFormData({...formData, group: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"><option>Jovens</option><option>Louvor</option><option>Diáconos</option><option>Crianças</option><option>Intercessão</option><option>Liderança</option><option>Visitante</option></select></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Status</label><select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"><option>Ativo</option><option>Inativo</option><option>Visitante</option></select></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Célula (Opcional)</label><select value={formData.cellId} onChange={(e) => setFormData({...formData, cellId: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"><option value="">Nenhuma</option>{cells.map(cell => <option key={cell.id} value={cell.id}>{cell.name}</option>)}</select></div>
          </div>
          <div className="flex gap-3 mt-6">
            <button onClick={() => { setShowMemberModal(false); setEditingItem(null); }} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">Cancelar</button>
            <button onClick={() => handleSaveMember(formData)} className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center justify-center gap-2"><Save size={18} />Salvar</button>
          </div>
        </div>
      </div>
    );
  };

  const DonationModal = () => {
    const [formData, setFormData] = useState(editingItem || { member: '', amount: '', type: 'Dízimo', date: new Date().toISOString().split('T')[0], method: 'PIX' });
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">{editingItem ? 'Editar Doação' : 'Registrar Doação'}</h3>
          <div className="space-y-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Doador</label><input type="text" value={formData.member} onChange={(e) => setFormData({...formData, member: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" placeholder="Nome do doador" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Valor (R$)</label><input type="number" value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" placeholder="100.00" step="0.01" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label><select value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"><option>Dízimo</option><option>Oferta</option><option>Missões</option><option>Construção</option><option>Eventos</option></select></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Método</label><select value={formData.method} onChange={(e) => setFormData({...formData, method: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"><option>PIX</option><option>Dinheiro</option><option>Cartão</option><option>Transferência</option><option>Cheque</option></select></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Data</label><input type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" /></div>
          </div>
          <div className="flex gap-3 mt-6">
            <button onClick={() => { setShowDonationModal(false); setEditingItem(null); }} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">Cancelar</button>
            <button onClick={() => handleSaveDonation(formData)} className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2"><Save size={18} />Salvar</button>
          </div>
        </div>
      </div>
    );
  };

  const EventModal = () => {
    const [formData, setFormData] = useState(editingItem || { title: '', date: new Date().toISOString().split('T')[0], time: '19:00', location: '', attendees: 0 });
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">{editingItem ? 'Editar Evento' : 'Criar Evento'}</h3>
          <div className="space-y-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Nome do Evento</label><input type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500" placeholder="Culto de Domingo" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Data</label><input type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Horário</label><input type="time" value={formData.time} onChange={(e) => setFormData({...formData, time: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500" /></div>
            </div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Local</label><input type="text" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500" placeholder="Templo Principal" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Nº Participantes</label><input type="number" value={formData.attendees} onChange={(e) => setFormData({...formData, attendees: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500" placeholder="100" /></div>
          </div>
          <div className="flex gap-3 mt-6">
            <button onClick={() => { setShowEventModal(false); setEditingItem(null); }} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">Cancelar</button>
            <button onClick={() => handleSaveEvent(formData)} className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center justify-center gap-2"><Save size={18} />Salvar</button>
          </div>
        </div>
      </div>
    );
  };

  const CellModal = () => {
    const [formData, setFormData] = useState(editingItem || { name: '', leader: '', address: '', day: 'Terça-feira', time: '19:30', members: 0 });
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">{editingItem ? 'Editar Célula' : 'Nova Célula'}</h3>
          <div className="space-y-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Nome da Célula</label><input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500" placeholder="Célula Vitória" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Líder</label><input type="text" value={formData.leader} onChange={(e) => setFormData({...formData, leader: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500" placeholder="Nome do líder" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Endereço</label><input type="text" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500" placeholder="Rua das Flores, 123" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Dia</label><select value={formData.day} onChange={(e) => setFormData({...formData, day: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"><option>Segunda-feira</option><option>Terça-feira</option><option>Quarta-feira</option><option>Quinta-feira</option><option>Sexta-feira</option><option>Sábado</option><option>Domingo</option></select></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Horário</label><input type="time" value={formData.time} onChange={(e) => setFormData({...formData, time: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500" /></div>
            </div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Nº Participantes</label><input type="number" value={formData.members} onChange={(e) => setFormData({...formData, members: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500" placeholder="0" /></div>
          </div>
          <div className="flex gap-3 mt-6">
            <button onClick={() => { setShowCellModal(false); setEditingItem(null); }} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">Cancelar</button>
            <button onClick={() => handleSaveCell(formData)} className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center justify-center gap-2"><Save size={18} />Salvar</button>
          </div>
        </div>
      </div>
    );
  };

  const CellMembersModal = () => {
    if (!selectedCell) return null;
    
    const cellMembers = members.filter(m => m.cellId === selectedCell.id);
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl p-6 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-800">{selectedCell.name}</h3>
              <p className="text-sm text-gray-600">Líder: {selectedCell.leader}</p>
            </div>
            <button onClick={() => { setShowCellMembersModal(false); setSelectedCell(null); }} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <X size={24} className="text-gray-600" />
            </button>
          </div>

          <div className="mb-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center">
                  <Users size={24} className="text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total de membros vinculados</p>
                  <p className="text-2xl font-bold text-purple-700">{cellMembers.length} {cellMembers.length === 1 ? 'pessoa' : 'pessoas'}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Meta da célula</p>
                <p className="text-lg font-semibold text-gray-700">{selectedCell.members} participantes</p>
              </div>
            </div>
          </div>

          {cellMembers.length === 0 ? (
            <div className="text-center py-12">
              <Users size={48} className="mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-semibold text-gray-700 mb-2">Nenhum membro vinculado</p>
              <p className="text-sm text-gray-600 mb-6">Vincule membros a esta célula editando o cadastro deles</p>
              <div className="space-y-3">
                <button onClick={() => setShowAddMemberToCellModal(true)} className="w-full inline-flex items-center justify-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors">
                  <UserPlus size={20} /> Vincular Membro Existente
                </button>
                <button onClick={() => { setShowCellMembersModal(false); setSelectedCell(null); setShowMemberModal(true); }} className="w-full inline-flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors">
                  <Plus size={20} /> Cadastrar Novo Membro
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Membros Cadastrados:</h4>
              </div>
              <div className="space-y-3">
                {cellMembers.map((member, index) => (
                  <div key={member.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-purple-50 transition-colors border border-gray-200">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {member.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold text-gray-800">{member.name}</p>
                          <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded text-xs font-medium">{member.group}</span>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Phone size={14} />
                            <span>{member.phone}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Mail size={14} />
                            <span>{member.email}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => { setEditingItem(member); setShowCellMembersModal(false); setShowMemberModal(true); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Editar membro">
                        <Edit size={18} />
                      </button>
                      <button onClick={() => handleRemoveMemberFromCell(member.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Remover da célula">
                        <X size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
                <button onClick={() => setShowAddMemberToCellModal(true)} className="w-full flex items-center justify-center gap-2 bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium">
                  <UserPlus size={20} /> Vincular Membro Existente
                </button>
                <button onClick={() => { setShowCellMembersModal(false); setShowMemberModal(true); }} className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-medium">
                  <Plus size={20} /> Cadastrar Novo Membro
                </button>
              </div>
            </>
          )}

          <div className="mt-4 pt-4 border-t border-gray-200">
            <button onClick={() => { setShowCellMembersModal(false); setSelectedCell(null); }} className="w-full py-2 text-gray-600 hover:text-gray-800 transition-colors font-medium">
              Fechar
            </button>
          </div>
        </div>
      </div>
    );
  };

  const AddMemberToCellModal = () => {
    if (!selectedCell) return null;
    
    const availableMembers = members.filter(m => !m.cellId || m.cellId === '');
    const [searchQuery, setSearchQuery] = useState('');
    
    const filteredAvailableMembers = availableMembers.filter(m =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl p-6 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-800">Vincular Membro à Célula</h3>
              <p className="text-sm text-gray-600">{selectedCell.name}</p>
            </div>
            <button onClick={() => setShowAddMemberToCellModal(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <X size={24} className="text-gray-600" />
            </button>
          </div>

          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Buscar membro por nome ou email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          {availableMembers.length === 0 ? (
            <div className="text-center py-12">
              <Users size={48} className="mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-semibold text-gray-700 mb-2">Todos os membros já estão em células</p>
              <p className="text-sm text-gray-600 mb-6">Cadastre novos membros ou remova membros de outras células primeiro</p>
              <button onClick={() => { setShowAddMemberToCellModal(false); setShowCellMembersModal(false); setShowMemberModal(true); }} className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors">
                <Plus size={20} /> Cadastrar Novo Membro
              </button>
            </div>
          ) : filteredAvailableMembers.length === 0 ? (
            <div className="text-center py-12">
              <Search size={48} className="mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-semibold text-gray-700 mb-2">Nenhum membro encontrado</p>
              <p className="text-sm text-gray-600">Tente buscar com outro termo</p>
            </div>
          ) : (
            <>
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">
                  Membros disponíveis ({filteredAvailableMembers.length}):
                </h4>
              </div>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredAvailableMembers.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-purple-50 transition-colors border border-gray-200">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {member.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold text-gray-800">{member.name}</p>
                          <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded text-xs font-medium">{member.group}</span>
                          <span className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded text-xs font-medium">{member.status}</span>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Phone size={14} />
                            <span>{member.phone}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Mail size={14} />
                            <span>{member.email}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <button onClick={() => handleAddMemberToCell(member.id, selectedCell.id)} className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium flex items-center gap-2">
                      <UserPlus size={18} />
                      Vincular
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}

          <div className="mt-6 pt-6 border-t border-gray-200">
            <button onClick={() => setShowAddMemberToCellModal(false)} className="w-full py-2 text-gray-600 hover:text-gray-800 transition-colors font-medium">
              Cancelar
            </button>
          </div>
        </div>
      </div>
    );
  };

  const CanteenModal = () => {
    const [formData, setFormData] = useState(editingItem || {
      date: new Date().toISOString().split('T')[0],
      cellId: '',
      snack: '',
      price: '',
      totalQuantity: '',
      status: 'Planejada'
    });

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">{editingItem ? 'Editar Cantina' : 'Nova Cantina'}</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data da Cantina</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Célula Responsável</label>
              <select
                value={formData.cellId}
                onChange={(e) => setFormData({...formData, cellId: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              >
                <option value="">Selecione uma célula</option>
                {cells.map(cell => (
                  <option key={cell.id} value={cell.id}>{cell.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Lanche do Dia</label>
              <input
                type="text"
                value={formData.snack}
                onChange={(e) => setFormData({...formData, snack: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                placeholder="Ex: Cachorro-quente, Coxinha..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Valor (R$)</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  placeholder="8.00"
                  step="0.50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantidade</label>
                <input
                  type="number"
                  value={formData.totalQuantity}
                  onChange={(e) => setFormData({...formData, totalQuantity: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  placeholder="100"
                />
              </div>
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button onClick={() => { setShowCanteenModal(false); setEditingItem(null); }} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
              Cancelar
            </button>
            <button onClick={() => handleSaveCanteen({...formData, price: parseFloat(formData.price), totalQuantity: parseInt(formData.totalQuantity)})} className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 flex items-center justify-center gap-2">
              <Save size={18} />Salvar
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navigation />
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
                    
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'members' && <Members />}
          {activeTab === 'cells' && <Cells />}
          {activeTab === 'canteens' && <Canteens />}
          {activeTab === 'donations' && <Donations />}
          {activeTab === 'events' && <Events />}
        </div>
      </div>
      {showMemberModal && <MemberModal />}
      {showDonationModal && <DonationModal />}
      {showEventModal && <EventModal />}
      {showCellModal && <CellModal />}
      {showCellMembersModal && <CellMembersModal />}
      {showAddMemberToCellModal && <AddMemberToCellModal />}
      {showCanteenModal && <CanteenModal />}
    </div>
  );
}
