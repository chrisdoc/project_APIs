import { api_keys } from "./api_keys.js";

const API_Key_TMDB = "api_key=" + api_keys[0].API_Key_TMDB;

// const optionsTMDB = {
//    method: "GET",
//    headers: {
//       accept: "application/json",
//       Authorization: api_keys[0].TMDB_Bearer,
//    },
// };

const baseUrlTMDB = `https://api.themoviedb.org/3/`;
const discoverTMDB = `discover/movie?`;
const discoverUrlTMDB = baseUrlTMDB + discoverTMDB + API_Key_TMDB;

const baseImgUrlTMDB = "https://image.tmdb.org/t/p/w500";
const searchUrlTMDB = `${baseUrlTMDB}search/movie?${API_Key_TMDB}&query=`;

export async function moviesFromTMDB(searchTerm = "alone") {
   let url, err;

   if (searchTerm === "discover_mode") {
      url = discoverUrlTMDB;
      err = "DISCOVER MODE";
   } else {
      url = searchUrlTMDB + searchTerm;
      err = "SEARCH MODE";
   }

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
      throw new Error(
         `Something went wrong while fetching popular movies (${err}) from TMDB!`
      );
   }
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
