import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useUser } from "@/contexts/UserContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import BottomNav from "@/components/BottomNav";
import { Gift, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";
import { playRewardSound } from "@/lib/sounds";

const Redeem = () => {
  const { currentUser, refreshUser, loading } = useUser();
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { if (!loading && !currentUser) navigate("/"); }, [currentUser, loading, navigate]);

  const handleRedeem = async () => {
    if (!currentUser || !code.trim()) return;
    setSubmitting(true);
    try {
      const { data: codeData } = await supabase.from("redeem_codes").select("*").eq("code", code.trim().toUpperCase()).single();
      if (!codeData) { toast.error("Invalid Code", { description: "This redeem code does not exist." }); return; }
      if (new Date(codeData.expiry_date) < new Date()) { toast.error("Code Expired", { description: "This redeem code has expired." }); return; }
      if (codeData.current_usage >= codeData.max_usage) { toast.error("Code Exhausted", { description: "This code has reached its usage limit." }); return; }

      const { data: existing } = await supabase.from("redeem_usage").select("id").eq("code_id", codeData.id).eq("user_id", currentUser.id).single();
      if (existing) { toast.error("Already Used", { description: "You have already redeemed this code." }); return; }

      await supabase.from("redeem_usage").insert({ code_id: codeData.id, user_id: currentUser.id });
      await supabase.from("redeem_codes").update({ current_usage: codeData.current_usage + 1 }).eq("id", codeData.id);
      await supabase.from("users").update({ wallet_balance: currentUser.wallet_balance + codeData.reward_amount }).eq("id", currentUser.id);
      await supabase.from("transactions").insert({ user_id: currentUser.id, type: "redeem", amount: codeData.reward_amount, description: `Redeemed code: ${codeData.code}` });

      playRewardSound();
      await refreshUser();
      toast.success("Code Applied Successfully! 🎉", { description: `₹${codeData.reward_amount} added to your wallet!` });
      setCode("");
    } finally {
      setSubmitting(false);
    }
  };

  if (!currentUser) return null;

  return (
    <div className="mx-auto min-h-screen max-w-md pb-20">
      <div className="p-4">
        <h1 className="text-xl font-bold">Redeem Code</h1>
        <p className="text-sm text-muted-foreground">Enter a code to get rewards</p>
      </div>
      <div className="px-4">
        <Card className="animate-scale-in">
          <CardContent className="space-y-4 p-6">
            <div className="flex flex-col items-center gap-3">
              <div className="wallet-gradient flex h-16 w-16 items-center justify-center rounded-2xl">
                <Gift className="h-8 w-8 text-primary-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">Enter your reward code below</p>
            </div>
            <Input
              placeholder="e.g. WELCOME50"
              value={code}
              onChange={e => setCode(e.target.value.toUpperCase())}
              onKeyDown={e => e.key === "Enter" && handleRedeem()}
              className="text-center text-lg font-mono tracking-widest"
            />
            <Button className="w-full" onClick={handleRedeem} disabled={submitting || !code.trim()}>
              {submitting ? "Applying..." : "Apply Code"}
            </Button>
          </CardContent>
        </Card>
      </div>
      <BottomNav />
    </div>
  );
};

export default Redeem;
