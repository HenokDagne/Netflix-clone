import { useMovies } from "../../../../../context/usemovies";
export const Cards = () => {
  const { movies } = useMovies();
  return (
    <div className=" grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 overflow-y-auto overflow-x-auto custom-scrollbar p-2">
      {movies &&
        movies.map((movie: any, index: number) => (
          <div
            key={movie?.id ?? index}
            className="flex flex-col bg-gray-900 rounded-lg overflow-hidden h-64 flex items-end p-3 hover:ring-4 ring-lime-400 hover:scale-105 transition-shadow duration-200 ease-out transform-gpu"
            style={{
              backgroundImage: movie?.posterUrl
                ? `url(${movie.posterUrl})`
                : "none",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          ></div>
        ))}
    </div>
  );
};

export default Cards;
