
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
  Settings,
  Lock,
  Send,
  Camera,
  Clock,
  X,
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
import { GoogleGenAI } from "@google/genai";
import { AppView, User, Notification, NewsItem } from './types';

const BANK_LOGO = "https://i.postimg.cc/kD3Pn8C6/Photoroom-20251229-195028.png";
const CREDIT_IMG = "https://i.postimg.cc/BvmKfFtJ/20260102-170520-0000.png";
const SOPORTE_EMAIL = "soportespacetramoyax@gmail.com";
const TAX_AMOUNT = 0.14;

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

  if (news.length === 0) {
    return (
      <div className="w-full glass p-6 rounded-[24px] border-white/5 animate-pulse flex flex-col items-center gap-3">
        <Globe className="text-nova-gold/20 animate-spin" size={24} />
        <span className="text-[8px] font-bold text-nova-titanium uppercase tracking-[0.4em]">Actualizando News STX...</span>
      </div>
    );
  }

  const current = news[currentIndex];

  return (
    <div className="w-full relative group pb-4">
      <div className={`glass p-6 rounded-[32px] border-nova-gold/20 shadow-2xl transition-all duration-500 flex flex-col justify-between overflow-hidden ${expanded ? 'min-h-[350px]' : 'min-h-[200px]'}`}>
        <div className="space-y-4 relative z-10">
          <div className="flex justify-between items-center">
            <span className="bg-nova-gold/10 text-nova-gold text-[8px] font-black px-3 py-1 rounded-full border border-nova-gold/20 uppercase tracking-[0.2em] font-mono">
              {current.category}
            </span>
            <span className="text-[8px] text-nova-titanium font-bold font-mono uppercase tracking-tighter">
              {current.date}
            </span>
          </div>
          <h4 className="text-white font-orbitron font-black text-sm leading-tight uppercase tracking-tight group-hover:text-nova-gold transition-colors">
            {current.title}
          </h4>
          
          <div className="space-y-3">
            <p className="text-[11px] text-nova-titanium/90 leading-relaxed text-justify">
              {current.summary}
            </p>
            
            {expanded && (
              <p className="text-[11px] text-white/80 leading-relaxed text-justify pt-3 border-t border-white/5 animate-fade-in">
                {current.fullContent}
              </p>
            )}
          </div>
        </div>

        <button 
          onClick={() => setExpanded(!expanded)}
          className="mt-6 flex items-center justify-center gap-2 py-3 w-full border border-white/5 rounded-2xl text-[8px] font-black text-nova-gold uppercase tracking-[0.3em] hover:bg-white/5 transition-all bg-black/20"
        >
          {expanded ? <><ChevronUp size={12}/> Contraer Información</> : <><ChevronDown size={12}/> Seguir Leyendo</>}
        </button>
        
        {!expanded && (
          <div className="absolute bottom-0 left-0 w-full h-1 bg-white/5">
            <div 
              className="h-full bg-nova-gold transition-all duration-100 ease-linear shadow-[0_0_10px_#eab308]"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}
      </div>
      
      <div className="flex justify-center gap-1.5 mt-4">
        {news.map((_, idx) => (
          <button 
            key={idx}
            onClick={() => { setCurrentIndex(idx); setProgress(0); setExpanded(false); }}
            className={`h-1 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-6 bg-nova-gold' : 'w-1 bg-white/10'}`}
          />
        ))}
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

  const DB_KEY = 'STX_DB_MASTER_V17';

  const fetchGlobalNews = async () => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Actúa como el equipo de redacción de News STX. Genera un boletín de 5 noticias globales REALES y ACTUALIZADAS.
        
        TEMAS OBLIGATORIOS:
        - Al menos 2 noticias deben ser sobre CONCURSOS DE BELLEZA (Miss Universo, Miss Mundo, certámenes nacionales de cualquier país, categorías juveniles o mayores).
        - Noticias de impacto sobre conflictos actuales, descubrimientos de ciencia espacial o avances en tecnología IA.
        - Las noticias pueden ser de AYER, HOY o PREDICCIONES basadas en eventos de MAÑANA.
        
        REGLAS DE FORMATO:
        - Cada noticia debe tener un párrafo de resumen completo de al menos 4 líneas (no cortado).
        - El campo 'fullContent' debe contener un segundo párrafo extenso con detalles profundos, fechas y lugares.
        - La fecha debe indicar cuándo ocurrió o ocurrirá el evento de forma clara.
        
        RETORNA SOLO JSON:
        [{
          "id": "string",
          "category": "BELLEZA|CIENCIA|GUERRA|TECH|EVENTO",
          "title": "TÍTULO EN MAYÚSCULAS",
          "summary": "Párrafo inicial completo.",
          "fullContent": "Párrafo de profundidad con más datos y contexto.",
          "date": "Fecha exacta o descriptiva (Ayer, Hoy, Mañana, 15 de Enero...)"
        }]`,
        config: {
          tools: [{ googleSearch: {} }],
          responseMimeType: "application/json"
        }
      });
      
      const newsData = JSON.parse(response.text);
      setNews(newsData);
    } catch (error) {
      console.error("Error fetching news:", error);
      setNews([
        { 
          id: 'fb1', 
          category: 'BELLEZA', 
          title: 'MISS UNIVERSO 2026: CANDIDATAS EN MARCHA', 
          summary: 'La organización internacional de Miss Universo ha comenzado la selección de las sedes candidatas para la edición 75 del certamen, buscando locaciones con alta capacidad tecnológica en Asia y América.',
          fullContent: 'Se rumorea que países de América Latina están liderando las negociaciones debido al gran apoyo de la comunidad fanática local. El anuncio oficial se espera para las próximas semanas tras la reunión de los directores nacionales en la ciudad de Nueva York.',
          date: 'Hoy' 
        },
        { 
          id: 'fb2', 
          category: 'TECH', 
          title: 'AVANCE EN COMUNICACIONES CUÁNTICAS', 
          summary: 'Un equipo de científicos ha logrado ayer la primera transmisión de datos segura mediante entrelazamiento cuántico a una distancia récord, prometiendo una red de internet inviolable para el futuro cercano.',
          fullContent: 'Este hito marca el inicio de la era de la computación cuántica distribuida. Los bancos de élite, incluyendo protocolos como los de SpaceX Card, vigilan de cerca esta tecnología para su implementación en infraestructuras de seguridad crítica el próximo año.',
          date: 'Ayer' 
        }
      ]);
    }
  };

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

    fetchGlobalNews();
    const newsInterval = setInterval(fetchGlobalNews, 3600000);
    return () => clearInterval(newsInterval);
  }, []);

  const playHaptic = () => { if (window.navigator.vibrate) window.navigator.vibrate(15); };

  const generateReference = () => {
    let ref = '';
    for(let i = 0; i < 20; i++) ref += Math.floor(Math.random() * 10);
    return ref;
  };

  const addNotification = (userId: string, title: string, message: string, type: 'credit'|'sent'|'received', amount?: number, imageUrl?: string) => {
    const now = new Date();
    const newNotif: Notification = {
      id: Math.random().toString(36).substr(2, 9), userId, title, message,
      date: `${now.toLocaleDateString()} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      isRead: false, type, amount, reference: generateReference(), imageUrl
    };
    setNotifications(prev => {
      const updated = [newNotif, ...prev];
      localStorage.setItem('STX_NOTIFS_V1', JSON.stringify(updated));
      return updated;
    });
  };

  const updateUserData = (updatedUser: User) => {
    setUsers(prev => {
      const updatedUsers = prev.map(u => u.id === updatedUser.id ? updatedUser : u);
      localStorage.setItem(DB_KEY, JSON.stringify(updatedUsers));
      return updatedUsers;
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
            <h1 className="font-orbitron font-black text-4xl tracking-tighter text-white uppercase italic leading-none">
              SPACE<span className="text-nova-gold">TRAMOYA</span> X
            </h1>
            <div className="h-0.5 w-32 bg-gradient-to-r from-transparent via-nova-gold to-transparent mt-2"></div>
            <p className="text-[10px] text-nova-gold/40 font-bold uppercase tracking-[0.4em] mt-2 text-center">Elite Private Banking System</p>
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
      <button onClick={() => { playHaptic(); setView(AppView.ADMIN_LOGIN); }} className="fixed bottom-6 right-6 w-8 h-8 opacity-[0.1] hover:opacity-100 transition-opacity flex items-center justify-center text-nova-gold z-[120]"><Settings size={14} /></button>
    </div>
  );

  const SpaceBankView = () => {
    const [tab, setTab] = useState<'card' | 'transfer' | 'scan' | 'mycard'>('mycard');
    const [destId, setDestId] = useState('');
    const [amount, setAmount] = useState('');
    const [motivo, setMotivo] = useState('');
    
    const balanceAfter = currentUser ? currentUser.balance - (parseFloat(amount) || 0) : 0;
    const recipient = useMemo(() => users.find(u => u.id === destId.trim()), [destId, users]);

    const handleTransfer = () => {
      if (!destId || !amount || !motivo) return alert("Complete todos los campos.");
      if (balanceAfter < 0) return alert("Saldo insuficiente.");
      const amtNum = parseFloat(amount);
      const ref = generateReference();
      addNotification(currentUser!.id, "Transferencia Enviada", `Has enviado ${amtNum} NV a ID ${destId}.`, 'sent', amtNum);
      if (recipient) addNotification(recipient.id, "Pago Recibido", `Has recibido ${amtNum} NV de ${currentUser?.firstName}.`, 'received', amtNum);
      window.location.href = `mailto:${SOPORTE_EMAIL}?subject=Trasferencia STX&body=${encodeURIComponent(`Trasferencia de ${currentUser?.firstName} a ID ${destId}\nMonto: ${amount} NV\nMotivo: ${motivo}\nReferencia: ${ref}`)}`;
      setDestId(''); setAmount(''); setMotivo('');
    };

    const DigitalCard = () => {
      const now = new Date();
      const expDate = `${(now.getMonth() + 1).toString().padStart(2, '0')}/${(now.getFullYear() + 2).toString().slice(-2)}`;
      const cardNumber = `4532 ${(currentUser?.id || '0000').padStart(4, '0')} 9087 0908`;

      return (
        <div className="w-full aspect-[1.6/1] rounded-[28px] bg-gradient-to-br from-[#0a0a0a] via-[#111111] to-[#1a1a1a] border border-nova-gold/30 p-8 relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] gold-shadow flex flex-col justify-between animate-fade-in group">
          {/* Card Texture Overlay */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
          
          <div className="flex justify-between items-start z-10">
            <div className="flex flex-col">
              <span className="text-[10px] text-nova-gold font-black uppercase tracking-[0.4em] italic">SpaceX Card</span>
              <img src={BANK_LOGO} className="w-10 h-10 mt-3 opacity-90 drop-shadow-[0_0_8px_gold]" />
            </div>
            <div className="flex flex-col items-end">
              <div className="w-12 h-9 bg-gradient-to-br from-nova-gold/40 to-nova-gold/10 rounded-lg border border-white/20 flex items-center justify-center overflow-hidden">
                <Cpu className="text-nova-gold/80" size={24} />
              </div>
              <span className="text-[7px] text-white/20 font-mono mt-2 uppercase">STX Secure Chip</span>
            </div>
          </div>

          <div className="z-10">
            <p className="text-xl md:text-2xl font-mono font-bold text-white tracking-[0.25em] drop-shadow-lg">
              {cardNumber}
            </p>
          </div>

          <div className="flex justify-between items-end z-10">
            <div className="space-y-1">
              <span className="text-[7px] text-white/30 font-mono block uppercase tracking-widest">Card Holder</span>
              <span className="text-xs text-white font-black uppercase tracking-widest font-orbitron">
                {currentUser?.firstName} {currentUser?.lastName}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[7px] text-white/30 font-mono block uppercase tracking-widest">Expires</span>
              <span className="text-xs text-white font-black font-mono">{expDate}</span>
            </div>
          </div>

          {/* Holographic touch */}
          <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-nova-gold/10 rounded-full blur-3xl group-hover:bg-nova-gold/20 transition-all duration-700"></div>
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
          <div className="w-12 h-12 glass rounded-2xl flex items-center justify-center border-nova-gold/30 gold-shadow animate-pulse-slow">
            <img src={BANK_LOGO} className="w-8 h-8 object-contain" />
          </div>
        </div>
        
        <div className="flex p-1 glass rounded-2xl border-white/5">
          {['mycard', 'card', 'scan', 'transfer'].map(t => (
            <button key={t} onClick={() => setTab(t as any)} className={`flex-1 py-3 px-1 rounded-xl text-[7px] font-black uppercase tracking-widest transition-all ${tab === t ? 'bg-white text-nova-obsidian shadow-lg' : 'text-nova-titanium/50'}`}>
              {t === 'mycard' ? 'Mi Tarjeta' : t === 'card' ? 'Mi QR' : t === 'scan' ? 'Escanear' : 'Transferir'}
            </button>
          ))}
        </div>

        {tab === 'mycard' && <DigitalCard />}

        {tab === 'card' && (
          <div className="glass p-10 rounded-[40px] border-white/5 flex flex-col items-center gap-6 animate-fade-in">
            <div className="w-56 h-56 bg-white p-6 rounded-[32px] relative shadow-[0_0_30px_rgba(255,255,255,0.1)]">
              <QrCode size={180} className="text-nova-obsidian w-full h-full" />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                <img src={BANK_LOGO} className="w-14" />
              </div>
            </div>
            <div className="text-center">
              <span className="text-[10px] text-nova-gold font-black uppercase tracking-[0.3em] font-orbitron">Personal ID Protocol</span>
              <p className="text-[9px] text-white/40 uppercase mt-2 tracking-widest">Escanee para recepción de Nóvares</p>
            </div>
          </div>
        )}

        {tab === 'scan' && (
          <div className="glass p-10 rounded-[40px] border-white/5 flex flex-col items-center gap-6 animate-fade-in">
            <div className="w-full aspect-square bg-black/40 rounded-[32px] border-2 border-nova-gold/20 flex items-center justify-center relative overflow-hidden">
               <Scan className="text-nova-gold animate-pulse" size={48} />
               <div className="absolute top-0 left-0 w-full h-1 bg-nova-gold/50 shadow-[0_0_15px_gold] animate-scan"></div>
            </div>
            <p className="text-[11px] text-nova-titanium uppercase font-black tracking-[0.4em] font-orbitron">Escaner Activo</p>
          </div>
        )}

        {tab === 'transfer' && (
          <div className="glass p-8 rounded-[32px] space-y-5 shadow-xl border-white/5 animate-fade-in">
            <div className="space-y-2">
              <span className="text-[8px] text-nova-gold font-bold uppercase tracking-widest ml-2">Destinatario</span>
              <input value={destId} onChange={e => setDestId(e.target.value)} className="w-full bg-black/40 border border-white/10 p-4 rounded-xl text-white font-mono text-sm outline-none focus:border-nova-gold/40" placeholder="ID de Usuario" />
            </div>
            <div className="space-y-2">
              <span className="text-[8px] text-nova-gold font-bold uppercase tracking-widest ml-2">Monto NV</span>
              <input type="number" value={amount} onChange={e => setAmount(e.target.value)} className="w-full bg-black/40 border border-white/10 p-4 rounded-xl text-white font-orbitron text-2xl outline-none focus:border-nova-gold/40" placeholder="0.00" />
            </div>
            <div className="space-y-2">
              <span className="text-[8px] text-nova-gold font-bold uppercase tracking-widest ml-2">Concepto</span>
              <input value={motivo} onChange={e => setMotivo(e.target.value)} className="w-full bg-black/40 border border-white/10 p-4 rounded-xl text-white text-xs outline-none focus:border-nova-gold/40" placeholder="Motivo de la transferencia" />
            </div>
            <button onClick={handleTransfer} className="w-full py-4 bg-nova-gold text-nova-obsidian rounded-xl font-orbitron font-black text-xs uppercase tracking-widest shadow-xl flex items-center justify-center gap-2 active:scale-95 transition-all"><Send size={16} /> Procesar Transferencia</button>
          </div>
        )}
      </div>
    );
  };

  const ProfileView = () => {
    if (!currentUser) return null;

    return (
      <div className="pb-32 pt-24 px-6 space-y-8 animate-fade-in max-w-lg mx-auto">
        {/* Header Perfil */}
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-28 h-28 bg-white/5 rounded-[44px] flex items-center justify-center border-2 border-nova-gold/20 shadow-2xl relative overflow-hidden group">
            <UserIcon size={48} className="text-nova-gold group-hover:scale-110 transition-transform duration-500" />
            <div className="absolute inset-0 bg-nova-gold/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>
          <div className="space-y-1">
            <h2 className="text-3xl font-orbitron font-black text-white uppercase tracking-tighter italic leading-none">
              {currentUser.firstName} <span className="text-nova-gold">{currentUser.lastName}</span>
            </h2>
            <div className="flex items-center justify-center gap-2 pt-1">
              <div className="w-2 h-2 rounded-full bg-nova-emerald animate-pulse"></div>
              <span className="text-[10px] text-nova-titanium font-bold uppercase tracking-[0.3em]">Protocolo {currentUser.status}</span>
            </div>
          </div>
        </div>

        {/* Información Detallada */}
        <div className="grid gap-6 mt-8">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em]">Panel de Identidad</h3>
            <div className="h-px flex-1 bg-white/5 ml-4"></div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="glass p-5 rounded-2xl border-white/5 space-y-2 hover:border-nova-gold/20 transition-colors group">
               <div className="flex items-center gap-2 text-nova-gold/40 group-hover:text-nova-gold transition-colors">
                 <Cpu size={14}/>
                 <span className="text-[8px] font-black uppercase tracking-widest">ID Sistema</span>
               </div>
               <p className="text-sm font-mono font-bold text-white tracking-widest">{currentUser.id}</p>
            </div>

            <div className="glass p-5 rounded-2xl border-white/5 space-y-2 hover:border-nova-gold/20 transition-colors group">
               <div className="flex items-center gap-2 text-nova-gold/40 group-hover:text-nova-gold transition-colors">
                 <Flag size={14}/>
                 <span className="text-[8px] font-black uppercase tracking-widest">Región</span>
               </div>
               <p className="text-sm font-bold text-white uppercase">{currentUser.country}</p>
            </div>

            <div className="glass p-5 rounded-2xl border-white/5 space-y-2 hover:border-nova-gold/20 transition-colors group">
               <div className="flex items-center gap-2 text-nova-gold/40 group-hover:text-nova-gold transition-colors">
                 <Smartphone size={14}/>
                 <span className="text-[8px] font-black uppercase tracking-widest">Contacto</span>
               </div>
               <p className="text-sm font-bold text-white">+{currentUser.phone.substring(0,3)} {currentUser.phone.substring(3,6)} ***</p>
            </div>

            <div className="glass p-5 rounded-2xl border-white/5 space-y-2 hover:border-nova-gold/20 transition-colors group">
               <div className="flex items-center gap-2 text-nova-gold/40 group-hover:text-nova-gold transition-colors">
                 <Calendar size={14}/>
                 <span className="text-[8px] font-black uppercase tracking-widest">Ingreso</span>
               </div>
               <p className="text-sm font-bold text-white">
                {new Date(currentUser.createdAt).toLocaleDateString('es-ES', { month: 'short', year: 'numeric' }).toUpperCase()}
               </p>
            </div>
          </div>

          <div className="glass p-6 rounded-2xl border-white/5 space-y-3 hover:border-nova-gold/20 transition-colors group">
            <div className="flex items-center gap-2 text-nova-gold/40 group-hover:text-nova-gold transition-colors">
              <Info size={14}/>
              <span className="text-[8px] font-black uppercase tracking-widest">Credencial Digital (Email)</span>
            </div>
            <p className="text-xs font-bold text-white break-all font-mono italic">{currentUser.email}</p>
          </div>

          <div className="glass p-5 rounded-3xl border-nova-emerald/20 bg-nova-emerald/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShieldCheck className="text-nova-emerald" size={20} />
              <div className="flex flex-col">
                <span className="text-[9px] font-black text-nova-emerald uppercase tracking-widest">Verificación STX</span>
                <span className="text-[8px] text-white/40 uppercase">Cuenta protegida por Ghost Protocol</span>
              </div>
            </div>
            <div className="w-6 h-6 rounded-full bg-nova-emerald/20 flex items-center justify-center">
               <div className="w-2 h-2 rounded-full bg-nova-emerald"></div>
            </div>
          </div>
        </div>

        <button 
          onClick={() => { playHaptic(); localStorage.removeItem('STX_SESSION_KEY'); setCurrentUser(null); setView(AppView.HOME); }} 
          className="w-full py-5 bg-nova-crimson/10 rounded-[24px] flex items-center justify-center gap-3 text-nova-crimson border border-nova-crimson/20 active:scale-95 transition-all uppercase tracking-[0.3em] font-black text-[10px] mt-8 shadow-lg"
        >
          <LogOut size={18} /> Finalizar Protocolo de Sesión
        </button>
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
        <div className="px-3 py-1 glass rounded-full border-nova-gold/20"><span className="text-[8px] font-black text-nova-gold uppercase tracking-[0.2em]">STX ID {currentUser?.id}</span></div>
      </div>
      <div className="glass p-8 rounded-[40px] border-nova-gold/10 space-y-6 shadow-xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform duration-500"><Sparkles size={50} className="text-nova-gold" /></div>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-nova-gold/10 rounded-2xl flex items-center justify-center text-nova-gold shadow-inner border border-nova-gold/5"><LayoutDashboard size={32} /></div>
          <div>
            <h3 className="text-[10px] font-bold text-nova-titanium/50 uppercase tracking-[0.4em] leading-none mb-2">FONDOS DISPONIBLES</h3>
            <p className="text-3xl font-orbitron font-black text-white leading-none tracking-tight">{currentUser?.balance.toLocaleString()} <span className="text-xs text-nova-gold">NV</span></p>
          </div>
        </div>
        <button onClick={() => { playHaptic(); setView(AppView.SPACEBANK); setActiveTab(AppView.SPACEBANK); }} className="w-full py-5 bg-white text-nova-obsidian rounded-2xl flex items-center justify-center gap-3 font-orbitron font-black active:scale-95 transition-all shadow-xl">
            <CreditCard size={18} />
            <span className="text-[10px] uppercase tracking-widest">Entrar a SpaceBank</span>
        </button>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">Operaciones Recientes</h3>
          <ChevronRight size={14} className="text-white/20" />
        </div>
        {notifications.filter(n => n.userId === currentUser?.id).slice(0, 3).map(n => (
          <div key={n.id} className="glass p-5 rounded-3xl flex items-center justify-between border-white/5 hover:border-nova-gold/10 transition-colors">
             <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${n.type === 'credit' ? 'bg-nova-gold/10 text-nova-gold' : 'bg-white/5 text-white/40'}`}>
                  {n.type === 'credit' ? <Sparkles size={16}/> : <TrendingUp size={16}/>}
                </div>
                <div className="flex flex-col leading-tight space-y-1">
                  <span className="text-[11px] font-bold text-white uppercase tracking-tight">{n.title}</span>
                  <span className="text-[8px] text-nova-titanium/40 uppercase font-black tracking-widest">{n.date.split(' ')[0]}</span>
                </div>
             </div>
             <div className="text-right flex flex-col items-end">
               <span className={`text-sm font-orbitron font-bold ${n.type === 'sent' ? 'text-nova-crimson' : 'text-nova-gold'}`}>
                 {n.type === 'sent' ? '-' : '+'}{n.amount?.toLocaleString()} NV
               </span>
               <span className="text-[6px] text-white/20 font-mono tracking-tighter uppercase">{n.reference?.slice(-6)}</span>
             </div>
          </div>
        ))}
      </div>
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
          addNotification(user.id, "Bono de Bienvenida 2026", "Incentivo estelar para iniciar el ciclo SpaceX Card.", 'credit', 100, CREDIT_IMG);
          setCurrentUser(updated);
        } else { setCurrentUser(user); }
        localStorage.setItem('STX_SESSION_KEY', user.id);
        setView(AppView.DASHBOARD);
      } else { alert("ERROR DE AUTENTICACIÓN: CREDENCIALES INVÁLIDAS."); }
    };

    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-nova-obsidian">
        <button onClick={() => setView(AppView.HOME)} className="absolute top-12 left-8 w-12 h-12 glass rounded-full flex items-center justify-center text-white active:scale-90 transition-all"><ArrowLeft size={20} /></button>
        <div className="w-full max-w-sm space-y-10 animate-fade-in">
          <div className="text-center space-y-2">
             <h1 className="text-3xl font-orbitron font-black text-white uppercase tracking-tighter leading-none italic">ACCESO <span className="text-nova-gold">SEGURO</span></h1>
             <p className="text-[10px] text-nova-titanium font-bold uppercase tracking-[0.4em]">STX Security Protocol</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <input type="text" value={idInput} onChange={e => setIdInput(e.target.value)} className="w-full bg-black/40 border border-white/5 p-5 rounded-2xl text-white outline-none focus:border-nova-gold/50 text-sm font-mono" placeholder="ID O CORREO" required />
              <input type="password" value={passInput} onChange={e => setPassInput(e.target.value)} className="w-full bg-black/40 border border-white/5 p-5 rounded-2xl text-white outline-none focus:border-nova-gold/50 text-sm font-mono" placeholder="CONTRASEÑA" required />
            </div>
            <button type="submit" className="w-full py-5 bg-white text-nova-obsidian font-orbitron font-black text-sm rounded-2xl shadow-2xl active:scale-95 transition-all uppercase tracking-widest">Autorizar Ingreso</button>
          </form>
        </div>
      </div>
    );
  };

  const NotificationsView = () => (
    <div className="pb-32 pt-24 px-6 space-y-8 animate-fade-in max-w-lg mx-auto">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-orbitron font-black text-white italic leading-none tracking-tighter uppercase italic">LOG DE <span className="text-nova-gold">MOVIMIENTOS</span></h1>
        <p className="text-[10px] text-nova-titanium font-bold uppercase tracking-[0.3em]">Registro de Actividad Financiera</p>
      </div>
      <div className="space-y-6">
        {notifications.filter(n => n.userId === currentUser?.id).length === 0 ? (
          <div className="glass p-10 rounded-3xl text-center border-white/5 flex flex-col items-center gap-4">
             <Info className="text-white/10" size={40} />
             <p className="text-[10px] text-white/30 uppercase font-black tracking-widest leading-relaxed">No se han detectado transacciones en el protocolo actual.</p>
          </div>
        ) : (
          notifications.filter(n => n.userId === currentUser?.id).map((notif) => (
            <div key={notif.id} className="glass p-6 rounded-[32px] border-white/5 space-y-4 overflow-hidden shadow-2xl relative">
              <div className="flex flex-col space-y-3">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${notif.type === 'sent' ? 'bg-nova-crimson/10 text-nova-crimson' : 'bg-nova-gold/10 text-nova-gold'}`}>
                    {notif.type === 'sent' ? <TrendingDown size={20} /> : <TrendingUp size={20} />}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9px] text-nova-gold font-black uppercase tracking-[0.3em] font-orbitron italic">{notif.type === 'credit' ? 'STX REWARD' : 'TRANSACCIÓN'}</span>
                    <h4 className="text-sm font-bold text-white uppercase tracking-tight">{notif.title}</h4>
                  </div>
                </div>
                <p className="text-[11px] text-nova-titanium/80 leading-relaxed font-medium">{notif.message}</p>
                <div className="pt-3 flex justify-between items-end border-t border-white/5">
                  <div className="flex flex-col">
                    <span className="text-[7px] text-white/20 uppercase font-bold tracking-widest mb-1">Monto Procesado</span>
                    <span className={`text-2xl font-orbitron font-black ${notif.type === 'sent' ? 'text-nova-crimson' : 'text-nova-gold'}`}>
                      {notif.type === 'sent' ? '-' : '+'}{notif.amount?.toLocaleString()} <span className="text-xs">NV</span>
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[8px] font-mono text-white/40 uppercase block mb-1">{notif.date}</span>
                    <span className="text-[6px] text-white/10 font-mono tracking-tighter block uppercase">REF: {notif.reference}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

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
      alert(`REGISTRO SATISFACTORIO.\nTU ID ÚNICO DE ACCESO ES: ${newId}\nPOR FAVOR, NO COMPARTA SUS CREDENCIALES.`);
      setView(AppView.LOGIN);
    };

    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-nova-obsidian overflow-y-auto py-24">
        <button onClick={() => setView(AppView.HOME)} className="absolute top-12 left-8 w-12 h-12 glass rounded-full flex items-center justify-center text-white active:scale-90 transition-all"><ArrowLeft size={20} /></button>
        <div className="w-full max-w-sm space-y-8 animate-fade-in">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-orbitron font-black text-white uppercase leading-none italic">NUEVA <span className="text-nova-gold">CREDENCIAL</span></h1>
            <p className="text-[10px] text-nova-titanium font-bold uppercase tracking-[0.4em]">Solicitud de Acceso STX</p>
          </div>
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <input placeholder="NOMBRE" className="w-full bg-black/40 border border-white/5 p-4 rounded-xl text-white outline-none focus:border-nova-gold/50 text-xs font-mono" required onChange={e => setFormData({...formData, firstName: e.target.value})} />
              <input placeholder="APELLIDO" className="w-full bg-black/40 border border-white/5 p-4 rounded-xl text-white outline-none focus:border-nova-gold/50 text-xs font-mono" required onChange={e => setFormData({...formData, lastName: e.target.value})} />
            </div>
            <input placeholder="PAÍS" className="w-full bg-black/40 border border-white/5 p-4 rounded-xl text-white outline-none focus:border-nova-gold/50 text-xs font-mono" required onChange={e => setFormData({...formData, country: e.target.value})} />
            <input placeholder="TELÉFONO" className="w-full bg-black/40 border border-white/5 p-4 rounded-xl text-white outline-none focus:border-nova-gold/50 text-xs font-mono" required onChange={e => setFormData({...formData, phone: e.target.value})} />
            <input type="email" placeholder="CORREO ELECTRÓNICO" className="w-full bg-black/40 border border-white/5 p-4 rounded-xl text-white outline-none focus:border-nova-gold/50 text-xs font-mono" required onChange={e => setFormData({...formData, email: e.target.value})} />
            <input type="password" placeholder="CONTRASEÑA" className="w-full bg-black/40 border border-white/5 p-4 rounded-xl text-white outline-none focus:border-nova-gold/50 text-xs font-mono" required onChange={e => setFormData({...formData, password: e.target.value})} />
            <div className="pt-4">
              <button type="submit" className="w-full py-5 bg-white text-nova-obsidian font-orbitron font-black text-sm rounded-2xl shadow-2xl active:scale-95 transition-all uppercase tracking-widest">Generar Perfil</button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const AdminLoginView = () => {
    const [formData, setFormData] = useState({ user: '', pass: '', code: '' });
    const handleAdminLogin = (e: React.FormEvent) => {
      e.preventDefault();
      if (formData.user === ADMIN_CREDENTIALS.user && formData.pass === ADMIN_CREDENTIALS.pass && formData.code === ADMIN_CREDENTIALS.securityCode) setView(AppView.ADMIN_PANEL);
      else alert("ACCESO DENEGADO: PROTOCOLO DE SEGURIDAD ACTIVADO.");
    };
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-nova-obsidian">
        <button onClick={() => setView(AppView.HOME)} className="absolute top-12 left-8 w-12 h-12 glass rounded-full flex items-center justify-center text-white active:scale-90 transition-all"><ArrowLeft size={20} /></button>
        <div className="w-full max-w-sm space-y-10">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-orbitron font-black text-white uppercase italic">GHOST <span className="text-nova-gold">TERMINAL</span></h1>
            <p className="text-[10px] text-nova-titanium font-bold uppercase tracking-[0.4em]">Acceso Administrativo Nivel 5</p>
          </div>
          <form onSubmit={handleAdminLogin} className="space-y-6">
            <div className="space-y-4">
              <input type="text" placeholder="Admin User" className="w-full bg-black/40 border border-white/10 p-5 rounded-2xl text-white outline-none focus:border-nova-gold/40 text-sm font-mono" onChange={e => setFormData({...formData, user: e.target.value})} />
              <input type="password" placeholder="Master Key" className="w-full bg-black/40 border border-white/10 p-5 rounded-2xl text-white outline-none focus:border-nova-gold/40 text-sm font-mono" onChange={e => setFormData({...formData, pass: e.target.value})} />
              <input type="text" placeholder="Access Code" className="w-full bg-black/40 border border-white/10 p-5 rounded-2xl text-white text-center tracking-[1em] outline-none focus:border-nova-gold/40 text-sm font-mono" onChange={e => setFormData({...formData, code: e.target.value})} />
            </div>
            <button type="submit" className="w-full py-5 bg-nova-gold text-nova-obsidian font-orbitron font-black text-sm rounded-2xl shadow-[0_0_20px_rgba(234,179,8,0.3)]">Autorizar Control</button>
          </form>
        </div>
      </div>
    );
  };

  const AdminPanelView = () => {
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [amount, setAmount] = useState('');
    const handleAcreditar = () => {
      if (!selectedUser || !amount) return;
      const val = parseFloat(amount);
      const updated = { ...selectedUser, balance: selectedUser.balance + val };
      updateUserData(updated);
      addNotification(updated.id, "Crédito Administrativo STX", `La central ha acreditado ${val} NV a su fondo personal.`, 'credit', val, CREDIT_IMG);
      alert("ACREDITACIÓN EXITOSA PROCESADA."); setSelectedUser(null); setAmount('');
    };
    return (
      <div className="min-h-screen bg-nova-obsidian p-8 pb-32 overflow-y-auto">
        <div className="flex justify-between items-center mb-10">
           <div className="flex flex-col leading-none">
             <h1 className="text-xl font-orbitron font-black text-white uppercase italic">MASTER <span className="text-nova-gold">CONTROL</span></h1>
             <span className="text-[8px] text-nova-gold/50 font-black uppercase tracking-[0.4em] mt-1">Ghost Protocol Active</span>
           </div>
           <button onClick={() => setView(AppView.HOME)} className="p-4 glass rounded-2xl text-nova-crimson border-nova-crimson/20 shadow-lg active:scale-90 transition-all"><LogOut size={20} /></button>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <span className="text-[10px] text-white/30 font-black uppercase tracking-[0.4em]">Base de Datos Usuarios</span>
            <span className="text-[10px] text-nova-gold font-bold uppercase">{users.length} Registros</span>
          </div>
          {users.map(u => (
            <div key={u.id} className="glass p-5 rounded-3xl flex items-center justify-between border-white/5 hover:border-nova-gold/20 transition-all">
              <div className="flex flex-col gap-1">
                <span className="text-white font-black text-sm uppercase tracking-tight italic">{u.firstName} {u.lastName}</span>
                <span className="text-[9px] text-nova-titanium font-mono tracking-widest">ID: {u.id}</span>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="text-nova-gold font-orbitron font-black text-sm">{u.balance.toLocaleString()} NV</span>
                <button onClick={() => setSelectedUser(u)} className="text-[8px] px-3 py-1.5 bg-nova-gold/10 text-nova-gold uppercase font-black rounded-lg border border-nova-gold/20 hover:bg-nova-gold/20 transition-all">Inyectar Nóvares</button>
              </div>
            </div>
          ))}
        </div>
        {selectedUser && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-8 bg-black/90 backdrop-blur-md animate-fade-in">
            <div className="w-full max-w-sm glass p-10 rounded-[40px] space-y-8 border-nova-gold/20">
              <div className="text-center space-y-2">
                <h3 className="text-white font-orbitron font-black uppercase italic text-lg">MODIFICAR <span className="text-nova-gold">FONDO</span></h3>
                <p className="text-[9px] text-white/40 uppercase tracking-widest italic">Titular: {selectedUser.firstName} {selectedUser.lastName}</p>
              </div>
              <div className="space-y-4">
                <div className="flex flex-col items-center">
                   <span className="text-[8px] text-nova-gold font-black uppercase mb-2">Monto a Inyectar (NV)</span>
                   <input type="number" value={amount} onChange={e => setAmount(e.target.value)} className="w-full bg-black/40 border border-white/10 p-5 rounded-2xl text-white text-3xl font-orbitron text-center outline-none focus:border-nova-gold/40" placeholder="0.00" autoFocus />
                </div>
                <div className="flex gap-4 pt-4">
                  <button onClick={() => setSelectedUser(null)} className="flex-1 py-4 glass text-white text-[10px] uppercase font-black rounded-2xl border-white/10 active:scale-95 transition-all">Cancelar</button>
                  <button onClick={handleAcreditar} className="flex-1 py-4 bg-nova-gold text-nova-obsidian text-[10px] uppercase font-black rounded-2xl shadow-[0_0_20px_gold] active:scale-95 transition-all">Inyectar</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const BottomDockComp = () => (
    <nav className="fixed bottom-0 left-0 right-0 z-[110] px-6 pb-8 pt-4 glass border-t border-white/5 rounded-t-[40px] shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
      <div className="max-w-md mx-auto flex justify-between items-center px-4">
        {[
          { key: 'DASHBOARD', icon: <LayoutDashboard size={22} />, label: 'Inicio' },
          { key: 'SPACEBANK', icon: <CreditCard size={22} />, label: 'Bank' },
          { key: 'NOTIFICATIONS', icon: <Bell size={22} />, label: 'Logs' },
          { key: 'PROFILE', icon: <UserIcon size={22} />, label: 'Perfil' }
        ].map(item => (
          <button key={item.key} onClick={() => { playHaptic(); setView(AppView[item.key]); setActiveTab(AppView[item.key]); }} className={`flex flex-col items-center gap-2 transition-all duration-300 ${activeTab === AppView[item.key] ? 'text-nova-gold scale-110 translate-y-[-4px]' : 'text-white/20 hover:text-white/40'}`}>
            <div className={`p-2 rounded-xl transition-all ${activeTab === AppView[item.key] ? 'bg-nova-gold/10' : ''}`}>
              {item.icon}
            </div>
            <span className={`text-[8px] font-black uppercase tracking-[0.2em] font-orbitron ${activeTab === AppView[item.key] ? 'opacity-100' : 'opacity-0'}`}>{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );

  return (
    <div className="min-h-screen relative font-inter overflow-x-hidden selection:bg-nova-gold/30 bg-nova-obsidian">
      {view === AppView.HOME && <LandingPage />}
      {view === AppView.LOGIN && <LoginView />}
      {view === AppView.REGISTER && <RegisterView />}
      {view === AppView.ADMIN_LOGIN && <AdminLoginView />}
      {view === AppView.ADMIN_PANEL && <AdminPanelView />}
      {[AppView.DASHBOARD, AppView.SPACEBANK, AppView.NOTIFICATIONS, AppView.PROFILE].includes(view) && (
        <>
          <header className="fixed top-0 left-0 right-0 z-[100] bg-nova-obsidian/90 backdrop-blur-lg border-b border-white/5 px-6 pt-8 pb-5">
            <div className="max-w-lg mx-auto flex justify-between items-center">
              <div className="flex flex-col">
                <h2 className="font-orbitron font-black text-2xl italic tracking-tighter text-white uppercase leading-none">SPACE<span className="text-nova-gold">TRAMOYA</span></h2>
                <div className="flex items-center gap-2 mt-2">
                  <RealTimeClock />
                  <div className="w-1 h-1 rounded-full bg-white/20"></div>
                  <span className="text-[8px] text-nova-gold/60 font-black uppercase tracking-[0.3em] font-orbitron">Secured_Link_V26</span>
                </div>
              </div>
              <div className="w-10 h-10 glass rounded-2xl flex items-center justify-center border-nova-gold/10 shadow-lg">
                <img src={BANK_LOGO} className="w-6 h-6 object-contain" />
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
        .animate-fade-in { animation: fadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; } 
        .animate-float { animation: float 4s ease-in-out infinite; } 
        .animate-scan { animation: scan-line 3s linear infinite; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } } 
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-12px); } } 
        @keyframes scan-line { 0% { top: -10%; } 100% { top: 110%; } }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        input[type="number"]::-webkit-inner-spin-button, input[type="number"]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
      `}</style>
    </div>
  );
};

export default App;
