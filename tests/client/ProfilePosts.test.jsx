/** @jest-environment jsdom */

import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import ProfilePosts from "../../client/src/features/profile/components/ProfilePosts.jsx";

const mockGet = jest.fn();

jest.mock("../../client/src/lib/ApiClient.js", () => ({
  apiClient: {
    get: (...args) => mockGet(...args),
  },
}));

jest.mock("../../client/src/features/profile/components/ProfilePostsCard.jsx", () => ({
  __esModule: true,
  default: ({ post }) => <div data-testid="profile-post-card">{post.title}</div>,
}));

jest.mock("../../client/src/features/profile/components/ProfileCommentsCard.jsx", () => ({
  __esModule: true,
  default: ({ comment }) => <div data-testid="profile-comment-card">{comment.text}</div>,
}));

describe("ProfilePosts", () => {
  beforeEach(() => {
    mockGet.mockReset();
  });

  test("loads posts by default and switches to comments", async () => {
    mockGet.mockImplementation((path) => {
      if (path === "/profile/me/posts") {
        return Promise.resolve({ posts: [{ _id: "post-1", title: "My first post" }] });
      }

      if (path === "/profile/me/comments") {
        return Promise.resolve({ comments: [{ _id: "comment-1", text: "My comment" }] });
      }

      return Promise.resolve({});
    });

    render(<ProfilePosts />);

    expect(await screen.findByText("My first post")).toBeInTheDocument();
    expect(mockGet).toHaveBeenCalledWith("/profile/me/posts");

    fireEvent.click(screen.getByRole("button", { name: "Comments" }));

    await waitFor(() => {
      expect(mockGet).toHaveBeenCalledWith("/profile/me/comments");
    });
    expect(await screen.findByText("My comment")).toBeInTheDocument();
  });

  test("shows an error when loading comments fails", async () => {
    mockGet.mockImplementation((path) => {
      if (path === "/profile/me/posts") {
        return Promise.resolve({ posts: [] });
      }

      return Promise.reject(new Error("Request failed"));
    });

    render(<ProfilePosts />);

    fireEvent.click(screen.getByRole("button", { name: "Comments" }));

    expect(await screen.findByText("Could not load comments.")).toBeInTheDocument();
  });
});
