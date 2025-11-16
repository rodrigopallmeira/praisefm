import { useEffect, useState } from "react";
import Image from "next/image";
import { Play, Pause, SkipBack, SkipForward } from "lucide-react";

export default function DynamicMusicPlayer({ track }) {
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [bgColor, setBgColor] = useState("#1a1a1a");

  useEffect(() => {
    if (!track?.cover) return;

    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.src = track.cover;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      try {
        const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        let r = 0, g = 0, b = 0, count = 0;

        for (let i = 0; i < data.length; i += 4 * 50) {
          r += data[i];
          g += data[i + 1];
          b += data[i + 2];
          count++;
        }

        r = Math.floor(r / count);
        g = Math.floor(g / count);
        b = Math.floor(b / count);

        setBgColor(`rgb(${r}, ${g}, ${b})`);
      } catch (e) {
        console.error("Color extraction failed", e);
      }
    };
  }, [track]);

  return (
    <div
      className="w-full h-screen flex items-center justify-center p-6"
      style={{
        background: `linear-gradient(to bottom, ${bgColor}, #000)`
      }}
    >
      <div className="backdrop-blur-2xl rounded-2xl p-8 shadow-2xl max-w-lg w-full bg-white/5 border border-white/10">
        <div className="flex flex-col items-center">
          <div className="relative w-72 h-72 rounded-xl overflow-hidden shadow-lg mb-6">
            <Image
              src={track.cover}
              alt="Capa"
              fill
              className="object-cover"
            />
          </div>

          <h2 className="text-white text-xl font-semibold text-center">{track.title}</h2>
          <p className="text-gray-300 text-md mb-4 text-center">{track.artist}</p>

          <div className="w-full h-1.5 bg-white/20 rounded-full mb-4">
            <div
              className="h-full bg-white rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          <div className="flex items-center gap-6 mt-3">
            <button className="text-white/80 hover:text-white">
              <SkipBack size={32} />
            </button>

            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-16 h-16 bg-white text-black rounded-full flex items-center justify-center shadow-lg active:scale-95"
            >
              {isPlaying ? <Pause size={32} /> : <Play size={32} />}
            </button>

            <button className="text-white/80 hover:text-white">
              <SkipForward size={32} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
