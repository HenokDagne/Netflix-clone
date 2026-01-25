import React, { useRef } from "react";

const castMembers = [
  {
    name: "Daniel Ings",
    role: "Ser Lyonel 'The Laughing Storm' Baratheon",
    image: "https://randomuser.me/api/portraits/men/11.jpg",
  },
  {
    name: "Shaun Thomas",
    role: "Ser Raymun 'The Reluctant' Fossoway",
    image: "https://randomuser.me/api/portraits/men/12.jpg",
  },
  {
    name: "Henry Ashton",
    role: "Prince Daeron 'the Drunken' Targaryen",
    image: "https://randomuser.me/api/portraits/men/13.jpg",
  },
  {
    name: "Edward Ashley",
    role: "Ser Steffon Fossoway",
    image: "https://randomuser.me/api/portraits/men/14.jpg",
  },
  {
    name: "Sophie Rundle",
    role: "Lady Ellyn Peake",
    image: "https://randomuser.me/api/portraits/women/25.jpg",
  },
  {
    name: "Ewan Mitchell",
    role: "Prince Aemond Targaryen",
    image: "https://randomuser.me/api/portraits/men/21.jpg",
  },
  {
    name: "Emma D'Arcy",
    role: "Queen Rhaenyra Targaryen",
    image: "https://randomuser.me/api/portraits/women/18.jpg",
  },
  {
    name: "Matt Smith",
    role: "Prince Daemon Targaryen",
    image: "https://randomuser.me/api/portraits/men/17.jpg",
  },
  {
    name: "Olivia Cooke",
    role: "Dowager Queen Alicent Hightower",
    image: "https://randomuser.me/api/portraits/women/31.jpg",
  },
  {
    name: "Rhys Ifans",
    role: "Ser Otto Hightower",
    image: "https://randomuser.me/api/portraits/men/30.jpg",
  },
  {
    name: "Eve Best",
    role: "Princess Rhaenys Targaryen",
    image: "https://randomuser.me/api/portraits/women/32.jpg",
  },
  {
    name: "Fabien Frankel",
    role: "Ser Criston Cole",
    image: "https://randomuser.me/api/portraits/men/35.jpg",
  },
];

const CastGrid: React.FC = () => {
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  const handleScroll = (direction: "left" | "right") => {
    const node = scrollerRef.current;
    if (!node) return;
    const cardWidthWithGap = 186; // width + gap
    const offset = cardWidthWithGap * 3;
    node.scrollBy({
      left: direction === "left" ? -offset : offset,
      behavior: "smooth",
    });
  };

  return (
    <section className="relative px-6 py-6 bg-[#0c0f12]">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white">
          Top Cast ({castMembers.length})
        </h2>
        <div className="flex gap-2">
          <button
            type="button"
            className="h-9 w-9 rounded-full bg-gray-800 text-white/80 hover:text-white hover:bg-gray-700 transition-colors"
            onClick={() => handleScroll("left")}
            aria-label="Scroll left"
          >
            &lt;
          </button>
          <button
            type="button"
            className="h-9 w-9 rounded-full bg-gray-800 text-white/80 hover:text-white hover:bg-gray-700 transition-colors"
            onClick={() => handleScroll("right")}
            aria-label="Scroll right"
          >
            &gt;
          </button>
        </div>
      </div>

      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-[#0c0f12] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-[#0c0f12] to-transparent" />

        <div className="overflow-hidden">
          <div
            ref={scrollerRef}
            className="flex gap-4 w-full max-w-full overflow-x-auto overflow-y-hidden pb-2 pr-1 snap-x snap-mandatory scroll-smooth overscroll-x-contain"
          >
            <style>{`div::-webkit-scrollbar { display: none; }`}</style>
            {castMembers.map((member) => (
              <article
                key={member.name}
                className="snap-start flex-shrink-0 rounded-xl bg-transparent  hover:-translate-y-1 transition-transform duration-200"
                style={{
                  minWidth: "calc((100% - 4rem) / 8)",
                  maxWidth: "150px",
                }}
              >
                <div className="h-[260px] w-full overflow-hidden rounded-t-xl bg-transparent">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="px-3 py-3 space-y-1">
                  <p className="text-sm font-semibold text-white line-clamp-1">
                    {member.name}
                  </p>
                  <p className="text-xs text-gray-400 leading-snug line-clamp-2">
                    {member.role}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CastGrid;
