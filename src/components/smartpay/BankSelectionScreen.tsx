import { ArrowLeft, Banknote, Send, ShieldCheck, Landmark, CreditCard } from "lucide-react";
import type { Bank, Screen } from "./types";
import { demoBanks } from "@/lib/demoBanks";

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
      {demoBanks.map((bank) => {
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
            <div className={`flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl ${bank.color}`}>
              {bank.logo ? (
                <img src={bank.logo} alt={`${bank.name} logo`} loading="lazy" width={48} height={48} className="h-12 w-12 object-contain p-1" />
              ) : (
                Icon && <Icon className="h-6 w-6" />
              )}
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
