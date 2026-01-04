
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
import { GoogleGenAI, Type } from "@google/genai";
import { AppView, User, Notification, NewsItem } from './types';

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

const NewsCarousel: React.FC<{ news: NewsItem[] }> = ({ news }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (news.length === 0 || expanded) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % news.length);
      setProgress(0);
    }, 15000);
    const progressInterval = setInterval(() => {
      setProgress((prev) => Math.min(prev + (100 / 150), 100));
    }, 100);
    return () => {
      clearInterval(interval);
      clearInterval(progressInterval);
    };
  }, [news.length, currentIndex, expanded]);

  if (news.length === 0) return (
    <div className="w-full glass p-6 rounded-[24px] border-white/5 animate-pulse flex flex-col items-center gap-3">
      <Globe className="text-nova-gold/20 animate-spin" size={24} />
      <span className="text-[8px] font-bold text-nova-titanium uppercase tracking-[0.4em]">Actualizando News STX...</span>
    </div>
  );

  const current = news[currentIndex];
  return (
    <div className="w-full relative group pb-4">
      <div className={`glass p-6 rounded-[32px] border-nova-gold/20 shadow-2xl transition-all duration-500 flex flex-col justify-between overflow-hidden ${expanded ? 'min-h-[350px]' : 'min-h-[200px]'}`}>
        <div className="space-y-4 relative z-10">
          <div className="flex justify-between items-center">
            <span className="bg-nova-gold/10 text-nova-gold text-[8px] font-black px-3 py-1 rounded-full border border-nova-gold/20 uppercase tracking-[0.2em] font-mono">{current.category}</span>
            <span className="text-[8px] text-nova-titanium font-bold font-mono uppercase tracking-tighter">{current.date}</span>
          </div>
          <h4 className="text-white font-orbitron font-black text-sm leading-tight uppercase tracking-tight">{current.title}</h4>
          <div className="space-y-3">
            <p className="text-[11px] text-nova-titanium/90 leading-relaxed text-justify">{current.summary}</p>
            {expanded && <p className="text-[11px] text-white/80 leading-relaxed text-justify pt-3 border-t border-white/5 animate-fade-in">{current.fullContent}</p>}
          </div>
        </div>
        <button onClick={() => setExpanded(!expanded)} className="mt-6 flex items-center justify-center gap-2 py-3 w-full border border-white/5 rounded-2xl text-[8px] font-black text-nova-gold uppercase tracking-[0.3em] hover:bg-white/5 transition-all bg-black/20">
          {expanded ? <><ChevronUp size={12}/> Contraer</> : <><ChevronDown size={12}/> Seguir Leyendo</>}
        </button>
        {!expanded && <div className="absolute bottom-0 left-0 w-full h-1 bg-white/5"><div className="h-full bg-nova-gold transition-all duration-100 ease-linear shadow-[0_0_10px_#eab308]" style={{ width: `${progress}%` }}></div></div>}
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.HOME);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [activeTab, setActiveTab] = useState<AppView>(AppView.DASHBOARD);
  const qrReaderRef = useRef<Html5Qrcode | null>(null);

  const DB_KEY = 'STX_DB_MASTER_V17';

  const fetchGlobalNews = async () => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: 'Genera un boletín de 5 noticias globales REALES y ACTUALIZADAS sobre Belleza, Concursos, IA y Espacio.',
        config: {
          tools: [{ googleSearch: {} }],
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                category: { type: Type.STRING },
                title: { type: Type.STRING },
                summary: { type: Type.STRING },
                fullContent: { type: Type.STRING },
                date: { type: Type.STRING }
              },
              required: ["id", "category", "title", "summary", "fullContent", "date"]
            }
          }
        }
      });
      if (response.text) setNews(JSON.parse(response.text));
    } catch (error) { console.error("Error fetching news:", error); }
  };

  useEffect(() => {
    const savedData = localStorage.getItem(DB_KEY);
    let dbUsers = INITIAL_USERS;
    if (savedData) { try { dbUsers = JSON.parse(savedData); setUsers(dbUsers); } catch (e) { setUsers(INITIAL_USERS); } }
    else { localStorage.setItem(DB_KEY, JSON.stringify(INITIAL_USERS)); }
    const savedNotifs = localStorage.getItem('STX_NOTIFS_V1');
    if (savedNotifs) setNotifications(JSON.parse(savedNotifs));
    const sessionKey = localStorage.getItem('STX_SESSION_KEY');
    if (sessionKey) {
      const activeUser = dbUsers.find(u => u.id === sessionKey);
      if (activeUser) { setCurrentUser(activeUser); setView(AppView.DASHBOARD); setActiveTab(AppView.DASHBOARD); }
    }
    fetchGlobalNews();
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
    <div className="flex flex-col items-center justify-center min-h-screen p-8 animate-fade-in bg-nova-obsidian overflow-y-auto pb-24">
      <div className="relative z-10 space-y-10 w-full max-w-sm">
        <div className="space-y-4 animate-float text-center">
          <div className="w-24 h-24 mx-auto bg-white/5 p-4 rounded-3xl glass flex items-center justify-center shadow-2xl border border-nova-gold/20">
            <img src={BANK_LOGO} className="w-full h-full object-contain" alt="Logo" />
          </div>
          <div className="flex flex-col items-center">
            <h1 className="font-orbitron font-black text-4xl tracking-tighter text-white uppercase italic leading-none">SPACE<span className="text-nova-gold">TRAMOYA</span> X</h1>
            <p className="text-[10px] text-nova-gold/40 font-bold uppercase tracking-[0.4em] mt-2 text-center">Elite Private Banking</p>
          </div>
        </div>
        <div className="grid gap-4">
          <button onClick={() => { playHaptic(); setView(AppView.LOGIN); }} className="w-full py-5 bg-white text-nova-obsidian font-orbitron font-black text-sm rounded-2xl shadow-xl active:scale-95 transition-all uppercase tracking-widest">Iniciar Sesión</button>
          <button onClick={() => { playHaptic(); setView(AppView.REGISTER); }} className="w-full py-5 glass text-white font-orbitron font-bold text-sm rounded-2xl border-white/10 active:scale-95 transition-all uppercase tracking-widest">Registrarse</button>
        </div>
        <div className="space-y-4 pt-4 border-t border-white/5">
          <div className="flex items-center gap-2 px-2">
            <Newspaper className="text-nova-gold" size={14} />
            <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">News STX</span>
          </div>
          <NewsCarousel news={news} />
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
        qrReaderRef.current = new Html5Qrcode("reader");
        await qrReaderRef.current.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: { width: 250, height: 250 } },
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
            } catch (e) { console.warn("QR no compatible"); }
          },
          () => {}
        );
      } catch (err) { console.error(err); }
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
      if (!destId || !amount || !motivo) return alert("Complete los datos.");
      const amtNum = parseFloat(amount);
      if (amtNum > (currentUser?.balance || 0)) return alert("Saldo insuficiente.");
      
      const ref = generateReference();
      addNotification(currentUser!.id, "Pago Rápido Enviado", `Has enviado ${amtNum} NV a ${destName || destId}.`, 'sent', amtNum);
      const subject = `Pago Rapido STX - Ref: ${ref}`;
      const body = `PAGO RAPIDO SOLICITUD\n\nEMISOR: ${currentUser?.firstName} ${currentUser?.lastName}\nID: ${currentUser?.id}\n\nRECEPTOR: ${destName}\nID RECEPTOR: ${destId}\nCUENTA: ${destAccount}\n\nMONTO: ${amtNum} NV\nCONCEPTO: ${motivo}\nREF: ${ref}`;
      window.location.href = `mailto:${SOPORTE_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      
      const updatedUser = { ...currentUser!, balance: currentUser!.balance - amtNum };
      updateUserData(updatedUser);
      setCurrentUser(updatedUser);
      setTab('mycard');
      setIsQuickPay(false);
    };

    const SpaceXCard = () => {
      const now = new Date();
      const expDate = `${(now.getMonth() + 1).toString().padStart(2, '0')}/${(now.getFullYear() + 2).toString().slice(-2)}`;
      const cardNumber = `4532 ${(currentUser?.id || '0000').padStart(4, '0')} 8890 1126`;
      return (
        <div className="w-full aspect-[1.6/1] rounded-[28px] bg-gradient-to-br from-[#0a0a0a] via-[#111] to-[#1a1a1a] border border-nova-gold/30 p-8 relative overflow-hidden shadow-2xl gold-shadow flex flex-col justify-between animate-fade-in">
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
          <div className="flex justify-between items-start z-10">
            <div className="flex flex-col"><span className="text-[10px] text-nova-gold font-black uppercase tracking-[0.4em] italic leading-none">SpaceX Card</span><img src={BANK_LOGO} className="w-10 h-10 mt-2 opacity-90 drop-shadow-[0_0_8px_gold]" /></div>
            <div className="flex flex-col items-end"><div className="w-12 h-9 bg-gradient-to-br from-nova-gold/40 to-nova-gold/10 rounded-lg border border-white/20 flex items-center justify-center overflow-hidden"><Cpu className="text-nova-gold/80" size={24} /></div><span className="text-[7px] text-white/20 font-mono mt-1 uppercase tracking-tighter">Secure Chip</span></div>
          </div>
          <p className="text-xl md:text-2xl font-mono font-bold text-white tracking-[0.25em] drop-shadow-lg z-10">{cardNumber}</p>
          <div className="flex justify-between items-end z-10">
            <div className="space-y-1"><span className="text-[7px] text-white/30 font-mono block uppercase tracking-widest">Card Holder</span><span className="text-xs text-white font-black uppercase tracking-widest font-orbitron">{currentUser?.firstName} {currentUser?.lastName}</span></div>
            <div className="text-right"><span className="text-[7px] text-white/30 font-mono block uppercase tracking-widest">Expires</span><span className="text-xs text-white font-black font-mono">{expDate}</span></div>
          </div>
        </div>
      );
    };

    return (
      <div className="pb-32 pt-24 px-6 space-y-8 animate-fade-in max-w-lg mx-auto">
        <div className="flex justify-between items-end">
          <div className="space-y-1"><h3 className="text-nova-titanium/50 text-[10px] uppercase font-bold tracking-widest">Balance Disponible</h3><span className="text-4xl font-orbitron font-black text-white">{currentUser?.balance.toLocaleString()} <span className="text-sm text-nova-gold">NV</span></span></div>
          <div className="w-12 h-12 glass rounded-2xl flex items-center justify-center border-nova-gold/30 animate-pulse-slow"><img src={BANK_LOGO} className="w-8 h-8 object-contain" /></div>
        </div>
        <div className="flex p-1 glass rounded-2xl border-white/5">
          {['mycard', 'card', 'scan', 'transfer'].map(t => (
            <button key={t} onClick={() => { playHaptic(); setTab(t as any); setIsQuickPay(false); }} className={`flex-1 py-3 px-1 rounded-xl text-[7px] font-black uppercase tracking-widest transition-all ${tab === t ? 'bg-white text-nova-obsidian shadow-lg' : 'text-nova-titanium/50'}`}>
              {t === 'mycard' ? 'SpaceX Card' : t === 'card' ? 'Mi QR' : t === 'scan' ? 'Escanear' : 'Transferir'}
            </button>
          ))}
        </div>
        {tab === 'mycard' && <SpaceXCard />}
        {tab === 'card' && (
          <div className="glass p-10 rounded-[40px] border-white/5 flex flex-col items-center gap-6 animate-fade-in">
            <div className="w-56 h-56 bg-white p-2 rounded-[32px] overflow-hidden shadow-2xl">
              <img src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(JSON.stringify({ id: currentUser?.id, name: `${currentUser?.firstName} ${currentUser?.lastName}`, account: `4532 ${(currentUser?.id || '0000').padStart(4, '0')} 8890 1126` }))}`} className="w-full h-full object-contain" alt="QR" />
            </div>
            <p className="text-[10px] text-nova-gold font-black uppercase tracking-[0.3em] font-orbitron text-center">Protocolo Pago Rápido STX</p>
          </div>
        )}
        {tab === 'scan' && (
          <div className="glass p-8 rounded-[40px] flex flex-col items-center gap-6 animate-fade-in">
            <div id="reader" className="w-full aspect-square bg-black/40 rounded-[32px] relative overflow-hidden"><div className="absolute top-0 left-0 w-full h-1 bg-nova-gold/50 shadow-[0_0_15px_gold] animate-scan z-10"></div></div>
            <p className="text-[11px] text-nova-titanium uppercase font-black tracking-[0.4em] font-orbitron animate-pulse">Escaneando...</p>
          </div>
        )}
        {tab === 'transfer' && (
          <div className="glass p-8 rounded-[32px] space-y-5 animate-fade-in">
            {isQuickPay && <div className="bg-nova-gold/10 p-4 rounded-2xl border border-nova-gold/20 mb-2"><span className="text-[9px] text-nova-gold font-black uppercase tracking-widest block mb-1">Pago Rápido Destinatario</span><p className="text-white text-xs font-bold uppercase">{destName}</p><p className="text-[8px] text-white/40 font-mono">ID: {destId} | ACC: {destAccount}</p></div>}
            {!isQuickPay && <input value={destId} onChange={e => setDestId(e.target.value)} className="w-full bg-black/40 border border-white/10 p-4 rounded-xl text-white text-xs" placeholder="ID de Usuario" />}
            <input type="number" value={amount} onChange={e => setAmount(e.target.value)} className="w-full bg-black/40 border border-white/10 p-4 rounded-xl text-white font-orbitron text-2xl" placeholder="0.00" />
            <input value={motivo} onChange={e => setMotivo(e.target.value)} className="w-full bg-black/40 border border-white/10 p-4 rounded-xl text-white text-xs" placeholder="Motivo" />
            <button onClick={handleTransfer} className="w-full py-4 bg-nova-gold text-nova-obsidian rounded-xl font-orbitron font-black text-xs uppercase tracking-widest shadow-xl flex items-center justify-center gap-2"><Send size={16} /> Enviar Pago</button>
          </div>
        )}
      </div>
    );
  };

  const ProfileView = () => (
    <div className="pb-32 pt-24 px-6 space-y-8 animate-fade-in max-w-lg mx-auto">
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="w-28 h-28 bg-white/5 rounded-[44px] flex items-center justify-center border-2 border-nova-gold/20 shadow-2xl relative overflow-hidden group">
          <UserIcon size={48} className="text-nova-gold" />
          <div className="absolute inset-0 bg-nova-gold/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </div>
        <div className="space-y-1">
          <h2 className="text-3xl font-orbitron font-black text-white uppercase tracking-tighter italic leading-none">{currentUser?.firstName} <span className="text-nova-gold">{currentUser?.lastName}</span></h2>
          <div className="flex items-center justify-center gap-2 pt-1"><div className="w-2 h-2 rounded-full bg-nova-emerald animate-pulse"></div><span className="text-[10px] text-nova-titanium font-bold uppercase tracking-[0.3em]">Protocolo {currentUser?.status}</span></div>
        </div>
      </div>
      <div className="grid gap-4 mt-8">
        <h3 className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] px-2">Información del Perfil</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="glass p-4 rounded-2xl border-white/5 space-y-1"><span className="text-[8px] text-nova-gold/40 font-black uppercase tracking-widest">ID Sistema</span><p className="text-xs font-mono font-bold text-white">{currentUser?.id}</p></div>
          <div className="glass p-4 rounded-2xl border-white/5 space-y-1"><span className="text-[8px] text-nova-gold/40 font-black uppercase tracking-widest">Región</span><p className="text-xs font-bold text-white uppercase">{currentUser?.country}</p></div>
          <div className="glass p-4 rounded-2xl border-white/5 space-y-1"><span className="text-[8px] text-nova-gold/40 font-black uppercase tracking-widest">Contacto</span><p className="text-xs font-bold text-white">+{currentUser?.phone}</p></div>
          <div className="glass p-4 rounded-2xl border-white/5 space-y-1"><span className="text-[8px] text-nova-gold/40 font-black uppercase tracking-widest">Registro</span><p className="text-xs font-bold text-white uppercase">{new Date(currentUser?.createdAt || '').toLocaleDateString('es-ES', { month: 'short', year: 'numeric' })}</p></div>
        </div>
        <div className="glass p-4 rounded-2xl border-white/5 space-y-1"><span className="text-[8px] text-nova-gold/40 font-black uppercase tracking-widest">Correo Electrónico</span><p className="text-xs font-bold text-white break-all">{currentUser?.email}</p></div>
      </div>
      <button onClick={() => { playHaptic(); localStorage.removeItem('STX_SESSION_KEY'); setCurrentUser(null); setView(AppView.HOME); }} className="w-full py-5 bg-nova-crimson/10 rounded-[24px] flex items-center justify-center gap-3 text-nova-crimson border border-nova-crimson/20 active:scale-95 transition-all uppercase tracking-[0.3em] font-black text-[10px] mt-4">
        <LogOut size={18} /> Cerrar Sesión
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
          addNotification(user.id, "Bono Estelar", "Has recibido 100 NV de bienvenida.", 'credit', 100);
          setCurrentUser(updated);
        } else { setCurrentUser(user); }
        localStorage.setItem('STX_SESSION_KEY', user.id);
        setView(AppView.DASHBOARD);
      } else { alert("Error de acceso."); }
    };
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-nova-obsidian">
        <button onClick={() => setView(AppView.HOME)} className="absolute top-12 left-8 w-12 h-12 glass rounded-full flex items-center justify-center text-white"><ArrowLeft size={20} /></button>
        <div className="w-full max-w-sm space-y-10 animate-fade-in">
          <h1 className="text-3xl font-orbitron font-black text-white uppercase text-center italic">ACCESO <span className="text-nova-gold">SEGURO</span></h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="text" value={idInput} onChange={e => setIdInput(e.target.value)} className="w-full bg-black/40 border border-white/5 p-5 rounded-2xl text-white outline-none focus:border-nova-gold/50 text-sm" placeholder="ID O CORREO" required />
            <input type="password" value={passInput} onChange={e => setPassInput(e.target.value)} className="w-full bg-black/40 border border-white/5 p-5 rounded-2xl text-white outline-none focus:border-nova-gold/50 text-sm" placeholder="CONTRASEÑA" required />
            <button type="submit" className="w-full py-5 bg-white text-nova-obsidian font-orbitron font-black text-sm rounded-2xl shadow-2xl active:scale-95 transition-all uppercase tracking-widest">Entrar</button>
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
      alert(`ID asignado: ${newId}`);
      setView(AppView.LOGIN);
    };
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-nova-obsidian overflow-y-auto py-24">
        <button onClick={() => setView(AppView.HOME)} className="absolute top-12 left-8 w-12 h-12 glass rounded-full flex items-center justify-center text-white"><ArrowLeft size={20} /></button>
        <div className="w-full max-w-sm space-y-8 animate-fade-in">
          <h1 className="text-3xl font-orbitron font-black text-white uppercase text-center italic">REGISTRO <span className="text-nova-gold">STX</span></h1>
          <form onSubmit={handleRegister} className="space-y-4">
            <input placeholder="NOMBRE" className="w-full bg-black/40 border border-white/5 p-4 rounded-xl text-white outline-none text-xs" required onChange={e => setFormData({...formData, firstName: e.target.value})} />
            <input placeholder="APELLIDO" className="w-full bg-black/40 border border-white/5 p-4 rounded-xl text-white outline-none text-xs" required onChange={e => setFormData({...formData, lastName: e.target.value})} />
            <input placeholder="PAÍS" className="w-full bg-black/40 border border-white/5 p-4 rounded-xl text-white outline-none text-xs" required onChange={e => setFormData({...formData, country: e.target.value})} />
            <input placeholder="TELÉFONO" className="w-full bg-black/40 border border-white/5 p-4 rounded-xl text-white outline-none text-xs" required onChange={e => setFormData({...formData, phone: e.target.value})} />
            <input type="email" placeholder="CORREO" className="w-full bg-black/40 border border-white/5 p-4 rounded-xl text-white outline-none text-xs" required onChange={e => setFormData({...formData, email: e.target.value})} />
            <input type="password" placeholder="PASSWORD" className="w-full bg-black/40 border border-white/5 p-4 rounded-xl text-white outline-none text-xs" required onChange={e => setFormData({...formData, password: e.target.value})} />
            <button type="submit" className="w-full py-5 bg-white text-nova-obsidian font-orbitron font-black text-sm rounded-2xl uppercase tracking-widest">Crear Cuenta</button>
          </form>
        </div>
      </div>
    );
  };

  const DashboardView = () => (
    <div className="pb-32 pt-24 px-6 space-y-8 animate-fade-in max-w-lg mx-auto">
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-1"><h1 className="text-2xl font-orbitron font-black text-white italic leading-none uppercase tracking-tighter">HOLA, <span className="text-nova-gold">{currentUser?.firstName}</span></h1><RealTimeClock showDate /></div>
        <div className="px-3 py-1 glass rounded-full border-nova-gold/20"><span className="text-[8px] font-black text-nova-gold uppercase tracking-[0.2em]">STX ID {currentUser?.id}</span></div>
      </div>
      <div className="glass p-8 rounded-[40px] border-nova-gold/10 space-y-6 shadow-xl relative overflow-hidden">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-nova-gold/10 rounded-2xl flex items-center justify-center text-nova-gold"><LayoutDashboard size={32} /></div>
          <div><h3 className="text-[10px] font-bold text-nova-titanium/50 uppercase tracking-[0.4em] mb-2 leading-none">FONDOS DISPONIBLES</h3><p className="text-3xl font-orbitron font-black text-white leading-none">{currentUser?.balance.toLocaleString()} <span className="text-xs text-nova-gold">NV</span></p></div>
        </div>
        <button onClick={() => { playHaptic(); setView(AppView.SPACEBANK); setActiveTab(AppView.SPACEBANK); }} className="w-full py-5 bg-white text-nova-obsidian rounded-2xl flex items-center justify-center gap-3 font-orbitron font-black active:scale-95 transition-all shadow-xl"><CreditCard size={18} /><span className="text-[10px] uppercase tracking-widest">Entrar a SpaceBank</span></button>
      </div>
    </div>
  );

  const NotificationsView = () => (
    <div className="pb-32 pt-24 px-6 space-y-8 animate-fade-in max-w-lg mx-auto">
      <h1 className="text-2xl font-orbitron font-black text-white italic uppercase tracking-tighter">MOVIMIENTOS <span className="text-nova-gold">RECENTES</span></h1>
      <div className="space-y-4">
        {notifications.filter(n => n.userId === currentUser?.id).map((notif) => (
          <div key={notif.id} className="glass p-6 rounded-[32px] border-white/5 space-y-2 relative">
            <div className="flex items-center gap-3"><div className={`w-10 h-10 rounded-xl flex items-center justify-center ${notif.type === 'sent' ? 'bg-nova-crimson/10 text-nova-crimson' : 'bg-nova-gold/10 text-nova-gold'}`}>{notif.type === 'sent' ? <TrendingDown size={18} /> : <TrendingUp size={18} />}</div><div className="flex flex-col"><span className="text-[10px] text-nova-gold font-black uppercase tracking-[0.3em] font-orbitron italic">TRANSACCIÓN</span><h4 className="text-sm font-bold text-white uppercase">{notif.title}</h4></div></div>
            <p className="text-[11px] text-nova-titanium/80 leading-relaxed">{notif.message}</p>
            <div className="pt-3 flex justify-between items-end border-t border-white/5"><span className={`text-xl font-orbitron font-black ${notif.type === 'sent' ? 'text-nova-crimson' : 'text-nova-gold'}`}>{notif.type === 'sent' ? '-' : '+'}{notif.amount?.toLocaleString()} NV</span><span className="text-[8px] font-mono text-white/40 uppercase">{notif.date}</span></div>
          </div>
        ))}
      </div>
    </div>
  );

  const BottomDockComp = () => (
    <nav className="fixed bottom-0 left-0 right-0 z-[110] px-6 pb-8 pt-4 glass border-t border-white/5 rounded-t-[40px] shadow-2xl">
      <div className="max-w-md mx-auto flex justify-between items-center px-4">
        {[
          { key: 'DASHBOARD', icon: <LayoutDashboard size={22} />, label: 'Inicio' },
          { key: 'SPACEBANK', icon: <CreditCard size={22} />, label: 'Bank' },
          { key: 'NOTIFICATIONS', icon: <Bell size={22} />, label: 'Logs' },
          { key: 'PROFILE', icon: <UserIcon size={22} />, label: 'Perfil' }
        ].map(item => (
          <button key={item.key} onClick={() => { playHaptic(); setView(AppView[item.key]); setActiveTab(AppView[item.key]); }} className={`flex flex-col items-center gap-2 transition-all ${activeTab === AppView[item.key] ? 'text-nova-gold scale-110' : 'text-white/20'}`}>
            <div className={`p-2 rounded-xl ${activeTab === AppView[item.key] ? 'bg-nova-gold/10' : ''}`}>{item.icon}</div>
            <span className={`text-[8px] font-black uppercase tracking-[0.2em] ${activeTab === AppView[item.key] ? 'opacity-100' : 'opacity-0'}`}>{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );

  return (
    <div className="min-h-screen font-inter bg-nova-obsidian text-white">
      {view === AppView.HOME && <LandingPage />}
      {view === AppView.LOGIN && <LoginView />}
      {view === AppView.REGISTER && <RegisterView />}
      {[AppView.DASHBOARD, AppView.SPACEBANK, AppView.NOTIFICATIONS, AppView.PROFILE].includes(view) && (
        <><header className="fixed top-0 left-0 right-0 z-[100] bg-nova-obsidian/90 backdrop-blur-lg border-b border-white/5 px-6 pt-8 pb-5"><div className="max-w-lg mx-auto flex justify-between items-center"><div className="flex flex-col"><h2 className="font-orbitron font-black text-2xl italic tracking-tighter uppercase leading-none">SPACE<span className="text-nova-gold">TRAMOYA</span></h2><div className="flex items-center gap-2 mt-2"><RealTimeClock /><span className="text-[8px] text-nova-gold/60 font-black uppercase tracking-[0.3em]">SECURE_LINK</span></div></div><img src={BANK_LOGO} className="w-10 h-10 object-contain drop-shadow-[0_0_5px_gold]" /></div></header>
        <main className="animate-fade-in">{view === AppView.DASHBOARD && <DashboardView />}{view === AppView.SPACEBANK && <SpaceBankView />}{view === AppView.NOTIFICATIONS && <NotificationsView />}{view === AppView.PROFILE && <ProfileView />}</main><BottomDockComp /></>
      )}
      <style>{`.animate-fade-in { animation: fadeIn 0.5s ease-out forwards; } @keyframes fadeIn { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } } .animate-scan { animation: scan-line 2s linear infinite; } @keyframes scan-line { from { top: 0%; } to { top: 100%; } }`}</style>
    </div>
  );
};

export default App;
