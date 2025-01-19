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
    // Modal
    const modal = document.querySelector('#movie-modal');
    const modalContent = modal.querySelector('.modal-card-content');

    // Modal'ı çarpıya değil de modal dışına da tıklayarak kapatma
    // Bu if scope'unda çalışmadı niye bilmiyorum :(
    window.addEventListener('click', event => {
      if (event.target === modal) {
        modal.style.display = 'none';
      }
    });
    // 3 kartım olduğu için 3 filmi böyle aldım
    for (let i = 0; i < 3; i++) {
      const movies = data.results[i]; // ben burayı data[0] diye başlatmaya kalkıp yarım saat uğraştım, siz yanmayın...

      // resim
      const movieImg = movies.poster_path;
      const imageUrl = `https://image.tmdb.org/t/p/w500${movieImg}`; // buradaki w500 boyut parametresi zorunluymuş gpt'den öğrendim özr dlrm...

      // başlık
      const movieTitle = movies.title;

      // allahın cezası genre
      /*

      const genres = movies.genre_ids
        .map(genreId => {
          const genre = genreName(genreId);
          return genre;
        })
        .join(', ');

      */

      // yıl
      const movieYear = movies.release_date.split('-')[0];

      // kartları gez
      const movieCards = document.querySelectorAll('.movie-card-index');
      const movieCard = movieCards[i];

      // çağır
      movieCard.querySelector('.movie-image').src = imageUrl; // resim
      movieCard.querySelector('.movie-title').innerText = movieTitle; // başlık
      // movieCard.querySelector('.genre').innerText = genres; lanet olası genre
      movieCard.querySelector('.year').innerText = movieYear; // yıl baya basit oldu tşk

      // card modals

      // Böyle innerHTML yazmayı da deniym dedim ama teaser-modal'a da benzetebiliriz
      // Modal işlevi bağlama
      movieCard.addEventListener('click', () => {
        modalContent.innerHTML = `
          <div class="movie-card-index-modal-img">
            <img src="${imageUrl}" alt="${movieTitle}">
          </div>
          <div class="movie-card-index-modal-detail">
            <h2>${movieTitle}</h2>
            <div>
              <span>Vote / Votes</span>
              <span class="year">${movieYear}</span>
            </div>
          </div>
          <span class="close-card-modal">X</span>
        `;

        const closeModal = modalContent.querySelector('.close-card-modal');

        closeModal.addEventListener('click', () => {
          modal.style.display = 'none';
        });

        modal.style.display = 'flex';
      });
    }
  })
  .catch(error => console.error(error));

/**
 


function genreName(genreId) {
  // buradaki genre listesini ben beceremedim, gpt verdi. sonra switch case ile yazayım bari dedim o da olmadı. niyetim iyiydi...
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

 
 
 */
