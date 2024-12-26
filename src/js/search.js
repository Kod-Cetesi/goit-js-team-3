import { setSearchQuery } from './pagination.js';

const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const clearButton = document.getElementById('clear-button');
const movieListContainer = document.getElementById('movie-list'); // Arama sonuçlarını göstermek için

searchInput.addEventListener('input', () => {
  if (searchInput.value.trim() !== '') {
    clearButton.style.display = 'inline';
  } else {
    clearButton.style.display = 'none';
  }
});

clearButton.addEventListener('click', () => {
  searchInput.value = '';
  clearButton.style.display = 'none';
  setSearchQuery('');
});

searchForm.addEventListener('submit', e => {
  e.preventDefault();
  const query = searchInput.value.trim();
  if (query) {
    setSearchQuery(query);
    attachModalToSearchResults();
  }
});

function attachModalToSearchResults() {
  const movieCards = movieListContainer.querySelectorAll('.catalog-item');
  movieCards.forEach(card => {
    const movieId = card.id.split('-')[2];
    card.addEventListener('click', () => {
      window.movieModal.show(movieId);
    });
  });
}
