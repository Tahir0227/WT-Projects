function MovieList({ movies, addToWatchList }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
      {movies.map((movie) => (
        <div style={{ border: "1px solid #ccc", padding: "10px" }}>
          <img src={movie.Poster} alt={movie.Title} width="150" />
          <h3>{movie.Title}</h3>
          <p>{movie.Year}</p>

          <button onClick={() => addToWatchList(movie)}>
            Add to Watchlist
          </button>
        </div>
      ))}
    </div>
  );
}

export default MovieList;
