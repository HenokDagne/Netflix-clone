
export async function getMovieCard() {
const url= '';
const Api_key = '';

    try {
        const response = await fetch(`${url}/movie/popular?api_key=${Api_key}`
            
        );
        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error("Error fetching movie data:", error);
    }
}

export async function searchMovies(params: string){
 
   
    const url = 'https://api.themoviedb.org/3';
    const Api_key = '7c0538daf5504b7f5645733f2d7a48ac';


    try {
        const response = await fetch(`${url}/search/movie?api_key=${Api_key}&query=${encodeURIComponent(params)}`);
        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error("Error searching movies:", error);
    }
}

export default getMovieCard;