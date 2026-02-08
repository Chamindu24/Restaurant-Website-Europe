import React, { useState } from "react";
import { MapPin, Phone, Mail, Clock, Send, Diamond, Crown, Car, ArrowUpRight } from "lucide-react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.subject && formData.message) {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
      }, 4000);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] border-t-6 border-[#D4AF37] font-serif text-[#1A1A1A]">
      {/* --- HERO SECTION --- */}
      <div
        className="relative h-[60vh] bg-cover bg-fixed bg-center"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
        }}
      >
        <div className="absolute inset-0 bg-black/25 backdrop-blur-[1.8px]"></div>
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="text-5xl md:text-7xl font-light tracking-[0.05em] uppercase mb-6">Contact the <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-700 via-amber-400 to-amber-700">Concierge</span></h1>
            <div className="flex justify-center space-x-4 mb-8">
              <div className="w-12 h-[2px] bg-gradient-to-r from-amber-700 via-amber-400 to-amber-700/80 self-center"></div>
              <Diamond className="text-amber-400/80 drop-shadow-[0_2px_10px_rgba(251,191,36,0.35)] w-7 h-7" />
              <div className="w-12 h-[2px] bg-gradient-to-r from-amber-700 via-amber-400 to-amber-700/80 self-center"></div>
            </div>
          </div>
        </div>
      </div>

      {/* --- MAIN CONTACT CARD --- */}
      <div className="max-w-[88rem] mx-auto px-6 -mt-30 relative z-10 pb-20">
        <div className="grid lg:grid-cols-5  rounded-sm overflow-hidden bg-white">
          
          {/* Section 1: Contact Info (The Royal Estate) */}
          <div className="lg:col-span-2 bg-[#1A1A1A] text-white p-10 md:p-14 flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-8">
                <div className="w-8 h-[1.5px] bg-[#C5A059]"></div>
                <span className="text-[#C5A059] uppercase tracking-[0.4em] text-xs font-bold">Contact Details</span>
              </div>
              <h2 className="text-4xl font-light mb-12 tracking-tight">Visit the Estate</h2>

              <div className="space-y-10">
                <div className="flex items-start space-x-6">
                  <MapPin className="w-5 h-5 text-[#C5A059] mt-1 shrink-0" />
                  <div>
                    <h3 className="text-[#C5A059] uppercase tracking-widest text-[10px] mb-2 font-sans font-bold">Address</h3>
                    <p className="text-gray-300 font-light leading-relaxed tracking-wide">
                      47 Berkeley Square<br />
                      Mayfair, London W1J 5AU<br />
                      United Kingdom
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-6">
                  <Phone className="w-5 h-5 text-[#C5A059] mt-1 shrink-0" />
                  <div>
                    <h3 className="text-[#C5A059] uppercase tracking-widest text-[10px] mb-2 font-sans font-bold">Private Reservations</h3>
                    <p className="text-gray-300 font-light">+44 20 7123 4567</p>
                  </div>
                </div>

                <div className="flex items-start space-x-6">
                  <Mail className="w-5 h-5 text-[#C5A059] mt-1 shrink-0" />
                  <div>
                    <h3 className="text-[#C5A059] uppercase tracking-widest text-[10px] mb-2 font-sans font-bold">Inquiries</h3>
                    <p className="text-gray-300 font-light">concierge@theestate-mayfair.co.uk</p>
                  </div>
                </div>

                <div className="flex items-start space-x-6">
                  <Clock className="w-5 h-5 text-[#C5A059] mt-1 shrink-0" />
                  <div>
                    <h3 className="text-[#C5A059] uppercase tracking-widest text-[10px] mb-2 font-sans font-bold">Service Hours</h3>
                    <p className="text-gray-300 font-light text-sm">Mon — Fri: 12:00 PM - 11:30 PM</p>
                    <p className="text-gray-300 font-light text-sm">Sat — Sun: 10:00 AM - 12:00 AM</p>
                  </div>
                </div>
              </div>
            </div>


          </div>

          {/* Section 2: Correspondence Form */}
          <div className="lg:col-span-3 bg-white p-10 md:p-14">
            <h2 className="text-3xl  mb-2 text-gray-900">Send a Message</h2>
            <p className="text-gray-800 font-sans text-sm tracking-widest uppercase mb-10">Direct Correspondence</p>

            {submitted && (
              <div className="mb-8 bg-[#FDF8EE] border border-[#C5A059]/30 text-[#8D7039] p-6 italic animate-in fade-in zoom-in duration-500">
                <p className="flex items-center"><Diamond className="w-4 h-4 mr-3" /> Your message has been formally received. Our concierge will contact you shortly.</p>
              </div>
            )}

            <form onSubmit={(e) => e.preventDefault()} className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="group">
                <label className="text-[13px] uppercase tracking-[0.2em] text-gray-800 font-sans group-focus-within:text-[#bb9246] transition-colors">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-transparent border-b border-gray-500 py-3 focus:border-[#C5A059] focus:outline-none transition-all font-light placeholder:text-gray-500"
                  placeholder="Lord / Lady Smith"
                />
              </div>

              <div className="group">
                <label className="text-[10px] uppercase tracking-[0.2em] text-gray-800 font-sans group-focus-within:text-[#bb9246] transition-colors">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-transparent border-b border-gray-500 py-3 focus:border-[#C5A059] focus:outline-none transition-all font-light placeholder:text-gray-500"
                  placeholder="address@domain.com"
                />
              </div>

              <div className="group">
                <label className="text-[10px] uppercase tracking-[0.2em] text-gray-800 font-sans group-focus-within:text-[#bb9246] transition-colors">Telephone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full bg-transparent border-b border-gray-500 py-3 focus:border-[#C5A059] focus:outline-none transition-all font-light placeholder:text-gray-500"
                  placeholder="+44"
                />
              </div>

              <div className="group">
                <label className="text-[10px] uppercase tracking-[0.2em] text-gray-800 font-sans group-focus-within:text-[#bb9246] transition-colors">Nature of Inquiry</label>
                <select 
                  name="subject"
                  onChange={handleChange}
                  className="w-full bg-transparent border-b border-gray-500 py-3 focus:border-[#C5A059] focus:outline-none transition-all font-light text-gray-500"
                >
                  <option value="">Select Option</option>
                  <option value="Reservation">Table Reservation</option>
                  <option value="Private Event">Private Dining</option>
                  <option value="Feedback">Press & Media</option>
                </select>
              </div>

              <div className="md:col-span-2 group mt-4">
                <label className="text-[10px] uppercase tracking-[0.2em] text-gray-800 font-sans group-focus-within:text-[#bb9246] transition-colors">Your Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="4"
                  className="w-full bg-transparent border-b border-gray-500 py-3 focus:border-[#C5A059] focus:outline-none transition-all font-light resize-none placeholder:text-gray-500"
                  placeholder="How may we assist you today?"
                ></textarea>
              </div>

              <button
                onClick={handleSubmit}
                className="md:col-span-2 relative mt-6 w-full py-5 bg-[#1A1A1A] hover:bg-[#C5A059] text-[#C5A059] uppercase tracking-[0.3em] text-xs font-bold hover:text-white transition-all duration-500 group overflow-hidden shadow-xl"
              >
                <div className="relative flex items-center justify-center space-x-3">
                  
                  <span>Connect with Us</span>
                  <Send className="w-4 h-4" />
                </div>
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* --- FULL WIDTH MAP SECTION --- */}
      <section className="bg-[#FDF6F0] pt-24 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6 mb-16 text-center">
          <h2 className="md:text-5xl text-4xl font-light tracking-[0.2em] uppercase text-gray-950 mb-6">The Heart of Mayfair</h2>
          <div className="w-20 h-[1px] bg-[#8b6928] mx-auto mb-8"></div>
          <p className="text-gray-700 text-lg  max-w-3xl mx-auto font-normal leading-relaxed">
            Our establishment is located on the historic Berkeley Square, a beacon of London elegance since the 18th century.
          </p>
        </div>

        <div className="relative h-[550px] w-full group">
          {/* Grayscale Styled Map */}
            <div className="relative h-[600px] w-full group overflow-hidden border-y border-[#C5A059]/20">
              {/* 1. The Map with Advanced Filters */}
              <iframe
                title="The Estate Mayfair Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2483.1541370216447!2d-0.14757132338044738!3d51.510357271814675!2m3!1f0!2f0!3f0!3m2!1i1024!2i2h768!4f13.1!3m3!1m2!1s0x487605296062f873%3A0x673f84f09d6f6e!2sBerkeley%20Square!5e0!3m2!1sen!2suk!4v1700000000000!5m2!1sen!2suk"
                className="w-full h-full border-0 grayscale invert-[0.9] contrast-[1.2] brightness-[0.8] sepia-[0.2]"
                allowFullScreen=""
                loading="lazy"
              ></iframe>

              {/* 2. The "Royal Glass" Overlay - Creates a vignette effect */}
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-[#1A1A1A]/30 via-transparent to-[#1A1A1A]/40 shadow-[inset_0_0_150px_rgba(0,0,0,0.5)]"></div>

            </div>
          
          {/* Arrival Information Overlay */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 md:translate-x-0 md:left-20 md:top-20 md:translate-y-0 bg-[#1A1A1A] text-white p-10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-[#C5A059]/20 max-w-sm">
            <h4 className="text-[#C5A059] tracking-[0.3em] uppercase text-xs mb-6 flex items-center">
              <Car className="w-4 h-4 mr-3" /> Arrival by Chauffeur
            </h4>
            <div className="space-y-6 text-sm font-light">
              <div>
                <span className="text-gray-200 block text-[10px] uppercase tracking-widest mb-1">Valet Service</span>
                <p>Complimentary valet parking is available daily from 6:00 PM at the main entrance.</p>
              </div>
              <div>
                <span className="text-gray-200 block text-[10px] uppercase tracking-widest mb-1">Public Transit</span>
                <p>Green Park Station (Jubilee, Victoria, and Piccadilly Lines) is a 4-minute walk.</p>
              </div>
            </div>
            <a 
              href="https://maps.google.com" 
              target="_blank" 
              rel="noreferrer"
              className="mt-10 inline-block w-full text-center border border-[#C5A059] text-[#C5A059] py-3 text-[10px] uppercase tracking-[0.3em] hover:bg-[#C5A059] hover:text-white transition-all duration-300"
            >
              Get Directions
            </a>
          </div>
        </div>
      </section>


    </div>
  );
};

export default Contact;