import { render, waitFor } from "@testing-library/react";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { useFetch } from "../hooks/useFetch";
import { describe, it, expect, afterEach } from "vitest";
import React from "react";
import "@testing-library/jest-dom";

// Mock axios instance for API requests
const mock = new MockAdapter(axios);

// Helper component to test the useFetch hook
const FetchComponent: React.FC<{ url: string }> = ({ url }) => {
  const [data, loading, error] = useFetch(() => axios.get(url));

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error</div>;

  return <div>{JSON.stringify(data?.data)}</div>;
};

describe("useFetch hook", () => {
  // Reset the mock adapter after each test
  afterEach(() => {
    mock.reset();
  });

  it("should return data when API call is successful", async () => {
    // Mocking successful API response
    const mockData = {
      id: 10,
      name: "Obi-Wan Kenobi",
      starships: [48],
      films: [1],
    };
    mock.onGet("https://sw-api.starnavi.io/people/10").reply(200, mockData);

    // Rendering component that uses useFetch
    const { getByText } = render(
      <FetchComponent url="https://sw-api.starnavi.io/people/10" />,
    );

    // Initially, the loading state should be rendered
    expect(getByText("Loading...")).toBeInTheDocument();

    // Wait for the data to load and check if the result is rendered
    await waitFor(() =>
      expect(getByText(JSON.stringify(mockData))).toBeInTheDocument(),
    );
  });

  it("should return error when API call fails", async () => {
    // Mocking failed API response
    mock.onGet("/mock-api").reply(500);

    // Rendering component that uses useFetch
    const { getByText } = render(<FetchComponent url="/mock-api" />);

    // Initially, the loading state should be rendered
    expect(getByText("Loading...")).toBeInTheDocument();

    // Wait for the error state and check if "Error" is rendered
    await waitFor(() => expect(getByText("Error")).toBeInTheDocument());
  });
});
