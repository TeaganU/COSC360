/** @jest-environment jsdom */

import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import SearchBar from "../../client/src/features/search/components/SearchBar.jsx";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

describe("SearchBar", () => {
  beforeEach(() => {
    mockNavigate.mockReset();
  });

  test("does not navigate for an empty search", () => {
    render(<SearchBar />);

    fireEvent.submit(screen.getByRole("searchbox"));

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test("navigates to the skills page with encoded search text and clears the field", () => {
    render(<SearchBar />);

    const input = screen.getByRole("searchbox");
    fireEvent.change(input, { target: { value: "rock climbing" } });
    fireEvent.submit(input.closest("form"));

    expect(mockNavigate).toHaveBeenCalledWith("/skills?search=rock%20climbing");
    expect(input.value).toBe("");
  });
});
