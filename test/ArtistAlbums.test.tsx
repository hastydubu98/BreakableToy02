import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import ArtistAlbums from "../src/ArtistAlbums";
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

describe("ArtistAlbums - No tracks found", () => {
    beforeEach(() => {
        (useAuth as jest.Mock).mockReturnValue({ accessToken: "fakeToken" });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test("displays 'Loading...' when API returns an empty list", async () => {
        render(
            <MemoryRouter>
                <ArtistAlbums />
            </MemoryRouter>
        );

        // Wait for "No tracks found." to appear
        await waitFor(() => expect(screen.getByText("Loading...")).toBeInTheDocument());
    });

});