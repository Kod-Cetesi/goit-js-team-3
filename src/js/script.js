// dark / light mode switch

document.addEventListener('DOMContentLoaded', () => {
  const btn = document.querySelector('#myButton');

  if (localStorage.getItem('light-mode') === 'enabled') {
    document.body.classList.add('light-mode');
  }

  btn.addEventListener('click', () => {
    const b = document.body;
    const active = b.classList.toggle('light-mode');

    active
      ? localStorage.setItem('light-mode', 'enabled')
      : localStorage.removeItem('light-mode');
  });
});

// modal - teaser

const modalButton = document.querySelector('.teaser-button');
const modalHeader = document.querySelector('.close-modal');
const modalT = document.querySelector('.teaser-modal-bg');

modalButton.addEventListener('click', () => {
  modalT.style.display = 'flex';
});

modalHeader.addEventListener('click', () => {
  modalT.style.display = 'none';
});

/* Film Kartları -  Weekly */

const apiKey =
  'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkNGY1NjJmMmY0ZGMyNzEwNzllZmM2NTJkZTZmYmY2OSIsIm5iZiI6MTczNDIxNzAyMS4zNjMwMDAyLCJzdWIiOiI2NzVlMGQzZDU1MWY2OWY3N2NhZGNhZTAiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.4iQa3mHbeX0ibxj0ulYA5zIh01W_4z1bB4a-cCP-Y6A';

fetch('https://api.themoviedb.org/3/movie/popular?language=en-US&page=1', {
  method: 'GET',
  headers: {
    Authorization: `Bearer ${apiKey}`,
    Accept: 'application/json',
  },
})
  .then(response => response.json())
  .then(data => {
    // 3 kartım olduğu için 3 filmi böyle aldım
    for (let i = 0; i < 3; i++) {
      const movie = data.results[i];

      // resim
      const movieImg = movie.poster_path;
      const imageUrl = `https://image.tmdb.org/t/p/w500${movieImg}`;

      // başlık
      const movieTitle = movie.title;

      // allahın cezası genre
      const genres = movie.genre_ids
        .map(genreId => {
          const genre = genreName(genreId);
          return genre;
        })
        .join(', ');

      // yıl
      const movieYear = movie.release_date.split('-')[0];

      // kartları gez
      const movieCards = document.querySelectorAll('.movie-card');
      const movieCard = movieCards[i];

      // çağır
      movieCard.querySelector('.movie-image').src = imageUrl; // resim
      movieCard.querySelector('.movie-title').innerText = movieTitle; // başlık
      movieCard.querySelector('.genre').innerText = genres; // lanet olası genre
      movieCard.querySelector('.year').innerText = movieYear; // yıl baya basit oldu tşk
    }
  })
  .catch(error => console.error('Error fetching movie data:', error));

function genreName(genreId) {
  const genres = {
    28: 'Action',
    12: 'Adventure',
    16: 'Animation',
    35: 'Comedy',
    80: 'Crime',
    99: 'Documentary',
    18: 'Drama',
    10751: 'Family',
    14: 'Fantasy',
    36: 'History',
    27: 'Horror',
    10402: 'Music',
    9648: 'Mystery',
    10749: 'Romance',
    878: 'Science Fiction',
    10770: 'TV Movie',
    53: 'Thriller',
    10752: 'War',
    37: 'Western',
  };
  return genres[genreId];
}
