

/**
 * Home component that displays a featured movie background image.
 *
 * This component renders a responsive div that serves as a visual
 * representation of a featured movie. The background image is fetched
 * from a specified URL and is displayed with a scaling effect on hover.
 * The component is styled to be centered and responsive, adapting its
 * height based on the screen size.
 *
 * @returns {JSX.Element} The rendered Home component.
 */
function Home() {
  const bgUrl =
    "https://image.tmdb.org/t/p/original/iADOJ8Zymht2JPMoy3R7xceZprc.jpg";

  return (
    <div className="flex justify-center " style={{backgroundColor: "#080a0b"}}>
      <div className="w-full max-w-[1200px]  sm:px-6 ">
        <div
          className="w-full rounded-md overflow-hidden bg-cover bg-center bg-no-repeat
                     h-40 sm:h-56 md:h-72 lg:h-80 transition-transform duration-300 ease-out
                     transform-gpu hover:scale-105 shadow-md"
          style={{
            // only set backgroundImage when URL is available
            backgroundImage: bgUrl ? `url("${bgUrl}")` : undefined,
            backgroundColor: bgUrl ? undefined : "#fff",
          }}
          role="img"
          aria-label="Featured movie"
        />
      </div>
    </div>
  );
}

export default Home;