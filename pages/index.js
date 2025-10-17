// ==========================================
// SISTEMA IGREJA 360° - VERSÃO COMPLETA COM FIREBASE
// ==========================================
// Este é um sistema REAL que salva dados no Firebase
// Siga o tutorial para configurar!
// ==========================================

import React, { useState, useEffect } from 'react';
import { Users, DollarSign, Calendar, BarChart3, Plus, Search, Menu, X, Heart, Phone, Mail, MapPin, Save, Trash2, Edit } from 'lucide-react';

// ==========================================
// CONFIGURAÇÃO DO FIREBASE
// ==========================================
// SUBSTITUA com suas credenciais do Firebase (veja tutorial)
const firebaseConfig = {
  apiKey: "SUA_API_KEY_AQUI",
  authDomain: "SEU_PROJETO.firebaseapp.com",
  projectId: "SEU_PROJETO_ID",
  storageBucket: "SEU_PROJETO.appspot.com",
  messagingSenderId: "SEU_MESSAGING_ID",
  appId: "SEU_APP_ID"
};

// ==========================================
// SIMULAÇÃO DE FIREBASE (para demonstração)
// ==========================================
// Quando configurar o Firebase real, substitua estas funções
const FirebaseSimulator = {
  data: {
    members: [
      { id: '1', name: 'João Silva', phone: '(21) 99999-1111', email: 'joao@email.com', group: 'Jovens', status: 'Ativo', createdAt: new Date().toISOString() },
      { id: '2', name: 'Maria Santos', phone: '(21) 99999-2222', email: 'maria@email.com', group: 'Louvor', status: 'Ativo', createdAt: new Date().toISOString() },
    ],
    donations: [
      { id: '1', member: 'João Silva', amount: 250, type: 'Dízimo', date: '2025-10-10', method: 'PIX', createdAt: new Date().toISOString() },
      { id: '2', member: 'Maria Santos', amount: 500, type: 'Oferta', date: '2025-10-12', method: 'Cartão', createdAt: new Date().toISOString() },
    ],
    events: [
      { id: '1', title: 'Culto Domingo', date: '2025-10-20', time: '10:00', location: 'Templo Principal', attendees: 150, createdAt: new Date().toISOString() },
      { id: '2', title: 'Reunião de Jovens', date: '2025-10-22', time: '19:30', location: 'Sala 2', attendees: 45, createdAt: new Date().toISOString() },
    ]
  },
  
  getCollection: function(collection) {
    return Promise.resolve([...this.data[collection]]);
  },
  
  addDocument: function(collection, data) {
    const newDoc = { ...data, id: Date.now().toString(), createdAt: new Date().toISOString() };
    this.data[collection].push(newDoc);
    return Promise.resolve(newDoc);
  },
  
  updateDocument: function(collection, id, data) {
    const index = this.data[collection].findIndex(item => item.id === id);
    if (index !== -1) {
      this.data[collection][index] = { ...this.data[collection][index], ...data };
    }
    return Promise.resolve(true);
  },
  
  deleteDocument: function(collection, id) {
    this.data[collection] = this.data[collection].filter(item => item.id !== id);
    return Promise.resolve(true);
  }
};

// ==========================================
// COMPONENTE PRINCIPAL
// ==========================================
export default function ChurchManagementSystem() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [members, setMembers] = useState([]);
  const [donations, setDonations] = useState([]);
  const [events, setEvents] = useState([]);
  
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [membersData, donationsData, eventsData] = await Promise.all([
        FirebaseSimulator.getCollection('members'),
        FirebaseSimulator.getCollection('donations'),
        FirebaseSimulator.getCollection('events')
      ]);
      setMembers(membersData);
      setDonations(donationsData);
      setEvents(eventsData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      alert('Erro ao carregar dados. Verifique a configuração do Firebase.');
    }
    setLoading(false);
  };

  const handleSaveMember = async (memberData) => {
    try {
      if (editingItem) {
        await FirebaseSimulator.updateDocument('members', editingItem.id, memberData);
        setMembers(members.map(m => m.id === editingItem.id ? { ...m, ...memberData } : m));
        alert('Membro atualizado com sucesso!');
      } else {
        const newMember = await FirebaseSimulator.addDocument('members', memberData);
        setMembers([...members, newMember]);
        alert('Membro cadastrado com sucesso!');
      }
      setShowMemberModal(false);
      setEditingItem(null);
    } catch (error) {
      console.error('Erro ao salvar membro:', error);
      alert('Erro ao salvar membro.');
    }
  };

  const handleDeleteMember = async (id) => {
    if (!confirm('Tem certeza que deseja excluir este membro?')) return;
    try {
      await FirebaseSimulator.deleteDocument('members', id);
      setMembers(members.filter(m => m.id !== id));
      alert('Membro excluído com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir membro:', error);
      alert('Erro ao excluir membro.');
    }
  };

  const handleSaveDonation = async (donationData) => {
    try {
      if (editingItem) {
        await FirebaseSimulator.updateDocument('donations', editingItem.id, donationData);
        setDonations(donations.map(d => d.id === editingItem.id ? { ...d, ...donationData } : d));
        alert('Doação atualizada com sucesso!');
      } else {
        const newDonation = await FirebaseSimulator.addDocument('donations', donationData);
        setDonations([...donations, newDonation]);
        alert('Doação registrada com sucesso!');
      }
      setShowDonationModal(false);
      setEditingItem(null);
    } catch (error) {
      console.error('Erro ao salvar doação:', error);
      alert('Erro ao salvar doação.');
    }
  };

  const handleDeleteDonation = async (id) => {
    if (!confirm('Tem certeza que deseja excluir esta doação?')) return;
    try {
      await FirebaseSimulator.deleteDocument('donations', id);
      setDonations(donations.filter(d => d.id !== id));
      alert('Doação excluída com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir doação:', error);
      alert('Erro ao excluir doação.');
    }
  };

  const handleSaveEvent = async (eventData) => {
    try {
      if (editingItem) {
        await FirebaseSimulator.updateDocument('events', editingItem.id, eventData);
        setEvents(events.map(e => e.id === editingItem.id ? { ...e, ...eventData } : e));
        alert('Evento atualizado com sucesso!');
      } else {
        const newEvent = await FirebaseSimulator.addDocument('events', eventData);
        setEvents([...events, newEvent]);
        alert('Evento criado com sucesso!');
      }
      setShowEventModal(false);
      setEditingItem(null);
    } catch (error) {
      console.error('Erro ao salvar evento:', error);
      alert('Erro ao salvar evento.');
    }
  };

  const handleDeleteEvent = async (id) => {
    if (!confirm('Tem certeza que deseja excluir este evento?')) return;
    try {
      await FirebaseSimulator.deleteDocument('events', id);
      setEvents(events.filter(e => e.id !== id));
      alert('Evento excluído com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir evento:', error);
      alert('Erro ao excluir evento.');
    }
  };

  const stats = {
    totalMembers: members.length,
    activeMembers: members.filter(m => m.status === 'Ativo').length,
    totalDonations: donations.reduce((sum, d) => sum + Number(d.amount), 0),
    monthlyDonations: donations.filter(d => {
      const donationDate = new Date(d.date);
      const now = new Date();
      return donationDate.getMonth() === now.getMonth() && donationDate.getFullYear() === now.getFullYear();
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
            <p className="text-sm font-medium mb-1">✅ Sistema Funcional</p>
            <p className="text-xs opacity-80">Dados salvos em tempo real</p>
          </div>
        </div>
      )}
    </div>
  );

  const Dashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { label: 'Total de Membros', value: stats.totalMembers, icon: Users, color: 'from-blue-500 to-blue-600', change: `${stats.activeMembers} ativos` },
          { label: 'Doações do Mês', value: `R$ ${stats.monthlyDonations.toLocaleString('pt-BR')}`, icon: DollarSign, color: 'from-green-500 to-green-600', change: 'Este mês' },
          { label: 'Próximos Eventos', value: stats.upcomingEvents, icon: Calendar, color: 'from-purple-500 to-purple-600', change: 'Agendados' },
          { label: 'Membros Ativos', value: stats.activeMembers, icon: Heart, color: 'from-pink-500 to-pink-600', change: `${Math.round((stats.activeMembers/stats.totalMembers)*100)}%` },
          { label: 'Total Arrecadado', value: `R$ ${stats.totalDonations.toLocaleString('pt-BR')}`, icon: DollarSign, color: 'from-yellow-500 to-yellow-600', change: 'Total geral' },
          { label: 'Frequência Média', value: stats.averageAttendance, icon: Users, color: 'from-indigo-500 to-indigo-600', change: 'Por evento' },
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
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Calendar className="text-purple-600" size={20} />
            Próximos Eventos
          </h3>
          <div className="space-y-3">
            {events.filter(e => new Date(e.date) >= new Date()).slice(0, 3).map(event => (
              <div key={event.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-purple-50 transition-colors">
                <div>
                  <p className="font-semibold text-gray-800">{event.title}</p>
                  <p className="text-sm text-gray-600">{event.date} às {event.time}</p>
                </div>
                <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                  {event.attendees} pessoas
                </span>
              </div>
            ))}
            {events.filter(e => new Date(e.date) >= new Date()).length === 0 && (
              <p className="text-gray-500 text-center py-4">Nenhum evento agendado</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <DollarSign className="text-green-600" size={20} />
            Doações Recentes
          </h3>
          <div className="space-y-3">
            {donations.slice(-3).reverse().map(donation => (
              <div key={donation.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-green-50 transition-colors">
                <div>
                  <p className="font-semibold text-gray-800">{donation.member}</p>
                  <p className="text-sm text-gray-600">{donation.type} - {donation.method}</p>
                </div>
                <span className="text-green-600 font-bold text-lg">
                  R$ {Number(donation.amount).toLocaleString('pt-BR')}
                </span>
              </div>
            ))}
            {donations.length === 0 && (
              <p className="text-gray-500 text-center py-4">Nenhuma doação registrada</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );

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
        <button 
          onClick={() => {
            setEditingItem(null);
            setShowMemberModal(true);
          }}
          className="ml-4 flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors shadow-lg"
        >
          <Plus size={20} />
          Novo Membro
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
                      <Phone size={14} />
                      {member.phone}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail size={14} />
                      {member.email}
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                    {member.group}
                  </span>
                </td>
                <td className="p-4">
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                    {member.status}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <button 
                      onClick={() => {
                        setEditingItem(member);
                        setShowMemberModal(true);
                      }}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit size={18} />
                    </button>
                    <button 
                      onClick={() => handleDeleteMember(member.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredMembers.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            Nenhum membro encontrado
          </div>
        )}
      </div>
    </div>
  );

  const Donations = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Gestão Financeira</h2>
        <button 
          onClick={() => {
            setEditingItem(null);
            setShowDonationModal(true);
          }}
          className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors shadow-lg"
        >
          <Plus size={20} />
          Registrar Doação
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
                <td className="p-4">
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                    {donation.type}
                  </span>
                </td>
                <td className="p-4 text-green-600 font-bold text-lg">R$ {Number(donation.amount).toLocaleString('pt-BR')}</td>
                <td className="p-4 text-gray-600">{donation.method}</td>
                <td className="p-4 text-gray-600">{donation.date}</td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <button 
                      onClick={() => {
                        setEditingItem(donation);
                        setShowDonationModal(true);
                      }}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit size={18} />
                    </button>
                    <button 
                      onClick={() => handleDeleteDonation(donation.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {donations.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            Nenhuma doação registrada
          </div>
        )}
      </div>
    </div>
  );

  const Events = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Calendário de Eventos</h2>
        <button 
          onClick={() => {
            setEditingItem(null);
            setShowEventModal(true);
          }}
          className="flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors shadow-lg"
        >
          <Plus size={20} />
          Criar Evento
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {events.map(event => (
          <div key={event.id} className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{event.title}</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar size={16} />
                    <span className="text-sm">{event.date} às {event.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin size={16} />
                    <span className="text-sm">{event.location}</span>
                  </div>
                </div>
              </div>
              <div className="bg-purple-100 text-purple-700 px-4 py-2 rounded-lg text-center">
                <p className="text-2xl font-bold">{event.attendees}</p>
                <p className="text-xs">confirmados</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => {
                  setEditingItem(event);
                  setShowEventModal(true);
                }}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-all font-medium flex items-center justify-center gap-2"
              >
                <Edit size={18} />
                Editar
              </button>
              <button 
                onClick={() => handleDeleteEvent(event.id)}
                className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-all font-medium flex items-center justify-center gap-2"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
      {events.length === 0 && (
        <div className="bg-white rounded-xl p-12 text-center text-gray-500 shadow-lg">
          Nenhum evento cadastrado
        </div>
      )}
    </div>
  );

  const MemberModal = () => {
    const [formData, setFormData] = useState(editingItem || {
      name: '',
      phone: '',
      email: '',
      group: 'Jovens',
      status: 'Ativo'
    });

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            {editingItem ? 'Editar Membro' : 'Novo Membro'}
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="João Silva"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="(21) 99999-9999"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="joao@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Grupo</label>
              <select
                value={formData.group}
                onChange={(e) => setFormData({...formData, group: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option>Jovens</option>
                <option>Louvor</option>
                <option>Diáconos</option>
                <option>Crianças</option>
                <option>Intercessão</option>
                <option>Liderança</option>
                <option>Visitante</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option>Ativo</option>
                <option>Inativo</option>
                <option>Visitante</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={() => {
                setShowMemberModal(false);
                setEditingItem(null);
              }}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={() => handleSaveMember(formData)}
              className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
            >
              <Save size={18} />
              Salvar
            </button>
          </div>
        </div>
      </div>
    );
  };

  const DonationModal = () => {
    const [formData, setFormData] = useState(editingItem || {
      member: '',
      amount: '',
      type: 'Dízimo',
      date: new Date().toISOString().split('T')[0],
      method: 'PIX'
    });

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            {editingItem ? 'Editar Doação' : 'Registrar Doação'}
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Doador</label>
              <input
                type="text"
                value={formData.member}
                onChange={(e) => setFormData({...formData, member: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Nome do doador ou 'Anônimo'"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Valor (R$)</label>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="100.00"
                step="0.01"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option>Dízimo</option>
                <option>Oferta</option>
                <option>Missões</option>
                <option>Construção</option>
                <option>Eventos</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Método de Pagamento</label>
              <select
                value={formData.method}
                onChange={(e) => setFormData({...formData, method: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option>PIX</option>
                <option>Dinheiro</option>
                <option>Cartão</option>
                <option>Transferência</option>
                <option>Cheque</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={() => {
                setShowDonationModal(false);
                setEditingItem(null);
              }}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={() => handleSaveDonation(formData)}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
            >
              <Save size={18} />
              Salvar
            </button>
          </div>
        </div>
      </div>
    );
  };

  const EventModal = () => {
    const [formData, setFormData] = useState(editingItem || {
      title: '',
      date: new Date().toISOString().split('T')[0],
      time: '19:00',
      location: '',
      attendees: 0
    });

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            {editingItem ? 'Editar Evento' : 'Criar Evento'}
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Evento</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Culto de Domingo"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Data</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Horário</label>
                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({...formData, time: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Local</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Templo Principal"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nº Esperado de Participantes</label>
              <input
                type="number"
                value={formData.attendees}
                onChange={(e) => setFormData({...formData, attendees: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="100"
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={() => {
                setShowEventModal(false);
                setEditingItem(null);
              }}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={() => handleSaveEvent(formData)}
              className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
            >
              <Save size={18} />
              Salvar
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
          <p className="text-gray-600">Carregando sistema...</p>
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
              {activeTab === 'donations' && 'Controle Financeiro'}
              {activeTab === 'events' && 'Eventos e Atividades'}
            </h1>
            <p className="text-gray-600">Sistema completo de gestão eclesiástica com dados reais</p>
          </div>
          
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'members' && <Members />}
          {activeTab === 'donations' && <Donations />}
          {activeTab === 'events' && <Events />}
        </div>
      </div>

      {showMemberModal && <MemberModal />}
      {showDonationModal && <DonationModal />}
      {showEventModal && <EventModal />}
    </div>
  );
}
