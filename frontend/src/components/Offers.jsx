import { useNavigate } from "react-router-dom";

const dummyOffers = [
  { id: "1", title: "THE WEEKEND SOIRÉE", discount: "20% OFF", category: "GOURMET SELECTION", time: "SAT-SUN" },
  { id: "2", title: "SIGNATURE TARTARE", discount: "£5 CREDIT", category: "CHEF'S SPECIAL", time: "DAILY" },
];

const Offers = () => {
  const navigate = useNavigate();

  return (
    <section className="py-24 bg-white text-black overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Creative Asymmetric Header */}
        <div className="relative mb-20">
          <h2 className="text-7xl md:text-9xl font-serif font-black tracking-tighter uppercase leading-[0.8]">
            RAW <br /> <span className="text-[#FF0000]">DEALS</span>
          </h2>
          <div className="absolute top-0 right-0 text-right hidden md:block">
            <p className="text-[10px] tracking-[0.6em] font-black uppercase text-gray-400 mb-2">Authenticated Collection</p>
            <div className="h-1 w-40 bg-black ml-auto" />
          </div>
        </div>

        {/* Flat Creative Rows */}
        <div className="flex flex-col gap-6">
          {dummyOffers.map((offer) => (
            <div
              key={offer.id}
              onClick={() => navigate(`/offers/${offer.id}`)}
              className="group relative flex flex-col md:flex-row items-stretch cursor-pointer border-t-2 border-black"
            >
              {/* Left Side: The "Identity" */}
              <div className="py-8 flex-1">
                <div className="flex items-center gap-4 mb-2">
                  <span className="text-[10px] font-black bg-black text-white px-2 py-0.5">
                    {offer.time}
                  </span>
                  <span className="text-[10px] font-black tracking-widest text-gray-400 uppercase">
                    {offer.category}
                  </span>
                </div>
                <h3 className="text-3xl md:text-4xl font-serif font-black tracking-tight group-hover:text-[#FF0000] transition-colors duration-300">
                  {offer.title}
                </h3>
              </div>

              {/* Right Side: The Creative "Cut-Out" Block */}
              <div className="bg-[#FF0000] text-white p-8 md:w-72 flex flex-col justify-center items-center group-hover:bg-black transition-colors duration-500">
                <span className="text-4xl md:text-5xl font-serif font-black italic tracking-tighter">
                  {offer.discount}
                </span>
                <div className="mt-4 flex items-center gap-2">
                   <div className="h-[1px] w-8 bg-white" />
                   <span className="text-[9px] font-black tracking-[0.3em] uppercase">Get Privilege</span>
                </div>
              </div>

              {/* Decorative "Bite" marks on the corners */}
              <div className="absolute top-[-10px] left-1/2 w-5 h-5 bg-white rounded-full border-2 border-black hidden md:block" />
            </div>
          ))}
        </div>

        {/* The View All CTA */}
        <div className="mt-20 flex justify-end">
          <button 
            onClick={() => navigate("/offers")}
            className="group flex flex-col items-end"
          >
            <span className="text-sm font-black tracking-[0.5em] uppercase mb-2 group-hover:text-[#FF0000]">Explore Full Ledger</span>
            <div className="h-2 w-64 bg-black group-hover:bg-[#FF0000] transition-all" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Offers;