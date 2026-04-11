import { jest } from "@jest/globals";

const countCommentsByAuthor = jest.fn();
const countCommentsOnAuthorPosts = jest.fn();
const countLikesByUser = jest.fn();
const countLikesOnAuthorPosts = jest.fn();
const countPostsByAuthor = jest.fn();
const findUserByEmail = jest.fn();
const findUserById = jest.fn();
const findUserByUsername = jest.fn();
const findUserProfileImageById = jest.fn();
const sumViewsOnAuthorPosts = jest.fn();
const syncUserProfileOnPosts = jest.fn();
const updateUserById = jest.fn();
const findPostsByAuthorId = jest.fn();
const findCommentsByAuthorId = jest.fn();
const toPublicUser = jest.fn();

jest.unstable_mockModule("../../server/src/modules/profile/profile.repository.js", () => ({
  countCommentsByAuthor,
  countCommentsOnAuthorPosts,
  countLikesByUser,
  countLikesOnAuthorPosts,
  countPostsByAuthor,
  findUserByEmail,
  findUserById,
  findUserByUsername,
  findUserProfileImageById,
  sumViewsOnAuthorPosts,
  syncUserProfileOnPosts,
  updateUserById,
  findPostsByAuthorId,
  findCommentsByAuthorId,
}));

jest.unstable_mockModule("../../server/src/modules/auth/auth.utils.js", () => ({
  toPublicUser,
}));
let getCurrentProfile;
let updateCurrentProfile;
let getCurrentUserPosts;
let getCurrentUserComments;

describe("Profile Service", () => {
  beforeAll(async () => {
    ({
      getCurrentProfile,
      updateCurrentProfile,
      getCurrentUserPosts,
      getCurrentUserComments,
    } = await import("../../server/src/modules/profile/profile.service.js"));
  });

  beforeEach(() => {
    jest.clearAllMocks();
    toPublicUser.mockImplementation((user) => ({
      id: user._id,
      username: user.username,
      email: user.email,
      bio: user.bio,
      profileImage: user.profileImage,
      role: user.role,
    }));
  });

  test("builds profile stats for the current user", async () => {
    findUserById.mockResolvedValue({
      _id: "user-1",
      username: "tester",
      email: "tester@example.com",
      bio: "bio",
      role: "user",
    });
    countPostsByAuthor.mockResolvedValue(3);
    countCommentsByAuthor.mockResolvedValue(4);
    countLikesByUser.mockResolvedValue(5);
    sumViewsOnAuthorPosts.mockResolvedValue(12);
    countCommentsOnAuthorPosts.mockResolvedValue(6);
    countLikesOnAuthorPosts.mockResolvedValue(7);

    const profile = await getCurrentProfile({ _id: "user-1" });

    expect(profile.stats).toEqual({
      postsCreated: 3,
      repliesGiven: 4,
      likesGiven: 5,
      viewsReceived: 12,
      commentsReceived: 6,
      likesReceived: 7,
    });
  });

  test("rejects invalid profile email updates", async () => {
    findUserById.mockResolvedValue({ _id: "user-1" });

    await expect(
      updateCurrentProfile({ _id: "user-1" }, { email: "bad-email" }, null)
    ).rejects.toThrow("Enter a valid email");
  });

  test("returns authored posts and comments", async () => {
    findPostsByAuthorId.mockResolvedValue([{ _id: "post-1" }]);
    findCommentsByAuthorId.mockResolvedValue([{ _id: "comment-1" }]);

    await expect(getCurrentUserPosts({ _id: "user-1" })).resolves.toEqual([{ _id: "post-1" }]);
    await expect(getCurrentUserComments({ _id: "user-1" })).resolves.toEqual([{ _id: "comment-1" }]);
  });
});
