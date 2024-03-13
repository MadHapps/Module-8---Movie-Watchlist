import './style.css'

const movieListEl = document.getElementById('movie-list')
const searchFieldEl = document.getElementById('searchForm')

const movieCardHtml = (movie) => {
  const currentWatchlist = JSON.parse(localStorage.getItem('savedWatchlist')) || []
  const isWatchlisted = currentWatchlist.some(item => item.imdbID === movie.imdbID)
  let buttonText
  let classText
  if(!isWatchlisted) {
    buttonText = "Watchlist"
    classText = "watchlist-btn"
  } else {
    buttonText = "Remove"
    classText = "remove-btn"
  }

  const html = `
  <li id="movie-card-${movie.imdbID}" class="movie-card" style='background-image: url(${movie.Poster})'>
    <img src="${movie.Poster}" alt="movie-poster" class="movie-poster">
    <h2 class="movie-title">${movie.Title}<span class="movie-rating">${movie.imdbRating}</span></h2>
    <p class="movie-duration">${movie.Runtime}</p>
    <p class="movie-genre">${movie.Genre}</p>
    <p class="movie-year">${movie.Year}</p>
    <button id="watchlist-btn-${movie.imdbID}" class="${classText}" data-watchlist-btn="${movie.imdbID}">${buttonText}</button>
    <div id="movie-summary-${movie.imdbID}" class="movie-summary"><p id="summary-content-${movie.imdbID}">${movie.Plot}</p></div>
  </li>
  `

  return html
}

if(searchFieldEl) {
  searchFieldEl.addEventListener('submit', (e) => {
    e.preventDefault()
    const searchField = document.getElementById('searchField')
    movieSearchApiFetch(searchField.value)
    movieListEl.innerHTML = ''
    searchField.value = ''
  })
}

window.addEventListener('click', (e)=> {
  if(e.target.dataset.readMoreBtn) {
    readMore(e.target.dataset.readMoreBtn)
  } 
  else if(e.target.dataset.watchlistBtn) {
    const button = document.getElementById(`watchlist-btn-${e.target.dataset.watchlistBtn}`)
    if(button.textContent === 'Watchlist') {
      addToWatchlist(e.target.dataset.watchlistBtn)
      button.textContent = 'Remove'
      button.classList.replace('watchlist-btn', 'remove-btn')
    } else {
      removeFromWatchlist(e.target.dataset.watchlistBtn)
      button.textContent = 'Watchlist'
      button.classList.replace('remove-btn', 'watchlist-btn')
    }
    
  }
})

function movieSearchApiFetch(userInput) {
  sessionStorage.clear()
  fetch(`https://www.omdbapi.com/?&apikey=5f1016d4&s=${userInput}`)
  .then(res => res.json())
  .then (data => {
    console.log(data.Search)
    data.Search.forEach(movie => {
      fetch(`https://www.omdbapi.com/?apikey=5f1016d4&i=${movie.imdbID}&plot=full`)
      .then(res => res.json())
      .then(movie => {
        sessionStorage.setItem(movie.imdbID, JSON.stringify(movie))
        movieListEl.innerHTML += movieCardHtml(movie)
        shortenMovieSummary(movie.Plot, movie.imdbID)
      })
    })
  })
}

function shortenMovieSummary(summary, id) {1
  const textCutOff = 400
  if(summary) {
    const remainingText = summary.length - textCutOff
    if(summary.length > textCutOff && remainingText > 200) {
      const summaryWrapper = document.getElementById(`movie-summary-${id}`)
      const summaryContent = document.getElementById(`summary-content-${id}`)
      summaryContent.classList.add("short")
      summaryWrapper.innerHTML += `<button id="read-more-btn-${id}" class="read-more-btn" data-read-more-btn="${id}">More</button>`
    }
  }
}

function readMore(id) {
  const button = document.getElementById(`read-more-btn-${id}`)
  const movieSummary = document.getElementById(`summary-content-${id}`)
  movieSummary.classList.toggle("short") 
  if(button.textContent === 'More') {
    button.textContent = 'Less'
  } else button.textContent = 'More'
}

function addToWatchlist(id) {
  const selectedMovie = JSON.parse(sessionStorage.getItem(id))
  let watchlist = []
  if(localStorage.getItem('savedWatchlist')) {
    watchlist = (JSON.parse(localStorage.getItem('savedWatchlist')))
    watchlist.push(selectedMovie)
    localStorage.setItem('savedWatchlist', JSON.stringify(watchlist))
    console.log('hello1')
  } else {
    watchlist.push(selectedMovie)
    localStorage.setItem('savedWatchlist', JSON.stringify(watchlist))
    console.log('hello2')
  }
}

function removeFromWatchlist(id) {
  let watchlist = []
  let itemRemoved = false
  if(localStorage.getItem('savedWatchlist')) {
    const selectedMovie = JSON.parse(localStorage.getItem('savedWatchlist')).filter(movie => movie.imdbID === id)[0]
    watchlist = (JSON.parse(localStorage.getItem('savedWatchlist')))
    const movieToRemove = watchlist.findIndex(movie => movie.Title === selectedMovie.Title)
    watchlist.splice(movieToRemove, 1)
    localStorage.setItem('savedWatchlist', JSON.stringify(watchlist))
    itemRemoved = true
  }

  if(itemRemoved && !searchFieldEl) {
    document.getElementById(`movie-card-${id}`).remove()
  }

  if(document.getElementById('movie-list').childElementCount === 0) {
    emptyMovieListHtml()
  }
}

function emptyMovieListHtml() {
  if(searchFieldEl) {
    movieListEl.innerHTML = `
    <p class="empty-movie-list">You're watchlist is looking a little empty...</p>
    <p class="empty-movie-list-btn">Add some movies in the above search field!</p>
  `
  } else {
    movieListEl.innerHTML = `
    <p class="empty-movie-list">You're watchlist is looking a little empty...</p>
    <a href="index.html" target="_self" class="empty-movie-list-btn">Let's add some movies!</a>
    `
  }
}

/////// ON PAGE LOAD //////////////////
// For index.html --
// If there's data in sessionStorage of any length and the
// searchFieldEl exist(used to determine which page is being viewed),
// display the most recent search results on front page re/load
if(Object.keys(sessionStorage).length && searchFieldEl) {
  Object.keys(sessionStorage).forEach(movie => {
    const movieInfo = JSON.parse(sessionStorage.getItem(movie))
    movieListEl.innerHTML += movieCardHtml(movieInfo)
    shortenMovieSummary(movieInfo.Plot, movieInfo.imdbID)
  })
} 
// For watchlist.html --
// If there's data in localStorage named savedWatchlist and the 
// searchFieldEl doesn't exist(used to determine which page is being viewed),
// display data from local storage.
else if(JSON.parse(localStorage.getItem('savedWatchlist')).length > 0 && !searchFieldEl) {
  JSON.parse(localStorage.getItem('savedWatchlist')).forEach(movie => {
    movieListEl.innerHTML += movieCardHtml(movie)
    shortenMovieSummary(movie.Plot, movie.imdbID)
  })
} 
// Display message for when there's no information to draw from
else {
  emptyMovieListHtml()
}


