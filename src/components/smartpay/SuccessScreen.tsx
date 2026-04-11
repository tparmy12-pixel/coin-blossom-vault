import { CheckCircle2, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Props {
  txnId: string;
  txnDate: string;
  senderName: string;
  receiverName: string;
  bankName: string;
  amount: string;
  onDone: () => void;
  title?: string;
  subtitle?: string;
}

const SuccessScreen = ({ txnId, txnDate, senderName, receiverName, bankName, amount, onDone, title = "Payment Successful", subtitle = "Your transaction has been completed" }: Props) => (
  <div
    className="mx-auto flex min-h-screen max-w-md flex-col bg-background"
    style={{ background: "linear-gradient(135deg, hsl(142 76% 36%), hsl(160 84% 39%), hsl(142 76% 30%))" }}
  >
    {/* Top spacer */}
    <div className="flex-1 min-h-[60px]" />

    {/* Content */}
    <div className="flex flex-col items-center px-6 animate-scale-in">
      <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
        <CheckCircle2 className="h-12 w-12 text-white" strokeWidth={1.5} />
      </div>
      <h1 className="text-xl font-bold text-white">{title}</h1>
      <p className="mt-1 text-xs text-white/70">{subtitle}</p>

      {/* Transaction Details Card */}
      <div className="mt-6 w-full rounded-2xl bg-white/15 p-4 backdrop-blur-md">
        <div className="space-y-2.5">
          {[
            ["Date", txnDate],
            ["Paid By", senderName],
            ["Paid To", receiverName],
            ["Bank Used", bankName],
            ["Transaction ID", txnId],
          ].map(([label, value]) => (
            <div key={label} className="flex items-center justify-between">
              <span className="text-[11px] text-white/60">{label}</span>
              <span className="text-xs font-medium text-white max-w-[55%] text-right truncate">{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Amount */}
      <div className="mt-6">
        <p className="text-xs text-white/60 text-center">Amount</p>
        <p className="text-center text-4xl font-extrabold text-white">₹{Number(amount).toLocaleString("en-IN")}</p>
      </div>

      {/* Demo label */}
      <p className="mt-3 text-[10px] text-white/40 text-center">Demo Transaction Only • Not Real Money</p>

      {/* Buttons */}
      <div className="mt-6 mb-8 flex w-full gap-3">
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
        <Button className="flex-1 rounded-2xl bg-white text-green-700 hover:bg-white/90" onClick={onDone}>
          Done
        </Button>
      </div>
    </div>

    {/* Bottom spacer */}
    <div className="flex-1 min-h-[40px]" />
  </div>
);

export default SuccessScreen;
