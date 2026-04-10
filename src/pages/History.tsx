import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import { supabase } from "@/integrations/supabase/client";
import BottomNav from "@/components/BottomNav";
import { ArrowDownLeft, ArrowUpRight, Gift, Send } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Transaction = Tables<"transactions">;

const iconMap: Record<string, typeof ArrowDownLeft> = {
  credit: ArrowDownLeft,
  debit: ArrowUpRight,
  redeem: Gift,
  payment: Send,
};

const colorMap: Record<string, string> = {
  credit: "bg-green-100 text-green-600",
  debit: "bg-red-100 text-red-600",
  redeem: "bg-yellow-100 text-yellow-600",
  payment: "bg-red-100 text-red-600",
};

const History = () => {
  const { currentUser, loading } = useUser();
  const navigate = useNavigate();
  const [txns, setTxns] = useState<Transaction[]>([]);

  useEffect(() => { if (!loading && !currentUser) navigate("/"); }, [currentUser, loading, navigate]);

  useEffect(() => {
    if (!currentUser) return;
    supabase.from("transactions").select("*").eq("user_id", currentUser.id).order("created_at", { ascending: false })
      .then(({ data }) => { if (data) setTxns(data); });
  }, [currentUser]);

  if (!currentUser) return null;

  return (
    <div className="mx-auto min-h-screen max-w-md pb-20">
      <div className="p-4">
        <h1 className="text-xl font-bold">Transaction History</h1>
        <p className="text-sm text-muted-foreground">All your wallet activity</p>
      </div>
      <div className="space-y-2 px-4">
        {txns.length === 0 ? (
          <p className="py-16 text-center text-muted-foreground">No transactions yet</p>
        ) : txns.map(txn => {
          const Icon = iconMap[txn.type] || ArrowUpRight;
          const colors = colorMap[txn.type] || "bg-muted text-muted-foreground";
          const isPositive = txn.type === "credit" || txn.type === "redeem";
          return (
            <div key={txn.id} className="flex items-center justify-between rounded-lg bg-card p-3 shadow-sm animate-slide-up">
              <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-full ${colors}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium">{txn.description}</p>
                  <p className="text-xs text-muted-foreground">{new Date(txn.created_at).toLocaleString()}</p>
                </div>
              </div>
              <span className={`font-semibold ${isPositive ? "text-green-500" : "text-red-500"}`}>
                {isPositive ? "+" : "-"}₹{txn.amount}
              </span>
            </div>
          );
        })}
      </div>
      <BottomNav />
    </div>
  );
};

export default History;
