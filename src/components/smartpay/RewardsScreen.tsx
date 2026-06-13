import { useState } from "react";
import { ArrowLeft, Gift, Calendar, Sparkles, Users, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

interface Props {
  coins: number;
  onEarn: (amount: number, source: string) => void;
  onBack: () => void;
}

const XP_LEVELS = ["Beginner", "Bronze", "Silver", "Gold", "Platinum", "Diamond", "VIP"];

const RewardsScreen = ({ coins, onEarn, onBack }: Props) => {
  const [checkedIn, setCheckedIn] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const levelIdx = Math.min(Math.floor(coins / 200), XP_LEVELS.length - 1);

  const checkIn = () => {
    if (checkedIn) return toast.info("Already checked in today");
    setCheckedIn(true);
    onEarn(10, "Daily check-in");
    toast.success("+10 coins! Daily check-in done");
  };

  const spin = () => {
    if (spinning) return;
    setSpinning(true);
    const prize = [5, 10, 20, 50, 100][Math.floor(Math.random() * 5)];
    const target = 360 * 5 + Math.floor(Math.random() * 360);
    setRotation((r) => r + target);
    setTimeout(() => {
      setSpinning(false);
      onEarn(prize, "Spin wheel");
      toast.success(`🎉 You won ${prize} coins!`);
    }, 2500);
  };

  return (
    <div className="mx-auto min-h-screen max-w-md bg-background pb-8">
      <div className="flex items-center gap-3 px-5 pt-6 pb-4">
        <Button variant="ghost" size="icon" onClick={onBack}><ArrowLeft className="h-5 w-5" /></Button>
        <h1 className="text-lg font-bold">Rewards & Earnings</h1>
      </div>

      <div className="px-5">
        <Card className="wallet-gradient border-0 text-primary-foreground">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs opacity-80">Reward Coins</p>
                <p className="mt-1 text-3xl font-extrabold">🪙 {coins}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] opacity-80">Level</p>
                <p className="text-sm font-bold">{XP_LEVELS[levelIdx]}</p>
                <Trophy className="ml-auto mt-1 h-5 w-5" />
              </div>
            </div>
            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-white/20">
              <div className="h-full bg-white" style={{ width: `${((coins % 200) / 200) * 100}%` }} />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-3 px-5 pt-5">
        <button onClick={checkIn} className="rounded-2xl bg-card p-4 text-left shadow-sm active:scale-95 transition">
          <Calendar className="h-6 w-6 text-primary" />
          <p className="mt-2 text-sm font-semibold">Daily Check-in</p>
          <p className="text-xs text-muted-foreground">+10 coins</p>
        </button>
        <button onClick={() => { onEarn(15, "Watched ad"); toast.success("+15 coins from ad!"); }} className="rounded-2xl bg-card p-4 text-left shadow-sm active:scale-95 transition">
          <Sparkles className="h-6 w-6 text-primary" />
          <p className="mt-2 text-sm font-semibold">Watch Ad</p>
          <p className="text-xs text-muted-foreground">+15 coins</p>
        </button>
        <button onClick={() => { onEarn(25, "Task done"); toast.success("+25 coins task reward!"); }} className="rounded-2xl bg-card p-4 text-left shadow-sm active:scale-95 transition">
          <Gift className="h-6 w-6 text-primary" />
          <p className="mt-2 text-sm font-semibold">Complete Task</p>
          <p className="text-xs text-muted-foreground">+25 coins</p>
        </button>
        <button onClick={() => { onEarn(50, "Referral"); toast.success("+50 coins per referral!"); }} className="rounded-2xl bg-card p-4 text-left shadow-sm active:scale-95 transition">
          <Users className="h-6 w-6 text-primary" />
          <p className="mt-2 text-sm font-semibold">Refer Friend</p>
          <p className="text-xs text-muted-foreground">+50 coins</p>
        </button>
      </div>

      <div className="px-5 pt-6">
        <p className="mb-3 text-sm font-semibold">Spin & Win</p>
        <Card>
          <CardContent className="flex flex-col items-center p-6">
            <div className="relative h-48 w-48">
              <div
                className="h-full w-full rounded-full border-8 border-primary transition-transform duration-[2500ms] ease-out"
                style={{
                  transform: `rotate(${rotation}deg)`,
                  background: "conic-gradient(hsl(0 84% 55%) 0 60deg, hsl(0 0% 100%) 60deg 120deg, hsl(0 84% 55%) 120deg 180deg, hsl(0 0% 100%) 180deg 240deg, hsl(0 84% 55%) 240deg 300deg, hsl(0 0% 100%) 300deg 360deg)",
                }}
              />
              <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1 text-2xl">▼</div>
              <div className="absolute inset-1/2 -translate-x-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-card text-xs font-bold">SPIN</div>
            </div>
            <Button className="mt-5 w-full rounded-2xl" onClick={spin} disabled={spinning}>
              {spinning ? "Spinning..." : "SPIN NOW"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RewardsScreen;