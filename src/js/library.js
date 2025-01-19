const API_KEY = '8a4d9ed67b7d6af3412d8460b7ed63ee';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

const genreFilter = document.getElementById('genre-filter');
const libraryMoviesContainer = document.getElementById("library-movies");

// 📌 **Sayfa Yüklendiğinde İşlemler**
document.addEventListener("DOMContentLoaded", () => {
    loadLibraryMovies();  // LocalStorage'dan filmleri getir
    populateGenreDropdown();  // Tür dropdown'unu doldur
});

// 📌 **1️⃣ LocalStorage'daki Filmleri Yükle**
function loadLibraryMovies(selectedGenre = "") {
    const savedMovies = JSON.parse(localStorage.getItem("library")) || [];

    if (savedMovies.length === 0) {
        libraryMoviesContainer.innerHTML = "<p>No movies in your library yet.</p>";
        return;
    }

    console.log(`📌 Seçilen Tür: ${selectedGenre}`);

    // 📌 **Seçilen türe sahip filmleri filtrele**
    const filteredMovies = selectedGenre
        ? savedMovies.filter(movie => 
            movie.genres && movie.genres.some(genre => {
                const genreName = typeof genre === "object" ? genre.name : genre;  // 🎯 **Nesne kontrolü eklendi!**
                return genreName.toLowerCase() === selectedGenre.toLowerCase();
            })
        )
        : savedMovies;

    console.log("📌 Filtrelenen Filmler:", filteredMovies);

    libraryMoviesContainer.innerHTML = ""; // Önce temizle

    filteredMovies.forEach(movie => {
        const movieCard = document.createElement("div");
        movieCard.classList.add("movie-card");

        // 📌 **Filmin Türlerini Virgülle Ayırarak Al**
        const genreNames = Array.isArray(movie.genres) 
            ? movie.genres.map(g => (typeof g === "object" ? g.name : g)).join(", ") 
            : "N/A";

        movieCard.innerHTML = `
            <div class="movie-poster-container">
                <img src="${IMAGE_BASE_URL}${movie.poster_path}" alt="${movie.title}">
                <div class="movie-overlay">
                    <button class="remove-btn" data-id="${movie.id}">Remove</button>
                </div>
            </div>
        `;

        libraryMoviesContainer.appendChild(movieCard);
    });

    // 📌 **2️⃣ Remove Butonu ile Film Silme**
    document.querySelectorAll(".remove-btn").forEach(button => {
        button.addEventListener("click", (e) => {
            const movieId = e.target.dataset.id;
            let updatedMovies = JSON.parse(localStorage.getItem("library")) || [];

            updatedMovies = updatedMovies.filter(movie => movie.id != movieId);
            localStorage.setItem("library", JSON.stringify(updatedMovies));

            loadLibraryMovies(selectedGenre); // Sayfayı yenilemeden güncelle
        });
    });
}

// 📌 **3️⃣ Tür Dropdown'unu Doldur**
function populateGenreDropdown() {
    const savedMovies = JSON.parse(localStorage.getItem("library")) || [];

    let allGenres = [];
    savedMovies.forEach(movie => {
        if (movie.genres && Array.isArray(movie.genres)) {
            allGenres.push(...movie.genres.map(g => (typeof g === "object" ? g.name : g)));  // 🎯 **Nesne kontrolü eklendi!**
        }
    });

    // 📌 **Tekrar Eden Türleri Engelle**
    const uniqueGenres = [...new Set(allGenres)];

    genreFilter.innerHTML = `<option value="">Genres</option>`;  // Varsayılan Seçenek
    uniqueGenres.forEach(genre => {
        const option = document.createElement("option");
        option.value = genre;
        option.textContent = genre;
        genreFilter.appendChild(option);
    });
}

// 📌 **4️⃣ Tür Seçildiğinde Filmleri Filtrele**
genreFilter.addEventListener("change", (event) => {
    const selectedGenre = event.target.value;
    loadLibraryMovies(selectedGenre);
});

// 📌 **5️⃣ Filmleri Library'ye Ekleme (LocalStorage)**
function addToLibrary(movie) {
    let libraryMovies = JSON.parse(localStorage.getItem("library")) || [];
    
    // 📌 **Türleri string array olarak kaydet**
    const movieGenres = movie.genres 
        ? movie.genres.map(g => (typeof g === "object" ? g.name : g))  // Eğer object ise name olarak al
        : [];

    if (!libraryMovies.some(m => m.id == movie.id)) {
        libraryMovies.push({
            id: movie.id,
            title: movie.title,
            poster_path: movie.poster_path,
            release_date: movie.release_date,
            genres: movieGenres // 📌 **Sadece isimleri kaydet**
        });

        localStorage.setItem("library", JSON.stringify(libraryMovies));
        alert(`${movie.title} added to library!`);
        loadLibraryMovies(); // Sayfayı yenilemeden güncelle
    } else {
        alert(`${movie.title} is already in your library.`);
    }
}
