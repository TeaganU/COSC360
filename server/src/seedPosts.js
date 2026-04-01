import mongoose from "mongoose";
import dotenv from "dotenv";
import Post from "./models/Post.js";

dotenv.config();

const samplePosts = [
  {
    id: 1,
    author: "Teagan",
    timestamp: new Date().toISOString(),
    type: "Skill Guide",
    category: "Rock Climbing",
    title: "Beginner belay tips",
    content: "Always double check harness, knot, and belay device before climbing."
  },
  {
    id: 2,
    author: "Jonah",
    timestamp: new Date().toISOString(),
    type: "Event",
    category: "Skiing",
    title: "Big White weekend trip",
    content: "Looking for people interested in sharing rides and skiing this weekend."
  },
  {
    id: 3,
    author: "Aakash",
    timestamp: new Date().toISOString(),
    type: "Question",
    category: "Hiking",
    title: "Best beginner hikes near Kelowna?",
    content: "I am looking for easier hikes with good views and not too much elevation."
  },
  {
    id: 4,
    author: "Parsa",
    timestamp: new Date().toISOString(),
    type: "Skill Guide",
    category: "Camping",
    title: "Camp stove basics",
    content: "Bring fuel, check wind direction, and cook on a stable flat surface."
  },
  {
    id: 5,
    author: "Thanmay",
    timestamp: new Date().toISOString(),
    type: "Event",
    category: "Mountain Biking",
    title: "Trail ride meetup",
    content: "Anyone want to meet for a beginner-friendly ride on Saturday morning?"
  }
];

async function run() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    await Post.deleteMany({});
    await Post.insertMany(samplePosts);

    console.log("Sample posts inserted");
    process.exit(0);
  } catch (err) {
    console.error("Seed error:", err);
    process.exit(1);
  }
}

run();