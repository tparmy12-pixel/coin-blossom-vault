import { useEffect, useRef } from "react";

interface AdSenseProps {
  slot: string;
  className?: string;
  style?: React.CSSProperties;
}

const AdSense = ({ slot, className = "", style }: AdSenseProps) => {
  const adRef = useRef<HTMLDivElement>(null);
  const pushedRef = useRef(false);

  useEffect(() => {
    if (pushedRef.current) return;
    if (!adRef.current) return;

    const ins = adRef.current.querySelector("ins.adsbygoogle");
    if (!ins) return;

    try {
      (window as any).adsbygoogle = (window as any).adsbygoogle || [];
      (window as any).adsbygoogle.push({});
      pushedRef.current = true;
    } catch (e) {
      console.error("AdSense error:", e);
    }
  }, []);

  return (
    <div ref={adRef} className={`w-full overflow-hidden ${className}`} style={style}>
      <ins
        className="adsbygoogle"
        style={{ display: "block", width: "100%", minHeight: 90 }}
        data-ad-client="ca-pub-3810354048782165"
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
};

export default AdSense;
