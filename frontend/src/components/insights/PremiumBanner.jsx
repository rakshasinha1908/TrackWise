import cityImg from "../../assets/city.png";

export default function PremiumBanner({ isScrolled }) {
  return (
    <div
      className={`mt-3 sm:mt-4 rounded-xl sm:rounded-2xl bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 overflow-hidden transition-all duration-300 ${
        isScrolled ? "min-h-[70px] sm:min-h-[90px]" : "min-h-[90px] sm:min-h-[120px]"
      }`}
    >
      <div className="flex items-center justify-between h-full w-full">

        {/* LEFT — text content */}
        <div
          className={`px-4 sm:px-5 transition-all duration-300 flex-1 min-w-0 ${
            isScrolled ? "py-2 sm:py-3" : "py-3 sm:py-4"
          }`}
        >
          <h3
            className={`font-semibold leading-snug transition-all duration-300 ${
              isScrolled
                ? "text-xs sm:text-sm md:text-base"
                : "text-sm sm:text-lg md:text-xl lg:text-2xl"
            }`}
          >
            Explore premium{" "}
            <span className="font-bold">financial insights</span>
            {/* Only show second line when not scrolled and on sm+ */}
            {!isScrolled && (
              <>
                <br className="hidden sm:block" />
                <span className="hidden sm:inline"> to optimize your spending & saving habits.</span>
              </>
            )}
            {/* Inline fallback on mobile when not scrolled */}
            {!isScrolled && (
              <span className="sm:hidden"> & optimize your habits.</span>
            )}
          </h3>
        </div>

        {/* RIGHT — city image, hidden on small screens */}
        <div className="hidden sm:flex items-end justify-end flex-shrink-0 self-end">
          <img
            src={cityImg}
            alt=""
            aria-hidden="true"
            className={`w-auto object-contain pointer-events-none transition-all duration-300 ${
              isScrolled
                ? "h-[70px] md:h-[85px]"
                : "h-[88px] md:h-[110px] lg:h-[118px]"
            }`}
          />
        </div>

      </div>
    </div>
  );
}