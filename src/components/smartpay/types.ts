export type Screen =
  | "home"
  | "bank"
  | "form"
  | "success"
  | "addMoney"
  | "cards"
  | "upgrade"
  | "addMoneySuccess"
  | "privacy"
  | "rewards"
  | "recharge"
  | "bills"
  | "travel"
  | "referral"
  | "notifications"
  | "settings"
  | "qr"
  | "rewardVideo"
  | "withdraw"
  | "support";

export interface Bank {
  name: string;
  icon: string;
  color: string;
}

export interface CardData {
  id: string;
  holderName: string;
  number: string;
  expiry: string;
}

export interface SmartPayState {
  screen: Screen;
  selectedBank: Bank | null;
  senderName: string;
  receiverName: string;
  upiId: string;
  amount: string;
  isPremium: boolean;
  balance: number;
  cards: CardData[];
}
