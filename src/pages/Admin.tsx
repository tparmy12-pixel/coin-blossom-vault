import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BottomNav from "@/components/BottomNav";
import { toast } from "sonner";
import { Plus, Trash2, Users, Tag, BarChart3 } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";
import { getWithdrawals, saveWithdrawals, getSupport, addSupport, Withdrawal, SupportMsg } from "@/lib/demoCodes";

type User = Tables<"users">;
type RedeemCode = Tables<"redeem_codes">;
type Referral = Tables<"referrals">;
type LoginLog = Tables<"login_logs">;

const Admin = () => {
  const { currentUser, isAdmin, loading } = useUser();
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [codes, setCodes] = useState<RedeemCode[]>([]);
  const [codeOpen, setCodeOpen] = useState(false);
  const [newCode, setNewCode] = useState({ code: "", reward_amount: "", expiry_date: "", max_usage: "1" });
  const [balanceOpen, setBalanceOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [balanceChange, setBalanceChange] = useState("");
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [support, setSupport] = useState<SupportMsg[]>([]);
  const [reply, setReply] = useState("");
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loginLogs, setLoginLogs] = useState<LoginLog[]>([]);
  const [limitOpen, setLimitOpen] = useState(false);
  const [limitValue, setLimitValue] = useState("");

  useEffect(() => {
    if (!loading && (!currentUser || !isAdmin)) { navigate("/dashboard"); return; }
  }, [currentUser, isAdmin, loading, navigate]);

  const fetchData = async () => {
    const [u, c, r, l] = await Promise.all([
      supabase.from("users").select("*").order("wallet_balance", { ascending: false }),
      supabase.from("redeem_codes").select("*").order("created_at", { ascending: false }),
      supabase.from("referrals").select("*").order("created_at", { ascending: false }),
      supabase.from("login_logs").select("*").order("created_at", { ascending: false }).limit(100),
    ]);
    if (u.data) setUsers(u.data);
    if (c.data) setCodes(c.data);
    if (r.data) setReferrals(r.data);
    if (l.data) setLoginLogs(l.data);
  };

  useEffect(() => { if (isAdmin) fetchData(); }, [isAdmin]);

  useEffect(() => {
    if (!isAdmin) return;
    const refresh = () => { setWithdrawals(getWithdrawals()); setSupport(getSupport()); };
    refresh();
    const i = setInterval(refresh, 1500);
    return () => clearInterval(i);
  }, [isAdmin]);

  const updateWithdrawal = (id: string, status: "approved" | "rejected") => {
    const list = getWithdrawals().map(w => w.id === id ? { ...w, status } : w);
    saveWithdrawals(list);
    setWithdrawals(list);
    toast.success(`Request ${status}`);
  };

  const sendReply = () => {
    if (!reply.trim()) return;
    addSupport("admin", reply.trim());
    setReply("");
    setSupport(getSupport());
  };

  const createCode = async () => {
    if (!newCode.code || !newCode.reward_amount || !newCode.expiry_date) return;
    await supabase.from("redeem_codes").insert({
      code: newCode.code.toUpperCase(),
      reward_amount: Number(newCode.reward_amount),
      expiry_date: newCode.expiry_date,
      max_usage: Number(newCode.max_usage),
      created_by: currentUser!.id,
    });
    setNewCode({ code: "", reward_amount: "", expiry_date: "", max_usage: "1" });
    setCodeOpen(false);
    toast.success("Code created!");
    fetchData();
  };

  const deleteCode = async (id: string) => {
    await supabase.from("redeem_codes").delete().eq("id", id);
    toast.success("Code deleted");
    fetchData();
  };

  const adjustBalance = async () => {
    if (!selectedUser || !balanceChange) return;
    const change = Number(balanceChange);
    const newBal = selectedUser.wallet_balance + change;
    if (newBal < 0) { toast.error("Balance cannot go negative"); return; }
    await supabase.from("users").update({ wallet_balance: newBal }).eq("id", selectedUser.id);
    await supabase.from("transactions").insert({
      user_id: selectedUser.id,
      type: change > 0 ? "credit" : "debit",
      amount: Math.abs(change),
      description: `Admin ${change > 0 ? "added" : "deducted"} ₹${Math.abs(change)}`,
    });
    setBalanceOpen(false); setBalanceChange(""); setSelectedUser(null);
    toast.success("Balance updated!");
    fetchData();
  };

  const updateLimit = async () => {
    if (!selectedUser || !limitValue) return;
    await supabase.from("users").update({ limit_amount: Number(limitValue) }).eq("id", selectedUser.id);
    setLimitOpen(false); setLimitValue(""); setSelectedUser(null);
    toast.success("Limit updated!");
    fetchData();
  };

  if (loading || !isAdmin) return null;

  const totalBalance = users.reduce((s, u) => s + Number(u.wallet_balance), 0);
  const activeCodes = codes.filter(c => new Date(c.expiry_date) > new Date()).length;
  const userById = (id: string) => users.find(u => u.id === id);

  return (
    <div className="mx-auto min-h-screen max-w-md pb-20">
      <div className="p-4">
        <h1 className="text-xl font-bold">Admin Panel</h1>
        <p className="text-sm text-muted-foreground">Manage wallet system</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 px-4 pb-4">
        {[
          { label: "Users", value: users.length, icon: Users },
          { label: "Circulation", value: `₹${totalBalance.toLocaleString("en-IN")}`, icon: BarChart3 },
          { label: "Active Codes", value: activeCodes, icon: Tag },
        ].map(({ label, value, icon: Icon }) => (
          <Card key={label}>
            <CardContent className="flex flex-col items-center p-3">
              <Icon className="h-5 w-5 text-primary" />
              <span className="mt-1 text-lg font-bold">{value}</span>
              <span className="text-xs text-muted-foreground">{label}</span>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="codes" className="px-4">
        <TabsList className="grid w-full grid-cols-6 text-[11px]">
          <TabsTrigger value="codes" className="flex-1">Codes</TabsTrigger>
          <TabsTrigger value="users" className="flex-1">Users</TabsTrigger>
          <TabsTrigger value="referrals" className="flex-1">Refs</TabsTrigger>
          <TabsTrigger value="logins" className="flex-1">Logins</TabsTrigger>
          <TabsTrigger value="withdrawals" className="flex-1">Cashout</TabsTrigger>
          <TabsTrigger value="support" className="flex-1">Support</TabsTrigger>
        </TabsList>

        <TabsContent value="codes" className="space-y-3">
          <Button size="sm" onClick={() => setCodeOpen(true)} className="w-full"><Plus className="mr-1 h-4 w-4" /> Create Code</Button>
          {codes.map(c => (
            <Card key={c.id}>
              <CardContent className="flex items-center justify-between p-3">
                <div>
                  <p className="font-mono font-bold">{c.code}</p>
                  <p className="text-xs text-muted-foreground">₹{c.reward_amount} • {c.current_usage}/{c.max_usage} used • Exp: {new Date(c.expiry_date).toLocaleDateString()}</p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => deleteCode(c.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="users" className="space-y-2">
          {users.map(u => (
            <Card key={u.id}>
              <CardContent className="p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{u.name}</p>
                    <p className="text-[11px] text-muted-foreground">
                      ₹{Number(u.wallet_balance).toLocaleString("en-IN")} · Limit ₹{Number(u.limit_amount).toLocaleString("en-IN")}
                    </p>
                    <p className="text-[10px] text-muted-foreground truncate">
                      Code: <span className="font-mono">{u.referral_code ?? "-"}</span> · {u.district ?? "-"}, {u.state ?? "-"} {u.pin_code ?? ""}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <Button size="sm" variant="outline" className="h-7 text-[10px]" onClick={() => { setSelectedUser(u); setBalanceOpen(true); }}>₹</Button>
                    <Button size="sm" variant="outline" className="h-7 text-[10px]" onClick={() => { setSelectedUser(u); setLimitValue(String(u.limit_amount)); setLimitOpen(true); }}>Limit</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="referrals" className="space-y-2">
          <Card><CardContent className="grid grid-cols-2 gap-2 p-3 text-center">
            <div><p className="text-lg font-bold">{referrals.length}</p><p className="text-[10px] text-muted-foreground">Total Referrals</p></div>
            <div><p className="text-lg font-bold">₹{referrals.reduce((s,r)=>s+Number(r.reward_amount),0).toLocaleString("en-IN")}</p><p className="text-[10px] text-muted-foreground">Total Rewards</p></div>
          </CardContent></Card>
          {referrals.length === 0 && <p className="text-center text-xs text-muted-foreground py-4">No referrals yet.</p>}
          {referrals.map(r => (
            <Card key={r.id}><CardContent className="p-3 text-xs">
              <p><span className="text-muted-foreground">Referrer:</span> <span className="font-medium">{userById(r.referrer_id)?.name ?? "—"}</span> ({userById(r.referrer_id)?.referral_code ?? "—"})</p>
              <p><span className="text-muted-foreground">Joined:</span> <span className="font-medium">{userById(r.referee_id)?.name ?? "—"}</span></p>
              <p className="text-[10px] text-muted-foreground">+₹{Number(r.reward_amount)} · {new Date(r.created_at).toLocaleString("en-IN")}</p>
            </CardContent></Card>
          ))}
        </TabsContent>

        <TabsContent value="logins" className="space-y-2">
          {loginLogs.length === 0 && <p className="text-center text-xs text-muted-foreground py-4">No login activity.</p>}
          {loginLogs.map(l => (
            <Card key={l.id}><CardContent className="p-3 text-xs">
              <p className="font-medium">{userById(l.user_id)?.name ?? l.user_id.slice(0,8)}</p>
              <p className="text-[10px] text-muted-foreground">{new Date(l.created_at).toLocaleString("en-IN")}</p>
              {l.user_agent && <p className="truncate text-[10px] text-muted-foreground">{l.user_agent}</p>}
            </CardContent></Card>
          ))}
        </TabsContent>

        <TabsContent value="withdrawals" className="space-y-2">
          {withdrawals.length === 0 && <p className="text-center text-xs text-muted-foreground py-4">No withdrawal requests.</p>}
          {withdrawals.map(w => (
            <Card key={w.id}>
              <CardContent className="p-3">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold">₹{w.amount.toLocaleString("en-IN")}</p>
                    <p className="text-[11px] text-muted-foreground">{w.upi}</p>
                    <p className="text-[10px] text-muted-foreground">{new Date(w.at).toLocaleString("en-IN")}</p>
                  </div>
                  <span className={`text-[10px] font-bold uppercase ${w.status === "pending" ? "text-amber-600" : w.status === "approved" ? "text-green-600" : "text-destructive"}`}>{w.status}</span>
                </div>
                {w.status === "pending" && (
                  <div className="mt-2 flex gap-2">
                    <Button size="sm" className="flex-1" onClick={() => updateWithdrawal(w.id, "approved")}>Approve</Button>
                    <Button size="sm" variant="outline" className="flex-1" onClick={() => updateWithdrawal(w.id, "rejected")}>Reject</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="support" className="space-y-2">
          <Card>
            <CardContent className="p-3">
              <div className="max-h-72 space-y-2 overflow-y-auto">
                {support.length === 0 && <p className="text-center text-xs text-muted-foreground py-4">No messages yet.</p>}
                {support.map(m => (
                  <div key={m.id} className={`flex ${m.from === "admin" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[80%] rounded-2xl px-3 py-1.5 text-xs ${m.from === "admin" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                      {m.text}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex gap-2">
                <Input placeholder="Reply to user…" value={reply} onChange={e => setReply(e.target.value)} onKeyDown={e => e.key === "Enter" && sendReply()} />
                <Button size="sm" onClick={sendReply}>Send</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create Code Dialog */}
      <Dialog open={codeOpen} onOpenChange={setCodeOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Create Redeem Code</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <Input placeholder="Code (e.g. BONUS50)" value={newCode.code} onChange={e => setNewCode({ ...newCode, code: e.target.value })} />
            <Input type="number" placeholder="Reward amount (₹)" value={newCode.reward_amount} onChange={e => setNewCode({ ...newCode, reward_amount: e.target.value })} />
            <Input type="date" value={newCode.expiry_date} onChange={e => setNewCode({ ...newCode, expiry_date: e.target.value })} />
            <Input type="number" placeholder="Max usage" value={newCode.max_usage} onChange={e => setNewCode({ ...newCode, max_usage: e.target.value })} />
            <Button className="w-full" onClick={createCode}>Create Code</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Adjust Balance Dialog */}
      <Dialog open={balanceOpen} onOpenChange={setBalanceOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Adjust Balance — {selectedUser?.name}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">Current: ₹{selectedUser ? Number(selectedUser.wallet_balance).toLocaleString("en-IN") : 0}</p>
            <Input type="number" placeholder="Amount (+/-)" value={balanceChange} onChange={e => setBalanceChange(e.target.value)} />
            <div className="flex gap-2">
              <Button className="flex-1" onClick={adjustBalance}>Apply</Button>
              <Button variant="outline" className="flex-1" onClick={() => setBalanceOpen(false)}>Cancel</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Adjust Limit Dialog */}
      <Dialog open={limitOpen} onOpenChange={setLimitOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Set Limit — {selectedUser?.name}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <Input type="number" placeholder="Limit amount" value={limitValue} onChange={e => setLimitValue(e.target.value)} />
            <div className="flex gap-2">
              <Button className="flex-1" onClick={updateLimit}>Apply</Button>
              <Button variant="outline" className="flex-1" onClick={() => setLimitOpen(false)}>Cancel</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <BottomNav />
    </div>
  );
};

export default Admin;
