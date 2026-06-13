import { ArrowLeft, Plane, Train, Bus, Hotel, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

interface Props { onBack: () => void; }

const ITEMS = [
  { icon: Plane, label: "Flights", color: "bg-red-100 text-red-600" },
  { icon: Train, label: "Trains", color: "bg-blue-100 text-blue-600" },
  { icon: Bus, label: "Buses", color: "bg-green-100 text-green-600" },
  { icon: Hotel, label: "Hotels", color: "bg-amber-100 text-amber-600" },
];

const TravelScreen = ({ onBack }: Props) => (
  <div className="mx-auto min-h-screen max-w-md bg-background pb-8">
    <div className="flex items-center gap-3 px-5 pt-6 pb-4">
      <Button variant="ghost" size="icon" onClick={onBack}><ArrowLeft className="h-5 w-5" /></Button>
      <h1 className="text-lg font-bold">Travel & Stays</h1>
    </div>

    <div className="grid grid-cols-2 gap-3 px-5">
      {ITEMS.map((it) => (
        <button key={it.label} onClick={() => toast.info(`${it.label} booking — Demo coming soon`)} className="rounded-2xl bg-card p-5 text-left shadow-sm active:scale-95 transition">
          <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${it.color}`}>
            <it.icon className="h-6 w-6" />
          </div>
          <p className="mt-3 text-sm font-semibold">Book {it.label}</p>
          <p className="text-xs text-muted-foreground">Demo flow</p>
        </button>
      ))}
    </div>

    <div className="px-5 pt-6">
      <p className="mb-3 text-sm font-semibold">Travel Offers</p>
      {[
        { title: "Flat 20% off Domestic Flights", code: "FLY20" },
        { title: "₹500 cashback on Hotels", code: "STAY500" },
        { title: "Train tickets — zero convenience fee", code: "RAIL0" },
      ].map((o) => (
        <Card key={o.code} className="mb-2">
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="text-sm font-semibold">{o.title}</p>
              <p className="text-xs text-muted-foreground">Use code <span className="font-mono font-bold">{o.code}</span></p>
            </div>
            <Tag className="h-5 w-5 text-primary" />
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

export default TravelScreen;