import { useContext, useState, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import { Diamond, ChevronLeft, ChevronRight } from "lucide-react";

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
  const [calendarMonth, setCalendarMonth] = useState(new Date().getMonth());
  const [calendarYear, setCalendarYear] = useState(new Date().getFullYear());

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
      if (selectedDate) {
        fetchBookedSeats(selectedDate);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDrawerOpen, user, selectedDateForBooking]);

  // Fetch booked seats when date changes
  const handleDateChange = (e) => {
    const newDate = e.target.value;
    setFormData({...formData, date: newDate});
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
      console.log("Booking error:", error);
      toast.error("An error occurred during booking.");
    }
  };

  // Calendar Helper Functions
  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay();
  };

  const handlePrevMonth = () => {
    if (calendarMonth === 0) {
      setCalendarMonth(11);
      setCalendarYear(calendarYear - 1);
    } else {
      setCalendarMonth(calendarMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (calendarMonth === 11) {
      setCalendarMonth(0);
      setCalendarYear(calendarYear + 1);
    } else {
      setCalendarMonth(calendarMonth + 1);
    }
  };

  const handleDateSelect = (day) => {
    const selectedDate = new Date(calendarYear, calendarMonth, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      toast.error("Cannot book past dates.");
      return;
    }
    
    const formattedDate = `${calendarYear}-${String(calendarMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setSelectedDateForBooking(formattedDate);
    fetchBookedSeats(formattedDate);
  };

  const isDateSelected = (day) => {
    if (!selectedDateForBooking) return false;
    const selected = new Date(selectedDateForBooking);
    return selected.getDate() === day && 
           selected.getMonth() === calendarMonth && 
           selected.getFullYear() === calendarYear;
  };

  const isDatePast = (day) => {
    const date = new Date(calendarYear, calendarMonth, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="min-h-screen bg-[#FFFFFF]  text-[#1a1a1a]">
      {/* --- PREMIUM HERO SECTION --- */}
<div
  className="relative h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-[75vh] bg-cover bg-fixed bg-center flex items-center justify-center overflow-hidden bg-[#F9F8F6]"
  style={{
    backgroundImage: "url('/tablecover.png')",
  }}
>
  {/* A 'Mist' overlay: Creates a bright, airy feeling while keeping text readable */}
  <div className="absolute inset-0 bg-[#F9F8F6]/70 backdrop-blur-[0.5px]"></div>
  
  {/* Elegant 'Soft Light' gradient for a high-end editorial look */}
  <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-[#F9F8F6]/40"></div>
  
{/* The Main "Menu Card" - Very common in high-end British branding */}
  <div className="relative z-10 max-w-6xl w-full mx-4 p-8 md:p-16 bg-white/60 backdrop-blur-xs border border-white/50 shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
    
        {/* Decorative Gold Leaf Corners (Responsive) */}
        <div className="absolute top-3 left-3 sm:top-4 sm:left-4 md:top-6 md:left-6 
                        w-8 h-8 sm:w-10 sm:h-10 md:w-14 md:h-14 
                        border-t border-l border-amber-700"></div>

        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 md:top-6 md:right-6 
                        w-8 h-8 sm:w-10 sm:h-10 md:w-14 md:h-14 
                        border-t border-r border-amber-700"></div>

      <header className=" relative max-w-[1300px] mx-auto px-4 md:px-6">
        {/* The "Signature" Style Heading Group */}
        <div className="flex flex-col items-center text-center border-b border-stone-100 ">
          <h1 className="text-2xl sm:text-5xl md:text-7xl font-light tracking-[0.05em] uppercase mb-4 md:mb-8 text-stone-900">
            Your 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-700 via-amber-500 to-amber-700">
              &nbsp;Seat Awaits
            </span>
          </h1>
        </div>

        {/* The "Signature" Style Description */}
        <div className="text-center px-0 md:px-2 mt-2 md:mt-2">
          <p className="text-stone-600 font-semibold tracking-wide font-serif italic text-base sm:text-lg md:text-2xl leading-relaxed max-w-4xl mx-auto">
            "View our table arrangement below and select your desired vantage point. Our interactive map allows you to curate your perfect dining atmosphere."
          </p>
          
          {/* Subtle Golden Dots for the interactive hint */}
          <div className="mt-8 flex justify-center gap-1.5">
            <div className="w-1 h-1 bg-amber-600 rounded-full animate-pulse"></div>
            <div className="w-1 h-1 bg-amber-500/50 rounded-full"></div>
            <div className="w-1 h-1 bg-amber-400/20 rounded-full"></div>
          </div>
        </div>
      </header>
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
            
            {/* Premium Calendar */}
            <div className="mb-10 max-w-3xl p-6 bg-gradient-to-br from-[#1a1a1a] via-[#2a2a2a] to-[#1a1a1a] border border-[#D4AF37]  relative overflow-hidden rounded-sm">
              {/* Decorative corner accents */}
              <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-[#D4AF37]/30"></div>
              <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-[#D4AF37]/30"></div>
              <div className="absolute bottom-0 left-0 w-12 h-12 border-b-2 border-l-2 border-[#D4AF37]/30"></div>
              <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-[#D4AF37]/30"></div>
              
              {/* Calendar Header */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#D4AF37]/30">
                <button 
                  onClick={handlePrevMonth}
                  className="p-1.5 hover:bg-[#D4AF37]/20 rounded-full transition-all duration-300 group"
                >
                  <ChevronLeft className="w-8 h-8 text-[#D4AF37] group-hover:scale-110 transition-transform" />
                </button>
                
                <div className="text-center">
                  <h3 className="text-2xl font-serif font-semibold italic text-[#D4AF37] mb-0.5">
                    {monthNames[calendarMonth]}
                  </h3>
                  <p className="text-xs text-white uppercase tracking-[0.25em]">{calendarYear}</p>
                </div>
                
                <button 
                  onClick={handleNextMonth}
                  className="p-1.5 hover:bg-[#D4AF37]/20 rounded-full transition-all duration-300 group"
                >
                  <ChevronRight className="w-8 h-8 text-[#D4AF37] group-hover:scale-110 transition-transform" />
                </button>
              </div>

              {/* Day Names */}
              <div className="grid grid-cols-7 gap-1.5 mb-3">
                {dayNames.map(day => (
                  <div key={day} className="text-center py-1.5">
                    <span className="text-[12px] font-bold uppercase tracking-wider text-[#D4AF37]">
                      {day}
                    </span>
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-2">
                {/* Empty cells for days before month starts */}
                {[...Array(getFirstDayOfMonth(calendarMonth, calendarYear))].map((_, i) => (
                  <div key={`empty-${i}`} className="aspect-square" />
                ))}
                
                {/* Actual days */}
                {[...Array(getDaysInMonth(calendarMonth, calendarYear))].map((_, i) => {
                  const day = i + 1;
                  const isPast = isDatePast(day);
                  const isSelected = isDateSelected(day);
                  const isToday = new Date().getDate() === day && 
                                  new Date().getMonth() === calendarMonth && 
                                  new Date().getFullYear() === calendarYear;
                  
                  return (
                    <button
                      key={day}
                      onClick={() => handleDateSelect(day)}
                      disabled={isPast}
                      className={`aspect-square rounded-sm border transition-all duration-300 flex items-center justify-center font-serif text-sm relative group overflow-hidden
                        ${isPast 
                          ? 'border-gray-700/30 bg-gray-800/10 text-gray-700 cursor-not-allowed opacity-30' 
                          : isSelected
                          ? 'border-[#D4AF37] bg-[#D4AF37] text-[#1a1a1a] font-bold shadow-[0_0_15px_rgba(212,175,55,0.4)] scale-105 z-10'
                          : 'border-white/10 bg-white/5 text-white hover:border-[#D4AF37] hover:bg-[#D4AF37]/10 hover:scale-105 cursor-pointer'
                        }`}
                    >
                      <span className={`relative z-10 ${isSelected ? 'font-black' : ''}`}>{day}</span>
                      
                      {/* Today indicator ring */}
                      {isToday && !isSelected && !isPast && (
                        <div className="absolute inset-0 border-2 border-[#D4AF37]/50 rounded-sm"></div>
                      )}
                      
                      {/* Selected indicator - Royal Crown */}
                      {isSelected && (
                        <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#1a1a1a] border border-[#D4AF37] rounded-full flex items-center justify-center">
                          <div className="w-1 h-1 bg-[#D4AF37] rounded-full animate-pulse" />
                        </div>
                      )}
                      
                      {/* Hover gradient overlay */}
                      {!isPast && !isSelected && (
                        <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/0 via-[#D4AF37]/0 to-[#D4AF37]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Calendar Footer - Compact Availability */}
              {selectedDateForBooking && (
                <div className="mt-6 pt-4 border-t border-[#D4AF37]/30">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex-1">
                      <p className="text-[14px] font-semibold uppercase tracking-wider text-[#D4AF37] mb-0.5">Selected</p>
                      <p className="text-lg font-semibold font-serif italic text-white leading-tight">
                        {new Date(selectedDateForBooking).toLocaleDateString('en-GB', { 
                          day: 'numeric', 
                          month: 'short',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                    <div className="text-right bg-[#D4AF37]/10 border border-[#D4AF37]/30 px-3 py-2 rounded">
                      {bookedSeats.length > 0 ? (
                        <div>
                          <p className="text-[12px] uppercase tracking-wider text-red-400 font-bold">⚠ {bookedSeats.length} Booked</p>
                          <p className="text-md font-semibold text-white mt-0.5">{9 * 6 - bookedSeats.length} Available</p>
                        </div>
                      ) : (
                        <div>
                          <p className="text-[12px] uppercase tracking-wider text-green-400 font-bold">✓ Available</p>
                          <p className="text-md font-semibold text-white mt-0.5">All Seats Open</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
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