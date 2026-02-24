import React from 'react';
import { Link } from 'react-router-dom';

export default function AboutSection() {
  const foodImages = Array.from({ length: 7 }, (_, i) => `/food/food${i + 1}.jpg`);
  const sittingImages = ['/food/sitting1.jpg', '/food/sitting2.jpg'];

  return (
<section className="bg-[#FCFAF8] py-24 z-50 px-6 md:px-12 lg:px-24 relative overflow-hidden">
      {/* Background Decorative Texture */}
      <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none"></div>

      <div className="max-w-[1400px] mx-auto relative z-10">
        
        {/* TOP: THE HERO SPLIT */}
        <div className="flex flex-col lg:flex-row gap-16 mb-32 items-center">
          <div className="w-full lg:w-1/2 relative">
            {/* Corner Accent in Royal Gold */}
            <div className="absolute -top-6 -left-6 w-40 h-40 border-t-2 border-l-2 border-[#D4AF37]/40"></div>
            
            <img 
              src={sittingImages[0]} 
              alt="Grand Interior" 
              className="w-full h-[450px] sm:h-[500px] md:h-[600px] lg:h-[700px] object-cover rounded-tr-[100px] shadow-2xl" 
            />
            
            {/* Signature Floating Image with Crimson Border */}
            <div className="absolute bottom-10 -right-10 w-64 h-80 hidden xl:block shadow-2xl border-8 border-[#FCFAF8] ring-1 ring-[#D4AF37]/20">
              <img src={foodImages[6]} alt="Signature Start" className="w-full h-full object-cover" />
            </div>
          </div>
          
          <div className="w-full lg:w-1/2 lg:pl-12">
            <h1 className="text-7xl font-serif font-medium text-[#1A1A1A] mb-8 leading-[1.1]">
              Blackpepper <br />
              <span className="italic font-light text-[#D4AF37]">London</span>
            </h1>
            
            {/* The Royal Crimson Divider */}
            <div className="h-[2px] w-40 bg-[#3D0C0C] mb-12 relative">
                <div className="absolute top-0 left-0 h-full w-1/3 bg-[#D4AF37]"></div>
            </div>

            <p className="text-xl text-[#3D0C0C]/80 leading-relaxed mb-8 max-w-lg font-medium">
              At Blackpepper, every detail is crafted with care. From the first welcome 
              to the final course, we create an atmosphere where refined dining blends 
              seamlessly with the rich, expressive flavors of European inspiration.
            </p>
            <p className="font-serif font-medium italic text-2xl text-[#1A1A1A]">
              "True hospitality is felt long after the last bite."
            </p>
          </div>
        </div>

        {/* MIDDLE: THE FILM STRIP */}
        <div className="mb-32">
          <div className="flex justify-between items-end mb-12 border-b border-[#D4AF37]/20 pb-6">
            <div>
              <h3 className="text-xs uppercase font-black tracking-[0.4em] text-[#D4AF37]">From Our Kitchen</h3>
              <h2 className="text-4xl font-serif mt-2 text-[#1A1A1A]">Inspired by the Season</h2>
            </div>
            <p className="text-sm font-sans text-[#3D0C0C]/50 hidden md:block italic tracking-widest uppercase">Scroll to explore flavors →</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {foodImages.slice(0, 6).map((img, idx) => (
              <div key={idx} className={`overflow-hidden group relative ${idx % 2 !== 0 ? 'mt-8' : ''}`}>
                {/* Thin gold frame on hover */}
                <div className="absolute inset-0 border-0 group-hover:border-[12px] border-[#D4AF37]/10 transition-all duration-700 z-10 pointer-events-none"></div>
                <img 
                  src={img} 
                  className="w-full h-72 object-cover transition-all duration-1000 ease-in-out cursor-pointer group-hover:scale-110 grayscale-[20%] group-hover:grayscale-0" 
                  alt={`Dish ${idx + 1}`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* BOTTOM: THE PRIVATE SUITE */}
        <div className="relative h-[600px] w-full flex items-center justify-center overflow-hidden rounded-sm">
          <img 
            src={sittingImages[1]} 
            alt="Private Dining" 
            className="absolute inset-0 w-full h-full object-cover brightness-[0.7]"
          />
          {/* Subtle gradient overlay for extra depth */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#3D0C0C]/40 to-black/60"></div>

          <div className="relative z-10 text-center text-white px-6">
            <div className="flex justify-center mb-6">
                <div className="h-[1px] w-12 bg-[#D4AF37] self-center"></div>
                <span className="mx-4 text-[#D4AF37] uppercase tracking-[0.5em] text-xs font-black">Reservations</span>
                <div className="h-[1px] w-12 bg-[#D4AF37] self-center"></div>
            </div>

            <h2 className="text-5xl md:text-7xl font-serif italic mb-6 text-[#F9F4E8]">Your Table Awaits</h2>
            <p className="max-w-2xl mx-auto text-lg font-semibold mb-12 text-[#f0e3ce] leading-relaxed">
              Reservations are recommended for our evening service. Join us for a journey 
              through the finest ingredients London has to offer.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                to="/book-table"
                className="px-12 py-5 bg-gradient-to-tr from-[#B8860B] via-[#F7E27E] to-[#D4AF37] text-black text-xs font-black uppercase tracking-[0.3em] hover:scale-105 transition-all duration-500 shadow-xl"
              >
                Book a Table
              </Link>

              <Link
                to="/contact"
                className="px-12 py-5 bg-transparent border border-[#D4AF37]/50 text-[#D4AF37] text-xs font-black uppercase tracking-[0.3em] hover:bg-[#D4AF37] hover:text-black transition-all duration-500"
              >
                Private Events
              </Link>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}