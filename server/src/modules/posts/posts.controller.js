import { searchPosts } from "./posts.service.js";

export async function getPosts(req, res) {
  const { search, category, type } = req.query;

  const results = await searchPosts({ search, category, type });

  res.json(results);
}
