import { useState } from "react";
import { ArrowLeft, Banknote, Clock, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { addWithdrawal, getWithdrawals, Withdrawal } from "@/lib/demoCodes";

interface Props { balance: number; onBack: () => void; }

const WithdrawalScreen = ({ balance, onBack }: Props) => {
  const [amount, setAmount] = useState("");
  const [upi, setUpi] = useState("");
  const [list, setList] = useState<Withdrawal[]>(getWithdrawals());

  const submit = () => {
    const amt = Number(amount);
    if (!amt || amt <= 0) return toast.error("Enter amount");
    if (amt > balance) return toast.error("Insufficient demo balance");
    if (!upi.trim()) return toast.error("Enter UPI ID");
    addWithdrawal(amt, upi.trim());
    setList(getWithdrawals());
    setAmount(""); setUpi("");
    toast.success("Demo withdrawal requested. Admin will review.");
  };

  return (
    <div className="mx-auto min-h-screen max-w-md bg-background pb-8">
      <div className="flex items-center gap-3 px-5 pt-6 pb-4">
        <Button variant="ghost" size="icon" onClick={onBack}><ArrowLeft className="h-5 w-5" /></Button>
        <h1 className="text-lg font-bold">Withdraw (Demo)</h1>
      </div>

      <div className="px-5">
        <Card className="wallet-gradient border-0 text-primary-foreground">
          <CardContent className="p-4">
            <p className="text-xs opacity-80">Available Demo Balance</p>
            <p className="text-2xl font-extrabold">₹{balance.toLocaleString("en-IN")}</p>
          </CardContent>
        </Card>

        <div className="mt-4 space-y-3">
          <Input placeholder="Amount (₹)" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="rounded-2xl" />
          <Input placeholder="UPI ID (e.g. yourname@bank)" value={upi} onChange={(e) => setUpi(e.target.value)} className="rounded-2xl" />
          <Button onClick={submit} className="w-full rounded-2xl"><Banknote className="mr-2 h-4 w-4" />Request Withdrawal</Button>
          <p className="text-center text-[11px] text-muted-foreground">No real money is transferred. Demo only.</p>
        </div>

        <div className="mt-6">
          <p className="mb-2 text-sm font-semibold">Request History</p>
          {list.length === 0 && <p className="text-xs text-muted-foreground">No requests yet.</p>}
          {list.map((w) => (
            <Card key={w.id} className="mb-2">
              <CardContent className="flex items-center justify-between p-3">
                <div>
                  <p className="text-sm font-semibold">₹{w.amount.toLocaleString("en-IN")}</p>
                  <p className="text-[11px] text-muted-foreground">{w.upi} • {new Date(w.at).toLocaleString("en-IN")}</p>
                </div>
                {w.status === "pending" && <span className="flex items-center gap-1 text-xs text-amber-600"><Clock className="h-3 w-3" />Pending</span>}
                {w.status === "approved" && <span className="flex items-center gap-1 text-xs text-green-600"><Check className="h-3 w-3" />Approved</span>}
                {w.status === "rejected" && <span className="flex items-center gap-1 text-xs text-destructive"><X className="h-3 w-3" />Rejected</span>}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WithdrawalScreen;