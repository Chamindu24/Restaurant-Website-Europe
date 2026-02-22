import { useContext, useState, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import { Diamond } from "lucide-react";

const BookTable = () => {
  const { axios, navigate, user } = useContext(AppContext);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  // State for the "Shopping Cart" of seats
  const [selectedSeats, setSelectedSeats] = useState([]); // Array of strings like ["A0", "B5"]
  const [activeTable, setActiveTable] = useState("A"); // Which table is currently being viewed
  const [bookedSeats, setBookedSeats] = useState([]); // Seats already booked for selected date

  const [formData, setFormData] = useState({
    name: "", email: "", phone: "", date: "", time: "", note: "",
  });
  
  const [selectedDateForBooking, setSelectedDateForBooking] = useState(""); // Date picker for booking view

  // Restore booking details from localStorage on mount
  useEffect(() => {
    const savedSeats = localStorage.getItem("selectedSeats");
    const savedDate = localStorage.getItem("selectedDateForBooking");
    
    if (savedSeats) {
      setSelectedSeats(JSON.parse(savedSeats));
    }
    if (savedDate) {
      setSelectedDateForBooking(savedDate);
    }
  }, []);

  // Fetch booked seats when date changes
  const fetchBookedSeats = async (date) => {
    try {
      const { data } = await axios.get("/api/booking/booked-seats", {
        params: { date }
      });
      if (data.success) {
        setBookedSeats(data.bookedSeats);
      }
    } catch (error) {
      console.log("Error fetching booked seats:", error);
    }
  };

  // Auto-fill form when drawer opens
  useEffect(() => {
    if (isDrawerOpen) {
      // Use selected date from booking, or get current date in YYYY-MM-DD format
      const selectedDate = selectedDateForBooking || new Date().toISOString().split('T')[0];
      
      // Get current time in HH:MM format
      const now = new Date();
      const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      
      // Populate user details from context
      setFormData(prev => ({
        ...prev,
        name: user?.name || prev.name || "",
        email: user?.email || prev.email || "",
        phone: user?.phone || prev.phone || "",
        date: selectedDate,
        time: currentTime,
      }));
      
      // Fetch booked seats for the selected date
      fetchBookedSeats(selectedDate);
    }
  }, [isDrawerOpen, user, selectedDateForBooking]);

  // Fetch booked seats when date changes
  const handleDateChange = (e) => {
    const newDate = e.target.value;
    setFormData({...formData, date: newDate});
    fetchBookedSeats(newDate);
  };

  // Handle date selection from the main date picker
  const handleBookingDateChange = (e) => {
    const newDate = e.target.value;
    setSelectedDateForBooking(newDate);
    fetchBookedSeats(newDate);
  };

  const tableIDs = ["A", "B", "C", "D", "E", "F"];

  const toggleSeat = (tableId, seatIndex) => {
    const seatId = `${tableId}${seatIndex}`;
    
    // Must select date first
    if (!selectedDateForBooking) {
      return toast.error("Please select a booking date first.");
    }
    
    // Prevent selecting booked seats
    if (bookedSeats.includes(seatId)) {
      return toast.error("This seat is already booked for the selected date.");
    }
    
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seatId));
    } else {
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };

  const removeSeat = (id) => {
    setSelectedSeats(selectedSeats.filter(s => s !== id));
  };

  const handleProceedClick = () => {
    if (!user) {
      // Save selected seats and date to localStorage before redirecting
      localStorage.setItem("selectedSeats", JSON.stringify(selectedSeats));
      localStorage.setItem("selectedDateForBooking", selectedDateForBooking);
      
      toast.error("Please log in to proceed with your booking.");
      navigate("/signup");
      return;
    }
    setIsDrawerOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedSeats.length === 0) return toast.error("Please select at least one seat.");
    
    try {
      const payload = { ...formData, reservedSeats: selectedSeats };
      const { data } = await axios.post("/api/booking/create", payload);
      if (data.success) {
        toast.success("Your royal table is ready.");
        // Clear saved booking details from localStorage
        localStorage.removeItem("selectedSeats");
        localStorage.removeItem("selectedDateForBooking");
        navigate("/my-bookings");
      }
    } catch (error) {
      toast.error("An error occurred during booking.");
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] border-t-6 border-[#D4AF37] text-[#1a1a1a]">
      {/* --- PREMIUM HERO SECTION --- */}
        <div
          className="relative h-[70vh] bg-cover bg-fixed bg-center flex items-center justify-center overflow-hidden"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1643066873594-4df339b2e232?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
          }}
        >
          <div className="absolute inset-0 bg-[#0a0a0a]/40 backdrop-blur-[1px]"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent  to-[#ffffff]"></div>
          
          <div className="relative text-center z-10 px-4">
            <span className="text-[#ffffff] uppercase tracking-[0.4em] text-xs mb-4 block font-medium animate-fade-in">
              Reserve Your Experience • Fine Dining
            </span>
            <h1 className="text-5xl md:text-8xl font-serif italic tracking-tight text-white mb-8">
              The <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500"  >Gourmet</span> Table
            </h1>


          </div>
        </div>
        {/* --- OVERLAPPING IMAGE SECTION --- */}
        <div className="relative max-w-6xl mx-auto px-6 -mt-32 z-10">
          <div className="bg-white  rounded-sm ">
              <img 
                src="/tabelview2.png" 
                alt="System Architecture Layout" 
                className="w-full h-full object-contain "
              />
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-4 gap-12">
          
          {/* 2. TABLE & SEAT SELECTION SECTION */}
          <div className="lg:col-span-3">
            <h2 className="text-md uppercase font-medium tracking-widest text-gray-800 mb-8 border-b pb-4">01. Select Your Booking Date</h2>
            
            {/* Date Selector */}
            <div className="mb-10 p-6 bg-gradient-to-r from-[#f2d696]/10 to-[#c4a661]/10 border border-[#c4a661]/30 rounded-lg">
              <div className="flex flex-col sm:flex-row gap-6 items-center">
                <div className="flex-1">
                  <label className="text-[12px] uppercase tracking-[0.2em] text-gray-800 block mb-3">Select Date to Check Availability</label>
                  <input 
                    type="date" 
                    value={selectedDateForBooking}
                    onChange={handleBookingDateChange}
                    className="w-full cursor-pointer border border-gray-300 rounded px-4 py-3 focus:outline-none focus:border-[#c4a661] transition-colors"
                  />
                </div>
                {selectedDateForBooking && bookedSeats.length > 0 && (
                  <div className="text-center sm:text-right">
                    <p className="text-xs text-red-600 font-semibold uppercase">⚠ {bookedSeats.length} seats booked</p>
                    <p className="text-xs text-gray-600 mt-1">{9 * 6 - bookedSeats.length} seats available</p>
                  </div>
                )}
                {selectedDateForBooking && bookedSeats.length === 0 && (
                  <div className="text-center sm:text-right">
                    <p className="text-xs text-green-600 font-semibold uppercase">✓ All seats available</p>
                  </div>
                )}
              </div>
            </div>

            <h2 className="text-md uppercase font-medium tracking-widest text-gray-800 mb-8 border-b pb-4">02. Select Your Table & Seats</h2>
            

<div className="text-center mb-8 md:mb-16">
              <p className="text-[11px] font-black uppercase tracking-[0.3em] text-[#bc9437] mb-2">Step 01</p>
              <h2 className="text-3xl md:text-4xl font-serif font-black text-[#1a1a1a] tracking-tight italic underline decoration-[#bc9437] decoration-4 underline-offset-8">
                Select Your Table 
              </h2>
            </div>
            {/* Table Navigator - The "Chronograph" Tabs */}
            <div className="flex flex-wrap justify-center gap-4 md:gap-6 mb-12 md:mb-24">
              {tableIDs.map((id) => (
                <button
                  key={id}
                  onClick={() => setActiveTable(id)}
                  className={`group cursor-pointer relative w-14 h-14 md:w-20 md:h-20 flex items-center justify-center transition-all duration-500
                    ${activeTable === id ? "scale-125" : "grayscale opacity-40 hover:opacity-100 hover:grayscale-0"}`}
                >
                  {/* Background Ring */}
                  <div className={`absolute inset-0 rounded-full border-[3px] transition-all duration-500
                    ${activeTable === id ? "border-[#bc9437] border-[4px] bg-[#1a1a1a] text-[#bc9437] rotate-180" : "border-gray-500"}`} 
                  />
                  <span className={`relative z-10 text-xl md:text-2xl font-serif font-black transition-colors duration-500
                    ${activeTable === id ? "text-[#bc9437]" : "text-[#1a1a1a]"}`}>
                    {id}
                  </span>
                  {activeTable === id && (
                    <div className="absolute -bottom-4 w-1 h-1 bg-[#bc9437] rounded-full animate-bounce" />
                  )}
                </button>
              ))}
            </div>

            <div className="text-center mb-8 md:mb-16">
              <p className="text-[11px] font-black uppercase tracking-[0.3em] text-[#bc9437] mb-2">Step 02</p>
              <h2 className="text-3xl md:text-4xl font-serif font-black text-[#1a1a1a] tracking-tight italic underline decoration-[#bc9437] decoration-4 underline-offset-8">
                Allocate Seats
              </h2>
            </div>

            {/* The Radial Floor Plan - Architectural Polish */}
            <div className="relative w-[320px] h-[320px] md:w-[600px] md:h-[600px] mx-auto flex items-center justify-center">
              
              {/* Inner Orbit Ring (Visual Guide) */}
              <div className="absolute w-[190px] h-[190px] md:w-[360px] md:h-[360px] rounded-full border-[1px] border-dashed border-[#bc9437] pointer-events-none" />

              {/* The Central Table (The Heavy Anchor) */}
              <div className="absolute w-32 h-32 md:w-72 md:h-72 rounded-full bg-[#1a1a1a] border-[4px] border-[#bc9437] shadow-[0_30px_70px_rgba(0,0,0,0.1)] flex flex-col items-center justify-center z-10">
                    <div className="text-center">
                        <p className="text-[9px] md:text-[12px] font-black uppercase tracking-[0.3em] text-[#bc9437] mb-1">Table</p>
                        <p className="font-serif font-black text-4xl md:text-7xl text-[#bc9437]">{activeTable}</p>
                    </div>
              </div>

              {/* The 9 Seats arranged in a circle */}
              {[...Array(9)].map((_, i) => {
                const seatId = `${activeTable}${i}`;
                const isSelected = selectedSeats.includes(seatId);
                const isBooked = selectedDateForBooking && bookedSeats.includes(seatId);
                
                const angle = (i * 360) / 9;
                const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
                const radius = isMobile ? 128 : 240;
                const x = Math.cos((angle * Math.PI) / 180) * radius;
                const y = Math.sin((angle * Math.PI) / 180) * radius;

                return (
                  <button
                    key={seatId}
                    disabled={isBooked}
                    onClick={() => toggleSeat(activeTable, i)}
                    style={{ transform: `translate(${x}px, ${y}px)` }}
                    className={`absolute cursor-pointer w-10 h-10 md:w-20 md:h-20 rounded-none transition-all duration-500 flex flex-col items-center justify-center border-[2px] md:border-[4px]
                      ${isBooked 
                        ? "bg-red-200 border-gray-300 opacity-60 cursor-not-allowed" 
                        : isSelected 
                        ? "bg-[#1a1a1a] border-[#bc9437] shadow-[20px_20px_40px_rgba(0,0,0,0.2)] scale-110 z-20" 
                        : "bg-white border-[#1a1a1a] hover:border-[#bc9437] hover:-translate-y-2"}`}
                  >
                    <span className={`text-sm md:text-2xl font-serif font-black italic
                        ${isSelected ? "text-white" : "text-[#1a1a1a]"}`}>
                        {i + 1}
                    </span>
                    
                    {/* Selected Accent: Geometric Diamond */}
                    {isSelected && (
                        <div className="absolute -top-2 -right-2 md:-top-3 md:-right-3 w-4 h-4 md:w-6 md:h-6 bg-[#bc9437] rotate-45 flex items-center justify-center shadow-lg border border-[#1a1a1a] md:border-2">
                            <span className="text-[8px] md:text-[10px] text-[#1a1a1a] -rotate-45 font-black">✓</span>
                        </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. BOOKING SUMMARY & CTA */}
          <div className="lg:col-span-1">
            <div className="sticky top-10 bg-white border border-gray-500 p-8 ">
              <h2 className="text- text-gray-800 font-medium uppercase tracking-widest mb-6">Reservation Summary</h2>
              
              {selectedDateForBooking && (
                <div className="mb-6 p-4 bg-[#f2d696]/10 border border-[#c4a661]/30 rounded">
                  <p className="text-xs uppercase tracking-widest text-gray-700 mb-2">Selected Date:</p>
                  <p className="text-sm font-bold text-[#1a1a1a]">{new Date(selectedDateForBooking).toLocaleDateString()}</p>
                  <p className="text-xs text-gray-600 mt-2">
                    {bookedSeats.length > 0 
                      ? `${bookedSeats.length} seats booked` 
                      : 'All seats available'}
                  </p>
                </div>
              )}
              
              <div className="space-y-3 mb-8 min-h-[100px]">
                {selectedSeats.length === 0 ? (
                  <p className="text-gray-400 italic text-sm">No seats selected yet...</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {selectedSeats.map(seat => (
                      <span key={seat} className="bg-gray-100 text-[#1a1a1a] px-3 py-1 text-xs font-bold rounded-full flex items-center">
                        {seat} 
                        <button onClick={() => removeSeat(seat)} className="ml-2 text-gray-400 hover:text-red-500">×</button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="border-t pt-6">
                <div className="flex justify-between mb-6">
                  <span className="text-gray-800 font-medium text-sm">Total Seats:</span>
                  <span className="font-bold">{selectedSeats.length}</span>
                </div>
                <button
                  disabled={selectedSeats.length === 0 || !selectedDateForBooking}
                  onClick={handleProceedClick}
                  className={`w-full py-4 px-2 cursor-pointer tracking-[0.1em] uppercase text-xs hover:scale-105 duration-500 font-bold transition-all
                    ${selectedSeats.length > 0 && selectedDateForBooking
                      ? "bg-[#1a1a1a] text-[#c4a661] hover:bg-[#c4a661] hover:text-white" 
                      : "bg-gray-100 text-gray-300 cursor-not-allowed"}`}
                  title={!selectedDateForBooking ? "Please select a date first" : ""}
                >
                  Proceed to Details
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 4. THE ROYAL DRAWER (SLIDES FROM RIGHT) */}
        {isDrawerOpen && <div className={`fixed top-0 right-0 h-screen w-full sm:w-[500px] bg-white z-100 shadow-[-25px_0_60px_rgba(0,0,0,0.2)] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] p-12 overflow-y-auto translate-x-0`}>
          
          <button onClick={() => setIsDrawerOpen(false)} className="text-gray-800 cursor-pointer hover:text-black mb-4 flex font-medium items-center gap-2 text-sm tracking-widest">
            ← BACK TO SELECTION
          </button>

          <h2 className="text-4xl font-serif font-semibold mb-2 italic">Guest Information</h2>
          <p className="text-[#ae8b39] text-xs  font-semibold tracking-[0.2em] uppercase mb-6 border-b border-gray-50 pb-4">
            Securing {selectedSeats.length} seats for your party
          </p>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-2">
              <label className="text-[12px] uppercase tracking-[0.2em] text-gray-800">Reservation Name</label>
              <input required type="text" value={formData.name} onChange={(e)=>setFormData({...formData, name: e.target.value})} className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-[#c4a661] transition-colors" placeholder="e.g. Lord Byron" />
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[12px] uppercase tracking-[0.2em] text-gray-800">Email Address</label>
                <input required type="email" value={formData.email} onChange={(e)=>setFormData({...formData, email: e.target.value})} className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-[#c4a661]" />
              </div>
              <div className="space-y-2">
                <label className="text-[12px] uppercase tracking-[0.2em] text-gray-800">Phone</label>
                <input required type="tel" value={formData.phone} onChange={(e)=>setFormData({...formData, phone: e.target.value})} className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-[#c4a661]" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[12px] uppercase tracking-[0.2em] text-gray-800">Arrival Date</label>
                <input required type="date" value={formData.date} onChange={handleDateChange} className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-[#c4a661]" />
              </div>
              <div className="space-y-2">
                <label className="text-[12px] uppercase tracking-[0.2em] text-gray-800">Time of Service</label>
                <input required type="time" value={formData.time} onChange={(e)=>setFormData({...formData, time: e.target.value})} className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-[#c4a661]" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[12px] uppercase tracking-[0.2em] text-gray-800">Special Notes</label>
              <textarea rows="3" value={formData.note} onChange={(e)=>setFormData({...formData, note: e.target.value})} className="w-full bg-[#FAFAFA] border-none p-4 focus:outline-none focus:ring-1 focus:ring-[#c4a661] text-sm" placeholder="Allergies, anniversaries, or special preferences..."></textarea>
            </div>

            <button type="submit" className="w-full bg-[#1a1a1a] text-[#c4a661] py-5 mt-4 hover:bg-[#c4a661] hover:text-white transition-all duration-500 hover:scale-105 font-bold tracking-[0.3em] uppercase text-xs shadow-xl">
              Confirm Booking
            </button>
          </form>
        </div>
        }

        {/* Backdrop */}
        {isDrawerOpen && <div className="fixed inset-0 bg-black/50 backdrop-blur-md z-40 transition-opacity" onClick={() => setIsDrawerOpen(false)} />}
    </div>
  );
};

export default BookTable;