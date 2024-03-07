import './style.css'

const movieListEl = document.getElementById('movie-list')
const searchFieldEl = document.getElementById('searchForm')

searchFieldEl.addEventListener('submit', (e) => {
  e.preventDefault()
  const searchField = document.getElementById('searchField')

  movieSearchApiFetch(searchField.value)

  movieListEl.innerHTML = ''
  searchField.value = ''
})

function movieSearchApiFetch(userInput) {
  fetch(`http://www.omdbapi.com/?&apikey=5f1016d4&s=${userInput}`)
  .then(res => res.json())
  .then (data => {
    console.log(data.Search)
    data.Search.forEach(movie => {
      fetch(`http://www.omdbapi.com/?apikey=5f1016d4&i=${movie.imdbID}`)
      .then(res => res.json())
      .then(movie => {
        movieListEl.innerHTML += movieCardHtml(movie)
      })
    })
  })
}

const movieCardHtml = (movie) => {
  const html = `
  <li class="movie-card" style='background-image: url(${movie.Poster})'>
    <img src="${movie.Poster}" alt="movie-poster" class="movie-poster">
    <h2 class="movie-title">${movie.Title}<span class="movie-rating">${movie.imdbRating}</span></h2>
    <p class="movie-duration">${movie.Runtime}</p>
    <p class="movie-genre">${movie.Genre}</p>
    <p class="movie-year">${movie.Year}</p>
    <button class="add-to-watchlist-btn">Watchlist</button>
    <input type="checkbox" id="read-more">
    <p class="movie-summary">${movie.Plot}
      <label for="read-more" class="read-more-btns">Read more</label>
      <span class="movie-summary-expanded">
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Distinctio
        tempora, assumenda voluptatibus ad illo suscipit?
        <label for="read-more" clas~s="read-more-btns">Read less</label>
      </span>
    </p>
  </li>
  `

  return html
}
