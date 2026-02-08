import React, { useEffect, useRef } from "react";
import { motion, animate, useMotionValue } from "framer-motion";

const testimonials = [
  {
    name: "Donald Jackman",
    role: "Culinary Critic",
    image: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200",
    text: "The ambiance is matched only by the exquisite plating. A truly regal dining experience."
  },
  {
    name: "Elena Rossi",
    role: "Lifestyle Blogger",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200",
    text: "It feels like dining in a royal palace in the heart of Rome. The truffles are world-class."
  },
  {
    name: "Marcus Thorne",
    role: "Food Photographer",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200",
    text: "From a visual standpoint, it’s perfection. The textures of the food are a photographer’s dream."
  },
  {
    name: "Sophia Von Berg",
    role: "Event Planner",
    image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=200",
    text: "The attention to detail in the décor and the menu is simply breathtaking. Highly recommended."
  },
  {
    name: "James Washington",
    role: "Marketing Manager",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200",
    text: "Unparalleled European elegance. The perfect venue for sophisticated business dinners."
  },
  {
    name: "Isabella Montagne",
    role: "Sommelier",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200",
    text: "The wine cellar is a masterpiece of curation. A rare find even by European standards."
  }
];

const GoldStar = () => (
  <svg width="10" height="10" viewBox="0 0 22 20" fill="#D4AF37">
    <path d="M10.525.464a.5.5 0 0 1 .95 0l2.107 6.482a.5.5 0 0 0 .475.346h6.817a.5.5 0 0 1 .294.904l-5.515 4.007a.5.5 0 0 0-.181.559l2.106 6.483a.5.5 0 0 1-.77.559l-5.514-4.007a.5.5 0 0 0-.588 0l-5.514 4.007a.5.5 0 0 1-.77-.56l2.106-6.482a.5.5 0 0 0-.181-.56L.832 8.197a.5.5 0 0 1 .294-.904h6.817a.5.5 0 0 0 .475-.346z" />
  </svg>
);

export default function Testimonial() {
  // We use a very long track to make the "linear" loop unnoticeable
  const fullTrack = [...testimonials, ...testimonials, ...testimonials];
  const x = useMotionValue(0);
  const controlsRef = useRef(null);

  useEffect(() => {
    const controls = animate(x, [0, -2800], {
      duration: 80,
      repeat: Infinity,
      ease: "linear",
    });

    controlsRef.current = controls;

    return () => controls.stop();
  }, [x]);

  const handleHoverStart = () => {
    controlsRef.current?.pause();
  };

  const handleHoverEnd = () => {
    controlsRef.current?.play();
  };

  return (
    <section className="bg-[#fcfaf8] py-32 overflow-hidden relative border-t border-b border-[#eeeae5]  rounded-b-4xl">
      {/* Decorative center crest background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[20rem] font-serif text-[#f2ede8] opacity-20 pointer-events-none select-none">
        R
      </div>

      <div className="relative z-10 text-center mb-24">
        <h2 className="text-[#2a2a2a] font-serif text-5xl md:text-6xl font-extralight tracking-tighter italic">
          What our guests <span className="not-italic text-[#D4AF37]">cherish</span>
        </h2>
        <p className="mt-4 text-gray-400 font-sans uppercase tracking-[0.4em] text-[10px] font-bold">
          The Art of Hospitality
        </p>
      </div>

      <div className="relative">
        <motion.div className="flex gap-12 px-6" style={{ x }}>
          {fullTrack.map((item, index) => (
            <motion.div
              key={index}
              className="flex-shrink-0 w-[420px] cursor-pointer bg-white p-14 rounded-full border border-gray-100 shadow-[0_4px_30px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_50px_rgba(212,175,55,0.08)] transition-all duration-700 hover:border-[#D4AF37]/30 group"
              onHoverStart={handleHoverStart}
              onHoverEnd={handleHoverEnd}
            >
              <div className="flex flex-col items-center">
                <p className="text-[#555] font-serif text-lg italic leading-[1.8] text-center mb-10 whitespace-normal">
                  "{item.text}"
                </p>
                
                <div className="flex items-center gap-4 text-left">
                  <img
                    className="h-16 w-16 rounded-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000"
                    src={item.image}
                    alt={item.name}
                  />
                  <div>
                    <h3 className="text-[#1a1a1a] font-serif text-lg tracking-tight leading-none mb-1">
                      {item.name}
                    </h3>
                    <div className="flex gap-0.5 mb-1">
                      {[...Array(5)].map((_, i) => <GoldStar key={i} />)}
                    </div>
                    <p className="text-[#D4AF37] font-sans text-[9px] tracking-widest uppercase font-bold">
                      {item.role}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Side Masks for the 'fading in' effect */}
        <div className="absolute inset-y-0 left-0 w-64 bg-gradient-to-r from-[#fcfaf8] to-transparent pointer-events-none z-20" />
        <div className="absolute inset-y-0 right-0 w-64 bg-gradient-to-l from-[#fcfaf8] to-transparent pointer-events-none z-20" />
      </div>
    </section>
  );
}