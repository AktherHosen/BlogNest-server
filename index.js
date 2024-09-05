const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const jwt = require("jsonwebtoken");
const cookieparser = require("cookie-parser");
const port = process.env.PORT || 5000;

const app = express();
const corsOptions = {
  origin: ["http://localhost:5173"],
  credentials: true,
  operationSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieparser());

// verify middleware
const verifyToken = (req, res, next) => {
  const token = req.cookies?.token;
  if (!token) return res.status(401).send({ message: "unauthorized access." });
  if (token) {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).send({ message: "unauthorized access." });
      }
      req.user = decoded;
      next();
    });
  }
};

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bmhyihx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // all api are herec
    const blogsCollections = client.db("blognest").collection("blogs");
    const commentsColllections = client.db("blognest").collection("comments");
    const wishlistColllections = client.db("blognest").collection("wishlists");

    // jwt
    app.post("/jwt", async (req, res) => {
      const user = req.body;
      const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "30d",
      });
      res
        .cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        })
        .send({ success: true });
    });

    // delete token on logout
    app.get("/logout", (req, res) => {
      res
        .clearCookie("token", {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
          maxAge: 0,
        })
        .send({ success: true });
    });

    // get all blogs
    app.get("/blogs", async (req, res) => {
      const result = await blogsCollections.find().toArray();
      res.send(result);
    });

    // post blogs
    app.post("/blog", verifyToken, async (req, res) => {
      const blogData = req.body;
      const result = await blogsCollections.insertOne(blogData);
      res.send(result);
    });

    // get single blog
    app.get("/blog/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await blogsCollections.findOne(query);
      res.send(result);
    });

    // update blog data
    app.put("/blog/:id", verifyToken, async (req, res) => {
      const id = req.params.id;
      const blogData = req.body;
      const query = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          ...blogData,
        },
      };
      const result = await blogsCollections.updateOne(
        query,
        updateDoc,
        options
      );
      res.send(result);
    });

    // delete blog
    app.delete("/blog/:id", verifyToken, async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await blogsCollections.deleteOne(query);
      res.send(result);
    });

    // get single blog comment
    app.get("/comments", async (req, res) => {
      const { blogId } = req.query;
      const comments = await commentsColllections.find({ blogId }).toArray();
      res.send(comments);
    });
    // post a comment
    app.post("/comment", async (req, res) => {
      const commentData = req.body;
      const result = await commentsColllections.insertOne(commentData);
      res.send(result);
    });

    // get current loggedin user wishlist
    app.get("/wishlist", verifyToken, async (req, res) => {
      const tokenEmail = req.user?.email;
      // console.log(tokenData);
      const email = req.query.email;
      if (tokenEmail !== email) {
        return res.status(403).send({ message: "forbidded access" });
      }
      const query = { wishListUserEmail: email };
      const result = await wishlistColllections.find(query).toArray();
      res.send(result);
    });

    // post wishlist
    app.post("/wishlist", verifyToken, async (req, res) => {
      const { blogId, wishListUserEmail, wishlistDate } = req.body;

      try {
        const query = { _id: new ObjectId(blogId) };
        const blog = await blogsCollections.findOne(query);

        if (!wishListUserEmail) {
          return res
            .status(401)
            .send({ error: "You must sign in to add to wishlist" });
        }

        if (!blog) {
          return res.status(404).send({ error: "Blog not found" });
        }
        const existingWishlistItem = await wishlistColllections.findOne({
          wishListUserEmail,
          blogId,
        });

        if (existingWishlistItem) {
          return res
            .status(409)
            .send({ error: "Blog is already in the wishlist" });
        }
        const wishListData = {
          blogId,
          wishListUserEmail,
          wishlistDate,
          blogTitle: blog.blogTitle,
          photo: blog.photo,
          email: blog.email,
          category: blog.category,
          shortDescription: blog.shortDescription,
          longDescription: blog.longDescription,
          postedDate: blog.postedDate,
          author: {
            name: blog.author?.name || "Unknown Author",
            photo: blog.author?.photo || "default-author-photo-url",
          },
        };
        const result = await wishlistColllections.insertOne(wishListData);
        res.status(201).send(result);
      } catch (error) {
        console.error("Failed to add blog to wishlist:", error);
        res.status(500).send({ error: "Failed to add blog to wishlist" });
      }
    });

    // delete wishlist
    app.delete("/wishlist/:id", verifyToken, async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await wishlistColllections.deleteOne(query);
      res.send(result);
    });

    //filter wise blog with search
    app.get("/all-blogs", async (req, res) => {
      const search = req.query.search || "";
      const filter = req.query.filter || "";
      // const filter = "Tech & Gadgets";
      // console.log(filter);
      let query = {};
      if (search) {
        query.blogTitle = { $regex: search, $options: "i" };
      }
      if (filter) query.category = filter;
      const result = await blogsCollections.find(query).toArray();
      res.send(result);
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("blog nest server is running");
});

app.listen(port, () => {
  console.log(`blog nest server is running on port ${port}`);
});
