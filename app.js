require("dotenv").config();

const express = require("express");
const app = express();
app.set("view engine", "ejs");
let allPosts = [];

const mongoose = require("mongoose");

mongoose.connect(process.env.DATABASE_URL);

const db = mongoose.connection;

db.on("error", (error) => {
  console.log(error);
});

db.once("open", () => {
  console.log("Connected to the database");
});

//Form Handling
app.use(express.urlencoded({ extended: true }));
//parses incoming requests with a JSON payload.
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to my app. Login or something!");
});

app.get("/posts", (req, res) => {
  res.render("index", { posts: allPosts });
});

app.get("/post/:id", async (req, res) => {
  const postId = req.params.id;

  try {
    const thePost = await Post.findById(postId);
    if (!thePost) {
      return res.status(404).json({ message: "Post not found" }); // Handle case where post is not found
    }
    res.json(thePost);
  } catch (err) {
    console.error("Error fetching post:", err);
    res.status(500).json({ message: "Error fetching post" });
  }
});
const postSchema = new mongoose.Schema(
  {
    postName: String,
    postContent: String,
    postNumber: Number,
  },
  {
    timestamps: true,
  }
);

const Post = mongoose.model("Post", postSchema);

app.get("/api/getPosts", async (req, res) => {
  try {
    const posts = await Post.find(); // Fetch all posts from the database
    res.json(posts); // Send the posts as JSON response
  } catch (err) {
    console.error("Error fetching posts:", err);
    res.status(500).json({ message: "Error fetching posts" }); // Send error if something goes wrong
  }
});

app.post("/api/newPost", (req, res) => {
  const newPost = new Post({
    postName: req.body.postName,
    postContent: req.body.postContent,
    postNumber: req.body.postNumber,
  });

  newPost.save();

  res.send(newPost);
});

app.listen(3000, async () => {
  console.log("server started!");
  try {
    allPosts = await Post.find();
  } catch (err) {
    console.log("error loading posts...", err);
  }
});
