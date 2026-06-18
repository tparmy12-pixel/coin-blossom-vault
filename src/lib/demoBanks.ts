import type { Bank } from "@/components/smartpay/types";
import kidsPaymentBankLogo from "@/assets/banks/kids-payment-bank.png";
import demoPaymentBankLogo from "@/assets/banks/demo-payment-bank.png";
import smartPayBankLogo from "@/assets/banks/smartpay-bank.png";
import airWalletBankLogo from "@/assets/banks/airwallet-bank.png";
import secureStarBankLogo from "@/assets/banks/secure-star-bank.png";
import rainbowSavingsBankLogo from "@/assets/banks/rainbow-savings-bank.png";
import rocketPayBankLogo from "@/assets/banks/rocket-pay-bank.png";
import familyWalletBankLogo from "@/assets/banks/family-wallet-bank.png";

export const demoBanks: Bank[] = [
  { name: "Demo Payment Bank", icon: "ShieldCheck", color: "bg-cyan-100 text-cyan-700", logo: demoPaymentBankLogo },
  { name: "Kids Payment Bank", icon: "Banknote", color: "bg-yellow-100 text-yellow-700", logo: kidsPaymentBankLogo },
  { name: "SmartPay Demo Bank", icon: "CreditCard", color: "bg-blue-100 text-blue-700", logo: smartPayBankLogo },
  { name: "AirWallet Bank", icon: "Send", color: "bg-orange-100 text-orange-700", logo: airWalletBankLogo },
  { name: "Secure Star Bank", icon: "ShieldCheck", color: "bg-indigo-100 text-indigo-700", logo: secureStarBankLogo },
  { name: "Rainbow Savings Bank", icon: "Landmark", color: "bg-pink-100 text-pink-700", logo: rainbowSavingsBankLogo },
  { name: "Rocket Pay Bank", icon: "Send", color: "bg-sky-100 text-sky-700", logo: rocketPayBankLogo },
  { name: "Family Wallet Bank", icon: "CreditCard", color: "bg-emerald-100 text-emerald-700", logo: familyWalletBankLogo },
];