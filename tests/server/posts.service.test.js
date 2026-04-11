import { jest } from "@jest/globals";

const addPost = jest.fn();
const findPostById = jest.fn();
const findPostDocumentById = jest.fn();
const findPosts = jest.fn();
const updatePostById = jest.fn();
const deletePostById = jest.fn();
const incrementPostViews = jest.fn();
const getProfileImagePath = jest.fn();

jest.unstable_mockModule("../../server/src/modules/posts/posts.repository.js", () => ({
  addPost,
  findPostById,
  findPostDocumentById,
  findPosts,
  updatePostById,
  deletePostById,
  incrementPostViews,
}));

jest.unstable_mockModule("../../server/src/modules/auth/auth.utils.js", () => ({
  getProfileImagePath,
}));

let createPostRecord;
let updatePostRecord;
let addCommentRecord;

describe("Posts Service", () => {
  beforeAll(async () => {
    ({ createPostRecord, updatePostRecord, addCommentRecord } = await import("../../server/src/modules/posts/posts.service.js"));
  });

  beforeEach(() => {
    jest.clearAllMocks();
    getProfileImagePath.mockReturnValue("/api/profile/user-1/image?v=1");
  });

  test("requires authentication to create a post", async () => {
    await expect(
      createPostRecord(
        { type: "question", category: "Hiking", title: "Title", content: "Content" },
        null
      )
    ).rejects.toThrow("Authentication required");
  });

  test("creates a post with author metadata", async () => {
    addPost.mockResolvedValue({ _id: "post-1" });

    const result = await createPostRecord(
      { type: "question", category: "Hiking", title: " Title ", content: " Content " },
      { _id: "user-1", username: "tester", profileImage: {}, updatedAt: new Date() }
    );

    expect(addPost).toHaveBeenCalledWith({
      type: "question",
      category: "Hiking",
      title: "Title",
      content: "Content",
      authorId: "user-1",
      authorUsername: "tester",
      authorProfileImage: "/api/profile/user-1/image?v=1",
    });
    expect(result).toEqual({ _id: "post-1" });
  });

  test("prevents a non-owner from editing a post", async () => {
    findPostById.mockResolvedValue({
      _id: "post-1",
      authorId: { toString: () => "someone-else" },
    });

    await expect(
      updatePostRecord("post-1", { title: "Updated" }, { _id: "user-1", role: "user" })
    ).rejects.toThrow("Not allowed to edit this post");
  });

  test("adds a comment and saves the post document", async () => {
    const comments = [];
    const postDoc = {
      comments,
      save: jest.fn().mockResolvedValue(),
    };
    postDoc.comments.push = function push(comment) {
      Array.prototype.push.call(this, comment);
      return this.length;
    };

    findPostDocumentById.mockResolvedValue(postDoc);

    const comment = await addCommentRecord(
      "post-1",
      { text: " Nice post " },
      { _id: "user-1", username: "tester", profileImage: {}, updatedAt: new Date() }
    );

    expect(postDoc.save).toHaveBeenCalled();
    expect(comment).toEqual({
      text: "Nice post",
      authorId: "user-1",
      authorUsername: "tester",
      authorProfileImage: "/api/profile/user-1/image?v=1",
    });
  });
});
