const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization:
      'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkNGY1NjJmMmY0ZGMyNzEwNzllZmM2NTJkZTZmYmY2OSIsIm5iZiI6MTczNDIxNzAyMS4zNjMwMDAyLCJzdWIiOiI2NzVlMGQzZDU1MWY2OWY3N2NhZGNhZTAiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.4iQa3mHbeX0ibxj0ulYA5zIh01W_4z1bB4a-cCP-Y6A',
  },
};

fetch('https://api.themoviedb.org/3/trending/all/day?language=en-US', options)
  .then(response => response.json())
  .then(data => {
    const heroMovie = data.results[0];

    // Bg IMG
    if (heroMovie && heroMovie.poster_path) {
      const heroImgUrl = `https://image.tmdb.org/t/p/w500${heroMovie.poster_path}`;

      const heroImg = document.querySelector(`#hero-img`);
      heroImg.style.backgroundImage = `url(${heroImgUrl})`;
    } else {
      console.log('hiçbi şey olmasa bile bi şeyler oldu');
    }
  })
  .catch(err => console.error(err));
