interface YouTubeProps {
  id: string;
  title?: string;
  start?: number;
}

export default function YouTube({ id, title = "", start }: YouTubeProps) {
  const src = `https://www.youtube.com/embed/${id}${start ? `?start=${start}` : ""}`;

  return (
    <div className="relative w-full max-w-4xl mx-auto my-8">
      <div className="aspect-video rounded-lg overflow-hidden shadow-md">
        <iframe
          src={src}
          title={title || "YouTube video"}
          className="w-full h-full"
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>
    </div>
  );
}
