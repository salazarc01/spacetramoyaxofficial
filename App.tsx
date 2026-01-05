
import React, { useState, useEffect, useMemo, useRef } from 'react';
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
  Smartphone,
  Settings,
  Send,
  Clock,
  TrendingUp,
  TrendingDown,
  Cpu,
  Globe,
  Newspaper,
  ChevronDown,
  ChevronUp,
  QrCode,
  Scan,
  Calendar,
  ShieldCheck,
  Flag
} from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';
import { AppView, User, Notification } from './types';

const BANK_LOGO = "https://i.postimg.cc/kD3Pn8C6/Photoroom-20251229-195028.png";
const CREDIT_IMG = "https://i.postimg.cc/BvmKfFtJ/20260102-170520-0000.png";
const SOPORTE_EMAIL = "soportespacetramoyax@gmail.com";

const INITIAL_USERS: User[] = [
  { id: '0001', firstName: 'Luis', lastName: 'Alejandro', country: 'Venezuela', phone: '584123151217', email: 'luissalazarcabrera85@gmail.com', password: 'v9451679', balance: 100, status: 'active', createdAt: '2025-01-04T12:00:00Z', hasSeenWelcomeCredit: false }
];

const ADMIN_CREDENTIALS = { user: 'admin090870', pass: 'v9451679', securityCode: '090870' };

const RealTimeClock: React.FC<{ showDate?: boolean }> = ({ showDate = false }) => {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex items-center gap-1">
      <Clock size={12} className="text-nova-gold" />
      <span className="text-[9px] font-bold uppercase tracking-widest text-white/80">
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
  const qrReaderRef = useRef<Html5Qrcode | null>(null);

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
    if (savedNotifs) setNotifications(JSON.parse(savedNotifs));
    
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

  const playHaptic = () => { if (window.navigator.vibrate) window.navigator.vibrate(15); };
  const generateReference = () => { let ref = ''; for(let i = 0; i < 20; i++) ref += Math.floor(Math.random() * 10); return ref; };
  
  const updateUserData = (updatedUser: User) => {
    setUsers(prev => {
      const updatedUsers = prev.map(u => u.id === updatedUser.id ? updatedUser : u);
      localStorage.setItem(DB_KEY, JSON.stringify(updatedUsers));
      return updatedUsers;
    });
  };

  const addNotification = (userId: string, title: string, message: string, type: 'credit'|'sent'|'received', amount?: number) => {
    const now = new Date();
    const newNotif: Notification = {
      id: Math.random().toString(36).substr(2, 9), userId, title, message,
      date: `${now.toLocaleDateString()} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      isRead: false, type, amount, reference: generateReference()
    };
    setNotifications(prev => {
      const updated = [newNotif, ...prev];
      localStorage.setItem('STX_NOTIFS_V1', JSON.stringify(updated));
      return updated;
    });
  };

  const LandingPage = () => (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 animate-fade-in bg-nova-obsidian overflow-y-auto">
      <div className="relative z-10 space-y-12 w-full max-w-sm">
        <div className="space-y-4 animate-float text-center">
          <div className="w-28 h-28 mx-auto bg-white/5 p-4 rounded-[2rem] glass flex items-center justify-center shadow-2xl border border-nova-gold/20">
            <img src={BANK_LOGO} className="w-full h-full object-contain" alt="Logo" />
          </div>
          <div className="flex flex-col items-center">
            <h1 className="font-orbitron font-black text-4xl tracking-tighter text-white uppercase italic leading-none">SPACE<span className="text-nova-gold">TRAMOYA</span> X</h1>
            <div className="h-0.5 w-32 bg-gradient-to-r from-transparent via-nova-gold to-transparent mt-3"></div>
            <p className="text-[10px] text-nova-gold/40 font-bold uppercase tracking-[0.4em] mt-3 text-center">Sistema Bancario Élite</p>
          </div>
        </div>

        <div className="grid gap-5">
          <button onClick={() => { playHaptic(); setView(AppView.LOGIN); }} className="w-full py-5 bg-white text-nova-obsidian font-orbitron font-black text-sm rounded-2xl shadow-[0_0_30px_rgba(255,255,255,0.1)] active:scale-95 transition-all uppercase tracking-widest">Iniciar Sesión</button>
          <button onClick={() => { playHaptic(); setView(AppView.REGISTER); }} className="w-full py-5 glass text-white font-orbitron font-bold text-sm rounded-2xl border-white/10 active:scale-95 transition-all uppercase tracking-widest">Registrarse</button>
        </div>

        <div className="pt-10 flex flex-col items-center gap-2 opacity-30">
          <ShieldCheck size={20} className="text-nova-gold" />
          <p className="text-[8px] font-black uppercase tracking-[0.3em] text-white">Ghost Protocol Secured</p>
        </div>
      </div>
    </div>
  );

  const SpaceBankView = () => {
    const [tab, setTab] = useState<'card' | 'transfer' | 'scan' | 'mycard'>('mycard');
    const [destId, setDestId] = useState('');
    const [destName, setDestName] = useState('');
    const [destAccount, setDestAccount] = useState('');
    const [amount, setAmount] = useState('');
    const [motivo, setMotivo] = useState('');
    const [isQuickPay, setIsQuickPay] = useState(false);

    const startScanner = async () => {
      try {
        if (qrReaderRef.current) await qrReaderRef.current.stop();
        qrReaderRef.current = new Html5Qrcode("reader");
        await qrReaderRef.current.start(
          { facingMode: "environment" },
          { fps: 15, qrbox: { width: 250, height: 250 } },
          (decodedText) => {
            try {
              const data = JSON.parse(decodedText);
              if (data.id && data.account) {
                playHaptic();
                setDestId(data.id);
                setDestName(data.name);
                setDestAccount(data.account);
                setIsQuickPay(true);
                setTab('transfer');
                stopScanner();
              }
            } catch (e) { console.warn("QR Detectado pero no compatible con el protocolo STX"); }
          },
          () => {}
        );
      } catch (err) { console.error("Error al iniciar cámara:", err); }
    };

    const stopScanner = () => {
      if (qrReaderRef.current) {
        qrReaderRef.current.stop().then(() => { qrReaderRef.current = null; }).catch(() => {});
      }
    };

    useEffect(() => {
      if (tab === 'scan') startScanner();
      else stopScanner();
      return () => stopScanner();
    }, [tab]);

    const handleTransfer = () => {
      if (!destId || !amount || !motivo) return alert("Por favor complete todos los datos de la transferencia.");
      const amtNum = parseFloat(amount);
      if (amtNum > (currentUser?.balance || 0)) return alert("Saldo insuficiente para procesar esta operación.");
      
      const ref = generateReference();
      addNotification(currentUser!.id, "Pago Rápido Enviado", `Has enviado ${amtNum} NV a ${destName || destId}.`, 'sent', amtNum);
      
      const subject = `Pago Rapido STX - Referencia: ${ref}`;
      const body = `SISTEMA DE PAGO RAPIDO STX\n\nEMISOR: ${currentUser?.firstName} ${currentUser?.lastName}\nID EMISOR: ${currentUser?.id}\n\nRECEPTOR: ${destName}\nID RECEPTOR: ${destId}\nCUENTA RECEPTOR: ${destAccount}\n\nMONTO: ${amtNum} NV\nCONCEPTO: ${motivo}\nREFERENCIA: ${ref}\n\nESTADO: SOLICITADO`;
      
      window.location.href = `mailto:${SOPORTE_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      
      const updatedUser = { ...currentUser!, balance: currentUser!.balance - amtNum };
      updateUserData(updatedUser);
      setCurrentUser(updatedUser);
      setTab('mycard');
      setIsQuickPay(false);
      alert("Solicitud de Pago Rápido enviada correctamente.");
    };

    const SpaceXCard = () => {
      const now = new Date();
      const expDate = `${(now.getMonth() + 1).toString().padStart(2, '0')}/${(now.getFullYear() + 2).toString().slice(-2)}`;
      const cardNumber = `4532 ${(currentUser?.id || '0000').padStart(4, '0')} 8890 1126`;
      return (
        <div className="w-full aspect-[1.6/1] rounded-[28px] bg-gradient-to-br from-[#0a0a0a] via-[#111] to-[#1a1a1a] border border-nova-gold/30 p-8 relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.6)] gold-shadow flex flex-col justify-between animate-fade-in">
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
          <div className="flex justify-between items-start z-10">
            <div className="flex flex-col">
              <span className="text-[10px] text-nova-gold font-black uppercase tracking-[0.4em] italic leading-none">SpaceX Card</span>
              <img src={BANK_LOGO} className="w-10 h-10 mt-3 opacity-90 drop-shadow-[0_0_8px_gold]" />
            </div>
            <div className="flex flex-col items-end">
              <div className="w-12 h-9 bg-gradient-to-br from-nova-gold/40 to-nova-gold/10 rounded-lg border border-white/20 flex items-center justify-center overflow-hidden">
                <Cpu className="text-nova-gold/80" size={24} />
              </div>
              <span className="text-[7px] text-white/20 font-mono mt-1 uppercase tracking-tighter">STX Secure Chip</span>
            </div>
          </div>
          <p className="text-xl md:text-2xl font-mono font-bold text-white tracking-[0.25em] drop-shadow-lg z-10">{cardNumber}</p>
          <div className="flex justify-between items-end z-10">
            <div className="space-y-1">
              <span className="text-[7px] text-white/30 font-mono block uppercase tracking-widest">Card Holder</span>
              <span className="text-xs text-white font-black uppercase tracking-widest font-orbitron">{currentUser?.firstName} {currentUser?.lastName}</span>
            </div>
            <div className="text-right">
              <span className="text-[7px] text-white/30 font-mono block uppercase tracking-widest">Expires</span>
              <span className="text-xs text-white font-black font-mono">{expDate}</span>
            </div>
          </div>
          <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-nova-gold/5 blur-3xl rounded-full"></div>
        </div>
      );
    };

    return (
      <div className="pb-32 pt-24 px-6 space-y-8 animate-fade-in max-w-lg mx-auto">
        <div className="flex justify-between items-end">
          <div className="space-y-1">
            <h3 className="text-nova-titanium/50 text-[10px] uppercase font-bold tracking-widest">Balance Disponible</h3>
            <span className="text-4xl font-orbitron font-black text-white">{currentUser?.balance.toLocaleString()} <span className="text-sm text-nova-gold">NV</span></span>
          </div>
          <div className="w-12 h-12 glass rounded-2xl flex items-center justify-center border-nova-gold/30 animate-pulse-slow">
            <img src={BANK_LOGO} className="w-8 h-8 object-contain" />
          </div>
        </div>
        
        <div className="flex p-1 glass rounded-2xl border-white/5">
          {['mycard', 'card', 'scan', 'transfer'].map(t => (
            <button key={t} onClick={() => { playHaptic(); setTab(t as any); setIsQuickPay(false); }} className={`flex-1 py-3 px-1 rounded-xl text-[7px] font-black uppercase tracking-widest transition-all ${tab === t ? 'bg-white text-nova-obsidian shadow-lg' : 'text-nova-titanium/50 hover:text-white/40'}`}>
              {t === 'mycard' ? 'SpaceX Card' : t === 'card' ? 'Mi QR' : t === 'scan' ? 'Escanear' : 'Transferir'}
            </button>
          ))}
        </div>

        {tab === 'mycard' && <SpaceXCard />}

        {tab === 'card' && (
          <div className="glass p-10 rounded-[40px] border-white/5 flex flex-col items-center gap-6 animate-fade-in">
            <div className="w-56 h-56 bg-white p-2 rounded-[32px] overflow-hidden shadow-[0_0_40px_rgba(255,255,255,0.1)] relative">
              <img src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(JSON.stringify({ id: currentUser?.id, name: `${currentUser?.firstName} ${currentUser?.lastName}`, account: `4532 ${(currentUser?.id || '0000').padStart(4, '0')} 8890 1126` }))}`} className="w-full h-full object-contain" alt="QR" />
            </div>
            <p className="text-[10px] text-nova-gold font-black uppercase tracking-[0.3em] font-orbitron text-center italic">Protocolo Pago Rápido STX</p>
          </div>
        )}

        {tab === 'scan' && (
          <div className="glass p-8 rounded-[40px] flex flex-col items-center gap-6 animate-fade-in">
            <div id="reader" className="w-full aspect-square bg-black/40 rounded-[32px] relative overflow-hidden border-2 border-nova-gold/20">
              <div className="absolute top-0 left-0 w-full h-1 bg-nova-gold/50 shadow-[0_0_15px_gold] animate-scan z-10"></div>
            </div>
            <p className="text-[11px] text-nova-titanium uppercase font-black tracking-[0.4em] font-orbitron animate-pulse">Escaneando...</p>
          </div>
        )}

        {tab === 'transfer' && (
          <div className="glass p-8 rounded-[32px] space-y-5 animate-fade-in shadow-xl border-white/5">
            {isQuickPay ? (
              <div className="bg-nova-gold/10 p-4 rounded-2xl border border-nova-gold/20 mb-2 animate-fade-in">
                <span className="text-[9px] text-nova-gold font-black uppercase tracking-widest block mb-2">Pago Rápido Destinatario</span>
                <p className="text-white text-xs font-bold uppercase">{destName}</p>
                <p className="text-[8px] text-white/40 font-mono tracking-widest mt-1">ID: {destId} | CUENTA: {destAccount}</p>
              </div>
            ) : (
              <div className="space-y-2">
                <span className="text-[8px] text-nova-gold font-black uppercase tracking-widest ml-1">ID de Usuario</span>
                <input value={destId} onChange={e => setDestId(e.target.value)} className="w-full bg-black/40 border border-white/10 p-4 rounded-xl text-white font-mono text-sm outline-none focus:border-nova-gold/50" placeholder="0000" />
              </div>
            )}
            
            <div className="space-y-2">
              <span className="text-[8px] text-nova-gold font-black uppercase tracking-widest ml-1">Monto (NV)</span>
              <input type="number" value={amount} onChange={e => setAmount(e.target.value)} className="w-full bg-black/40 border border-white/10 p-4 rounded-xl text-white font-orbitron text-2xl outline-none focus:border-nova-gold/50" placeholder="0.00" />
            </div>

            <div className="space-y-2">
              <span className="text-[8px] text-nova-gold font-black uppercase tracking-widest ml-1">Concepto</span>
              <input value={motivo} onChange={e => setMotivo(e.target.value)} className="w-full bg-black/40 border border-white/10 p-4 rounded-xl text-white text-xs outline-none focus:border-nova-gold/50" placeholder="Escriba el motivo" />
            </div>

            <button onClick={handleTransfer} className="w-full py-5 bg-nova-gold text-nova-obsidian rounded-xl font-orbitron font-black text-xs uppercase tracking-widest shadow-xl flex items-center justify-center gap-2 active:scale-95 transition-all mt-4">
              <Send size={16} /> Enviar Pago Rápido
            </button>
          </div>
        )}
      </div>
    );
  };

  const ProfileView = () => (
    <div className="pb-32 pt-24 px-6 space-y-8 animate-fade-in max-w-lg mx-auto">
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="w-32 h-32 bg-white/5 rounded-[3rem] flex items-center justify-center border-2 border-nova-gold/20 shadow-2xl relative overflow-hidden group">
          <UserIcon size={56} className="text-nova-gold group-hover:scale-110 transition-transform duration-500" />
          <div className="absolute inset-0 bg-nova-gold/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </div>
        <div className="space-y-1">
          <h2 className="text-3xl font-orbitron font-black text-white uppercase tracking-tighter italic leading-none">{currentUser?.firstName} <span className="text-nova-gold">{currentUser?.lastName}</span></h2>
          <div className="flex items-center justify-center gap-2 pt-1">
            <div className="w-2 h-2 rounded-full bg-nova-emerald animate-pulse"></div>
            <span className="text-[10px] text-nova-titanium font-bold uppercase tracking-[0.3em]">Protocolo {currentUser?.status}</span>
          </div>
        </div>
      </div>

      <div className="grid gap-4 mt-8">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em]">Panel de Identidad</h3>
          <ShieldCheck size={14} className="text-nova-gold/30" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="glass p-5 rounded-2xl border-white/5 space-y-1 group hover:border-nova-gold/20 transition-colors">
            <span className="text-[8px] text-nova-gold/40 font-black uppercase tracking-widest group-hover:text-nova-gold transition-colors">ID Sistema</span>
            <p className="text-sm font-mono font-bold text-white">{currentUser?.id}</p>
          </div>
          <div className="glass p-5 rounded-2xl border-white/5 space-y-1 group hover:border-nova-gold/20 transition-colors">
            <span className="text-[8px] text-nova-gold/40 font-black uppercase tracking-widest group-hover:text-nova-gold transition-colors">Región</span>
            <p className="text-sm font-bold text-white uppercase">{currentUser?.country}</p>
          </div>
          <div className="glass p-5 rounded-2xl border-white/5 space-y-1 group hover:border-nova-gold/20 transition-colors">
            <span className="text-[8px] text-nova-gold/40 font-black uppercase tracking-widest group-hover:text-nova-gold transition-colors">Contacto</span>
            <p className="text-sm font-bold text-white">+{currentUser?.phone}</p>
          </div>
          <div className="glass p-5 rounded-2xl border-white/5 space-y-1 group hover:border-nova-gold/20 transition-colors">
            <span className="text-[8px] text-nova-gold/40 font-black uppercase tracking-widest group-hover:text-nova-gold transition-colors">Miembro</span>
            <p className="text-sm font-bold text-white uppercase">{new Date(currentUser?.createdAt || '').toLocaleDateString('es-ES', { month: 'short', year: 'numeric' })}</p>
          </div>
        </div>
        <div className="glass p-6 rounded-3xl border-white/5 space-y-1 group hover:border-nova-gold/20 transition-colors">
          <span className="text-[8px] text-nova-gold/40 font-black uppercase tracking-widest group-hover:text-nova-gold transition-colors">Credencial de Email</span>
          <p className="text-sm font-bold text-white break-all font-mono">{currentUser?.email}</p>
        </div>
      </div>

      <button onClick={() => { playHaptic(); localStorage.removeItem('STX_SESSION_KEY'); setCurrentUser(null); setView(AppView.HOME); }} className="w-full py-5 bg-nova-crimson/10 rounded-[2rem] flex items-center justify-center gap-3 text-nova-crimson border border-nova-crimson/20 active:scale-95 transition-all uppercase tracking-[0.3em] font-black text-[10px] mt-6 shadow-lg">
        <LogOut size={18} /> Finalizar Protocolo de Sesión
      </button>
    </div>
  );

  const LoginView = () => {
    const [idInput, setIdInput] = useState('');
    const [passInput, setPassInput] = useState('');
    const handleLogin = (e: React.FormEvent) => {
      e.preventDefault();
      const user = users.find(u => (u.id === idInput.trim() || u.email.toLowerCase() === idInput.trim().toLowerCase()) && u.password === passInput);
      if (user) {
        if (!user.hasSeenWelcomeCredit) {
          const updated = { ...user, balance: user.balance + 100, hasSeenWelcomeCredit: true };
          updateUserData(updated);
          addNotification(user.id, "Bono de Bienvenida", "Protocolo inicial: Se han acreditado 100 NV a su monedero.", 'credit', 100);
          setCurrentUser(updated);
        } else { setCurrentUser(user); }
        localStorage.setItem('STX_SESSION_KEY', user.id);
        setView(AppView.DASHBOARD);
        setActiveTab(AppView.DASHBOARD);
      } else { alert("Acceso denegado: Credenciales no registradas en el sistema."); }
    };
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-nova-obsidian">
        <button onClick={() => setView(AppView.HOME)} className="absolute top-12 left-8 w-12 h-12 glass rounded-full flex items-center justify-center text-white active:scale-90 transition-all"><ArrowLeft size={20} /></button>
        <div className="w-full max-w-sm space-y-12 animate-fade-in">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-orbitron font-black text-white uppercase italic leading-none">ACCESO <span className="text-nova-gold">SEGURO</span></h1>
            <p className="text-[10px] text-nova-titanium font-bold uppercase tracking-[0.4em]">STX Ghost Protocol</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-5">
            <input type="text" value={idInput} onChange={e => setIdInput(e.target.value)} className="w-full bg-black/40 border border-white/5 p-5 rounded-2xl text-white outline-none focus:border-nova-gold/50 text-sm font-mono" placeholder="ID O CORREO" required />
            <input type="password" value={passInput} onChange={e => setPassInput(e.target.value)} className="w-full bg-black/40 border border-white/5 p-5 rounded-2xl text-white outline-none focus:border-nova-gold/50 text-sm font-mono" placeholder="CONTRASEÑA" required />
            <button type="submit" className="w-full py-5 bg-white text-nova-obsidian font-orbitron font-black text-sm rounded-2xl shadow-2xl active:scale-95 transition-all uppercase tracking-widest mt-4">Autorizar Ingreso</button>
          </form>
        </div>
      </div>
    );
  };

  const RegisterView = () => {
    const [formData, setFormData] = useState({ firstName: '', lastName: '', country: '', phone: '', email: '', password: '' });
    const handleRegister = (e: React.FormEvent) => {
      e.preventDefault();
      const newId = (users.length + 1).toString().padStart(4, '0');
      const newUser: User = { ...formData, id: newId, balance: 0, status: 'active', createdAt: new Date().toISOString(), hasSeenWelcomeCredit: false };
      setUsers(prev => {
        const updated = [...prev, newUser];
        localStorage.setItem(DB_KEY, JSON.stringify(updated));
        return updated;
      });
      alert(`REGISTRO EXITOSO. Su ID único es: ${newId}\nÚselo para iniciar sesión.`);
      setView(AppView.LOGIN);
    };
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-nova-obsidian overflow-y-auto py-24">
        <button onClick={() => setView(AppView.HOME)} className="absolute top-12 left-8 w-12 h-12 glass rounded-full flex items-center justify-center text-white active:scale-90 transition-all"><ArrowLeft size={20} /></button>
        <div className="w-full max-w-sm space-y-10 animate-fade-in">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-orbitron font-black text-white uppercase italic leading-none">NUEVO <span className="text-nova-gold">REGISTRO</span></h1>
            <p className="text-[10px] text-nova-titanium font-bold uppercase tracking-[0.4em]">STX Member Application</p>
          </div>
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input placeholder="NOMBRE" className="w-full bg-black/40 border border-white/5 p-4 rounded-xl text-white outline-none text-xs" required onChange={e => setFormData({...formData, firstName: e.target.value})} />
              <input placeholder="APELLIDO" className="w-full bg-black/40 border border-white/5 p-4 rounded-xl text-white outline-none text-xs" required onChange={e => setFormData({...formData, lastName: e.target.value})} />
            </div>
            <input placeholder="PAÍS" className="w-full bg-black/40 border border-white/5 p-4 rounded-xl text-white outline-none text-xs" required onChange={e => setFormData({...formData, country: e.target.value})} />
            <input placeholder="TELÉFONO" className="w-full bg-black/40 border border-white/5 p-4 rounded-xl text-white outline-none text-xs" required onChange={e => setFormData({...formData, phone: e.target.value})} />
            <input type="email" placeholder="CORREO" className="w-full bg-black/40 border border-white/5 p-4 rounded-xl text-white outline-none text-xs" required onChange={e => setFormData({...formData, email: e.target.value})} />
            <input type="password" placeholder="CONTRASEÑA" className="w-full bg-black/40 border border-white/5 p-4 rounded-xl text-white outline-none text-xs" required onChange={e => setFormData({...formData, password: e.target.value})} />
            <button type="submit" className="w-full py-5 bg-white text-nova-obsidian font-orbitron font-black text-sm rounded-2xl uppercase tracking-widest mt-4 shadow-xl active:scale-95 transition-all">Crear Perfil Élite</button>
          </form>
        </div>
      </div>
    );
  };

  const DashboardView = () => (
    <div className="pb-32 pt-24 px-6 space-y-8 animate-fade-in max-w-lg mx-auto">
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-orbitron font-black text-white italic leading-none uppercase tracking-tighter">HOLA, <span className="text-nova-gold">{currentUser?.firstName}</span></h1>
          <RealTimeClock showDate />
        </div>
        <div className="px-3 py-1 glass rounded-full border-nova-gold/20">
          <span className="text-[8px] font-black text-nova-gold uppercase tracking-[0.2em]">STX ID {currentUser?.id}</span>
        </div>
      </div>
      
      <div className="glass p-8 rounded-[3rem] border-nova-gold/10 space-y-6 shadow-[0_20px_60px_rgba(0,0,0,0.5)] relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-5 opacity-5 group-hover:rotate-12 transition-transform duration-500">
          <Sparkles size={50} className="text-nova-gold" />
        </div>
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 bg-nova-gold/10 rounded-[1.5rem] flex items-center justify-center text-nova-gold shadow-inner border border-nova-gold/5">
            <LayoutDashboard size={32} />
          </div>
          <div>
            <h3 className="text-[10px] font-bold text-nova-titanium/50 uppercase tracking-[0.4em] mb-2 leading-none">FONDOS DISPONIBLES</h3>
            <p className="text-4xl font-orbitron font-black text-white leading-none tracking-tight">{currentUser?.balance.toLocaleString()} <span className="text-sm text-nova-gold">NV</span></p>
          </div>
        </div>
        <button onClick={() => { playHaptic(); setView(AppView.SPACEBANK); setActiveTab(AppView.SPACEBANK); }} className="w-full py-5 bg-white text-nova-obsidian rounded-2xl flex items-center justify-center gap-3 font-orbitron font-black active:scale-95 transition-all shadow-xl">
          <CreditCard size={18} />
          <span className="text-[10px] uppercase tracking-widest">Gestionar Monedero</span>
        </button>
      </div>

      <div className="space-y-5">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">Operaciones Recientes</h3>
          <ChevronRight size={14} className="text-white/20" />
        </div>
        {notifications.filter(n => n.userId === currentUser?.id).length === 0 ? (
          <div className="glass p-10 rounded-[2rem] text-center border-white/5 opacity-50 italic">
            <p className="text-[10px] text-white/40 uppercase tracking-widest">Sin actividad reciente</p>
          </div>
        ) : (
          notifications.filter(n => n.userId === currentUser?.id).slice(0, 3).map(n => (
            <div key={n.id} className="glass p-6 rounded-[2rem] flex items-center justify-between border-white/5 hover:border-nova-gold/10 transition-colors">
               <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${n.type === 'sent' ? 'bg-nova-crimson/10 text-nova-crimson' : 'bg-nova-gold/10 text-nova-gold'}`}>
                    {n.type === 'sent' ? <TrendingDown size={18} /> : <TrendingUp size={18} />}
                  </div>
                  <div className="flex flex-col leading-tight space-y-1">
                    <span className="text-[11px] font-bold text-white uppercase tracking-tight">{n.title}</span>
                    <span className="text-[8px] text-nova-titanium/40 uppercase font-black tracking-widest">{n.date.split(' ')[0]}</span>
                  </div>
               </div>
               <div className="text-right">
                 <span className={`text-sm font-orbitron font-bold ${n.type === 'sent' ? 'text-nova-crimson' : 'text-nova-gold'}`}>
                   {n.type === 'sent' ? '-' : '+'}{n.amount?.toLocaleString()} NV
                 </span>
               </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  const NotificationsView = () => (
    <div className="pb-32 pt-24 px-6 space-y-8 animate-fade-in max-w-lg mx-auto">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-orbitron font-black text-white italic leading-none tracking-tighter uppercase italic">LOG DE <span className="text-nova-gold">MOVIMIENTOS</span></h1>
        <p className="text-[10px] text-nova-titanium font-bold uppercase tracking-[0.3em]">Registro Histórico</p>
      </div>
      <div className="space-y-5">
        {notifications.filter(n => n.userId === currentUser?.id).length === 0 ? (
          <div className="glass p-10 rounded-[2rem] text-center border-white/5 flex flex-col items-center gap-4 opacity-50">
             <Info className="text-white/10" size={40} />
             <p className="text-[10px] text-white/30 uppercase font-black tracking-widest leading-relaxed">No hay movimientos registrados.</p>
          </div>
        ) : (
          notifications.filter(n => n.userId === currentUser?.id).map((notif) => (
            <div key={notif.id} className="glass p-7 rounded-[2.5rem] border-white/5 space-y-4 shadow-xl">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${notif.type === 'sent' ? 'bg-nova-crimson/10 text-nova-crimson' : 'bg-nova-gold/10 text-nova-gold'}`}>
                  {notif.type === 'sent' ? <TrendingDown size={22} /> : <TrendingUp size={22} />}
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] text-nova-gold font-black uppercase tracking-[0.3em] font-orbitron italic">TRANSACCIÓN</span>
                  <h4 className="text-sm font-bold text-white uppercase tracking-tight">{notif.title}</h4>
                </div>
              </div>
              <p className="text-[11px] text-nova-titanium/80 leading-relaxed italic">{notif.message}</p>
              <div className="pt-4 flex justify-between items-end border-t border-white/5">
                <span className={`text-2xl font-orbitron font-black ${notif.type === 'sent' ? 'text-nova-crimson' : 'text-nova-gold'}`}>{notif.type === 'sent' ? '-' : '+'}{notif.amount?.toLocaleString()} <span className="text-xs">NV</span></span>
                <span className="text-[8px] font-mono text-white/40 uppercase block mb-1">{notif.date}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  const BottomDockComp = () => (
    <nav className="fixed bottom-0 left-0 right-0 z-[110] px-6 pb-8 pt-4 glass border-t border-white/5 rounded-t-[3rem] shadow-[0_-15px_50px_rgba(0,0,0,0.5)]">
      <div className="max-w-md mx-auto flex justify-between items-center px-6">
        {[
          { key: 'DASHBOARD', icon: <LayoutDashboard size={22} />, label: 'Inicio' },
          { key: 'SPACEBANK', icon: <CreditCard size={22} />, label: 'Bank' },
          { key: 'NOTIFICATIONS', icon: <Bell size={22} />, label: 'Logs' },
          { key: 'PROFILE', icon: <UserIcon size={22} />, label: 'Perfil' }
        ].map(item => (
          <button key={item.key} onClick={() => { playHaptic(); setView(AppView[item.key]); setActiveTab(AppView[item.key]); }} className={`flex flex-col items-center gap-2 transition-all duration-300 ${activeTab === AppView[item.key] ? 'text-nova-gold scale-125 translate-y-[-6px]' : 'text-white/20'}`}>
            <div className={`p-2 rounded-xl transition-all ${activeTab === AppView[item.key] ? 'bg-nova-gold/10' : ''}`}>{item.icon}</div>
            <span className={`text-[8px] font-black uppercase tracking-[0.2em] font-orbitron leading-none ${activeTab === AppView[item.key] ? 'opacity-100' : 'opacity-0'}`}>{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );

  return (
    <div className="min-h-screen relative font-inter overflow-x-hidden selection:bg-nova-gold/30 bg-nova-obsidian text-white">
      {view === AppView.HOME && <LandingPage />}
      {view === AppView.LOGIN && <LoginView />}
      {view === AppView.REGISTER && <RegisterView />}
      {[AppView.DASHBOARD, AppView.SPACEBANK, AppView.NOTIFICATIONS, AppView.PROFILE].includes(view) && (
        <>
          <header className="fixed top-0 left-0 right-0 z-[100] bg-nova-obsidian/90 backdrop-blur-xl border-b border-white/5 px-6 pt-10 pb-6 shadow-2xl">
            <div className="max-w-lg mx-auto flex justify-between items-center">
              <div className="flex flex-col">
                <h2 className="font-orbitron font-black text-2xl italic tracking-tighter uppercase leading-none">SPACE<span className="text-nova-gold">TRAMOYA</span></h2>
                <div className="flex items-center gap-2 mt-2">
                  <RealTimeClock />
                  <div className="w-1 h-1 rounded-full bg-nova-gold/40"></div>
                  <span className="text-[8px] text-nova-gold/60 font-black uppercase tracking-[0.3em] font-orbitron">SECURE_CHANNEL</span>
                </div>
              </div>
              <div className="w-12 h-12 glass rounded-2xl flex items-center justify-center border-nova-gold/10 shadow-lg group active:scale-90 transition-all">
                <img src={BANK_LOGO} className="w-8 h-8 object-contain drop-shadow-[0_0_5px_gold] group-hover:rotate-12 transition-transform" />
              </div>
            </div>
          </header>
          <main className="animate-fade-in">
            {view === AppView.DASHBOARD && <DashboardView />}
            {view === AppView.SPACEBANK && <SpaceBankView />}
            {view === AppView.NOTIFICATIONS && <NotificationsView />}
            {view === AppView.PROFILE && <ProfileView />}
          </main>
          <BottomDockComp />
        </>
      )}
      <style>{`
        .animate-fade-in { animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; } 
        .animate-float { animation: float 4s ease-in-out infinite; } 
        .animate-scan { animation: scan-line 2.5s linear infinite; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } } 
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-15px); } } 
        @keyframes scan-line { from { top: 0%; } to { top: 100%; } }
      `}</style>
    </div>
  );
};

export default App;
