import { useState, useEffect } from 'react';
import { X, IndianRupee, Briefcase, User, Loader2, Save, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

const AddTransactionModal = ({ isOpen, onClose, onRefresh, activeDivision, editData }) => {
  const [loading, setLoading] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [activeTab, setActiveTab] = useState('income');
  const API_BASE_URL = import.meta.env.VITE_API_URL
  const initialState = {
    description: '',
    amount: '',
    type: 'expense',
    category: 'other',
    division: activeDivision.toLowerCase(),
    date: new Date().toISOString().split('T')[0],
    paymentMethod: 'cash',
    accountId: ''
  };

  const [formData, setFormData] = useState(initialState);

  // --- SYNC STATE FOR EDIT MODE ---
  useEffect(() => {
    if (editData && isOpen) {
      setFormData({
        description: editData.description || '',
        amount: editData.amount || '',
        type: editData.type || 'expense',
        category: editData.category || 'other',
        division: editData.division || activeDivision.toLowerCase(),
        date: new Date(editData.date).toISOString().split('T')[0],
        paymentMethod: editData.paymentMethod || 'cash',
        accountId: editData.accountId || ''
      });
    } else if (isOpen) {
      setFormData({ ...initialState, division: activeDivision.toLowerCase() });
    }
  }, [editData, isOpen, activeDivision]);


  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const config = {
          headers: { Authorization: `Bearer ${userInfo?.token}` }
        };
        const res = await axios.get(`${API_BASE_URL}/api/accounts`, config);
        setAccounts(res.data.data);
      } catch (err) {
        console.error("Account sync failed", err);
      }
    };

    if (isOpen) fetchAccounts();
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL;
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));

      const payload = {
        ...formData,
        amount: Number(formData.amount),
        description: formData.description.trim(),
      };

      // Determine if we are UPDATING or CREATING
      const url = editData 
        ? `${API_BASE_URL}/api/transactions/${editData._id}`
        : `${API_BASE_URL}/api/transactions`;
      
      const method = editData ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userInfo?.token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(editData ? 'Ledger Updated' : 'Transaction Deployed');
        onRefresh();
        onClose();
      } else {
        toast.error(data.error || 'Validation Failed');
      }
    } catch (error) {
      toast.error('Network Link Severed');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-6">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-[#0a0f1d] border-t md:border border-white/10 rounded-t-[2.5rem] md:rounded-[2.5rem] p-8 animate-in slide-in-from-bottom duration-300">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-black uppercase italic text-white">
              {editData ? 'Modify Entry' : 'New Entry'}
            </h2>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              {editData ? `Record ID: ${editData._id.slice(-6)}` : 'Update Ledger'}
            </p>
          </div>
          <button onClick={onClose} className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors">
            <X size={20} className="text-slate-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Amount */}
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 bg-indigo-600 p-1 rounded-md shadow-lg shadow-indigo-600/20">
              <IndianRupee size={16} className="text-white" />
            </div>
            <input
              type="number"
              required
              step="0.01"
              placeholder="0.00"
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-14 text-3xl font-black text-white focus:border-indigo-500/50 outline-none transition-all"
              value={formData.amount}
              onChange={(e) => setFormData({...formData, amount: e.target.value})}
            />
          </div>

          {/* Description */}
          <input
            type="text"
            required
            placeholder="Description"
            className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 text-white font-medium focus:border-indigo-500/30 outline-none"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
          />

          {/* Date Picker */}
          <div className="space-y-1">
            <label className="text-[9px] font-bold text-slate-500 uppercase ml-1 text-white/40">Transaction Date</label>
            <input
              type="date"
              className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 text-white font-bold text-xs outline-none hover:border-white/20 transition-all [color-scheme:dark]"
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
            />
          </div>
          
          {/* Division Selector */}
          <div className="flex gap-2 p-1 bg-white/5 border border-white/10 rounded-xl">
            {['personal', 'office'].map((div) => (
              <button
                key={div}
                type="button"
                onClick={() => setFormData({...formData, division: div})}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                  formData.division === div 
                    ? 'bg-white text-black shadow-lg' 
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {div === 'personal' ? <User size={14} /> : <Briefcase size={14} />}
                {div}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Category */}
            <div className="space-y-1">
              <label className="text-[9px] font-bold text-slate-500 uppercase ml-1 text-white/40">Category</label>
              <select 
                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 text-white font-bold text-xs uppercase tracking-widest outline-none appearance-none cursor-pointer hover:border-white/20"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
              >
                {['food', 'fuel', 'movie', 'loan', 'medical', 'salary', 'rent', 'shopping', 'other'].map(cat => (
                  <option key={cat} value={cat} className="bg-[#0a0f1d]">{cat}</option>
                ))}
              </select>
            </div>

            {/* Type */}
            <div className="space-y-1">
              <label className="text-[9px] font-bold text-slate-500 uppercase ml-1 text-white/40">Entry Type</label>
              <select 
                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 text-white font-bold text-xs uppercase tracking-widest outline-none appearance-none cursor-pointer hover:border-white/20"
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
              >
                <option value="expense" className="bg-[#0a0f1d]">Expense</option>
                <option value="income" className="bg-[#0a0f1d]">Income</option>
              </select>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-indigo-500 transition-all transform active:scale-[0.98] disabled:opacity-50 shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-3"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : editData ? (
              <><Save size={20} /> Sync Changes</>
            ) : (
              <><Plus size={20} /> Deploy Entry</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddTransactionModal;