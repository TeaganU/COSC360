/** @jest-environment jsdom */

import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import SkillsFilters from "../../client/src/features/skills/components/SkillsFilters.jsx";

describe("SkillsFilters", () => {
  test("calls onToggleSort when the sort selection changes", () => {
    const onToggleSort = jest.fn();

    render(
      <SkillsFilters
        categoryOptions={["All", "Hiking"]}
        postTypeOptions={["All", "Question"]}
        sortByOptions={[
          { value: "uploadDate", label: "Upload Date" },
          { value: "comments", label: "Comments" },
        ]}
        selectedCategories={["All"]}
        selectedTypes={["All"]}
        sortBy="uploadDate"
        onToggleCategory={jest.fn()}
        onToggleType={jest.fn()}
        onToggleSort={onToggleSort}
      />
    );

    fireEvent.change(screen.getByDisplayValue("Upload Date"), {
      target: { value: "comments" },
    });

    expect(onToggleSort).toHaveBeenCalledWith("comments");
  });

  test("calls category and type toggle handlers when checkboxes are clicked", () => {
    const onToggleCategory = jest.fn();
    const onToggleType = jest.fn();

    render(
      <SkillsFilters
        categoryOptions={["All", "Hiking"]}
        postTypeOptions={["All", "Question"]}
        sortByOptions={[{ value: "uploadDate", label: "Upload Date" }]}
        selectedCategories={["All"]}
        selectedTypes={["All"]}
        sortBy="uploadDate"
        onToggleCategory={onToggleCategory}
        onToggleType={onToggleType}
        onToggleSort={jest.fn()}
      />
    );

    fireEvent.click(screen.getByLabelText("Hiking"));
    fireEvent.click(screen.getByLabelText("Question"));

    expect(onToggleCategory).toHaveBeenCalledWith("Hiking");
    expect(onToggleType).toHaveBeenCalledWith("Question");
  });
});
