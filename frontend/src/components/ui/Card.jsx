export default function Card({ children }) {
  return (
    <div className="bg-white rounded-2xl p-5 md:p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
      {children}
    </div>
  );
}