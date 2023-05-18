/* -------------------------------------------------------- */
/* --------------------- Modal Section -------------------- */
/* -------------------------------------------------------- */
const modalFormMovieDetails = document.getElementById(
   "modal-form-movie-details"
);

const modalFormContent = document.getElementById("modal-form-content");

const spanCloseModalForm = document
   .getElementById("span-close-modal-form")
   .addEventListener(
      "click",
      () => (modalFormMovieDetails.style.display = "none")
   );

const buttonModalFormClose = document
   .getElementById("button-close-modal-form")
   .addEventListener(
      "click",
      () => (modalFormMovieDetails.style.display = "none")
   );

export function renderModalForm(e, errorMessage) {
   modalFormMovieDetails.style.display = "block";

   if (e === "render_error") {
      modalFormMovieDetails.style.borderRadius = "100px";
      modalFormMovieDetails.style.border = "10px solid orange";
      modalFormMovieDetails.style.padding = "50px";
      document.getElementById("details-header-h2").textContent =
         "!!! ERROR !!!";
      document.getElementById("details-movie-image").style.display = "none";
      document.getElementById("details-title").textContent = "Submit Error";
      document.getElementById("details-year").textContent = "Empty Movie List";
      document.getElementById("details-rating").textContent = "";
      document.getElementById("details-genre").textContent = "";
      document.getElementById("details-director").textContent = "";
      document.getElementById("details-overview-h2").textContent = "";
      document.getElementById("details-overview-p").textContent = errorMessage;
      // "Please input a search term in the Search Movie section, Movie Title.";
      return;
   }

   modalFormMovieDetails.style.borderRadius = "10px";
   modalFormMovieDetails.style.border = "5px solid white";
   modalFormMovieDetails.style.padding = "20px";

   const detailsHeaderH2 = document.getElementById("details-header-h2");
   detailsHeaderH2.textContent = "Movie Details";
   modalFormContent.innerHTML = "";
   const parentNode = e.target.parentNode;
   const movieImgSrc = parentNode.children[0].src;
   const movieTitle = parentNode.children[1].firstElementChild.innerHTML;
   const movieRating = parentNode.children[1].children[1].innerHTML;
   const movieOverview = parentNode.children[2].getAttribute("data-overview");
   const movieYear = parentNode.children[3].getAttribute("data-year");
   const fillModalForm = `
   <img id="details-movie-image" src=${movieImgSrc} alt=${movieTitle}>
   <aside id="modal-form-aside">
      <h1 id="details-title">${movieTitle}</h1>
      <br><hr><br>
      <h3 id="details-rating">Rating: ${movieRating}</h3>
      <h3 id="details-year">Release Year: ${movieYear}</h3>
      <br><hr><br>
      <h3 id="details-genre"></h3>
      <h4 id="details-director"></h4>
      <h2 id="details-overview-h2">Overview</h2>
      <p id="details-overview-p">${movieOverview}</p>
   </aside>`;
   modalFormContent.innerHTML = fillModalForm;
}
