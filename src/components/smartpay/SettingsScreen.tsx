import { ArrowLeft, Moon, Sun, User, Bell, Lock, Globe, Shield, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useEffect, useState } from "react";

interface Props { onBack: () => void; onPrivacy: () => void; }

const SettingsScreen = ({ onBack, onPrivacy }: Props) => {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains("dark"));
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("prankpay_theme", dark ? "dark" : "light");
  }, [dark]);

  const items = [
    { icon: User, label: "Profile Settings" },
    { icon: Bell, label: "Notifications" },
    { icon: Lock, label: "Privacy & Security" },
    { icon: Globe, label: "Language: English" },
    { icon: Shield, label: "Privacy Policy", action: onPrivacy },
  ];

  return (
    <div className="mx-auto min-h-screen max-w-md bg-background pb-8">
      <div className="flex items-center gap-3 px-5 pt-6 pb-4">
        <Button variant="ghost" size="icon" onClick={onBack}><ArrowLeft className="h-5 w-5" /></Button>
        <h1 className="text-lg font-bold">Settings</h1>
      </div>

      <div className="px-5">
        <div className="flex items-center justify-between rounded-2xl bg-card p-4 shadow-sm">
          <div className="flex items-center gap-3">
            {dark ? <Moon className="h-5 w-5 text-primary" /> : <Sun className="h-5 w-5 text-primary" />}
            <div>
              <p className="text-sm font-semibold">Dark Mode</p>
              <p className="text-xs text-muted-foreground">{dark ? "On" : "Off"}</p>
            </div>
          </div>
          <Switch checked={dark} onCheckedChange={setDark} />
        </div>
      </div>

      <div className="space-y-2 px-5 pt-4">
        {items.map((it) => (
          <button key={it.label} onClick={it.action} className="flex w-full items-center gap-3 rounded-2xl bg-card p-4 text-left shadow-sm active:scale-95 transition">
            <it.icon className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium">{it.label}</span>
          </button>
        ))}
        <button className="flex w-full items-center gap-3 rounded-2xl bg-card p-4 text-left text-destructive shadow-sm">
          <LogOut className="h-5 w-5" />
          <span className="text-sm font-medium">Log out</span>
        </button>
      </div>
    </div>
  );
};

export default SettingsScreen;