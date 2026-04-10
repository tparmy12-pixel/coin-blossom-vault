import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/contexts/UserContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, Plus, LogIn } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type User = Tables<"users">;

const Login = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [newName, setNewName] = useState("");
  const [showCreate, setShowCreate] = useState(false);
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
    await login(userId);
    navigate("/dashboard");
  };

  const handleCreate = async () => {
    if (!newName.trim()) return;
    const { data } = await supabase.from("users").insert({ name: newName.trim() }).select().single();
    if (data) {
      await login(data.id);
      navigate("/dashboard");
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
            <div className="flex gap-2 pt-2">
              <Input placeholder="Your name" value={newName} onChange={e => setNewName(e.target.value)} onKeyDown={e => e.key === "Enter" && handleCreate()} />
              <Button onClick={handleCreate} size="sm">Go</Button>
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
