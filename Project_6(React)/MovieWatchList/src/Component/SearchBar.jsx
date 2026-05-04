function SearchBar({ setSearchTerm }) {
  return (
    <input
      type="text"
      placeholder="Search movies..."
      onChange={(e) => setSearchTerm(e.target.value)}
      style={{ padding: "10px", width: "300px", margin: "20px" }}
    />
  );
}

export default SearchBar;
