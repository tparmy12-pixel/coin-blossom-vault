import { useState } from "react";
import { ArrowLeft, Smartphone, Tv, Zap, Droplet, Flame, Wifi, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

interface Props {
  mode: "recharge" | "bills";
  onBack: () => void;
}

const RECHARGE = [
  { icon: Smartphone, label: "Mobile" },
  { icon: Tv, label: "DTH" },
];
const BILLS = [
  { icon: Zap, label: "Electricity" },
  { icon: Droplet, label: "Water" },
  { icon: Flame, label: "Gas" },
  { icon: Wifi, label: "Broadband" },
  { icon: CreditCard, label: "Credit Card" },
];

const RechargeScreen = ({ mode, onBack }: Props) => {
  const [selected, setSelected] = useState<string | null>(null);
  const [number, setNumber] = useState("");
  const [amount, setAmount] = useState("");
  const items = mode === "recharge" ? RECHARGE : BILLS;

  const submit = () => {
    if (!selected || !number || !amount) return toast.error("Fill all fields");
    toast.success(`Demo ${selected} ${mode} of ₹${amount} processed!`);
    setSelected(null); setNumber(""); setAmount("");
  };

  return (
    <div className="mx-auto min-h-screen max-w-md bg-background pb-8">
      <div className="flex items-center gap-3 px-5 pt-6 pb-4">
        <Button variant="ghost" size="icon" onClick={onBack}><ArrowLeft className="h-5 w-5" /></Button>
        <h1 className="text-lg font-bold capitalize">{mode === "recharge" ? "Recharge" : "Bill Payments"}</h1>
      </div>

      <div className="grid grid-cols-3 gap-3 px-5">
        {items.map((it) => (
          <button
            key={it.label}
            onClick={() => setSelected(it.label)}
            className={`flex flex-col items-center gap-2 rounded-2xl p-4 shadow-sm transition ${selected === it.label ? "bg-primary text-primary-foreground" : "bg-card"}`}
          >
            <it.icon className="h-6 w-6" />
            <span className="text-xs font-medium">{it.label}</span>
          </button>
        ))}
      </div>

      {selected && (
        <Card className="mx-5 mt-6">
          <CardContent className="space-y-3 p-5">
            <p className="text-sm font-semibold">{selected} {mode}</p>
            <Input placeholder={mode === "recharge" ? "Mobile / Customer ID" : "Consumer / Account number"} value={number} onChange={(e) => setNumber(e.target.value)} />
            <Input type="number" placeholder="Amount (₹)" value={amount} onChange={(e) => setAmount(e.target.value)} />
            <Button className="w-full rounded-2xl" onClick={submit}>Pay ₹{amount || "0"}</Button>
            <p className="text-center text-[10px] text-muted-foreground">Demo only • No real transaction</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RechargeScreen;