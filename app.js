const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const _ = require("lodash");

const homeStartingContent =
  "We are thrilled to welcome you to our vibrant blog community! Whether you're a passionate writer, an avid reader, or simply someone seeking valuable insights and inspiration, this is the perfect place for you. Our blog website web app is designed to be a platform where knowledge, ideas, and stories converge. Here, you will find a diverse range of topics covering everything from technology and science to travel, lifestyle, and personal growth. Be prepared to embark on a journey of discovery and enrichment. With each article you read, we hope to inspire, educate, and entertain you. Our goal is to create an environment where you can learn, connect, and leave feeling uplifted and empowered. a warm welcome to our blog website web app. Once again, we are delighted to have you on board!";
const aboutContent =
  "Our blog website web app is designed to be a platform where knowledge, ideas, and stories converge. Here, you will find a diverse range of topics covering everything from technology and science to travel, lifestyle, and personal growth. Our dedicated team of writers and contributors have poured their hearts and minds into crafting engaging and informative content just for you. We believe in the power of sharing and the strength of connections. Our blog community is not just about consuming content; it's about building relationships, sparking discussions, and nurturing a sense of belonging. We encourage you to actively participate by leaving comments, asking questions, and sharing your own thoughts and experiences.";
const contactContent =
  "Join us in this exciting venture of knowledge sharing, storytelling, and personal growth. It's your time to explore a world of captivating articles, insightful discussions, and endless inspiration on My Blog.";

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const connectDB = async function () {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/blogs");
    console.log("Connected to MongoDB!");
  } catch (err) {
    console.log(err);
  }
};

connectDB().then(() => {
  app.listen(3000, function () {
    console.log("Server started on port 3000");
  });
});

const blogsSchema = new mongoose.Schema({
  title: String,
  content: String,
});

const Blog = mongoose.model("Blog", blogsSchema);

// -------------------------POST ROUTES---------------------------------------

// Render all the blogs in DB and startingContent at home route.
app.get("/", async (req, res) => {
  const foundBlogs = await Blog.find({});
  // console.log(foundBlogs);
  res.render("home", {
    startingContent: homeStartingContent,
    posts: foundBlogs,
  });
});

app.get("/compose", (req, res) => {
  res.render("compose");
});

app.get("/about", (req, res) => {
  res.render("about", { aboutContent: aboutContent });
});

app.get("/contact", (req, res) => {
  res.render("contact", { contactContent: contactContent });
});

// Create a dynamic route using post._id;
app.get("/posts/:postId", async (req, res) => {
  const requestedId = req.params.postId;
  const foundPost = await Blog.findOne({ _id: requestedId }).exec();
  if (foundPost) {
    res.render("post", { post: foundPost });
  } else {
    res.redirect("/");
  }
});

// Create a dynamic route that links to each post using :postName.
// app.get("/posts/:postName", async (req, res) => {
//   const requestedTitle = _.capitalize(req.params.postName);
//   console.log(requestedTitle);
//   const foundPost = await Blog.findOne({ title: requestedTitle }).exec();
//   if (foundPost) {
//     res.render("post", { post: foundPost });
//   } else {
//     res.redirect("/");
//   }
// });

// -------------------------POST ROUTES---------------------------------------

app.post("/", (req, res) => {
  res.render("home");
});

// Add new blog if it's not already existed in the blogs array.
app.post("/compose", async (req, res) => {
  const blogTitle = _.capitalize(req.body.postTitle);
  const blogBody = req.body.postBody;
  const addBlog = new Blog({
    title: blogTitle,
    content: blogBody,
  });
  try {
    const foundPost = await Blog.findOne({
      title: blogTitle,
      body: blogBody,
    }).exec();
    if (!foundPost) {
      addBlog.save();
    }
    res.redirect("/");
  } catch {
    (err) => {
      console.log("Failed to add new blog post: " + err);
    };
  }
});
