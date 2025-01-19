// Değişkenler
let currentPage = 1;
let totalPages = 0;
const moviesPerPage = 20;
const movieList = document.querySelector('.movie-grid');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const paginationContainer = document.querySelector('.page-numbers');
const apiKey = '8a4d9ed67b7d6af3412d8460b7ed63ee'; // TMDB API anahtarınızı buraya koyun

let genreMap = {};

// Tür listesini çek ve genreMap'i doldur
async function fetchGenres() {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=en-US`);
        const data = await response.json();
        genreMap = data.genres.reduce((map, genre) => {
            map[genre.id] = genre.name;
            return map;
        }, {});
    } catch (error) {
        console.error("Error fetching genres:", error);
    }
}

// Filmleri çek ve ekrana render et
async function fetchMovies(page = 1) {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/trending/movie/week?api_key=${apiKey}&page=${page}`);
        const data = await response.json();
        totalPages = data.total_pages;

        if (!data.results || data.results.length === 0) {
            movieList.innerHTML = `<p class="error">No movies found for this page.</p>`;
            return;
        }

        renderMovies(data.results);
        renderPagination();
        updatePaginationButtons();
    } catch (error) {
        console.error("Error fetching movies:", error);
        movieList.innerHTML = `<p class="error">Movies could not be loaded. Please try again later.</p>`;
    }
}

// Filmleri render et
function renderMovies(movies) {
    movieList.innerHTML = movies
        .map((movie) => {
            const movieGenres = (movie.genre_ids || [])
                .map((id) => genreMap[id])
                .filter(Boolean)
                .join(", ");

            return `
            <div class="movie-card" data-id="${movie.id}">
                <div class="movie-poster-container">
                    <img src="${movie.poster_path 
                        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` 
                        : 'path/to/placeholder.jpg'}" 
                         class="movie-poster" alt="${movie.title}">
                    <div class="movie-overlay">
                        <h3 class="movie-title">${movie.title}</h3>
                        <div class="movie-date-genres">
                        <p class="movie-genres">${movieGenres || "N/A"} |</p>
                        <p class="movie-release-date">${
                            movie.release_date
                                ? new Date(movie.release_date).getFullYear()
                                : "N/A"
                        }</p>
                           
                        </div>
                <div class="movie-info">
                    <p class="movie-rating">⭐ ${movie.vote_average?.toFixed(1) || "N/A"}</p>
                </div>
                    </div>
                </div>
            </div>
            `;
        })
        .join("");
}   

// Sayfa numaralarını render et
function renderPagination() {
    paginationContainer.innerHTML = '';

    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);

    if (startPage > 1) addPaginationButton(1);
    if (startPage > 2) addDots();

    for (let i = startPage; i <= endPage; i++) addPaginationButton(i);

    if (endPage < totalPages - 1) addDots();
    if (endPage < totalPages) addPaginationButton(totalPages);
}

// Sayfa numarası ekleme
function addPaginationButton(page) {
    const pageElement = document.createElement('span');
    pageElement.classList.add('page');
    if (page === currentPage) pageElement.classList.add('active');
    pageElement.textContent = page;
    pageElement.addEventListener('click', () => {
        if (currentPage !== page) {
            currentPage = page;
            fetchMovies(currentPage);
        }
    });
    paginationContainer.appendChild(pageElement);
}

// "..." noktaları ekleme
function addDots() {
    const dotsElement = document.createElement('span');
    dotsElement.classList.add('dots');
    dotsElement.textContent = '...';
    paginationContainer.appendChild(dotsElement);
}

// Sayfalama butonlarını güncelle
function updatePaginationButtons() {
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;
}

// Önceki sayfaya git
prevBtn.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        fetchMovies(currentPage);
    }
});

// Sonraki sayfaya git
nextBtn.addEventListener('click', () => {
    if (currentPage < totalPages) {
        currentPage++;
        fetchMovies(currentPage);
    }
});

// Başlangıç
async function initialize() {
    await fetchGenres(); // Türleri al
    fetchMovies(currentPage); // İlk sayfa filmleri getir
}

initialize();


