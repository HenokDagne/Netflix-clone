// ...existing code...

export function NavFilter() {
  return (
    <div className="w-full bg-black">
      {/* Small screens: horizontal scroll; Tablet+ : wrap with gaps */}
      {/* add `custom-scrollbar` class and a small <style> to color the scrollbar on mobile */}
      <style>{`
        /* apply only on small screens (mobile) - matches Tailwind's md breakpoint (min-width:768px) */
        @media (max-width: 767px) {
          .custom-scrollbar {
            scrollbar-color: #111 #000; /* Firefox: thumb then track */
          }
          .custom-scrollbar::-webkit-scrollbar {
            height: 8px;
            background: #000; /* track */
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #111; /* thumb */
            border-radius: 9999px;
            border: 2px solid transparent;
            background-clip: padding-box;
          }
        }
      `}</style>

      <div
        className="flex items-center justify-start gap-4 w-full p-2
                   overflow-x-auto whitespace-nowrap md:overflow-visible md:whitespace-normal md:flex-wrap custom-scrollbar"
      >
        {Array.from({ length: 16 }).map((_, i) => (
          <button
            key={i}
            type="button"
            className="flex-shrink-0 bg-transparent border-2 border-green-500 text-white rounded-full
                       focus:outline-none focus:ring-4 focus:ring-lime-400 font-medium
                       text-xs px-3 py-1 mr-0 md:px-4 md:py-1 md:text-sm
                       hover:bg-lime-400 hover:text-black transition-colors"
            aria-label={`Filter ${i + 1}`}
          >
            Gener {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
// ...existing code...
export default NavFilter;