import { useState } from 'react';
import { Settings } from 'lucide-react';
import AccountSettingsModal from '../components/modals/AccountSettingsModal';

const AccountCard = ({ account, onTransfer, onDelete, onUpdate }) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <>
      <div className="bg-slate-900/40 border border-white/5 rounded-[2rem] p-6 backdrop-blur-xl group hover:border-white/10 transition-all relative overflow-hidden">
        {/* Visual Accent Glow */}
        <div 
          className="absolute top-0 right-0 w-32 h-32 opacity-10 blur-[50px] pointer-events-none transition-all group-hover:opacity-20"
          style={{ backgroundColor: account.color }}
        />
        
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-sm font-black uppercase tracking-widest text-white italic">
              {account.name}
            </h3>
            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter mt-1">
              {account.type.replace("_", " ")} Sector
            </p>
          </div>
          <div 
            className="w-2 h-2 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)] transition-transform group-hover:scale-125" 
            style={{ backgroundColor: account.color }} 
          />
        </div>

        <div className="mb-8">
          <span className="text-[8px] font-black text-slate-500 uppercase block mb-1">Available Liquidity</span>
          <p className="text-3xl font-black italic tracking-tighter text-white">
            ₹{account.balance.toLocaleString('en-IN')}
          </p>
        </div>

        <div className="flex items-center gap-4 relative z-10">
          <button
            onClick={onTransfer}
            className="flex-1 bg-white text-black py-3 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-indigo-500 hover:text-white transition-all transform active:scale-95"
          >
            Initiate Transfer
          </button>
          
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="p-3 bg-slate-800 rounded-xl text-slate-400 hover:text-white hover:bg-slate-700 transition-all transform active:rotate-90"
          >
            <Settings size={14} />
          </button>
        </div>
      </div>

      {/* Modal is placed outside the card container to avoid stacking context issues */}
      <AccountSettingsModal 
        account={account} 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)}
        onDelete={onDelete}
        onUpdate={onUpdate}
      />
    </>
  );
};

export default AccountCard;