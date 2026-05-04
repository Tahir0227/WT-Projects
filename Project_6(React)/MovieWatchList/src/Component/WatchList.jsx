function WatchList({ watchList, removeFromWatchList }) {
  return (
    <div>
      <h2>My Watchlist</h2>

      {watchList.length === 0 && <p>No movies added</p>}

      {watchList.map((movie) => (
        <div key={movie.imdbID}>
          <img src={movie.Poster} width="100" />
          <h3>{movie.Title}</h3>

          <button onClick={() => removeFromWatchList(movie.imdbID)}>
            Remove
          </button>
        </div>
      ))}
    </div>
  );
}

export default WatchList;
