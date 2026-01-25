import React from "react";
import HeroSection from "./HeroSection";
import MetaTabs from "./MetaTabs";
import ChipBar from "./ChipBar";
import CastGrid from "./CastGrid";
import type { Movie } from "../../../api/retrieve";

type BoxProps = {
  movie?: Movie;
  loading?: boolean;
  error?: string | null;
};

const Box: React.FC<BoxProps> = ({ movie, loading, error }) => {
  if (loading) {
    return <section className="p-6 text-gray-300">Loading…</section>;
  }
  if (error) {
    return <section className="p-6 text-red-400">{error}</section>;
  }
  if (!movie) {
    return <section className="p-6 text-gray-300">No movie found.</section>;
  }

  return (
    <section className="w-full bg-[#0c0f12] text-white rounded-xl overflow-hidden shadow-lg">
      <HeroSection movie={movie} />
      <MetaTabs />
      <ChipBar />
      <CastGrid />
    </section>
  );
};

export default Box;
