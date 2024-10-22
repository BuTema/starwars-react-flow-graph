import { describe, it, expect, afterEach } from "vitest";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { fetchHeroes, fetchHeroDetails } from "../api";

// Create a mock adapter for axios
const mock = new MockAdapter(axios);

describe("API functions", () => {
  // Reset the mock adapter after each test to avoid state conflicts
  afterEach(() => {
    mock.reset();
  });

  it("fetchHeroes should return hero list on success", async () => {
    const mockData = {
      results: [
        { id: 1, name: "Luke Skywalker" },
        { id: 2, name: "Darth Vader" },
      ],
    };

    // Mock the API response for fetchHeroes
    mock.onGet("https://sw-api.starnavi.io/people?page=1").reply(200, mockData);

    // Call the fetchHeroes function and check if it returns the expected result
    const heroes = await fetchHeroes(1);
    expect(heroes).toEqual(mockData.results);
  });

  it("fetchHeroes should return empty array on 404", async () => {
    // Mock the API to return a 404 error
    mock.onGet("https://sw-api.starnavi.io/people?page=2").reply(404);

    // Call the fetchHeroes function and check if it returns an empty array
    const heroes = await fetchHeroes(2);
    expect(heroes).toEqual([]);
  });

  it("fetchHeroDetails should return hero details with films and starships", async () => {
    const mockHeroData = {
      id: 10,
      name: "Obi-Wan Kenobi",
      starships: [48],
      films: [1],
    };
    const mockStarshipData = {
      id: 48,
      name: "Jedi starfighter",
      model: "Delta-7",
    };
    const mockFilmData = { id: 1, title: "A New Hope" };

    // Mock the API responses for hero, starship, and film details
    mock.onGet("https://sw-api.starnavi.io/people/10").reply(200, mockHeroData);
    mock
      .onGet("https://sw-api.starnavi.io/starships/48")
      .reply(200, mockStarshipData);
    mock.onGet("https://sw-api.starnavi.io/films/1").reply(200, mockFilmData);

    // Call fetchHeroDetails and check if it returns the expected result
    const heroDetails = await fetchHeroDetails("10");
    expect(heroDetails).toEqual({
      ...mockHeroData,
      starships: [mockStarshipData],
      films: [mockFilmData],
    });
  });

  it("fetchHeroDetails should throw an error on failed request", async () => {
    // Mock the API to return a 500 error for hero details
    mock.onGet("https://sw-api.starnavi.io/people/10").reply(500);

    // Check if the fetchHeroDetails function throws the expected error
    await expect(fetchHeroDetails("10")).rejects.toThrow(
      "Failed to fetch hero details",
    );
  });
});
