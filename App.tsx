
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
const CORPORATE_DOMAIN = "@tramoyax.cdlt";

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
        email: `luis0001${CORPORATE_DOMAIN}`,
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
        email: `miss0002${CORPORATE_DOMAIN}`,
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
        email: `alex0003${CORPORATE_DOMAIN}`,
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
    <button onClick={() => setView(to)} className="mb-4 flex items-center gap-2 text-space-cyan hover:text-white transition-all font-orbitron text-xs">
      <ArrowLeft size={16} /> VOLVER
    </button>
  );

  const Header = () => (
    <header className="fixed top-0 left-0 w-full z-50 p-3 sm:p-4 bg-space-deep/80 backdrop-blur-md border-b border-white/10 flex justify-between items-center px-4">
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView(AppView.HOME)}>
        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-tr from-space-purple to-space-cyan rounded-full flex items-center justify-center">
          <span className="font-orbitron font-black text-lg sm:text-xl italic text-white">X</span>
        </div>
        <h1 className="font-orbitron font-bold text-sm sm:text-lg text-white uppercase tracking-tighter hidden xs:block">SpaceTramoya X</h1>
      </div>
      <div className="flex gap-2">
        {view === AppView.HOME && (
          <button onClick={() => setView(AppView.ADMIN_LOGIN)} className="px-3 py-1.5 text-[10px] sm:text-xs font-orbitron bg-white/5 border border-white/10 rounded-full text-white flex items-center gap-2">
            <ShieldCheck size={12} className="text-space-cyan" /> VIP
          </button>
        )}
        {currentUser && (
          <button onClick={() => { setCurrentUser(null); setView(AppView.HOME); }} className="p-2 bg-red-500/20 text-red-400 rounded-full hover:bg-red-500/30 transition-all">
            <LogOut size={16} />
          </button>
        )}
      </div>
    </header>
  );

  const SpaceBankView = () => {
    const [receiverId, setReceiverId] = useState('');
    const [amount, setAmount] = useState('');
    const [reason, setReason] = useState('');
    const [tab, setTab] = useState<'send' | 'history'>('send');
    
    // Búsqueda dinámica del receptor para validación
    const receiver = users.find(u => u.id === receiverId);
    const numAmount = Number(amount);
    const currentBalance = currentUser?.balance || 0;
    const balanceAfter = currentBalance - numAmount;
    const userTxs = transactions.filter(t => t.fromId === currentUser?.id || t.toId === currentUser?.id);

    const handleTransferRequest = () => {
      if (!receiver) return alert('ID de receptor no válido.');
      if (numAmount <= 0) return alert('Ingresa un monto válido.');
      if (numAmount > currentBalance) return alert('Saldo insuficiente.');

      const ref = Array.from({ length: 20 }, () => Math.floor(Math.random() * 10)).join('');
      const mailBody = `
--- SOLICITUD DE TRANSFERENCIA SPACEBANK ---
FECHA: ${new Date().toLocaleString()}
REFERENCIA: ${ref}

DATOS DEL REMITENTE:
ID: ${currentUser?.id}
NOMBRE: ${currentUser?.firstName} ${currentUser?.lastName}
SALDO DISPONIBLE ANTES: ${currentBalance} NV
MONTO A RETIRAR: ${numAmount} NV
SALDO FINAL DESPUÉS DE TRANSACCIÓN: ${balanceAfter} NV

DATOS DEL RECEPTOR:
ID: ${receiverId}
NOMBRE COMPLETO: ${receiver.firstName} ${receiver.lastName}

DETALLES:
MOTIVO: ${reason || 'No especificado'}

Solicito formalmente que se procese este envío Ghost a través del sistema manual de SpaceTramoya X.
      `.trim();

      addNotification(
        currentUser?.id || '', 
        'TRANSFERENCIA SOLICITADA', 
        `Envío de ${numAmount} NV solicitado. Receptor: ${receiver.firstName} (ID: ${receiverId}). REF: ...${ref.slice(-4)}`
      );

      window.location.href = `mailto:${OFFICIAL_EMAIL}?subject=SOLICITUD DE TRANSFERENCIA - REF ${ref}&body=${encodeURIComponent(mailBody)}`;
    };

    return (
      <div className="space-y-6 sm:space-y-8 animate-fade-in w-full">
        <BackButton to={AppView.DASHBOARD} />
        
        {/* Banner de Saldo */}
        <div className="p-6 sm:p-10 bg-gradient-to-br from-space-deep to-space-blue/30 rounded-3xl sm:rounded-[40px] border border-white/10 flex flex-col sm:flex-row justify-between items-center gap-6 sm:gap-8 shadow-2xl text-white relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-center sm:text-left">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-space-deep border border-white/5 rounded-xl sm:rounded-2xl p-2 shrink-0 flex items-center justify-center shadow-inner">
               <img src={BANK_LOGO} className="w-full h-full object-contain" alt="SpaceTXBank Logo" />
            </div>
            <div>
               <h2 className="text-2xl sm:text-3xl font-orbitron font-black italic uppercase">Space Bank</h2>
               <p className="text-[10px] text-space-cyan tracking-widest uppercase font-orbitron mt-1">Transacciones Ghost</p>
            </div>
          </div>
          <div className="text-center sm:text-right">
            <p className="text-[10px] opacity-40 uppercase font-orbitron tracking-widest">Tu Balance</p>
            <p className="text-4xl sm:text-5xl font-orbitron font-black">{currentBalance} <span className="text-lg text-space-cyan">NV</span></p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 bg-white/5 p-1.5 rounded-2xl border border-white/5">
          <button onClick={() => setTab('send')} className={`flex-1 py-4 font-orbitron font-bold rounded-xl transition-all ${tab === 'send' ? 'bg-space-cyan text-space-deep shadow-lg' : 'text-white/40'}`}>ENVIAR</button>
          <button onClick={() => setTab('history')} className={`flex-1 py-4 font-orbitron font-bold rounded-xl transition-all ${tab === 'history' ? 'bg-space-cyan text-space-deep shadow-lg' : 'text-white/40'}`}>HISTORIAL</button>
        </div>

        {tab === 'send' ? (
          <div className="max-w-md mx-auto bg-white/5 p-6 sm:p-10 rounded-3xl sm:rounded-[40px] border border-white/10 shadow-2xl text-white space-y-4 sm:space-y-6">
            
            {/* Validación de Receptor */}
            <div className="space-y-2">
              <label className="text-[10px] text-white/30 uppercase font-orbitron ml-2">ID Usuario Destino</label>
              <div className="relative">
                <input 
                  value={receiverId}
                  onChange={(e) => setReceiverId(e.target.value)}
                  className="w-full bg-space-deep border border-white/10 p-4 rounded-xl text-white outline-none focus:border-space-cyan transition-all font-mono" 
                  placeholder="ID (Ej: 0002)" 
                />
              </div>
              {receiverId && (
                <div className={`flex items-center gap-2 mt-1 ml-2 transition-all ${receiver ? 'text-green-400' : 'text-red-400'}`}>
                  {receiver ? <CheckCircle2 size={12} /> : <ShieldAlert size={12} />}
                  <p className="text-[10px] font-bold uppercase italic">
                    {receiver ? `RECEPTOR: ${receiver.firstName} ${receiver.lastName}` : "USUARIO NO ENCONTRADO EN LA RED"}
                  </p>
                </div>
              )}
            </div>

            {/* Monto y Saldo Dinámico */}
            <div className="space-y-2">
              <label className="text-[10px] text-white/30 uppercase font-orbitron ml-2">Cantidad a enviar</label>
              <input 
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-space-deep border border-white/10 p-4 rounded-xl text-white outline-none font-orbitron focus:border-space-cyan transition-all" 
                placeholder="0.00" 
              />
              
              {/* Desglose de Saldos */}
              <div className="p-5 bg-space-deep/50 rounded-2xl border border-white/5 space-y-3 mt-4">
                 <div className="flex justify-between items-center text-[10px] font-orbitron">
                    <span className="opacity-40 uppercase">Saldo Disponible:</span>
                    <span className="text-white font-black">{currentBalance} NV</span>
                 </div>
                 <div className="flex justify-between items-center text-[10px] font-orbitron">
                    <span className="text-red-400/60 uppercase">Monto a retirar:</span>
                    <span className="text-red-400 font-black">-{numAmount || 0} NV</span>
                 </div>
                 <div className="border-t border-white/10 pt-3 flex justify-between items-center text-[10px] font-orbitron">
                    <span className="opacity-40 uppercase">Saldo Final:</span>
                    <span className={`text-lg font-black ${balanceAfter < 0 ? 'text-red-500' : 'text-space-cyan'}`}>
                       {balanceAfter} NV
                    </span>
                 </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] text-white/30 uppercase font-orbitron ml-2">Motivo</label>
              <input 
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full bg-space-deep border border-white/10 p-4 rounded-xl text-white outline-none focus:border-space-cyan transition-all" 
                placeholder="Ej: Pago pendiente" 
              />
            </div>

            <button 
              disabled={!receiver || numAmount <= 0 || balanceAfter < 0}
              onClick={handleTransferRequest}
              className="w-full py-5 sm:py-6 bg-gradient-to-r from-space-purple to-space-blue rounded-xl sm:rounded-2xl font-orbitron font-black text-lg sm:text-xl flex items-center justify-center gap-3 active:scale-95 transition-all disabled:opacity-20 disabled:grayscale shadow-lg shadow-space-purple/20"
            >
              <Send size={20} /> ENVIAR SOLICITUD GMAIL
            </button>
            
            <p className="text-[8px] text-center text-white/20 uppercase tracking-[0.2em] font-orbitron italic">
              * El administrador debe aprobar manualmente cada movimiento *
            </p>
          </div>
        ) : (
          /* Historial */
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
              <input 
                className="w-full bg-white/5 border border-white/10 p-4 pl-12 rounded-2xl text-white outline-none focus:border-space-cyan" 
                placeholder="Buscar por últimos 4 dígitos de REF..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="space-y-3">
              {userTxs.filter(t => t.id.endsWith(searchQuery)).length === 0 ? (
                <div className="py-20 text-center opacity-20 flex flex-col items-center">
                  <Search size={48} />
                  <p className="text-xs uppercase font-orbitron mt-4 tracking-widest">Sin actividad reciente</p>
                </div>
              ) : (
                userTxs.filter(t => t.id.endsWith(searchQuery)).map(t => (
                  <div key={t.id} className="p-5 bg-white/5 border border-white/10 rounded-3xl flex justify-between items-center text-white group hover:bg-white/[0.08] transition-all">
                    <div className="flex gap-4 items-center">
                       <div className={`p-3 rounded-full ${t.toId === currentUser?.id ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                          {t.toId === currentUser?.id ? <ArrowDownCircle className="text-green-400" /> : <ArrowUpCircle className="text-red-400" />}
                       </div>
                       <div>
                        <p className="text-[9px] opacity-30 font-mono tracking-widest uppercase">REF: ...{t.id.slice(-4)}</p>
                        <p className="font-bold text-sm">{t.toId === currentUser?.id ? `DE: ${t.fromName}` : `A: ${t.toName}`}</p>
                        <p className="text-[10px] opacity-60 italic max-w-[150px] truncate">{t.reason}</p>
                       </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-orbitron font-black text-lg ${t.toId === currentUser?.id ? 'text-green-400' : 'text-red-400'}`}>
                        {t.toId === currentUser?.id ? '+' : '-'}{t.amount}
                      </p>
                      <p className="text-[9px] opacity-20 uppercase font-bold">{new Date(t.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-space-deep font-inter text-slate-100 overflow-x-hidden selection:bg-space-cyan selection:text-space-deep">
      <Header />
      <main className="pt-20 sm:pt-24 px-4 pb-12 w-full max-w-4xl mx-auto relative z-10 flex-grow">
        {view === AppView.HOME && (
          <div className="flex flex-col items-center justify-center min-h-[75vh] text-center space-y-6 sm:space-y-8 animate-fade-in px-2">
            <div className="relative">
              <div className="absolute inset-0 blur-3xl bg-space-purple/30 rounded-full scale-150"></div>
              <h1 className="relative font-orbitron text-4xl sm:text-6xl md:text-7xl font-black italic tracking-tighter text-white uppercase leading-tight">
                SPACE<span className="text-space-cyan block sm:inline">TRAMOYA</span> X
              </h1>
            </div>
            <p className="text-lg sm:text-xl text-slate-300 max-w-sm sm:max-w-xl mx-auto">La comunidad más exclusiva del entretenimiento digital.</p>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <button onClick={() => setView(AppView.REGISTER)} className="w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-space-purple to-space-blue rounded-full font-orbitron font-bold text-base sm:text-lg shadow-xl hover:scale-105 transition-all text-white">INSCRIBIRME</button>
              <button onClick={() => setView(AppView.LOGIN)} className="w-full sm:w-auto px-10 py-4 bg-white/5 border border-white/20 rounded-full font-orbitron font-bold text-base sm:text-lg hover:bg-white/10 transition-all text-white">ENTRAR</button>
            </div>
          </div>
        )}

        {view === AppView.REGISTER && (
          <div className="max-w-2xl mx-auto bg-white/5 p-6 sm:p-10 rounded-3xl sm:rounded-[40px] border border-white/10 shadow-2xl relative overflow-hidden">
            <BackButton to={AppView.HOME} />
            <h2 className="text-2xl sm:text-3xl font-orbitron font-black text-center mb-6 sm:mb-8 uppercase text-white">Registro STX</h2>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6" onSubmit={(e) => {
              e.preventDefault();
              const d = new FormData(e.currentTarget);
              if (!isOfficeOpen()) return alert('Sistema cerrado (6:00 AM - 11:30 PM).');
              if (confirm('¿Confirmas los términos y condiciones de SpaceTramoya X? Serás redirigido a Gmail.')) {
                const userPrefix = d.get('email_user') as string;
                const fullEmail = `${userPrefix}${CORPORATE_DOMAIN}`;
                const body = `REGISTRO STX\n\nNombre: ${d.get('name')}\nApellido: ${d.get('last')}\nPaís: ${d.get('country')}\nWhatsApp: ${d.get('phone')}\nEmail Corporativo: ${fullEmail}\nClave Elegida: ${d.get('pass')}`;
                window.location.href = `mailto:${OFFICIAL_EMAIL}?subject=REGISTRO STX&body=${encodeURIComponent(body)}`;
                setView(AppView.HOME);
                alert('Solicitud enviada. Recibirás tu activación en las próximas horas.');
              }
            }}>
              <input name="name" className="w-full bg-space-deep border border-white/10 p-4 rounded-xl sm:rounded-2xl text-white outline-none focus:border-space-cyan transition-all" placeholder="Nombre" required />
              <input name="last" className="w-full bg-space-deep border border-white/10 p-4 rounded-xl sm:rounded-2xl text-white outline-none focus:border-space-cyan transition-all" placeholder="Apellido" required />
              <input name="country" className="w-full bg-space-deep border border-white/10 p-4 rounded-xl sm:rounded-2xl text-white outline-none focus:border-space-cyan transition-all" placeholder="País" required />
              <input name="phone" className="w-full bg-space-deep border border-white/10 p-4 rounded-xl sm:rounded-2xl text-white outline-none focus:border-space-cyan transition-all" placeholder="WhatsApp" required />
              
              <div className="w-full md:col-span-2 relative">
                <input name="email_user" className="w-full bg-space-deep border border-white/10 p-4 pr-32 rounded-xl sm:rounded-2xl text-white outline-none focus:border-space-cyan transition-all" placeholder="Usuario para email" required />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 font-orbitron text-xs text-space-cyan font-bold pointer-events-none">{CORPORATE_DOMAIN}</span>
              </div>
              
              <input name="pass" type="password" className="w-full md:col-span-2 bg-space-deep border border-white/10 p-4 rounded-xl sm:rounded-2xl text-white outline-none focus:border-space-cyan transition-all" placeholder="Contraseña" required />
              <button type="submit" disabled={!isOfficeOpen()} className="w-full md:col-span-2 py-4 sm:py-5 bg-gradient-to-r from-space-purple to-space-cyan rounded-xl sm:rounded-2xl font-orbitron font-black text-lg sm:text-xl text-white flex items-center justify-center gap-3 active:scale-95 transition-all">
                <Mail size={20} /> ENVIAR A GMAIL
              </button>
            </form>
          </div>
        )}

        {view === AppView.LOGIN && (
          <div className="max-w-md mx-auto bg-white/5 p-8 sm:p-12 rounded-[30px] sm:rounded-[50px] border border-white/10 shadow-2xl text-white">
            <BackButton to={AppView.HOME} />
            <h2 className="text-2xl sm:text-3xl font-orbitron font-black text-center mb-8 sm:mb-10 uppercase italic">Identificación</h2>
            <div className="space-y-4 sm:space-y-6">
              <input id="loginId" className="w-full bg-space-deep border border-white/10 p-4 sm:p-5 rounded-xl sm:rounded-2xl text-white outline-none text-center focus:border-space-cyan transition-all" placeholder="ID MEMBER" />
              <input id="loginPw" type="password" className="w-full bg-space-deep border border-white/10 p-4 sm:p-5 rounded-xl sm:rounded-2xl text-white outline-none text-center focus:border-space-cyan transition-all" placeholder="CONTRASEÑA" />
              <button onClick={() => {
                const id = (document.getElementById('loginId') as HTMLInputElement).value;
                const pw = (document.getElementById('loginPw') as HTMLInputElement).value;
                const u = users.find(x => x.id === id && x.password === pw);
                if(u) { setCurrentUser(u); setView(AppView.DASHBOARD); } else { alert('Credenciales incorrectas.'); }
              }} className="w-full py-4 sm:py-5 bg-gradient-to-r from-space-blue to-space-purple rounded-xl sm:rounded-2xl font-orbitron font-black text-lg sm:text-xl text-white shadow-xl active:scale-95 transition-all">ENTRAR</button>
            </div>
          </div>
        )}

        {view === AppView.DASHBOARD && currentUser && (
          <div className="space-y-6 animate-fade-in w-full">
            <div className="p-6 sm:p-8 bg-gradient-to-br from-space-purple/20 to-space-blue/20 border border-white/10 rounded-2xl sm:rounded-3xl flex flex-col sm:flex-row justify-between items-center text-white gap-4">
              <div className="text-center sm:text-left">
                <h2 className="text-2xl sm:text-3xl font-orbitron font-black italic">HOLA, {currentUser.firstName}</h2>
                <p className="opacity-60 flex items-center justify-center sm:justify-start gap-2 mt-1 text-xs sm:text-sm"><Clock size={14} /> {getLocalTime(currentUser.country)}</p>
              </div>
              <div className="text-center sm:text-right">
                <p className="text-[10px] sm:text-xs text-space-cyan font-bold uppercase tracking-widest">Saldo Disponible</p>
                <p className="text-3xl sm:text-4xl font-orbitron font-black">{currentUser.balance} <span className="text-sm">NV</span></p>
              </div>
            </div>

            <div className="bg-space-deep border border-space-cyan/30 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl p-6 sm:p-8 flex flex-col md:flex-row gap-6 sm:gap-8 items-center text-white">
              <div className="w-24 h-24 sm:w-32 sm:h-32 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 shrink-0"><UserIcon size={48} className="opacity-20" /></div>
              <div className="flex-1 text-center md:text-left min-w-0 w-full">
                <h3 className="text-xl sm:text-2xl font-bold truncate">{currentUser.firstName} {currentUser.lastName}</h3>
                <p className="text-space-cyan font-mono font-bold uppercase tracking-widest bg-space-cyan/10 px-3 py-1 rounded-full inline-block text-[10px] sm:text-xs mt-2">ID: {currentUser.id}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-6 text-xs sm:text-sm opacity-80">
                  <p className="flex justify-between sm:block"><strong className="sm:mr-1">WA:</strong> {currentUser.phone.slice(0,5)}***{currentUser.phone.slice(-1)}</p>
                  <p className="flex justify-between sm:block"><strong className="sm:mr-1">PAÍS:</strong> {currentUser.country}</p>
                  <p className="sm:col-span-2 text-xs break-all text-center sm:text-left"><strong>EMAIL:</strong> {currentUser.email}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button onClick={() => setView(AppView.SPACEBANK)} className="p-6 sm:p-8 bg-white/5 border border-white/10 rounded-2xl sm:rounded-3xl flex flex-col gap-4 sm:gap-6 hover:bg-space-cyan/10 transition-all text-white active:scale-[0.98]">
                <div className="flex justify-between items-center w-full">
                  <div className="p-3 sm:p-4 bg-space-cyan/10 rounded-xl sm:rounded-2xl"><Wallet className="text-space-cyan" size={24} /></div>
                  <ChevronRight size={20} className="opacity-30" />
                </div>
                <div className="text-left">
                  <p className="font-orbitron font-bold text-xl sm:text-2xl uppercase tracking-tighter">Space Bank</p>
                  <p className="text-space-cyan font-orbitron font-black text-2xl sm:text-3xl">{currentUser.balance} NV</p>
                </div>
              </button>
              <div className="p-6 sm:p-8 bg-white/5 border border-white/10 rounded-2xl sm:rounded-3xl flex flex-col gap-4 text-white">
                <div className="flex justify-between items-start">
                  <p className="font-orbitron font-bold text-lg sm:text-xl uppercase">Alertas</p>
                  <Bell size={20} className="text-space-purple" />
                </div>
                <div className="space-y-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                  {notifications.filter(n => n.userId === currentUser.id).length === 0 ? (
                    <p className="text-[10px] opacity-20 text-center py-10 font-orbitron uppercase">Sin actividad</p>
                  ) : (
                    notifications.filter(n => n.userId === currentUser.id).map(n => (
                      <div key={n.id} className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl border text-white ${n.isBonus ? 'bg-space-purple/20 border-space-purple/30' : 'bg-white/5 border-white/10'} flex gap-3`}>
                        <div className="shrink-0">{n.isBonus ? <Gift size={14} /> : <CheckCircle2 size={14} />}</div>
                        <div>
                          <p className="font-bold text-[9px] sm:text-[10px] uppercase text-space-cyan leading-none">{n.title}</p>
                          <p className="text-[10px] sm:text-[11px] opacity-80 mt-1 leading-tight">{n.message}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {view === AppView.SPACEBANK && currentUser && <SpaceBankView />}

        {view === AppView.ADMIN_LOGIN && (
          <div className="max-w-md mx-auto bg-white/5 border border-red-500/20 p-8 sm:p-12 rounded-[30px] sm:rounded-[50px] shadow-2xl text-white">
            <BackButton to={AppView.HOME} />
            <h2 className="text-2xl sm:text-3xl font-orbitron font-black text-center mb-8 sm:mb-10 text-red-500 uppercase italic">Ghost Terminal</h2>
            <div className="space-y-4 sm:space-y-6 text-center">
              <input id="admU" className="w-full bg-space-deep border border-white/10 p-4 sm:p-5 rounded-xl sm:rounded-2xl text-white outline-none text-center focus:border-red-500 transition-all" placeholder="USER" />
              <input id="admP" type="password" className="w-full bg-space-deep border border-white/10 p-4 sm:p-5 rounded-xl sm:rounded-2xl text-white outline-none text-center focus:border-red-500 transition-all" placeholder="PASS" />
              <input id="admC" className="w-full bg-space-deep border border-white/10 p-4 sm:p-5 rounded-xl sm:rounded-2xl text-white outline-none text-center tracking-[0.5em] sm:tracking-[1em]" maxLength={6} placeholder="000000" />
              <button onClick={() => {
                const u = (document.getElementById('admU') as HTMLInputElement).value;
                const p = (document.getElementById('admP') as HTMLInputElement).value;
                const c = (document.getElementById('admC') as HTMLInputElement).value;
                if(u === ADMIN_CREDENTIALS.user && p === ADMIN_CREDENTIALS.pass && c === ADMIN_CREDENTIALS.securityCode) setView(AppView.ADMIN_PANEL); else alert('SISTEMA BLOQUEADO');
              }} className="w-full py-4 sm:py-5 bg-red-600 rounded-xl sm:rounded-2xl font-orbitron font-black text-lg sm:text-xl text-white active:scale-95 transition-all">AUTORIZAR</button>
            </div>
          </div>
        )}

        {view === AppView.ADMIN_PANEL && (
          <div className="space-y-6 sm:space-y-8 animate-fade-in w-full">
            <BackButton to={AppView.HOME} />
            <h2 className="text-3xl sm:text-4xl font-orbitron font-black text-red-500 uppercase italic text-center sm:text-left">Ghost Admin</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {users.map(u => (
                <div key={u.id} className="p-5 sm:p-6 bg-white/5 border border-white/10 rounded-2xl sm:rounded-3xl text-white flex flex-col gap-4">
                  <div className="min-w-0">
                    <p className="font-bold text-lg sm:text-xl truncate">{u.firstName} {u.lastName}</p>
                    <p className="text-[10px] text-space-cyan font-mono font-bold tracking-widest uppercase">ID: {u.id}</p>
                    <p className="text-[10px] opacity-40 mt-1">{u.email}</p>
                  </div>
                  <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                    <p className="text-[8px] uppercase font-orbitron opacity-40">Saldo Ghost</p>
                    <p className="text-xl sm:text-2xl font-orbitron font-black">{u.balance} NV</p>
                  </div>
                  <div className="flex flex-col gap-2 mt-auto">
                    <button onClick={() => {
                      const val = prompt(`Cantidad a abonar a ${u.firstName}:`);
                      if(val && !isNaN(Number(val))) handleAdminSendFunds(u.id, Number(val), 'Crédito Ghost Directo');
                    }} className="w-full py-2 bg-green-500/10 text-green-400 border border-green-500/20 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-green-500 hover:text-white transition-all">ABONAR NV</button>
                    <button onClick={() => {if(confirm(`¿Eliminar a ${u.firstName} permanentemente?`)) setUsers(users.filter(x => x.id !== u.id))}} className="w-full py-2 bg-red-500/10 text-red-500 border border-red-500/20 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all">ELIMINAR</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden opacity-30 select-none">
        <div className="absolute top-[-20%] left-[-10%] w-[100%] sm:w-[60%] h-[60%] bg-space-purple blur-[120px] sm:blur-[160px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[100%] sm:w-[60%] h-[60%] bg-space-blue blur-[120px] sm:blur-[160px] rounded-full animate-pulse delay-700"></div>
      </div>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.05); }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(6, 182, 212, 0.3); border-radius: 10px; }
        .animate-fade-in { animation: fadeIn 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        input::-webkit-outer-spin-button, input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
        input[type=number] { -moz-appearance: textfield; }
        * { -webkit-tap-highlight-color: transparent; }
      `}</style>
    </div>
  );
};

export default App;
