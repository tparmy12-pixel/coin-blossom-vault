import { useEffect, useState } from "react";
import { ArrowLeft, Play, Copy, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { generateCode, saveCode } from "@/lib/demoCodes";

interface Props { onBack: () => void; onReward: (coins: number) => void; }

const RewardVideoScreen = ({ onBack, onReward }: Props) => {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [code, setCode] = useState<string | null>(null);

  useEffect(() => {
    if (!playing) return;
    const t = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) { clearInterval(t); return 100; }
        return p + 4;
      });
    }, 200);
    return () => clearInterval(t);
  }, [playing]);

  useEffect(() => {
    if (progress >= 100 && !code) {
      const c = generateCode(10);
      saveCode(c, "reward-video");
      setCode(c);
      const reward = 25 + Math.floor(Math.random() * 75);
      onReward(reward);
      toast.success(`Demo reward: +${reward} coins`);
    }
  }, [progress, code, onReward]);

  const copy = () => { if (code) { navigator.clipboard.writeText(code); toast.success("Code copied"); } };

  return (
    <div className="mx-auto min-h-screen max-w-md bg-background pb-8">
      <div className="flex items-center gap-3 px-5 pt-6 pb-4">
        <Button variant="ghost" size="icon" onClick={onBack}><ArrowLeft className="h-5 w-5" /></Button>
        <h1 className="text-lg font-bold">Watch & Earn (Demo)</h1>
      </div>

      <div className="px-5">
        <Card>
          <CardContent className="p-0 overflow-hidden">
            <div className="relative aspect-video bg-gradient-to-br from-red-600 via-rose-600 to-red-800 flex items-center justify-center">
              {!playing && (
                <button onClick={() => setPlaying(true)} className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 active:scale-95">
                  <Play className="h-8 w-8 text-primary" fill="currentColor" />
                </button>
              )}
              {playing && progress < 100 && (
                <div className="text-center text-white">
                  <Gift className="mx-auto h-12 w-12 animate-bounce" />
                  <p className="mt-2 text-sm font-semibold">Demo Ad Playing…</p>
                </div>
              )}
              {progress >= 100 && (
                <div className="text-center text-white animate-fade-in">
                  <p className="text-xs opacity-80">Reward Code</p>
                  <p className="font-mono text-2xl font-extrabold tracking-widest">{code}</p>
                </div>
              )}
              <span className="absolute top-2 left-2 rounded bg-black/40 px-2 py-0.5 text-[10px] text-white">DEMO ONLY</span>
            </div>
            {playing && <Progress value={progress} className="rounded-none" />}
          </CardContent>
        </Card>

        {code && (
          <Card className="mt-4 animate-fade-in">
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <p className="text-xs text-muted-foreground">Your Demo Code</p>
                <p className="font-mono text-lg font-bold">{code}</p>
              </div>
              <Button size="sm" onClick={copy}><Copy className="mr-1 h-4 w-4" />Copy</Button>
            </CardContent>
          </Card>
        )}

        <p className="mt-4 text-center text-[11px] text-muted-foreground">No real ads. No real rewards. Demo learning project.</p>
      </div>
    </div>
  );
};

export default RewardVideoScreen;