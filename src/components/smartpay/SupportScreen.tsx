import { useState, useEffect, useRef } from "react";
import { ArrowLeft, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { addSupport, getSupport, SupportMsg } from "@/lib/demoCodes";

interface Props { onBack: () => void; }

const SupportScreen = ({ onBack }: Props) => {
  const [msgs, setMsgs] = useState<SupportMsg[]>(getSupport());
  const [text, setText] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const i = setInterval(() => setMsgs(getSupport()), 1500);
    return () => clearInterval(i);
  }, []);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs]);

  const send = () => {
    if (!text.trim()) return;
    addSupport("user", text.trim());
    setText("");
    setMsgs(getSupport());
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col bg-background">
      <div className="flex items-center gap-3 px-5 pt-6 pb-4 border-b">
        <Button variant="ghost" size="icon" onClick={onBack}><ArrowLeft className="h-5 w-5" /></Button>
        <div>
          <h1 className="text-base font-bold">Customer Support</h1>
          <p className="text-[10px] text-muted-foreground">Demo chat • Admin replies via panel</p>
        </div>
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto px-4 py-4">
        {msgs.length === 0 && (
          <p className="text-center text-xs text-muted-foreground mt-8">Say hi to start the conversation.</p>
        )}
        {msgs.map((m) => (
          <div key={m.id} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[75%] rounded-2xl px-3 py-2 text-sm ${m.from === "user" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
              {m.text}
              <p className="mt-1 text-[9px] opacity-60">{new Date(m.at).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</p>
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      <div className="flex items-center gap-2 border-t bg-card p-3">
        <Input placeholder="Type a message…" value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} className="rounded-full" />
        <Button size="icon" onClick={send} className="rounded-full"><Send className="h-4 w-4" /></Button>
      </div>
    </div>
  );
};

export default SupportScreen;