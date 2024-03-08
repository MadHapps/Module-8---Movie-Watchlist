import './style.css'

const movieListEl = document.getElementById('movie-list')
const searchFieldEl = document.getElementById('searchForm')

movieListEl.innerHTML = `
<p class="empty-movie-list">There's nothing here...</p>
`

searchFieldEl.addEventListener('submit', (e) => {
  e.preventDefault()
  const searchField = document.getElementById('searchField')
  movieSearchApiFetch(searchField.value)
  movieListEl.innerHTML = ''
  searchField.value = ''
})

function movieSearchApiFetch(userInput) {
  fetch(`https://www.omdbapi.com/?&apikey=5f1016d4&s=${userInput}`)
  .then(res => res.json())
  .then (data => {
    console.log(data.Search)
    data.Search.forEach(movie => {
      fetch(`https://www.omdbapi.com/?apikey=5f1016d4&i=${movie.imdbID}`)
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
    <p class="movie-summary">${movie.Plot}</p>
  </li>
  `

  return html
}
