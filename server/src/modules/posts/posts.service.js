import { addPost, getAllPosts } from "./posts.repository.js";

export async function searchPosts({ search, category, type }) {
  let posts = await getAllPosts();

  if (search) {
    const normalizedSearch = search.toLowerCase();
    const matchesSearch = value =>
      String(value ?? "").toLowerCase().includes(normalizedSearch);

    posts = posts.filter(post =>
      matchesSearch(post.title) ||
      matchesSearch(post.content) ||
      matchesSearch(post.author) ||
      matchesSearch(post.category) ||
      matchesSearch(post.type)
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

  const posts = getAllPosts();
  const maxId = posts.reduce(
    (currentMax, post) => Math.max(currentMax, Number(post.id) || 0),
    0
  );

  const newPost = {
    id: maxId + 1,
    author: "Guest",
    timestamp: new Date().toISOString(),
    type,
    category,
    title,
    content
  };

  return addPost(newPost);
}
