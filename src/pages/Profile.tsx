import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useUser } from "@/contexts/UserContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BottomNav from "@/components/BottomNav";
import { toast } from "sonner";
import { LogOut, Moon, Sun, Palette } from "lucide-react";

const Profile = () => {
  const { currentUser, refreshUser, logout, loading } = useUser();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [dark, setDark] = useState(false);

  useEffect(() => { if (!loading && !currentUser) navigate("/"); }, [currentUser, loading, navigate]);
  useEffect(() => { if (currentUser) setName(currentUser.name); }, [currentUser]);
  useEffect(() => {
    const isDark = localStorage.getItem("wallet_dark") === "true";
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  const toggleDark = () => {
    const next = !dark;
    setDark(next);
    localStorage.setItem("wallet_dark", String(next));
    document.documentElement.classList.toggle("dark", next);
  };

  const saveName = async () => {
    if (!currentUser || !name.trim()) return;
    await supabase.from("users").update({ name: name.trim() }).eq("id", currentUser.id);
    await refreshUser();
    toast.success("Profile updated!");
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (!currentUser) return null;

  return (
    <div className="mx-auto min-h-screen max-w-md pb-20">
      <div className="p-4">
        <h1 className="text-xl font-bold">Profile</h1>
        <p className="text-sm text-muted-foreground">Customize your wallet</p>
      </div>
      <div className="space-y-4 px-4">
        {/* Avatar & Name */}
        <Card>
          <CardContent className="flex flex-col items-center gap-4 p-6">
            <div className="wallet-gradient flex h-20 w-20 items-center justify-center rounded-full text-2xl font-bold text-primary-foreground">
              {currentUser.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex w-full gap-2">
              <Input value={name} onChange={e => setName(e.target.value)} />
              <Button onClick={saveName} size="sm">Save</Button>
            </div>
          </CardContent>
        </Card>

        {/* Theme */}
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Palette className="h-4 w-4" /> Theme</CardTitle></CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full justify-between" onClick={toggleDark}>
              <span>{dark ? "Dark Mode" : "Light Mode"}</span>
              {dark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </Button>
          </CardContent>
        </Card>

        {/* Logout */}
        <Button variant="destructive" className="w-full" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" /> Sign Out
        </Button>
      </div>
      <BottomNav />
    </div>
  );
};

export default Profile;
