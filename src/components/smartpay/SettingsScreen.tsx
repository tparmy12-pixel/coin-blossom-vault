import { ArrowLeft, Moon, Sun, User, Bell, Lock, Globe, Shield, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useEffect, useState } from "react";
import { useUser } from "@/contexts/UserContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface Props { onBack: () => void; onPrivacy: () => void; }

const SettingsScreen = ({ onBack, onPrivacy }: Props) => {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains("dark"));
  const [notif, setNotif] = useState(() => localStorage.getItem("prankpay_notif") !== "off");
  const [lang, setLang] = useState(() => localStorage.getItem("prankpay_lang") ?? "English");
  const { logout } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("prankpay_theme", dark ? "dark" : "light");
  }, [dark]);
  useEffect(() => { localStorage.setItem("prankpay_notif", notif ? "on" : "off"); }, [notif]);
  useEffect(() => { localStorage.setItem("prankpay_lang", lang); }, [lang]);

  const cycleLang = () => {
    const langs = ["English", "हिन्दी", "मराठी", "தமிழ்"];
    const next = langs[(langs.indexOf(lang) + 1) % langs.length];
    setLang(next);
    toast.success(`Language: ${next}`);
  };

  const handleLogout = () => {
    logout();
    toast.success("Logged out");
    navigate("/");
  };

  const items: { icon: any; label: string; action: () => void; right?: React.ReactNode }[] = [
    { icon: User, label: "Profile Settings", action: () => navigate("/profile") },
    {
      icon: Bell, label: "Notifications", action: () => setNotif(v => !v),
      right: <Switch checked={notif} onCheckedChange={setNotif} onClick={(e) => e.stopPropagation()} />,
    },
    { icon: Lock, label: "Privacy & Security", action: onPrivacy },
    { icon: Globe, label: `Language: ${lang}`, action: cycleLang },
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
          <div
            key={it.label}
            role="button"
            tabIndex={0}
            onClick={it.action}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") it.action(); }}
            className="flex w-full cursor-pointer items-center justify-between gap-3 rounded-2xl bg-card p-4 text-left shadow-sm active:scale-95 transition"
          >
            <span className="flex items-center gap-3">
              <it.icon className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">{it.label}</span>
            </span>
            {it.right}
          </div>
        ))}
        <div
          role="button"
          tabIndex={0}
          onClick={handleLogout}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") handleLogout(); }}
          className="flex w-full cursor-pointer items-center gap-3 rounded-2xl bg-card p-4 text-left text-destructive shadow-sm active:scale-95 transition"
        >
          <LogOut className="h-5 w-5" />
          <span className="text-sm font-medium">Log out</span>
        </div>
      </div>
    </div>
  );
};

export default SettingsScreen;