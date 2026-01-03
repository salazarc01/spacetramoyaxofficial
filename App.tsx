
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
  Smartphone
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
  const [searchQuery, setSearchQuery] = useState('');
  const [isBiometricSupported, setIsBiometricSupported] = useState(false);

  useEffect(() => {
    if (window.PublicKeyCredential) {
      PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()
        .then(available => setIsBiometricSupported(available));
    }
  }, []);

  const BackButton = ({ to }: { to: AppView }) => (
    <button 
      onClick={() => setView(to)} 
      className="fixed top-20 left-4 p-2.5 bg-space-deep/60 border border-white/10 text-white hover:bg-space-cyan/20 rounded-full transition-all z-[70] backdrop-blur-lg shadow-xl"
    >
      <ArrowLeft size={18} />
    </button>
  );

  const Header = () => (
    <header className="fixed top-0 left-0 right-0 z-[60] bg-space-deep/95 backdrop-blur-2xl border-b border-white/5 px-4 py-3 safe-top shadow-2xl">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div 
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => setView(AppView.HOME)}
        >
          <div className="w-8 h-8 bg-gradient-to-br from-space-purple to-space-cyan rounded-lg p-[1px]">
             <div className="w-full h-full bg-space-deep rounded-lg flex items-center justify-center">
                <Sparkles className="text-space-cyan" size={14} />
             </div>
          </div>
          <div className="flex flex-col">
            <h1 className="font-orbitron font-black italic text-sm sm:text-lg tracking-tighter text-white uppercase leading-none">SPACE<span className="text-space-cyan">TRAMOYA</span> X</h1>
            <p className="text-[6px] font-bold text-space-cyan uppercase tracking-widest mt-0.5">The Future of Family</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {currentUser ? (
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setView(AppView.DASHBOARD)}
                className="p-1.5 bg-white/5 rounded-full text-white/60 hover:text-space-cyan"
              >
                <UserIcon size={18} />
              </button>
              <button 
                onClick={() => { 
                  setCurrentUser(null); 
                  localStorage.removeItem('STX_SESSION_V16');
                  setView(AppView.HOME); 
                }}
                className="p-1.5 bg-red-500/10 rounded-full text-red-400"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <button 
              onClick={() => setView(AppView.ADMIN_LOGIN)}
              className="p-1.5 text-white/5 hover:text-red-500"
            >
              <ShieldAlert size={16} />
            </button>
          )}
        </div>
      </div>
    </header>
  );

  const playTechSound = (type: 'beep' | 'success' = 'beep') => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      oscillator.type = 'sine';
      if (type === 'beep') {
        oscillator.frequency.setValueAtTime(880, audioCtx.currentTime); 
        oscillator.frequency.exponentialRampToValueAtTime(440, audioCtx.currentTime + 0.1);
      } else {
        oscillator.frequency.setValueAtTime(523.25, audioCtx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(1046.50, audioCtx.currentTime + 0.2);
      }
      gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.3);
    } catch (e) {}
  };

  const getAccountNumber = (id: string) => {
    const base = "4532" + id.padStart(4, '0') + "90870908";
    return base.match(/.{1,4}/g)?.join(' ') || "4532 0000 9087 0908";
  };

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

  const handleBiometricLogin = async () => {
    const savedBioId = localStorage.getItem('STX_BIO_LINK_V16');
    if (!savedBioId) return alert("Biometría no vinculada.");
    try {
      if (window.PublicKeyCredential) {
        const challenge = new Uint8Array(32);
        window.crypto.getRandomValues(challenge);
        await navigator.credentials.get({
          publicKey: { challenge, timeout: 60000, allowCredentials: [], userVerification: "required" }
        });
        const user = users.find(u => u.id === savedBioId);
        if (user) {
          setCurrentUser(user);
          localStorage.setItem('STX_SESSION_V16', user.id);
          setView(AppView.DASHBOARD);
          playTechSound('success');
        }
      }
    } catch (err) {}
  };

  const linkBiometrics = async () => {
    if (!currentUser) return;
    try {
      const challenge = new Uint8Array(32);
      window.crypto.getRandomValues(challenge);
      await navigator.credentials.create({
        publicKey: {
          challenge,
          rp: { name: "SpaceTramoya X" },
          user: { id: new Uint8Array(16), name: currentUser.email, displayName: currentUser.firstName },
          pubKeyCredParams: [{ alg: -7, type: "public-key" }],
          timeout: 60000,
          attestation: "direct"
        }
      });
      localStorage.setItem('STX_BIO_LINK_V16', currentUser.id);
      playTechSound('success');
      alert("¡Biometría vinculada!");
    } catch (err) { alert("Error al vincular."); }
  };

  const handleAdminSendFunds = (userId: string, amount: number, reason: string, isBonus: boolean = false) => {
    const ref = Array.from({ length: 20 }, () => Math.floor(Math.random() * 10)).join('');
    const user = users.find(u => u.id === userId);
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, balance: u.balance + amount } : u));
    setTransactions(prev => [{ id: ref, fromId: 'ADMIN', fromName: 'Admin', toId: userId, toName: user?.firstName || 'User', amount, reason: isBonus ? `Bono: ${reason}` : reason, date: new Date().toISOString(), type: isBonus ? 'bonus' : 'credit' }, ...prev]);
    setNotifications(prev => [{ id: Math.random().toString(36).substr(2, 9), userId, title: reason, message: `Abono: ${amount} NV.`, amount, date: new Date().toISOString(), isBonus, imageUrl: BANK_LOGO }, ...prev]);
    alert(`Enviado. REF: ${ref}`);
  };

  const isOfficeOpen = () => {
    const now = new Date();
    const totalMin = now.getHours() * 60 + now.getMinutes();
    return totalMin >= 360 && totalMin <= 1410;
  };

  const QRScannerModal = ({ isOpen, onClose, onScan }: { isOpen: boolean, onClose: () => void, onScan: (data: any) => void }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
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
          const code = jsQR(imageData.data, imageData.width, imageData.height, { inversionAttempts: "dontInvert" });
          if (code) {
            try {
              const data = JSON.parse(code.data);
              if (data.app === 'STX_BANK') {
                playTechSound('success');
                onScan(data);
                return;
              }
            } catch (e) {}
          }
        }
      }
      requestRef.current = requestAnimationFrame(scan);
    };

    useEffect(() => {
      if (!isOpen) return;
      let stream: MediaStream | null = null;
      navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
        .then(s => {
          stream = s;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.setAttribute("playsinline", "true");
            videoRef.current.play();
            requestRef.current = requestAnimationFrame(scan);
          }
        }).catch(() => alert("Permite el acceso a la cámara."));
      return () => { stream?.getTracks().forEach(t => t.stop()); if (requestRef.current) cancelAnimationFrame(requestRef.current); };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center animate-fade-in p-4">
        <button onClick={onClose} className="absolute top-8 right-6 p-2 bg-white/20 rounded-full text-white z-20"><X size={20} /></button>
        <div className="w-full max-w-[280px] aspect-square relative rounded-[40px] overflow-hidden border border-space-cyan/50 shadow-2xl">
          <video ref={videoRef} className="w-full h-full object-cover" muted playsInline />
          <canvas ref={canvasRef} className="hidden" />
          <div className="absolute inset-0 border-[50px] border-black/70 pointer-events-none"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 border border-space-cyan/30 rounded-3xl">
             <div className="absolute top-0 left-0 w-full h-[2px] bg-space-cyan shadow-[0_0_10px_#06b6d4] animate-scan-line"></div>
          </div>
        </div>
        <div className="mt-8 text-center px-6">
          <h3 className="font-orbitron font-black text-lg text-white uppercase italic tracking-tighter">ESCÁNER GHOST</h3>
          <p className="text-[8px] text-space-cyan font-bold uppercase tracking-[0.2em] mt-2 opacity-70 leading-relaxed">Centra el código de la credencial en el cuadro para validación inmediata.</p>
        </div>
        <style>{`
          @keyframes scan-line { 0% { top: 0; } 100% { top: 100%; } }
          .animate-scan-line { animation: scan-line 2s linear infinite; position: absolute; }
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
    const [isGenerating, setIsGenerating] = useState(false);
    
    const receiver = users.find(u => u.id === (scannedData ? scannedData.id : receiverId));
    const numAmount = Number(amount);
    const userTxs = transactions.filter(t => t.fromId === currentUser?.id || t.toId === currentUser?.id);

    const accountData = {
      app: 'STX_BANK', id: currentUser?.id, firstName: currentUser?.firstName, lastName: currentUser?.lastName, acc: getAccountNumber(currentUser?.id || '')
    };
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(JSON.stringify(accountData))}`;

    const generateAndShareImage = async (mode: 'share' | 'download') => {
      setIsGenerating(true);
      try {
        const canvas = document.createElement('canvas');
        canvas.width = 500; canvas.height = 700;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.fillStyle = '#0a0a1f'; ctx.fillRect(0, 0, canvas.width, canvas.height);
        const logo = new Image(); logo.crossOrigin = "anonymous"; logo.src = BANK_LOGO;
        await new Promise(r => logo.onload = r);
        ctx.drawImage(logo, (canvas.width - 80) / 2, 40, 80, 80);
        ctx.fillStyle = '#ffffff'; ctx.font = 'bold 30px Orbitron'; ctx.textAlign = 'center';
        ctx.fillText('SPACETRAMOYA X', canvas.width / 2, 160);
        ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.roundRect((canvas.width - 320) / 2, 220, 320, 320, 30); ctx.fill();
        const qrImg = new Image(); qrImg.crossOrigin = "anonymous"; qrImg.src = qrUrl;
        await new Promise(r => qrImg.onload = r);
        ctx.drawImage(qrImg, (canvas.width - 280) / 2, 240, 280, 280);
        ctx.fillStyle = '#ffffff'; ctx.font = 'bold 36px Orbitron';
        ctx.fillText(`${currentUser?.firstName} ${currentUser?.lastName}`.toUpperCase(), canvas.width / 2, 610);
        ctx.fillStyle = '#06b6d4'; ctx.font = 'bold 24px Orbitron';
        ctx.fillText(`ID: ${currentUser?.id}`, canvas.width / 2, 660);
        const dataUrl = canvas.toDataURL("image/png");
        if (mode === 'download') {
          const link = document.createElement('a'); link.download = `STX_CRED_${currentUser?.id}.png`; link.href = dataUrl; link.click();
        } else {
          canvas.toBlob(async (blob) => {
            if (blob && navigator.share) {
              const file = new File([blob], `STX_${currentUser?.id}.png`, { type: 'image/png' });
              try { await navigator.share({ files: [file], title: 'Credencial STX' }); } catch (e) {}
            } else { alert("Descargar."); }
          });
        }
      } catch (err) { alert("Error."); } finally { setIsGenerating(false); }
    };

    const handleTransferRequest = () => {
      const finalReceiver = receiver;
      if (!finalReceiver || numAmount <= 0) return alert('Datos inválidos.');
      const ref = Array.from({ length: 20 }, () => Math.floor(Math.random() * 10)).join('');
      const body = `TRANSFER STX\nREF: ${ref}\n\nDE: ${currentUser?.firstName} (ID:${currentUser?.id})\nA: ${finalReceiver.firstName} (ID:${finalReceiver.id})\nMONTO: ${numAmount} NV\nMOTIVO: ${reason}`;
      window.location.href = `mailto:${OFFICIAL_EMAIL}?subject=TRANSFER STX&body=${encodeURIComponent(body)}`;
    };

    return (
      <div className="space-y-5 animate-fade-in w-full pb-10 mt-6">
        <BackButton to={AppView.DASHBOARD} />
        <QRScannerModal isOpen={isScannerOpen} onClose={() => setIsScannerOpen(false)} onScan={(data) => {
          setScannedData(data); setReceiverId(data.id); setIsScannerOpen(false); setTab('send');
        }} />
        
        <div className="space-y-4">
          {currentUser && (
            <div className="relative w-full max-w-[320px] h-[180px] mx-auto rounded-3xl overflow-hidden shadow-2xl border border-white/20">
              <div className="absolute inset-0 bg-gradient-to-br from-space-purple via-space-blue to-space-cyan opacity-90"></div>
              <div className="absolute inset-0 bg-white/5 backdrop-blur-[2px]"></div>
              <div className="relative h-full p-5 flex flex-col justify-between text-white font-orbitron">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-1.5">
                    <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center border border-white/20"><span className="text-xs font-black italic">X</span></div>
                    <span className="text-[8px] font-bold tracking-widest uppercase">Space Bank</span>
                  </div>
                  <Cpu size={18} className="text-yellow-400 opacity-80" />
                </div>
                <p className="text-lg font-black tracking-widest text-center">{getAccountNumber(currentUser.id)}</p>
                <div className="flex justify-between items-end">
                  <div className="flex flex-col">
                    <span className="text-[6px] uppercase opacity-50 mb-0.5 tracking-tighter">Account Holder</span>
                    <p className="text-[10px] font-bold uppercase italic truncate max-w-[150px]">{currentUser.firstName} {currentUser.lastName}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[6px] uppercase opacity-50 mb-0.5 tracking-tighter">Member ID</span>
                    <p className="text-[10px] font-bold">{currentUser.id}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div className="p-5 bg-white/5 backdrop-blur-lg rounded-[28px] border border-white/10 flex justify-between items-center text-white shadow-xl">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-black/40 rounded-xl p-2 border border-white/5"><img src={BANK_LOGO} className="w-full h-full object-contain" alt="Logo" /></div>
              <div className="leading-tight"><h2 className="text-[11px] font-orbitron font-black uppercase tracking-tighter">Capital Ghost</h2><p className="text-[7px] text-space-cyan font-bold uppercase tracking-widest opacity-60">Fondo Nóvares</p></div>
            </div>
            <p className="text-xl font-orbitron font-black">{currentUser?.balance} <span className="text-[9px] text-space-cyan">NV</span></p>
          </div>
        </div>

        <div className="flex gap-1 bg-white/5 p-1 rounded-2xl border border-white/10">
          <button onClick={() => setTab('tools')} className={`flex-1 py-3 text-[9px] font-orbitron font-bold rounded-xl transition-all ${tab === 'tools' ? 'bg-space-cyan text-space-deep shadow-lg' : 'text-white/30'}`}>MIS DATOS</button>
          <button onClick={() => setTab('send')} className={`flex-1 py-3 text-[9px] font-orbitron font-bold rounded-xl transition-all ${tab === 'send' ? 'bg-space-cyan text-space-deep shadow-lg' : 'text-white/30'}`}>PAGAR</button>
          <button onClick={() => setTab('history')} className={`flex-1 py-3 text-[9px] font-orbitron font-bold rounded-xl transition-all ${tab === 'history' ? 'bg-space-cyan text-space-deep shadow-lg' : 'text-white/30'}`}>MOVIMIENTOS</button>
        </div>

        {tab === 'tools' && (
          <div className="flex flex-col gap-4 animate-fade-in">
            <div className="p-6 bg-white/5 border border-white/10 rounded-[32px] flex flex-col items-center gap-4 text-center">
               <div className="w-40 h-40 bg-white p-4 rounded-2xl shadow-inner"><img src={qrUrl} className="w-full h-full" alt="QR" /></div>
               <div className="space-y-0.5">
                  <h3 className="font-orbitron font-black text-sm text-white uppercase italic">Credencial Digital</h3>
                  <p className="text-[8px] text-space-cyan font-bold uppercase opacity-50">Escanea para enviar fondos</p>
               </div>
               <div className="grid grid-cols-2 gap-2 w-full">
                  <button disabled={isGenerating} onClick={() => generateAndShareImage('share')} className="py-3 bg-green-500/10 text-green-400 border border-green-500/20 rounded-xl text-[8px] font-orbitron font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-all">
                     <Share2 size={12} /> COMPARTIR
                  </button>
                  <button disabled={isGenerating} onClick={() => generateAndShareImage('download')} className="py-3 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-xl text-[8px] font-orbitron font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-all">
                     <Download size={12} /> PNG
                  </button>
               </div>
            </div>
            <button onClick={() => setIsScannerOpen(true)} className="w-full py-4 bg-space-cyan/10 border border-space-cyan/20 text-space-cyan font-orbitron font-black text-xs rounded-[24px] shadow-lg flex items-center justify-center gap-3 active:scale-95 transition-all">
              <Maximize size={16} /> ESCANEAR PARA PAGAR
            </button>
          </div>
        )}

        {tab === 'send' && (
          <div className="bg-white/5 p-6 rounded-[32px] border border-white/10 space-y-4 animate-fade-in">
            {scannedData ? (
               <div className="p-4 bg-space-cyan/10 border border-space-cyan/20 rounded-2xl space-y-1 animate-scale-up">
                  <p className="text-[7px] uppercase font-orbitron text-space-cyan tracking-widest mb-1">Receptor Detectado</p>
                  <p className="font-orbitron font-black text-sm italic uppercase">{scannedData.firstName} {scannedData.lastName}</p>
                  <p className="text-[7px] font-mono opacity-40">ID: {scannedData.id}</p>
                  <button onClick={() => { setScannedData(null); setReceiverId(''); }} className="text-[8px] font-black text-red-400 uppercase pt-1 mt-1 border-t border-white/5 w-full text-left">CAMBIAR</button>
               </div>
            ) : (
               <div className="space-y-1">
                <label className="text-[8px] text-white/30 uppercase font-orbitron ml-3">ID Miembro</label>
                <input value={receiverId} onChange={(e) => setReceiverId(e.target.value)} className="w-full bg-space-deep border border-white/10 p-4 rounded-xl text-white text-xs outline-none focus:border-space-cyan transition-all" placeholder="0001" />
                {receiver && <p className="text-[8px] font-bold text-green-400 uppercase mt-1 italic ml-3">Destino: {receiver.firstName}</p>}
              </div>
            )}
            <div className="space-y-1">
              <label className="text-[8px] text-white/30 uppercase font-orbitron ml-3">Monto (NV)</label>
              <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full bg-space-deep border border-white/10 p-4 rounded-xl text-white text-sm outline-none focus:border-space-cyan transition-all font-orbitron" placeholder="0.00" />
            </div>
            <div className="space-y-1">
              <label className="text-[8px] text-white/30 uppercase font-orbitron ml-3">Motivo</label>
              <input value={reason} onChange={(e) => setReason(e.target.value)} className="w-full bg-space-deep border border-white/10 p-4 rounded-xl text-white text-xs outline-none focus:border-space-cyan transition-all" placeholder="Referencia..." />
            </div>
            <button disabled={!receiver || numAmount <= 0} onClick={handleTransferRequest} className="w-full py-4 bg-gradient-to-r from-space-purple to-space-blue rounded-xl font-orbitron font-black text-xs shadow-2xl active:scale-95 disabled:opacity-20 transition-all uppercase tracking-widest">TRANSMITIR GMAIL</button>
          </div>
        )}

        {tab === 'history' && (
          <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1 custom-scrollbar animate-fade-in">
            {userTxs.length === 0 ? <p className="text-center py-10 text-[9px] opacity-20 uppercase font-orbitron">Bóveda vacía</p> : 
              userTxs.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(t => (
                <div key={t.id} className="p-4 bg-white/5 border border-white/5 rounded-2xl flex justify-between items-center text-white">
                  <div className="flex gap-3 items-center">
                    <div className={`p-2 rounded-lg ${t.toId === currentUser?.id ? 'bg-green-500/10' : 'bg-red-500/10'}`}>{t.toId === currentUser?.id ? <ArrowDownCircle className="text-green-400" size={16} /> : <ArrowUpCircle className="text-red-400" size={16} />}</div>
                    <div className="leading-tight">
                      <p className="text-[6px] opacity-20 uppercase font-mono tracking-tighter">REF: ...{t.id.slice(-6)}</p>
                      <p className="font-bold text-[10px] uppercase truncate max-w-[120px]">{t.toId === currentUser?.id ? `DE: ${t.fromName}` : `A: ${t.toName}`}</p>
                    </div>
                  </div>
                  <div className="text-right leading-tight">
                    <p className={`font-orbitron font-black text-xs ${t.toId === currentUser?.id ? 'text-green-400' : 'text-red-400'}`}>{t.toId === currentUser?.id ? '+' : '-'}{t.amount}</p>
                    <p className="text-[7px] opacity-30 font-bold">{new Date(t.date).toLocaleDateString()}</p>
                  </div>
                </div>
              ))
            }
          </div>
        )}
      </div>
    );
  };

  const Dashboard = () => (
    <div className="space-y-4 animate-fade-in w-full pb-10 mt-4">
      <div className="p-7 bg-gradient-to-br from-space-purple/30 to-space-blue/30 border border-white/10 rounded-[36px] flex flex-col items-center text-white gap-3 shadow-2xl relative overflow-hidden text-center">
        <div className="absolute top-0 right-0 w-20 h-20 bg-space-cyan/10 blur-[50px] rounded-full translate-x-10 -translate-y-10"></div>
        <p className="text-[7px] text-space-cyan font-bold uppercase tracking-[0.4em] opacity-80 leading-none">STX GHOST ACCESS</p>
        <h2 className="text-2xl font-orbitron font-black italic uppercase tracking-tighter leading-none truncate max-w-full">{currentUser?.firstName}</h2>
        <div className="pt-1">
          <p className="text-[8px] text-space-cyan/50 font-bold uppercase tracking-widest mb-0.5">Fondo Disponible</p>
          <p className="text-4xl font-orbitron font-black text-white drop-shadow-lg">{currentUser?.balance} <span className="text-sm">NV</span></p>
        </div>
      </div>

      <div className="bg-space-deep border border-white/5 rounded-[28px] p-5 flex items-center gap-4 text-white shadow-xl">
        <div className="w-14 h-14 rounded-xl bg-gradient-to-tr from-space-purple/40 to-space-blue/40 border border-white/10 flex items-center justify-center text-xl font-black italic text-white/90 shadow-inner">
          {currentUser?.firstName[0]}{currentUser?.lastName[0]}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-[13px] font-bold uppercase tracking-tight truncate">{currentUser?.firstName} {currentUser?.lastName}</h3>
          <span className="text-space-cyan font-mono font-black uppercase bg-space-cyan/10 px-2 py-1 rounded-lg text-[7px] tracking-[0.2em] mt-1.5 inline-block">ID: {currentUser?.id}</span>
          <div className="mt-2.5">
            <button 
              onClick={linkBiometrics} 
              className="flex items-center gap-1.5 text-[8px] font-bold transition-all text-space-cyan hover:text-white"
            >
              <Fingerprint size={10} /> {localStorage.getItem('STX_BIO_LINK_V16') ? 'BIOMETRÍA OK' : 'VINCULAR SEGURIDAD'}
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <button onClick={() => setView(AppView.SPACEBANK)} className="group p-6 bg-white/5 border border-white/10 rounded-[32px] flex justify-between items-center text-white active:scale-95 transition-all shadow-lg">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-space-cyan/10 rounded-xl border border-white/5"><Wallet className="text-space-cyan" size={24} /></div>
            <div className="text-left leading-tight"><p className="font-orbitron font-bold text-sm uppercase tracking-tight">Space Bank</p><p className="text-[8px] opacity-40 uppercase tracking-widest">Monedero Galáctico</p></div>
          </div>
          <ChevronRight size={18} className="opacity-30 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
        </button>
        
        <div className="p-7 bg-white/5 border border-white/10 rounded-[32px] flex flex-col gap-4 text-white shadow-lg">
          <div className="flex justify-between items-center"><p className="font-orbitron font-bold text-[10px] uppercase tracking-widest opacity-60">Actividad GHOST</p><Bell size={16} className="text-space-purple" /></div>
          <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1.5 custom-scrollbar">
            {notifications.filter(n => n.userId === currentUser?.id).length === 0 ? (
              <p className="text-[8px] opacity-20 text-center py-6 uppercase font-orbitron tracking-widest">Sin reportes</p>
            ) : (
              notifications.filter(n => n.userId === currentUser?.id).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(n => (
                <div key={n.id} className="bg-white/5 border border-white/5 p-4 rounded-2xl">
                  <div className="flex justify-between items-start mb-1.5 leading-none">
                    <p className="text-[6px] text-space-cyan font-orbitron font-black uppercase tracking-[0.2em]">{n.isBonus ? 'BONO' : 'ALERTA'}</p>
                    <p className="text-[6px] opacity-30 font-bold">{new Date(n.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                  </div>
                  <p className="font-orbitron font-bold text-[10px] uppercase italic leading-tight tracking-tight">{n.title}</p>
                  {n.amount && <p className="text-sm font-orbitron font-black text-space-cyan mt-1.5">+{n.amount} NV</p>}
                </div>
              ))
            }
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-space-deep font-inter text-slate-100 selection:bg-space-cyan selection:text-space-deep overflow-x-hidden w-full">
      <Header />
      <main className="pt-20 px-5 pb-12 w-full max-w-lg mx-auto flex flex-col items-center">
        {view === AppView.HOME && (
          <div className="flex flex-col items-center justify-center min-h-[75vh] text-center space-y-10 animate-fade-in w-full px-2">
            <div className="relative">
              <div className="absolute inset-0 bg-space-cyan/10 blur-[80px] rounded-full scale-150 animate-pulse"></div>
              <img src={BANK_LOGO} className="w-40 h-40 object-contain relative z-10 drop-shadow-[0_0_20px_rgba(6,182,212,0.2)]" alt="Logo" />
            </div>
            
            <div className="space-y-2 px-1">
              <h1 className="font-orbitron text-4xl sm:text-6xl font-black italic tracking-tighter text-white uppercase leading-none">
                SPACE<span className="text-space-cyan">TRAMOYA</span> X
              </h1>
              <p className="text-[11px] sm:text-base text-slate-400 max-w-xs mx-auto font-light tracking-wide leading-relaxed px-2">
                Plataforma de élite GHOST-X. <span className="text-space-cyan font-bold italic">Seguridad galáctica</span> y banca digital privada.
              </p>
            </div>

            <div className="flex flex-col gap-3.5 w-full max-w-[260px]">
              <button onClick={() => setView(AppView.REGISTER)} className="py-4.5 bg-gradient-to-r from-space-purple to-space-blue rounded-2xl font-orbitron font-black text-sm text-white shadow-2xl active:scale-95 transition-all uppercase tracking-widest">INSCRIBIRSE</button>
              <button onClick={() => setView(AppView.LOGIN)} className="py-4.5 bg-white/5 border border-white/10 rounded-2xl font-orbitron font-black text-sm text-white hover:bg-white/10 active:scale-95 transition-all">ACCEDER</button>
            </div>
          </div>
        )}

        {view === AppView.REGISTER && (
          <div className="w-full bg-white/5 p-8 rounded-[40px] border border-white/10 shadow-2xl mt-6 animate-fade-in relative">
            <BackButton to={AppView.HOME} />
            <div className="text-center mb-8">
              <h2 className="text-xl font-orbitron font-black uppercase text-white italic tracking-tighter leading-none">REGISTRO GHOST</h2>
              <p className="text-[8px] text-space-cyan font-bold uppercase tracking-[0.3em] mt-2">Inscripción Nivel 01</p>
            </div>
            <form className="flex flex-col gap-3" onSubmit={(e) => { e.preventDefault(); if(!isOfficeOpen()) return alert("OFICINA CERRADA (6AM-11:30PM)"); window.location.href = `mailto:${OFFICIAL_EMAIL}?subject=SOLICITUD STX&body=Solicito unirme.`; setView(AppView.HOME); }}>
              <input className="w-full bg-space-deep border border-white/10 p-4.5 rounded-2xl text-white text-[11px] outline-none focus:border-space-cyan transition-all" placeholder="Nombre real" required />
              <input className="w-full bg-space-deep border border-white/10 p-4.5 rounded-2xl text-white text-[11px] outline-none focus:border-space-cyan transition-all" placeholder="Apellido real" required />
              <input className="w-full bg-space-deep border border-white/10 p-4.5 rounded-2xl text-white text-[11px] outline-none focus:border-space-cyan transition-all" placeholder="País" required />
              <input className="w-full bg-space-deep border border-white/10 p-4.5 rounded-2xl text-white text-[11px] outline-none focus:border-space-cyan transition-all" placeholder="WhatsApp" required />
              <div className="relative"><input className="w-full bg-space-deep border border-white/10 p-4.5 pr-28 rounded-2xl text-white text-[11px] outline-none font-mono" placeholder="usuario" required /><span className="absolute right-5 top-1/2 -translate-y-1/2 font-orbitron text-[8px] text-space-cyan font-black">{CORPORATE_DOMAIN}</span></div>
              <input type="password" className="w-full bg-space-deep border border-white/10 p-4.5 rounded-2xl text-white text-[11px] outline-none" placeholder="Cifrado personal" required />
              <button type="submit" className="py-4.5 bg-gradient-to-r from-space-purple to-space-cyan rounded-2xl font-orbitron font-black text-sm text-white mt-3 shadow-xl active:scale-95 transition-all uppercase">ENVIAR SOLICITUD</button>
            </form>
          </div>
        )}

        {view === AppView.LOGIN && (
          <div className="w-full bg-white/5 p-10 rounded-[48px] border border-white/10 shadow-2xl text-center mt-6 animate-fade-in relative">
            <BackButton to={AppView.HOME} />
            <div className="mb-8">
              <h2 className="text-xl font-orbitron font-black uppercase italic tracking-tighter text-white leading-none">IDENTIFICACIÓN</h2>
              <p className="text-[9px] text-space-cyan font-bold uppercase tracking-[0.4em] mt-2">Acceso de Miembro</p>
            </div>
            <div className="space-y-5">
              <div className="space-y-1.5 text-left px-1">
                <label className="text-[8px] text-white/30 uppercase font-orbitron ml-4">ID Acceso</label>
                <input id="loginId" className="w-full bg-space-deep border border-white/10 p-5 rounded-[24px] text-center font-orbitron text-base uppercase tracking-widest outline-none focus:border-space-cyan transition-all" placeholder="0001" />
              </div>
              <div className="space-y-1.5 text-left px-1">
                <label className="text-[8px] text-white/30 uppercase font-orbitron ml-4">Cifrado</label>
                <input id="loginPw" type="password" className="w-full bg-space-deep border border-white/10 p-5 rounded-[24px] text-center text-base outline-none focus:border-space-cyan transition-all" placeholder="••••••••" />
              </div>
              
              <button onClick={() => { 
                const id = (document.getElementById('loginId') as HTMLInputElement).value; 
                const pw = (document.getElementById('loginPw') as HTMLInputElement).value; 
                const u = users.find(x => x.id === id && x.password === pw); 
                if(u) { 
                  setCurrentUser(u); localStorage.setItem('STX_SESSION_V16', u.id); 
                  setView(AppView.DASHBOARD); playTechSound('success');
                } else { alert('Error.'); } 
              }} className="w-full py-5 bg-gradient-to-r from-space-blue to-space-purple rounded-[24px] font-orbitron font-black text-sm uppercase tracking-widest shadow-2xl active:scale-95 transition-all">CONECTAR</button>
              
              {isBiometricSupported && localStorage.getItem('STX_BIO_LINK_V16') && (
                <button onClick={handleBiometricLogin} className="flex flex-col items-center gap-2 mx-auto pt-4 group">
                  <div className="p-3 bg-space-cyan/10 border border-space-cyan/20 rounded-xl text-space-cyan shadow-lg"><Fingerprint size={28} /></div>
                  <span className="text-[8px] font-orbitron font-bold text-space-cyan uppercase tracking-[0.3em] leading-none">Acceso Rápido</span>
                </button>
              )}
            </div>
          </div>
        )}

        {view === AppView.DASHBOARD && currentUser && <Dashboard />}
        {view === AppView.SPACEBANK && currentUser && <SpaceBankView />}

        {view === AppView.ADMIN_LOGIN && (
          <div className="w-full bg-white/5 border border-red-500/20 p-10 rounded-[48px] text-white animate-fade-in mt-6 relative shadow-2xl">
            <BackButton to={AppView.HOME} />
            <div className="text-center mb-8">
              <h2 className="text-lg font-orbitron font-black text-red-500 uppercase italic tracking-tighter leading-none">ACCESO ALPHA</h2>
              <p className="text-[9px] text-red-400 font-bold uppercase tracking-widest mt-2">Terminal Maestro de Gestión</p>
            </div>
            <div className="space-y-4 text-center">
              <input id="admU" className="w-full bg-space-deep border border-white/10 p-4.5 rounded-2xl text-[11px] outline-none" placeholder="USER" />
              <input id="admP" type="password" className="w-full bg-space-deep border border-white/10 p-4.5 rounded-2xl text-[11px] outline-none" placeholder="PASS" />
              <input id="admC" className="w-full bg-space-deep border border-white/10 p-4.5 rounded-2xl tracking-[1.2em] font-mono text-[11px] outline-none" maxLength={6} placeholder="000000" />
              <button onClick={() => { const u = (document.getElementById('admU') as HTMLInputElement).value; const p = (document.getElementById('admP') as HTMLInputElement).value; const c = (document.getElementById('admC') as HTMLInputElement).value; if(u === ADMIN_CREDENTIALS.user && p === ADMIN_CREDENTIALS.pass && c === ADMIN_CREDENTIALS.securityCode) setView(AppView.ADMIN_PANEL); else alert('Denegado.'); }} className="w-full py-4.5 bg-red-600 rounded-2xl font-orbitron font-black text-xs uppercase tracking-widest shadow-xl active:scale-95 transition-all">AUTORIZAR ENLACE</button>
            </div>
          </div>
        )}

        {view === AppView.ADMIN_PANEL && (
          <div className="space-y-6 w-full animate-fade-in mt-14 pb-10">
            <BackButton to={AppView.HOME} />
            <div className="text-center border-b border-white/10 pb-5">
              <h2 className="text-2xl font-orbitron font-black text-red-500 uppercase italic tracking-tighter">Terminal X</h2>
              <p className="text-[8px] text-white/40 uppercase font-bold tracking-[0.4em] mt-1.5">Administración Central</p>
            </div>
            <div className="flex flex-col gap-5">
              {users.map(u => (
                <div key={u.id} className="p-5 bg-white/5 border border-white/10 rounded-[32px] text-white flex flex-col gap-4 shadow-xl">
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center font-black text-base italic text-red-500 border border-white/10">{u.firstName[0]}</div>
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-xs uppercase truncate">{u.firstName} {u.lastName}</p>
                      <p className="text-[8px] text-space-cyan font-mono font-black uppercase tracking-widest">MEMBER ID: {u.id}</p>
                    </div>
                  </div>
                  <div className="bg-black/40 p-4 rounded-2xl flex justify-between items-center border border-white/5">
                    <p className="text-[7px] uppercase opacity-40 font-bold tracking-widest leading-none">Balance</p>
                    <p className="text-xl font-orbitron font-black text-red-400">{u.balance} <span className="text-[9px]">NV</span></p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => { const val = prompt(`Monto a abonar a ${u.firstName}:`); if(val) handleAdminSendFunds(u.id, Number(val), 'Abono Directo'); }} className="flex-1 py-3 bg-green-500/10 text-green-400 border border-green-500/10 rounded-xl text-[8px] font-black uppercase tracking-widest active:scale-95 transition-all">ABONAR</button>
                    <button onClick={() => {if(confirm(`¿ELIMINAR MIEMBRO ${u.firstName}?`)) setUsers(users.filter(x => x.id !== u.id))}} className="flex-1 py-3 bg-red-500/10 text-red-500 border border-red-500/10 rounded-xl text-[8px] font-black uppercase tracking-widest active:scale-95 transition-all">BORRAR</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <div className="fixed inset-0 z-0 pointer-events-none opacity-20">
        <div className="absolute top-[-20%] left-[-10%] w-[120%] h-[70%] bg-space-glow blur-[100px] rounded-full animate-pulse transition-all"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[120%] h-[70%] bg-space-blue blur-[100px] rounded-full animate-pulse delay-1000 transition-all"></div>
      </div>
      <style>{`
        .animate-fade-in { animation: fadeIn 0.4s ease-out; } 
        @keyframes fadeIn { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
        .animate-scale-up { animation: scaleUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
        @keyframes scaleUp { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
        input::placeholder { color: rgba(255,255,255,0.15); }
        .safe-top { padding-top: max(1rem, env(safe-area-inset-top)); }
        @media (max-height: 700px) {
          .pt-20 { pt-16; }
          .mt-6 { mt-4; }
          .space-y-10 { space-y-6; }
        }
      `}</style>
    </div>
  );
};

export default App;
