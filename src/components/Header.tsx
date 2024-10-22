import React from "react";
import { Link, useLocation } from "react-router-dom";

/**
 * Header component displays the application title or a "Home" link based on the current route.
 */
const Header: React.FC = () => {
  const location = useLocation(); // Get the current route location

  return (
    <header style={navStyle}>
      <nav>
        <h2 style={headerStyle}>
          {/* If the current route is the homepage ("/"), display the title, otherwise show a link to "Home". */}
          {location.pathname === "/" ? (
            "Star Wars Heroes"
          ) : (
            <Link to="/">Home</Link>
          )}
        </h2>
      </nav>
    </header>
  );
};

// Styles for the header container
const navStyle: React.CSSProperties = {
  backgroundColor: "#333",
  padding: "10px",
  color: "white",
  textAlign: "center",
};

// Styles for the header text
const headerStyle: React.CSSProperties = {
  color: "#aaa",
};

export default Header;
