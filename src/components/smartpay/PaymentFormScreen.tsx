import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Bank } from "./types";
import { Banknote, Send, ShieldCheck, Landmark, CreditCard } from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  Banknote, Send, ShieldCheck, Landmark, CreditCard,
};

interface Props {
  selectedBank: Bank | null;
  senderName: string;
  receiverName: string;
  upiId: string;
  amount: string;
  onSenderChange: (v: string) => void;
  onReceiverChange: (v: string) => void;
  onUpiChange: (v: string) => void;
  onAmountChange: (v: string) => void;
  onPay: () => void;
  onBack: () => void;
}

const PaymentFormScreen = ({
  selectedBank, senderName, receiverName, upiId, amount,
  onSenderChange, onReceiverChange, onUpiChange, onAmountChange, onPay, onBack,
}: Props) => {
  const BankIcon = selectedBank ? iconMap[selectedBank.icon] : null;
  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col bg-background">
      <div className="flex items-center gap-3 px-5 pt-6 pb-2">
        <button onClick={onBack} className="rounded-full p-1.5 hover:bg-muted">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <span className="text-lg font-bold">Payment Details</span>
      </div>

      {selectedBank && (
        <div className="mx-5 mt-2 flex items-center gap-3 rounded-xl bg-muted/50 p-3">
          <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${selectedBank.color}`}>
            {BankIcon && <BankIcon className="h-4 w-4" />}
          </div>
          <span className="text-sm font-medium">{selectedBank.name}</span>
        </div>
      )}

      <div className="flex-1 space-y-4 px-5 pt-6">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Sender Name</label>
          <Input value={senderName} onChange={(e) => onSenderChange(e.target.value)} className="rounded-xl" />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Receiver Name</label>
          <Input placeholder="Enter receiver name" value={receiverName} onChange={(e) => onReceiverChange(e.target.value)} className="rounded-xl" />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted-foreground">UPI ID / Account Number</label>
          <Input placeholder="e.g. user@smartpay" value={upiId} onChange={(e) => onUpiChange(e.target.value)} className="rounded-xl" />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Amount (₹)</label>
          <Input type="number" placeholder="Enter amount" value={amount} onChange={(e) => onAmountChange(e.target.value)} className="rounded-xl text-lg font-bold" />
        </div>
        <Button className="mt-4 h-14 w-full rounded-2xl text-base font-semibold" onClick={onPay}>
          Pay ₹{amount || "0"}
        </Button>
      </div>
    </div>
  );
};

export default PaymentFormScreen;
