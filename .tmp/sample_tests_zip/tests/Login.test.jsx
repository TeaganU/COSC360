import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Login from "./Login";
import React from "react";

describe("Login Component", () => {//group tests related to Login component

  test("renders login form inputs and button", () => {
    render(<Login />); //render Login component

    //check if input with placeholder Username and Password exists
    expect(screen.getByPlaceholderText("Username")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Login" })).toBeInTheDocument();
  });

  test("allows user to type in inputs", () => {
    render(<Login />);

    //Get inputs
    const usernameInput = screen.getByPlaceholderText("Username");
    const passwordInput = screen.getByPlaceholderText("Password");

    //simulate typing text
    fireEvent.change(usernameInput, { target: { value: "john" } });
    fireEvent.change(passwordInput, { target: { value: "123456" } });

    expect(usernameInput.value).toBe("john");
    expect(passwordInput.value).toBe("123456");
  });

  test("displays message after successful login", async () => {
    // mock fetch - replace the real API call
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ message: "Login successful" })
      })
    );

    render(<Login />);

    //simulate Filling form
    fireEvent.change(screen.getByPlaceholderText("Username"), {
      target: { value: "john" }
    });

    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "123456" }
    });

    //click login - simulates submit button
    fireEvent.click(screen.getByRole("button", { name: "Login" }));
    //if login successful, show Login successful on screen
    const message = await screen.findByText("Login successful");
    expect(message).toBeInTheDocument();
  });

});