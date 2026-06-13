import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Wallet, Send, PlusCircle, CreditCard, Crown, Bell, Search, QrCode, ScanLine,
  Smartphone, Zap, Plane, Gift, Users, Settings as Cog, Tag, Play, Banknote, Headphones,
} from "lucide-react";
import type { Screen } from "./types";

interface Props {
  balance: number;
  coins: number;
  isPremium: boolean;
  onNavigate: (screen: Screen) => void;
}

const QUICK = [
  { icon: ScanLine, label: "Scan & Pay", screen: "qr" as Screen },
  { icon: Send, label: "Send Money", screen: "bank" as Screen },
  { icon: PlusCircle, label: "Google Play", screen: "addMoney" as Screen },
  { icon: QrCode, label: "My QR", screen: "qr" as Screen },
  { icon: Smartphone, label: "Recharge", screen: "recharge" as Screen },
  { icon: Zap, label: "Bills", screen: "bills" as Screen },
  { icon: Plane, label: "Travel", screen: "travel" as Screen },
  { icon: Gift, label: "Rewards", screen: "rewards" as Screen },
  { icon: Play, label: "Watch & Earn", screen: "rewardVideo" as Screen },
  { icon: Banknote, label: "Withdraw", screen: "withdraw" as Screen },
  { icon: Headphones, label: "Support", screen: "support" as Screen },
  { icon: Users, label: "Refer", screen: "referral" as Screen },
  { icon: CreditCard, label: "Cards", screen: "cards" as Screen },
  { icon: Crown, label: "Loan", screen: "upgrade" as Screen },
  { icon: Cog, label: "Settings", screen: "settings" as Screen },
];

const BANNERS = [
  { title: "Win up to 100 coins daily!", sub: "Spin the wheel now", color: "from-red-500 to-rose-600" },
  { title: "Refer & earn 50 coins", sub: "Invite friends today", color: "from-rose-600 to-red-700" },
  { title: "Flat 20% off Recharge", sub: "Use code PRANK20", color: "from-red-600 to-red-800" },
];

const HomeScreen = ({ balance, coins, isPremium, onNavigate }: Props) => (
  <div className="mx-auto flex min-h-screen max-w-md flex-col bg-background pb-6">
    {/* Header */}
    <div className="flex items-center justify-between px-5 pt-6 pb-3">
      <div className="flex items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground font-extrabold">P</div>
        <div>
          <p className="text-[10px] text-muted-foreground">Welcome</p>
          <p className="text-sm font-bold">PRANK pay</p>
        </div>
      </div>
      <button onClick={() => onNavigate("notifications")} className="relative flex h-10 w-10 items-center justify-center rounded-full bg-muted">
        <Bell className="h-5 w-5 text-foreground" />
        <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary" />
      </button>
    </div>

    {/* Search */}
    <div className="px-5">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search for services, bills, offers…" className="rounded-2xl pl-9" />
      </div>
    </div>

    {/* Wallet + Rewards row */}
    <div className="grid grid-cols-5 gap-3 px-5 pt-4">
      <Card className="col-span-3 wallet-gradient border-0 text-primary-foreground overflow-hidden">
        <CardContent className="relative p-4">
          <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-white/10" />
          <div className="flex items-center gap-1 text-[11px] opacity-80"><Wallet className="h-3 w-3" /> Wallet</div>
          <p className="mt-1 text-2xl font-extrabold">₹{balance.toLocaleString("en-IN")}</p>
          {!isPremium && <p className="mt-1 text-[10px] opacity-70">Free Plan</p>}
        </CardContent>
      </Card>
      <Card className="col-span-2 border-0 bg-card overflow-hidden">
        <CardContent className="p-4">
          <div className="flex items-center gap-1 text-[11px] text-muted-foreground"><Gift className="h-3 w-3" /> Coins</div>
          <p className="mt-1 text-2xl font-extrabold text-primary">🪙 {coins}</p>
          <button onClick={() => onNavigate("rewards")} className="mt-1 text-[10px] font-semibold text-primary">View →</button>
        </CardContent>
      </Card>
    </div>

    {/* Banner slider */}
    <div className="mt-4 flex gap-3 overflow-x-auto px-5 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {BANNERS.map((b) => (
        <div key={b.title} className={`min-w-[260px] rounded-2xl bg-gradient-to-r ${b.color} p-4 text-white shadow-md`}>
          <Tag className="mb-2 h-5 w-5" />
          <p className="text-sm font-bold">{b.title}</p>
          <p className="text-[11px] opacity-90">{b.sub}</p>
        </div>
      ))}
    </div>

    {/* Quick actions grid */}
    <div className="px-5 pt-5">
      <p className="mb-3 text-sm font-semibold">Quick Actions</p>
      <div className="grid grid-cols-4 gap-3">
        {QUICK.map((q) => (
          <button key={q.label} onClick={() => onNavigate(q.screen)} className="flex flex-col items-center gap-1.5 rounded-2xl bg-card p-3 shadow-sm active:scale-95 transition">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent">
              <q.icon className="h-5 w-5 text-primary" />
            </div>
            <span className="text-[10px] font-medium text-center leading-tight">{q.label}</span>
          </button>
        ))}
      </div>
    </div>

    {/* Recent */}
    <div className="px-5 pt-6">
      <p className="mb-3 text-sm font-semibold">Recent Activity</p>
      <div className="space-y-2">
        {[
          { name: "Rahul S.", amt: "₹500", time: "Today" },
          { name: "Priya M.", amt: "₹1,200", time: "Yesterday" },
          { name: "Shop - Groceries", amt: "₹350", time: "2 days ago" },
        ].map((item) => (
          <div key={item.name} className="flex items-center justify-between rounded-xl bg-card p-3 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-sm font-bold text-primary">
                {item.name.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-medium">{item.name}</p>
                <p className="text-xs text-muted-foreground">{item.time}</p>
              </div>
            </div>
            <span className="text-sm font-semibold text-destructive">-{item.amt}</span>
          </div>
        ))}
      </div>
    </div>

    <button onClick={() => onNavigate("privacy")} className="mt-6 w-full text-center text-xs text-muted-foreground underline">
      Privacy Policy • Demo Only
    </button>
  </div>
);

export default HomeScreen;
