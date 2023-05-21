import { api_keys } from "./api_keys.js";

const API_Key_RAPID = api_keys[1].API_Key_Rapid;
const optionsRAPID = {
  method: "GET",
  headers: {
    "X-RapidAPI-Key": API_Key_RAPID,
    "X-RapidAPI-Host": "online-movie-database.p.rapidapi.com",
  },
};
const baseUrlRAPID = `https://online-movie-database.p.rapidapi.com/auto-complete?q=`;

//TODO: Is there a need to have a default searchTerm?
export async function moviesFromRAPID(searchTerm = "alone") {
  if (!searchTerm) return [];
  const url = baseUrlRAPID + searchTerm;
  try {
    const response = await fetch(url, optionsRAPID);
    const { d } = await response.json();
    const finalResults = d.map((item) => {
      const tempItem = {};
      tempItem.movieTitle = item.l;
      tempItem.moviePoster = item.i.imageUrl;
      tempItem.movieOverview = item.s;
      tempItem.movieRating = item.rank;
      tempItem.movieDate = item.y;
      return tempItem;
    });
    return finalResults;
  } catch (error) {
    //TODO: could be a good idea to add the search term to the error
    throw new Error(
      `Something went wrong while fetching popular movies (SEARCH MODE) from RAPID! \n ${error}`
    );
  }
}

//       } else {
//          const response = await fetch(baseUrlRAPID + searchTerm, optionsRAPID);
//          const { d } = await response.json();
//          tempResults = d.map((item) => {
//             const tempItem = {};
//             tempItem.movieTitle = item.l;
//             tempItem.moviePoster = item.i.imageUrl;
//             tempItem.movieOverview = item.s;
//             tempItem.movieRating = item.rank;
//             tempItem.movieDate = item.y;
//             return tempItem;
//          });
//       }
// async function searchMovies(apiInterface, url, searchTerm) {
//    let tempResults = {};
//    try {
//       if (apiInterface === "TMDB") {
//          const response = await fetch(url + searchTerm, optionsTMDB);
//          const { results } = await response.json();
//          tempResults = results.map((item) => {
//             const tempItem = {};
//             tempItem.movieTitle = item.title;
//             tempItem.moviePoster = item.poster_path
//                ? baseImgUrlTMDB + item.poster_path
//                : "./default_movie_poster.jpg";
//             tempItem.movieOverview = item.overview;
//             tempItem.movieRating = item.vote_average;
//             tempItem.movieDate = item.release_date;
//             return tempItem;
//          });
//       } else {
//          const response = await fetch(baseUrlRAPID + searchTerm, optionsRAPID);
//          const { d } = await response.json();
//          tempResults = d.map((item) => {
//             const tempItem = {};
//             tempItem.movieTitle = item.l;
//             tempItem.moviePoster = item.i.imageUrl;
//             tempItem.movieOverview = item.s;
//             tempItem.movieRating = item.rank;
//             tempItem.movieDate = item.y;
//             return tempItem;
//          });
//       }
//       return tempResults;
//    } catch (error) {
//       console.log(error.message);
//    }
// }
