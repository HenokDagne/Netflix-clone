// ...existing code...
import React from "react";
import { MoviesProvider } from "./context/usemovies";
import Home from "./Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MoviesList } from "./components/pages/list/MoviesList";
import { Login } from "./components/pages/user/Login";
// ...existing code...

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <MoviesProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/my-list" element={<MoviesList />} />
        </Routes>
      </MoviesProvider>
    </BrowserRouter>
  );
};

export default App;
// ...existing code...
