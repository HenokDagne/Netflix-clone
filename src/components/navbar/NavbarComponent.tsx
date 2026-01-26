// ...existing code...
import React, { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import netflixLogo from "../../assets/netflix.png";
import { auth } from "../../config/firbase";
import logoutHandler from "../../api/Authentication/logoutHandler";

type NavbarProps = {
  onToggleSidebar?: () => void;
};

function NavbarComponent({ onToggleSidebar }: NavbarProps) {
  const [open, setOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQ = searchParams.get("q") ?? "";
  const [search, setSearch] = useState(initialQ);
  const [isAuthed, setIsAuthed] = useState(false);
  const navigate = useNavigate();

  // update local state when URL param changes (back/forward or external change)
  useEffect(() => {
    const q = searchParams.get("q") ?? "";
    if (q !== search) setSearch(q);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // Track auth state to swap Login/Logout
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setIsAuthed(!!user);
    });
    return () => unsub();
  }, []);

  // debounce updating the URL query param so typing doesn't spam history
  useEffect(() => {
    const t = setTimeout(() => {
      const trimmed = (search ?? "").trim();
      if (trimmed) {
        setSearchParams({ q: trimmed });
      } else {
        // remove q param
        setSearchParams({});
      }
    }, 300);

    return () => clearTimeout(t);
  }, [search, setSearchParams]);

  const onChangeSearch = (value: string) => {
    setSearch(value);
  };

  const onToggleNav = () => {
    if (onToggleSidebar) onToggleSidebar();
  };

  return (
    <nav
      className="border-b border-gray-800 px-4 md:px-6 py-3 bg-[#080a0b] text-white"
      aria-label="Top navigation"
    >
      <div
        className="max-w-screen-2xl mx-auto flex items-center justify-between"
        data-nav-wrapper
      >
        {/* left: logo + collapse */}
        <div className="flex items-center justify-between gap-4 mb-0 text-2xl font-semibold">
          <button
            type="button"
            className="flex items-center gap-2 py-2 text-base"
            onClick={onToggleNav}
            aria-label="Toggle sidebar links"
          >
            <span className="h-5 w-5 inline-block">☰</span>
          </button>

          <div className="flex items-center gap-3">
            <img src={netflixLogo} alt="Logo" className="h-8 md:h-12" />
            <span className="text-base md:text-lg font-bold">Netflix</span>
          </div>
        </div>

        {/* center: links (desktop) */}
        <div className="hidden md:flex items-center space-x-6" data-nav-section>
          <Link to="/" className="text-gray-300 hover:text-white">
            Home
          </Link>
          <Link to="/tv-shows" className="text-gray-300 hover:text-white">
            TV Shows
          </Link>
          {isAuthed ? (
            <button
              onClick={async () => {
                await logoutHandler();
                navigate("/", { replace: true });
              }}
              className="text-gray-300 hover:text-white"
            >
              Logout
            </button>
          ) : (
            <Link to="/login" className="text-gray-300 hover:text-white">
              Login
            </Link>
          )}
          <Link to="/my-list" className="text-gray-300 hover:text-white">
            My List
          </Link>
        </div>

        {/* right: search (desktop) + profile */}
        <div className="hidden md:flex items-center space-x-4" data-nav-section>
          <div className="relative">
            <svg
              className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
              stroke="currentColor"
            >
              <path
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            <input
              type="text"
              placeholder="Search"
              aria-label="Search movies"
              value={search}
              onChange={(e) => onChangeSearch(e.target.value)}
              className="bg-gray-900 text-white pl-10 pr-10 py-2 rounded-full w-64 md:w-80 lg:w-[420px] focus:outline-none focus:ring-2 focus:ring-red-600"
            />
          </div>

          <img
            src="/profile.png"
            alt="Profile"
            className="h-8 w-8 rounded-full border-2 border-gray-700"
          />
        </div>

        {/* mobile controls: hamburger / profile */}
        <div className="flex items-center md:hidden space-x-3">
          <img
            src="/profile.png"
            alt="Profile"
            className="h-8 w-8 rounded-full border-2 border-gray-700"
          />
          <button
            type="button"
            className="p-2 rounded-md text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-red-600"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? (
              <svg
                className="w-6 h-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="w-6 h-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* mobile menu (collapsible) */}
      <div
        id="mobile-menu"
        className={`md:hidden mt-3 transition-max-h duration-200 ease-in-out overflow-hidden ${
          open ? "max-h-96" : "max-h-0"
        }`}
      >
        <div className="px-4 pb-4 space-y-3">
          <div className="flex flex-col space-y-2">
            <Link to="/" className="text-gray-300 hover:text-white">
              Home
            </Link>
            <Link to="/tv-shows" className="text-gray-300 hover:text-white">
              TV Shows
            </Link>
            <Link to="/animes" className="text-gray-300 hover:text-white">
              Animes
            </Link>
            <Link to="/my-list" className="text-gray-300 hover:text-white">
              My List
            </Link>
          </div>

          <div className="pt-2">
            <div className="relative">
              <svg
                className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
                stroke="currentColor"
              >
                <path
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <input
                type="text"
                placeholder="Search"
                aria-label="Search movies"
                value={search}
                onChange={(e) => onChangeSearch(e.target.value)}
                className="bg-gray-900 text-white pl-10 pr-10 py-2 rounded-full w-full focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default NavbarComponent;
// ...existing code...
