import React, { useState, useEffect } from "react";
import { fetchHeroes } from "../api";
import { Link } from "react-router-dom";
import { useFetch } from "../hooks/useFetch";
import { Hero } from "../types";

/**
 * HeroList component displays a paginated list of Star Wars heroes and handles infinite scrolling to load more heroes.
 */
const HeroList: React.FC = () => {
  const [page, setPage] = useState<number>(1); // Current page number for pagination
  const [loadNewPage, setLoadNewPage] = useState<boolean>(false); // Flag to trigger loading of a new page
  const [lastPage, setLastPage] = useState<boolean>(false); // Flag indicating if it's the last page
  const [heroes, setHeroes] = useState<Hero[]>([]); // Array of heroes displayed in the list

  // Fetch new heroes when the page number changes
  const [newHeroes, loading, error] = useFetch<Hero[]>(
    () => fetchHeroes(page),
    [page],
  );

  // Effect that updates the list of heroes when new heroes are fetched
  useEffect(() => {
    setLoadNewPage(false); // Reset the load flag
    if (!newHeroes) {
      return;
    }
    if (newHeroes.length === 0) {
      setLastPage(true); // Set the last page flag if no new heroes are returned
    } else {
      setHeroes((prevHeroes) => [...prevHeroes, ...newHeroes]); // Append new heroes to the list
    }
  }, [newHeroes]);

  // Effect that triggers when the user scrolls and reaches the bottom of the page
  useEffect(() => {
    if (loadNewPage && !lastPage) {
      setPage(page + 1); // Increment the page number if more pages are available
    }
  }, [loadNewPage]);

  // Scroll event listener to detect when the user is near the bottom of the page
  useEffect(() => {
    const handleScroll = (): any => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 100
      ) {
        setLoadNewPage(true); // Trigger loading a new page
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll); // Cleanup event listener on unmount
    };
  }, []);

  // Display loading or error messages
  if (loading && !heroes.length) return <div>Loading...</div>;
  if (error) return <div>Error loading heroes</div>;

  return (
    <div>
      <ul>
        {/* Render a list of heroes with links to their detail pages */}
        {heroes.map((hero: Hero) => (
          <h1 key={hero.id}>
            <Link to={`/hero/${hero.id}`} state={{ hero }}>
              {hero.name}
            </Link>
          </h1>
        ))}
      </ul>
      {loading && <div>Loading more heroes...</div>}
    </div>
  );
};

export default HeroList;
