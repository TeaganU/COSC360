/** @jest-environment jsdom */

import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import NotFoundPage from "../../client/src/app/NotFoundPage.jsx";

describe("NotFoundPage", () => {
  test("renders the 404 message and recovery links", () => {
    render(
      <MemoryRouter>
        <NotFoundPage />
      </MemoryRouter>
    );

    expect(screen.getByText("404")).toBeInTheDocument();
    expect(screen.getByText("Page Not Found")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Go Home" })).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: "Browse Skills" })).toHaveAttribute("href", "/skills");
  });
});
