// ...existing code...
// ...existing code...

// ...existing code...
import React from "react";
import { MoviesProvider } from "./context/usemovies";
import { FilteredMoviesProvider } from "./context/useFilteredMovies";
import Home from "./Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MoviesList } from "./components/pages/list/MoviesList";
import { Login } from "./components/pages/user/Login";
import DetailsPage from "./components/pages/details/DetailsPage";
//import "./api/fetch"; // add this near top so the module executes in dev
// ...existing code...

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <MoviesProvider>
        <FilteredMoviesProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/my-list" element={<MoviesList />} />
            <Route path="/movies/:id" element={<DetailsPage />} />
          </Routes>
        </FilteredMoviesProvider>
      </MoviesProvider>
    </BrowserRouter>
  );
};

export default App;
// ...existing code...
