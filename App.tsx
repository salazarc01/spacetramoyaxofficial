
import React, { useState, useEffect, useMemo, memo, useRef } from 'react';
import { 
  ArrowLeft, 
  User as UserIcon, 
  Bell, 
  LogOut, 
  Sparkles, 
  LayoutDashboard, 
  CreditCard, 
  ChevronRight, 
  Info, 
  CircleCheck, 
  Smartphone,
  Edit3,
  Settings,
  Lock,
  Send,
  Camera,
  Clock,
  Download,
  Share2,
  MessageCircle,
  Mail,
  X,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';
import { AppView, User, Notification } from './types';

const BANK_LOGO = "https://i.postimg.cc/kD3Pn8C6/Photoroom-20251229-195028.png";
const CREDIT_IMG = "https://i.postimg.cc/BvmKfFtJ/20260102-170520-0000.png";
const SOPORTE_EMAIL = "soportespacetramoyax@gmail.com";

const ADMIN_CREDENTIALS = {
  user: 'admin090870',
  pass: 'v9451679',
  securityCode: '090870'
};

const INITIAL_USERS: User[] = [
  { 
    id: '0001', 
    firstName: 'Luis', 
    lastName: 'Alejandro', 
    country: 'Venezuela', 
    phone: '584123151217', 
    email: 'luissalazarcabrera85@gmail.com', 
    password: 'v9451679', 
    balance: 100, 
    status: 'active', 
    createdAt: '2025-01-04T12:00:00Z',
    hasSeenWelcomeCredit: false
  },
  { 
    id: '0002', 
    firstName: 'Miss Slam', 
    lastName: 'Virtual', 
    country: 'El Salvador', 
    phone: '50375431210', 
    email: 'missslam@tramoyax.cdlt', 
    password: 'ms0121', 
    balance: 100, 
    status: 'active', 
    createdAt: '2025-01-05T10:00:00Z',
    hasSeenWelcomeCredit: false
  },
  { 
    id: '0003', 
    firstName: 'Alex', 
    lastName: 'Duarte', 
    country: 'Honduras', 
    phone: '50489887690', 
    email: 'alexduarte@tramoyax.cdlt', 
    password: 'copito.123', 
    balance: 100, 
    status: 'active', 
    createdAt: '2025-01-05T11:00:00Z',
    hasSeenWelcomeCredit: false
  }
];

const RealTimeClock: React.FC<{ showDate?: boolean }> = ({ showDate = false }) => {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex items-center gap-1">
      <Clock size={12} className="text-nova-gold" />
      <span className="text-[9px] font-bold uppercase tracking-widest">
        {showDate ? `${time.toLocaleDateString()} | ` : ''}{time.toLocaleTimeString()}
      </span>
    </div>
  );
};

const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.HOME);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activeTab, setActiveTab] = useState<AppView>(AppView.DASHBOARD);
  const [showCreditModal, setShowCreditModal] = useState(false);

  const DB_KEY = 'STX_DB_MASTER_V17';

  useEffect(() => {
    const savedData = localStorage.getItem(DB_KEY);
    let dbUsers = INITIAL_USERS;

    if (savedData) {
      try {
        dbUsers = JSON.parse(savedData);
        setUsers(dbUsers);
      } catch (e) {
        setUsers(INITIAL_USERS);
      }
    } else {
      localStorage.setItem(DB_KEY, JSON.stringify(INITIAL_USERS));
    }

    const savedNotifs = localStorage.getItem('STX_NOTIFS_V1');
    if (savedNotifs) {
      setNotifications(JSON.parse(savedNotifs));
    }

    const sessionKey = localStorage.getItem('STX_SESSION_KEY');
    if (sessionKey) {
      const activeUser = dbUsers.find(u => u.id === sessionKey);
      if (activeUser) {
        setCurrentUser(activeUser);
        setView(AppView.DASHBOARD);
        setActiveTab(AppView.DASHBOARD);
      }
    }
  }, []);

  const playHaptic = () => {
    if (window.navigator.vibrate) window.navigator.vibrate(15);
  };

  const playBeep = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(880, audioCtx.currentTime);
      gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.1);
    } catch (e) { console.debug("Audio play failed"); }
  };

  const getAccountNumber = (id: string) => {
    return "4532 " + (id || '0000').padStart(4, '0') + " 9087 0908";
  };

  const maskPhone = (phone: string) => {
    if (!phone || phone.length < 7) return phone;
    const first = phone.substring(0, 5);
    const last = phone.substring(phone.length - 1);
    const middleCount = phone.length - 6;
    return `${first}${Array(middleCount).fill('*').join('')}${last}`;
  };

  const generateReference = () => {
    let ref = '';
    for(let i = 0; i < 20; i++) ref += Math.floor(Math.random() * 10);
    return ref;
  };

  const addNotification = (userId: string, title: string, message: string, type: 'credit'|'sent'|'received', amount?: number) => {
    const newNotif: Notification = {
      id: Math.random().toString(36).substr(2, 9),
      userId,
      title,
      message,
      date: new Date().toLocaleString(),
      isRead: false,
      type,
      amount,
      reference: generateReference()
    };
    setNotifications(prev => {
      const updated = [newNotif, ...prev];
      localStorage.setItem('STX_NOTIFS_V1', JSON.stringify(updated));
      return updated;
    });
  };

  const updateUserData = (updatedUser: User) => {
    const updatedUsers = users.map(u => u.id === updatedUser.id ? updatedUser : u);
    setUsers(updatedUsers);
    localStorage.setItem(DB_KEY, JSON.stringify(updatedUsers));
  };

  const LandingPage = () => (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center animate-fade-in bg-nova-obsidian">
      <div className="relative z-10 space-y-12 w-full max-w-sm">
        <div className="space-y-4 animate-float">
          <div className="w-24 h-24 mx-auto bg-white/5 p-4 rounded-3xl glass flex items-center justify-center shadow-2xl">
            <img src={BANK_LOGO} className="w-full h-full object-contain" alt="Logo" />
          </div>
          <div className="flex flex-col items-center">
            <h1 className="font-orbitron font-black text-4xl tracking-tighter text-white uppercase italic leading-none">
              SPACE<span className="text-nova-gold">TRAMOYA</span> X
            </h1>
            <div className="h-0.5 w-32 bg-gradient-to-r from-transparent via-nova-gold to-transparent mt-2"></div>
            <p className="text-[10px] text-nova-gold/40 font-bold uppercase tracking-[0.4em] mt-2">Elite Private Banking</p>
          </div>
        </div>
        <div className="grid gap-4 mt-12">
          <button onClick={() => { playHaptic(); setView(AppView.LOGIN); }} className="w-full py-5 bg-white text-nova-obsidian font-orbitron font-black text-sm rounded-2xl shadow-xl active:scale-95 transition-all uppercase tracking-widest">Iniciar Sesión</button>
          <button onClick={() => { playHaptic(); setView(AppView.REGISTER); }} className="w-full py-5 glass text-white font-orbitron font-bold text-sm rounded-2xl border-white/10 active:scale-95 transition-all uppercase tracking-widest">Registrarse</button>
        </div>
      </div>
      <button onClick={() => { playHaptic(); setView(AppView.ADMIN_LOGIN); }} className="absolute bottom-6 right-6 w-8 h-8 opacity-[0.1] hover:opacity-100 transition-opacity flex items-center justify-center text-nova-gold z-[120]"><Settings size={14} /></button>
    </div>
  );

  const LoginView = () => {
    const [idInput, setIdInput] = useState('');
    const [passInput, setPassInput] = useState('');
    
    const handleActionLogin = (e: React.FormEvent) => {
      e.preventDefault();
      playHaptic();
      const inputVal = idInput.trim().toLowerCase();
      const user = users.find(u => (u.id === inputVal || u.email.toLowerCase() === inputVal) && u.password === passInput);
      
      if (user) {
        let activeUser = { ...user };
        
        if (!activeUser.hasSeenWelcomeCredit) {
          activeUser.balance += 100;
          activeUser.hasSeenWelcomeCredit = true;
          const updatedUsers = users.map(u => u.id === activeUser.id ? activeUser : u);
          setUsers(updatedUsers);
          localStorage.setItem(DB_KEY, JSON.stringify(updatedUsers));
          addNotification(
            activeUser.id, 
            "Crédito STX Recibido", 
            "FELIZ AÑO DE TRAMOYAS 2026. Se ha acreditado su bono de bienvenida.", 
            'credit', 
            100
          );
          setShowCreditModal(true);
          playBeep();
        }

        setCurrentUser(activeUser);
        localStorage.setItem('STX_SESSION_KEY', activeUser.id);
        setView(AppView.DASHBOARD);
        setActiveTab(AppView.DASHBOARD);
      } else {
        alert("CREDENCIALES INVÁLIDAS.");
      }
    };

    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 animate-fade-in bg-nova-obsidian">
        <button onClick={() => setView(AppView.HOME)} className="absolute top-12 left-8 w-12 h-12 glass rounded-full flex items-center justify-center text-white"><ArrowLeft size={20} /></button>
        <div className="w-full max-w-sm space-y-10">
          <div className="text-center space-y-2">
             <h1 className="text-3xl font-orbitron font-black text-white uppercase tracking-tighter leading-none">ACCEDER AL<span className="text-nova-gold"> SISTEMA</span></h1>
             <p className="text-[10px] text-nova-titanium font-bold uppercase tracking-[0.3em]">Protocolo de Seguridad</p>
          </div>
          <form onSubmit={handleActionLogin} className="space-y-6">
            <div className="space-y-1">
              <label className="text-[10px] uppercase text-nova-gold font-bold ml-1 tracking-widest">ID o Correo</label>
              <div className="relative">
                <input type="text" value={idInput} onChange={(e) => setIdInput(e.target.value)} className="w-full bg-black/40 border border-white/5 p-5 pl-12 rounded-2xl text-white outline-none focus:border-nova-gold/50 text-sm" placeholder="ID (Ej: 0001)" required />
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase text-nova-gold font-bold ml-1 tracking-widest">Contraseña</label>
              <div className="relative">
                <input type="password" value={passInput} onChange={(e) => setPassInput(e.target.value)} className="w-full bg-black/40 border border-white/5 p-5 pl-12 rounded-2xl text-white outline-none focus:border-nova-gold/50 text-sm tracking-widest" placeholder="••••••••" required />
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
              </div>
            </div>
            <button type="submit" className="w-full py-5 bg-white text-nova-obsidian font-orbitron font-black text-sm rounded-2xl shadow-2xl active:scale-95 transition-all uppercase tracking-widest">Entrar</button>
          </form>
        </div>
      </div>
    );
  };

  const RegisterView = () => {
    const [regData, setRegData] = useState({
      firstName: '',
      lastName: '',
      country: '',
      phone: '',
      email: '',
      password: ''
    });

    const handleRegister = (e: React.FormEvent) => {
      e.preventDefault();
      playHaptic();
      const emailExists = users.find(u => u.email.toLowerCase() === regData.email.toLowerCase());
      if (emailExists) return alert("EL CORREO YA ESTÁ REGISTRADO.");
      const newId = (users.length + 1).toString().padStart(4, '0');
      const newUser: User = {
        id: newId,
        firstName: regData.firstName,
        lastName: regData.lastName,
        country: regData.country,
        phone: regData.phone,
        email: regData.email,
        password: regData.password,
        balance: 0,
        status: 'active',
        createdAt: new Date().toISOString(),
        hasSeenWelcomeCredit: false
      };
      const updatedUsers = [...users, newUser];
      setUsers(updatedUsers);
      localStorage.setItem(DB_KEY, JSON.stringify(updatedUsers));
      alert(`REGISTRO EXITOSO.\nSU ID DE ACCESO ES: ${newId}\nPOR FAVOR, INICIE SESIÓN.`);
      setView(AppView.LOGIN);
    };

    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 animate-fade-in bg-nova-obsidian overflow-y-auto">
        <button onClick={() => setView(AppView.HOME)} className="absolute top-12 left-8 w-12 h-12 glass rounded-full flex items-center justify-center text-white"><ArrowLeft size={20} /></button>
        <div className="w-full max-sm:px-4 max-w-sm space-y-8 my-12">
          <div className="text-center space-y-2">
             <h1 className="text-3xl font-orbitron font-black text-white uppercase tracking-tighter leading-none">REGISTRO <span className="text-nova-gold">STX</span></h1>
             <p className="text-[10px] text-nova-titanium font-bold uppercase tracking-[0.3em]">Protocolo de Ingreso</p>
          </div>
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input type="text" placeholder="Nombre" value={regData.firstName} onChange={e => setRegData({...regData, firstName: e.target.value})} className="w-full bg-black/40 border border-white/5 p-4 rounded-xl text-white text-xs" required />
              <input type="text" placeholder="Apellido" value={regData.lastName} onChange={e => setRegData({...regData, lastName: e.target.value})} className="w-full bg-black/40 border border-white/5 p-4 rounded-xl text-white text-xs" required />
            </div>
            <input type="text" placeholder="País" value={regData.country} onChange={e => setRegData({...regData, country: e.target.value})} className="w-full bg-black/40 border border-white/5 p-4 rounded-xl text-white text-xs" required />
            <input type="tel" placeholder="Teléfono" value={regData.phone} onChange={e => setRegData({...regData, phone: e.target.value})} className="w-full bg-black/40 border border-white/5 p-4 rounded-xl text-white text-xs" required />
            <input type="email" placeholder="Correo Electrónico" value={regData.email} onChange={e => setRegData({...regData, email: e.target.value})} className="w-full bg-black/40 border border-white/5 p-4 rounded-xl text-white text-xs" required />
            <input type="password" placeholder="Contraseña" value={regData.password} onChange={e => setRegData({...regData, password: e.target.value})} className="w-full bg-black/40 border border-white/5 p-4 rounded-xl text-white text-xs tracking-widest" required />
            <button type="submit" className="w-full py-5 bg-white text-nova-obsidian font-orbitron font-black text-sm rounded-2xl shadow-2xl active:scale-95 transition-all uppercase tracking-widest">Crear Cuenta</button>
          </form>
        </div>
      </div>
    );
  };

  const AdminLoginView = () => {
    const [user, setUser] = useState('');
    const [pass, setPass] = useState('');
    const [code, setCode] = useState('');
    const handleAdminLogin = (e: React.FormEvent) => {
      e.preventDefault();
      if (user === ADMIN_CREDENTIALS.user && pass === ADMIN_CREDENTIALS.pass && code === ADMIN_CREDENTIALS.securityCode) {
        setView(AppView.ADMIN_PANEL);
      } else {
        alert("ACCESO DENEGADO.");
      }
    };
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 animate-fade-in bg-nova-obsidian">
        <button onClick={() => setView(AppView.HOME)} className="absolute top-12 left-8 w-12 h-12 glass rounded-full flex items-center justify-center text-white"><ArrowLeft size={20} /></button>
        <div className="w-full max-sm:px-4 max-w-sm space-y-8">
          <div className="text-center space-y-2">
             <h1 className="text-3xl font-orbitron font-black text-white uppercase tracking-tighter">CENTRO DE <span className="text-nova-gold">CONTROL</span></h1>
             <p className="text-[10px] text-nova-titanium font-bold uppercase tracking-[0.3em]">Acceso Administrativo</p>
          </div>
          <form onSubmit={handleAdminLogin} className="space-y-4">
            <input type="text" value={user} onChange={e => setUser(e.target.value)} className="w-full bg-black/40 border border-white/5 p-5 rounded-2xl text-white outline-none focus:border-nova-gold/50 text-sm" placeholder="Usuario Admin" required />
            <input type="password" value={pass} onChange={e => setPass(e.target.value)} className="w-full bg-black/40 border border-white/5 p-5 rounded-2xl text-white outline-none focus:border-nova-gold/50 text-sm" placeholder="Contraseña" required />
            <input type="text" value={code} onChange={e => setCode(e.target.value)} className="w-full bg-black/40 border border-white/5 p-5 rounded-2xl text-white outline-none focus:border-nova-gold/50 text-sm font-mono tracking-[1em] text-center" placeholder="SEC-CODE" required />
            <button type="submit" className="w-full py-5 bg-nova-gold text-nova-obsidian font-orbitron font-black text-sm rounded-2xl shadow-2xl active:scale-95 transition-all uppercase tracking-widest">Autenticar</button>
          </form>
        </div>
      </div>
    );
  };

  const AdminPanelView = () => {
    const [search, setSearch] = useState('');
    const handleAddBalance = (userId: string) => {
      const amt = prompt("Monto a acreditar:");
      if (!amt || isNaN(parseFloat(amt))) return;
      const user = users.find(u => u.id === userId);
      if (user) {
        const updated = { ...user, balance: user.balance + parseFloat(amt) };
        updateUserData(updated);
        addNotification(userId, "Crédito Administrativo", `Se han acreditado ${amt} NV a su cuenta por el administrador.`, 'credit', parseFloat(amt));
        alert("Balance actualizado.");
      }
    };
    const handleDeleteUser = (userId: string) => {
        if (confirm("¿Eliminar usuario?")) {
            const updated = users.filter(u => u.id !== userId);
            setUsers(updated);
            localStorage.setItem(DB_KEY, JSON.stringify(updated));
        }
    };
    return (
      <div className="min-h-screen bg-nova-obsidian text-white p-8 space-y-8 animate-fade-in overflow-y-auto pb-12">
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <h1 className="text-3xl font-orbitron font-black tracking-tighter uppercase leading-none">ADMIN <span className="text-nova-gold">PANEL</span></h1>
            <p className="text-[10px] text-nova-titanium uppercase tracking-widest font-bold">Gestión de Usuarios STX</p>
          </div>
          <button onClick={() => setView(AppView.HOME)} className="p-4 glass rounded-2xl text-nova-crimson"><LogOut size={20} /></button>
        </div>
        <input value={search} onChange={e => setSearch(e.target.value)} className="w-full bg-black/40 border border-white/10 p-4 rounded-xl text-white text-xs outline-none focus:border-nova-gold/40" placeholder="Buscar por ID, Nombre o Email..." />
        <div className="space-y-4">
          {users.filter(u => u.id.includes(search) || u.firstName.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())).map(u => (
            <div key={u.id} className="glass p-6 rounded-3xl border-white/5 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-nova-gold uppercase">ID {u.id} • {u.status}</p>
                <h4 className="font-bold text-white uppercase">{u.firstName} {u.lastName}</h4>
                <p className="text-[10px] text-nova-titanium/50">{u.email}</p>
                <p className="text-lg font-orbitron font-black text-nova-gold">{u.balance.toLocaleString()} <span className="text-xs">NV</span></p>
              </div>
              <div className="flex flex-col gap-2">
                <button onClick={() => handleAddBalance(u.id)} className="p-3 bg-white/5 rounded-xl text-nova-gold hover:bg-white/10 transition-colors"><CreditCard size={18} /></button>
                <button onClick={() => handleDeleteUser(u.id)} className="p-3 bg-white/5 rounded-xl text-nova-crimson hover:bg-white/10 transition-colors"><X size={18} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const CreditModal = () => {
    if (!currentUser) return null;
    return (
      <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 glass backdrop-blur-2xl animate-fade-in">
        <div className="max-w-md w-full bg-[#0a0a0f] border-2 border-white rounded-[40px] p-8 shadow-[0_0_50px_rgba(255,255,255,0.1)] relative overflow-hidden flex flex-col">
          <button onClick={() => setShowCreditModal(false)} className="absolute top-6 right-6 text-white/20 hover:text-white transition-colors z-10"><X size={24} /></button>
          <div className="space-y-6 flex flex-col">
            <div className="w-full border-4 border-white rounded-[32px] overflow-hidden shadow-2xl bg-black">
              <img src={CREDIT_IMG} className="w-full h-auto object-contain" alt="Crédito STX" />
            </div>
            <div className="space-y-4">
              <div className="flex flex-col">
                <h2 className="text-2xl font-orbitron font-black text-white uppercase italic tracking-tighter leading-none">Credito STX</h2>
                <p className="text-nova-gold font-black text-[10px] uppercase tracking-widest mt-1">FELIZ AÑO DE TRAMOYAS 2026</p>
              </div>
              <p className="text-[10px] text-nova-titanium/80 leading-relaxed font-medium uppercase tracking-tight">Incentivo espacial para iniciar el ciclo 2026 con el pie derecho en la red Tramoya X. Este crédito ya ha sido sumado automáticamente a su balance.</p>
              <div className="flex justify-between items-end border-t border-white/10 pt-4">
                <div className="flex flex-col">
                  <span className="text-[8px] text-nova-gold font-bold uppercase tracking-widest">Monto Acreditado</span>
                  <span className="text-3xl font-orbitron font-black text-white italic">100 <span className="text-xs">NV</span></span>
                </div>
                <div className="text-right flex flex-col items-end">
                  <span className="text-[7px] text-nova-titanium/40 font-mono">{new Date().toLocaleDateString()}</span>
                  <span className="text-[7px] text-nova-titanium/40 font-mono">{new Date().toLocaleTimeString()}</span>
                </div>
              </div>
            </div>
            <button onClick={() => setShowCreditModal(false)} className="w-full py-5 glass border-white/10 text-white/40 font-orbitron font-black text-sm uppercase rounded-2xl tracking-widest">Cerrar Anuncio</button>
          </div>
        </div>
      </div>
    );
  };

  const SpaceBankView = () => {
    const [tab, setTab] = useState<'card' | 'transfer' | 'scan'>('card');
    const [destId, setDestId] = useState('');
    const [amount, setAmount] = useState('');
    const [motivo, setMotivo] = useState('');
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const recipient = useMemo(() => users.find(u => u.id === destId.trim()), [destId, users]);
    const balanceAfter = currentUser ? currentUser.balance - (parseFloat(amount) || 0) : 0;
    const qrData = useMemo(() => JSON.stringify({ id: currentUser?.id, firstName: currentUser?.firstName, lastName: currentUser?.lastName, acc: getAccountNumber(currentUser?.id || '') }), [currentUser]);
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrData)}`;

    useEffect(() => {
      if (tab === 'scan') {
        const scanner = new Html5Qrcode("reader");
        scanner.start({ facingMode: "environment" }, { fps: 10, qrbox: { width: 250, height: 250 } }, (decodedText) => {
          try {
            const data = JSON.parse(decodedText);
            if (data.id) { playBeep(); playHaptic(); setDestId(data.id); setTab('transfer'); scanner.stop(); }
          } catch (e) { console.debug("Not a valid STX QR"); }
        }, undefined).catch(err => console.error("Camera error:", err));
        return () => { scanner.isScanning && scanner.stop(); };
      }
    }, [tab]);

    const handleTransfer = () => {
      if (!destId || !amount || !motivo) return alert("Complete todos los campos.");
      if (balanceAfter < 0) return alert("Saldo insuficiente.");
      playHaptic();
      const ref = generateReference();
      const amtNum = parseFloat(amount);
      addNotification(currentUser!.id, "Transferencia Enviada", `Has enviado ${amtNum} NV a ID ${destId}. Protocolo iniciado via Gmail.`, 'sent', amtNum);
      if (recipient) {
         addNotification(recipient.id, "Pago Recibido", `Has recibido ${amtNum} NV de ${currentUser?.firstName} ${currentUser?.lastName}.`, 'received', amtNum);
      }
      const body = `Trasferencia STX\n\nDe: ${currentUser?.firstName} ${currentUser?.lastName}\nCodigo de la persona que trasfiere: ${currentUser?.id}\nMonto a trasferir: ${amount} NV\nMonto disponible: ${currentUser?.balance.toLocaleString()} NV\nMonto que queda despues de la trasferencia: ${balanceAfter.toLocaleString()} NV\nMotivo: ${motivo}\nReferencia: ${ref}`;
      window.location.href = `mailto:${SOPORTE_EMAIL}?subject=Trasferencia STX&body=${encodeURIComponent(body)}`;
      setDestId(''); setAmount(''); setMotivo('');
    };

    return (
      <div className="pb-32 pt-24 px-6 space-y-8 animate-fade-in max-w-lg mx-auto">
        <canvas ref={canvasRef} width="600" height="650" className="hidden"></canvas>
        <div className="flex justify-between items-end">
          <div className="space-y-1">
            <h3 className="text-nova-titanium/50 text-[10px] uppercase font-bold tracking-widest">Balance Disponible</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-orbitron font-black text-white">{currentUser?.balance.toLocaleString()}</span>
              <span className="text-nova-gold font-bold text-sm">NV</span>
            </div>
          </div>
          <div className="w-12 h-12 glass rounded-2xl flex items-center justify-center border-nova-gold/30 gold-shadow">
            <img src={BANK_LOGO} className="w-8 h-8 object-contain" alt="STX" />
          </div>
        </div>
        <div className="flex p-1 glass rounded-2xl border-white/5">
          <button onClick={() => setTab('card')} className={`flex-1 py-3 rounded-xl text-[9px] font-bold uppercase tracking-widest transition-all ${tab === 'card' ? 'bg-white text-nova-obsidian' : 'text-nova-titanium/50'}`}>Mi QR</button>
          <button onClick={() => setTab('scan')} className={`flex-1 py-3 rounded-xl text-[9px] font-bold uppercase tracking-widest transition-all ${tab === 'scan' ? 'bg-white text-nova-obsidian' : 'text-nova-titanium/50'}`}>Escanear</button>
          <button onClick={() => setTab('transfer')} className={`flex-1 py-3 rounded-xl text-[9px] font-bold uppercase tracking-widest transition-all ${tab === 'transfer' ? 'bg-white text-nova-obsidian' : 'text-nova-titanium/50'}`}>Transferir</button>
        </div>
        {tab === 'card' && (
          <div className="flex flex-col items-center gap-6 animate-fade-in">
             <div className="p-8 glass rounded-[40px] border-nova-gold/20 shadow-2xl bg-white/5">
                <div className="bg-white p-5 rounded-[32px] shadow-inner"><img src={qrUrl} className="w-44 h-44" alt="QR" /></div>
             </div>
             <p className="text-[10px] text-nova-titanium uppercase font-bold tracking-[0.3em]">Recibir Nóvares</p>
          </div>
        )}
        {tab === 'scan' && (
          <div className="flex flex-col items-center gap-8 animate-fade-in">
             <div className="w-full aspect-square glass rounded-[40px] border-nova-gold/20 flex flex-col items-center justify-center relative overflow-hidden group">
                <div id="reader" className="w-full h-full"></div>
                <div className="absolute top-1/2 left-0 w-full h-[1px] bg-nova-gold/40 shadow-[0_0_15px_#eab308] animate-scan pointer-events-none z-10"></div>
             </div>
          </div>
        )}
        {tab === 'transfer' && (
          <div className="glass p-8 rounded-[32px] space-y-5 animate-fade-in shadow-xl border-white/5">
             <div className="space-y-1 relative">
               <label className="text-[10px] uppercase text-nova-gold/60 font-black tracking-widest ml-1 mb-1 block">ID Destinatario</label>
               <input 
                 value={destId} 
                 onChange={e => setDestId(e.target.value)} 
                 className="w-full bg-black/40 border border-white/10 p-4 rounded-xl text-white font-mono text-sm outline-none focus:border-nova-gold/50 transition-all" 
                 placeholder="Ej: 0002" 
               />
               {/* Guía en tiempo real del nombre del destinatario */}
               {destId.trim() && (
                 <div className="mt-2 flex items-center gap-2 px-1 animate-fade-in">
                    {recipient ? (
                      <div className="flex items-center gap-1.5 py-1 px-3 bg-nova-emerald/10 border border-nova-emerald/20 rounded-full">
                         <CircleCheck size={10} className="text-nova-emerald" />
                         <span className="text-[10px] font-black text-nova-emerald uppercase tracking-tighter">
                           Destinatario: {recipient.firstName} {recipient.lastName}
                         </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 py-1 px-3 bg-nova-crimson/10 border border-nova-crimson/20 rounded-full">
                         <X size={10} className="text-nova-crimson" />
                         <span className="text-[10px] font-black text-nova-crimson/60 uppercase tracking-tighter">
                           Usuario no encontrado
                         </span>
                      </div>
                    )}
                 </div>
               )}
             </div>
             <div className="space-y-1">
               <label className="text-[10px] uppercase text-nova-gold/60 font-black tracking-widest ml-1 mb-1 block">Monto (NV)</label>
               <input type="number" value={amount} onChange={e => setAmount(e.target.value)} className="w-full bg-black/40 border border-white/10 p-4 rounded-xl text-white font-orbitron text-2xl outline-none focus:border-nova-gold/50" placeholder="0.00" />
             </div>
             <div className="space-y-1">
               <label className="text-[10px] uppercase text-nova-gold/60 font-black tracking-widest ml-1 mb-1 block">Motivo</label>
               <input value={motivo} onChange={e => setMotivo(e.target.value)} className="w-full bg-black/40 border border-white/10 p-4 rounded-xl text-white text-xs outline-none focus:border-nova-gold/50" placeholder="Referencia corta" />
             </div>
             <button onClick={handleTransfer} className="w-full py-4 bg-nova-gold text-nova-obsidian rounded-xl font-orbitron font-black text-xs uppercase tracking-widest shadow-xl flex items-center justify-center gap-2 mt-4">
               <Send size={16} /> Confirmar Protocolo
             </button>
          </div>
        )}
      </div>
    );
  };

  const NotificationsView = () => (
      <div className="pb-32 pt-24 px-6 space-y-8 animate-fade-in max-w-lg mx-auto">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-orbitron font-black text-white italic leading-none tracking-tighter uppercase">HISTORIAL <span className="text-nova-gold">MOV</span></h1>
          <p className="text-[10px] text-nova-titanium font-bold uppercase tracking-[0.3em]">Avisos y Actividad Reciente</p>
        </div>
        <div className="space-y-4">
          {notifications.filter(n => n.userId === currentUser?.id).map((notif) => (
            <div key={notif.id} className="glass p-6 rounded-[32px] border-white/5 space-y-3 relative active:scale-95 transition-transform overflow-hidden">
                <div className={`absolute top-0 right-0 p-4 opacity-10 ${notif.type === 'credit' ? 'text-nova-gold' : notif.type === 'sent' ? 'text-nova-crimson' : 'text-nova-emerald'}`}>
                    {notif.type === 'credit' && <Sparkles size={40} />}
                    {notif.type === 'sent' && <TrendingDown size={40} />}
                    {notif.type === 'received' && <TrendingUp size={40} />}
                </div>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${notif.type === 'credit' ? 'bg-nova-gold/10 text-nova-gold' : notif.type === 'sent' ? 'bg-nova-crimson/10 text-nova-crimson' : 'bg-nova-emerald/10 text-nova-emerald'}`}>
                    {notif.type === 'credit' && <Sparkles size={18} />}
                    {notif.type === 'sent' && <TrendingDown size={18} />}
                    {notif.type === 'received' && <TrendingUp size={18} />}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[8px] text-nova-titanium/50 font-bold uppercase tracking-widest">{notif.date}</span>
                    <h4 className="text-sm font-bold text-white uppercase leading-none">{notif.title}</h4>
                  </div>
                </div>
                <p className="text-xs text-nova-titanium/80 leading-relaxed italic pr-12">"{notif.message}"</p>
                {notif.amount && (
                  <div className="pt-2 flex justify-between items-center">
                    <span className="text-[8px] text-white/20 font-mono">Ref: {notif.reference?.slice(0, 10)}...</span>
                    <span className={`text-lg font-orbitron font-black ${notif.type === 'sent' ? 'text-nova-crimson' : 'text-nova-gold'}`}>
                      {notif.type === 'sent' ? '-' : '+'}{notif.amount} <span className="text-[10px]">NV</span>
                    </span>
                  </div>
                )}
            </div>
          ))}
          {notifications.filter(n => n.userId === currentUser?.id).length === 0 && (
            <div className="text-center py-20 text-nova-titanium/20 uppercase font-black tracking-widest text-[10px]">Sin avisos registrados</div>
          )}
        </div>
      </div>
  );

  const DashboardView = () => (
    <div className="pb-32 pt-24 px-6 space-y-8 animate-fade-in max-w-lg mx-auto">
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-orbitron font-black text-white italic leading-none uppercase tracking-tighter">HOLA, <span className="text-nova-gold">{currentUser?.firstName}</span></h1>
            <RealTimeClock showDate />
        </div>
        <div className="px-3 py-1 glass rounded-full"><span className="text-[8px] font-black text-nova-gold uppercase tracking-[0.2em]">ID {currentUser?.id}</span></div>
      </div>
      <div className="glass p-8 rounded-[40px] border-nova-gold/10 space-y-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5"><Sparkles size={40} className="text-nova-gold" /></div>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-nova-gold/10 rounded-2xl flex items-center justify-center text-nova-gold"><LayoutDashboard size={28} /></div>
          <div>
            <h3 className="text-[10px] font-bold text-nova-titanium/50 uppercase tracking-widest leading-none mb-1">Balance SpaceBank</h3>
            <p className="text-3xl font-orbitron font-black text-white leading-none">{currentUser?.balance.toLocaleString()} <span className="text-xs text-nova-gold">NV</span></p>
          </div>
        </div>
        <button onClick={() => { playHaptic(); setView(AppView.SPACEBANK); setActiveTab(AppView.SPACEBANK); }} className="w-full py-4 bg-white/5 rounded-2xl flex items-center justify-center gap-3 text-nova-gold border border-white/5 active:scale-95 transition-all">
            <CreditCard size={18} />
            <span className="text-[10px] font-black uppercase tracking-widest">Ver Monedero</span>
        </button>
      </div>
      <div className="space-y-4">
        <h3 className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] ml-2">Movimientos Recientes</h3>
        {notifications.filter(n => n.userId === currentUser?.id).slice(0, 3).map(n => (
          <div key={n.id} className="glass p-4 rounded-2xl flex items-center justify-between border-white/5">
             <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${n.type === 'credit' ? 'bg-nova-gold/10 text-nova-gold' : 'bg-white/5 text-white/40'}`}>
                  {n.type === 'credit' ? <Sparkles size={14}/> : <TrendingUp size={14}/>}
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="text-[10px] font-bold text-white uppercase">{n.title}</span>
                  <span className="text-[8px] text-nova-titanium/40 uppercase font-bold">{n.date.split(',')[0]}</span>
                </div>
             </div>
             <span className={`text-xs font-orbitron font-bold ${n.type === 'sent' ? 'text-nova-crimson' : 'text-nova-gold'}`}>
               {n.type === 'sent' ? '-' : '+'}{n.amount} NV
             </span>
          </div>
        ))}
        {notifications.filter(n => n.userId === currentUser?.id).length === 0 && (
          <div className="text-[10px] text-center text-white/10 uppercase font-bold py-8">Sin actividad</div>
        )}
      </div>
    </div>
  );

  const ProfileView = () => {
    const handleLogout = () => {
      playHaptic();
      localStorage.removeItem('STX_SESSION_KEY');
      setCurrentUser(null);
      setView(AppView.HOME);
    };
    return (
      <div className="pb-32 pt-24 px-6 space-y-8 animate-fade-in max-w-lg mx-auto">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-24 h-24 bg-white/5 rounded-[40px] flex items-center justify-center border-2 border-nova-gold/20 shadow-2xl relative overflow-hidden group">
            <UserIcon size={40} className="text-nova-gold" />
            <div className="absolute inset-0 bg-nova-gold/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"><Camera size={24} className="text-white" /></div>
          </div>
          <div className="space-y-1">
            <h2 className="text-2xl font-orbitron font-black text-white italic uppercase tracking-tighter leading-none">{currentUser?.firstName} <span className="text-nova-gold">{currentUser?.lastName}</span></h2>
            <p className="text-[10px] text-nova-titanium font-bold uppercase tracking-[0.3em]">{currentUser?.email}</p>
          </div>
        </div>
        <div className="glass rounded-[32px] overflow-hidden border-white/5">
          {[
            { label: 'País', value: currentUser?.country, icon: <Info size={16} /> },
            { label: 'Teléfono', value: maskPhone(currentUser?.phone || ''), icon: <Smartphone size={16} /> },
            { label: 'Cuenta STX', value: getAccountNumber(currentUser?.id || ''), icon: <CreditCard size={16} /> },
            { label: 'Fecha de Registro', value: new Date(currentUser?.createdAt || '').toLocaleDateString(), icon: <Clock size={16} /> }
          ].map((item, idx) => (
            <div key={idx} className="flex items-center justify-between p-5 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
              <div className="flex items-center gap-4">
                <div className="text-nova-gold opacity-50">{item.icon}</div>
                <div className="flex flex-col">
                  <span className="text-[8px] text-nova-titanium/50 font-bold uppercase tracking-widest">{item.label}</span>
                  <span className="text-xs text-white font-medium uppercase">{item.value}</span>
                </div>
              </div>
              <ChevronRight size={14} className="text-white/10" />
            </div>
          ))}
        </div>
        <div className="space-y-3">
          <button className="w-full py-5 bg-white/5 rounded-2xl flex items-center justify-between px-6 border border-white/5 group active:scale-95 transition-all">
            <div className="flex items-center gap-4">
              <Settings size={18} className="text-nova-titanium" />
              <span className="text-[10px] font-black uppercase tracking-widest text-white">Seguridad y Privacidad</span>
            </div>
            <ChevronRight size={14} className="text-white/10 group-hover:text-nova-gold transition-colors" />
          </button>
          <button onClick={handleLogout} className="w-full py-5 bg-nova-crimson/10 rounded-2xl flex items-center justify-center gap-3 text-nova-crimson border border-nova-crimson/20 active:scale-95 transition-all mt-4">
            <LogOut size={18} />
            <span className="text-[10px] font-black uppercase tracking-widest">Finalizar Protocolo</span>
          </button>
        </div>
      </div>
    );
  };

  const HeaderComp = () => (
    <header className="fixed top-0 left-0 right-0 z-[100] bg-nova-obsidian/95 border-b border-white/5 px-6 pt-6 pb-4">
      <div className="max-w-lg mx-auto flex justify-between items-center">
        <div className="flex flex-col">
          <h2 className="font-orbitron font-black text-xl italic tracking-tighter text-white uppercase leading-none">SPACE<span className="text-nova-gold">TRAMOYA</span></h2>
          <div className="flex items-center gap-1 mt-1 opacity-60"><RealTimeClock /><span className="text-[7px] text-white/50 font-bold uppercase tracking-widest ml-1">STX_SECURE</span></div>
        </div>
      </div>
    </header>
  );

  const BottomDockComp = () => (
    <nav className="fixed bottom-0 left-0 right-0 z-[110] px-6 pb-6 pt-4 glass border-t border-white/5 rounded-t-[36px]">
      <div className="max-w-md mx-auto flex justify-between items-center px-4">
        <button onClick={() => { playHaptic(); setView(AppView.DASHBOARD); setActiveTab(AppView.DASHBOARD); }} className={`flex flex-col items-center gap-1.5 transition-all ${activeTab === AppView.DASHBOARD ? 'text-nova-gold' : 'text-nova-titanium/30'}`}><LayoutDashboard size={20} /><span className="text-[7px] font-black uppercase tracking-[0.2em]">Inicio</span></button>
        <button onClick={() => { playHaptic(); setView(AppView.SPACEBANK); setActiveTab(AppView.SPACEBANK); }} className={`flex flex-col items-center gap-1.5 transition-all ${activeTab === AppView.SPACEBANK ? 'text-nova-gold' : 'text-nova-titanium/30'}`}><CreditCard size={20} /><span className="text-[7px] font-black uppercase tracking-[0.2em]">Bank</span></button>
        <button onClick={() => { playHaptic(); setView(AppView.NOTIFICATIONS); setActiveTab(AppView.NOTIFICATIONS); }} className={`flex flex-col items-center gap-1.5 transition-all ${activeTab === AppView.NOTIFICATIONS ? 'text-nova-gold' : 'text-nova-titanium/30'}`}><div className="relative"><Bell size={20} />{notifications.filter(n => n.userId === currentUser?.id && !n.isRead).length > 0 && (<div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-nova-crimson rounded-full"></div>)}</div><span className="text-[7px] font-black uppercase tracking-[0.2em]">Avisos</span></button>
        <button onClick={() => { playHaptic(); setView(AppView.PROFILE); setActiveTab(AppView.PROFILE); }} className={`flex flex-col items-center gap-1.5 transition-all ${activeTab === AppView.PROFILE ? 'text-nova-gold' : 'text-nova-titanium/30'}`}><UserIcon size={20} /><span className="text-[7px] font-black uppercase tracking-[0.2em]">Perfil</span></button>
      </div>
    </nav>
  );

  return (
    <div className="min-h-screen relative font-inter overflow-x-hidden selection:bg-nova-gold/30">
      {showCreditModal && <CreditModal />}
      {view === AppView.HOME && <LandingPage />}
      {view === AppView.LOGIN && <LoginView />}
      {view === AppView.REGISTER && <RegisterView />}
      {view === AppView.ADMIN_LOGIN && <AdminLoginView />}
      {view === AppView.ADMIN_PANEL && <AdminPanelView />}
      {(view === AppView.DASHBOARD || view === AppView.SPACEBANK || view === AppView.NOTIFICATIONS || view === AppView.PROFILE) && (<><HeaderComp /><main className="animate-fade-in">{view === AppView.DASHBOARD && <DashboardView />}{view === AppView.SPACEBANK && <SpaceBankView />}{view === AppView.NOTIFICATIONS && <NotificationsView />}{view === AppView.PROFILE && <ProfileView />}</main><BottomDockComp /></>)}
    </div>
  );
};

export default App;
