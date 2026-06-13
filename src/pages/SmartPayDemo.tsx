import { useState, useCallback } from "react";
import { toast } from "sonner";
import type { Screen, Bank, CardData } from "@/components/smartpay/types";
import HomeScreen from "@/components/smartpay/HomeScreen";
import BankSelectionScreen from "@/components/smartpay/BankSelectionScreen";
import PaymentFormScreen from "@/components/smartpay/PaymentFormScreen";
import SuccessScreen from "@/components/smartpay/SuccessScreen";
import AddMoneyScreen from "@/components/smartpay/AddMoneyScreen";
import CardsScreen from "@/components/smartpay/CardsScreen";
import UpgradeScreen from "@/components/smartpay/UpgradeScreen";
import PrivacyScreen from "@/components/smartpay/PrivacyScreen";
import RewardsScreen from "@/components/smartpay/RewardsScreen";
import RechargeScreen from "@/components/smartpay/RechargeScreen";
import TravelScreen from "@/components/smartpay/TravelScreen";
import ReferralScreen from "@/components/smartpay/ReferralScreen";
import NotificationsScreen from "@/components/smartpay/NotificationsScreen";
import SettingsScreen from "@/components/smartpay/SettingsScreen";
import QRScreen from "@/components/smartpay/QRScreen";
import RewardVideoScreen from "@/components/smartpay/RewardVideoScreen";
import WithdrawalScreen from "@/components/smartpay/WithdrawalScreen";
import SupportScreen from "@/components/smartpay/SupportScreen";
import { useEffect } from "react";

const generateTxnId = () =>
  "TXN" + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substring(2, 6).toUpperCase();

const SmartPayDemo = () => {
  const [screen, setScreen] = useState<Screen>("home");
  const [selectedBank, setSelectedBank] = useState<Bank | null>(null);
  const [senderName, setSenderName] = useState("Demo User");
  const [receiverName, setReceiverName] = useState("");
  const [upiId, setUpiId] = useState("");
  const [amount, setAmount] = useState("");
  const [isPremium, setIsPremium] = useState(false);
  const [balance, setBalance] = useState(10000);
  const [cards, setCards] = useState<CardData[]>([]);
  const [txnId, setTxnId] = useState(generateTxnId());
  const [txnDate, setTxnDate] = useState(new Date().toLocaleString("en-IN"));
  const [lastAction, setLastAction] = useState<"send" | "add">("send");
  const [coins, setCoins] = useState(0);
  const [referralCode] = useState(() => "PRANK" + Math.random().toString(36).substring(2, 7).toUpperCase());

  useEffect(() => {
    if (localStorage.getItem("prankpay_theme") === "dark") {
      document.documentElement.classList.add("dark");
    }
  }, []);

  const earnCoins = (amount: number, _src: string) => setCoins((c) => c + amount);

  const resetSendFlow = useCallback(() => {
    setScreen("home");
    setSelectedBank(null);
    setReceiverName("");
    setUpiId("");
    setAmount("");
  }, []);

  const handlePay = () => {
    if (!receiverName || !upiId || !amount || Number(amount) <= 0) {
      toast.error("Please fill all fields");
      return;
    }
    if (Number(amount) > balance) {
      toast.error("Insufficient demo balance");
      return;
    }
    setBalance((b) => b - Number(amount));
    setTxnId(generateTxnId());
    setTxnDate(new Date().toLocaleString("en-IN"));
    setLastAction("send");
    setScreen("success");
  };

  const handleAddMoney = (val: number) => {
    setBalance((b) => b + val);
    setAmount(String(val));
    setTxnId(generateTxnId());
    setTxnDate(new Date().toLocaleString("en-IN"));
    setLastAction("add");
    setScreen("addMoneySuccess");
  };

  switch (screen) {
    case "home":
      return <HomeScreen balance={balance} coins={coins} isPremium={isPremium} onNavigate={setScreen} />;
    case "bank":
      return <BankSelectionScreen selectedBank={selectedBank} onSelect={(bank) => { setSelectedBank(bank); setScreen("form"); }} onBack={() => setScreen("home")} />;
    case "form":
      return (
        <PaymentFormScreen
          selectedBank={selectedBank}
          senderName={senderName} receiverName={receiverName} upiId={upiId} amount={amount}
          onSenderChange={setSenderName} onReceiverChange={setReceiverName} onUpiChange={setUpiId} onAmountChange={setAmount}
          onPay={handlePay} onBack={() => setScreen("bank")}
        />
      );
    case "success":
      return (
        <SuccessScreen
          txnId={txnId} txnDate={txnDate} senderName={senderName} receiverName={receiverName}
          bankName={selectedBank?.name || "—"} amount={amount} onDone={resetSendFlow}
        />
      );
    case "addMoney":
      return <AddMoneyScreen balance={balance} isPremium={isPremium} onAdd={handleAddMoney} onBack={() => setScreen("home")} />;
    case "addMoneySuccess":
      return (
        <SuccessScreen
          txnId={txnId} txnDate={txnDate} senderName="SmartPay Wallet" receiverName={senderName}
          bankName="Demo Wallet" amount={amount} onDone={() => setScreen("home")}
          title="Money Added!" subtitle="Demo balance has been updated"
        />
      );
    case "cards":
      return (
        <CardsScreen
          cards={cards}
          onAddCard={(card) => setCards((c) => [...c, card])}
          onDeleteCard={(id) => setCards((c) => c.filter((card) => card.id !== id))}
          onBack={() => setScreen("home")}
        />
      );
    case "upgrade":
      return <UpgradeScreen isPremium={isPremium} onUpgrade={() => setIsPremium(true)} onBack={() => setScreen("home")} />;
    case "privacy":
      return <PrivacyScreen onBack={() => setScreen("home")} />;
    case "rewards":
      return <RewardsScreen coins={coins} onEarn={earnCoins} onBack={() => setScreen("home")} />;
    case "recharge":
      return <RechargeScreen mode="recharge" onBack={() => setScreen("home")} />;
    case "bills":
      return <RechargeScreen mode="bills" onBack={() => setScreen("home")} />;
    case "travel":
      return <TravelScreen onBack={() => setScreen("home")} />;
    case "referral":
      return <ReferralScreen code={referralCode} onBack={() => setScreen("home")} />;
    case "notifications":
      return <NotificationsScreen onBack={() => setScreen("home")} />;
    case "settings":
      return <SettingsScreen onBack={() => setScreen("home")} onPrivacy={() => setScreen("privacy")} />;
    case "qr":
      return <QRScreen upiId={upiId || "demo@prankpay"} onBack={() => setScreen("home")} />;
    case "rewardVideo":
      return <RewardVideoScreen onBack={() => setScreen("home")} onReward={(c) => earnCoins(c, "video")} />;
    case "withdraw":
      return <WithdrawalScreen balance={balance} onBack={() => setScreen("home")} />;
    case "support":
      return <SupportScreen onBack={() => setScreen("home")} />;
    default:
      return null;
  }
};

export default SmartPayDemo;
