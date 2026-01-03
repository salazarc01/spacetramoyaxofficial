
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
  UserCheck
} from 'lucide-react';
import { AppView, User, Transaction, Notification } from './types';
import jsQR from 'https://esm.sh/jsqr@1.4.0';

// INTERRUPTOR DE MODO AÑO NUEVO (DESACTIVADO)
const IS_NEW_YEAR_MODE = false;

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
  const [searchQuery, setSearchQuery] = useState('');

  // Helper for generating Account Number (same logic as Credit Card)
  const getAccountNumber = (id: string) => {
    const base = "4532" + id.padStart(4, '0') + "90870908";
    return base.match(/.{1,4}/g)?.join(' ') || "4532 0000 9087 0908";
  };

  // Inicialización de base de datos V16
  useEffect(() => {
    const savedUsers = localStorage.getItem('STX_DB_FINAL_USERS_V16');
    const savedTx = localStorage.getItem('STX_DB_FINAL_TX_V16');
    const savedNotif = localStorage.getItem('STX_DB_FINAL_NOTIF_V16');

    const bonusDate = "2026-01-02T17:05:00.000Z";
    const orgCreditDate = new Date().toISOString();
    
    const initialUsers: User[] = [
      {
        id: '0001',
        firstName: 'Luis',
        lastName: 'Alejandro',
        country: 'Venezuela',
        phone: '584121351217',
        email: `luis0001${CORPORATE_DOMAIN}`,
        password: 'v9451679',
        balance: 80100,
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
        balance: 5100,
        status: 'active',
        createdAt: new Date().toISOString()
      },
      {
        id: '0003',
        firstName: 'Alex',
        lastName: 'Duarte',
        country: 'Honduras',
        phone: '50489887690',
        email: `alex.504${CORPORATE_DOMAIN}`,
        password: 'copito.123',
        balance: 1300,
        status: 'active',
        createdAt: new Date().toISOString()
      },
      {
        id: '0004',
        firstName: 'Rebecca',
        lastName: 'Tramoya',
        country: 'Venezuela',
        phone: '584123151217',
        email: `rebbeccat${CORPORATE_DOMAIN}`,
        password: 'v9451679',
        balance: 500110,
        status: 'active',
        createdAt: new Date().toISOString()
      }
    ];

    const initialNotifs: Notification[] = [
      ...initialUsers.map(u => ({
        id: `bonus-2026-${u.id}`,
        userId: u.id,
        title: 'BIENVENIDO A SPACE TRAMOYA X',
        message: 'Regalo especial de inicio para los miembros de la familia STX.',
        amount: 100,
        date: bonusDate,
        isBonus: true,
        imageUrl: BANK_LOGO
      })),
      {
        id: 'org-credit-0001-v16',
        userId: '0001',
        title: 'CRÉDITO DE ORGANIZACIÓN',
        message: 'Abono especial de parte de la organización de SpaceTramoya X y la Casa de la Tramoya.',
        amount: 70000,
        date: orgCreditDate,
        isBonus: true,
        imageUrl: BANK_LOGO
      },
      {
        id: 'org-credit-0002-v16',
        userId: '0002',
        title: 'CRÉDITO DE ORGANIZACIÓN',
        message: 'Abono especial de parte de la organización de SpaceTramoya X y la Casa de la Tramoya.',
        amount: 5000,
        date: orgCreditDate,
        isBonus: true,
        imageUrl: BANK_LOGO
      }
    ];

    setUsers(savedUsers ? JSON.parse(savedUsers) : initialUsers);
    setTransactions(savedTx ? JSON.parse(savedTx) : []);
    setNotifications(savedNotif ? JSON.parse(savedNotif) : initialNotifs);
  }, []);

  useEffect(() => {
    if (users.length > 0) {
      localStorage.setItem('STX_DB_FINAL_USERS_V16', JSON.stringify(users));
    }
    localStorage.setItem('STX_DB_FINAL_TX_V16', JSON.stringify(transactions));
    localStorage.setItem('STX_DB_FINAL_NOTIF_V16', JSON.stringify(notifications));
  }, [users, transactions, notifications]);

  const addNotification = (userId: string, title: string, message: string, amount?: number, isBonus: boolean = false, imageUrl?: string) => {
    const newNotif: Notification = {
      id: Math.random().toString(36).substr(2, 9),
      userId,
      title,
      message,
      amount,
      date: new Date().toISOString(),
      isBonus,
      imageUrl
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const handleAdminSendFunds = (userId: string, amount: number, reason: string, isBonus: boolean = false) => {
    const ref = Array.from({ length: 20 }, () => Math.floor(Math.random() * 10)).join('');
    const user = users.find(u => u.id === userId);
    
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, balance: u.balance + amount } : u));

    const newTx: Transaction = {
      id: ref,
      fromId: 'ADMIN',
      fromName: 'SpaceTramoya X Admin',
      toId: userId,
      toName: user?.firstName || 'Usuario',
      amount,
      reason: isBonus ? `Crédito STX: ${reason}` : reason,
      date: new Date().toISOString(),
      type: isBonus ? 'bonus' : 'credit'
    };
    setTransactions(prev => [newTx, ...prev]);

    addNotification(
      userId, 
      reason, 
      `Abono de ${amount} NV procesado.`, 
      amount,
      isBonus,
      BANK_LOGO
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

  const UserAvatar = ({ user, size = "large" }: { user: User, size?: "small" | "large" }) => {
    const initials = `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    const containerClasses = size === "large" 
      ? "w-24 h-24 sm:w-32 sm:h-32 rounded-[24px] text-3xl sm:text-5xl" 
      : "w-12 h-12 rounded-xl text-lg";
    
    return (
      <div className={`${containerClasses} bg-gradient-to-br from-space-purple/30 to-space-blue/30 border border-white/20 flex items-center justify-center shrink-0 shadow-inner`}>
        <span className="font-orbitron font-black text-white italic tracking-tighter drop-shadow-lg">
          {initials}
        </span>
      </div>
    );
  };

  const CreditCard = ({ user }: { user: User }) => {
    const cardNumber = useMemo(() => getAccountNumber(user.id), [user.id]);
    const expiryDate = useMemo(() => {
      const created = new Date(user.createdAt);
      const year = created.getFullYear() + 2;
      const month = (created.getMonth() + 1).toString().padStart(2, '0');
      return `${month}/${year.toString().slice(-2)}`;
    }, [user.createdAt]);

    return (
      <div className="relative w-full max-w-[380px] h-[220px] mx-auto rounded-[24px] overflow-hidden shadow-2xl transition-transform hover:scale-[1.02] duration-500 group border border-white/20">
        <div className="absolute inset-0 bg-gradient-to-br from-space-purple via-space-blue to-space-cyan group-hover:hue-rotate-15 transition-all duration-700"></div>
        <div className="absolute inset-0 bg-white/5 backdrop-blur-[2px]"></div>
        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)`,
          backgroundSize: '24px 24px'
        }}></div>
        <div className="relative h-full p-6 flex flex-col justify-between text-white font-orbitron">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center border border-white/20">
                <span className="font-black italic text-sm">X</span>
              </div>
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase opacity-80">Space Bank</span>
            </div>
            <div className="w-12 h-9 bg-gradient-to-br from-yellow-300 via-yellow-600 to-yellow-400 rounded-lg shadow-inner flex items-center justify-center relative overflow-hidden">
               <div className="absolute inset-0 opacity-40 border border-black/10"></div>
               <div className="w-full h-[1px] bg-black/20 absolute top-1/4"></div>
               <div className="w-full h-[1px] bg-black/20 absolute top-1/2"></div>
               <div className="w-full h-[1px] bg-black/20 absolute top-3/4"></div>
               <div className="h-full w-[1px] bg-black/20 absolute left-1/2"></div>
               <Cpu size={20} className="text-black/30 z-10" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-xl sm:text-2xl font-black tracking-[0.15em] drop-shadow-md">
              {cardNumber}
            </p>
          </div>
          <div className="flex justify-between items-end">
            <div className="flex flex-col">
              <span className="text-[8px] uppercase opacity-50 mb-1">Card Holder</span>
              <p className="text-xs sm:text-sm font-bold tracking-wider uppercase italic">
                {user.firstName} {user.lastName}
              </p>
            </div>
            <div className="flex flex-col text-right">
              <span className="text-[8px] uppercase opacity-50 mb-1">Expires</span>
              <p className="text-xs sm:text-sm font-bold tracking-wider uppercase">
                {expiryDate}
              </p>
            </div>
          </div>
        </div>
        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/20 blur-[40px] rounded-full pointer-events-none"></div>
      </div>
    );
  };

  const QRScannerModal = ({ isOpen, onClose, onScan }: { isOpen: boolean, onClose: () => void, onScan: (data: any) => void }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [hasError, setHasError] = useState(false);
    const requestRef = useRef<number>();

    const scan = () => {
      if (videoRef.current && canvasRef.current) {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d', { willReadFrequently: true });

        if (video.readyState === video.HAVE_ENOUGH_DATA && context) {
          canvas.height = video.videoHeight;
          canvas.width = video.videoWidth;
          context.drawImage(video, 0, 0, canvas.width, canvas.height);
          const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: "dontInvert",
          });

          if (code) {
            try {
              const data = JSON.parse(code.data);
              if (data.app === 'STX_BANK') {
                onScan(data);
                return; // Stop scanning after find
              }
            } catch (e) {
              // Not a valid STX QR
            }
          }
        }
      }
      requestRef.current = requestAnimationFrame(scan);
    };

    useEffect(() => {
      if (!isOpen) {
        if (requestRef.current) cancelAnimationFrame(requestRef.current);
        return;
      }
      let stream: MediaStream | null = null;
      
      const startCamera = async () => {
        try {
          stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.setAttribute("playsinline", "true");
            videoRef.current.play();
            requestRef.current = requestAnimationFrame(scan);
          }
        } catch (err) {
          console.error("Camera error:", err);
          setHasError(true);
        }
      };

      startCamera();

      return () => {
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
        }
        if (requestRef.current) cancelAnimationFrame(requestRef.current);
      };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 z-[100] bg-space-deep flex flex-col items-center justify-center p-6 animate-fade-in">
        <button onClick={onClose} className="absolute top-8 right-8 p-3 bg-white/10 rounded-full text-white">
          <X size={24} />
        </button>
        <div className="w-full max-w-md aspect-square bg-black rounded-3xl overflow-hidden relative border-2 border-space-cyan shadow-[0_0_50px_rgba(6,182,212,0.3)]">
          {hasError ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 text-white/60 font-orbitron">
              <ShieldAlert size={48} className="text-red-500 mb-4" />
              <p className="text-sm">ERROR DE CÁMARA</p>
              <p className="text-[10px] uppercase mt-2">Por favor otorga permisos o usa un navegador compatible.</p>
            </div>
          ) : (
            <video ref={videoRef} className="w-full h-full object-cover" muted />
          )}
          <canvas ref={canvasRef} className="hidden" />
          <div className="absolute inset-0 border-[60px] border-black/40 pointer-events-none"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-2 border-space-cyan rounded-2xl">
             <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-space-cyan -ml-1 -mt-1"></div>
             <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-space-cyan -mr-1 -mt-1"></div>
             <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-space-cyan -ml-1 -mb-1"></div>
             <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-space-cyan -mr-1 -mb-1"></div>
             <div className="absolute top-0 left-0 w-full h-1 bg-space-cyan/50 animate-scan"></div>
          </div>
        </div>
        <div className="mt-8 text-center space-y-2">
           <h3 className="font-orbitron font-black text-2xl text-white italic uppercase tracking-tighter">Pago Rápido</h3>
           <p className="text-xs text-space-cyan font-bold uppercase tracking-widest">Escaneando código oficial STX...</p>
        </div>
        <style>{`
          @keyframes scan { 0% { top: 0; } 100% { top: 100%; } }
          .animate-scan { animation: scan 2s linear infinite; position: absolute; }
        `}</style>
      </div>
    );
  };

  const SpaceBankView = () => {
    const [receiverId, setReceiverId] = useState('');
    const [amount, setAmount] = useState('');
    const [reason, setReason] = useState('');
    const [tab, setTab] = useState<'send' | 'history' | 'tools'>('tools');
    const [isScannerOpen, setIsScannerOpen] = useState(false);
    const [scannedData, setScannedData] = useState<any>(null);
    
    const receiver = users.find(u => u.id === receiverId);
    const numAmount = Number(amount);
    const currentBalance = currentUser?.balance || 0;
    const balanceAfter = currentBalance - numAmount;
    const userTxs = transactions.filter(t => t.fromId === currentUser?.id || t.toId === currentUser?.id);

    // Official Account Data QR
    const accountData = {
      app: 'STX_BANK',
      id: currentUser?.id,
      firstName: currentUser?.firstName,
      lastName: currentUser?.lastName,
      acc: getAccountNumber(currentUser?.id || '')
    };
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(JSON.stringify(accountData))}`;

    const handleTransferRequest = () => {
      if (!receiver) return alert('ID de receptor no válido.');
      if (numAmount <= 0) return alert('Ingresa un monto válido.');
      if (numAmount > currentBalance) return alert('Saldo insuficiente.');

      const ref = Array.from({ length: 20 }, () => Math.floor(Math.random() * 10)).join('');
      const mailBody = `--- SOLICITUD DE TRANSFERENCIA ---
REF: ${ref}
DE: ${currentUser?.firstName} (ID: ${currentUser?.id})
A: ${receiver.firstName} ${receiver.lastName} (ID: ${receiverId})
CUENTA DESTINO: ${getAccountNumber(receiverId)}
MONTO: ${numAmount} NV
MOTIVO: ${reason || 'Sin motivo'}
SALDO DISPONIBLE: ${currentBalance} NV
SALDO TRAS TRANSFERENCIA: ${balanceAfter} NV`;

      window.location.href = `mailto:${OFFICIAL_EMAIL}?subject=TRANSFERENCIA STX REF ${ref.slice(-4)}&body=${encodeURIComponent(mailBody)}`;
    };

    const shareByEmail = () => {
      const body = `Hola, este es mi código oficial de cuenta SpaceTramoya X para transferencias rápidas.\n\nNombre: ${currentUser?.firstName} ${currentUser?.lastName}\nID: ${currentUser?.id}\nCuenta: ${getAccountNumber(currentUser?.id || '')}\nEnlace QR: ${qrUrl}`;
      window.location.href = `mailto:?subject=Mi Código STX - ${currentUser?.firstName}&body=${encodeURIComponent(body)}`;
    };

    const shareByWhatsapp = () => {
      const text = `Hola, este es mi código oficial de cuenta SpaceTramoya X.\n\n👤 *${currentUser?.firstName} ${currentUser?.lastName}*\n🆔 ID: *${currentUser?.id}*\n💳 Cuenta: *${getAccountNumber(currentUser?.id || '')}*\n\nUsa el scanner de Pago Rápido para transferirme.\nEnlace QR: ${qrUrl}`;
      window.location.href = `https://wa.me/?text=${encodeURIComponent(text)}`;
    };

    return (
      <div className="space-y-6 sm:space-y-8 animate-fade-in w-full">
        <BackButton to={AppView.DASHBOARD} />
        <QRScannerModal isOpen={isScannerOpen} onClose={() => setIsScannerOpen(false)} onScan={(data) => {
          setReceiverId(data.id);
          setScannedData(data);
          setIsScannerOpen(false);
          setTab('send');
        }} />
        
        <div className="space-y-8">
          {currentUser && <CreditCard user={currentUser} />}

          <div className="p-6 sm:p-10 bg-gradient-to-br from-space-deep to-space-blue/30 rounded-3xl sm:rounded-[40px] border border-white/10 flex flex-col sm:flex-row justify-between items-center gap-6 shadow-2xl text-white relative overflow-hidden">
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-center sm:text-left">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#02020a] border border-white/5 rounded-xl p-2 flex items-center justify-center">
                 <img src={BANK_LOGO} className="w-full h-full object-contain" alt="Logo" />
              </div>
              <div>
                 <h2 className="text-2xl sm:text-3xl font-orbitron font-black italic uppercase">Space Bank</h2>
                 <p className="text-[10px] text-space-cyan tracking-widest uppercase font-orbitron mt-1">Saldos STX</p>
              </div>
            </div>
            <div className="text-center sm:text-right">
              <p className="text-[10px] opacity-40 uppercase font-orbitron tracking-widest">Disponible</p>
              <p className="text-4xl sm:text-5xl font-orbitron font-black">{currentBalance} <span className="text-lg text-space-cyan">NV</span></p>
            </div>
          </div>
        </div>

        <div className="flex gap-2 bg-white/5 p-1.5 rounded-2xl border border-white/5">
          <button onClick={() => setTab('tools')} className={`flex-1 py-4 font-orbitron font-bold rounded-xl transition-all ${tab === 'tools' ? 'bg-space-cyan text-space-deep shadow-lg' : 'text-white/40'}`}>OPCIONES</button>
          <button onClick={() => setTab('send')} className={`flex-1 py-4 font-orbitron font-bold rounded-xl transition-all ${tab === 'send' ? 'bg-space-cyan text-space-deep shadow-lg' : 'text-white/40'}`}>ENVIAR</button>
          <button onClick={() => setTab('history')} className={`flex-1 py-4 font-orbitron font-bold rounded-xl transition-all ${tab === 'history' ? 'bg-space-cyan text-space-deep shadow-lg' : 'text-white/40'}`}>HISTORIAL</button>
        </div>

        {tab === 'tools' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
            {/* Mi Código QR */}
            <div className="p-8 bg-white/5 border border-white/10 rounded-3xl flex flex-col items-center gap-6 text-center">
               <div className="w-48 h-48 bg-white p-4 rounded-3xl shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                  <img src={qrUrl} className="w-full h-full" alt="QR Cuenta" />
               </div>
               <div>
                  <h3 className="font-orbitron font-black text-xl text-white uppercase italic">Mi Código STX</h3>
                  <p className="text-[10px] text-space-cyan font-bold uppercase mt-1 tracking-widest">Contiene ID y Cuenta</p>
               </div>
               <div className="flex gap-4 w-full">
                  <button onClick={shareByWhatsapp} className="flex-1 py-3 bg-green-500/20 text-green-400 border border-green-500/20 rounded-xl text-xs font-orbitron font-bold flex items-center justify-center gap-2 hover:bg-green-500/30 transition-all">
                     <Share2 size={14} /> WhatsApp
                  </button>
                  <button onClick={shareByEmail} className="flex-1 py-3 bg-blue-500/20 text-blue-400 border border-blue-500/20 rounded-xl text-xs font-orbitron font-bold flex items-center justify-center gap-2 hover:bg-blue-500/30 transition-all">
                     <Mail size={14} /> Gmail
                  </button>
               </div>
            </div>

            {/* Pago Rápido Scanner */}
            <div className="p-8 bg-gradient-to-br from-space-cyan/10 to-transparent border border-space-cyan/20 rounded-3xl flex flex-col justify-between gap-8 group">
               <div className="space-y-4">
                  <div className="w-16 h-16 bg-space-cyan/20 rounded-2xl flex items-center justify-center border border-space-cyan/20 group-hover:scale-110 transition-transform">
                     <Camera className="text-space-cyan" size={32} />
                  </div>
                  <div className="text-left">
                     <h3 className="font-orbitron font-black text-2xl text-white uppercase italic tracking-tighter leading-none">Pago Rápido</h3>
                     <p className="text-xs text-space-cyan/60 font-medium mt-3 leading-relaxed">Escanea cualquier código QR oficial STX. Reconocimiento automático de nombre, apellido, ID y número de cuenta.</p>
                  </div>
               </div>
               <button onClick={() => setIsScannerOpen(true)} className="w-full py-5 bg-space-cyan text-space-deep font-orbitron font-black text-lg rounded-2xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3">
                 <Maximize size={20} /> INICIAR ESCÁNER
               </button>
            </div>
          </div>
        )}

        {tab === 'send' && (
          <div className="max-w-md mx-auto bg-white/5 p-6 sm:p-10 rounded-3xl border border-white/10 shadow-2xl text-white space-y-4 animate-fade-in">
            <div className="flex justify-between items-center mb-2 px-2">
               <h3 className="text-xs font-orbitron font-bold text-space-cyan uppercase tracking-widest">Nueva Transferencia</h3>
               <button onClick={() => { setScannedData(null); setIsScannerOpen(true); }} className="text-[10px] font-orbitron flex items-center gap-2 text-white/40 hover:text-space-cyan transition-colors">
                  <Camera size={14} /> USAR ESCÁNER
               </button>
            </div>
            
            {scannedData ? (
               <div className="p-4 bg-space-cyan/10 border border-space-cyan/30 rounded-2xl space-y-3 animate-fade-in">
                  <div className="flex justify-between items-start">
                     <div>
                        <p className="text-[8px] uppercase font-orbitron text-space-cyan tracking-widest">Destinatario Escaneado</p>
                        <p className="font-orbitron font-black text-lg italic uppercase">{scannedData.firstName} {scannedData.lastName}</p>
                     </div>
                     <UserCheck className="text-space-cyan" size={20} />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                     <div>
                        <p className="text-[7px] uppercase font-orbitron opacity-50">ID Usuario</p>
                        <p className="text-xs font-mono font-bold text-white/80">{scannedData.id}</p>
                     </div>
                     <div>
                        <p className="text-[7px] uppercase font-orbitron opacity-50">N° de Cuenta</p>
                        <p className="text-xs font-mono font-bold text-white/80">{scannedData.acc.slice(-9)}</p>
                     </div>
                  </div>
                  <button onClick={() => { setScannedData(null); setReceiverId(''); }} className="w-full py-1 text-[8px] font-orbitron uppercase text-white/30 hover:text-red-400 transition-colors">Cambiar destino</button>
               </div>
            ) : (
               <div className="space-y-2">
                <label className="text-[10px] text-white/30 uppercase font-orbitron ml-2">ID Receptor</label>
                <input value={receiverId} onChange={(e) => setReceiverId(e.target.value)} className="w-full bg-space-deep border border-white/10 p-4 rounded-xl text-white outline-none focus:border-space-cyan transition-all" placeholder="ID (Ej: 0002)" />
                {receiverId && (
                  <p className={`text-[10px] font-bold uppercase italic ml-2 ${receiver ? 'text-green-400' : 'text-red-400'}`}>
                    {receiver ? `DESTINO: ${receiver.firstName} ${receiver.lastName}` : "ID NO RECONOCIDO"}
                  </p>
                )}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] text-white/30 uppercase font-orbitron ml-2">Monto NV</label>
              <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full bg-space-deep border border-white/10 p-4 rounded-xl text-white outline-none font-orbitron focus:border-space-cyan" placeholder="0.00" />
              {numAmount > 0 && (
                <div className="mt-2 p-3 bg-white/5 rounded-xl border border-white/5 flex flex-col gap-1">
                  <p className="text-[10px] opacity-40 uppercase font-orbitron flex justify-between">
                    Disponible: <span className="text-white">{currentBalance} NV</span>
                  </p>
                  <p className={`text-[10px] uppercase font-orbitron flex justify-between font-bold ${balanceAfter < 0 ? 'text-red-400' : 'text-space-cyan'}`}>
                    Tras transferencia: <span>{balanceAfter} NV</span>
                  </p>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-[10px] text-white/30 uppercase font-orbitron ml-2">Motivo de transferencia</label>
              <input value={reason} onChange={(e) => setReason(e.target.value)} className="w-full bg-space-deep border border-white/10 p-4 rounded-xl text-white outline-none focus:border-space-cyan transition-all" placeholder="Ej: Pago de servicio" />
            </div>
            <button disabled={!receiver || numAmount <= 0 || balanceAfter < 0} onClick={handleTransferRequest} className="w-full py-5 bg-gradient-to-r from-space-purple to-space-blue rounded-xl font-orbitron font-black text-lg active:scale-95 disabled:opacity-20 shadow-lg">ENVIAR SOLICITUD GMAIL</button>
          </div>
        )}

        {tab === 'history' && (
          <div className="space-y-4 animate-fade-in">
            <input className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white outline-none focus:border-space-cyan" placeholder="Buscar por REF (4 últimos)..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            <div className="space-y-3">
              {userTxs.filter(t => t.id.endsWith(searchQuery)).length === 0 ? (
                <div className="text-center py-20 opacity-20 font-orbitron uppercase text-xs tracking-widest">Sin movimientos registrados</div>
              ) : (
                userTxs.filter(t => t.id.endsWith(searchQuery)).map(t => (
                  <div key={t.id} className="p-5 bg-white/5 border border-white/10 rounded-3xl flex justify-between items-center text-white">
                    <div className="flex gap-4 items-center">
                       <div className={`p-3 rounded-full ${t.toId === currentUser?.id ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                          {t.toId === currentUser?.id ? <ArrowDownCircle className="text-green-400" /> : <ArrowUpCircle className="text-red-400" />}
                       </div>
                       <div>
                        <p className="text-[9px] opacity-30 font-mono tracking-widest uppercase">REF: ...{t.id.slice(-4)}</p>
                        <p className="font-bold text-sm">{t.toId === currentUser?.id ? `RECIBIDO DE: ${t.fromName}` : `ENVIADO A: ${t.toName}`}</p>
                       </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-orbitron font-black text-lg ${t.toId === currentUser?.id ? 'text-green-400' : 'text-red-400'}`}>
                        {t.toId === currentUser?.id ? '+' : '-'}{t.amount}
                      </p>
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
    <div className="min-h-screen bg-space-deep font-inter text-slate-100 overflow-x-hidden">
      <Header />
      <main className="pt-20 sm:pt-24 px-4 pb-12 w-full max-w-4xl mx-auto relative z-10">
        {view === AppView.HOME && (
          <div className="flex flex-col items-center justify-center min-h-[75vh] text-center space-y-8 animate-fade-in relative">
            <div className="w-32 h-32 sm:w-48 sm:h-48 relative z-10 animate-pulse transition-all duration-1000">
               <img src={BANK_LOGO} className="w-full h-full object-contain" alt="STX Logo" />
            </div>

            <div className="relative z-10">
              <div className="absolute inset-0 blur-3xl bg-space-purple/30 rounded-full scale-150"></div>
              <h1 className="relative font-orbitron text-5xl sm:text-7xl font-black italic tracking-tighter text-white uppercase leading-tight">
                SPACE<span className="text-space-cyan block sm:inline">TRAMOYA</span> X
              </h1>
            </div>
            
            <p className="text-lg sm:text-xl text-slate-300 max-w-xl mx-auto relative z-10">
              La familia más exclusiva del entretenimiento y la tramoya digital.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto relative z-10">
              <button onClick={() => setView(AppView.REGISTER)} className="w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-space-purple to-space-blue rounded-full font-orbitron font-bold text-lg shadow-xl hover:scale-105 transition-all text-white">
                INSCRIBIRME
              </button>
              <button onClick={() => setView(AppView.LOGIN)} className="w-full sm:w-auto px-10 py-4 bg-white/5 border border-white/20 rounded-full font-orbitron font-bold text-lg hover:bg-white/10 transition-all text-white">
                ENTRAR
              </button>
            </div>
          </div>
        )}

        {view === AppView.REGISTER && (
          <div className="max-w-2xl mx-auto bg-white/5 p-6 sm:p-10 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
            <BackButton to={AppView.HOME} />
            <h2 className="text-2xl sm:text-3xl font-orbitron font-black text-center mb-8 uppercase text-white">Registro STX</h2>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6" onSubmit={(e) => {
              e.preventDefault();
              const d = new FormData(e.currentTarget);
              if (!isOfficeOpen()) return alert('Sistema cerrado (6:00 AM - 11:30 PM).');
              if (confirm('¿Confirmas tu registro? Serás redirigido a Gmail.')) {
                const userPrefix = d.get('email_user') as string;
                const fullEmail = `${userPrefix}${CORPORATE_DOMAIN}`;
                const body = `REGISTRO STX\nNombre: ${d.get('name')}\nWhatsApp: ${d.get('phone')}\nEmail: ${fullEmail}\nClave: ${d.get('pass')}`;
                window.location.href = `mailto:${OFFICIAL_EMAIL}?subject=REGISTRO STX&body=${encodeURIComponent(body)}`;
                setView(AppView.HOME);
                alert('Solicitud enviada.');
              }
            }}>
              <input name="name" className="w-full bg-space-deep border border-white/10 p-4 rounded-xl text-white outline-none focus:border-space-cyan" placeholder="Nombre" required />
              <input name="last" className="w-full bg-space-deep border border-white/10 p-4 rounded-xl text-white outline-none focus:border-space-cyan" placeholder="Apellido" required />
              <input name="country" className="w-full bg-space-deep border border-white/10 p-4 rounded-xl text-white outline-none focus:border-space-cyan" placeholder="País" required />
              <input name="phone" className="w-full bg-space-deep border border-white/10 p-4 rounded-xl text-white outline-none focus:border-space-cyan" placeholder="WhatsApp" required />
              <div className="w-full md:col-span-2 relative">
                <input name="email_user" className="w-full bg-space-deep border border-white/10 p-4 pr-32 rounded-xl text-white outline-none focus:border-space-cyan" placeholder="Usuario para correo" required />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 font-orbitron text-xs text-space-cyan font-bold">{CORPORATE_DOMAIN}</span>
              </div>
              <input name="pass" type="password" className="w-full md:col-span-2 bg-space-deep border border-white/10 p-4 rounded-xl text-white outline-none focus:border-space-cyan" placeholder="Contraseña" required />
              <button type="submit" disabled={!isOfficeOpen()} className="w-full md:col-span-2 py-5 bg-gradient-to-r from-space-purple to-space-cyan rounded-xl font-orbitron font-black text-xl text-white flex items-center justify-center gap-3 active:scale-95 transition-all">
                <Mail size={20} /> ENVIAR REGISTRO STX
              </button>
            </form>
          </div>
        )}

        {view === AppView.LOGIN && (
          <div className="max-w-md mx-auto bg-white/5 p-10 rounded-[40px] border border-white/10 shadow-2xl text-white text-center">
            <BackButton to={AppView.HOME} />
            <h2 className="text-2xl font-orbitron font-black mb-10 uppercase italic">Miembro STX</h2>
            <div className="space-y-6">
              <input id="loginId" className="w-full bg-space-deep border border-white/10 p-5 rounded-2xl text-white outline-none text-center focus:border-space-cyan" placeholder="ID MEMBER" />
              <input id="loginPw" type="password" className="w-full bg-space-deep border border-white/10 p-5 rounded-2xl text-white outline-none text-center focus:border-space-cyan" placeholder="CONTRASEÑA" />
              <button onClick={() => {
                const id = (document.getElementById('loginId') as HTMLInputElement).value;
                const pw = (document.getElementById('loginPw') as HTMLInputElement).value;
                const u = users.find(x => x.id === id && x.password === pw);
                if(u) { setCurrentUser(u); setView(AppView.DASHBOARD); } else { alert('Acceso denegado.'); }
              }} className="w-full py-5 bg-gradient-to-r from-space-blue to-space-purple rounded-2xl font-orbitron font-black text-xl text-white shadow-xl active:scale-95 transition-all">ENTRAR</button>
            </div>
          </div>
        )}

        {view === AppView.DASHBOARD && currentUser && (
          <div className="space-y-6 animate-fade-in w-full">
            <div className="p-8 bg-gradient-to-br from-space-purple/20 to-space-blue/20 border border-white/10 rounded-3xl flex flex-col sm:flex-row justify-between items-center text-white gap-4 shadow-2xl">
              <div className="text-center sm:text-left">
                <h2 className="text-3xl font-orbitron font-black italic uppercase tracking-tighter">HOLA, {currentUser.firstName}</h2>
                <p className="opacity-60 flex items-center justify-center sm:justify-start gap-2 mt-1 text-sm"><Clock size={14} /> {getLocalTime(currentUser.country)}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-space-cyan font-bold uppercase tracking-widest">Balance Disponible</p>
                <p className="text-4xl font-orbitron font-black">{currentUser.balance} NV</p>
              </div>
            </div>

            <div className="bg-space-deep border border-space-cyan/30 rounded-3xl p-8 flex flex-col md:flex-row gap-8 items-center text-white shadow-xl">
              <UserAvatar user={currentUser} size="large" />
              <div className="flex-1 w-full text-center md:text-left">
                <h3 className="text-2xl font-bold">{currentUser.firstName} {currentUser.lastName}</h3>
                <p className="text-space-cyan font-mono font-bold uppercase bg-space-cyan/10 px-4 py-1 rounded-full inline-block text-xs mt-2">ID: {currentUser.id}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 text-sm opacity-80">
                  <p><strong>WA:</strong> {currentUser.phone.slice(0,5)}***{currentUser.phone.slice(-1)}</p>
                  <p><strong>PAÍS:</strong> {currentUser.country}</p>
                  <p className="sm:col-span-2"><strong>EMAIL:</strong> {currentUser.email}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button onClick={() => setView(AppView.SPACEBANK)} className="p-8 bg-white/5 border border-white/10 rounded-3xl flex flex-col gap-6 hover:bg-space-cyan/10 transition-all text-white active:scale-[0.98] shadow-lg">
                <div className="flex justify-between items-center w-full">
                  <div className="p-4 bg-space-cyan/10 rounded-2xl"><Wallet className="text-space-cyan" size={24} /></div>
                  <ChevronRight size={20} className="opacity-30" />
                </div>
                <div className="text-left">
                  <p className="font-orbitron font-bold text-2xl uppercase tracking-tighter">Space Bank</p>
                  <p className="text-space-cyan font-orbitron font-black text-3xl">{currentUser.balance} NV</p>
                </div>
              </button>
              
              <div className="p-6 sm:p-8 bg-white/5 border border-white/10 rounded-3xl flex flex-col gap-4 text-white shadow-lg overflow-hidden">
                <div className="flex justify-between items-start">
                  <p className="font-orbitron font-bold text-xl uppercase tracking-tighter">Notificaciones</p>
                  <Bell size={20} className="text-space-purple" />
                </div>
                <div className="space-y-4 max-h-[450px] overflow-y-auto pr-2 custom-scrollbar">
                  {notifications.filter(n => n.userId === currentUser.id).length === 0 ? (
                    <p className="text-xs opacity-20 text-center py-10 font-orbitron uppercase tracking-widest">Sin notificaciones</p>
                  ) : (
                    notifications
                      .filter(n => n.userId === currentUser.id)
                      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) 
                      .map(n => (
                      <div key={n.id} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden text-white flex flex-col shadow-xl animate-fade-in group w-full max-w-[320px] mx-auto transition-all hover:bg-white/[0.08]">
                        {n.imageUrl && (
                          <div className="w-full p-2 flex justify-center">
                             <img 
                                src={n.imageUrl} 
                                className="w-full h-auto object-contain border-[3px] border-white rounded-[24px] group-hover:scale-[1.02] transition-transform duration-500 shadow-lg" 
                                alt="Notificación STX" 
                             />
                          </div>
                        )}
                        <div className="p-4 space-y-1">
                          <p className="text-[8px] text-space-cyan font-orbitron font-bold uppercase tracking-[0.2em]">{n.isBonus ? 'Crédito STX' : 'Alerta STX'}</p>
                          <p className="font-orbitron font-black text-xs leading-tight uppercase italic truncate">{n.title}</p>
                          <p className="text-[9px] opacity-60 leading-normal">{n.message}</p>
                          <div className="flex justify-between items-end pt-2">
                             {n.amount ? (
                               <p className="text-lg font-orbitron font-black text-space-cyan">+{n.amount} NV</p>
                             ) : (
                               <div className="w-1"></div>
                             )}
                             <p className="text-[6px] opacity-30 uppercase font-bold text-right">{new Date(n.date).toLocaleString('es-ES', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short' })}</p>
                          </div>
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
          <div className="max-w-md mx-auto bg-white/5 border border-red-500/20 p-12 rounded-[50px] shadow-2xl text-white">
            <BackButton to={AppView.HOME} />
            <h2 className="text-3xl font-orbitron font-black text-center mb-10 text-red-500 uppercase italic">Admin Access</h2>
            <div className="space-y-6 text-center">
              <input id="admU" className="w-full bg-space-deep border border-white/10 p-5 rounded-2xl text-white outline-none text-center focus:border-red-500" placeholder="USER" />
              <input id="admP" type="password" className="w-full bg-space-deep border border-white/10 p-5 rounded-2xl text-white outline-none text-center focus:border-red-500" placeholder="PASS" />
              <input id="admC" className="w-full bg-space-deep border border-white/10 p-5 rounded-2xl text-white outline-none text-center tracking-[1em]" maxLength={6} placeholder="000000" />
              <button onClick={() => {
                const u = (document.getElementById('admU') as HTMLInputElement).value;
                const p = (document.getElementById('admP') as HTMLInputElement).value;
                const c = (document.getElementById('admC') as HTMLInputElement).value;
                if(u === ADMIN_CREDENTIALS.user && p === ADMIN_CREDENTIALS.pass && c === ADMIN_CREDENTIALS.securityCode) setView(AppView.ADMIN_PANEL); else alert('BLOQUEO DE SEGURIDAD');
              }} className="w-full py-5 bg-red-600 rounded-2xl font-orbitron font-black text-xl text-white active:scale-95 transition-all">AUTORIZAR</button>
            </div>
          </div>
        )}

        {view === AppView.ADMIN_PANEL && (
          <div className="space-y-8 animate-fade-in w-full">
            <BackButton to={AppView.HOME} />
            <h2 className="text-4xl font-orbitron font-black text-red-500 uppercase italic">Terminal STX</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {users.map(u => (
                <div key={u.id} className="p-6 bg-white/5 border border-white/10 rounded-3xl text-white flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    <UserAvatar user={u} size="small" />
                    <div>
                      <p className="font-bold text-xl">{u.firstName} {u.lastName}</p>
                      <p className="text-[10px] text-space-cyan font-mono font-bold tracking-widest uppercase">ID: {u.id}</p>
                    </div>
                  </div>
                  <div className="bg-black/40 p-3 rounded-xl">
                    <p className="text-[10px] uppercase font-orbitron opacity-40">Saldos STX</p>
                    <p className="text-2xl font-orbitron font-black">{u.balance} NV</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button onClick={() => {
                      const val = prompt(`Abonar a ${u.firstName}:`);
                      if(val && !isNaN(Number(val))) handleAdminSendFunds(u.id, Number(val), 'Abono Directo');
                    }} className="w-full py-2 bg-green-500/10 text-green-400 border border-green-500/20 rounded-lg text-[10px] font-black uppercase hover:bg-green-500 hover:text-white transition-all">ABONAR NV</button>
                    <button onClick={() => {
                      const val = prompt(`Nombre de la Notificación para ${u.firstName}:`);
                      const amt = prompt(`Monto en Nóvares:`);
                      if(val && amt && !isNaN(Number(amt))) handleAdminSendFunds(u.id, Number(amt), val, true);
                    }} className="w-full py-2 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-lg text-[10px] font-black uppercase hover:bg-purple-500 hover:text-white transition-all">DAR CRÉDITO STX</button>
                    <button onClick={() => {if(confirm(`¿ELIMINAR?`)) setUsers(users.filter(x => x.id !== u.id))}} className="w-full py-2 bg-red-500/10 text-red-500 border border-red-500/20 rounded-lg text-[10px] font-black uppercase hover:bg-red-500 hover:text-white transition-all">ELIMINAR</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <div className="fixed inset-0 z-0 pointer-events-none opacity-20">
        <div className="absolute top-[-20%] left-[-10%] w-[100%] h-[60%] bg-space-glow blur-[160px] rounded-full animate-pulse transition-colors duration-1000"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[100%] h-[60%] bg-space-blue blur-[160px] rounded-full animate-pulse delay-700 transition-colors duration-1000"></div>
      </div>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.4); border-radius: 10px; }
        .animate-fade-in { animation: fadeIn 0.4s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        * { scroll-behavior: smooth; }
      `}</style>
    </div>
  );
};

export default App;
