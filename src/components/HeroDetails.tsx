import React, { useMemo, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { Hero, HeroDetailed } from "../types";
import Graph from "./Graph";
import { fetchHeroDetails } from "../api";
import { useFetch } from "../hooks/useFetch";

/**
 * HeroDetails component fetches detailed information about a specific Star Wars hero and renders it in a graph.
 */
const HeroDetails: React.FC = () => {
  const location = useLocation(); // Get the current route location

  // Extract the hero from location state, or parse the hero ID from the URL path
  const hero = location.state?.hero as Hero;
  const heroId = useMemo(() => {
    return hero?.id?.toString() || location.pathname.split("/").pop() || "-1";
  }, [hero, location.pathname]);

  // Fetch the detailed hero data based on the hero ID
  const fetchHero = useCallback(() => fetchHeroDetails(heroId), [heroId]);

  // Use the custom hook to fetch hero details, handle loading, error, and data states
  const [heroDetails, loading, error] = useFetch<HeroDetailed>(fetchHero, [
    fetchHero,
  ]);

  // If no hero ID is available, show an error message
  if (heroId === "-1") {
    return <div>Hero Id not provided</div>;
  }

  // Handle loading and error states
  if (!heroDetails) return <div>No hero data available</div>;
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading hero details</div>;

  return (
    <div>
      {/* Display the hero name and render the Graph component with hero details */}
      <h3>{heroDetails.name}</h3>
      <Graph hero={heroDetails} />
    </div>
  );
};

export default HeroDetails;
