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
        { title: "⚠️ Yeh App Sirf Mazaak Ke Liye Hai", desc: "This is a prank/joke app. No real money, no real payments, no real transactions. Sirf entertainment ke liye banaya gaya hai." },
        { title: "No Real Transactions", desc: "All payments, balances, cards, and bank details shown are completely fictional and fake. Koi bhi transaction real nahi hai." },
        { title: "No Data Collection", desc: "We do not collect, store, or process any real financial or personal information. Aapka koi data store nahi hota." },
        { title: "No Real Payment Integration", desc: "This app has no connection to any real payment gateway, bank, or UPI system. Koi real payment nahi hoti." },
        { title: "Prank / Entertainment Purpose Only", desc: "Yeh app sirf prank aur mazaak ke liye hai. Isse kisi ko dhoka dena ya fraud karna bilkul galat hai. Use responsibly." },
        { title: "No Real Money Involved", desc: "App mein dikhaya gaya balance, loan, ya koi bhi amount completely fake hai. Real money ka koi lena-dena nahi hai." },
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
