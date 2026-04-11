import { ArrowLeft, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";

interface Props {
  balance: number;
  isPremium: boolean;
  onAdd: (amount: number) => void;
  onBack: () => void;
}

const FREE_LIMIT = 5000;

const AddMoneyScreen = ({ balance, isPremium, onAdd, onBack }: Props) => {
  const [amount, setAmount] = useState("");
  const remaining = FREE_LIMIT - balance;

  const handleAdd = () => {
    const val = Number(amount);
    if (!val || val <= 0) { toast.error("Enter a valid amount"); return; }
    if (!isPremium && balance + val > FREE_LIMIT) {
      toast.error(`Free Plan Limit Reached! Max ₹${FREE_LIMIT.toLocaleString("en-IN")}`);
      return;
    }
    onAdd(val);
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col bg-background">
      <div className="flex items-center gap-3 px-5 pt-6 pb-2">
        <button onClick={onBack} className="rounded-full p-1.5 hover:bg-muted">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <span className="text-lg font-bold">Add Money</span>
      </div>

      <div className="px-5 pt-4 space-y-5">
        <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 flex items-start gap-2">
          <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
          <p className="text-xs text-amber-700">Demo Balance Only — Not real money. For learning and UI preview purposes.</p>
        </div>

        {!isPremium && (
          <div className="rounded-xl bg-muted p-3">
            <p className="text-xs text-muted-foreground">Free Plan Balance Limit</p>
            <div className="mt-1.5 h-2 rounded-full bg-border overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all"
                style={{ width: `${Math.min((balance / FREE_LIMIT) * 100, 100)}%` }}
              />
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              ₹{balance.toLocaleString("en-IN")} / ₹{FREE_LIMIT.toLocaleString("en-IN")}
              {remaining > 0 ? ` • ₹${remaining.toLocaleString("en-IN")} remaining` : " • Limit reached"}
            </p>
          </div>
        )}

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

        <div className="flex gap-2">
          {[100, 500, 1000, 2000].map((v) => (
            <button
              key={v}
              onClick={() => setAmount(String(v))}
              className="flex-1 rounded-xl border bg-card py-2 text-sm font-medium hover:bg-muted transition-colors"
            >
              ₹{v}
            </button>
          ))}
        </div>

        <Button className="h-14 w-full rounded-2xl text-base font-semibold" onClick={handleAdd}>
          Add ₹{amount || "0"}
        </Button>
      </div>
    </div>
  );
};

export default AddMoneyScreen;
