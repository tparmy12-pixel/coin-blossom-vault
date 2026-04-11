import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Wallet,
  Send,
  CheckCircle2,
  Building2,
  Landmark,
  CreditCard,
  Banknote,
  ShieldCheck,
  ArrowLeft,
  Copy,
} from "lucide-react";
import { toast } from "sonner";

type Screen = "home" | "bank" | "form" | "success";

interface Bank {
  name: string;
  icon: React.ElementType;
  color: string;
}

const banks: Bank[] = [
  { name: "PayFast Bank", icon: Banknote, color: "bg-blue-100 text-blue-600" },
  { name: "AirPay Bank", icon: Send, color: "bg-purple-100 text-purple-600" },
  { name: "Secure Bank", icon: ShieldCheck, color: "bg-green-100 text-green-600" },
  { name: "National Bank", icon: Landmark, color: "bg-amber-100 text-amber-600" },
  { name: "Digital Wallet", icon: CreditCard, color: "bg-pink-100 text-pink-600" },
];

const generateTxnId = () =>
  "TXN" + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substring(2, 6).toUpperCase();

const SmartPayDemo = () => {
  const [screen, setScreen] = useState<Screen>("home");
  const [selectedBank, setSelectedBank] = useState<Bank | null>(null);
  const [senderName, setSenderName] = useState("Demo User");
  const [receiverName, setReceiverName] = useState("");
  const [upiId, setUpiId] = useState("");
  const [amount, setAmount] = useState("");
  const [txnId] = useState(generateTxnId());
  const [txnDate] = useState(new Date().toLocaleString("en-IN"));

  const resetFlow = () => {
    setScreen("home");
    setSelectedBank(null);
    setReceiverName("");
    setUpiId("");
    setAmount("");
    setSenderName("Demo User");
  };

  const handlePay = () => {
    if (!receiverName || !upiId || !amount || Number(amount) <= 0) {
      toast.error("Please fill all fields");
      return;
    }
    if (Number(amount) > 10000) {
      toast.error("Insufficient demo balance");
      return;
    }
    setScreen("success");
  };

  // Home Screen
  if (screen === "home") {
    return (
      <div className="mx-auto flex min-h-screen max-w-md flex-col bg-background">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-6 pb-2">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary">
              <Wallet className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold tracking-tight">SmartPay Demo</span>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>

        {/* Balance Card */}
        <div className="px-5 pt-6">
          <Card className="wallet-gradient border-0 text-primary-foreground overflow-hidden">
            <CardContent className="relative p-6">
              <div className="absolute -right-6 -top-6 h-28 w-28 rounded-full bg-white/10" />
              <div className="absolute -right-2 bottom-0 h-16 w-16 rounded-full bg-white/5" />
              <p className="text-sm font-medium opacity-80">Available Balance</p>
              <p className="mt-2 text-4xl font-extrabold tracking-tight">₹10,000</p>
              <p className="mt-3 text-xs opacity-60">SmartPay Demo Wallet</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="px-5 pt-8">
          <p className="mb-4 text-sm font-semibold text-muted-foreground">Quick Actions</p>
          <Button
            className="h-14 w-full gap-3 rounded-2xl text-base font-semibold"
            onClick={() => setScreen("bank")}
          >
            <Send className="h-5 w-5" />
            Send Money
          </Button>
        </div>

        {/* Recent */}
        <div className="px-5 pt-8">
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
      </div>
    );
  }

  // Bank Selection
  if (screen === "bank") {
    return (
      <div className="mx-auto flex min-h-screen max-w-md flex-col bg-background">
        <div className="flex items-center gap-3 px-5 pt-6 pb-2">
          <button onClick={() => setScreen("home")} className="rounded-full p-1.5 hover:bg-muted">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <span className="text-lg font-bold">Select Your Bank</span>
        </div>
        <p className="px-5 pb-4 text-sm text-muted-foreground">Choose a bank to proceed with payment</p>

        <div className="space-y-3 px-5">
          {banks.map((bank) => (
            <button
              key={bank.name}
              onClick={() => {
                setSelectedBank(bank);
                setScreen("form");
              }}
              className={`flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition-all active:scale-[0.98] ${
                selectedBank?.name === bank.name
                  ? "border-primary bg-primary/5 shadow-md"
                  : "border-border bg-card shadow-sm hover:shadow-md"
              }`}
            >
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${bank.color}`}>
                <bank.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="font-semibold">{bank.name}</p>
                <p className="text-xs text-muted-foreground">Tap to select</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Payment Form
  if (screen === "form") {
    return (
      <div className="mx-auto flex min-h-screen max-w-md flex-col bg-background">
        <div className="flex items-center gap-3 px-5 pt-6 pb-2">
          <button onClick={() => setScreen("bank")} className="rounded-full p-1.5 hover:bg-muted">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <span className="text-lg font-bold">Payment Details</span>
        </div>

        {selectedBank && (
          <div className="mx-5 mt-2 flex items-center gap-3 rounded-xl bg-muted/50 p-3">
            <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${selectedBank.color}`}>
              <selectedBank.icon className="h-4 w-4" />
            </div>
            <span className="text-sm font-medium">{selectedBank.name}</span>
          </div>
        )}

        <div className="flex-1 space-y-4 px-5 pt-6">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Sender Name</label>
            <Input value={senderName} onChange={(e) => setSenderName(e.target.value)} className="rounded-xl" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Receiver Name</label>
            <Input
              placeholder="Enter receiver name"
              value={receiverName}
              onChange={(e) => setReceiverName(e.target.value)}
              className="rounded-xl"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">UPI ID / Account Number</label>
            <Input
              placeholder="e.g. user@smartpay"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              className="rounded-xl"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Amount (₹)</label>
            <Input
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="rounded-xl text-lg font-bold"
            />
          </div>

          <Button className="mt-4 h-14 w-full rounded-2xl text-base font-semibold" onClick={handlePay}>
            Pay ₹{amount || "0"}
          </Button>
        </div>
      </div>
    );
  }

  // Success Screen
  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center"
      style={{
        background: "linear-gradient(135deg, hsl(142 76% 36%), hsl(160 84% 39%), hsl(142 76% 30%))",
      }}
    >
      <div className="flex flex-col items-center px-6 animate-scale-in">
        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
          <CheckCircle2 className="h-16 w-16 text-white" strokeWidth={1.5} />
        </div>
        <h1 className="text-2xl font-bold text-white">Payment Successful</h1>
        <p className="mt-1 text-sm text-white/70">Your transaction has been completed</p>

        <div className="mt-8 w-full rounded-3xl bg-white/15 p-5 backdrop-blur-md">
          <div className="space-y-3">
            {[
              ["Date", txnDate],
              ["Paid By", senderName],
              ["Paid To", receiverName],
              ["Bank Used", selectedBank?.name || "—"],
              ["Transaction ID", txnId],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between">
                <span className="text-xs text-white/60">{label}</span>
                <span className="text-sm font-medium text-white">{value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8">
          <p className="text-sm text-white/60">Amount Paid</p>
          <p className="text-center text-5xl font-extrabold text-white">₹{Number(amount).toLocaleString("en-IN")}</p>
        </div>

        <div className="mt-8 flex w-full gap-3">
          <Button
            variant="outline"
            className="flex-1 rounded-2xl border-white/30 bg-white/10 text-white hover:bg-white/20"
            onClick={() => {
              navigator.clipboard.writeText(txnId);
              toast.success("Transaction ID copied!");
            }}
          >
            <Copy className="mr-1.5 h-4 w-4" /> Copy ID
          </Button>
          <Button
            className="flex-1 rounded-2xl bg-white text-green-700 hover:bg-white/90"
            onClick={resetFlow}
          >
            Done
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SmartPayDemo;
