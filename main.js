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
  localStorage.clear()
  fetch(`https://www.omdbapi.com/?&apikey=5f1016d4&s=${userInput}`)
  .then(res => res.json())
  .then (data => {
    console.log(data.Search)
    data.Search.forEach(movie => {
      fetch(`https://www.omdbapi.com/?apikey=5f1016d4&i=${movie.imdbID}&plot=full`)
      .then(res => res.json())
      .then(movie => {
        localStorage.setItem(movie.Title, JSON.stringify(movie))
        movieListEl.innerHTML += movieCardHtml(movie)
        shortenMovieSummary(movie.Plot, movie.imdbID)
      })
    })
  })
}

const movieCardHtml = (movie) => {

  const html = `
  <li id="movie-card-${movie.imdbID}" class="movie-card" style='background-image: url(${movie.Poster})'>
    <img src="${movie.Poster}" alt="movie-poster" class="movie-poster">
    <h2 class="movie-title">${movie.Title}<span class="movie-rating">${movie.imdbRating}</span></h2>
    <p class="movie-duration">${movie.Runtime}</p>
    <p class="movie-genre">${movie.Genre}</p>
    <p class="movie-year">${movie.Year}</p>
    <button class="add-to-watchlist-btn">Watchlist</button>
    <div id="movie-summary-${movie.imdbID}" class="movie-summary"><p id="summary-content-${movie.imdbID}">${movie.Plot}</p></div>
  </li>
  `

  return html
}

function shortenMovieSummary(summary, id) {
  console.log(summary.length)
  const textCutOff = 400
  const remainingText = summary.length - textCutOff
  if(summary.length > textCutOff && remainingText > 200) {
    const summaryWrapper = document.getElementById(`movie-summary-${id}`)
    const summaryContent = document.getElementById(`summary-content-${id}`)
    summaryContent.classList.add("short")
    summaryWrapper.innerHTML += `<button id="read-more-btn-${id}" class="read-more-btn" data-read-more-btn="${id}">More</button>`
  }
}

window.addEventListener('click', (e)=> {
  if(e.target.dataset.readMoreBtn) {
    const id = e.target.dataset.readMoreBtn
    const button = document.getElementById(`read-more-btn-${id}`)
    const movieSummary = document.getElementById(`summary-content-${id}`)
    movieSummary.classList.toggle("short") 
    if(button.textContent === 'More') {
      button.textContent = 'Less'
    } else button.textContent = 'More'
  }
})

//Display most recent search results on page re/load
if(Object.keys(localStorage).length) {
  Object.keys(localStorage).forEach(movie => {
    const movieInfo = JSON.parse(localStorage.getItem(movie))
    movieListEl.innerHTML += movieCardHtml(movieInfo)
    shortenMovieSummary(movieInfo.Plot, movieInfo.imdbID)
  })
} else {
  movieListEl.innerHTML = `
  <p class="empty-movie-list">There's nothing here...</p>
  `
}


