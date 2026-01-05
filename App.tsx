
import React, { useState, useEffect, useMemo } from 'react';
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
  Send,
  Clock,
  TrendingUp,
  TrendingDown,
  Cpu,
  ShieldCheck,
  Flag,
  Calendar,
  AlertTriangle,
  Lock,
  Eye,
  Settings,
  ShieldAlert,
  Search,
  Users,
  PiggyBank,
  Wallet,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { AppView, User, Notification } from './types';

const BANK_LOGO = "https://i.postimg.cc/kD3Pn8C6/Photoroom-20251229-195028.png";
const SOPORTE_EMAIL = "soportespacetramoyax@gmail.com";
const TAX_AMOUNT = 0.14;

// Usuarios iniciales con los créditos especiales aplicados
const INITIAL_USERS: User[] = [
  { id: '0000', firstName: 'Rebecca', lastName: 'Oficial', country: 'Estados Unidos', phone: '0000000000', email: 'spacetramoya@tramoyax.cdlt', password: 's9451679', balance: 1000000, savingsBalance: 0, status: 'active', createdAt: '2025-01-01T00:00:00Z', hasSeenWelcomeCredit: true, lastTaxMonth: '' },
  { id: '0001', firstName: 'Luis', lastName: 'Alejandro', country: 'Venezuela', phone: '584123151217', email: 'luissalazarcabrera85@gmail.com', password: 'v9451679', balance: 70100, savingsBalance: 0, status: 'active', createdAt: '2025-01-04T12:00:00Z', hasSeenWelcomeCredit: true, lastTaxMonth: '' },
  { id: '0002', firstName: 'Miss', lastName: 'Slam Virtual', country: 'El Salvador', phone: '50375431212', email: 'missslamvirtual@tramoyax.cdlt', password: 'ms0121', balance: 5500, savingsBalance: 0, status: 'active', createdAt: '2025-01-05T00:00:00Z', hasSeenWelcomeCredit: true, lastTaxMonth: '' },
  { id: '0003', firstName: 'Alex', lastName: 'Duarte', country: 'Honduras', phone: '89887690', email: 'alex.504@tramoyax.cdlt', password: 'copito.123', balance: 1300, savingsBalance: 0, status: 'active', createdAt: '2025-01-05T00:00:00Z', hasSeenWelcomeCredit: true, lastTaxMonth: '' }
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
      <span className="text-[9px] font-bold uppercase tracking-widest text-white/80">
        {showDate ? `${time.toLocaleDateString()} | ` : ''}{time.toLocaleTimeString()}
      </span>
    </div>
  );
};

const VerificationBadge = () => (
  <div className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-gradient-to-tr from-nova-gold to-yellow-200 ml-2 shadow-[0_0_10px_rgba(234,179,8,0.5)]">
    <ShieldCheck size={10} className="text-black stroke-[3]" />
  </div>
);

const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.HOME);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activeTab, setActiveTab] = useState<AppView>(AppView.DASHBOARD);

  const DB_KEY = 'STX_DB_MASTER_V18';
  const NOTIF_KEY = 'STX_NOTIFS_V2';
  const SPECIAL_CREDIT_FLAG = 'STX_SPECIAL_CREDIT_APPLIED_V1';

  const isUserAdmin = (id?: string) => id === '0000' || id === '0001';

  // Sistema de Impuestos Automático
  const checkAndProcessTaxes = (allUsers: User[]) => {
    const today = new Date();
    const day = today.getDate();
    const monthYear = `${today.getFullYear()}-${today.getMonth() + 1}`;

    if (day === 16) {
      const admin = allUsers.find(u => u.id === '0000');
      if (admin && admin.lastTaxMonth !== monthYear) {
        let totalCollected = 0;
        const newNotifications: Notification[] = [];
        const dateStr = `${today.toLocaleDateString()} ${today.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

        const updatedUsers = allUsers.map(u => {
          if (u.id !== '0000' && u.id !== '0001') {
            const newBalance = Math.max(0, u.balance - TAX_AMOUNT);
            totalCollected += TAX_AMOUNT;
            
            newNotifications.push({
              id: Math.random().toString(36).substr(2, 9),
              userId: u.id,
              title: "Cobro de Comisión STX",
              message: `Se ha debitado ${TAX_AMOUNT} NV por mantenimiento de cuenta mensual.`,
              date: dateStr,
              isRead: false,
              type: 'tax',
              amount: TAX_AMOUNT,
              reference: generateReference(),
              status: 'completed'
            });

            return { ...u, balance: newBalance };
          }
          if (u.id === '0000') {
            return { ...u, savingsBalance: u.savingsBalance + totalCollected, lastTaxMonth: monthYear };
          }
          return u;
        });

        newNotifications.push({
          id: Math.random().toString(36).substr(2, 9),
          userId: '0000',
          title: "Recaudación Mensual Recibida",
          message: `Se han depositado ${totalCollected.toFixed(2)} NV en tu cuenta de ahorro por impuestos comunitarios.`,
          date: dateStr,
          isRead: false,
          type: 'received',
          amount: totalCollected,
          reference: generateReference(),
          senderName: "Sistema STX",
          status: 'completed'
        });

        setUsers(updatedUsers);
        setNotifications(prev => {
          const combined = [...newNotifications, ...prev];
          localStorage.setItem(NOTIF_KEY, JSON.stringify(combined));
          return combined;
        });
        localStorage.setItem(DB_KEY, JSON.stringify(updatedUsers));
        
        if (currentUser) {
          const updatedCurrent = updatedUsers.find(u => u.id === currentUser.id);
          if (updatedCurrent) setCurrentUser(updatedCurrent);
        }
      }
    }
  };

  // Módulo de Aplicación de Créditos Especiales para instalaciones existentes
  const processSpecialCredits = (currentUsers: User[]) => {
    if (localStorage.getItem(SPECIAL_CREDIT_FLAG)) return currentUsers;

    const credits = {
      '0001': 70000,
      '0002': 5500,
      '0003': 1300
    };

    const now = new Date();
    const dateStr = `${now.toLocaleDateString()} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    const newNotifications: Notification[] = [];

    const updatedUsers = currentUsers.map(u => {
      const creditAmount = credits[u.id as keyof typeof credits];
      if (creditAmount) {
        newNotifications.push({
          id: Math.random().toString(36).substr(2, 9),
          userId: u.id,
          title: "Crédito Especial Otorgado",
          message: `Has recibido un crédito exclusivo de ${creditAmount} NV otorgado por SpaceTramoyaX.`,
          date: dateStr,
          isRead: false,
          type: 'received',
          amount: creditAmount,
          reference: generateReference(),
          senderName: "SpaceTramoyaX HQ",
          status: 'completed'
        });
        return { ...u, balance: u.balance + creditAmount };
      }
      return u;
    });

    setNotifications(prev => {
      const combined = [...newNotifications, ...prev];
      localStorage.setItem(NOTIF_KEY, JSON.stringify(combined));
      return combined;
    });

    localStorage.setItem(SPECIAL_CREDIT_FLAG, 'true');
    localStorage.setItem(DB_KEY, JSON.stringify(updatedUsers));
    return updatedUsers;
  };

  useEffect(() => {
    const savedData = localStorage.getItem(DB_KEY);
    let dbUsers = INITIAL_USERS;
    if (savedData) { 
      try { 
        dbUsers = JSON.parse(savedData); 
        const userMap = new Map();
        dbUsers.forEach(u => userMap.set(u.id, u));
        INITIAL_USERS.forEach(u => {
          if (!userMap.has(u.id)) userMap.set(u.id, u);
        });
        dbUsers = Array.from(userMap.values());
      } catch (e) { 
        dbUsers = INITIAL_USERS;
      } 
    }
    
    // Procesar los créditos de 70000, 5500 y 1300
    const finalUsers = processSpecialCredits(dbUsers);
    setUsers(finalUsers);
    
    const savedNotifs = localStorage.getItem(NOTIF_KEY);
    if (savedNotifs) setNotifications(JSON.parse(savedNotifs));
    
    const sessionKey = localStorage.getItem('STX_SESSION_KEY');
    if (sessionKey) {
      const activeUser = finalUsers.find(u => u.id === sessionKey);
      if (activeUser) { 
        setCurrentUser(activeUser); 
        setView(AppView.DASHBOARD); 
        setActiveTab(AppView.DASHBOARD); 
      }
    }

    checkAndProcessTaxes(finalUsers);
  }, []);

  const playHaptic = () => { if (window.navigator.vibrate) window.navigator.vibrate(15); };
  
  const generateReference = () => { 
    let ref = ''; 
    for(let i = 0; i < 20; i++) ref += Math.floor(Math.random() * 10).toString(); 
    return ref; 
  };
  
  const updateUserData = (updatedUser: User) => {
    setUsers(prev => {
      const updatedUsers = prev.map(u => u.id === updatedUser.id ? updatedUser : u);
      localStorage.setItem(DB_KEY, JSON.stringify(updatedUsers));
      return updatedUsers;
    });
  };

  const addTransferRequest = (senderId: string, receiverId: string, amount: number, ref: string, concept: string) => {
    const now = new Date();
    const dateStr = `${now.toLocaleDateString()} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    
    const senderUser = users.find(u => u.id === senderId);

    const pendingNotif: Notification = {
      id: Math.random().toString(36).substr(2, 9),
      userId: senderId,
      title: "Solicitud de Pago Rápido",
      message: `Tu solicitud de enviar ${amount} NV a ID ${receiverId} está siendo procesada por el sistema.`,
      date: dateStr,
      isRead: false,
      type: 'pending_transfer',
      amount,
      reference: ref,
      targetUserId: receiverId,
      concept,
      senderName: `${senderUser?.firstName} ${senderUser?.lastName}`,
      status: 'pending'
    };

    setNotifications(prev => {
      const updated = [pendingNotif, ...prev];
      localStorage.setItem(NOTIF_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const handleApproveTransfer = (notifId: string) => {
    const notif = notifications.find(n => n.id === notifId);
    if (!notif || notif.status !== 'pending') return;

    const sender = users.find(u => u.id === notif.userId);
    const receiver = users.find(u => u.id === notif.targetUserId);

    if (!sender || !receiver) return alert("Error: Usuarios no encontrados");
    if (sender.balance < notif.amount) return alert("Error: Saldo insuficiente en el emisor");

    const now = new Date();
    const dateStr = `${now.toLocaleDateString()} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    const updatedSender = { ...sender, balance: sender.balance - notif.amount };
    const updatedReceiver = { ...receiver, balance: receiver.balance + notif.amount };

    const newUsers = users.map(u => {
      if (u.id === sender.id) return updatedSender;
      if (u.id === receiver.id) return updatedReceiver;
      return u;
    });

    const sentNotif: Notification = {
      ...notif,
      id: Math.random().toString(36).substr(2, 9),
      title: "Pago Rápido STX Acreditado",
      message: `Transferencia de ${notif.amount} NV enviada a ${receiver.firstName} procesada con éxito.`,
      type: 'sent',
      status: 'completed',
      date: dateStr
    };

    const receivedNotif: Notification = {
      id: Math.random().toString(36).substr(2, 9),
      userId: receiver.id,
      title: "Pago Rápido Recibido",
      message: `Has recibido ${notif.amount} NV de ${sender.firstName} (${sender.id}).`,
      date: dateStr,
      isRead: false,
      type: 'received',
      amount: notif.amount,
      reference: notif.reference,
      senderName: `${sender.firstName} ${sender.lastName}`,
      status: 'completed'
    };

    const newNotifs = notifications.map(n => n.id === notifId ? { ...n, status: 'completed' as const } : n);
    const finalNotifs = [sentNotif, receivedNotif, ...newNotifs];

    setUsers(newUsers);
    setNotifications(finalNotifs);
    localStorage.setItem(DB_KEY, JSON.stringify(newUsers));
    localStorage.setItem(NOTIF_KEY, JSON.stringify(finalNotifs));

    if (currentUser?.id === sender.id) setCurrentUser(updatedSender);
    if (currentUser?.id === receiver.id) setCurrentUser(updatedReceiver);
    
    alert("Operación Acreditada Correctamente");
  };

  const handleRejectTransfer = (notifId: string) => {
    const newNotifs = notifications.map(n => n.id === notifId ? { ...n, status: 'rejected' as const, title: "Solicitud Rechazada" } : n);
    setNotifications(newNotifs);
    localStorage.setItem(NOTIF_KEY, JSON.stringify(newNotifs));
    alert("Operación Rechazada por el Sistema");
  };

  const LandingPage = () => (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 animate-fade-in bg-nova-obsidian">
      <div className="relative z-10 space-y-12 w-full max-w-sm">
        <div className="space-y-4 animate-float text-center">
          <div className="w-28 h-28 mx-auto bg-white/5 p-4 rounded-[2rem] glass flex items-center justify-center shadow-2xl border border-nova-gold/20">
            <img src={BANK_LOGO} className="w-full h-full object-contain" alt="Logo" />
          </div>
          <div className="flex flex-col items-center">
            <h1 className="font-orbitron font-black text-4xl tracking-tighter text-white uppercase italic leading-none">SPACE<span className="text-nova-gold">TRAMOYA</span> X</h1>
            <div className="h-0.5 w-32 bg-gradient-to-r from-transparent via-nova-gold to-transparent mt-3"></div>
            <p className="text-[10px] text-nova-gold/40 font-bold uppercase tracking-[0.4em] mt-3 text-center">Protocolo Ultra-Nova</p>
          </div>
        </div>
        <div className="grid gap-5">
          <button onClick={() => { playHaptic(); setView(AppView.LOGIN); }} className="w-full py-5 bg-white text-nova-obsidian font-orbitron font-black text-sm rounded-2xl shadow-xl active:scale-95 transition-all uppercase tracking-widest">Iniciar Sesión</button>
          <button onClick={() => { playHaptic(); setView(AppView.REGISTER); }} className="w-full py-5 glass text-white font-orbitron font-bold text-sm rounded-2xl border-white/10 active:scale-95 transition-all uppercase tracking-widest">Registrarse</button>
        </div>
      </div>
    </div>
  );

  const DashboardView = () => (
    <div className="pb-32 pt-36 px-6 space-y-8 animate-fade-in max-w-lg mx-auto">
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-orbitron font-black text-white italic leading-none uppercase tracking-tighter flex items-center">
            HOLA, <span className="text-nova-gold ml-2 drop-shadow-[0_0_10px_rgba(234,179,8,0.3)]">{currentUser?.firstName}</span>
            {isUserAdmin(currentUser?.id) && <VerificationBadge />}
          </h1>
          <RealTimeClock showDate />
        </div>
        <div className="px-3 py-1 glass rounded-full border-nova-gold/20">
          <span className="text-[8px] font-black text-nova-gold uppercase tracking-[0.2em]">STX ID {currentUser?.id}</span>
        </div>
      </div>
      
      <div className="glass p-8 rounded-[3rem] border-nova-gold/10 space-y-6 shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-5 opacity-5 group-hover:rotate-12 transition-transform duration-500"><Sparkles size={50} className="text-nova-gold" /></div>
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 bg-nova-gold/10 rounded-[1.5rem] flex items-center justify-center text-nova-gold shadow-inner border border-nova-gold/5"><LayoutDashboard size={32} /></div>
          <div><h3 className="text-[10px] font-bold text-nova-titanium/50 uppercase tracking-[0.4em] mb-2 leading-none">DISPONIBLE</h3><p className="text-4xl font-orbitron font-black text-white leading-none tracking-tight">{currentUser?.balance.toLocaleString()} <span className="text-sm text-nova-gold">NV</span></p></div>
        </div>
        <button onClick={() => { playHaptic(); setView(AppView.SPACEBANK); setActiveTab(AppView.SPACEBANK); }} className="w-full py-5 bg-white text-nova-obsidian rounded-2xl flex items-center justify-center gap-3 font-orbitron font-black shadow-xl active:scale-95 transition-all"><CreditCard size={18} /><span className="text-[10px] uppercase tracking-widest">Gestionar SpaceBank</span></button>
      </div>

      <div className="space-y-5">
        <div className="flex items-center justify-between px-2"><h3 className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">Operaciones Recientes</h3><ChevronRight size={14} className="text-white/20" /></div>
        {notifications.filter(n => n.userId === currentUser?.id && n.status === 'completed').length === 0 ? (
          <div className="glass p-10 rounded-[2rem] text-center opacity-30 italic"><p className="text-[10px] uppercase font-black tracking-widest leading-relaxed">No hay movimientos acreditados en el sistema central.</p></div>
        ) : (
          notifications.filter(n => n.userId === currentUser?.id && n.status === 'completed').slice(0, 3).map(n => (
            <div key={n.id} className="glass p-6 rounded-[2rem] flex items-center justify-between border-white/5 hover:border-nova-gold/10 transition-colors">
               <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${n.type === 'sent' || n.type === 'tax' ? 'bg-nova-crimson/10 text-nova-crimson' : 'bg-nova-gold/10 text-nova-gold'}`}>
                    {n.type === 'sent' || n.type === 'tax' ? <TrendingDown size={18} /> : <TrendingUp size={18} />}
                  </div>
                  <div className="flex flex-col leading-tight">
                    <span className="text-[11px] font-bold text-white uppercase tracking-tight italic">{n.title}</span>
                    <span className="text-[8px] text-nova-titanium/40 mt-1 uppercase font-black">{n.date.split(' ')[0]}</span>
                  </div>
               </div>
               <div className="text-right">
                 <span className={`text-sm font-orbitron font-bold ${n.type === 'sent' || n.type === 'tax' ? 'text-nova-crimson' : 'text-nova-gold'}`}>
                   {n.type === 'sent' || n.type === 'tax' ? '-' : '+'}{n.amount.toLocaleString()} NV
                 </span>
               </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  const SpaceBankView = () => {
    const [tab, setTab] = useState<'mycard' | 'transfer'>('mycard');
    const [destId, setDestId] = useState('');
    const [amount, setAmount] = useState('');
    const [motivo, setMotivo] = useState('');
    const [showWarning, setShowWarning] = useState(false);

    const targetUser = useMemo(() => {
      if (destId.length < 3) return null;
      return users.find(u => u.id === destId.trim());
    }, [destId, users]);

    const remainingBalance = useMemo(() => {
      const amt = parseFloat(amount) || 0;
      return (currentUser?.balance || 0) - amt;
    }, [amount, currentUser]);

    const handleStartTransfer = () => {
      if (!targetUser) return alert("Error: ID de destinatario no válido.");
      if (!amount || parseFloat(amount) <= 0) return alert("Error: Ingrese un monto válido.");
      if (remainingBalance < 0) return alert("Error: Saldo insuficiente.");
      if (!motivo) return alert("Error: Ingrese un concepto.");
      setShowWarning(true);
    };

    const processFinalAction = () => {
      const amtNum = parseFloat(amount);
      const ref = generateReference();
      addTransferRequest(currentUser!.id, destId, amtNum, ref, motivo);
      const subject = `Pago Rápido STX - Ref: ${ref}`;
      const body = `SISTEMA SPACEBANK - PAGO RÁPIDO STX\n\n` +
                   `---------------------------------------------\n` +
                   `DATOS DEL EMISOR:\n` +
                   `CÓDIGO DE USUARIO: ${currentUser?.id}\n` +
                   `NOMBRE: ${currentUser?.firstName} ${currentUser?.lastName}\n\n` +
                   `DATOS DEL RECEPTOR:\n` +
                   `CÓDIGO DE USUARIO: ${destId}\n` +
                   `NOMBRE: ${targetUser?.firstName} ${targetUser?.lastName}\n\n` +
                   `DETALLES DE LA OPERACIÓN:\n` +
                   `MONTO SOLICITADO: ${amtNum} NV\n` +
                   `MONTO RESTANTE ESTIMADO: ${remainingBalance} NV\n` +
                   `REFERENCIA (20 DÍGITOS): ${ref}\n` +
                   `CONCEPTO: ${motivo}\n` +
                   `---------------------------------------------\n\n` +
                   `ESTADO: ENVIADO PARA AUTORIZACIÓN CENTRAL (EL DINERO SE DESCONTARÁ AL SER ACREDITADO POR EL SISTEMA)`;
      window.location.href = `mailto:${SOPORTE_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      setShowWarning(false);
      setTab('mycard');
      setDestId('');
      setAmount('');
      setMotivo('');
    };

    return (
      <div className="pb-32 pt-36 px-6 space-y-8 animate-fade-in max-w-lg mx-auto">
        {showWarning && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-nova-obsidian/95 backdrop-blur-xl">
            <div className="glass p-8 rounded-[2.5rem] border-nova-gold/20 max-w-xs w-full space-y-6 text-center shadow-[0_0_50px_rgba(234,179,8,0.2)]">
              <div className="w-16 h-16 bg-nova-gold/10 rounded-full flex items-center justify-center mx-auto"><AlertTriangle className="text-nova-gold" size={32} /></div>
              <div className="space-y-2"><h3 className="text-lg font-orbitron font-black text-white uppercase italic">Aviso de Salida</h3><p className="text-[10px] text-nova-titanium leading-relaxed uppercase tracking-widest">Vas a salir de la aplicación para procesar la solicitud vía Gmail. El dinero no se descontará hasta que el sistema lo autorice.</p></div>
              <div className="grid grid-cols-2 gap-3"><button onClick={() => setShowWarning(false)} className="py-3 bg-white/5 rounded-xl text-[10px] font-bold uppercase tracking-widest">Cancelar</button><button onClick={processFinalAction} className="py-3 bg-nova-gold text-nova-obsidian rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg active:scale-95">Autorizar</button></div>
            </div>
          </div>
        )}
        
        <div className="space-y-6">
          <div className="flex justify-between items-end">
            <div className="space-y-1">
              <h3 className="text-nova-titanium/50 text-[10px] uppercase font-bold tracking-widest">Balance Disponible</h3>
              <span className="text-4xl font-orbitron font-black text-white">{currentUser?.balance.toLocaleString()} <span className="text-sm text-nova-gold">NV</span></span>
            </div>
            <div className="w-12 h-12 glass rounded-2xl flex items-center justify-center border-nova-gold/30"><img src={BANK_LOGO} className="w-8 h-8 object-contain" /></div>
          </div>

          {currentUser?.id === '0000' && (
             <div className="glass p-6 rounded-[2rem] border-nova-emerald/20 flex items-center justify-between gold-shadow bg-gradient-to-r from-nova-emerald/5 to-transparent">
               <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-nova-emerald/10 rounded-2xl flex items-center justify-center text-nova-emerald shadow-inner">
                   <PiggyBank size={24} />
                 </div>
                 <div>
                   <h4 className="text-[9px] font-black text-nova-emerald uppercase tracking-[0.3em] leading-none mb-1">Cuenta de Ahorro STX</h4>
                   <p className="text-xl font-orbitron font-black text-white leading-none">{currentUser?.savingsBalance.toLocaleString()} <span className="text-[10px] text-nova-gold">NV</span></p>
                 </div>
               </div>
               <div className="text-right">
                 <span className="text-[7px] text-white/30 uppercase font-black tracking-widest block">Recaudación Fiscal</span>
                 <span className="text-[8px] text-nova-emerald font-bold uppercase">Activa</span>
               </div>
             </div>
          )}
        </div>

        <div className="flex p-1 glass rounded-2xl border-white/5"><button onClick={() => setTab('mycard')} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${tab === 'mycard' ? 'bg-white text-nova-obsidian shadow-lg' : 'text-nova-titanium/50'}`}>Mi Tarjeta</button><button onClick={() => setTab('transfer')} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${tab === 'transfer' ? 'bg-white text-nova-obsidian shadow-lg' : 'text-nova-titanium/50'}`}>Pago Rápido</button></div>
        {tab === 'mycard' ? (
          <div className="w-full aspect-[1.6/1] rounded-[28px] bg-gradient-to-br from-[#0a0a0a] via-[#111] to-[#1a1a1a] border border-nova-gold/30 p-8 relative overflow-hidden shadow-2xl gold-shadow flex flex-col justify-between animate-fade-in">
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
            <div className="flex justify-between items-start z-10"><div className="flex flex-col"><span className="text-[10px] text-nova-gold font-black uppercase tracking-[0.4em] italic leading-none">SpaceX Card</span><img src={BANK_LOGO} className="w-10 h-10 mt-3 opacity-90 drop-shadow-[0_0_8px_gold]" /></div><Cpu className="text-nova-gold/60" size={24} /></div>
            <p className="text-xl md:text-2xl font-mono font-bold text-white tracking-[0.25em] z-10">4532 {currentUser?.id.padStart(4, '0')} 8890 1126</p>
            <div className="flex justify-between items-end z-10"><div className="space-y-1"><span className="text-[7px] text-white/30 font-mono block uppercase tracking-widest">Card Holder</span><span className="text-xs text-white font-black uppercase tracking-widest font-orbitron">{currentUser?.firstName} {currentUser?.lastName}</span></div><div className="text-right"><span className="text-[7px] text-white/30 font-mono block uppercase tracking-widest">Expires</span><span className="text-xs text-white font-black font-mono">12/26</span></div></div>
          </div>
        ) : (
          <div className="glass p-8 rounded-[32px] space-y-6 animate-fade-in shadow-xl border-white/5">
            <div className="space-y-2"><span className="text-[8px] text-nova-gold font-black uppercase tracking-widest ml-1">Código de Destino</span><input value={destId} onChange={e => setDestId(e.target.value.slice(0, 4))} maxLength={4} className="w-full bg-black/40 border border-white/10 p-4 rounded-xl text-white font-mono text-lg outline-none focus:border-nova-gold/50" placeholder="0000" />{targetUser && <div className="flex items-center gap-2 p-3 bg-nova-emerald/5 border border-nova-emerald/20 rounded-xl animate-fade-in"><div className="w-2 h-2 rounded-full bg-nova-emerald shadow-[0_0_10px_emerald]"></div><span className="text-[10px] font-bold text-nova-emerald uppercase tracking-widest italic">{targetUser.firstName} {targetUser.lastName}</span></div>}</div>
            <div className="space-y-2"><span className="text-[8px] text-nova-gold font-black uppercase tracking-widest ml-1">Monto a Transferir (NV)</span><input type="number" value={amount} onChange={e => setAmount(e.target.value)} className="w-full bg-black/40 border border-white/10 p-4 rounded-xl text-white font-orbitron text-2xl outline-none focus:border-nova-gold/50" placeholder="0.00" /><div className="flex justify-between items-center px-1"><span className="text-[9px] text-white/30 font-bold uppercase">Saldo Restante:</span><span className={`text-[10px] font-orbitron font-black ${remainingBalance < 0 ? 'text-nova-crimson' : 'text-nova-gold'}`}>{remainingBalance.toLocaleString()} NV</span></div></div>
            <div className="space-y-2"><span className="text-[8px] text-nova-gold font-black uppercase tracking-widest ml-1">Concepto de Operación</span><input value={motivo} onChange={e => setMotivo(e.target.value)} className="w-full bg-black/40 border border-white/10 p-4 rounded-xl text-white text-xs outline-none focus:border-nova-gold/50" placeholder="Ej. Pago de servicio" /></div>
            <button onClick={handleStartTransfer} disabled={!targetUser || remainingBalance < 0 || !amount || !motivo} className="w-full py-5 bg-nova-gold disabled:opacity-20 text-nova-obsidian rounded-xl font-orbitron font-black text-xs uppercase tracking-widest shadow-xl flex items-center justify-center gap-2 active:scale-95 transition-all mt-4"><Send size={16} /> Procesar Solicitud</button>
          </div>
        )}
      </div>
    );
  };

  const AdminPanelView = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUserLogs, setSelectedUserLogs] = useState<string | null>(null);

    const filteredUsers = useMemo(() => {
      return users.filter(u => 
        u.firstName.toLowerCase().includes(searchTerm.toLowerCase()) || 
        u.lastName.toLowerCase().includes(searchTerm.toLowerCase()) || 
        u.id.includes(searchTerm)
      );
    }, [searchTerm, users]);

    const pendingRequests = useMemo(() => {
      return notifications.filter(n => n.type === 'pending_transfer' && n.status === 'pending');
    }, [notifications]);

    return (
      <div className="pb-32 pt-36 px-6 space-y-12 animate-fade-in max-w-4xl mx-auto overflow-y-auto max-h-screen">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-nova-gold/20 rounded-2xl border border-nova-gold/30">
            <ShieldAlert size={24} className="text-nova-gold" />
          </div>
          <div>
            <h1 className="text-2xl font-orbitron font-black text-white italic uppercase tracking-tighter italic leading-none">PANEL <span className="text-nova-gold">GHOST</span></h1>
            <p className="text-[8px] text-nova-gold/50 font-black uppercase tracking-[0.4em] mt-1">Control de Sistemas SpaceTramoya</p>
          </div>
        </div>

        {/* Sección de Solicitudes Pendientes */}
        <div className="space-y-5">
           <div className="flex items-center justify-between px-2">
             <h3 className="text-[10px] font-black text-nova-gold uppercase tracking-[0.4em]">Solicitudes de Pago Pendientes</h3>
             <span className="text-[10px] text-white/30 font-bold">{pendingRequests.length} Esperando</span>
           </div>
           {pendingRequests.length === 0 ? (
             <div className="glass p-10 rounded-[2rem] text-center opacity-30 italic">
               <p className="text-[10px] uppercase font-black tracking-widest">Sin solicitudes pendientes en el sistema</p>
             </div>
           ) : (
             <div className="grid gap-4">
               {pendingRequests.map(req => (
                 <div key={req.id} className="glass p-6 rounded-[2rem] border-nova-gold/10 space-y-4 animate-fade-in bg-nova-gold/5">
                   <div className="flex justify-between items-start">
                     <div className="flex items-center gap-4">
                       <div className="w-12 h-12 bg-nova-gold/20 rounded-2xl flex items-center justify-center text-nova-gold"><Send size={20} /></div>
                       <div>
                         <p className="text-sm font-black text-white uppercase italic">{req.senderName}</p>
                         <p className="text-[9px] text-white/40 font-mono tracking-widest">SOLICITA ENVIAR A ID: {req.targetUserId}</p>
                       </div>
                     </div>
                     <div className="text-right">
                       <p className="text-xl font-orbitron font-black text-nova-gold">{req.amount.toFixed(2)} NV</p>
                       <p className="text-[8px] text-white/20 font-mono uppercase">Ref: {req.reference.slice(0, 10)}...</p>
                     </div>
                   </div>
                   <div className="p-3 bg-black/40 rounded-xl border border-white/5">
                     <p className="text-[9px] text-white/50 italic"><span className="font-black text-nova-gold uppercase mr-2">Concepto:</span> "{req.concept}"</p>
                   </div>
                   <div className="flex gap-3">
                     <button onClick={() => handleRejectTransfer(req.id)} className="flex-1 py-4 bg-nova-crimson/10 text-nova-crimson rounded-2xl text-[10px] font-black uppercase tracking-widest border border-nova-crimson/20 active:scale-95 flex items-center justify-center gap-2"><XCircle size={14} /> Rechazar</button>
                     <button onClick={() => handleApproveTransfer(req.id)} className="flex-1 py-4 bg-nova-gold text-nova-obsidian rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg active:scale-95 flex items-center justify-center gap-2"><CheckCircle2 size={14} /> Autorizar y Acreditar</button>
                   </div>
                 </div>
               ))}
             </div>
           )}
        </div>

        {/* Resto del Panel (Usuarios) */}
        <div className="space-y-8">
          <div className="relative">
            <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none"><Search size={16} className="text-white/20" /></div>
            <input type="text" placeholder="BUSCAR USUARIOS..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-black/40 border border-white/5 py-5 pl-14 pr-6 rounded-3xl text-xs font-orbitron font-bold text-white outline-none focus:border-nova-gold/40 transition-all placeholder:text-white/10 uppercase tracking-widest" />
          </div>

          <div className="grid gap-4">
            {filteredUsers.map((u) => (
              <div key={u.id} className={`glass rounded-[2rem] border-white/5 overflow-hidden transition-all ${selectedUserLogs === u.id ? 'ring-1 ring-nova-gold/20' : ''}`}>
                <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 relative overflow-hidden group">
                      <UserIcon size={24} className="text-nova-gold/40" />
                      <div className="absolute inset-0 bg-nova-gold/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center">
                        <h4 className="text-sm font-black text-white uppercase italic">{u.firstName} {u.lastName}</h4>
                        {isUserAdmin(u.id) && <VerificationBadge />}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-nova-gold/60 font-black tracking-widest">ID: {u.id}</span>
                        <div className="w-1 h-1 rounded-full bg-white/10"></div>
                        <span className={`text-[9px] font-black uppercase tracking-widest ${u.status === 'active' ? 'text-nova-emerald' : u.status === 'blocked' ? 'text-nova-crimson' : 'text-nova-gold'}`}>
                          {u.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 justify-between md:justify-end border-t md:border-t-0 pt-4 md:pt-0 border-white/5">
                    <div className="text-right">
                      <span className="text-[8px] text-nova-titanium uppercase font-black tracking-widest">Balance Ghost</span>
                      <p className="text-lg font-orbitron font-black text-white">{u.balance.toLocaleString()} <span className="text-[10px] text-nova-gold">NV</span></p>
                    </div>
                    <button onClick={() => setSelectedUserLogs(selectedUserLogs === u.id ? null : u.id)} className={`p-4 rounded-2xl transition-all active:scale-95 ${selectedUserLogs === u.id ? 'bg-nova-gold text-nova-obsidian' : 'bg-white/5 text-nova-gold'}`}><Eye size={20} /></button>
                  </div>
                </div>

                {selectedUserLogs === u.id && (
                  <div className="bg-black/40 border-t border-white/5 p-6 animate-fade-in">
                    <div className="space-y-3">
                      {notifications.filter(n => n.userId === u.id).length === 0 ? (
                        <div className="p-8 text-center glass rounded-2xl opacity-20 italic"><p className="text-[9px] uppercase font-black tracking-widest">Sin actividad comercial registrada</p></div>
                      ) : (
                        notifications.filter(n => n.userId === u.id).map(n => (
                          <div key={n.id} className="p-4 glass rounded-2xl border-white/5 flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${n.type === 'sent' || n.type === 'tax' ? 'bg-nova-crimson/10 text-nova-crimson' : 'bg-nova-gold/10 text-nova-gold'}`}><TrendingUp size={18} /></div>
                              <div>
                                <p className="text-[10px] font-black text-white uppercase italic">{n.title}</p>
                                <p className="text-[8px] font-mono text-white/20 mt-1 uppercase tracking-tighter">STATUS: {n.status}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className={`text-xs font-orbitron font-bold ${n.type === 'sent' || n.type === 'tax' ? 'text-nova-crimson' : 'text-nova-gold'}`}>{n.amount.toLocaleString()} NV</p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const NotificationsView = () => {
    const myNotifs = notifications.filter(n => n.userId === currentUser?.id);
    return (
      <div className="pb-32 pt-36 px-6 space-y-8 animate-fade-in max-lg mx-auto overflow-y-auto max-h-screen">
        <h1 className="text-2xl font-orbitron font-black text-white italic uppercase tracking-tighter italic">LOG DE <span className="text-nova-gold">MOVIMIENTOS</span></h1>
        <div className="space-y-5">
          {myNotifs.length === 0 ? (
            <div className="glass p-10 rounded-[2rem] text-center opacity-30 italic"><p className="text-[10px] uppercase font-black tracking-widest">Sin actividad registrada</p></div>
          ) : (
            myNotifs.map((notif) => (
              <div key={notif.id} className={`glass p-6 rounded-[2rem] border-white/5 space-y-4 shadow-xl border-l-2 transition-all ${notif.status === 'pending' ? 'border-nova-gold/50 opacity-80' : notif.status === 'rejected' ? 'border-nova-crimson opacity-60' : 'border-nova-emerald'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${notif.type === 'sent' || notif.type === 'tax' ? 'bg-nova-crimson/10 text-nova-crimson' : 'bg-nova-gold/10 text-nova-gold'}`}>
                      {notif.type === 'sent' || notif.type === 'tax' ? <TrendingDown size={18} /> : notif.type === 'pending_transfer' ? <Clock size={18} /> : <TrendingUp size={18} />}
                    </div>
                    <div className="flex flex-col leading-none">
                      <h4 className="text-[11px] font-black text-white uppercase italic">{notif.title}</h4>
                      <span className="text-[8px] font-mono text-white/40 mt-1">{notif.date}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-lg font-orbitron font-black ${notif.type === 'sent' || notif.type === 'tax' ? 'text-nova-crimson' : 'text-nova-gold'}`}>
                      {notif.type === 'sent' || notif.type === 'tax' ? '-' : '+'}{notif.amount.toLocaleString()} <span className="text-[10px]">NV</span>
                    </span>
                    <p className={`text-[7px] font-black uppercase tracking-widest mt-1 ${notif.status === 'pending' ? 'text-nova-gold' : notif.status === 'rejected' ? 'text-nova-crimson' : 'text-nova-emerald'}`}>{notif.status}</p>
                  </div>
                </div>
                {notif.status === 'pending' && (
                  <div className="px-4 py-2 bg-nova-gold/10 border border-nova-gold/20 rounded-xl">
                    <p className="text-[8px] text-nova-gold font-bold uppercase tracking-widest leading-relaxed">Operación en espera de acreditación central por el sistema operativo.</p>
                  </div>
                )}
                <div className="pt-3 border-t border-white/5 space-y-2">
                  <div className="flex flex-col text-[8px] font-mono text-white/40 gap-1 uppercase tracking-tighter">
                    <span className="text-nova-gold/60 font-black">REF: {notif.reference}</span>
                    {notif.type === 'sent' || notif.type === 'pending_transfer' ? (
                      <span className="flex justify-between">DESTINATARIO: <b className="text-white/60">{notif.targetUserId}</b></span>
                    ) : (
                      <span className="flex justify-between">ORIGEN: <b className="text-white/60">{notif.senderName || 'Sistema STX'}</b></span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  const ProfileView = () => (
    <div className="pb-32 pt-36 px-6 space-y-8 animate-fade-in max-w-lg mx-auto overflow-y-auto">
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="w-32 h-32 bg-white/5 rounded-[3rem] flex items-center justify-center border-2 border-nova-gold/20 shadow-2xl relative">
          <UserIcon size={56} className="text-nova-gold" />
          <div className="absolute inset-0 bg-nova-gold/5 rounded-[3rem] animate-pulse"></div>
        </div>
        <div className="space-y-1">
          <h2 className="text-3xl font-orbitron font-black text-white uppercase tracking-tighter italic leading-none flex items-center justify-center">
            {currentUser?.firstName} <span className="text-nova-gold ml-2">{currentUser?.lastName}</span>
            {isUserAdmin(currentUser?.id) && <VerificationBadge />}
          </h2>
          <div className="flex items-center justify-center gap-2 pt-1"><div className="w-2 h-2 rounded-full bg-nova-emerald animate-pulse"></div><span className="text-[10px] text-nova-titanium font-bold uppercase tracking-[0.3em]">Protocolo Ghost Activo</span></div>
        </div>
      </div>

      <div className="grid gap-4">
        {isUserAdmin(currentUser?.id) && (
          <button onClick={() => { playHaptic(); setView(AppView.ADMIN_PANEL); setActiveTab(AppView.ADMIN_PANEL); }} className="w-full py-6 glass rounded-3xl border border-nova-gold/20 flex flex-col items-center justify-center gap-2 text-nova-gold active:scale-95 transition-all shadow-[0_0_30px_rgba(234,179,8,0.1)] group overflow-hidden relative">
            <div className="absolute inset-0 bg-nova-gold/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <ShieldAlert size={28} className="animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.5em] italic">INGRESAR PANEL GHOST</span>
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-transform group-hover:rotate-45"><Lock size={40} /></div>
          </button>
        )}

        <div className="flex items-center justify-between px-2"><h3 className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em]">Datos de Identidad</h3><ShieldCheck size={14} className="text-nova-gold/30" /></div>
        <div className="grid grid-cols-2 gap-4">
          <div className="glass p-5 rounded-2xl border-white/5 space-y-1"><span className="text-[8px] text-nova-gold/40 font-black uppercase tracking-widest">ID Sistema</span><p className="text-sm font-mono font-bold text-white">{currentUser?.id}</p></div>
          <div className="glass p-5 rounded-2xl border-white/5 space-y-1"><span className="text-[8px] text-nova-gold/40 font-black uppercase tracking-widest">Región</span><p className="text-sm font-bold text-white uppercase">{currentUser?.country}</p></div>
          <div className="glass p-5 rounded-2xl border-white/5 space-y-1"><span className="text-[8px] text-nova-gold/40 font-black uppercase tracking-widest">Contacto</span><p className="text-sm font-bold text-white">+{currentUser?.phone}</p></div>
          <div className="glass p-5 rounded-2xl border-white/5 space-y-1"><span className="text-[8px] text-nova-gold/40 font-black uppercase tracking-widest">Desde</span><p className="text-sm font-bold text-white uppercase">{new Date(currentUser?.createdAt || '').toLocaleDateString('es-ES', { month: 'short', year: 'numeric' })}</p></div>
        </div>
      </div>

      <button onClick={() => { playHaptic(); localStorage.removeItem('STX_SESSION_KEY'); setCurrentUser(null); setView(AppView.HOME); }} className="w-full py-5 bg-nova-crimson/10 rounded-[2rem] flex items-center justify-center gap-3 text-nova-crimson border border-nova-crimson/20 active:scale-95 transition-all uppercase tracking-[0.3em] font-black text-[10px] mt-6 shadow-lg shadow-nova-crimson/10"><LogOut size={18} /> Finalizar Protocolo de Sesión</button>
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
          setCurrentUser(updated);
        } else { setCurrentUser(user); }
        localStorage.setItem('STX_SESSION_KEY', user.id);
        setView(AppView.DASHBOARD);
        setActiveTab(AppView.DASHBOARD);
      } else { alert("Acceso Denegado: Credenciales inválidas."); }
    };
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-nova-obsidian">
        <button onClick={() => setView(AppView.HOME)} className="absolute top-12 left-8 w-12 h-12 glass rounded-full flex items-center justify-center text-white active:scale-90 transition-all border border-white/5 shadow-xl"><ArrowLeft size={20} /></button>
        <div className="w-full max-w-sm space-y-12 animate-fade-in">
          <div className="text-center space-y-2"><h1 className="text-3xl font-orbitron font-black text-white uppercase italic leading-none">ACCESO <span className="text-nova-gold">SEGURO</span></h1><p className="text-[10px] text-nova-titanium font-bold uppercase tracking-[0.4em] leading-none">Protocolo Ghost Autorizado</p></div>
          <form onSubmit={handleLogin} className="space-y-5">
            <input value={idInput} onChange={e => setIdInput(e.target.value)} className="w-full bg-black/40 border border-white/5 p-5 rounded-2xl text-white outline-none focus:border-nova-gold/50 text-sm font-mono shadow-inner" placeholder="ID O EMAIL" required />
            <input type="password" value={passInput} onChange={e => setPassInput(e.target.value)} className="w-full bg-black/40 border border-white/5 p-5 rounded-2xl text-white outline-none focus:border-nova-gold/50 text-sm font-mono shadow-inner" placeholder="PASSWORD" required />
            <button type="submit" className="w-full py-5 bg-white text-nova-obsidian font-orbitron font-black text-sm rounded-2xl shadow-2xl active:scale-95 transition-all uppercase tracking-widest mt-4">Autorizar Acceso</button>
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
      const newUser: User = { ...formData, id: newId, balance: 0, savingsBalance: 0, status: 'active', createdAt: new Date().toISOString(), hasSeenWelcomeCredit: false, lastTaxMonth: '' };
      setUsers(prev => {
        const updated = [...prev, newUser];
        localStorage.setItem(DB_KEY, JSON.stringify(updated));
        return updated;
      });
      const subject = `Protocolo STX - Nuevo Registro de Membresía - ID: ${newId}`;
      const body = `SISTEMA SPACEBANK - NUEVO REGISTRO DE MEMBRESÍA\n\nID ASIGNADO: ${newId}\nNOMBRE COMPLETO: ${formData.firstName} ${formData.lastName}\nEMAIL: ${formData.email}\n---------------------------------------------\nESTADO: PENDIENTE DE VALIDACIÓN CENTRAL`;
      alert(`REGISTRO INICIADO. TU ID ES: ${newId}. SE ABRIRÁ GMAIL PARA FINALIZAR TU SOLICITUD.`);
      window.location.href = `mailto:${SOPORTE_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      setView(AppView.LOGIN);
    };
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-nova-obsidian overflow-y-auto py-24">
        <button onClick={() => setView(AppView.HOME)} className="absolute top-12 left-8 w-12 h-12 glass rounded-full flex items-center justify-center text-white active:scale-90 transition-all border border-white/5 shadow-xl"><ArrowLeft size={20} /></button>
        <div className="w-full max-w-sm space-y-10 animate-fade-in">
          <div className="text-center space-y-2"><h1 className="text-3xl font-orbitron font-black text-white uppercase italic leading-none">REGISTRO <span className="text-nova-gold">NOVA</span></h1><p className="text-[10px] text-nova-titanium uppercase tracking-widest font-black">Elite Membership Application</p></div>
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input placeholder="NOMBRE" className="w-full bg-black/40 border border-white/5 p-4 rounded-xl text-white outline-none text-xs" required onChange={e => setFormData({...formData, firstName: e.target.value})} />
              <input placeholder="APELLIDO" className="w-full bg-black/40 border border-white/5 p-4 rounded-xl text-white outline-none text-xs" required onChange={e => setFormData({...formData, lastName: e.target.value})} />
            </div>
            <input placeholder="PAÍS" className="w-full bg-black/40 border border-white/5 p-4 rounded-xl text-white outline-none text-xs" required onChange={e => setFormData({...formData, country: e.target.value})} />
            <input placeholder="TELÉFONO" className="w-full bg-black/40 border border-white/5 p-4 rounded-xl text-white outline-none text-xs" required onChange={e => setFormData({...formData, phone: e.target.value})} />
            <input type="email" placeholder="EMAIL" className="w-full bg-black/40 border border-white/5 p-4 rounded-xl text-white outline-none text-xs" required onChange={e => setFormData({...formData, email: e.target.value})} />
            <input type="password" placeholder="CONTRASEÑA" className="w-full bg-black/40 border border-white/5 p-4 rounded-xl text-white outline-none text-xs" required onChange={e => setFormData({...formData, password: e.target.value})} />
            <button type="submit" className="w-full py-5 bg-white text-nova-obsidian font-orbitron font-black text-sm rounded-2xl uppercase tracking-widest mt-4 active:scale-95 shadow-xl">Generar Perfil</button>
          </form>
        </div>
      </div>
    );
  };

  const BottomDockComp = () => (
    <nav className="fixed bottom-0 left-0 right-0 z-[110] px-6 pb-8 pt-4 glass border-t border-white/5 rounded-t-[3rem] shadow-[0_-15px_50px_rgba(0,0,0,0.5)]">
      <div className="max-w-md mx-auto flex justify-between items-center px-6">
        {[
          { key: 'DASHBOARD', icon: <LayoutDashboard size={22} />, label: 'Inicio' },
          { key: 'SPACEBANK', icon: <Wallet size={22} />, label: 'Bank' },
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
      {[AppView.DASHBOARD, AppView.SPACEBANK, AppView.NOTIFICATIONS, AppView.PROFILE, AppView.ADMIN_PANEL].includes(view) && (
        <>
          <header className="fixed top-0 left-0 right-0 z-[100] bg-nova-obsidian/95 backdrop-blur-2xl border-b border-white/5 px-6 pt-10 pb-6 shadow-2xl">
            <div className="max-w-lg mx-auto flex justify-between items-center">
              <div className="flex flex-col">
                <h2 className="font-orbitron font-black text-2xl italic tracking-tighter uppercase leading-none flex items-center">
                  SPACE<span className="text-nova-gold">TRAMOYA</span>
                  {view === AppView.ADMIN_PANEL && <span className="text-[10px] ml-2 text-white/40 bg-white/5 px-2 py-1 rounded-lg">GHOST_PANEL</span>}
                </h2>
                <div className="flex items-center gap-2 mt-2">
                  <RealTimeClock />
                  <div className="w-1 h-1 rounded-full bg-nova-gold/40"></div>
                  <div className="flex items-center gap-1">
                    <span className="text-[8px] text-nova-gold/60 font-black uppercase tracking-[0.3em] font-orbitron">STX: {currentUser?.firstName}</span>
                    {isUserAdmin(currentUser?.id) && <VerificationBadge />}
                  </div>
                </div>
              </div>
              <div className="w-12 h-12 glass rounded-2xl flex items-center justify-center border-nova-gold/10 shadow-lg group active:scale-90 transition-all">
                <img src={BANK_LOGO} className="w-8 h-8 object-contain drop-shadow-[0_0_5px_gold] group-hover:rotate-12 transition-transform" />
              </div>
            </div>
          </header>
          <main className="animate-fade-in relative z-10">
            {view === AppView.DASHBOARD && <DashboardView />}
            {view === AppView.SPACEBANK && <SpaceBankView />}
            {view === AppView.NOTIFICATIONS && <NotificationsView />}
            {view === AppView.PROFILE && <ProfileView />}
            {view === AppView.ADMIN_PANEL && <AdminPanelView />}
          </main>
          <BottomDockComp />
        </>
      )}
      <style>{`
        .animate-fade-in { animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; } 
        .animate-float { animation: float 4s ease-in-out infinite; } 
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } } 
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } } 
      `}</style>
    </div>
  );
};

export default App;
