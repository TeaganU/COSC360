/** @jest-environment jsdom */

import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Navbar from "../../client/src/components/ui/Navbar.jsx";

const mockLogout = jest.fn();
const mockUseAuth = jest.fn();

jest.mock("../../client/src/lib/AuthContext.jsx", () => ({
  useAuth: () => mockUseAuth(),
}));

jest.mock("../../client/src/lib/getImageUrl.js", () => ({
  getImageUrl: (path) => `resolved:${path}`,
}));

describe("Navbar", () => {
  beforeEach(() => {
    mockLogout.mockReset();
    mockUseAuth.mockReset();
  });

  test("renders guest navigation for logged out users", () => {
    mockUseAuth.mockReturnValue({
      isLoggedIn: false,
      user: null,
      logout: mockLogout,
    });

    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    expect(screen.getByRole("link", { name: "Home" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Skills" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Login" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Sign Up" })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Admin" })).not.toBeInTheDocument();
  });

  test("renders admin navigation and profile image for logged in admins", () => {
    mockUseAuth.mockReturnValue({
      isLoggedIn: true,
      user: {
        username: "admin_user",
        role: "admin",
        profileImage: "/api/profile/user-1/image",
      },
      logout: mockLogout,
    });

    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    expect(screen.getByRole("link", { name: "Admin" })).toBeInTheDocument();
    expect(screen.getByAltText("admin_user profile")).toHaveAttribute(
      "src",
      "resolved:/api/profile/user-1/image"
    );
    expect(screen.getByRole("button", { name: "Logout" })).toBeInTheDocument();
  });
});
