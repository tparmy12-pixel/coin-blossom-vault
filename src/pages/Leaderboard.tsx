import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import { supabase } from "@/integrations/supabase/client";
import BottomNav from "@/components/BottomNav";
import { Trophy, Medal } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type User = Tables<"users">;

const medals = ["🥇", "🥈", "🥉"];

const Leaderboard = () => {
  const { currentUser, loading } = useUser();
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => { if (!loading && !currentUser) navigate("/"); }, [currentUser, loading, navigate]);

  useEffect(() => {
    supabase.from("users").select("*").order("wallet_balance", { ascending: false }).limit(20)
      .then(({ data }) => { if (data) setUsers(data); });
  }, []);

  if (!currentUser) return null;

  const top3 = users.slice(0, 3);
  const rest = users.slice(3);

  return (
    <div className="mx-auto min-h-screen max-w-md pb-20">
      <div className="p-4">
        <h1 className="text-xl font-bold">Leaderboard</h1>
        <p className="text-sm text-muted-foreground">Top wallet users</p>
      </div>

      {/* Podium */}
      {top3.length >= 3 && (
        <div className="flex items-end justify-center gap-3 px-4 pb-6">
          {[1, 0, 2].map(idx => {
            const u = top3[idx];
            const height = idx === 0 ? "h-28" : idx === 1 ? "h-20" : "h-16";
            return (
              <div key={u.id} className="flex flex-col items-center animate-slide-up">
                <div className="wallet-gradient mb-2 flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold text-primary-foreground">
                  {u.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-xs font-medium">{u.name}</span>
                <span className="text-lg">{medals[idx]}</span>
                <div className={`${height} w-16 rounded-t-lg wallet-gradient flex items-center justify-center`}>
                  <span className="text-xs font-bold text-primary-foreground">₹{Number(u.wallet_balance).toLocaleString("en-IN")}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Rest */}
      <div className="space-y-2 px-4">
        {rest.map((u, i) => (
          <div key={u.id} className={`flex items-center justify-between rounded-lg bg-card p-3 shadow-sm ${u.id === currentUser.id ? "ring-2 ring-primary" : ""}`}>
            <div className="flex items-center gap-3">
              <span className="w-6 text-center text-sm font-bold text-muted-foreground">{i + 4}</span>
              <div className="wallet-gradient flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-primary-foreground">
                {u.name.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm font-medium">{u.name}</span>
            </div>
            <span className="font-semibold">₹{Number(u.wallet_balance).toLocaleString("en-IN")}</span>
          </div>
        ))}
      </div>
      <BottomNav />
    </div>
  );
};

export default Leaderboard;
