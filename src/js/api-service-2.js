// TMDB API Key
const API_KEY = '8a4d9ed67b7d6af3412d8460b7ed63ee';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
const moviesGrid = document.getElementById('movies');
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-btn');
const yearDropdown = document.getElementById('membership'); // Year dropdown

let genreCache = null; // Genre listesini önbelleğe almak için değişken

// Yıl seçimi için dropdown'u dinleyin
// Yıl seçildiğinde filmi filtrelemek için bir fonksiyon
async function filterMoviesByYear(query = '', year = '') {
  if (query === '' && year === '') {
    // Eğer hem query hem de year boşsa popüler filmleri yükle
    await fetchMovies(
      `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=1`
    );
  } else if (year !== '' && query === '') {
    // Yalnızca yıl seçildiyse, sadece yıl bazlı filtreleme yapılır
    await fetchMoviesByYear(year);
  } else {
    // Yıl ve arama terimi ile birlikte filtreleme yapılır
    await searchMovies(query, year);
  }
}

// Yıla göre filmleri çekmek için fonksiyon
async function fetchMoviesByYear(year) {
  try {
    const url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=en-US&primary_release_year=${year}&sort_by=popularity.desc&page=1`;
    const response = await fetch(url);
    const data = await response.json();
    displayMovies(data.results); // Film sonuçlarını göster
  } catch (error) {
    console.error('Error fetching movies by year:', error);
  }
}

// Film arama fonksiyonu
async function searchMovies(query, year = '') {
  try {
    let url = `${BASE_URL}/search/movie?api_key=${API_KEY}&language=en-US&query=${query}`;

    if (year) {
      // Eğer yıl parametresi varsa, onu da URL'ye ekle
      url += `&primary_release_year=${year}`;
    }

    const response = await fetch(url);
    const data = await response.json();
    displayMovies(data.results); // Film sonuçlarını göster
  } catch (error) {
    console.error('Error searching movies:', error);
  }
}

// Arama butonuna tıklama olayını dinle
if (searchButton) {
  searchButton.addEventListener('click', async event => {
    event.preventDefault(); // Sayfanın yeniden yüklenmesini engeller
    const query = searchInput.value.trim();
    const selectedYear = yearDropdown.value.trim();
    // Yıl ve isme göre filtreleme, sadece butona basıldığında yapılır
    await filterMoviesByYear(query, selectedYear);
  });
}

// Enter tuşu ile arama yapmak için input kutusunu dinle
if (searchInput) {
  searchInput.addEventListener('keydown', event => {
    if (event.key === 'Enter') {
      event.preventDefault(); // Enter tuşuna basıldığında sayfa yenilenmesin
      const query = searchInput.value.trim();
      const selectedYear = yearDropdown.value.trim();
      // Yıl ve isme göre filtreleme, sadece Enter tuşuna basıldığında yapılır
      filterMoviesByYear(query, selectedYear);
    }
  });
}

// Rastgele bir film çekmek için fonksiyon
async function fetchRandomMovie() {
  try {
    const response = await fetch(
      `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=en-US&sort_by=popularity.desc`
    );
    const data = await response.json();

    // Filmler arasından rastgele birini seç
    const randomIndex = Math.floor(Math.random() * data.results.length);
    const randomMovie = data.results[randomIndex];

    // Hero alanını güncelle
    updateHeroSection(randomMovie);
  } catch (error) {
    console.error('Film verisi alınırken bir hata oluştu:', error);
  }
}

// Yıldızları oluşturmak için fonksiyon
function createStarRating(voteAverage) {
  const starContainer = document.createElement('div');
  starContainer.classList.add('star-rating');

  const rating = voteAverage / 2;
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5 ? 1 : 0;
  const emptyStars = 5 - fullStars - halfStar;

  for (let i = 0; i < fullStars; i++) {
    const star = document.createElement('span');
    star.classList.add('star', 'full');
    star.innerHTML = '★';
    starContainer.appendChild(star);
  }

  if (halfStar) {
    const star = document.createElement('span');
    star.classList.add('star', 'half');
    star.innerHTML = '☆';
    starContainer.appendChild(star);
  }

  for (let i = 0; i < emptyStars; i++) {
    const star = document.createElement('span');
    star.classList.add('star', 'empty');
    star.innerHTML = '☆';
    starContainer.appendChild(star);
  }

  return starContainer;
}

// Hero alanını güncellemek için fonksiyon
function updateHeroSection(movie) {
  const heroTitle = document.querySelector('.hero-title');
  heroTitle.textContent = movie.title;

  const heroBackground = document.querySelector('.hero');
  heroBackground.style.backgroundImage = `url(https://image.tmdb.org/t/p/original/${
    movie.backdrop_path || ''
  })`;

  const heroDescription = document.querySelector('.hero-description');
  heroDescription.textContent =
    movie.overview || 'Bu film için açıklama mevcut değil.';

  const moreDetailsButton = document.querySelector('.more-details-btn');
  moreDetailsButton.href = `https://www.themoviedb.org/movie/${movie.id}`;

  const heroRating = document.querySelector('.hero-rating');
  heroRating.innerHTML = '';
  heroRating.appendChild(createStarRating(movie.vote_average || 0));
}

// Popüler filmleri çek ve listele
async function fetchMovies(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    displayMovies(data.results);
  } catch (error) {
    console.error('Error fetching movies:', error);
  }
}

// Filmleri ekrana yerleştir
async function displayMovies(movies) {
  moviesGrid.innerHTML = '';
  if (movies.length === 0) {
    moviesGrid.innerHTML = '<p>No movies found.</p>';
  } else {
    for (let movie of movies) {
      const { title, poster_path, vote_average, release_date, genre_ids } =
        movie;

      // Film türlerini almak için TMDB API'sinden alınan tür ID'leriyle eşleşen isimleri almak
      const genres = genre_ids
        ? await Promise.all(genre_ids.map(genreId => getGenreNameById(genreId)))
        : [];
      const genreNames = genres.join(', ') || 'N/A';

      const movieCard = document.createElement('div');
      movieCard.classList.add('movie-card');
      movieCard.innerHTML = `
                <div class="movie-poster-container">
                    <img 
                        class="movie-poster" 
                        src="${
                          poster_path
                            ? IMAGE_BASE_URL + poster_path
                            : 'https://via.placeholder.com/200x300?text=No+Image'
                        }" 
                        alt="${title}" 
                    />
                    <div class="movie-overlay">
                        <h3 class="movie-title">${title}</h3>
                        <p class="movie-release-date">${
                          release_date
                            ? new Date(release_date).getFullYear()
                            : 'N/A'
                        }</p>
                        <p class="movie-genres">${genreNames}</p>
                    </div>
                </div>
                <div class="movie-info">
                    <p class="movie-rating">⭐ ${vote_average.toFixed(1)}</p>
                </div>
            `;
      moviesGrid.appendChild(movieCard);
    }
  }
}

// Genre ID'lerini tür isimlerine dönüştürmek için fonksiyon
async function getGenreNameById(genreId) {
  // Eğer genreCache doluysa, verileri önbellekten alıyoruz
  if (!genreCache) {
    const genreList = await fetch(
      `${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=en-US`
    );
    const genreData = await genreList.json();
    genreCache = genreData.genres;
  }

  const genre = genreCache.find(g => g.id === genreId);
  return genre ? genre.name : 'Unknown';
}

// Gece modu geçişini başlatan fonksiyon
function toggleDarkMode() {
  const body = document.body;
  const isDarkMode = body.classList.toggle('dark-mode');
  localStorage.setItem('darkMode', isDarkMode ? 'enabled' : 'disabled');
}

// Sayfa yüklendiğinde kullanıcı tercihlerini kontrol et
document.addEventListener('DOMContentLoaded', () => {
  const darkMode = localStorage.getItem('darkMode');
  if (darkMode === 'enabled') {
    document.body.classList.add('dark-mode');
  }

  const toggleButton = document.querySelector('.toggle-dark-mode');
  if (toggleButton) {
    toggleButton.addEventListener('click', toggleDarkMode);
  }

  // Rastgele bir film yükle
  fetchRandomMovie();

  // Popüler filmleri yükle
  fetchMovies(
    `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=1`
  );
});
