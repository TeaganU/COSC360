let getImageUrl;

describe("getImageUrl", () => {
  beforeAll(async () => {
    ({ getImageUrl } = await import("../../client/src/lib/getImageUrl.js"));
  });

  test("returns an empty string for missing image paths", () => {
    expect(getImageUrl("")).toBe("");
  });

  test("adds the server origin for relative image paths", () => {
    expect(getImageUrl("/uploads/avatar.png")).toBe("http://localhost:4000/uploads/avatar.png");
  });

  test("adds cache busting to unversioned profile image paths", () => {
    expect(getImageUrl("/api/profile/123/image")).toBe("http://localhost:4000/api/profile/123/image?v=latest");
  });

  test("does not add a duplicate cache busting param when version already exists", () => {
    expect(getImageUrl("/api/profile/123/image?v=171000")).toBe("http://localhost:4000/api/profile/123/image?v=171000");
  });
});
