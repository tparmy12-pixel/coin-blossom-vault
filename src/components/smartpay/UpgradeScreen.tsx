import { ArrowLeft, Crown, CheckCircle2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Props {
  isPremium: boolean;
  onUpgrade: () => void;
  onBack: () => void;
}

const features = [
  "Unlimited demo balance (no ₹5,000 cap)",
  "All payment features unlocked",
  "Priority demo support",
  "Premium badge on profile",
  "Advanced card management",
];

const UpgradeScreen = ({ isPremium, onUpgrade, onBack }: Props) => (
  <div className="mx-auto flex min-h-screen max-w-md flex-col bg-background">
    <div className="flex items-center gap-3 px-5 pt-6 pb-2">
      <button onClick={onBack} className="rounded-full p-1.5 hover:bg-muted">
        <ArrowLeft className="h-5 w-5" />
      </button>
      <span className="text-lg font-bold">Upgrade Plan</span>
    </div>

    <div className="px-5 pt-6 space-y-6">
      <div className="text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
          <Crown className="h-8 w-8 text-amber-600" />
        </div>
        <h2 className="mt-3 text-xl font-bold">SmartPay Premium</h2>
        <p className="mt-1 text-sm text-muted-foreground">Unlock all demo features</p>
      </div>

      <div className="rounded-2xl border-2 border-amber-400 bg-amber-50/50 p-5">
        <div className="flex items-baseline gap-1 justify-center">
          <span className="text-3xl font-extrabold">₹800</span>
          <span className="text-sm text-muted-foreground">/ demo upgrade</span>
        </div>
        <div className="mt-4 space-y-2.5">
          {features.map((f) => (
            <div key={f} className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
              <span className="text-sm">{f}</span>
            </div>
          ))}
        </div>
      </div>

      {isPremium ? (
        <div className="rounded-2xl bg-green-50 border border-green-200 p-4 text-center">
          <Sparkles className="h-6 w-6 text-green-600 mx-auto mb-1" />
          <p className="text-sm font-semibold text-green-700">You're already a Premium user!</p>
        </div>
      ) : (
        <Button
          className="h-14 w-full rounded-2xl text-base font-semibold bg-amber-500 hover:bg-amber-600 text-white"
          onClick={() => { onUpgrade(); toast.success("🎉 Upgraded to Premium!"); }}
        >
          Upgrade Now — ₹800 (Demo)
        </Button>
      )}

      <p className="text-[10px] text-center text-muted-foreground">This is a demo upgrade. No real payment will be processed.</p>
    </div>
  </div>
);

export default UpgradeScreen;
