

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