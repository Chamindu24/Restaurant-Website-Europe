import { useContext, useRef, useState } from "react";
import { AppContext } from "../context/AppContext";

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
    <section
      className="sticky top-16 md:top-20 left-0 z-10 min-h-[calc(100dvh-4rem)] md:min-h-[calc(100dvh-5rem)] flex items-center justify-center overflow-hidden"

    >
        {/* Background Video */}
  <video
    className="absolute inset-0 w-full h-full object-cover"
    src="/video.mp4"
    autoPlay
    loop
    muted
    playsInline
  />


      {/* Content */}
      <div className="relative z-10 text-center text-white px-6">
        <span className="block text-sm uppercase tracking-[0.4em] mb-4 text-amber-400 font-medium">
          Est. 2026 • London
        </span>

        <h1 className="text-5xl md:text-8xl font-serif italic mb-6 tracking-tight">
          The <span className="text-amber-200">Grand</span> Pavilion
        </h1>
        
        <p className="text-lg md:text-2xl font-light mb-12 max-w-3xl mx-auto italic leading-relaxed font-serif opacity-90">
          An exquisite journey through culinary excellence, served with the timeless elegance of British tradition.
        </p>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-8">
          <button
            onClick={() => navigate("/menu")}
            className="group relative cursor-pointer px-10 py-4 overflow-hidden border border-amber-500 bg-amber-600/10 transition-all duration-500 hover:bg-amber-500"
          >
            <span className="relative z-10 text-sm uppercase tracking-[0.2em] font-semibold group-hover:text-black transition-colors duration-500">
              Explore Our Menus
            </span>
          </button>

          <button
            onClick={() => navigate("/book-table")}
            className="cursor-pointer group flex items-center gap-3 text-sm uppercase tracking-[0.2em] font-semibold transition-all duration-300 hover:text-amber-400"
          >
            <span className="border-b border-white group-hover:border-amber-400 py-1">
              Reserve a Table
            </span>
            <svg 
              className="w-5 h-5 transform group-hover:translate-x-2 transition-transform duration-300" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent"></div>
    </section>
  );
};
export default Hero;