import { useState } from "react";
import axios from "axios";
import { X, ArrowRightLeft, MoveRight, Loader2, IndianRupee } from 'lucide-react';
import toast from 'react-hot-toast';

const TransferModal = ({ isOpen, fromAccount, accounts, onClose, onSuccess }) => {
  const [toAccount, setToAccount] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  // Pull API URL from env
  const API_BASE_URL = import.meta.env.VITE_API_URL || '';

  if (!isOpen || !fromAccount) return null;

  const handleTransfer = async (e) => {
    e.preventDefault();
    if (!toAccount || !amount) return toast.error("Selection & Amount Required");
    if (Number(amount) <= 0) return toast.error("Invalid Transfer Quantity");

    setLoading(true);
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const config = {
        headers: { Authorization: `Bearer ${userInfo?.token}` }
      };

      // Ensure the endpoint matches your backend (usually /api/transactions)
      await axios.post(`${API_BASE_URL}/api/transactions`, {
        type: "transfer",
        division: "personal",
        category: "transfer",
        amount: Number(amount),
        description: `Node Sync: ${fromAccount.name} → Target Node`,
        account: fromAccount._id,
        transferToAccount: toAccount,
        date: new Date().toISOString().split('T')[0],
      }, config);

      toast.success("Assets Reallocated");
      onSuccess();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.error || "Transfer Link Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-6">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative w-full max-w-lg bg-[#0a0f1d] border-t md:border border-white/10 rounded-t-[2.5rem] md:rounded-[2.5rem] p-8 animate-in slide-in-from-bottom duration-300">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-black uppercase italic text-white tracking-tighter flex items-center gap-3">
              <ArrowRightLeft className="text-indigo-500" size={24} />
              Reallocate Assets
            </h2>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">
              Internal Node Transfer
            </p>
          </div>
          <button onClick={onClose} className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors">
            <X size={20} className="text-slate-400" />
          </button>
        </div>

        <form onSubmit={handleTransfer} className="space-y-6">
          {/* Transfer Visualization */}
          <div className="flex items-center justify-between gap-4 p-4 bg-white/5 border border-white/10 rounded-3xl relative overflow-hidden">
             <div className="absolute inset-0 bg-indigo-600/5 pointer-events-none" />
             
             {/* Source */}
             <div className="flex-1 text-center">
               <p className="text-[8px] font-black text-slate-500 uppercase mb-1">Source Node</p>
               <p className="text-xs font-bold text-white truncate">{fromAccount.name}</p>
               <p className="text-[10px] text-indigo-400 font-mono">₹{fromAccount.balance.toLocaleString()}</p>
             </div>

             <div className="bg-indigo-600 p-2 rounded-full shadow-lg shadow-indigo-600/20">
               <MoveRight size={16} className="text-white" />
             </div>

             {/* Destination */}
             <div className="flex-1 text-center">
               <p className="text-[8px] font-black text-slate-500 uppercase mb-1">Target Node</p>
               <select
                 required
                 className="bg-transparent text-xs font-bold text-white outline-none w-full text-center cursor-pointer"
                 value={toAccount}
                 onChange={(e) => setToAccount(e.target.value)}
               >
                 <option value="" className="bg-[#0a0f1d]">Select Target</option>
                 {accounts
                   .filter(acc => acc._id !== fromAccount._id)
                   .map(acc => (
                     <option key={acc._id} value={acc._id} className="bg-[#0a0f1d]">
                       {acc.name}
                     </option>
                   ))}
               </select>
             </div>
          </div>

          {/* Amount Input */}
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 bg-indigo-600 p-1 rounded-md">
              <IndianRupee size={16} className="text-white" />
            </div>
            <input
              type="number"
              required
              placeholder="0.00"
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-14 text-3xl font-black text-white focus:border-indigo-500/50 outline-none transition-all"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-2">
            <button 
              type="button"
              onClick={onClose} 
              className="flex-1 py-4 text-[10px] font-black uppercase text-slate-500 hover:text-white transition-colors"
            >
              Cancel Link
            </button>
            <button 
              type="submit"
              disabled={loading}
              className="flex-[2] bg-indigo-600 text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-indigo-600/20 hover:bg-indigo-500 transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={16} />
              ) : (
                "Execute Transfer"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransferModal;