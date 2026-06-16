import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/contexts/UserContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, Plus, LogIn } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";
import { toast } from "sonner";

type User = Tables<"users">;

const genReferralCode = () => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < 8; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return s;
};

const Login = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({
    name: "", country: "India", state: "", district: "", pin_code: "", referral_code: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const { login, currentUser, loading } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && currentUser) navigate("/dashboard");
  }, [currentUser, loading, navigate]);

  useEffect(() => {
    supabase.from("users").select("*").order("created_at").then(({ data }) => {
      if (data) setUsers(data);
    });
  }, []);

  const handleLogin = async (userId: string) => {
    await supabase.from("login_logs").insert({ user_id: userId, user_agent: navigator.userAgent });
    await login(userId);
    navigate("/dashboard");
  };

  const handleCreate = async () => {
    if (!form.name.trim() || !form.state.trim() || !form.district.trim() || !form.pin_code.trim()) {
      toast.error("Please fill all required fields");
      return;
    }
    setSubmitting(true);
    try {
      let referrer: User | null = null;
      let limitAmount = 5000;
      if (form.referral_code.trim()) {
        const { data: ref } = await supabase
          .from("users").select("*")
          .eq("referral_code", form.referral_code.trim().toUpperCase())
          .maybeSingle();
        if (!ref) { toast.error("Invalid referral code"); setSubmitting(false); return; }
        referrer = ref as User;
        limitAmount = 6000;
      }

      // Generate a unique referral code
      let myCode = genReferralCode();
      for (let i = 0; i < 5; i++) {
        const { data: exists } = await supabase.from("users").select("id").eq("referral_code", myCode).maybeSingle();
        if (!exists) break;
        myCode = genReferralCode();
      }

      const { data, error } = await supabase.from("users").insert({
        name: form.name.trim(),
        country: form.country.trim(),
        state: form.state.trim(),
        district: form.district.trim(),
        pin_code: form.pin_code.trim(),
        referral_code: myCode,
        referred_by: referrer?.id ?? null,
        limit_amount: limitAmount,
      } as any).select().single();
      if (error || !data) { toast.error(error?.message ?? "Failed to create"); setSubmitting(false); return; }

      if (referrer) {
        // One-time reward; UNIQUE(referee_id) prevents duplicates
        const { error: refErr } = await supabase.from("referrals").insert({
          referrer_id: referrer.id, referee_id: data.id, reward_amount: 1000,
        } as any);
        if (!refErr) {
          await supabase.from("users")
            .update({ limit_amount: Number((referrer as any).limit_amount ?? 5000) + 1000 } as any)
            .eq("id", referrer.id);
        }
      }

      await supabase.from("login_logs").insert({ user_id: data.id, user_agent: navigator.userAgent });
      await login(data.id);
      toast.success(`Welcome! Your referral code: ${myCode}`);
      navigate("/dashboard");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="flex min-h-screen items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div>;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 animate-fade-in">
      <div className="mb-8 flex flex-col items-center gap-2">
        <div className="wallet-gradient flex h-16 w-16 items-center justify-center rounded-2xl">
          <Wallet className="h-8 w-8 text-primary-foreground" />
        </div>
        <h1 className="text-2xl font-bold">DigiWallet</h1>
        <p className="text-sm text-muted-foreground">Your Digital Payment Platform</p>
      </div>

      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-lg">Select Account</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {users.map(user => (
            <button
              key={user.id}
              onClick={() => handleLogin(user.id)}
              className="flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-colors hover:bg-accent"
            >
              <div className="wallet-gradient flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-primary-foreground">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <div className="font-medium">{user.name}</div>
                <div className="text-xs text-muted-foreground">₹{Number(user.wallet_balance).toLocaleString("en-IN")}</div>
              </div>
              <LogIn className="h-4 w-4 text-muted-foreground" />
            </button>
          ))}

          {showCreate ? (
            <div className="space-y-2 pt-2">
              <Input placeholder="Your name *" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              <div className="grid grid-cols-2 gap-2">
                <Input placeholder="Country *" value={form.country} onChange={e => setForm({ ...form, country: e.target.value })} />
                <Input placeholder="State *" value={form.state} onChange={e => setForm({ ...form, state: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Input placeholder="District/Area *" value={form.district} onChange={e => setForm({ ...form, district: e.target.value })} />
                <Input placeholder="PIN Code *" inputMode="numeric" value={form.pin_code} onChange={e => setForm({ ...form, pin_code: e.target.value })} />
              </div>
              <Input placeholder="Referral Code (optional)" value={form.referral_code} onChange={e => setForm({ ...form, referral_code: e.target.value.toUpperCase() })} />
              <p className="text-[10px] text-muted-foreground">Default limit ₹5,000 · with referral code ₹6,000</p>
              <Button className="w-full" disabled={submitting} onClick={handleCreate}>{submitting ? "Creating…" : "Create Account"}</Button>
            </div>
          ) : (
            <Button variant="outline" className="w-full" onClick={() => setShowCreate(true)}>
              <Plus className="mr-2 h-4 w-4" /> New Account
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
