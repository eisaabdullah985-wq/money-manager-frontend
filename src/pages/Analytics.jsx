import React, { useEffect, useState, useMemo, useCallback } from 'react';
import axios from 'axios';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { 
  TrendingUp, BarChart3, Loader2, Briefcase, 
  User, ArrowUpRight, ArrowDownRight, IndianRupee, Calendar, LayoutGrid 
} from 'lucide-react';

// Expanded color palette for better differentiation
const COLORS = [
  '#6366f1', // Indigo
  '#f43f5e', // Rose
  '#10b981', // Emerald
  '#f7b442', // Amber
  '#ae8ef8', // Violet
  '#06b6d4', // Cyan
  '#ec4899', // Pink
  '#f97316'  // Orange
];

const Analytics = () => {
  const [rawStats, setRawStats] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [division, setDivision] = useState('personal');
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    category: 'all',
    timeframe: 'monthly'
  });

  const summary = useMemo(() => {
    const income = rawStats
      .filter(item => item._id?.type === 'income')
      .reduce((acc, curr) => acc + curr.total, 0);
    const expense = rawStats
      .filter(item => item._id?.type === 'expense')
      .reduce((acc, curr) => acc + curr.total, 0);
    return { income, expense, savings: income - expense };
  }, [rawStats]);

  /**
   * FIX: Strictly Dynamic Data Range
   * Only renders months that exist in the filtered rawStats.
   */
  const chartData = useMemo(() => {
    if (!rawStats || rawStats.length === 0) return [];

    // 1. Map raw data for easy lookup
    const dataMap = {};
    rawStats.forEach(item => {
      const key = `${item._id.year}-${item._id.month}`;
      if (!dataMap[key]) dataMap[key] = { income: 0, expense: 0 };
      if (item._id.type === 'income') dataMap[key].income = item.total;
      if (item._id.type === 'expense') dataMap[key].expense = item.total;
    });

    const finalData = [];

    // 2. CHECK: Is a specific date range selected?
    if (filters.startDate && filters.endDate) {
      const start = new Date(filters.startDate);
      const end = new Date(filters.endDate);
      
      // Calculate how many months are in the selected range
      const monthDiff = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());

      // If range is small (same month), just show that month
      // Otherwise, iterate through the specific months selected
      for (let i = 0; i <= monthDiff; i++) {
        const targetDate = new Date(start.getFullYear(), start.getMonth() + i, 1);
        const year = targetDate.getFullYear();
        const month = targetDate.getMonth() + 1;
        const key = `${year}-${month}`;

        finalData.push({
          name: targetDate.toLocaleString('default', { month: 'short', year: '2-digit' }),
          income: dataMap[key]?.income || 0,
          expense: dataMap[key]?.expense || 0
        });
      }
    } else {
      // 3. DEFAULT: Sliding 12-Month Window logic
      const now = new Date();
      let endYear = now.getFullYear();
      let endMonth = now.getMonth();

      for (let i = 11; i >= 0; i--) {
        const targetDate = new Date(endYear, endMonth - i, 1);
        const year = targetDate.getFullYear();
        const month = targetDate.getMonth() + 1;
        const key = `${year}-${month}`;

        finalData.push({
          name: targetDate.toLocaleString('default', { month: 'short', year: '2-digit' }),
          income: dataMap[key]?.income || 0,
          expense: dataMap[key]?.expense || 0
        });
      }
    }

    return finalData;
  }, [rawStats, filters.startDate, filters.endDate]);

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      const API_BASE_URL = import.meta.env.VITE_API_URL;
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      if (!userInfo?.token) return;
      const config = { headers: { Authorization: `Bearer ${userInfo?.token}` } };
      
      const queryParams = new URLSearchParams({
        division,
        startDate: filters.startDate || '',
        endDate: filters.endDate || '',
        category: filters.category !== 'all' ? filters.category : '',
        timeframe: 'monthly'
      }).toString();

      const [statsRes, catRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/transactions/stats?${queryParams}`, config),
        axios.get(`${API_BASE_URL}/api/transactions/category-summary?${queryParams}`, config)
      ]);

      setRawStats(statsRes.data?.data || []);
      setPieData((catRes.data?.data || [])
        .filter(item => item._id?.type === 'expense')
        .map(item => ({ name: item._id.category, value: item.total }))
      );
      setError(null);
    } catch (err) {
      setError("Sync Interrupted.");
    } finally {
      setLoading(false);
    }
  }, [division, filters]);

  useEffect(() => {
    fetchAnalytics();
  }, [division, filters.startDate, filters.endDate, filters.category]); // Automatic fetch when toggling Personal/Office

  return (
    <div className="p-4 md:p-10 lg:p-14 space-y-10 max-w-7xl mx-auto">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic text-white leading-none">Analytics</h1>
          <p className="text-slate-500 font-bold text-[10px] tracking-[0.3em] uppercase mt-3">Visual Ledger Management</p>
        </div>

        <div className="flex p-1.5 bg-slate-900 border border-white/10 rounded-2xl w-fit">
          {['personal', 'office'].map((type) => (
            <button
              key={type}
              onClick={() => setDivision(type)}
              className={`flex items-center gap-2 px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                division === type 
                  ? 'bg-indigo-600 text-white shadow-[0_0_20px_rgba(79,70,229,0.4)]' 
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {type === 'personal' ? <User size={14} /> : <Briefcase size={14} />}
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SummaryCard label="Inflow" value={summary.income} icon={<ArrowUpRight className="text-emerald-400" />} color="text-emerald-400" />
        <SummaryCard label="Burn" value={summary.expense} icon={<ArrowDownRight className="text-rose-400" />} color="text-rose-400" />
        <SummaryCard label="Net Liquidity" value={summary.savings} icon={<IndianRupee className="text-indigo-400" />} isBalance />
      </div>

      {/* FILTER BAR */}
      <div className="bg-slate-900/40 border border-white/5 p-6 rounded-[2rem] backdrop-blur-xl flex flex-wrap items-end gap-6">
        <div className="space-y-2">
          <label className="text-[9px] font-black uppercase text-slate-500 flex items-center gap-2 ml-1">
            <Calendar size={12} /> Timeframe
          </label>
          <div className="flex items-center bg-black/20 border border-white/5 rounded-xl px-4 py-2 gap-3">
            <input 
              type="date" 
              value={filters.startDate}
              className="bg-transparent text-white text-[10px] font-bold outline-none [color-scheme:dark]" 
              onChange={(e) => setFilters(prev => ({...prev, startDate: e.target.value}))}
            />
            <span className="text-slate-600">/</span>
            <input 
              type="date" 
              value={filters.endDate}
              className="bg-transparent text-white text-[10px] font-bold outline-none [color-scheme:dark]" 
              onChange={(e) => setFilters(prev => ({...prev, endDate: e.target.value}))}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[9px] font-black uppercase text-slate-500 flex items-center gap-2 ml-1">
            <LayoutGrid size={12} /> Sector
          </label>
          <select 
            className="bg-black/20 border border-white/5 rounded-xl px-4 py-3 text-[10px] font-black uppercase text-white outline-none"
            onChange={(e) => setFilters(prev => ({...prev, category: e.target.value}))}
          >
            <option value="all">All Categories</option>
            {['salary', 'food', 'fuel', 'movie', 'loan', 'medical', 'other'].map(cat => (
              <option className='text-black' key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <button 
          onClick={fetchAnalytics} 
          className="bg-white text-black px-8 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-500 hover:text-white transition-all ml-auto"
        >
          {loading ? "Syncing..." : "Sync Metrics"}
        </button>
        <button 
          onClick={() => setFilters({ startDate: '', endDate: '', category: 'all' })}
          className="text-[9px] font-black uppercase text-slate-500 hover:text-white transition-colors mb-4 ml-2"
        >
          Reset
        </button>
      </div>

      {/* 4. CHARTS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* AREA CHART - Spans 2 columns on large screens */}
        <div className="lg:col-span-2 bg-slate-900/40 border border-white/5 rounded-[2.5rem] p-8 backdrop-blur-md flex flex-col justify-between">
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-8 flex items-center gap-2">
              <TrendingUp size={14} className="text-indigo-500" /> Cash Flow Dynamics
            </h3>
            <div className="h-80 w-full">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorInc" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="name" stroke="#475569" fontSize={10} fontWeight="black" axisLine={false} tickLine={false} />
                    <YAxis stroke="#475569" fontSize={10} fontWeight="black" axisLine={false} tickLine={false} tickFormatter={(val) => `₹${val/1000}k`} />
                    <Tooltip content={<CustomTooltip />} cursor={{stroke: 'rgba(255,255,255,0.1)', strokeWidth: 2}} />
                    <Area type="monotone" dataKey="income" stroke="#10b981" strokeWidth={4} fillOpacity={1} fill="url(#colorInc)" />
                    <Area type="monotone" dataKey="expense" stroke="#f43f5e" strokeWidth={4} fillOpacity={1} fill="url(#colorExp)" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-600 text-[10px] font-black uppercase">No flow data</div>
              )}
            </div>
          </div>
        </div>

        {/* PIE CHART - Spans 1 column */}
        <div className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] p-8 backdrop-blur-md flex flex-col">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-8 flex items-center gap-2">
            <BarChart3 size={14} className="text-rose-500" /> Resource Allocation
          </h3>
          <div className="h-64 w-full relative">
            {pieData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie 
                      data={pieData} 
                      innerRadius={65} 
                      outerRadius={85} 
                      paddingAngle={8} 
                      dataKey="value" 
                      stroke="none"
                    >
                      {pieData.map((_, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
                    </Pie>
                    <Tooltip content={<CustomTooltip isPie />} />
                  </PieChart>
                </ResponsiveContainer>
                {/* Center Value Display */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-[8px] font-black uppercase text-slate-500">Total Out</span>
                  <span className="text-lg font-black italic text-white">₹{summary.expense.toLocaleString()}</span>
                </div>
              </>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-600 text-[10px] font-black uppercase">No sector data</div>
            )}
          </div>
          
          {/* LEGEND - Stacked for narrow column */}
          <div className="mt-auto pt-6 space-y-3">
            {pieData.slice(0, 5).map((entry, index) => (
              <div key={index} className="flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                  <span className="text-[9px] font-black uppercase text-slate-400 group-hover:text-white transition-colors">{entry.name}</span>
                </div>
                <span className="text-[9px] font-bold text-slate-500">
                  {((entry.value / summary.expense) * 100).toFixed(0)}%
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

const SummaryCard = ({ label, value, icon, isBalance, color="text-white" }) => (
  <div className="bg-white/5 border border-white/5 p-6 rounded-3xl group hover:bg-white/10 transition-all">
    <div className="flex justify-between items-start mb-4">
      <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">{label}</span>
      {icon}
    </div>
    <div className={`text-2xl font-black italic tracking-tighter ${isBalance ? 'text-indigo-400' : color}`}>
      ₹{value.toLocaleString('en-IN')}
    </div>
  </div>
);

const CustomTooltip = ({ active, payload, label, isPie }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-950 border border-white/10 p-4 rounded-2xl shadow-2xl backdrop-blur-md">
        <p className="text-[9px] font-black uppercase text-slate-500 mb-2">{isPie ? payload[0].name : label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-4 justify-between">
            <span className="text-[8px] font-black uppercase" style={{ color: entry.color || entry.payload.fill }}>{entry.name}:</span>
            <span className="text-sm font-black italic text-white">₹{entry.value.toLocaleString('en-IN')}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default Analytics;