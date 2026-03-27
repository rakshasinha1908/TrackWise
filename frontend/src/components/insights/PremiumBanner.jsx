import cityImg from "../../assets/city.png"; // <-- your transparent image

export default function PremiumBanner({ isScrolled }) {
  return (
    <div
      className={`mt-4 rounded-2xl bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 overflow-hidden transition-all duration-300 ${
        isScrolled ? "min-h-[90px] pt-3" : "min-h-[120px] pt-4"
    }`}
    >
      <div className="flex items-center justify-between h-full">

        {/* LEFT */}
        <div className="px-5 pb-3 md:pb-4 max-w-lg lg:max-w-xl">

          <h3 className="text-sm md:text-2xl font-semibold leading-snug">
            Explore premium <span className="font-bold">financial insights</span> 
            <br></br>to optimize your spending & saving habits.
          </h3>
        </div>

        {/* RIGHT IMAGE */}
        <div className="hidden md:flex flex-1 items-end justify-end relative">
  <img
    src={cityImg}
    alt="city"
    className="
      h-[95%] lg:h-[105%]
      w-auto
      object-contain
      pointer-events-none
    "
  />
</div>

      </div>
    </div>
  );
}