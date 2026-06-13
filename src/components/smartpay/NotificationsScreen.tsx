import { ArrowLeft, Bell, Gift, IndianRupee, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props { onBack: () => void; }

const ITEMS = [
  { icon: Gift, title: "You earned 25 coins!", desc: "Daily task completed", time: "2m ago" },
  { icon: IndianRupee, title: "Payment received ₹500", desc: "From Rahul S.", time: "1h ago" },
  { icon: AlertCircle, title: "Security alert", desc: "New device login (demo)", time: "Yesterday" },
  { icon: Bell, title: "Welcome to PRANK pay 🎉", desc: "Explore rewards and offers", time: "2 days ago" },
];

const NotificationsScreen = ({ onBack }: Props) => (
  <div className="mx-auto min-h-screen max-w-md bg-background pb-8">
    <div className="flex items-center gap-3 px-5 pt-6 pb-4">
      <Button variant="ghost" size="icon" onClick={onBack}><ArrowLeft className="h-5 w-5" /></Button>
      <h1 className="text-lg font-bold">Notifications</h1>
    </div>
    <div className="space-y-2 px-5">
      {ITEMS.map((n, i) => (
        <div key={i} className="flex items-start gap-3 rounded-xl bg-card p-3.5 shadow-sm">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent">
            <n.icon className="h-4 w-4 text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold">{n.title}</p>
            <p className="text-xs text-muted-foreground">{n.desc}</p>
          </div>
          <span className="text-[10px] text-muted-foreground">{n.time}</span>
        </div>
      ))}
    </div>
  </div>
);

export default NotificationsScreen;