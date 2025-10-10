// ...existing code...
import React from "react";
import { MoviesProvider } from "./context/usemovies";
import NavbarComponent from "./components/navbar/NavbarComponent";
import Sidebar from "./components/sidebar/Sidebar";
import Main from "./main/Main";

// Base Layout Component
const App: React.FC = () => {
  return (
    <MoviesProvider>
      <div className="h-screen w-screen bg-black text-white">
        {/* grid: left sidebar (fixed) and center column (navbar on top, main below) */}
        <div className="grid grid-rows-[auto_1fr] grid-cols-[16rem_1fr] h-full">
          {/* Left Sidebar: spans navbar row and main row */}
          <Sidebar />
          {/* Navbar: only above the center/main column */}
          <NavbarComponent />
          <Main />
        </div>
      </div>
    </MoviesProvider>
  );
};

export default App;
// ...existing code...
// ...existing code...
