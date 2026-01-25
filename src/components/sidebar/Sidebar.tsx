import {
  Home,
  Tv,
  Film,
  Flame,
  AppWindow,
  Download,
  Gamepad2,
} from "lucide-react";

import telegramLogo from "../../assets/telegram.jpg";
import instagramLogo from "../../assets/instagram.jpg";
import tiktokLogo from "../../assets/tiktok.png";
import twitterLogo from "../../assets/twitter.png";

type SidebarProps = {
  isOpen?: boolean;
};

function Sidebar({ isOpen = true }: SidebarProps) {
  return (
    <>
      {/* Left Sidebar: spans navbar row and main row */}
      <aside
        className={`row-start-2 col-start-1 bg-gray-900 border-r border-gray-800 p-6 overflow-y-auto h-full min-h-0 ${
          isOpen ? "block" : "hidden"
        }`}
        style={{ backgroundColor: "#080a0b" }}
      >
        <nav className="space-y-3 text-sm text-gray-300">
          <div></div>
          <div className="py-2">
            <div className="relative">
              <select
                className="w-full bg-black text-gray-200 p-2 pl-3 pr-8 rounded text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-red-600"
                defaultValue="English"
                onChange={(e) => {
                  console.log("Selected language:", e.currentTarget.value);
                }}
                aria-label="Select language"
              >
                <option value="English">English</option>
                <option value="French">French</option>
                <option value="Arabic">Arabic</option>
                <option value="Italian">Italian</option>
              </select>

              <svg
                className="absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 pointer-events-none"
                viewBox="0 0 20 20"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M6 8l4 4 4-4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          {[
            { icon: Home, label: "Home" },
            { icon: Tv, label: "TV Shows" },
            { icon: Film, label: "Movies" },
            { icon: Flame, label: "Most Watched" },
            { icon: AppWindow, label: "MovieBox App" },
            { icon: Download, label: "FM Download" },
            { icon: Gamepad2, label: "Games" },
          ].map(({ icon: Icon, label }) => (
            <button
              key={label}
              type="button"
              className="group flex w-full items-center gap-3 py-2 rounded-md transition-colors hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 text-left"
            >
              <Icon className="h-5 w-5 transition-colors group-hover:text-green-400 group-focus-visible:text-green-400" />
              <span className="transition-colors group-hover:text-green-400 group-focus-visible:text-green-400 font-bold">
                {label}
              </span>
            </button>
          ))}
          <div className="flex flex-wrap gap-4 mt-8">
            {[
              { src: tiktokLogo, alt: "Tiktok" },
              { src: instagramLogo, alt: "Instagram" },
              { src: telegramLogo, alt: "Telegram" },
              { src: twitterLogo, alt: "Twitter" },
            ].map(({ src, alt }) => (
              <button
                key={alt}
                type="button"
                className="group h-10 w-10 rounded-md bg-transparent flex items-center justify-center transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
                aria-label={alt}
              >
                <img
                  src={src}
                  alt={alt}
                  className="h-8 w-8 rounded object-cover transition-opacity group-hover:opacity-90"
                />
              </button>
            ))}
          </div>
        </nav>
      </aside>

      {/* Navbar: only above the center/main column */}
    </>
  );
}

export default Sidebar;
