import posts from "../../data/posts.json" with { type: "json" };

export function getAllPosts() {
  return posts;
}

export function addPost(newPost) {
  posts.push(newPost);
  return newPost;
}
