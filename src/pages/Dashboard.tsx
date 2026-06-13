import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import { supabase } from "@/integrations/supabase/client";
import AdSense from "@/components/AdSense";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import BottomNav from "@/components/BottomNav";
import { Wallet, Plus, Send, Gift, Trophy, Clock, Bell } from "lucide-react";
import { toast } from "sonner";
import type { Tables } from "@/integrations/supabase/types";

type Transaction = Tables<"transactions">;

const Dashboard = () => {
  const { currentUser, refreshUser, loading } = useUser();
  const navigate = useNavigate();
  const [recentTxns, setRecentTxns] = useState<Transaction[]>([]);
  const [addAmount, setAddAmount] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [payOpen, setPayOpen] = useState(false);
  const [payPhone, setPayPhone] = useState("");
  const [payAmount, setPayAmount] = useState("");

  useEffect(() => {
    if (!loading && !currentUser) navigate("/");
  }, [currentUser, loading, navigate]);

  useEffect(() => {
    if (!currentUser) return;
    supabase.from("transactions").select("*").eq("user_id", currentUser.id).order("created_at", { ascending: false }).limit(5)
      .then(({ data }) => { if (data) setRecentTxns(data); });
  }, [currentUser]);

  const handleAddMoney = async () => {
    if (!currentUser || !addAmount) return;
    const amt = Number(addAmount);
    if (amt <= 0) return;
    await supabase.from("users").update({ wallet_balance: currentUser.wallet_balance + amt }).eq("id", currentUser.id);
    await supabase.from("transactions").insert({ user_id: currentUser.id, type: "credit", amount: amt, description: "Added money to wallet" });
    await refreshUser();
    setAddAmount("");
    setAddOpen(false);
    toast.success(`₹${amt} added to wallet!`);
    const { data } = await supabase.from("transactions").select("*").eq("user_id", currentUser.id).order("created_at", { ascending: false }).limit(5);
    if (data) setRecentTxns(data);
  };

  const handlePay = async () => {
    if (!currentUser || !payAmount || !payPhone) return;
    const amt = Number(payAmount);
    if (amt <= 0 || amt > currentUser.wallet_balance) { toast.error("Insufficient balance"); return; }
    await supabase.from("users").update({ wallet_balance: currentUser.wallet_balance - amt }).eq("id", currentUser.id);
    await supabase.from("transactions").insert({ user_id: currentUser.id, type: "payment", amount: amt, description: `Payment to ${payPhone}`, recipient_phone: payPhone });
    await refreshUser();
    setPayAmount(""); setPayPhone(""); setPayOpen(false);
    toast.success("Payment successful! ✅");
    const { data } = await supabase.from("transactions").select("*").eq("user_id", currentUser.id).order("created_at", { ascending: false }).limit(5);
    if (data) setRecentTxns(data);
  };

  if (loading || !currentUser) return null;

  const quickActions = [
    { icon: Plus, label: "Add Money", action: () => setAddOpen(true) },
    { icon: Send, label: "Pay", action: () => setPayOpen(true) },
    { icon: Gift, label: "Redeem", action: () => navigate("/redeem") },
    { icon: Trophy, label: "Board", action: () => navigate("/leaderboard") },
  ];

  const txnColor = (type: string) => {
    if (type === "credit" || type === "redeem") return "text-green-500";
    return "text-red-500";
  };

  return (
    <div className="mx-auto min-h-screen max-w-md pb-20">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <div className="wallet-gradient flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-primary-foreground">
            {currentUser.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Good day,</p>
            <p className="font-semibold">{currentUser.name}</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={() => toast.info("No new notifications")}>
          <Bell className="h-5 w-5" />
        </Button>
      </div>

      {/* Balance Card */}
      <div className="px-4">
        <Card className="wallet-gradient border-0 text-primary-foreground animate-scale-in">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 text-sm opacity-90">
              <Wallet className="h-4 w-4" /> Total Balance
            </div>
            <div className="mt-2 text-3xl font-bold animate-count">
              ₹{Number(currentUser.wallet_balance).toLocaleString("en-IN")}
            </div>
            <p className="mt-1 text-xs opacity-75">DigiWallet • UPI Enabled</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-4 gap-3 px-4 py-6">
        {quickActions.map(({ icon: Icon, label, action }) => (
          <button key={label} onClick={action} className="flex flex-col items-center gap-1.5 rounded-xl bg-card p-3 shadow-sm transition-transform active:scale-95">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <Icon className="h-5 w-5 text-primary" />
            </div>
            <span className="text-xs font-medium">{label}</span>
          </button>
        ))}
      </div>

      {/* Recent Transactions */}
      <div className="px-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-semibold">Recent Activity</h2>
          <button onClick={() => navigate("/history")} className="text-xs text-primary">See all</button>
        </div>
        {recentTxns.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">No transactions yet</p>
        ) : (
          <div className="space-y-2">
            {recentTxns.map(txn => (
              <div key={txn.id} className="flex items-center justify-between rounded-lg bg-card p-3 shadow-sm animate-slide-up">
                <div className="flex items-center gap-3">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-full ${txn.type === "credit" || txn.type === "redeem" ? "bg-green-100" : "bg-red-100"}`}>
                    <Clock className={`h-4 w-4 ${txnColor(txn.type)}`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{txn.description}</p>
                    <p className="text-xs text-muted-foreground">{new Date(txn.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <span className={`font-semibold ${txnColor(txn.type)}`}>
                  {txn.type === "credit" || txn.type === "redeem" ? "+" : "-"}₹{txn.amount}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Money Dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Add Money</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <Input type="number" placeholder="Enter amount (₹)" value={addAmount} onChange={e => setAddAmount(e.target.value)} />
            <div className="flex gap-2">
              {[100, 500, 1000, 2000].map(v => (
                <Button key={v} variant="outline" size="sm" onClick={() => setAddAmount(String(v))}>₹{v}</Button>
              ))}
            </div>
            <Button className="w-full" onClick={handleAddMoney}>Add ₹{addAmount || "0"}</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Pay Dialog */}
      <Dialog open={payOpen} onOpenChange={setPayOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Send Payment</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <Input placeholder="Phone number" value={payPhone} onChange={e => setPayPhone(e.target.value)} />
            <Input type="number" placeholder="Amount (₹)" value={payAmount} onChange={e => setPayAmount(e.target.value)} />
            <Button className="w-full" onClick={handlePay} disabled={!payPhone || !payAmount}>Pay ₹{payAmount || "0"}</Button>
          </div>
        </DialogContent>
      </Dialog>

      <BottomNav />
    </div>
  );
};

export default Dashboard;
