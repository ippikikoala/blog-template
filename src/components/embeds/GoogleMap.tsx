interface GoogleMapProps {
  src: string;
  title?: string;
}

export default function GoogleMap({ src, title = "" }: GoogleMapProps) {
  return (
    <div className="relative w-full max-w-4xl mx-auto my-8">
      <div className="aspect-[4/3] rounded-lg overflow-hidden shadow-md border border-[var(--border-color)]">
        <iframe
          src={src}
          title={title || "Google Maps"}
          className="w-full h-full"
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          style={{ border: 0 }}
        />
      </div>
    </div>
  );
}
