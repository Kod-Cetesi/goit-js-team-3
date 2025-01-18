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
        console.log(data); // API yanıtını konsola yazdır
        return data;
    } catch (error) {
        console.error('Error fetching movie details:', error);
        return null; // Hata durumunda null döndür
    }
}


// Modalı açma fonksiyonu
function openModal(movie) {
    try {
        const modal = document.getElementById('movie-modal');
        const modalPoster = document.getElementById('modal-poster');
        const modalTitle = document.getElementById('modal-title');
        const modalVotes = document.getElementById('modal-votes');
        const modalPopularity = document.getElementById('modal-popularity');
        const modalGenre = document.getElementById('modal-genre');
        const modalOverview = document.getElementById('modal-overview');

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

        modal.classList.remove('visually-hidden');
    } catch (error) {
        console.error('Error opening modal:', error);
    }
}



// Modalı kapatma fonksiyonu
function closeModal() {
    modal.classList.add('visually-hidden');
}

// Modal kapatma butonunu dinleme
closeButton.addEventListener('click', closeModal);

// Modal dışında bir yere tıklayınca kapatma
window.addEventListener('click', (event) => {
    if (event.target === modal) {
        closeModal();
    }
});
