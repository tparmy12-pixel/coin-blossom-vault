import { ArrowLeft, QrCode, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

interface Props { upiId: string; onBack: () => void; }

const QRScreen = ({ upiId, onBack }: Props) => (
  <div className="mx-auto min-h-screen max-w-md bg-background pb-8">
    <div className="flex items-center gap-3 px-5 pt-6 pb-4">
      <Button variant="ghost" size="icon" onClick={onBack}><ArrowLeft className="h-5 w-5" /></Button>
      <h1 className="text-lg font-bold">Scan & Pay</h1>
    </div>

    <div className="px-5">
      <Card>
        <CardContent className="p-6 text-center">
          <div className="mx-auto flex h-48 w-48 items-center justify-center rounded-2xl border-4 border-dashed border-primary/40 bg-accent/30">
            <Camera className="h-12 w-12 text-primary/60" />
          </div>
          <p className="mt-3 text-sm font-semibold">Scan a QR code</p>
          <p className="text-xs text-muted-foreground">Demo camera placeholder</p>
          <Button className="mt-4 w-full rounded-2xl" onClick={() => toast.info("Camera access needed for real scan (demo)")}>Open Camera</Button>
        </CardContent>
      </Card>
    </div>

    <div className="px-5 pt-6">
      <p className="mb-3 text-sm font-semibold">Your QR Code</p>
      <Card>
        <CardContent className="p-6 text-center">
          <div className="mx-auto flex h-48 w-48 items-center justify-center rounded-2xl bg-white">
            <QrCode className="h-40 w-40 text-foreground" />
          </div>
          <p className="mt-3 text-sm font-mono font-semibold">{upiId || "demo@prankpay"}</p>
          <p className="text-xs text-muted-foreground">Share to receive payments (demo)</p>
        </CardContent>
      </Card>
    </div>
  </div>
);

export default QRScreen;