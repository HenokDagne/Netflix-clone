// ...existing code...
// ...existing code...

// ...existing code...
import React from "react";
import { MoviesProvider } from "./context/usemovies";
import { FilteredMoviesProvider } from "./context/useFilteredMovies";
import { ThemeProvider } from "./context/useTheme";
import Home from "./Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MoviesList } from "./components/pages/list/MoviesList";
import { Login } from "./components/pages/auth/Login";
import Signup from "./components/pages/auth/Signup";
import PhoneSigin from "./components/pages/auth/PhoneSigin";
import DetailsPage from "./components/pages/details/DetailsPage";
import NoteFoundPage from "./main/NoteFoundPage";
import ProtectedRoute from "./components/ProtectedRoute";
//import "./api/fetch"; // add this near top so the module executes in dev
// ...existing code...

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <MoviesProvider>
          <FilteredMoviesProvider>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/phoneOtp" element={<PhoneSigin />} />
              <Route
                path="/my-list"
                element={
                  <ProtectedRoute>
                    <MoviesList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/movies/:id"
                element={
                  <ProtectedRoute>
                    <DetailsPage />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<NoteFoundPage />} />
            </Routes>
          </FilteredMoviesProvider>
        </MoviesProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;
// ...existing code...
