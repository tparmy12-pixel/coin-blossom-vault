import { ArrowLeft, Banknote, Send, ShieldCheck, Landmark, CreditCard } from "lucide-react";
import type { Bank, Screen } from "./types";

const banks: Bank[] = [
  { name: "PayFast Bank", icon: "Banknote", color: "bg-blue-100 text-blue-600" },
  { name: "AirPay Bank", icon: "Send", color: "bg-purple-100 text-purple-600" },
  { name: "Secure Bank", icon: "ShieldCheck", color: "bg-green-100 text-green-600" },
  { name: "National Bank", icon: "Landmark", color: "bg-amber-100 text-amber-600" },
  { name: "Digital Wallet", icon: "CreditCard", color: "bg-pink-100 text-pink-600" },
];

const iconMap: Record<string, React.ElementType> = {
  Banknote, Send, ShieldCheck, Landmark, CreditCard,
};

interface Props {
  selectedBank: Bank | null;
  onSelect: (bank: Bank) => void;
  onBack: () => void;
}

const BankSelectionScreen = ({ selectedBank, onSelect, onBack }: Props) => (
  <div className="mx-auto flex min-h-screen max-w-md flex-col bg-background">
    <div className="flex items-center gap-3 px-5 pt-6 pb-2">
      <button onClick={onBack} className="rounded-full p-1.5 hover:bg-muted">
        <ArrowLeft className="h-5 w-5" />
      </button>
      <span className="text-lg font-bold">Select Your Bank</span>
    </div>
    <p className="px-5 pb-4 text-sm text-muted-foreground">Choose a bank to proceed with payment</p>

    <div className="space-y-3 px-5">
      {banks.map((bank) => {
        const Icon = iconMap[bank.icon];
        return (
          <button
            key={bank.name}
            onClick={() => onSelect(bank)}
            className={`flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition-all active:scale-[0.98] ${
              selectedBank?.name === bank.name
                ? "border-primary bg-primary/5 shadow-md"
                : "border-border bg-card shadow-sm hover:shadow-md"
            }`}
          >
            <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${bank.color}`}>
              {Icon && <Icon className="h-6 w-6" />}
            </div>
            <div>
              <p className="font-semibold">{bank.name}</p>
              <p className="text-xs text-muted-foreground">Tap to select</p>
            </div>
          </button>
        );
      })}
    </div>
  </div>
);

export default BankSelectionScreen;
