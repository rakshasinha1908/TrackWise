import cityImg from "../../assets/city.png"; // <-- your transparent image

// export default function PremiumBanner({ isScrolled }) {
//   return (
//     <div
//       className={`mt-4 rounded-2xl bg-gradient-to-r from-purple-100 via-blue-100 to-indigo-100 overflow-hidden transition-all duration-300 ${
//         isScrolled ? "p-3" : "p-5"
//       }`}
//     >
//       <div className="flex items-center justify-between">

//         {/* LEFT CONTENT */}
//         <div className="max-w-md">

//           <div className="text-xs text-gray-500 mb-1">
//             👑 Trackwise Elite Feature Pack
//           </div>

//           <h3 className="text-sm md:text-lg font-semibold leading-snug">
//             Explore premium <span className="font-bold">financial insights</span> to optimize your spending & saving habits.
//           </h3>
//         </div>

//         {/* RIGHT IMAGE */}
//         <div className="hidden md:block">
//           <img
//             src={cityImg}
//             alt="city"
//             className="w-40 lg:w-56 xl:w-64 object-contain"
//           />
//         </div>

//       </div>
//     </div>
//   );
// }

export default function PremiumBanner({ isScrolled }) {
  return (
    <div
      className={`mt-4 rounded-2xl bg-gradient-to-r from-purple-100 via-blue-100 to-indigo-100 overflow-hidden transition-all duration-300 ${
        isScrolled ? "py-3" : "py-5"
      }`}
    >
      <div className="flex items-center justify-between">

        {/* LEFT CONTENT (with padding) */}
        <div className="px-5 max-w-md">
          <div className="text-xs text-gray-500 mb-1">
            👑 Trackwise Elite Feature Pack
          </div>

          <h3 className="text-sm md:text-lg font-semibold leading-snug">
            Explore premium <span className="font-bold">financial insights</span> to optimize your spending & saving habits.
          </h3>
        </div>

        {/* RIGHT IMAGE (NO padding) */}
        <div className="hidden md:block">
          <img
            src={cityImg}
            alt="city"
            className="h-full w-40 lg:w-56 xl:w-64 object-contain"
          />
        </div>

      </div>
    </div>
  );
}