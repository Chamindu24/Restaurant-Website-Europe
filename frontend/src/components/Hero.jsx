import { useContext, useRef, useState } from "react";
import { AppContext } from "../context/AppContext";
import { Play, Pause, Volume2, VolumeX, ChevronDown } from "lucide-react";

const Hero = () => {
  const { navigate } = useContext(AppContext);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef(null);

  const togglePlay = () => {
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(!isMuted);
  };

  return (
    <section className="sticky top-0 md:top-22 left-0 min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#0F0F0F]">

      {/* 1. Cinematic Foundation */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover scale-105 animate-subtle-zoom"
          src="/video.mp4"
          autoPlay
          loop
          muted={isMuted}
          playsInline
        />
        {/* Deep Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/60"></div>
        <div className="absolute inset-0 bg-black/30"></div>
      </div>

      {/* 2. The Royal Frame — tighter on mobile */}
      <div className="absolute inset-3 sm:inset-6 md:inset-8 border border-white/15 pointer-events-none z-20"></div>

      {/* 3. Main Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-5 sm:px-8 md:px-6">

        {/* Descriptor */}
        <span className="mb-4 md:mb-6 font-sans text-[9px] md:text-[10px] tracking-[0.4em] md:tracking-[0.6em] text-amber-200/80 uppercase">
          Established 2026 • Mayfair
        </span>

        {/* Hero Title */}
        <div className="relative group">
          {/* Ghost background text — hidden on very small screens to avoid overflow */}
          <h2 className="hidden sm:block absolute -top-8 md:-top-12 left-1/2 -translate-x-1/2 text-white/8 text-7xl md:text-[15rem] font-serif italic select-none whitespace-nowrap transition-transform duration-1000 group-hover:scale-110">
            Heritage
          </h2>

          <h1 className="relative text-[2.8rem] sm:text-6xl md:text-9xl font-serif font-light text-white tracking-[0.15em] md:tracking-[0.2em] uppercase leading-tight">
            Black
            <span className="text-amber-400 font-serif font-light">pepper</span>
          </h1>
        </div>

        {/* Decorative Divider */}
        <div className="mt-6 md:mt-8 flex items-center gap-3 md:gap-4">
          <div className="h-[1px] w-8 md:w-12 bg-white/40"></div>
          <div className="w-1.5 h-1.5 md:w-2 md:h-2 rotate-45 border border-amber-400/80"></div>
          <div className="h-[1px] w-8 md:w-12 bg-white/40"></div>
        </div>

        {/* Tagline */}
        <p className="mt-6 md:mt-8 max-w-xs sm:max-w-md md:max-w-lg text-stone-200/80 font-serif font-semibold tracking-wider italic text-base sm:text-lg md:text-xl leading-relaxed">
          "A symphony of rare spices and local craft, served in the heart of London."
        </p>

        {/* CTA Button */}
        <button
          onClick={() => navigate('/menu')}
          className="mt-8 md:mt-12 group border cursor-pointer border-white/80 relative px-10 sm:px-14 md:px-16 py-3 md:py-4 bg-transparent overflow-hidden"
        >
          <span className="relative z-10 text-white font-sans text-[10px] md:text-[11px] tracking-[0.4em] md:tracking-[0.5em] uppercase">
            View the Collection
          </span>
        </button>
      </div>

      {/* 4. Video Controls — closer to edge on mobile */}
      <div className="absolute bottom-20 sm:bottom-28 md:bottom-32 right-4 sm:right-8 md:right-16 z-30 flex flex-col gap-3 md:gap-4 items-center">
        <button
          onClick={togglePlay}
          className="text-white/80 border cursor-pointer border-white/50 rounded-full p-1.5 md:p-2 hover:text-amber-400 transition-colors"
        >
          {isPlaying
            ? <Pause size={16} strokeWidth={1} className="md:hidden" />
            : <Play size={16} strokeWidth={1} className="md:hidden" />
          }
          {isPlaying
            ? <Pause size={20} strokeWidth={1} className="hidden md:block" />
            : <Play size={20} strokeWidth={1} className="hidden md:block" />
          }
        </button>

        <button
          onClick={toggleMute}
          className="text-white/80 border cursor-pointer border-white/50 rounded-full p-1.5 md:p-2 hover:text-amber-400 transition-colors"
        >
          {isMuted
            ? <VolumeX size={16} strokeWidth={1} className="md:hidden" />
            : <Volume2 size={16} strokeWidth={1} className="md:hidden" />
          }
          {isMuted
            ? <VolumeX size={20} strokeWidth={1} className="hidden md:block" />
            : <Volume2 size={20} strokeWidth={1} className="hidden md:block" />
          }
        </button>
      </div>

      {/* 5. Scroll Indicator */}
      <div className="absolute bottom-6 sm:bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center animate-bounce opacity-50">
        <ChevronDown size={18} className="text-white md:hidden" strokeWidth={1} />
        <ChevronDown size={20} className="text-white hidden md:block" strokeWidth={1} />
      </div>

      {/* 6. Grain Texture */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.04] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] z-20"></div>
    </section>
  );
};

export default Hero;