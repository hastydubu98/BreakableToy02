import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import TopArtists from "../src/TopArtists";
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

describe("TopArtists - No artists found", () => {
    beforeEach(() => {
        (useAuth as jest.Mock).mockReturnValue({ accessToken: "fakeToken" });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test("displays 'No artists found.' when API returns an empty list", async () => {
        render(
            <MemoryRouter>
                <TopArtists />
            </MemoryRouter>
        );

        // Wait for "No artists found." to appear
        await waitFor(() => expect(screen.getByText("No artists found.")).toBeInTheDocument());
    });

    test("renders artists after fetching data", async () => {
        global.fetch = jest.fn(() =>
          Promise.resolve({
            json: () =>
              Promise.resolve({
                items: [
                  {
                    id: "1",
                    name: "Artist One",
                    images: [{ url: "https://example.com/image.jpg" }],
                    external_urls: { spotify: "https://open.spotify.com/artist/1" },
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

    expect(await screen.findByText("Artist One")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Artist One" })).toBeInTheDocument();
  });
});

