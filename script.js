const movieForm = document.querySelector("#search-movie")
const movieInput = document.querySelector("#movie-name")
const movieHub = document.querySelector("#movieHub")
const hamburger = document.querySelector("#hamburger")
const options = document.querySelector("#options")

movieForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const query = movieInput.value.trim()

    if (!query) {
        return
    }

    console.log(query);

    searchMovies(query)
})

async function searchMovies(movieName) {
    movieHub.innerHTML = `<div class="loader"></div>`

    let response = await fetch(`http://www.omdbapi.com/?apikey=158deea8&s=${encodeURIComponent(movieName)}`)
    let data = await response.json()
    console.log(data);

    if(data.Response === "True") {
        displayMovies(data.Search)
    }
    else {
        movieHub.innerHTML = `<p>${data.Error}</p>`
    }  
}

function displayMovies(data) {
    movieHub.innerHTML = ""

    data.forEach(movie => {
        const div = document.createElement("div")

        div.dataset.id = movie.imdbID
        div.setAttribute("class", "movie-card")
        
        div.innerHTML = `
        <div>
            <img src=${movie.Poster} alt="">
        </div>

        <div>
            <p>${movie.Title}</p>
            <p>${movie.Year}</p>
        </div>
        `

        movieHub.append(div)
    });
}

movieHub.addEventListener('click', (e) => {
    e.stopPropagation()

    const movieCard = e.target.closest(".movie-card")
    const imdbID = movieCard?.dataset.id  
    location.href = `movie-details.html?id=${imdbID}`
    
})

hamburger.addEventListener('click', (e) => {
    e.stopPropagation()

    options.classList.toggle("hidden")

})

