import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav style={{ padding: "10px", background: "#222", color: "#fff" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2 style={{ margin: 0 }}>Movie Watchlist</h2>

        <div>
          <Link
            to="/"
            style={{
              marginRight: "15px",
              color: "#fff",
              textDecoration: "none",
            }}
          >
            Watchlist
          </Link>

          <Link to="/add" style={{ color: "#fff", textDecoration: "none" }}>
            Add Movies
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
