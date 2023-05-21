import { api_keys } from "./api_keys.js";
import { renderModalForm } from "./modal_form.js";

const API_Key_TMDB = "api_key=" + api_keys[0].API_Key_TMDB;

const baseUrlTMDB = `https://api.themoviedb.org/3/`;
const discoverTMDB = `discover/movie?`;
const discoverUrlTMDB = baseUrlTMDB + discoverTMDB + API_Key_TMDB;

const baseImgUrlTMDB = "https://image.tmdb.org/t/p/w500";
const searchUrlTMDB = `${baseUrlTMDB}search/movie?${API_Key_TMDB}&query=`;

export async function moviesFromTMDB(searchTerm = "alone") {
  const url =
    searchTerm === "discover_mode"
      ? discoverUrlTMDB
      : searchUrlTMDB + searchTerm;

  try {
    const response = await fetch(url);
    const { results } = await response.json();
    const finalResults = results.map((item) => {
      const tempItem = {};
      tempItem.movieTitle = item.title;
      tempItem.moviePoster = item.poster_path
        ? baseImgUrlTMDB + item.poster_path
        : "./images/default_movie_poster.jpg";
      tempItem.movieOverview = item.overview;
      tempItem.movieRating = item.vote_average;
      tempItem.movieDate = item.release_date;
      return tempItem;
    });
    return finalResults;
  } catch (error) {
    //TODO: what is the purpose of the url slicing? Is it otherwise too long?
    const msg = `Something went wrong while fetching popular movies from ${url.slice(
      0,
      35
    )}... The server may be busy or there would be a connection problem. Please check your Internet connection and try again.`;
    renderModalForm(createErrorObject(msg));
    throw new Error(
      `Something went wrong while fetching popular movies from TMDB! Please check your Internet connection. ${error}`
    );
  }
}

function createErrorObject(errorMessage) {
  return {
    form: {
      border: "10px solid orange",
      borderRadius: "100px",
      padding: "50px",
    },
    header: "!!! ERROR !!!",
    image: {
      display: "none",
      source: "",
    },
    title: "Empty Movie List",
    year: "",
    rating: "",
    genre: "",
    director: "",
    overviewHeader: "",
    overview: `${errorMessage}`,
  };
}

// export async function discoverMoviesTMDB() {
//    try {
//       const response = await fetch(discoverUrlTMDB);
//       const { results } = await response.json();
//       // console.log("results discoverMoviesTMDB: ", results);
//       const finalResults = results.map((item) => {
//          const tempItem = {};
//          tempItem.movieTitle = item.title;
//          tempItem.moviePoster = item.poster_path
//             ? baseImgUrlTMDB + item.poster_path
//             : "./images/default_movie_poster.jpg";
//          tempItem.movieOverview = item.overview;
//          tempItem.movieRating = item.vote_average;
//          tempItem.movieDate = item.release_date;
//          return tempItem;
//       });
//       return finalResults;
//    } catch (error) {
//       return "Something went wrong while fetching popular movies (DISCOVER MODE) from TMDB!";
//    }
// }

// export async function searchMoviesTMDB(searchTerm = "alone") {
//    try {
//       const response = await fetch(searchUrlTMDB + searchTerm);
//       const { results } = await response.json();
//       // console.log("results searchMoviesTMDB: ", results);
//       const finalResults = results.map((item) => {
//          const tempItem = {};
//          tempItem.movieTitle = item.title;
//          tempItem.moviePoster = item.poster_path
//             ? baseImgUrlTMDB + item.poster_path
//             : "./images/default_movie_poster.jpg";
//          tempItem.movieOverview = item.overview;
//          tempItem.movieRating = item.vote_average;
//          tempItem.movieDate = item.release_date;
//          return tempItem;
//       });
//       return finalResults;
//    } catch (error) {
//       return "Something went wrong while fetching movies (SEARCH MODE) from TMDB!";
//    }
// }
