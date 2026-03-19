import { addPost, getAllPosts } from "./posts.repository.js";

export function searchPosts({ search, category, type }) {
  let posts = getAllPosts();

  if (search) {
    posts = posts.filter(post =>
      post.title.toLowerCase().includes(search.toLowerCase()) ||
      post.content.toLowerCase().includes(search.toLowerCase())
    );
  }

  if (category && category !== "All") {
    posts = posts.filter(post => post.category === category);
  }

  if (type && type !== "All") {
    posts = posts.filter(post => post.type === type);
  }

  return posts;
}

export function createPostRecord({ type, category, title, content }) {
  if (!title || !content) {
    throw new Error("Missing required fields");
  }

  const newPost = {
    id: Date.now(),
    type,
    category,
    title,
    content
  };

  return addPost(newPost);
}
