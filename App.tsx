
import React, { useState, useEffect, useMemo, useRef } from 'react';
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
  Mail,
  Sparkles,
  Cpu,
  QrCode,
  Maximize,
  Share2,
  Download,
  Camera,
  X,
  UserCheck,
  Fingerprint,
  Smartphone,
  ExternalLink,
  Lock,
  LayoutDashboard,
  CreditCard,
  History,
  ScanLine
} from 'lucide-react';
import { AppView, User, Transaction, Notification } from './types';
import jsQR from 'https://esm.sh/jsqr@1.4.0';

const ADMIN_CREDENTIALS = {
  user: 'ghostvip090870',
  pass: 'v9451679',
  securityCode: '090870'
};

const OFFICIAL_EMAIL = "soportespacetramoyax@gmail.com";
const BANK_LOGO = "https://i.postimg.cc/kD3Pn8C6/Photoroom-20251229-195028.png";
const CORPORATE_DOMAIN = "@tramoyax.cdlt";

const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.HOME);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activeTab, setActiveTab] = useState<'home' | 'bank' | 'history' | 'profile'>('home');

  // Logic initialization
  useEffect(() => {
    const savedUsers = localStorage.getItem('STX_DB_FINAL_USERS_V16');
    const savedTx = localStorage.getItem('STX_DB_FINAL_TX_V16');
    const savedNotif = localStorage.getItem('STX_DB_FINAL_NOTIF_V16');

    const initialUsers: User[] = [
      { id: '0001', firstName: 'Luis', lastName: 'Alejandro', country: 'Venezuela', phone: '584121351217', email: `luis0001${CORPORATE_DOMAIN}`, password: 'v9451679', balance: 80100, status: 'active', createdAt: new Date().toISOString() },
      { id: '0002', firstName: 'Miss', lastName: 'Slam', country: 'El Salvador', phone: '50375431210', email: `miss0002${CORPORATE_DOMAIN}`, password: 'missslam0121', balance: 5100, status: 'active', createdAt: new Date().toISOString() },
      { id: '0003', firstName: 'Alex', lastName: 'Duarte', country: 'Honduras', phone: '50489887690', email: `alex.504${CORPORATE_DOMAIN}`, password: 'copito.123', balance: 1300, status: 'active', createdAt: new Date().toISOString() },
      { id: '0004', firstName: 'Rebecca', lastName: 'Tramoya', country: 'Venezuela', phone: '584123151217', email: `rebbeccat${CORPORATE_DOMAIN}`, password: 'v9451679', balance: 500110, status: 'active', createdAt: new Date().toISOString() }
    ];

    const loadedUsers = savedUsers ? JSON.parse(savedUsers) : initialUsers;
    setUsers(loadedUsers);
    setTransactions(savedTx ? JSON.parse(savedTx) : []);
    setNotifications(savedNotif ? JSON.parse(savedNotif) : []);

    const sessionUserId = localStorage.getItem('STX_SESSION_V16');
    if (sessionUserId) {
      const foundUser = loadedUsers.find(u => u.id === sessionUserId);
      if (foundUser) {
        setCurrentUser(foundUser);
        setView(AppView.DASHBOARD);
      }
    }
  }, []);

  const playHaptic = () => {
    if (window.navigator.vibrate) window.navigator.vibrate(10);
  };

  const getAccountNumber = (id: string) => {
    return "4532 " + id.padStart(4, '0') + " 9087 0908";
  };

  const LandingPage = () => (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center animate-fade-in relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
      
      <div className="relative z-10 space-y-12 w-full max-w-sm">
        <div className="space-y-4 animate-float">
          <div className="w-24 h-24 mx-auto bg-white/5 p-4 rounded-full glass border-nova-gold/20 flex items-center justify-center shadow-2xl">
            <img src={BANK_LOGO} className="w-full h-full object-contain" alt="Logo" />
          </div>
          <div className="flex flex-col items-center">
            <h1 className="font-orbitron font-black text-4xl tracking-tighter text-white uppercase italic">
              SPACE<span className="text-nova-gold">TRAMOYA</span> X
            </h1>
            <div className="h-0.5 w-32 bg-gradient-to-r from-transparent via-nova-gold to-transparent mt-2"></div>
            <p className="text-[10px] font-bold text-nova-titanium uppercase tracking-[0.4em] mt-3">Elite Member Access</p>
          </div>
        </div>

        <div className="grid gap-4 mt-12">
          <button 
            onClick={() => { playHaptic(); setView(AppView.LOGIN); }}
            className="w-full py-5 bg-white text-nova-obsidian font-orbitron font-black text-sm rounded-2xl shadow-[0_10px_40px_rgba(255,255,255,0.2)] active:scale-95 transition-all uppercase tracking-widest"
          >
            Identificarse
          </button>
          <button 
            onClick={() => { playHaptic(); setView(AppView.REGISTER); }}
            className="w-full py-5 glass text-white font-orbitron font-bold text-sm rounded-2xl border-white/10 active:scale-95 transition-all uppercase tracking-widest"
          >
            Registrar Nodo
          </button>
        </div>

        <div className="flex justify-center gap-6 pt-8 opacity-30">
          <Fingerprint size={20} />
          <ShieldCheck size={20} />
          <Lock size={20} />
        </div>
      </div>
      
      <p className="absolute bottom-10 text-[8px] text-nova-titanium/50 font-mono tracking-widest">ENCRYPTED END-TO-END V.2.5.0</p>
    </div>
  );

  const BottomDock = () => (
    <nav className="fixed bottom-0 left-0 right-0 z-[100] px-6 pb-[calc(1.5rem+var(--sab))] pt-4 glass border-t border-white/5 rounded-t-[32px] shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
      <div className="max-w-md mx-auto flex justify-between items-center">
        <button 
          onClick={() => { playHaptic(); setActiveTab('home'); setView(AppView.DASHBOARD); }}
          className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'home' ? 'text-nova-gold' : 'text-nova-titanium/40'}`}
        >
          <LayoutDashboard size={24} />
          <span className="text-[8px] font-bold uppercase tracking-tighter">Panel</span>
        </button>
        <button 
          onClick={() => { playHaptic(); setActiveTab('bank'); setView(AppView.SPACEBANK); }}
          className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'bank' ? 'text-nova-gold' : 'text-nova-titanium/40'}`}
        >
          <CreditCard size={24} />
          <span className="text-[8px] font-bold uppercase tracking-tighter">SpaceBank</span>
        </button>
        <div className="relative -mt-12">
           <button 
             onClick={() => { playHaptic(); alert("Red Central en espera de comandos."); }}
             className="w-14 h-14 bg-nova-gold text-nova-obsidian rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(234,179,8,0.4)] border-4 border-nova-obsidian active:scale-90 transition-all"
           >
             <ScanLine size={28} />
           </button>
        </div>
        <button 
          onClick={() => { playHaptic(); setActiveTab('history'); }}
          className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'history' ? 'text-nova-gold' : 'text-nova-titanium/40'}`}
        >
          <History size={24} />
          <span className="text-[8px] font-bold uppercase tracking-tighter">Eventos</span>
        </button>
        <button 
          onClick={() => { playHaptic(); setActiveTab('profile'); }}
          className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'profile' ? 'text-nova-gold' : 'text-nova-titanium/40'}`}
        >
          <UserIcon size={24} />
          <span className="text-[8px] font-bold uppercase tracking-tighter">Perfil</span>
        </button>
      </div>
    </nav>
  );

  const Header = () => (
    <header className="fixed top-0 left-0 right-0 z-[60] bg-nova-obsidian/80 backdrop-blur-2xl px-6 pt-[calc(1rem+var(--sat))] pb-4 border-b border-white/5">
      <div className="max-w-lg mx-auto flex justify-between items-center">
        <div className="flex flex-col">
          <h2 className="font-orbitron font-black text-xl italic tracking-tighter text-white uppercase leading-none">
            SPACE<span className="text-nova-gold">TRAMOYA</span>
          </h2>
          <span className="text-[7px] text-nova-gold/70 font-bold tracking-[0.4em] uppercase">Nova Edition</span>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Bell size={20} className="text-nova-titanium/50" />
            <div className="absolute top-0 right-0 w-2 h-2 bg-nova-emerald rounded-full border border-nova-obsidian"></div>
          </div>
          <button 
            onClick={() => { setCurrentUser(null); localStorage.removeItem('STX_SESSION_V16'); setView(AppView.HOME); }}
            className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-nova-crimson/80 border border-white/10"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </header>
  );

  const SpaceBankView = () => {
    const [tab, setTab] = useState<'send' | 'credential'>('credential');
    const [amount, setAmount] = useState('');
    const [receiverId, setReceiverId] = useState('');

    const accountData = {
      app: 'STX_BANK', id: currentUser?.id, firstName: currentUser?.firstName, lastName: currentUser?.lastName, acc: getAccountNumber(currentUser?.id || '')
    };
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(JSON.stringify(accountData))}`;

    return (
      <div className="pb-32 pt-24 px-6 space-y-8 animate-fade-in max-w-lg mx-auto">
        <div className="flex justify-between items-end px-1">
          <div className="space-y-1">
            <h3 className="text-nova-titanium/50 text-[10px] uppercase font-bold tracking-widest">Disponible</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-orbitron font-black text-white">{currentUser?.balance.toLocaleString()}</span>
              <span className="text-nova-gold font-bold text-sm tracking-tighter">NV</span>
            </div>
          </div>
          <div className="w-12 h-12 glass rounded-2xl flex items-center justify-center border-nova-gold/30 gold-shadow">
            <img src={BANK_LOGO} className="w-8 h-8 object-contain" alt="STX" />
          </div>
        </div>

        {/* Platinum Card */}
        <div className="relative w-full aspect-[1.6/1] rounded-[32px] overflow-hidden gold-shadow border border-white/20 group">
          <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-zinc-800 to-black"></div>
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/micro-carbon.png')] opacity-20"></div>
          <div className="absolute top-[-50px] left-[-50px] w-64 h-64 bg-nova-gold/10 rounded-full blur-[80px]"></div>
          
          <div className="relative h-full p-8 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 glass rounded-xl flex items-center justify-center border-white/20">
                  <Sparkles size={20} className="text-nova-gold" />
                </div>
                <div className="flex flex-col leading-none">
                  <span className="text-[10px] font-black tracking-widest uppercase text-white">Space Card</span>
                  <span className="text-[6px] uppercase text-nova-gold/60 tracking-[0.3em] font-bold">Ultra-Nova Series</span>
                </div>
              </div>
              <div className="w-12 h-10 bg-gradient-to-br from-yellow-200 to-yellow-600 rounded-md shadow-inner flex items-center justify-center opacity-80 border border-black/20 overflow-hidden">
                <div className="grid grid-cols-3 gap-0.5 w-full h-full p-1 opacity-40">
                  {Array.from({length: 12}).map((_, i) => <div key={i} className="border-[0.5px] border-black/50"></div>)}
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-xl font-mono tracking-[0.2em] text-center text-white/90 drop-shadow-lg">{getAccountNumber(currentUser?.id || '')}</p>
              <div className="flex justify-center gap-2 opacity-30 text-[8px] font-bold uppercase tracking-[0.5em]">Secure Ledger Protocol</div>
            </div>

            <div className="flex justify-between items-end">
              <div className="flex flex-col">
                <span className="text-[8px] uppercase text-white/40 mb-1 tracking-tighter">Member Identity</span>
                <p className="text-xs font-bold uppercase italic text-white tracking-wide">{currentUser?.firstName} {currentUser?.lastName}</p>
              </div>
              <div className="flex flex-col text-right">
                <span className="text-[8px] uppercase text-white/40 mb-1 tracking-tighter">Valid Thru</span>
                <p className="text-[10px] font-bold text-white tracking-widest">12 / 29</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex p-1 glass rounded-2xl border-white/5">
          <button 
            onClick={() => setTab('credential')}
            className={`flex-1 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${tab === 'credential' ? 'bg-white text-nova-obsidian' : 'text-nova-titanium/50'}`}
          >
            Credencial
          </button>
          <button 
            onClick={() => setTab('send')}
            className={`flex-1 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${tab === 'send' ? 'bg-white text-nova-obsidian' : 'text-nova-titanium/50'}`}
          >
            Transferir
          </button>
        </div>

        {tab === 'credential' ? (
          <div className="flex flex-col items-center gap-8 animate-fade-in">
             <div className="p-8 glass rounded-[40px] border-nova-gold/10 relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-nova-gold/20 via-transparent to-nova-gold/20 rounded-[41px] blur-xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative bg-white p-6 rounded-[32px] shadow-2xl">
                   <img src={qrUrl} className="w-48 h-48" alt="Access QR" />
                </div>
                <p className="text-center mt-6 text-[10px] font-orbitron font-bold text-nova-gold uppercase tracking-[0.3em]">Red de Acceso Privada</p>
             </div>
             <div className="grid grid-cols-2 gap-4 w-full">
                <button className="flex items-center justify-center gap-2 py-4 glass rounded-2xl text-[10px] font-bold uppercase text-nova-titanium hover:text-white transition-colors">
                  <Share2 size={16} /> Compartir
                </button>
                <button className="flex items-center justify-center gap-2 py-4 glass rounded-2xl text-[10px] font-bold uppercase text-nova-titanium hover:text-white transition-colors">
                  <Download size={16} /> Descargar
                </button>
             </div>
          </div>
        ) : (
          <div className="space-y-4 animate-fade-in">
             <div className="glass p-6 rounded-[32px] space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-nova-gold font-bold ml-1 tracking-widest">Destinatario (ID)</label>
                  <input 
                    value={receiverId}
                    onChange={(e) => setReceiverId(e.target.value)}
                    className="w-full bg-black/40 border border-white/5 p-4 rounded-xl text-white font-mono text-sm focus:border-nova-gold/50 outline-none transition-all"
                    placeholder="Ej: 0004"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-nova-gold font-bold ml-1 tracking-widest">Monto Nóvares</label>
                  <input 
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-black/40 border border-white/5 p-4 rounded-xl text-white font-orbitron text-xl focus:border-nova-gold/50 outline-none transition-all"
                    placeholder="0.00"
                  />
                </div>
                <button className="w-full py-4 bg-nova-gold text-nova-obsidian rounded-xl font-orbitron font-black text-xs uppercase tracking-widest active:scale-95 transition-all shadow-xl gold-shadow">
                  Autorizar Transmisión
                </button>
             </div>
             <div className="flex items-center gap-3 p-4 bg-nova-crimson/5 border border-nova-crimson/10 rounded-2xl">
                <ShieldAlert size={20} className="text-nova-crimson/60" />
                <p className="text-[8px] text-nova-titanium/70 leading-relaxed uppercase font-bold tracking-tighter">
                  Toda operación en la red Ultra-Nova es final y está sujeta a protocolos de auditoría centralizada.
                </p>
             </div>
          </div>
        )}
      </div>
    );
  };

  const DashboardView = () => (
    <div className="pb-32 pt-24 px-6 space-y-8 animate-fade-in max-w-lg mx-auto">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-orbitron font-black text-white italic">
          BIENVENIDO, <span className="text-nova-gold uppercase">{currentUser?.firstName}</span>
        </h1>
        <p className="text-[9px] text-nova-emerald font-bold uppercase tracking-[0.3em] emerald-glow">Estatus: Nodo Activo - Nivel Alpha</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="glass p-6 rounded-[32px] space-y-3 border-nova-gold/5">
          <div className="w-10 h-10 bg-nova-gold/10 rounded-xl flex items-center justify-center text-nova-gold">
             <LayoutDashboard size={20} />
          </div>
          <div>
            <p className="text-[9px] font-bold text-nova-titanium/50 uppercase tracking-widest">Operaciones</p>
            <p className="text-lg font-orbitron font-black text-white">247 <span className="text-[8px] text-nova-gold">REF</span></p>
          </div>
        </div>
        <div className="glass p-6 rounded-[32px] space-y-3 border-nova-emerald/5">
          <div className="w-10 h-10 bg-nova-emerald/10 rounded-xl flex items-center justify-center text-nova-emerald">
             <UserCheck size={20} />
          </div>
          <div>
            <p className="text-[9px] font-bold text-nova-titanium/50 uppercase tracking-widest">Confianza</p>
            <p className="text-lg font-orbitron font-black text-white">99.9<span className="text-[8px] text-nova-emerald">%</span></p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center px-1">
          <h3 className="text-[10px] font-orbitron font-black text-white uppercase tracking-widest">Transmisiones Recientes</h3>
          <button className="text-[8px] font-bold text-nova-gold uppercase tracking-widest">Ver Todo</button>
        </div>
        
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass p-4 rounded-2xl flex justify-between items-center group active:scale-95 transition-all">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center border border-white/5">
                  {i % 2 === 0 ? <ArrowDownCircle className="text-nova-emerald" size={20} /> : <ArrowUpCircle className="text-nova-crimson" size={20} />}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-white uppercase tracking-tighter">Nodo Central STX</span>
                  <span className="text-[8px] text-nova-titanium/40 font-mono">2025-12-2{i} 14:00</span>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-sm font-orbitron font-bold ${i % 2 === 0 ? 'text-nova-emerald' : 'text-nova-titanium'}`}>
                  {i % 2 === 0 ? '+' : '-'} {i * 1500} NV
                </p>
                <p className="text-[7px] text-nova-titanium/30 font-mono uppercase tracking-widest">Ref: #UX890{i}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-8 glass rounded-[40px] border-nova-gold/5 flex flex-col items-center text-center gap-4">
         <div className="w-16 h-16 bg-nova-gold/10 rounded-full flex items-center justify-center text-nova-gold animate-pulse-slow">
            <ShieldCheck size={32} />
         </div>
         <div className="space-y-1">
            <h4 className="text-sm font-orbitron font-black text-white uppercase">SISTEMA BLINDADO</h4>
            <p className="text-[9px] text-nova-titanium/60 leading-relaxed max-w-[200px] mx-auto uppercase tracking-tighter font-bold">Protocolos de seguridad de grado militar activos. Tu nodo es invisible para la red pública.</p>
         </div>
      </div>
    </div>
  );

  const LoginView = () => {
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    
    const handleLogin = () => {
      playHaptic();
      const user = users.find(u => (u.email === email || u.id === email) && u.password === pass);
      if (user) {
        setCurrentUser(user);
        localStorage.setItem('STX_SESSION_V16', user.id);
        setView(AppView.DASHBOARD);
      } else {
        alert("Credenciales inválidas en la red STX.");
      }
    };

    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 animate-fade-in relative">
        <button 
          onClick={() => setView(AppView.HOME)}
          className="absolute top-12 left-8 w-12 h-12 glass rounded-full flex items-center justify-center text-white"
        >
          <ArrowLeft size={20} />
        </button>

        <div className="w-full max-w-sm space-y-10">
          <div className="text-center space-y-2">
             <h1 className="text-3xl font-orbitron font-black text-white uppercase tracking-tighter">INGRESO<span className="text-nova-gold"> SEGURO</span></h1>
             <p className="text-[10px] text-nova-titanium font-bold uppercase tracking-[0.3em]">Validación de Credenciales</p>
          </div>

          <div className="space-y-6">
            <div className="space-y-1">
              <label className="text-[10px] uppercase text-nova-gold font-bold ml-1 tracking-widest">ID de Miembro o Email</label>
              <input 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black/40 border border-white/5 p-5 rounded-2xl text-white outline-none focus:border-nova-gold/50 transition-all text-sm"
                placeholder="0001 / correo@..."
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase text-nova-gold font-bold ml-1 tracking-widest">Código de Acceso</label>
              <input 
                type="password"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                className="w-full bg-black/40 border border-white/5 p-5 rounded-2xl text-white outline-none focus:border-nova-gold/50 transition-all text-sm tracking-[0.5em]"
                placeholder="••••••••"
              />
            </div>
            <button 
              onClick={handleLogin}
              className="w-full py-5 bg-white text-nova-obsidian font-orbitron font-black text-sm rounded-2xl shadow-2xl active:scale-95 transition-all uppercase tracking-widest"
            >
              Iniciar Protocolo
            </button>
          </div>
          
          <div className="flex flex-col items-center gap-4 pt-4 opacity-50">
             <button className="flex items-center gap-2 text-[10px] font-bold text-nova-titanium uppercase tracking-widest">
                <Fingerprint size={16} /> Identificación Biométrica
             </button>
             <button className="text-[8px] text-nova-gold uppercase font-bold tracking-widest">¿Olvidaste tu código?</button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen relative font-inter overflow-x-hidden">
      {view === AppView.HOME && <LandingPage />}
      {view === AppView.LOGIN && <LoginView />}
      
      {(view === AppView.DASHBOARD || view === AppView.SPACEBANK) && (
        <>
          <Header />
          <main className="animate-fade-in">
            {view === AppView.DASHBOARD && <DashboardView />}
            {view === AppView.SPACEBANK && <SpaceBankView />}
          </main>
          <BottomDock />
        </>
      )}

      {/* Register View simplified for design showcase */}
      {view === AppView.REGISTER && (
        <div className="min-h-screen flex flex-col items-center justify-center p-8 animate-fade-in">
           <button onClick={() => setView(AppView.HOME)} className="absolute top-12 left-8 w-12 h-12 glass rounded-full flex items-center justify-center text-white"><ArrowLeft size={20} /></button>
           <h1 className="text-2xl font-orbitron font-black text-white uppercase italic text-center">Protocolo de Registro<br/><span className="text-nova-gold">Enviado a Revisión Alpha</span></h1>
           <p className="text-nova-titanium text-[10px] font-bold uppercase tracking-widest mt-6 max-w-[250px] text-center">Debes ser invitado por un nodo de nivel 4 para registrarte en la red Ultra-Nova.</p>
        </div>
      )}

      <style>{`
        .animate-fade-in { animation: fadeIn 0.4s ease-out; }
        .animate-scale-up { animation: scaleUp 0.3s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes scaleUp { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        
        input:-webkit-autofill,
        input:-webkit-autofill:hover, 
        input:-webkit-autofill:focus {
          -webkit-text-fill-color: white;
          -webkit-box-shadow: 0 0 0px 1000px #020205 inset;
          transition: background-color 5000s ease-in-out 0s;
        }
      `}</style>
    </div>
  );
};

export default App;
