import { useState } from "react";
import axios from "axios";
import { X, Wallet, Plus, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const AddAccountModal = ({ isOpen, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    type: "bank",
    balance: "",
    currency: "INR",
    color: "#3B82F6",
  });

  // Pull API URL from env (Vite requires VITE_ prefix)
  const API_BASE_URL = import.meta.env.VITE_API_URL || '';

  // Prevent hook order mismatch
  if (!isOpen) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name) return toast.error("Account identifier required");

    setLoading(true);
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const config = {
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo?.token}` 
        }
      };

      // Construct the full URL using the env variable
      const url = `${API_BASE_URL}/api/accounts`;

      const payload = {
        ...form,
        balance: Number(form.balance) || 0,
      };

      await axios.post(url, payload, config);

      toast.success("Account Node Deployed");
      onSuccess();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.error || "Provisioning Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm" 
        onClick={onClose} 
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-lg bg-[#0a0f1d] border-t md:border border-white/10 rounded-t-[2.5rem] md:rounded-[2.5rem] p-8 animate-in slide-in-from-bottom duration-300">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-black uppercase italic text-white tracking-tighter">
              Register Account
            </h2>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">
              Internal Asset Logging
            </p>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors"
          >
            <X size={20} className="text-slate-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Account Identifier */}
          <div className="space-y-1">
            <label className="text-[9px] font-black text-slate-500 uppercase ml-1">
              Account Identifier
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-500">
                <Wallet size={18} />
              </div>
              <input
                name="name"
                required
                placeholder="E.G. GLOBAL SAVINGS"
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white font-bold focus:border-indigo-500/50 outline-none transition-all"
                value={form.name}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Asset Type */}
            <div className="space-y-1">
              <label className="text-[9px] font-black text-slate-500 uppercase ml-1">
                Asset Type
              </label>
              <select 
                name="type" 
                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 text-white font-bold text-xs uppercase tracking-widest outline-none cursor-pointer hover:border-white/20"
                value={form.type}
                onChange={handleChange}
              >
                <option value="bank" className="bg-[#0a0f1d]">BANK</option>
                <option value="cash" className="bg-[#0a0f1d]">CASH</option>
                <option value="savings" className="bg-[#0a0f1d]">SAVINGS</option>
                <option value="credit_card" className="bg-[#0a0f1d]">CREDIT CARD</option>
              </select>
            </div>

            {/* Initial Input */}
            <div className="space-y-1">
              <label className="text-[9px] font-black text-slate-500 uppercase ml-1">
                Initial Balance
              </label>
              <input
                type="number"
                name="balance"
                placeholder="0.00"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 text-white font-bold text-xs outline-none hover:border-white/20 transition-all"
                value={form.balance}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <button 
              type="button"
              onClick={onClose} 
              className="flex-1 py-4 text-[10px] font-black uppercase text-slate-500 hover:text-white transition-colors"
            >
              Discard
            </button>
            <button 
              type="submit"
              disabled={loading}
              className="flex-[2] bg-indigo-600 text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-indigo-600/20 hover:bg-indigo-500 transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={16} />
              ) : (
                <><Plus size={16} /> Commit Account</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAccountModal;