document.addEventListener("DOMContentLoaded", () => {
    const libraryMoviesContainer = document.getElementById("library-movies");
    const savedMovies = JSON.parse(localStorage.getItem("library")) || [];

    if (savedMovies.length === 0) {
        libraryMoviesContainer.innerHTML = "<p>No movies in your library yet.</p>";
        return;
    }

    savedMovies.forEach(movie => {
        const movieCard = document.createElement("div");
        movieCard.classList.add("movie-card");
        movieCard.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
            <h3>${movie.title}</h3>
            <button class="remove-btn" data-id="${movie.id}">Remove</button>
        `;
        libraryMoviesContainer.appendChild(movieCard);
    });

    // Remove button event listener
    document.querySelectorAll(".remove-btn").forEach(button => {
        button.addEventListener("click", (e) => {
            const movieId = e.target.dataset.id;
            const updatedMovies = savedMovies.filter(movie => movie.id !== parseInt(movieId));
            localStorage.setItem("library", JSON.stringify(updatedMovies));
            location.reload();
        });
    });
});
