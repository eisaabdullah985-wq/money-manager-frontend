import { useState } from 'react';
import { X, ShieldAlert, Trash2, Save } from 'lucide-react';

const AccountSettingsModal = ({ account, isOpen, onClose, onUpdate, onDelete }) => {

  const [name, setName] = useState(account.name);
  const [color, setColor] = useState(account.color);

  if (!isOpen) return null;

  const handleSave = () => {
    onUpdate(account._id, { name, color });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-md bg-slate-900/90 border border-white/10 rounded-[2.5rem] p-8 shadow-2xl">
        {/* Glow uses the NEWly selected color */}
        <div 
          className="absolute -top-24 -right-24 w-48 h-48 rounded-full opacity-20 blur-[80px] transition-colors duration-500" 
          style={{ backgroundColor: color }}
        />

        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-xl font-black text-white uppercase italic tracking-tighter">Node Configuration</h2>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">ID: {account._id.slice(-8)}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors text-slate-400">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Alias</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-indigo-500/50"
            />
          </div>
          {/* Setting: Burn Limit (Spending Cap) */}
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
            <div className="flex items-center gap-3">
              <ShieldAlert size={18} className="text-amber-400" />
              <div>
                <p className="text-xs font-bold text-white uppercase tracking-tight">Burn Limit</p>
                <p className="text-[9px] text-slate-500 uppercase">Alert at 80% threshold</p>
              </div>
            </div>
            <div className="w-10 h-5 bg-indigo-600 rounded-full relative cursor-pointer">
                <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full" />
            </div>
          </div>

          {/* Setting: Color Identifier */}
          <div className="space-y-3">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Spectral ID (Color)</p>
            <div className="flex gap-3">
              {['#6366f1', '#f59e0b', '#10b981', '#ef4444', '#a855f7'].map(c => (
                <button 
                  key={c}
                  onClick={() => setColor(c)}
                  className={`w-8 h-8 rounded-full border-2 transition-transform active:scale-90 ${color === c ? 'border-white scale-110' : 'border-transparent opacity-50'}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <div className="pt-6 border-t border-white/5 flex gap-3">
            <button 
              onClick={() => onDelete(account._id)}
              className="p-4 bg-red-500/10 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all"
            >
              <Trash2 size={18} />
            </button>
            <button 
              onClick={handleSave}
              className="flex-1 bg-white text-black rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-500 hover:text-white transition-all flex items-center justify-center gap-2"
            >
              <Save size={16} /> Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSettingsModal;