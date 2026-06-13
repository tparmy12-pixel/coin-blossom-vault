import { ArrowLeft, Copy, Share2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

interface Props { code: string; onBack: () => void; }

const ReferralScreen = ({ code, onBack }: Props) => {
  const copy = () => { navigator.clipboard.writeText(code); toast.success("Referral code copied!"); };
  const share = async () => {
    const text = `Join PRANK pay using my code ${code} and we both earn 50 coins! `;
    if (navigator.share) { try { await navigator.share({ text }); } catch {} }
    else { navigator.clipboard.writeText(text); toast.success("Invite copied!"); }
  };
  return (
    <div className="mx-auto min-h-screen max-w-md bg-background pb-8">
      <div className="flex items-center gap-3 px-5 pt-6 pb-4">
        <Button variant="ghost" size="icon" onClick={onBack}><ArrowLeft className="h-5 w-5" /></Button>
        <h1 className="text-lg font-bold">Refer & Earn</h1>
      </div>
      <div className="px-5">
        <Card className="wallet-gradient border-0 text-primary-foreground">
          <CardContent className="p-6 text-center">
            <Users className="mx-auto h-10 w-10" />
            <p className="mt-2 text-sm opacity-80">Invite friends & earn</p>
            <p className="text-3xl font-extrabold">50 coins each</p>
            <div className="mt-4 rounded-xl bg-white/20 p-3">
              <p className="text-[10px] opacity-80">Your referral code</p>
              <p className="text-2xl font-mono font-bold tracking-wider">{code}</p>
            </div>
            <div className="mt-4 flex gap-2">
              <Button variant="outline" className="flex-1 rounded-2xl border-white/30 bg-white/10 text-white hover:bg-white/20" onClick={copy}>
                <Copy className="mr-1 h-4 w-4" /> Copy
              </Button>
              <Button className="flex-1 rounded-2xl bg-white text-primary hover:bg-white/90" onClick={share}>
                <Share2 className="mr-1 h-4 w-4" /> Share
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="px-5 pt-6">
        <p className="mb-3 text-sm font-semibold">Referral Stats</p>
        <div className="grid grid-cols-3 gap-2">
          {[["Invited","0"],["Joined","0"],["Earned","0"]].map(([l,v]) => (
            <Card key={l}><CardContent className="p-4 text-center"><p className="text-xl font-bold">{v}</p><p className="text-xs text-muted-foreground">{l}</p></CardContent></Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReferralScreen;