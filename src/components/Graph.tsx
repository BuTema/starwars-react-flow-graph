import React from "react";
import ReactFlow, { Node, Edge } from "react-flow-renderer";
import { HeroDetailed } from "../types";

interface GraphProps {
  hero: HeroDetailed;
}

/**
 * Graph component visualizes the connections between a Star Wars hero, the films they appear in, and the starships they use.
 * @param hero - Detailed information about the hero, including films and starships.
 */
const Graph: React.FC<GraphProps> = ({ hero }) => {
  // If there is no hero or insufficient data, display a message.
  if (!hero || !hero.films || !hero.starships) {
    return <div>No data available</div>;
  }

  // Get the current width of the screen to dynamically calculate positions.
  const screenWidth = window.innerWidth;

  // Calculate spacing for films and starships based on the screen width.
  const filmSpacing = screenWidth / (hero.films.length + 1);
  const shipSpacing = screenWidth / (hero.starships.length + 1);

  // Define the nodes for the graph: the hero, films, and starships.
  const nodes: Node[] = [
    // The hero node is centered at the top of the screen.
    {
      id: "hero",
      type: "input",
      data: { label: hero.name },
      position: { x: screenWidth / 2, y: 0 },
    },
    // Create a node for each film, evenly spaced horizontally.
    ...hero.films.map((film, index) => ({
      id: `film-${film.id}`,
      data: { label: film.title },
      position: { x: filmSpacing * index + filmSpacing / 2, y: 100 },
    })),
    // Create a node for each starship, evenly spaced horizontally.
    ...hero.starships.map((ship, index) => ({
      id: `ship-${ship.id}`,
      data: {
        label:
          ship.name === ship.model ? ship.name : `${ship.name}: ${ship.model}`,
      },
      position: { x: shipSpacing * index + shipSpacing / 2, y: 250 },
    })),
  ];

  // Define the edges (connections) between the hero, films, and starships.
  const edges: Edge[] = [
    // Connect the hero to each film.
    ...hero.films.map((film) => ({
      id: `edge-hero-film-${film.id}`,
      source: "hero",
      target: `film-${film.id}`,
    })),
    // Connect each film to the starships that appear in it.
    ...hero.starships.flatMap((ship) =>
      ship.films.map((filmId) => ({
        id: `edge-film-ship-${ship.id}-${filmId}`,
        source: `film-${filmId}`,
        target: `ship-${ship.id}`,
      })),
    ),
  ];

  return (
    <div style={{ height: "400px", width: "100%" }}>
      {/* Render the graph using ReactFlow */}
      <ReactFlow edges={edges} nodes={nodes} />
    </div>
  );
};

export default Graph;
