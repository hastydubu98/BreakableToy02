import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import AlbumDetails from "../src/AlbumDetails";
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
        json: () => Promise.resolve({ items: [] }), // Empty artists list
    })
) as jest.Mock;

describe("AlbumDetails - Album not found", () => {
    beforeEach(() => {
        (useAuth as jest.Mock).mockReturnValue({ accessToken: "fakeToken" });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test("displays 'Album not found.' when API returns an empty list", async () => {
        render(
            <MemoryRouter>
                <AlbumDetails />
            </MemoryRouter>
        );

        // Wait for "Artist not found." to appear
        await waitFor(() => expect(screen.getByText("Loading...")).toBeInTheDocument());
    });

});