export default function AboutSection() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center items-center overflow-hidden bg-[#0A0A0A]">
      
      {/* --- BACKGROUND LAYER: FULL COVER --- */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/chef.jpg" 
          alt="Blackpepper London Heritage" 
          className="w-full h-full object-cover grayscale-[50%] brightness-[0.7]"
        />
        {/* The Midnight Wash - Deep charcoal with a touch of warmth */}
        <div className="absolute inset-0 bg-[#0A0A0A]/85 backdrop-blur-[1px]"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10 flex flex-col items-center">
        
        {/* --- TOP: THE MONOLITHIC LOGO MASK --- */}
        <div className="w-full text-center mb-10">
          <span className="inline-block text-amber-500/80 text-[24px] tracking-[1em] uppercase font-black mb-4 animate-fade-in">
            About the
          </span>

          <h3 
            className="text-[13vw] font-serif font-black leading-none tracking-[-0.02em] uppercase bg-fixed bg-cover bg-center bg-clip-text text-transparent select-none drop-shadow-2xl"
            style={{ 
              backgroundImage: "url('/chef.jpg')",
              WebkitBackgroundClip: "text",
              filter: "brightness(0.75) contrast(0.9)"
            }}
          >
            Blackpepper
          </h3>
          

        </div>

        {/* --- BOTTOM: REFINED CONTENT --- */}
            <div className="max-w-7xl w-full  text-center px-6">


            <p className="font-serif text-lg md:text-[1.75rem] leading-[1.4] md:leading-[1.3] tracking-[-0.01em]">
                {/* Highlighted Lead-in */}
                <span className="text-white/90 font-medium">
                Blackpepper is a refined culinary destination where timeless elegance meets modern craftsmanship.
                </span>
                
                {/* Subtle Secondary Text */}
                <span className="text-stone-300 font-light italic block mt-6">
                Inspired by classic traditions and elevated through contemporary technique, every detail — 
                <span className="text-amber-500/80 not-italic uppercase text-[10px] tracking-[0.4em] align-middle mx-4">
                    The Heritage
                </span>
                from carefully sourced ingredients to the intimate atmosphere — is designed to offer a calm, 
                immersive dining experience.
                </span>

                {/* The Final Punchline */}
                <span className="text-stone-300 font-light block mt-8 text-xl md:text-2xl uppercase tracking-[0.1em]">
                Here, flavor is treated as an <span className="text-white">art form</span>, service is personal, and every moment is meant to be <span className="text-amber-600 italic">savored</span>.
                </span>
            </p>


            </div>
      </div>


    </section>
  );
}