import { jest } from "@jest/globals";

const createLikeRepo = jest.fn();
const findLikeByUserAndPost = jest.fn();
const deleteLikeRepo = jest.fn();
const countLikesByPost = jest.fn();
const findPostById = jest.fn();
const setPostLikesById = jest.fn();

jest.unstable_mockModule("../../server/src/modules/like/like.repository.js", () => ({
  createLike: createLikeRepo,
  findLikeByUserAndPost,
  deleteLike: deleteLikeRepo,
  countLikesByPost,
}));

jest.unstable_mockModule("../../server/src/modules/posts/posts.repository.js", () => ({
  findPostById,
  setPostLikesById,
}));
let toggleLike;
let getMyLikeStatus;

describe("Like Service", () => {
  beforeAll(async () => {
    ({ toggleLike, getMyLikeStatus } = await import("../../server/src/modules/like/like.service.js"));
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("throws when authentication is missing", async () => {
    await expect(toggleLike(null, "post-1")).rejects.toThrow("Authentication required");
  });

  test("creates a like when none exists", async () => {
    findPostById.mockResolvedValue({ _id: "post-1" });
    findLikeByUserAndPost.mockResolvedValue(null);
    createLikeRepo.mockResolvedValue({ _id: "like-1" });
    countLikesByPost.mockResolvedValue(4);

    const result = await toggleLike({ _id: "user-1" }, "post-1");

    expect(createLikeRepo).toHaveBeenCalledWith("user-1", "post-1");
    expect(setPostLikesById).toHaveBeenCalledWith("post-1", 4);
    expect(result).toEqual({
      liked: true,
      like: { _id: "like-1" },
      likesCount: 4,
    });
  });

  test("removes an existing like when toggled again", async () => {
    findPostById.mockResolvedValue({ _id: "post-1" });
    findLikeByUserAndPost.mockResolvedValue({ _id: "like-1" });
    countLikesByPost.mockResolvedValue(2);

    const result = await toggleLike({ _id: "user-1" }, "post-1");

    expect(deleteLikeRepo).toHaveBeenCalledWith("user-1", "post-1");
    expect(setPostLikesById).toHaveBeenCalledWith("post-1", 2);
    expect(result).toEqual({
      liked: false,
      likesCount: 2,
    });
  });

  test("returns current like status and count", async () => {
    findPostById.mockResolvedValue({ _id: "post-1" });
    findLikeByUserAndPost.mockResolvedValue({ _id: "like-1" });
    countLikesByPost.mockResolvedValue(7);

    const result = await getMyLikeStatus({ _id: "user-1" }, "post-1");

    expect(result).toEqual({
      liked: true,
      likesCount: 7,
    });
  });
});
