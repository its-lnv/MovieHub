MovieHub

Search any film by title and see its plot, cast, crew and IMDb rating on one page.

MovieHub is a responsive, two-page movie search app built with vanilla JavaScript, the OMDb API and Tailwind CSS. Type a title, browse the matches as a poster grid, then open a movie for its full details.

Live demo: https://your-username.github.io/moviehub/ Source code: https://github.com/your-username/moviehub

MovieHub home page

Table of Contents
About the Project
Features
Tech Stack
Screenshots
Project Structure
How It Works
API Reference
Getting Started
Deployment
Design Notes
What I Learned
Known Limitations and Planned Improvements
Topics
Contributing
License
Acknowledgements
Author
About the Project

This is my second JavaScript project, built to learn API integration, fetch, promises and async/await by making something real with them. I deliberately used no framework, so every step is visible in the code: send a request, wait for the response, check whether the API found anything, and turn the JSON into interface elements.

The app has two pages:

Home page (index.html) has a search form. Each search calls the OMDb API and shows the matches as a grid of poster cards.
Details page (movie-details.html) opens when you click a card. It reads the movie's IMDb ID from the URL, requests the full record from the API and displays everything about the film.

All movie data and posters come from the OMDb API.

Features
Search movies by title using the OMDb search endpoint
Poster grid of up to 10 results per search, each card showing the poster, title and year
Loading spinner while a request is in progress
Clear message when nothing matches, using the error text returned by the API
Details page with poster, title, release date, age rating, runtime, genre, IMDb rating, full plot, director, writer, actors, language and country
"View on IMDb" button that opens the movie's IMDb page in a new tab
Details URLs look like movie-details.html?id=tt0133093, so a details page can be refreshed or shared
Default placeholder poster for movies where OMDb has no image, or where the image fails to load
Responsive layout: the results grid goes from 2 to 5 columns depending on screen width
Navigation links in the header on desktop and a collapsible menu on mobile
Cinema-style dark interface: hover effects on posters, a ticket-style search box, a scrolling marquee and a film-strip About section
Tech Stack
Layer	Technology
Markup	HTML5
Styling	Tailwind CSS v4 (browser build from the jsDelivr CDN) plus a small custom CSS loader
Logic	Vanilla JavaScript (ES6+)
Data	OMDb API (REST, JSON)
Fonts	Barlow and Barlow Condensed from Google Fonts
Screenshots
Home	Search results	Movie details
Home	Results	Details
Project Structure
moviehub/
├── index.html            # Home page: header, hero, search form, results grid, about, contact, footer
├── script.js             # Search, result cards, card click navigation, menu toggle
├── movie-details.html    # Details page shell with the #movie-details container
├── movie-details.js      # Reads ?id= from the URL, fetches one movie and renders it
├── style.css             # CSS-only loader animation
├── screenshots/          # Images used in this README
├── README.md
└── LICENSE
File	What it does
index.html	Layout of the home page. Contains the search form (#search-movie), the results container (#movieHub), the menu (#options), and the Tailwind style block that styles the cards and loader created by JavaScript.
script.js	Home page logic: handles the form submit, calls the search endpoint, builds the result cards, handles card clicks and toggles the menu.
movie-details.html	Layout of the details page: a header with a back link and the #movie-details container, plus the style block for the details content.
movie-details.js	Details page logic: reads the id query parameter, fetches the full record and writes the details markup.
style.css	The spinning loader shown while data is loading.
How It Works
Click a card
Search form
script.js: searchMovies()
OMDb: s=title
Poster grid
movie-details.html?id=imdbID
movie-details.js:searchMovies()
OMDb: i=imdbID&plot=full
Details page
1. Searching (script.js)
The form's submit listener calls e.preventDefault() so the page does not reload, trims the input and stops if it is empty.
searchMovies() puts the loader (<div class="loader"></div>) into #movieHub.
It sends a GET request with fetch, using encodeURIComponent so titles with spaces or special characters are safe in the URL, and waits for the JSON with await.
If data.Response === "True", the results go to displayMovies(). Otherwise the API's data.Error message is shown instead.

A simplified version of the request:

js
async function searchMovies(movieName) {
    movieHub.innerHTML = `<div class="loader"></div>`

    let response = await fetch(`https://www.omdbapi.com/?apikey=YOUR_API_KEY&s=${encodeURIComponent(movieName)}`)
    let data = await response.json()

    if (data.Response === "True") {
        displayMovies(data.Search)
    } else {
        movieHub.innerHTML = `<p>${data.Error}</p>`
    }
}
2. Rendering results

displayMovies() clears the container and loops over the results with forEach. For each movie it creates a div with the class movie-card, stores the movie's IMDb ID in data-id, fills it with the poster, title and year using a template literal, and appends it to #movieHub.

3. Opening a movie

The cards are created dynamically, so one click listener on #movieHub handles all of them (event delegation). It finds the clicked card with e.target.closest(".movie-card"), reads dataset.id and sends the browser to movie-details.html?id=<imdbID>.

4. Loading the details (movie-details.js)
new URLSearchParams(location.search).get("id") reads the IMDb ID from the URL.
If an ID is present, searchMovies(imdbID) requests the full record with i=<imdbID>&plot=full.
displayMovie(data) writes the details into #movie-details with a template literal.
5. Menu

On small screens the hamburger button toggles the hidden class on the menu with classList.toggle("hidden"). On desktop the same links sit directly in the header, so no JavaScript is involved there.

6. Styling JavaScript-generated markup

The JavaScript files create elements without any Tailwind classes. Instead, each HTML file has a <style type="text/tailwindcss"> block that targets those elements by class and structure (for example .movie-card > div:first-child) and applies utilities with @apply. This keeps the JS free of styling concerns. If you change the markup inside a template literal, update the matching selectors in that block.

7. Missing posters

OMDb returns the text "N/A" instead of an image URL when a movie has no poster, and some poster links fail to load. The fallback is done in CSS, so the JavaScript stays simple: the poster box has a default film-frame image as its background, img[src="N/A"] is hidden, and a poster that loads covers the placeholder. A movie without a poster shows the default image instead of a broken one.

API Reference

MovieHub uses two requests to the OMDb API.

Purpose	Request	Used in
Search by title	GET https://www.omdbapi.com/?apikey=YOUR_API_KEY&s=<title>	script.js
Full record by IMDb ID	GET https://www.omdbapi.com/?apikey=YOUR_API_KEY&i=<imdbID>&plot=full	movie-details.js

Fields used from the search response: Response, Error, Search[].Title, Search[].Year, Search[].Poster, Search[].imdbID

Fields used from the details response: Title, Poster, Released, Rated, Runtime, Genre, imdbRating, Plot, Director, Writer, Actors, Language, Country, imdbID

When nothing is found, the API answers with Response: "False" and an error message such as:

json
{ "Response": "False", "Error": "Movie not found!" }
Getting Started
Prerequisites
A modern browser. Tailwind CSS v4 targets Chrome 111+, Safari 16.4+ and Firefox 128+.
An internet connection, for the OMDb API, the Tailwind CDN and Google Fonts.
A free OMDb API key from https://www.omdbapi.com/apikey.aspx. The key arrives by email and has to be activated first.
Installation
Clone the repository:
bash
git clone https://github.com/your-username/moviehub.git
cd moviehub
Add your API key in both JavaScript files by replacing the value after apikey=. In script.js:
js
let response = await fetch(`https://www.omdbapi.com/?apikey=YOUR_API_KEY&s=${encodeURIComponent(movieName)}`)

In movie-details.js:

js
let response = await fetch(`https://www.omdbapi.com/?apikey=YOUR_API_KEY&i=${imdbID}&plot=full`)
Open index.html in your browser, or serve the folder with any static server:
bash
npx serve
# or
python -m http.server 8000
Usage
Open the home page and click Search Now, or scroll to the search box.
Type a movie title (for example Inception) and press Search.
Click any poster to open that movie's details page.
Use Back to Search in the header to return to the home page.

The API key is part of the front-end code, so anyone can read it in the browser's developer tools. That is acceptable for a free key on a learning project. Do not put secrets that matter in client-side JavaScript.

Deployment

MovieHub is a static site, so it can be hosted anywhere that serves plain files. To use GitHub Pages:

Push the project to a GitHub repository.
Go to Settings > Pages.
Under Build and deployment, choose Deploy from a branch, select the main branch and the / (root) folder, then save.
After a minute or two the site is live at https://your-username.github.io/<repository-name>/.

GitHub Pages serves sites over HTTPS, and browsers block plain http:// requests made from an HTTPS page. Make sure both JavaScript files call https://www.omdbapi.com/, not http://www.omdbapi.com/.

Design Notes
Colour: a black background, red for actions (buttons, hover states, the loader) and a single antique-gold accent for ratings, years and icons. Dark surfaces with one or two accents is the common pattern on movie and streaming sites, so the posters supply the rest of the colour.
Typography: Barlow Condensed in capitals for headings, which gives a film title-card feel, and Barlow for body text.
Layout: poster-first. Each card shows the poster with the title over a dark fade, the year as a gold badge and a red arrow button on hover. The hero has a scrolling marquee band, the search box is shaped like a ticket, and the About section sits in a film strip with sprocket holes.
Accessibility: visible keyboard focus, a screen-reader label on the search input, and smooth scrolling and the marquee animation both switch off for visitors who prefer reduced motion.
No build step: Tailwind runs in the browser through its CDN script, so there is nothing to install or compile.
What I Learned
API integration: reading API documentation, building requests with query parameters, using an API key, and reading the Response and Error fields instead of assuming a request worked.
Promises and async/await: fetch returns a promise, response.json() returns another, and await lets asynchronous code read from top to bottom.
The Fetch API: sending GET requests and parsing JSON responses.
URLs as a data channel: encodeURIComponent for safe query strings, and URLSearchParams to pass an IMDb ID from one page to another.
DOM manipulation: querySelector, createElement, append, innerHTML with template literals, dataset and classList.toggle.
Event handling: submit and preventDefault, and event delegation with closest() so one listener covers every dynamically created card.
UI states: designing the loading, success and error/empty states of a request.
Imperfect data: the API returns "N/A" for missing fields such as posters, so the interface needs a default instead of a broken image.
Optional chaining: guarding against a missing element with movieCard?.dataset.id.
Tailwind CSS: utility-first styling, a responsive grid, and styling elements that JavaScript creates by using @apply with selectors.
Multi-page structure: splitting an app into pages with their own scripts.
Known Limitations and Planned Improvements
Only the first page of results (10 movies) is shown. Add the API's page parameter and a "Load more" button.
A failed network request is not caught, so the loader can keep spinning. Wrap the requests in try/catch and show a friendly message.
Clicks that do not land on a movie card should be ignored instead of triggering navigation.
Filters for year and type (movie, series, episode).
A watchlist saved with localStorage.
Search as you type, with debouncing, and skeleton loaders instead of a spinner.
Move the API key behind a small serverless proxy so it is not exposed in the front end.
Replace the Tailwind browser build with a compiled stylesheet for production. The browser build is meant for development and prototyping.
Topics

Add these under the repository's About section (the gear icon on the repository page):

javascript  html5  tailwindcss  omdb-api  movie-search  movie-app  rest-api  fetch-api
async-await  promises  dom-manipulation  responsive-design  frontend  vanilla-js
web-development  beginner-project

Repository description:

Responsive movie search app built with vanilla JavaScript, the OMDb API and Tailwind CSS.
Contributing

This is a learning project, but suggestions and bug reports are welcome. Open an issue to discuss a change, or fork the repository and send a pull request.

License

This project is licensed under the MIT License. See the LICENSE file for details.

The MIT License covers the code in this repository. Movie data and posters come from OMDb and remain subject to OMDb's own terms.

Acknowledgements
OMDb API for the movie data. Check its site for the current terms of use and attribution requirements.
Tailwind CSS for the styling.
Google Fonts for Barlow and Barlow Condensed.
IMDb is the destination of the "View on IMDb" links. This project is not affiliated with or endorsed by IMDb.
Author

Laxmi Narayan Verma

GitHub: https://github.com/your-username
LinkedIn: https://www.linkedin.com/in/your-profile