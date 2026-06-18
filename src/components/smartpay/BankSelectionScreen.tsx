import { ArrowLeft, Banknote, Send, ShieldCheck, Landmark, CreditCard } from "lucide-react";
import type { Bank, Screen } from "./types";
import kidsPaymentBankLogo from "@/assets/banks/kids-payment-bank.png";
import demoPaymentBankLogo from "@/assets/banks/demo-payment-bank.png";
import smartPayBankLogo from "@/assets/banks/smartpay-bank.png";
import airWalletBankLogo from "@/assets/banks/airwallet-bank.png";
import secureStarBankLogo from "@/assets/banks/secure-star-bank.png";
import rainbowSavingsBankLogo from "@/assets/banks/rainbow-savings-bank.png";
import rocketPayBankLogo from "@/assets/banks/rocket-pay-bank.png";
import familyWalletBankLogo from "@/assets/banks/family-wallet-bank.png";

const banks: Bank[] = [
  { name: "Demo Payment Bank", icon: "ShieldCheck", color: "bg-cyan-100 text-cyan-700", logo: demoPaymentBankLogo },
  { name: "Kids Payment Bank", icon: "Banknote", color: "bg-yellow-100 text-yellow-700", logo: kidsPaymentBankLogo },
  { name: "SmartPay Demo Bank", icon: "CreditCard", color: "bg-blue-100 text-blue-700", logo: smartPayBankLogo },
  { name: "AirWallet Bank", icon: "Send", color: "bg-orange-100 text-orange-700", logo: airWalletBankLogo },
  { name: "Secure Star Bank", icon: "ShieldCheck", color: "bg-indigo-100 text-indigo-700", logo: secureStarBankLogo },
  { name: "Rainbow Savings Bank", icon: "Landmark", color: "bg-pink-100 text-pink-700", logo: rainbowSavingsBankLogo },
  { name: "Rocket Pay Bank", icon: "Send", color: "bg-sky-100 text-sky-700", logo: rocketPayBankLogo },
  { name: "Family Wallet Bank", icon: "CreditCard", color: "bg-emerald-100 text-emerald-700", logo: familyWalletBankLogo },
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
