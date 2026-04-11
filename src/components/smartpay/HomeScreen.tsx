import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Wallet, Send, PlusCircle, CreditCard, Crown, Building2 } from "lucide-react";
import type { Screen } from "./types";

interface Props {
  balance: number;
  isPremium: boolean;
  onNavigate: (screen: Screen) => void;
}

const HomeScreen = ({ balance, isPremium, onNavigate }: Props) => (
  <div className="mx-auto flex min-h-screen max-w-md flex-col bg-background">
    <div className="flex items-center justify-between px-5 pt-6 pb-2">
      <div className="flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary">
          <Wallet className="h-5 w-5 text-primary-foreground" />
        </div>
        <span className="text-lg font-bold tracking-tight">SmartPay Demo</span>
        {isPremium && (
          <Badge className="ml-1 bg-amber-500 text-white text-[10px] px-1.5 py-0">Premium</Badge>
        )}
      </div>
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
        <Building2 className="h-4 w-4 text-muted-foreground" />
      </div>
    </div>

    <div className="px-5 pt-6">
      <Card className="wallet-gradient border-0 text-primary-foreground overflow-hidden">
        <CardContent className="relative p-6">
          <div className="absolute -right-6 -top-6 h-28 w-28 rounded-full bg-white/10" />
          <div className="absolute -right-2 bottom-0 h-16 w-16 rounded-full bg-white/5" />
          <p className="text-sm font-medium opacity-80">Available Balance</p>
          <p className="mt-2 text-4xl font-extrabold tracking-tight">₹{balance.toLocaleString("en-IN")}</p>
          <div className="mt-3 flex items-center justify-between">
            <p className="text-xs opacity-60">SmartPay Demo Wallet</p>
            {!isPremium && (
              <span className="text-[10px] bg-white/20 rounded-full px-2 py-0.5">Free Plan • ₹5,000 limit</span>
            )}
          </div>
        </CardContent>
      </Card>
    </div>

    <div className="grid grid-cols-2 gap-3 px-5 pt-6">
      {[
        { icon: PlusCircle, label: "Add Money", screen: "addMoney" as Screen, variant: "outline" as const },
        { icon: Send, label: "Send Money", screen: "bank" as Screen, variant: "default" as const },
        { icon: CreditCard, label: "Cards", screen: "cards" as Screen, variant: "outline" as const },
        { icon: Crown, label: isPremium ? "Premium ✓" : "Upgrade", screen: "upgrade" as Screen, variant: "outline" as const },
      ].map((item) => (
        <Button
          key={item.label}
          variant={item.variant}
          className="h-14 gap-2 rounded-2xl text-sm font-semibold"
          onClick={() => onNavigate(item.screen)}
        >
          <item.icon className="h-5 w-5" />
          {item.label}
        </Button>
      ))}
    </div>

    <div className="px-5 pt-6">
      <p className="mb-3 text-sm font-semibold text-muted-foreground">Recent</p>
      <div className="space-y-3">
        {[
          { name: "Rahul S.", amt: "₹500", time: "Today" },
          { name: "Priya M.", amt: "₹1,200", time: "Yesterday" },
          { name: "Shop - Groceries", amt: "₹350", time: "2 days ago" },
        ].map((item) => (
          <div key={item.name} className="flex items-center justify-between rounded-xl bg-card p-3.5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-sm font-bold text-muted-foreground">
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

    <div className="px-5 pt-6 pb-6">
      <button
        onClick={() => onNavigate("privacy")}
        className="w-full text-center text-xs text-muted-foreground underline"
      >
        Privacy Policy • Demo Only
      </button>
    </div>
  </div>
);

export default HomeScreen;
