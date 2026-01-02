
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

  // Inicialización de base de datos
  useEffect(() => {
    const savedUsers = localStorage.getItem('STX_DB_FINAL_USERS');
    const savedTx = localStorage.getItem('STX_DB_FINAL_TX');
    const savedNotif = localStorage.getItem('STX_DB_FINAL_NOTIF');

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

    setUsers(savedUsers ? JSON.parse(savedUsers) : initialUsers);
    setTransactions(savedTx ? JSON.parse(savedTx) : []);
    setNotifications(savedNotif ? JSON.parse(savedNotif) : []);
  }, []);

  // Guardado persistente
  useEffect(() => {
    if (users.length > 0) {
      localStorage.setItem('STX_DB_FINAL_USERS', JSON.stringify(users));
    }
    localStorage.setItem('STX_DB_FINAL_TX', JSON.stringify(transactions));
    localStorage.setItem('STX_DB_FINAL_NOTIF', JSON.stringify(notifications));
  }, [users, transactions, notifications]);

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
    const ref = Array.from({ length: 20 }, () => Math.floor(Math.random() * 10)).join('');
    
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, balance: u.balance + amount } : u));

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
      amount >= 1000 ? '¡BONO ESPECIAL RECIBIDO!' : 'ABONO GHOST RECIBIDO', 
      `Se han acreditado ${amount} Nóvares. Motivo: ${reason}. REF: ...${ref.slice(-4)}`,
      amount >= 1000
    );

    alert(`Fondos acreditados con éxito. REF: ${ref}`);
  };

  const getLocalTime = (country: string) => {
    return new Date().toLocaleString('es-ES', { 
      hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'long', year: 'numeric' 
    });
  };

  const isOfficeOpen = () => {
    const now = new Date();
    const totalMin = now.getHours() * 60 + now.getMinutes();
    return totalMin >= 360 && totalMin <= 1410; // 6:00 AM - 11:30 PM
  };

  const BackButton = ({ to }: { to: AppView }) => (
    <button onClick={() => setView(to)} className="mb-6 flex items-center gap-2 text-space-cyan hover:text-white transition-all font-orbitron text-sm">
      <ArrowLeft size={18} /> VOLVER
    </button>
  );

  const Header = () => (
    <header className="fixed top-0 left-0 w-full z-50 p-4 bg-space-deep/80 backdrop-blur-md border-b border-white/10 flex justify-between items-center">
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView(AppView.HOME)}>
        <div className="w-10 h-10 bg-gradient-to-tr from-space-purple to-space-cyan rounded-full flex items-center justify-center">
          <span className="font-orbitron font-black text-xl italic text-white">X</span>
        </div>
        <h1 className="font-orbitron font-bold text-lg text-white uppercase tracking-tighter sm:block hidden">SpaceTramoya X</h1>
      </div>
      <div className="flex gap-2">
        {view === AppView.HOME && (
          <button onClick={() => setView(AppView.ADMIN_LOGIN)} className="px-4 py-2 text-xs font-orbitron bg-white/5 border border-white/10 rounded-full text-white flex items-center gap-2">
            <ShieldCheck size={14} className="text-space-cyan" /> ACCESO VIP
          </button>
        )}
        {currentUser && (
          <button onClick={() => { setCurrentUser(null); setView(AppView.HOME); }} className="p-2 bg-red-500/20 text-red-400 rounded-full hover:bg-red-500/30 transition-all">
            <LogOut size={18} />
          </button>
        )}
      </div>
    </header>
  );

  return (
    <div className="min-h-screen bg-space-deep font-inter text-slate-100 overflow-x-hidden">
      <Header />
      <main className="pt-24 px-4 pb-12 max-w-4xl mx-auto relative z-10">
        {view === AppView.HOME && (
          <div className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-8 animate-fade-in">
            <div className="relative">
              <div className="absolute inset-0 blur-3xl bg-space-purple/30 rounded-full"></div>
              <h1 className="relative font-orbitron text-5xl md:text-7xl font-black italic tracking-tighter text-white uppercase">
                SPACE<span className="text-space-cyan">TRAMOYA</span> X
              </h1>
            </div>
            <p className="text-xl text-slate-300 max-w-xl">La comunidad más exclusiva del entretenimiento digital.</p>
            <div className="flex gap-4">
              <button onClick={() => setView(AppView.REGISTER)} className="px-10 py-4 bg-gradient-to-r from-space-purple to-space-blue rounded-full font-orbitron font-bold text-lg shadow-xl hover:scale-105 transition-all text-white">INSCRIBIRME</button>
              <button onClick={() => setView(AppView.LOGIN)} className="px-10 py-4 bg-white/5 border border-white/20 rounded-full font-orbitron font-bold text-lg hover:bg-white/10 transition-all text-white">ENTRAR</button>
            </div>
          </div>
        )}

        {view === AppView.REGISTER && (
          <div className="max-w-2xl mx-auto bg-white/5 p-10 rounded-[40px] border border-white/10 shadow-2xl relative overflow-hidden">
            <BackButton to={AppView.HOME} />
            <h2 className="text-3xl font-orbitron font-black text-center mb-8 uppercase text-white">Registro Ghost</h2>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={(e) => {
              e.preventDefault();
              const d = new FormData(e.currentTarget);
              if (!isOfficeOpen()) return alert('Sistema cerrado (6:00 AM - 11:30 PM).');
              if (confirm('¿Confirmas los términos y condiciones de SpaceTramoya X? Serás redirigido a Gmail.')) {
                const body = `SOLICITUD DE REGISTRO\n\nNombre: ${d.get('name')}\nApellido: ${d.get('last')}\nPaís: ${d.get('country')}\nWhatsApp: ${d.get('phone')}\nEmail: ${d.get('email')}\nClave: ${d.get('pass')}`;
                window.location.href = `mailto:${OFFICIAL_EMAIL}?subject=REGISTRO GHOST&body=${encodeURIComponent(body)}`;
                setView(AppView.HOME);
                alert('Solicitud enviada. Recibirás tu activación en las próximas horas.');
              }
            }}>
              <input name="name" className="w-full bg-space-deep border border-white/10 p-4 rounded-2xl text-white outline-none" placeholder="Nombre" required />
              <input name="last" className="w-full bg-space-deep border border-white/10 p-4 rounded-2xl text-white outline-none" placeholder="Apellido" required />
              <input name="country" className="w-full bg-space-deep border border-white/10 p-4 rounded-2xl text-white outline-none" placeholder="País" required />
              <input name="phone" className="w-full bg-space-deep border border-white/10 p-4 rounded-2xl text-white outline-none" placeholder="WhatsApp" required />
              <input name="email" type="email" className="w-full md:col-span-2 bg-space-deep border border-white/10 p-4 rounded-2xl text-white outline-none" placeholder="Correo" required />
              <input name="pass" type="password" className="w-full md:col-span-2 bg-space-deep border border-white/10 p-4 rounded-2xl text-white outline-none" placeholder="Contraseña" required />
              <button type="submit" disabled={!isOfficeOpen()} className="w-full md:col-span-2 py-5 bg-gradient-to-r from-space-purple to-space-cyan rounded-2xl font-orbitron font-black text-xl text-white flex items-center justify-center gap-3">
                <Mail /> ENVIAR INSCRIPCIÓN GMAIL
              </button>
            </form>
          </div>
        )}

        {view === AppView.LOGIN && (
          <div className="max-w-md mx-auto bg-white/5 p-12 rounded-[50px] border border-white/10 shadow-2xl text-white">
            <BackButton to={AppView.HOME} />
            <h2 className="text-3xl font-orbitron font-black text-center mb-10 uppercase italic">Identificación</h2>
            <div className="space-y-6">
              <input id="loginId" className="w-full bg-space-deep border border-white/10 p-5 rounded-2xl text-white outline-none text-center" placeholder="ID MEMBER" />
              <input id="loginPw" type="password" className="w-full bg-space-deep border border-white/10 p-5 rounded-2xl text-white outline-none text-center" placeholder="CONTRASEÑA" />
              <button onClick={() => {
                const id = (document.getElementById('loginId') as HTMLInputElement).value;
                const pw = (document.getElementById('loginPw') as HTMLInputElement).value;
                const u = users.find(x => x.id === id && x.password === pw);
                if(u) { setCurrentUser(u); setView(AppView.DASHBOARD); } else { alert('Credenciales incorrectas.'); }
              }} className="w-full py-5 bg-gradient-to-r from-space-blue to-space-purple rounded-2xl font-orbitron font-black text-xl text-white shadow-xl">ENTRAR</button>
            </div>
          </div>
        )}

        {view === AppView.DASHBOARD && currentUser && (
          <div className="space-y-6 animate-fade-in">
            <div className="p-8 bg-gradient-to-br from-space-purple/20 to-space-blue/20 border border-white/10 rounded-3xl flex justify-between items-center text-white">
              <div>
                <h2 className="text-3xl font-orbitron font-black italic">HOLA, {currentUser.firstName}</h2>
                <p className="opacity-60 flex items-center gap-2 mt-1"><Clock size={16} /> {getLocalTime(currentUser.country)}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-space-cyan font-bold">SALDO DISPONIBLE</p>
                <p className="text-4xl font-orbitron font-black">{currentUser.balance} <span className="text-sm">NV</span></p>
              </div>
            </div>

            <div className="bg-space-deep border-2 border-space-cyan/30 rounded-3xl overflow-hidden shadow-2xl p-8 flex flex-col md:flex-row gap-8 items-center text-white">
              <div className="w-32 h-32 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10"><UserIcon size={64} className="opacity-20" /></div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl font-bold">{currentUser.firstName} {currentUser.lastName}</h3>
                <p className="text-space-cyan font-mono font-bold uppercase tracking-widest bg-space-cyan/10 px-3 py-1 rounded-full inline-block text-xs mt-2">ID: {currentUser.id}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 text-sm opacity-80">
                  <p><strong>WA:</strong> {currentUser.phone.slice(0,5)}***{currentUser.phone.slice(-1)}</p>
                  <p><strong>PAÍS:</strong> {currentUser.country}</p>
                  <p className="sm:col-span-2"><strong>EMAIL:</strong> {currentUser.email}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button onClick={() => setView(AppView.SPACEBANK)} className="p-8 bg-white/5 border border-white/10 rounded-3xl flex flex-col gap-6 hover:bg-space-cyan/10 transition-all text-white">
                <div className="flex justify-between items-center w-full">
                  <div className="p-4 bg-space-cyan/10 rounded-2xl"><Wallet className="text-space-cyan" size={32} /></div>
                  <ChevronRight />
                </div>
                <div className="text-left">
                  <p className="font-orbitron font-bold text-2xl uppercase tracking-tighter">Space Bank</p>
                  <p className="text-space-cyan font-orbitron font-black text-3xl">{currentUser.balance} NV</p>
                </div>
              </button>
              <div className="p-8 bg-white/5 border border-white/10 rounded-3xl flex flex-col gap-4 text-white">
                <div className="flex justify-between items-start">
                  <p className="font-orbitron font-bold text-xl uppercase">Alertas</p>
                  <Bell size={24} className="text-space-purple" />
                </div>
                <div className="space-y-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                  {notifications.filter(n => n.userId === currentUser.id).length === 0 ? (
                    <p className="text-xs opacity-20 text-center py-10 font-orbitron uppercase">Sin actividad</p>
                  ) : (
                    notifications.filter(n => n.userId === currentUser.id).map(n => (
                      <div key={n.id} className={`p-4 rounded-2xl border text-white ${n.isBonus ? 'bg-space-purple/20 border-space-purple/30' : 'bg-white/5 border-white/10'} flex gap-3`}>
                        {n.isBonus ? <Gift size={16} /> : <CheckCircle2 size={16} />}
                        <div>
                          <p className="font-bold text-[10px] uppercase text-space-cyan">{n.title}</p>
                          <p className="text-[11px] opacity-80 mt-1">{n.message}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {view === AppView.SPACEBANK && currentUser && (
          <div className="space-y-8 animate-fade-in">
            <BackButton to={AppView.DASHBOARD} />
            <div className="p-10 bg-gradient-to-br from-space-deep to-space-blue/30 rounded-[40px] border border-white/10 flex flex-col md:flex-row justify-between items-center gap-8 shadow-2xl text-white relative overflow-hidden">
              <div className="flex items-center gap-6">
                <img src={BANK_LOGO} className="w-20 h-20 object-contain bg-white rounded-2xl p-2" alt="Bank" />
                <h2 className="text-3xl font-orbitron font-black italic uppercase">Space Bank</h2>
              </div>
              <div className="text-right">
                <p className="text-xs opacity-40 uppercase font-orbitron">Disponible</p>
                <p className="text-5xl font-orbitron font-black">{currentUser.balance} <span className="text-xl text-space-cyan">NV</span></p>
              </div>
            </div>
            <div className="max-w-md mx-auto bg-white/5 p-10 rounded-[40px] border border-white/10 shadow-2xl text-white space-y-6">
              <input id="txId" className="w-full bg-space-deep border border-white/10 p-5 rounded-2xl text-white outline-none" placeholder="ID Receptor" />
              <input id="txAmt" type="number" className="w-full bg-space-deep border border-white/10 p-5 rounded-2xl text-white outline-none font-orbitron" placeholder="Monto Nóvares" />
              <input id="txRes" className="w-full bg-space-deep border border-white/10 p-5 rounded-2xl text-white outline-none" placeholder="Motivo" />
              <button onClick={() => {
                const rid = (document.getElementById('txId') as HTMLInputElement).value;
                const ramt = Number((document.getElementById('txAmt') as HTMLInputElement).value);
                const rres = (document.getElementById('txRes') as HTMLInputElement).value;
                const rec = users.find(u => u.id === rid);
                if(!rec) return alert('ID no encontrado.');
                if(ramt > currentUser.balance) return alert('Saldo insuficiente.');
                if(confirm(`¿Solicitar transferencia de ${ramt} NV a ${rec.firstName}?`)) {
                  const ref = Array.from({ length: 20 }, () => Math.floor(Math.random() * 10)).join('');
                  const mailBody = `SOLICITUD TRANSFERENCIA\nRef: ${ref}\nDe: ${currentUser.id}\nA: ${rid}\nMonto: ${ramt}\nMotivo: ${rres}`;
                  addNotification(currentUser.id, 'TRANSFERENCIA SOLICITADA', `Enviada solicitud por ${ramt} NV. REF: ...${ref.slice(-4)}`);
                  window.location.href = `mailto:${OFFICIAL_EMAIL}?subject=TRANSFERENCIA NV&body=${encodeURIComponent(mailBody)}`;
                }
              }} className="w-full py-6 bg-gradient-to-r from-space-purple to-space-blue rounded-2xl font-orbitron font-black text-xl flex items-center justify-center gap-3">
                <Send size={24} /> SOLICITAR ENVÍO
              </button>
            </div>
          </div>
        )}

        {view === AppView.ADMIN_LOGIN && (
          <div className="max-w-md mx-auto bg-white/5 border border-red-500/20 p-12 rounded-[50px] shadow-2xl text-white">
            <BackButton to={AppView.HOME} />
            <h2 className="text-3xl font-orbitron font-black text-center mb-10 text-red-500 uppercase italic">Ghost Terminal</h2>
            <div className="space-y-6 text-center">
              <input id="admU" className="w-full bg-space-deep border border-white/10 p-5 rounded-2xl text-white outline-none text-center" placeholder="USER" />
              <input id="admP" type="password" className="w-full bg-space-deep border border-white/10 p-5 rounded-2xl text-white outline-none text-center" placeholder="PASS" />
              <input id="admC" className="w-full bg-space-deep border border-white/10 p-5 rounded-2xl text-white outline-none text-center tracking-[1em]" maxLength={6} placeholder="000000" />
              <button onClick={() => {
                const u = (document.getElementById('admU') as HTMLInputElement).value;
                const p = (document.getElementById('admP') as HTMLInputElement).value;
                const c = (document.getElementById('admC') as HTMLInputElement).value;
                if(u === ADMIN_CREDENTIALS.user && p === ADMIN_CREDENTIALS.pass && c === ADMIN_CREDENTIALS.securityCode) setView(AppView.ADMIN_PANEL); else alert('SISTEMA BLOQUEADO');
              }} className="w-full py-5 bg-red-600 rounded-2xl font-orbitron font-black text-xl text-white">AUTORIZAR</button>
            </div>
          </div>
        )}

        {view === AppView.ADMIN_PANEL && (
          <div className="space-y-8 animate-fade-in">
            <BackButton to={AppView.HOME} />
            <h2 className="text-4xl font-orbitron font-black text-red-500 uppercase italic">Ghost Admin</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {users.map(u => (
                <div key={u.id} className="p-6 bg-white/5 border border-white/10 rounded-3xl text-white">
                  <p className="font-bold text-xl">{u.firstName} {u.lastName}</p>
                  <p className="text-xs text-space-cyan font-mono font-bold tracking-widest uppercase mt-1">ID: {u.id}</p>
                  <p className="text-2xl font-orbitron font-black mt-4">{u.balance} NV</p>
                  <div className="flex flex-col gap-2 mt-4">
                    <button onClick={() => {
                      const val = prompt('Cantidad a abonar:');
                      if(val) handleAdminSendFunds(u.id, Number(val), 'Crédito Ghost Directo');
                    }} className="py-2 bg-green-500/20 text-green-400 border border-green-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest">ABONAR NV</button>
                    <button onClick={() => {if(confirm(`¿Eliminar a ${u.firstName}?`)) setUsers(users.filter(x => x.id !== u.id))}} className="py-2 bg-red-500/20 text-red-500 border border-red-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest">ELIMINAR MIEMBRO</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden opacity-30">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-space-purple blur-[160px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-space-blue blur-[160px] rounded-full animate-pulse delay-700"></div>
      </div>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.05); }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(6, 182, 212, 0.3); border-radius: 10px; }
        .animate-fade-in { animation: fadeIn 0.5s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

export default App;
