import { useNavigate } from "react-router-dom";

const Offers = () => {
  const navigate = useNavigate();

  // Premium Gold Gradient - more refined for light backgrounds
  const shinyGoldGradient = "bg-gradient-to-tr from-[#B8860B] via-[#D4AF37] to-[#F7E27E]";

  return (
    <section className="relative py-16 md:py-24 bg-[#FCFAF8] text-[#1A1A1A] overflow-hidden px-6">
      {/* Background Decorative Element: Very faint Crimson wash */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#3D0C0C]/5 blur-[120px] rounded-full -z-10" />

      <div className="max-w-8xl px-0 md:px-6 mx-auto">
        <div className="flex flex-col md:flex-row gap-10 md:gap-16 items-center">

          {/* Left Section */}
          <div className="w-full pl-2 md:pl-0 md:w-1/3 text-left">
            <h4 className="text-[#8E651A] font-black text-xs md:text-sm uppercase tracking-[0.4em] md:tracking-[0.5em] mb-3 md:mb-4">
              Customer Rewards
            </h4>

            <h2 className="text-4xl sm:text-5xl md:text-7xl font-serif font-bold leading-none uppercase mb-5 md:mb-6 text-[#1A1A1A]">
              Enjoy More <br /> <span className="text-[#8E651A]">Every Visit</span>
            </h2>

            {/* The Signature Gold Line */}
            <div className={`w-16 md:w-20 h-1 mb-6 md:mb-8 ${shinyGoldGradient} shadow-sm`}></div>

            <p className="text-base md:text-lg font-bold text-[#3D0C0C] leading-relaxed uppercase tracking-tight opacity-80">
              We love rewarding our guests. <br />
              Discover special offers, <br />
              exclusive treats, and <br />
              little extras made just for you.
            </p>
          </div>

          {/* Right Section */}
          <div className="w-full md:w-2/3 relative mt-8 md:mt-0">
            
            {/* Outer Decorative Gold Frame - Subtle for light mode */}
            <div className="hidden md:block absolute -top-6 -left-6 w-full h-full border-2 border-[#D4AF37]/20 -z-0" />

            {/* Main Container: The Royal Crimson Box */}
            <div className="relative z-10 bg-[#2D0A0A] border-[1px] border-[#D4AF37]/40 p-1 md:p-2 shadow-[20px_40px_80px_rgba(45,10,10,0.25)]">

              {/* Inner Content Area: Deep Crimson Gradient */}
              <div className="bg-gradient-to-br from-[#3D0C0C] to-[#2D0A0A] p-8 sm:p-12 md:p-20 text-center relative overflow-hidden">
                
                {/* Subtle Shimmer Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_5s_infinite]" />
                
                {/* Texture Pattern (Cubes) */}
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none"></div>

                <h3 className="text-2xl sm:text-3xl md:text-5xl font-serif font-black italic mb-4 md:mb-6 text-[#F9F4E8]">
                  Your <span className="bg-gradient-to-b from-[#F7E27E] to-[#D4AF37] bg-clip-text text-transparent">Rewards</span> Are Waiting
                </h3>

                <p className="text-base sm:text-xl md:text-3xl font-semibold font-serif text-[#eadcc5] mb-8 md:mb-10 leading-relaxed italic">
                  Earn points, unlock special dishes, and enjoy exclusive benefits every time you dine with us.
                </p>

                <div className="flex flex-col items-center">
                  <button
                    onClick={() => navigate("/rewards")}
                    className={`group relative ${shinyGoldGradient} cursor-pointer text-[#1A1A1A] px-8 sm:px-12 py-4 sm:py-6 font-black text-base sm:text-xl uppercase tracking-[0.2em] sm:tracking-[0.3em] transition-all duration-300 hover:scale-105 w-full sm:w-auto shadow-[0_15px_30px_rgba(184,134,11,0.3)] overflow-hidden`}
                  >
                    {/* Metallic Shine Animation */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    <span className="relative z-10">View Rewards</span>
                  </button>

                  <div className="mt-6 md:mt-8 flex items-center gap-3 md:gap-4">
                    <span className="h-[1px] w-6 md:w-8 bg-[#D4AF37]/50"></span>
                    <span className="text-[11px] md:text-[14px] uppercase font-black tracking-widest text-[#D4AF37] text-center">
                      Available to All Guests
                    </span>
                    <span className="h-[1px] w-6 md:w-8 bg-[#D4AF37]/50"></span>
                  </div>
                </div>

                {/* Royal Corner Accents */}
                <div className="absolute top-4 left-4 w-8 h-8 border-t border-l border-[#D4AF37]/40"></div>
                <div className="absolute bottom-4 right-4 w-8 h-8 border-b border-r border-[#D4AF37]/40"></div>

              </div>
            </div>
          </div>

        </div>
      </div>
      
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          20% { transform: translateX(100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </section>
  );
};

export default Offers;