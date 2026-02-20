import { MdRestaurantMenu, MdLocalBar, MdRestaurant } from "react-icons/md";

const Loading = () => {
  return (
    <div className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-[#FDF6F0]">
      
      {/* Premium Loading Container */}
      <div className="relative  flex items-center justify-center">
       
        {/* Icons Row */}
        <div className="flex items-center gap-4 animate-pulse [animation-duration:2.5s] font-serif text-black">
          
          {/* 1. Dining Menu */}
          <MdRestaurantMenu size={56} />

          {/* 2. Bar / Drinks */}
          <MdLocalBar size={56} />

          {/* 3. Restaurant / Food */}
          <MdRestaurant size={56} />
        </div>
      </div>


      <style>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(0); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default Loading;
