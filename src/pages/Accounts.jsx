import { useEffect, useState } from "react";
import AccountCard from "../components/AccountCard";
import TransferModal from "../components/modals/TransferModal";
import AddAccountModal from "../components/modals/AddAccountModal";
import axios from "../api/axios";
import toast from "react-hot-toast";

const Accounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [netWorth, setNetWorth] = useState(0);
  const [showTransfer, setShowTransfer] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [showAddAccount, setShowAddAccount] = useState(false);

  const fetchAccounts = async () => {
    const res = await axios.get("/api/accounts");
    setAccounts(res.data?.data || []);
  };

  const fetchSummary = async () => {
    const res = await axios.get("/api/accounts/summary");
    setNetWorth(res.data?.data?.totalNetWorth || 0);
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([fetchAccounts(), fetchSummary()]);
      } catch (err) {
        console.error("Failed to sync system nodes:", err);
      }
    };
    loadData();
  }, []);

  const handleDeleteNode = async (accountId) => {
    // Cyber-finance themed confirmation
    if (!window.confirm("CAUTION: Decommissioning this node will erase all linked data. Proceed?")) {
      return;
    }

    try {
      await axios.delete(`/api/accounts/${accountId}`);
      
      // Optimistic Update: Remove from UI immediately
      setAccounts(accounts.filter(acc => acc._id !== accountId));
      
      // Refresh summary to update Net Worth
      fetchSummary();
      
      toast.success("Node Decommissioned Successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Protocol Failure: Could not delete node");
    }
  };

  const handleUpdateNode = async (accountId, updatedData) => {
    try {
      const res = await axios.put(`/api/accounts/${accountId}`, updatedData);
      if (res.data.success) {
        // Update local state so UI reflects changes immediately
        setAccounts(accounts.map(acc => acc._id === accountId ? res.data.data : acc));
        toast.success("Node Configuration Updated");
      }
    } catch (err) {
      toast.error("Failed to sync node overrides");
    }
  };

  return (
    <div className="p-4 md:p-10 lg:p-14 space-y-12 max-w-7xl mx-auto">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic text-white leading-none">Asset Nodes</h1>
          <p className="text-slate-500 font-bold text-[10px] tracking-[0.3em] uppercase mt-3">Total Net Liquidity: ₹{netWorth.toLocaleString()}</p>
        </div>

        <button
          onClick={() => setShowAddAccount(true)}
          className="bg-white text-black px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-500 hover:text-white transition-all shadow-xl"
        >
          + Provision New Node
        </button>
      </div>

      {/* QUICK STATS - Matching Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-indigo-600/10 border border-indigo-500/20 p-8 rounded-[2.5rem]">
            <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-2">Network Net Worth</p>
            <p className="text-4xl font-black italic text-white tracking-tighter">₹{netWorth.toLocaleString()}</p>
        </div>
        {/* You can add more cards here for 'Active Accounts' or 'Primary Asset' */}
      </div>

      {/* ACCOUNTS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {accounts.map(account => (
          <AccountCard
            key={account._id}
            account={account}
            onTransfer={() => {
              setSelectedAccount(account);
              setShowTransfer(true);
            }}
            onDelete={handleDeleteNode}
            onUpdate={handleUpdateNode}
          />
        ))}
      </div>

      {showTransfer && (
        <TransferModal
          isOpen={showTransfer} // This is the key!
          fromAccount={selectedAccount}
          accounts={accounts}
          onClose={() => setShowTransfer(false)}
          onSuccess={() => {
            fetchAccounts();
            fetchSummary();
          }}
        />
      )}

      {showAddAccount && (
        <AddAccountModal
          isOpen={showAddAccount} // Add this line
          onClose={() => setShowAddAccount(false)}
          onSuccess={() => {
            fetchAccounts();
            fetchSummary(); // Refresh net worth too!
          }}
        />
      )}
    </div>
  );
};

export default Accounts;
