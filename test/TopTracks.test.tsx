import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import TopArtists from "../src/TopTracks";
import { useAuth } from "../src/AuthContext";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";

// Mock useAuth
jest.mock("../src/AuthContext", () => ({
    useAuth: jest.fn(),
}));

// Mock fetch globally
global.fetch = jest.fn(() =>
    Promise.resolve({
        json: () => Promise.resolve({ items: [] }),
    })
) as jest.Mock;

describe("TopTracks - No tracks found", () => {
    beforeEach(() => {
        (useAuth as jest.Mock).mockReturnValue({ accessToken: "fakeToken" });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test("displays 'No tracks found.' when API returns an empty list", async () => {
        render(
            <MemoryRouter>
                <TopArtists />
            </MemoryRouter>
        );

        // Wait for "No tracks found." to appear
        await waitFor(() => expect(screen.getByText("No tracks found.")).toBeInTheDocument());
    });

    test("renders tracks after fetching data", async () => {
        global.fetch = jest.fn(() =>
          Promise.resolve({
            json: () =>
              Promise.resolve({
                items: [
                  {
                    id: "1",
                    name: "Track One",
                    artists: [{ name: "Artist One" }],
                    album: {images: [{ url: "https://example.com/image.jpg" }]},
                    external_urls: { spotify: "https://open.spotify.com/tracks/1" },
                  },
                ],
              }),
          })
        ) as jest.Mock;

    render(
      <MemoryRouter>
        <TopArtists />
      </MemoryRouter>
    );

    expect(await screen.findByText("Track One")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Track One" })).toBeInTheDocument();
  });
});