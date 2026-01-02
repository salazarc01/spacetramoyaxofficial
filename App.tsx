
import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Wallet, 
  User as UserIcon, 
  ShieldCheck, 
  Send, 
  Bell, 
  LogOut, 
  Search,
  Clock,
  ChevronRight,
  ShieldAlert,
  ArrowDownCircle,
  ArrowUpCircle,
  Gift,
  CheckCircle2,
  Mail
} from 'lucide-react';
import { AppView, User, Transaction, Notification } from './types';

const ADMIN_CREDENTIALS = {
  user: 'ghostvip090870',
  pass: 'v9451679',
  securityCode: '090870'
};

const OFFICIAL_EMAIL = "soportespacetramoyax@gmail.com";
const BANK_LOGO = "https://i.postimg.cc/jjKR8VQP/Photoroom_20251227_172103.png";

const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.HOME);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Carga inicial de datos
  useEffect(() => {
    const savedUsers = localStorage.getItem('STX_DATABASE_USERS');
    const savedTx = localStorage.getItem('STX_DATABASE_TX');
    const savedNotif = localStorage.getItem('STX_DATABASE_NOTIF');

    const initialUsers: User[] = [
      {
        id: '0001',
        firstName: 'Luis',
        lastName: 'Alejandro',
        country: 'Venezuela',
        phone: '584121351217',
        email: 'mgsvof@gmail.com',
        password: 'v9451679',
        balance: 10000,
        status: 'active',
        createdAt: new Date().toISOString()
      },
      {
        id: '0002',
        firstName: 'Miss',
        lastName: 'Slam',
        country: 'El Salvador',
        phone: '50375431210',
        email: 'missslam@tramoyax.com',
        password: 'missslam0121',
        balance: 2500,
        status: 'active',
        createdAt: new Date().toISOString()
      },
      {
        id: '0003',
        firstName: 'Alex',
        lastName: 'Alemán',
        country: 'Honduras',
        phone: '50489887690',
        email: 'alex0003@tramoyax.com',
        password: 'Copito.504.',
        balance: 1200,
        status: 'active',
        createdAt: new Date().toISOString()
      }
    ];

    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    } else {
      setUsers(initialUsers);
    }
    
    if (savedTx) setTransactions(JSON.parse(savedTx));
    if (savedNotif) setNotifications(JSON.parse(savedNotif));
  }, []);

  // Persistencia de datos
  useEffect(() => {
    if (users.length > 0) {
      localStorage.setItem('STX_DATABASE_USERS', JSON.stringify(users));
    }
    localStorage.setItem('STX_DATABASE_TX', JSON.stringify(transactions));
    localStorage.setItem('STX_DATABASE_NOTIF', JSON.stringify(notifications));
  }, [users, transactions, notifications]);

  // Utilidades
  const formatPhone = (phone: string) => {
    if (phone.length < 6) return phone;
    const start = phone.slice(0, 5);
    const end = phone.slice(-1);
    const mid = '*'.repeat(phone.length - 6);
    return `${start}${mid}${end}`;
  };

  const generateReference = () => {
    return Array.from({ length: 20 }, () => Math.floor(Math.random() * 10)).join('');
  };

  const addNotification = (userId: string, title: string, message: string, isBonus: boolean = false) => {
    const newNotif: Notification = {
      id: Math.random().toString(36).substr(2, 9),
      userId,
      title,
      message,
      date: new Date().toISOString(),
      isBonus
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const handleAdminSendFunds = (userId: string, amount: number, reason: string) => {
    const ref = generateReference();
    
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        return { ...u, balance: u.balance + amount };
      }
      return u;
    }));

    const newTx: Transaction = {
      id: ref,
      fromId: 'ADMIN',
      fromName: 'SpaceTramoya X Admin',
      toId: userId,
      toName: users.find(u => u.id === userId)?.firstName || 'Usuario',
      amount,
      reason,
      date: new Date().toISOString(),
      type: 'bonus'
    };
    setTransactions(prev => [newTx, ...prev]);

    addNotification(
      userId, 
      amount >= 1000 ? '¡BONO ESPECIAL RECIBIDO!' : 'ABONO GHOST EXITOSO', 
      `Se han acreditado ${amount} Nóvares a tu cuenta por motivo de: ${reason}. REF: ${ref}`,
      amount >= 1000
    );

    alert(`Fondos acreditados con éxito. REF: ${ref}`);
  };

  const getLocalTime = (country: string) => {
    const now = new Date();
    return now.toLocaleString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit', 
      day: '2-digit', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const isOfficeOpen = () => {
    const now = new Date();
    const hour = now.getHours();
    const min = now.getMinutes();
    const totalMin = hour * 60 + min;
    return totalMin >= 360 && totalMin <= 1410; // 6:00 AM - 11:30 PM
  };

  const Header = () => (
    <header className="fixed top-0 left-0 w-full z-50 p-4 bg-space-deep/80 backdrop-blur-md border-b border-white/10 flex justify-between items-center">
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView(AppView.HOME)}>
        <div className="w-10 h-10 bg-gradient-to-tr from-space-purple to-space-cyan rounded-full flex items-center justify-center shadow-lg shadow-space-purple/20">
          <span className="font-orbitron font-black text-xl italic text-white">X</span>
        </div>
        <h1 className="font-orbitron font-bold text-lg tracking-tighter hidden sm:block text-white">SPACETRAMOYA X</h1>
      </div>
      
      <div className="flex gap-2">
        {view === AppView.HOME && (
          <button 
            onClick={() => setView(AppView.ADMIN_LOGIN)}
            className="px-4 py-2 text-xs font-orbitron bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-all flex items-center gap-2 text-white"
          >
            <ShieldCheck size={14} className="text-space-cyan" />
            ACCESO VIP
          </button>
        )}
        {currentUser && (
          <button 
            onClick={() => { setCurrentUser(null); setView(AppView.HOME); }}
            className="p-2 bg-red-500/20 text-red-400 rounded-full hover:bg-red-500/30 transition-all"
          >
            <LogOut size={18} />
          </button>
        )}
      </div>
    </header>
  );

  const BackButton = ({ to }: { to: AppView }) => (
    <button 
      onClick={() => setView(to)}
      className="mb-6 flex items-center gap-2 text-space-cyan hover:text-white transition-colors font-orbitron text-sm group"
    >
      <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
      VOLVER
    </button>
  );

  const HomeView = () => (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-3xl space-y-8">
        <div className="relative inline-block">
          <div className="absolute inset-0 blur-3xl bg-space-purple/30 rounded-full"></div>
          <h1 className="relative font-orbitron text-5xl md:text-7xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50 leading-none">
            SPACE<span className="text-space-cyan">TRAMOYA</span> X
          </h1>
        </div>
        <p className="text-xl md:text-2xl font-light text-slate-300 max-w-xl mx-auto leading-relaxed">
          Únete a la familia más exclusiva del entretenimiento y la tramoya digital.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
          <button 
            onClick={() => setView(AppView.REGISTER)}
            className="px-10 py-4 bg-gradient-to-r from-space-purple to-space-blue rounded-full font-orbitron font-bold text-lg shadow-xl shadow-space-purple/40 hover:scale-105 transition-all text-white"
          >
            INSCRIBIRME
          </button>
          <button 
            onClick={() => setView(AppView.LOGIN)}
            className="px-10 py-4 bg-white/5 border border-white/20 backdrop-blur-md rounded-full font-orbitron font-bold text-lg hover:bg-white/10 transition-all text-white"
          >
            ENTRAR
          </button>
        </div>
      </div>
    </div>
  );

  const RegisterView = () => {
    const [formData, setFormData] = useState({
      firstName: '', lastName: '', country: '', phone: '', email: '', password: ''
    });

    const handleFormSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!isOfficeOpen()) return alert('Fuera de horario. Intenta entre las 6:00 AM y 11:30 PM.');

      const terms = "Al continuar, aceptas los términos y condiciones de SpaceTramoya X. Serás redirigido a tu correo para completar el proceso de inscripción.";
      
      if (confirm(terms)) {
        const subject = encodeURIComponent("SOLICITUD DE INSCRIPCIÓN - SPACETRAMOYA X");
        const body = encodeURIComponent(`
--- SOLICITUD DE REGISTRO OFICIAL ---
FECHA: ${new Date().toLocaleString()}

DATOS DEL ASPIRANTE:
NOMBRE: ${formData.firstName}
APELLIDO: ${formData.lastName}
PAÍS: ${formData.country}
WHATSAPP: ${formData.phone}
CORREO: ${formData.email}
PASSWORD ELEGIDO: ${formData.password}

Solicito formalmente mi activación manual en el sistema SpaceTramoya X.
        `);

        alert(`¡Mensaje preparado! Ahora serás redirigido a Gmail para enviar tu solicitud a ${OFFICIAL_EMAIL}. Por favor, no modifiques el contenido del correo.`);
        window.location.href = `mailto:${OFFICIAL_EMAIL}?subject=${subject}&body=${body}`;
        setView(AppView.HOME);
      }
    };

    return (
      <div className="min-h-screen pt-24 px-6 pb-12 flex flex-col items-center">
        <BackButton to={AppView.HOME} />
        <div className="w-full max-w-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-[40px] shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-space-purple via-space-cyan to-space-blue"></div>
          <div className="mb-8 text-center">
            <h2 className="text-4xl font-orbitron font-black text-center mb-2 tracking-tighter italic text-white uppercase">Formulario de Inscripción</h2>
            <p className="text-white/40 text-sm">Ingresa tus datos reales para la validación Ghost</p>
          </div>
          <form onSubmit={handleFormSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] text-white/40 ml-2 font-orbitron uppercase tracking-widest">Nombre</label>
                <input className="w-full bg-space-deep border border-white/10 p-4 rounded-2xl outline-none focus:border-space-cyan text-white transition-all" placeholder="Nombre Real" required value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] text-white/40 ml-2 font-orbitron uppercase tracking-widest">Apellido</label>
                <input className="w-full bg-space-deep border border-white/10 p-4 rounded-2xl outline-none focus:border-space-cyan text-white transition-all" placeholder="Apellido Real" required value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] text-white/40 ml-2 font-orbitron uppercase tracking-widest">País de Origen</label>
                <input className="w-full bg-space-deep border border-white/10 p-4 rounded-2xl outline-none focus:border-space-cyan text-white transition-all" placeholder="Venezuela, Honduras, etc." required value={formData.country} onChange={e => setFormData({...formData, country: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] text-white/40 ml-2 font-orbitron uppercase tracking-widest">WhatsApp Personal</label>
                <input className="w-full bg-space-deep border border-white/10 p-4 rounded-2xl outline-none focus:border-space-cyan text-white transition-all" placeholder="Ej: 58 412..." required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-[10px] text-white/40 ml-2 font-orbitron uppercase tracking-widest">Correo Principal</label>
                <input className="w-full bg-space-deep border border-white/10 p-4 rounded-2xl outline-none focus:border-space-cyan text-white transition-all" type="email" placeholder="usuario@gmail.com" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-[10px] text-white/40 ml-2 font-orbitron uppercase tracking-widest">Nueva Contraseña</label>
                <input className="w-full bg-space-deep border border-white/10 p-4 rounded-2xl outline-none focus:border-space-cyan text-white transition-all" type="password" placeholder="Define tu clave de acceso" required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
              </div>
            </div>
            <button type="submit" disabled={!isOfficeOpen()} className="w-full py-5 bg-gradient-to-r from-space-purple via-space-blue to-space-cyan rounded-2xl font-orbitron font-black text-xl shadow-2xl hover:scale-[1.02] active:scale-95 transition-all text-white flex items-center justify-center gap-3">
              <Mail size={24} /> ENVIAR SOLICITUD A GMAIL
            </button>
            <p className="text-center text-[10px] text-white/20 uppercase tracking-[0.2em]">Al pulsar, confirmas que todos tus datos son verídicos.</p>
          </form>
        </div>
      </div>
    );
  };

  const DashboardView = () => (
    <div className="pt-24 px-4 pb-12 max-w-4xl mx-auto space-y-8">
      <div className="p-8 bg-gradient-to-br from-space-purple/20 to-space-blue/20 border border-white/10 rounded-3xl flex justify-between items-center relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-3xl font-orbitron font-black italic uppercase text-white">Hola, {currentUser?.firstName}</h2>
          <p className="text-white/60 flex items-center gap-2 mt-2"><Clock size={16} /> {getLocalTime(currentUser?.country || '')}</p>
        </div>
        <div className="text-right relative z-10">
          <p className="text-[10px] text-space-cyan uppercase font-orbitron tracking-widest mb-1">Tu Saldo</p>
          <p className="text-3xl font-orbitron font-black text-white">{currentUser?.balance} <span className="text-sm">NV</span></p>
        </div>
      </div>

      <div className="bg-space-deep border-2 border-space-cyan/30 rounded-3xl overflow-hidden shadow-2xl">
        <div className="p-4 bg-gradient-to-r from-space-cyan/20 to-transparent border-b border-white/10">
          <span className="font-orbitron font-black text-space-cyan italic tracking-wider">CREDENCIAL OFICIAL MEMBER</span>
        </div>
        <div className="p-8 flex flex-col md:flex-row gap-8 items-center">
          <div className="w-32 h-32 bg-gradient-to-tr from-white/10 to-white/5 rounded-2xl border border-white/20 flex items-center justify-center relative group">
            <UserIcon size={64} className="text-white/20" />
          </div>
          <div className="flex-1 space-y-2 text-center md:text-left text-white">
            <h3 className="text-2xl font-bold">{currentUser?.firstName} {currentUser?.lastName}</h3>
            <p className="text-space-cyan font-mono font-bold tracking-widest uppercase bg-space-cyan/10 px-3 py-1 rounded-full inline-block text-xs">ID: {currentUser?.id}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 text-sm">
              <p><strong>WhatsApp:</strong> {formatPhone(currentUser?.phone || '')}</p>
              <p><strong>País:</strong> {currentUser?.country}</p>
              <p className="sm:col-span-2"><strong>Email:</strong> {currentUser?.email}</p>
            </div>
          </div>
        </div>
        <div className="p-6 bg-white/5 border-t border-white/10 text-center italic text-xs text-white/40">
          "Yo, {currentUser?.firstName}, declaro ser parte oficial de SpaceTramoya X y me comprometo a mantener la fidelidad, el respeto y la confidencialidad de esta comunidad."
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button onClick={() => setView(AppView.SPACEBANK)} className="p-8 bg-white/5 border border-white/10 rounded-3xl flex flex-col gap-6 hover:bg-space-cyan/10 transition-all group relative overflow-hidden">
          <div className="flex justify-between items-center w-full relative z-10">
             <div className="p-4 bg-space-cyan/10 rounded-2xl"><Wallet className="text-space-cyan" size={32} /></div>
             <ChevronRight className="text-white/20" />
          </div>
          <div className="text-left relative z-10">
            <p className="font-orbitron font-bold text-2xl mb-1 text-white uppercase tracking-tighter">Space Bank</p>
            <p className="text-space-cyan font-orbitron font-black text-3xl">{currentUser?.balance} <span className="text-sm">NV</span></p>
          </div>
        </button>
        
        <div className="p-8 bg-white/5 border border-white/10 rounded-3xl flex flex-col gap-4">
           <div className="flex justify-between items-start mb-2">
              <p className="font-orbitron font-bold text-xl text-white uppercase tracking-tighter">Notificaciones</p>
              <Bell size={24} className="text-space-purple" />
           </div>
           <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
              {notifications.filter(n => n.userId === currentUser?.id).length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 opacity-20">
                  <Bell size={32} />
                  <p className="text-[10px] mt-2 uppercase font-orbitron">No hay actividad reciente</p>
                </div>
              ) : (
                notifications.filter(n => n.userId === currentUser?.id).map(n => (
                  <div key={n.id} className={`p-4 rounded-2xl border ${n.isBonus ? 'bg-space-purple/20 border-space-purple/30' : 'bg-white/5 border-white/10'} flex gap-3 items-start`}>
                    <div className="mt-1">{n.isBonus ? <Gift className="text-space-purple" size={16} /> : <CheckCircle2 className="text-space-cyan" size={16} />}</div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-[10px] uppercase text-space-cyan tracking-wider">{n.title}</p>
                      <p className="text-[11px] text-white/80 mt-1 leading-tight">{n.message}</p>
                      <p className="text-[9px] text-white/30 mt-1 uppercase font-mono">{new Date(n.date).toLocaleString()}</p>
                    </div>
                  </div>
                ))
              )}
           </div>
        </div>
      </div>
    </div>
  );

  const SpaceBankView = () => {
    const [receiverId, setReceiverId] = useState('');
    const [amount, setAmount] = useState('');
    const [reason, setReason] = useState('');
    const [tab, setTab] = useState<'send' | 'history'>('send');
    
    const receiver = users.find(u => u.id === receiverId);
    const balanceAfter = currentUser ? currentUser.balance - Number(amount) : 0;
    const userTxs = transactions.filter(t => t.fromId === currentUser?.id || t.toId === currentUser?.id);

    const handleTransferRequest = () => {
      if (!receiver) return alert('El ID de receptor no existe en la red Ghost.');
      const ref = generateReference();
      const subject = encodeURIComponent(`SOLICITUD TRANSFERENCIA - REF ${ref}`);
      const body = encodeURIComponent(`
--- SOLICITUD DE MOVIMIENTO SPACEBANK ---
REF: ${ref}
FECHA: ${new Date().toLocaleString()}

DATOS DEL REMITENTE:
ID: ${currentUser?.id}
SALDO ACTUAL: ${currentUser?.balance} NV

DATOS DEL RECEPTOR:
ID: ${receiverId}
NOMBRE: ${receiver.firstName} ${receiver.lastName}

MONTO A TRANSFERIR: ${amount} NV
MOTIVO: ${reason}

SALDO RESULTANTE ESTIMADO: ${balanceAfter} NV

Favor procesar esta solicitud para su aprobación manual.
      `);
      
      alert(`Redirigiendo a Gmail para enviar la solicitud de transferencia a ${OFFICIAL_EMAIL}. El historial se actualizará una vez aprobada por administración.`);
      addNotification(currentUser?.id || '', 'TRANSFERENCIA SOLICITADA', `Has solicitado transferir ${amount} NV a ID ${receiverId}. Referencia de seguimiento: ${ref}`);
      window.location.href = `mailto:${OFFICIAL_EMAIL}?subject=${subject}&body=${body}`;
    };

    return (
      <div className="pt-24 px-4 pb-12 max-w-4xl mx-auto space-y-8">
        <BackButton to={AppView.DASHBOARD} />
        <div className="p-10 bg-gradient-to-br from-space-deep to-space-blue/30 rounded-[40px] border border-white/10 flex flex-col md:flex-row justify-between items-center gap-8 relative overflow-hidden shadow-2xl">
          <div className="flex items-center gap-6 relative z-10">
            <div className="w-20 h-20 bg-white rounded-2xl p-2 flex items-center justify-center">
              <img src={BANK_LOGO} className="w-full h-full object-contain" alt="Bank" />
            </div>
            <div>
              <h2 className="text-3xl font-orbitron font-black italic text-white uppercase tracking-tighter">Space Bank</h2>
              <p className="text-[10px] text-space-cyan tracking-[0.3em] uppercase">Gestión de Activos Nóvares</p>
            </div>
          </div>
          <div className="text-center md:text-right relative z-10">
            <p className="text-xs text-white/40 uppercase font-orbitron tracking-widest mb-2">Mi Saldo</p>
            <p className="text-5xl font-orbitron font-black text-white">{currentUser?.balance} <span className="text-xl text-space-cyan">NV</span></p>
          </div>
        </div>

        <div className="flex gap-2 bg-white/5 p-1.5 rounded-2xl border border-white/5">
          <button onClick={() => setTab('send')} className={`flex-1 py-4 font-orbitron font-bold rounded-xl transition-all ${tab === 'send' ? 'bg-space-cyan text-space-deep shadow-lg' : 'text-white/40'}`}>ENVIAR</button>
          <button onClick={() => setTab('history')} className={`flex-1 py-4 font-orbitron font-bold rounded-xl transition-all ${tab === 'history' ? 'bg-space-cyan text-space-deep shadow-lg' : 'text-white/40'}`}>HISTORIAL</button>
        </div>

        {tab === 'send' ? (
          <div className="max-w-md mx-auto space-y-6 bg-white/5 p-10 rounded-[40px] border border-white/10 shadow-2xl">
            <div className="space-y-6">
              <div className="space-y-1">
                <label className="text-[10px] text-white/40 ml-2 uppercase font-orbitron tracking-widest">ID Destinatario</label>
                <input className="w-full bg-space-deep border border-white/10 p-5 rounded-2xl text-white outline-none focus:border-space-cyan font-mono" placeholder="Ej: 0002" value={receiverId} onChange={e => setReceiverId(e.target.value)} />
                {receiver && <p className="text-[10px] text-green-400 font-bold ml-2 italic">✔ ENCONTRADO: {receiver.firstName} {receiver.lastName}</p>}
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-white/40 ml-2 uppercase font-orbitron tracking-widest">Monto a Enviar</label>
                <input className="w-full bg-space-deep border border-white/10 p-5 rounded-2xl text-white outline-none focus:border-space-cyan font-orbitron text-xl" type="number" placeholder="0.00" value={amount} onChange={e => setAmount(e.target.value)} />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-white/40 ml-2 uppercase font-orbitron tracking-widest">Motivo</label>
                <input className="w-full bg-space-deep border border-white/10 p-5 rounded-2xl text-white outline-none focus:border-space-cyan" placeholder="Ej: Pago de comisión" value={reason} onChange={e => setReason(e.target.value)} />
              </div>
              {Number(amount) > 0 && (
                <div className="p-4 bg-white/5 rounded-2xl text-xs space-y-2 text-white/60 border border-white/5">
                  <p className="flex justify-between"><span>Disponible:</span> <span>{currentUser?.balance} NV</span></p>
                  <p className="flex justify-between text-red-400"><span>Deducción:</span> <span>-{amount} NV</span></p>
                  <p className="flex justify-between font-bold text-white pt-2 border-t border-white/10"><span>Saldo Final:</span> <span className={balanceAfter < 0 ? 'text-red-500' : 'text-green-400'}>{balanceAfter} NV</span></p>
                </div>
              )}
              <button disabled={!receiver || !amount || balanceAfter < 0} onClick={handleTransferRequest} className="w-full py-6 bg-gradient-to-r from-space-purple to-space-blue text-white font-orbitron font-black text-xl rounded-2xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-20 flex items-center justify-center gap-3">
                <Send size={24} /> SOLICITAR TRANSFERENCIA
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative mb-6">
               <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-white/30" size={20} />
               <input className="w-full bg-white/5 border border-white/10 p-5 pl-14 rounded-3xl text-white outline-none focus:border-space-cyan" placeholder="Filtrar por últimos 4 dígitos de Referencia..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
            </div>
            {userTxs.filter(t => t.id.endsWith(searchQuery)).length === 0 ? (
              <div className="text-center py-20 opacity-20">
                <Search size={64} className="mx-auto" />
                <p className="text-sm mt-4 uppercase font-orbitron tracking-widest">Sin movimientos registrados</p>
              </div>
            ) : (
              userTxs.filter(t => t.id.endsWith(searchQuery)).map(t => (
                <div key={t.id} className="p-6 bg-white/5 border border-white/10 rounded-[30px] flex justify-between items-center text-white group hover:bg-white/10 transition-all">
                  <div className="flex gap-4 items-center">
                     <div className={`p-3 rounded-full ${t.toId === currentUser?.id ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                        {t.toId === currentUser?.id ? <ArrowDownCircle className="text-green-400" /> : <ArrowUpCircle className="text-red-400" />}
                     </div>
                     <div>
                      <p className="text-[10px] opacity-30 font-mono tracking-widest uppercase">ID: ...{t.id.slice(-4)}</p>
                      <p className="font-bold">{t.toId === currentUser?.id ? `DE: ${t.fromName}` : `A: ${t.toName}`}</p>
                      <p className="text-xs opacity-60 italic">{t.reason}</p>
                     </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-orbitron font-black text-2xl ${t.toId === currentUser?.id ? 'text-green-400' : 'text-red-400'}`}>
                      {t.toId === currentUser?.id ? '+' : '-'}{t.amount}
                    </p>
                    <p className="text-[10px] opacity-20 uppercase font-bold">{new Date(t.date).toLocaleDateString()}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    );
  };

  const AdminPanelView = () => {
    const [tab, setTab] = useState<'users' | 'funds'>('users');
    const [selUser, setSelUser] = useState('');
    const [amt, setAmt] = useState('');
    const [res, setRes] = useState('');

    return (
      <div className="pt-24 px-4 pb-12 max-w-6xl mx-auto">
        <BackButton to={AppView.HOME} />
        <h2 className="text-4xl font-orbitron font-black mb-8 text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-white to-red-500 tracking-tighter italic uppercase text-white">Ghost Admin Panel</h2>
        <div className="flex gap-4 mb-10 p-1.5 bg-white/5 rounded-2xl border border-white/10">
          <button onClick={() => setTab('users')} className={`flex-1 px-10 py-4 rounded-xl font-orbitron font-bold transition-all ${tab === 'users' ? 'bg-white text-space-deep shadow-xl' : 'text-white/40'}`}>MIEMBROS</button>
          <button onClick={() => setTab('funds')} className={`flex-1 px-10 py-4 rounded-xl font-orbitron font-bold transition-all ${tab === 'funds' ? 'bg-white text-space-deep shadow-xl' : 'text-white/40'}`}>CRÉDITO GHOST</button>
        </div>
        {tab === 'users' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map(u => (
              <div key={u.id} className="p-8 bg-white/5 border border-white/10 rounded-3xl text-white relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-space-cyan/5 blur-3xl rounded-full"></div>
                <p className="font-bold text-xl">{u.firstName} {u.lastName}</p>
                <p className="text-xs text-space-cyan font-mono uppercase tracking-widest font-black">ID: {u.id}</p>
                <div className="mt-6">
                  <p className="text-[10px] uppercase text-white/30 font-orbitron">Saldo Actual</p>
                  <p className="text-3xl font-orbitron font-black text-white">{u.balance} <span className="text-xs">NV</span></p>
                </div>
                <button onClick={() => {if(confirm(`¿Estás seguro de eliminar a ${u.firstName}? Esta acción es irreversible.`)) setUsers(users.filter(x => x.id !== u.id))}} className="mt-6 w-full py-3 bg-red-500/10 text-red-500 rounded-xl text-[10px] font-black uppercase tracking-widest border border-red-500/20 hover:bg-red-500 hover:text-white transition-all">ELIMINAR DE LA RED</button>
              </div>
            ))}
          </div>
        ) : (
          <div className="max-w-md mx-auto space-y-6 bg-white/5 p-12 rounded-[50px] border border-white/10 text-white shadow-2xl relative">
            <h3 className="text-2xl font-orbitron font-black uppercase italic text-center text-red-500">Inyectar Nóvares</h3>
            <div className="space-y-4">
               <select className="w-full bg-space-deep border border-white/10 p-4 rounded-2xl outline-none focus:border-red-500 text-white" onChange={e => setSelUser(e.target.value)}>
                <option value="">Seleccionar Destinatario...</option>
                {users.map(u => <option key={u.id} value={u.id}>{u.firstName} {u.lastName} (#{u.id})</option>)}
              </select>
              <input className="w-full bg-space-deep border border-white/10 p-4 rounded-2xl outline-none focus:border-red-500 font-orbitron text-white text-xl" placeholder="Monto" type="number" onChange={e => setAmt(e.target.value)} />
              <input className="w-full bg-space-deep border border-white/10 p-4 rounded-2xl outline-none focus:border-red-500 text-white" placeholder="Motivo del abono" onChange={e => setRes(e.target.value)} />
              <button onClick={() => {if(!selUser || !amt || !res) return alert('Por favor, completa todos los campos.'); handleAdminSendFunds(selUser, Number(amt), res)}} className="w-full py-5 bg-red-600 rounded-2xl font-orbitron font-black text-xl text-white shadow-2xl shadow-red-600/30 hover:scale-[1.02] active:scale-95 transition-all">EJECUTAR ABONO GHOST</button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const LoginView = () => {
    const [id, setId] = useState('');
    const [pw, setPw] = useState('');
    return (
      <div className="pt-32 px-6 flex flex-col items-center">
        <BackButton to={AppView.HOME} />
        <div className="w-full max-w-md bg-white/5 border border-white/10 p-12 rounded-[50px] shadow-2xl backdrop-blur-xl text-white relative">
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-20 h-20 bg-space-cyan rounded-3xl rotate-12 blur-3xl opacity-20"></div>
          <h2 className="text-4xl font-orbitron font-black text-center mb-10 tracking-tighter italic uppercase">Acceso Member</h2>
          <div className="space-y-6">
            <input className="w-full bg-space-deep border border-white/10 p-5 rounded-2xl outline-none focus:border-space-cyan font-mono text-white text-center tracking-widest" placeholder="CÓDIGO ID" onChange={e => setId(e.target.value)} />
            <input className="w-full bg-space-deep border border-white/10 p-5 rounded-2xl outline-none focus:border-space-cyan text-white text-center" type="password" placeholder="PASSWORD" onChange={e => setPw(e.target.value)} />
            <button onClick={() => {
              const u = users.find(x => x.id === id && x.password === pw);
              if(u) { setCurrentUser(u); setView(AppView.DASHBOARD); } else { alert('Acceso Denegado. Credenciales incorrectas o cuenta no activa.'); }
            }} className="w-full py-5 bg-gradient-to-r from-space-blue to-space-purple rounded-2xl font-orbitron font-black text-xl text-white hover:shadow-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-space-purple/20">IDENTIFICARSE</button>
          </div>
        </div>
      </div>
    );
  };

  const AdminLoginView = () => {
    const [u, setU] = useState('');
    const [p, setP] = useState('');
    const [c, setC] = useState('');
    return (
      <div className="pt-32 px-6 flex flex-col items-center">
        <BackButton to={AppView.HOME} />
        <div className="w-full max-w-md bg-white/5 border border-red-500/20 p-12 rounded-[50px] text-white shadow-2xl backdrop-blur-xl">
          <h2 className="text-3xl font-orbitron font-black text-center mb-10 text-red-500 tracking-tighter italic uppercase">Ghost Terminal</h2>
          <div className="space-y-6">
            <input className="w-full bg-space-deep border border-white/10 p-5 rounded-2xl outline-none focus:border-red-500 text-white" placeholder="USUARIO GHOST" onChange={e => setU(e.target.value)} />
            <input className="w-full bg-space-deep border border-white/10 p-5 rounded-2xl outline-none focus:border-red-500 text-white" type="password" placeholder="CLAVE GHOST" onChange={e => setP(e.target.value)} />
            <input className="w-full bg-space-deep border border-white/10 p-5 rounded-2xl outline-none text-center font-black tracking-[1em] text-2xl focus:border-red-500 text-white" maxLength={6} placeholder="000000" onChange={e => setC(e.target.value)} />
            <button onClick={() => {
              if(u === ADMIN_CREDENTIALS.user && p === ADMIN_CREDENTIALS.pass && c === ADMIN_CREDENTIALS.securityCode) setView(AppView.ADMIN_PANEL); else alert('ERROR DE PROTOCOLO: ACCESO BLOQUEADO');
            }} className="w-full py-5 bg-red-600 rounded-2xl font-orbitron font-black text-xl text-white hover:bg-red-700 transition-all shadow-xl shadow-red-600/20">AUTORIZAR SISTEMA</button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-space-deep font-inter text-slate-100 overflow-x-hidden selection:bg-space-cyan selection:text-space-deep">
      <Header />
      <main className="relative z-10 max-w-[100vw]">
        {view === AppView.HOME && <HomeView />}
        {view === AppView.REGISTER && <RegisterView />}
        {view === AppView.LOGIN && <LoginView />}
        {view === AppView.DASHBOARD && <DashboardView />}
        {view === AppView.ADMIN_LOGIN && <AdminLoginView />}
        {view === AppView.ADMIN_PANEL && <AdminPanelView />}
        {view === AppView.SPACEBANK && <SpaceBankView />}
      </main>
      <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-space-purple blur-[160px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-space-blue blur-[160px] rounded-full animate-pulse delay-1000"></div>
      </div>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.05); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(6, 182, 212, 0.3); border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default App;
