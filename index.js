const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const port = process.env.PORT || 5000;

const app = express();
const corsOptions = {
  origin: ["http://localhost:5173"],
};

app.use(cors(corsOptions));
app.use(express.json());

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

    // get all blogs
    app.get("/blogs", async (req, res) => {
      const result = await blogsCollections.find().toArray();
      res.send(result);
    });
    // post blogs
    app.post("/blog", async (req, res) => {
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
    app.put("/blog/:id", async (req, res) => {
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
