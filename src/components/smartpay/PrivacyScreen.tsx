import { ArrowLeft, Shield } from "lucide-react";

interface Props {
  onBack: () => void;
}

const PrivacyScreen = ({ onBack }: Props) => (
  <div className="mx-auto flex min-h-screen max-w-md flex-col bg-background">
    <div className="flex items-center gap-3 px-5 pt-6 pb-2">
      <button onClick={onBack} className="rounded-full p-1.5 hover:bg-muted">
        <ArrowLeft className="h-5 w-5" />
      </button>
      <span className="text-lg font-bold">Privacy & Info</span>
    </div>

    <div className="px-5 pt-4 space-y-4">
      <div className="flex items-center gap-3 rounded-xl bg-primary/5 p-4">
        <Shield className="h-8 w-8 text-primary shrink-0" />
        <div>
          <p className="font-semibold text-sm">Demo Application</p>
          <p className="text-xs text-muted-foreground">This app is for learning and design preview purposes only.</p>
        </div>
      </div>

      {[
        { title: "No Real Transactions", desc: "All payments, balances, and cards shown are fictional demo data." },
        { title: "No Data Collection", desc: "We do not collect, store, or process any real financial information." },
        { title: "No Real Payment Integration", desc: "This app has no connection to any real payment gateway or bank." },
        { title: "Educational Purpose", desc: "Built for UI/UX learning and design demonstration only." },
      ].map((item) => (
        <div key={item.title} className="rounded-xl border bg-card p-4">
          <p className="text-sm font-semibold">{item.title}</p>
          <p className="mt-1 text-xs text-muted-foreground">{item.desc}</p>
        </div>
      ))}
    </div>
  </div>
);

export default PrivacyScreen;
