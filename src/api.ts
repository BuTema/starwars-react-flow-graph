import { Hero, Film, Starship, HeroDetailed } from "./types";
import axios from "axios";

/**
 * Fetch a list of Star Wars heroes (people) from the API.
 * @param page - The page number for pagination.
 * @returns Array of heroes for the requested page.
 */
export const fetchHeroes = async (page: number): Promise<Hero[]> => {
  try {
    const response = await axios.get(
      `https://sw-api.starnavi.io/people?page=${page}`,
    );

    // Return the list of heroes, or an empty array if the response is empty.
    return response?.data?.results || [];
  } catch (error: any) {
    if (error.status === 404) {
      return []; // Return an empty array if the page is not found (404).
    }
    throw new Error(error); // Throw an error for other cases.
  }
};

/**
 * Fetch detailed information about a specific film by its ID.
 * @param id - The ID of the film.
 * @returns Film details.
 */
const fetchFilmDetails = async (id: number): Promise<Film> => {
  const response = await axios.get(`https://sw-api.starnavi.io/films/${id}`);

  if (response.status !== 200) {
    throw new Error("Failed to fetch film details");
  }

  return response.data;
};

/**
 * Fetch detailed information about a specific starship by its ID.
 * @param id - The ID of the starship.
 * @returns Starship details.
 */
const fetchStarshipDetails = async (id: number): Promise<Starship> => {
  const response = await axios.get(
    `https://sw-api.starnavi.io/starships/${id}`,
  );

  if (response.status !== 200) {
    throw new Error("Failed to fetch starship details");
  }

  return response.data;
};

/**
 * Fetch detailed information about a specific hero by their ID,
 * including the starships and films they are associated with.
 * @param id - The ID of the hero.
 * @returns Hero details with starships and films.
 */
export const fetchHeroDetails = async (id: string): Promise<HeroDetailed> => {
  let data;
  try {
    const response = await axios.get(`https://sw-api.starnavi.io/people/${id}`);
    data = response.data;
  } catch (error) {
    throw new Error("Failed to fetch hero details");
  }
  if (!data?.id) {
    throw new Error("Failed to fetch hero details");
  }

  // Fetch additional details about starships associated with the hero
  const starships = data.starships;
  const starshipsInfo = await Promise.all(
    starships.map(async (id: number) => fetchStarshipDetails(id)),
  );

  // Fetch additional details about films associated with the hero
  const films = data.films;
  const filmsInfo = await Promise.all(
    films.map(async (id: number) => fetchFilmDetails(id)),
  );

  // Return the hero details along with the starships and films they are connected to
  return {
    ...data,
    starships: starshipsInfo,
    films: filmsInfo,
  };
};
