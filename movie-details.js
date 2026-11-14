const params = new URLSearchParams(location.search)
const imdbID = params.get("id")
const movieDetail = document.querySelector("#movie-details")

if(imdbID) {
    searchMovies(imdbID.trim())
}

async function searchMovies(imdbID) {
    let response = await fetch(`http://www.omdbapi.com/?apikey=158deea8&i=${imdbID}&plot=full`)
    let data = await response.json()
    displayMovie(data)
}

function displayMovie(data) {
    movieDetail.innerHTML = `
        <div>
            <img src=${data.Poster} alt="">
        </div>

        <div>
            <h1>${data.Title}</h1>

            <div>
                <p>${data.Released}</p>
                <p>${data.Rated}</p>
                <p>${data.Runtime}</p>
                <p>${data.Genre}</p>
                <p>IMDb: ${data.imdbRating} / 10</p>
            </div>

            <div>
                <p>PLOT Overview</p>
                <p>${data.Plot}</p>
            </div>

            <div>
                <section>
                    <p>DIRECTOR</p>
                    <p>${data.Director}</p>
                </section>

                <section>
                    <p>WRITER</p>
                    <p>${data.Writer}</p>
                </section>
            </div>

            <div>
                <p>ACTORS</p>
                <p>${data.Actors}</p>
            </div>

            <div>
                <section>
                    <p>LANGUAGE</p>
                    <p>${data.Language}</p>
                </section>

                <section>
                    <p>COUNTRY</p>
                    <p>${data.Country}</p>
                </section>
            </div>

            <button>
                <a href=https://www.imdb.com/title/${data.imdbID} target="_blank">View on IMDb</a>
            </button>

        </div>
    `
}


