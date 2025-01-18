// BASE_URL Tanımlaması
const BASE_URL = "https://api.themoviedb.org/3";

// API Anahtarınızı buraya ekleyin
const API_KEY = '8a4d9ed67b7d6af3412d8460b7ed63ee';

// Modal öğelerini seçme
const modal = document.getElementById('movie-modal');
const closeButton = document.querySelector('.close-button');
const modalPoster = document.getElementById('modal-poster');
const modalTitle = document.getElementById('modal-title');
const modalVotes = document.getElementById('modal-votes');
const modalPopularity = document.getElementById('modal-popularity');
const modalGenre = document.getElementById('modal-genre');
const modalOverview = document.getElementById('modal-overview');
const addToLibraryButton = document.getElementById('add-to-library');

// Kullanıcı hangi filme tıkladıysa onu tutan değişken
let currentMovie = null;

// Kartlara tıklama olayını dinleme
document.addEventListener('click', async (event) => {
    const card = event.target.closest('.movie-card');
    if (card) {
        const movieId = card.getAttribute('data-id'); // Kartın data-id'sini al
        if (movieId) {
            try {
                const movieData = await fetchMovieDetails(movieId); // Film detaylarını getir
                if (movieData) {
                    openModal(movieData); // Modalı aç
                } else {
                    console.error("Film detayları getirilemedi.");
                }
            } catch (error) {
                console.error("Film detayları alınırken hata oluştu:", error);
            }
        } else {
            console.error("Kart üzerinde geçerli bir movieId bulunamadı.");
        }
    }
});

// API'den film detaylarını getirme fonksiyonu
async function fetchMovieDetails(movieId) {
    try {
        if (!movieId) {
            throw new Error('Geçersiz film ID');
        }
        const response = await fetch(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=en-US`);
        if (!response.ok) {
            throw new Error(`Film detayları getirilemedi: ${response.status}`);
        }
        const data = await response.json();
        console.log("Movie Data:", data); // API yanıtını konsola yazdır
        return data;
    } catch (error) {
        console.error('Error fetching movie details:', error);
        return null; // Hata durumunda null döndür
    }
}

// Modalı açma fonksiyonu
function openModal(movie) {
    try {
        currentMovie = movie; // Seçili filmi sakla

        modalPoster.src = movie.poster_path
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : 'https://via.placeholder.com/250x350?text=No+Image';
        modalTitle.textContent = movie.title || 'No Title';
        modalVotes.textContent = `${movie.vote_average?.toFixed(1) || 'N/A'} / ${movie.vote_count || '0'}`;
        modalPopularity.textContent = movie.popularity?.toFixed(1) || 'N/A';
        modalGenre.textContent = movie.genres
            ? movie.genres.map((genre) => genre.name).join(', ')
            : 'N/A';
        modalOverview.textContent = movie.overview || 'No description available.';

        // Modal'ı aç
        modal.classList.remove('visually-hidden');
        document.body.style.overflow = 'hidden'; // Arkaplan kaydırmayı engelle
    } catch (error) {
        console.error('Error opening modal:', error);
    }
}

// Modalı kapatma fonksiyonu
function closeModal() {
    modal.classList.add('visually-hidden');
    document.body.style.overflow = 'auto'; // Arkaplan kaydırmayı aç
}

// Modal kapatma butonunu dinleme
closeButton.addEventListener('click', closeModal);

// Modal dışında bir yere tıklayınca kapatma
window.addEventListener('click', (event) => {
    if (event.target === modal) {
        closeModal();
    }
});

// **Filmi Library'ye Kaydetme**
addToLibraryButton.addEventListener('click', () => {
    let savedMovies = JSON.parse(localStorage.getItem('library')) || [];

    if (!savedMovies.some(movie => movie.id === currentMovie.id)) {
        savedMovies.push(currentMovie);
        localStorage.setItem('library', JSON.stringify(savedMovies));
        alert("Movie added to library!");
    } else {
        alert("This movie is already in your library.");
    }
});
