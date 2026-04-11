/** @jest-environment jsdom */

import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import LoginForm from "../../client/src/features/auth/components/LoginForm.jsx";

const mockNavigate = jest.fn();
const mockLogin = jest.fn();
const mockClearBanNotice = jest.fn();
const mockRememberBan = jest.fn();
const mockPost = jest.fn();

jest.mock("react-router-dom", () => ({
  Link: ({ children, to }) => <a href={to}>{children}</a>,
  useNavigate: () => mockNavigate,
}));

jest.mock("../../client/src/lib/ApiClient.js", () => ({
  apiClient: {
    post: (...args) => mockPost(...args),
  },
}));

jest.mock("../../client/src/lib/AuthContext.jsx", () => ({
  useAuth: () => ({
    clearBanNotice: mockClearBanNotice,
    login: mockLogin,
    rememberBan: mockRememberBan,
  }),
}));

describe("LoginForm", () => {
  beforeEach(() => {
    mockNavigate.mockReset();
    mockLogin.mockReset();
    mockClearBanNotice.mockReset();
    mockRememberBan.mockReset();
    mockPost.mockReset();
  });

  test("logs in successfully and navigates home", async () => {
    mockPost.mockResolvedValue({
      token: "signed-token",
      user: { id: "user-1", username: "tester" },
    });

    render(<LoginForm />);

    fireEvent.change(screen.getByPlaceholderText("you@example.com"), {
      target: { value: "tester@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("••••••••"), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Login" }));

    await waitFor(() => {
      expect(mockPost).toHaveBeenCalledWith("/auth/login", {
        email: "tester@example.com",
        password: "password123",
      });
    });

    expect(mockClearBanNotice).toHaveBeenCalled();
    expect(mockLogin).toHaveBeenCalledWith("signed-token", { id: "user-1", username: "tester" });
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  test("redirects to the banned page when the account is disabled", async () => {
    const error = new Error("banned");
    error.status = 403;
    error.data = {
      code: "ACCOUNT_BANNED",
      ban: { reason: "Spam" },
    };
    mockPost.mockRejectedValue(error);

    render(<LoginForm />);

    fireEvent.change(screen.getByPlaceholderText("you@example.com"), {
      target: { value: "tester@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("••••••••"), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Login" }));

    await waitFor(() => {
      expect(mockRememberBan).toHaveBeenCalledWith({ reason: "Spam" });
    });

    expect(mockNavigate).toHaveBeenCalledWith("/banned");
    expect(mockLogin).not.toHaveBeenCalled();
  });

  test("shows field and general errors from the API", async () => {
    const error = new Error("bad login");
    error.data = {
      email: "Email is required",
      general: "Could not log in",
    };
    mockPost.mockRejectedValue(error);

    render(<LoginForm />);

    fireEvent.click(screen.getByRole("button", { name: "Login" }));

    expect(await screen.findByText("Email is required")).toBeInTheDocument();
    expect(screen.getByText("Could not log in")).toBeInTheDocument();
  });
});
