/** @jest-environment jsdom */

import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import EditProfileModal from "../../client/src/features/profile/components/EditProfileModal.jsx";

describe("EditProfileModal", () => {
  beforeEach(() => {
    global.URL.createObjectURL = jest.fn(() => "blob:preview-image");
    global.URL.revokeObjectURL = jest.fn();
  });

  test("renders profile fields and save button when opened", () => {
    render(
      <EditProfileModal
        isOpen
        profile={{ username: "tester", email: "tester@example.com", bio: "hello" }}
        submitting={false}
        error=""
        onClose={jest.fn()}
        onSubmit={jest.fn()}
      />
    );

    expect(screen.getByText("Edit Profile")).toBeInTheDocument();
    expect(screen.getByDisplayValue("tester")).toBeInTheDocument();
    expect(screen.getByDisplayValue("tester@example.com")).toBeInTheDocument();
    expect(screen.getByDisplayValue("hello")).toBeInTheDocument();
    expect(screen.getByText("Save Changes")).toBeInTheDocument();
  });

  test("shows an image preview after selecting a file", () => {
    const { container } = render(
      <EditProfileModal
        isOpen
        profile={{ username: "tester", email: "tester@example.com", bio: "" }}
        submitting={false}
        error=""
        onClose={jest.fn()}
        onSubmit={jest.fn()}
      />
    );

    const file = new File(["avatar"], "avatar.png", { type: "image/png" });
    const input = container.querySelector("#editProfileImage");

    fireEvent.change(input, { target: { files: [file] } });

    expect(screen.getByAltText("Profile preview")).toBeInTheDocument();
    expect(screen.getByText("avatar.png")).toBeInTheDocument();
    expect(global.URL.createObjectURL).toHaveBeenCalledWith(file);
  });
});
