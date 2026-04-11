import { ArrowLeft, Plus, Trash2, AlertTriangle, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";
import type { CardData } from "./types";

interface Props {
  cards: CardData[];
  onAddCard: (card: CardData) => void;
  onDeleteCard: (id: string) => void;
  onBack: () => void;
}

const maskNumber = (num: string) => {
  const clean = num.replace(/\s/g, "");
  if (clean.length < 8) return clean;
  return clean.slice(0, 4) + " •••• •••• " + clean.slice(-4);
};

const CardsScreen = ({ cards, onAddCard, onDeleteCard, onBack }: Props) => {
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [expiry, setExpiry] = useState("");

  const handleAdd = () => {
    if (!name || number.replace(/\s/g, "").length < 12 || !expiry) {
      toast.error("Please fill all card fields");
      return;
    }
    onAddCard({
      id: Date.now().toString(),
      holderName: name,
      number: number.replace(/\s/g, ""),
      expiry,
    });
    setAdding(false);
    setName("");
    setNumber("");
    setExpiry("");
    toast.success("Demo card added!");
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col bg-background">
      <div className="flex items-center gap-3 px-5 pt-6 pb-2">
        <button onClick={onBack} className="rounded-full p-1.5 hover:bg-muted">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <span className="text-lg font-bold">My Cards</span>
      </div>

      <div className="px-5 pt-3">
        <div className="rounded-xl bg-destructive/10 border border-destructive/20 p-3 flex items-start gap-2">
          <AlertTriangle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
          <p className="text-xs text-destructive">⚠️ This is a demo app. Do not enter real card details.</p>
        </div>
      </div>

      <div className="px-5 pt-4 space-y-3">
        {cards.map((card) => (
          <div key={card.id} className="relative rounded-2xl overflow-hidden" style={{ background: "linear-gradient(135deg, hsl(var(--primary)), hsl(230 94% 40%))" }}>
            <div className="p-5 text-white">
              <div className="flex justify-between items-start">
                <CreditCard className="h-8 w-8 opacity-60" />
                <button onClick={() => onDeleteCard(card.id)} className="p-1 rounded-full hover:bg-white/20">
                  <Trash2 className="h-4 w-4 text-white/70" />
                </button>
              </div>
              <p className="mt-4 text-lg font-mono tracking-widest">{maskNumber(card.number)}</p>
              <div className="mt-3 flex justify-between">
                <div>
                  <p className="text-[10px] uppercase opacity-60">Card Holder</p>
                  <p className="text-sm font-medium">{card.holderName}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase opacity-60">Expires</p>
                  <p className="text-sm font-medium">{card.expiry}</p>
                </div>
              </div>
            </div>
          </div>
        ))}

        {cards.length === 0 && !adding && (
          <div className="text-center py-8 text-muted-foreground">
            <CreditCard className="h-10 w-10 mx-auto mb-2 opacity-40" />
            <p className="text-sm">No demo cards added yet</p>
          </div>
        )}

        {adding ? (
          <div className="space-y-3 pt-2">
            <Input placeholder="Card Holder Name" value={name} onChange={(e) => setName(e.target.value)} className="rounded-xl" />
            <Input placeholder="Card Number (demo)" value={number} onChange={(e) => setNumber(e.target.value)} className="rounded-xl font-mono" maxLength={19} />
            <Input placeholder="MM/YY" value={expiry} onChange={(e) => setExpiry(e.target.value)} className="rounded-xl" maxLength={5} />
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1 rounded-xl" onClick={() => setAdding(false)}>Cancel</Button>
              <Button className="flex-1 rounded-xl" onClick={handleAdd}>Add Card</Button>
            </div>
          </div>
        ) : (
          <Button variant="outline" className="w-full h-12 rounded-2xl gap-2" onClick={() => setAdding(true)}>
            <Plus className="h-4 w-4" /> Add Demo Card
          </Button>
        )}
      </div>
    </div>
  );
};

export default CardsScreen;
