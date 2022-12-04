const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const cors = require("cors");
const { query } = require("express");

// middleware
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("<h1>todo list server is running</h1>");
});

// mongodb config
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.jjvalws.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const todoCollections = client.db("todoList").collection("todos");

    // add a todo to db
    app.post("/todo", async (req, res) => {
      const todo = req.body;

      const result = await todoCollections.insertOne(todo);

      res.send(result);
    });

    // Get all User Todo By User Email
    app.get("/todo", async (req, res) => {
      const userEmail = req.query.email;
      const query = { email: userEmail };

      const allTodo = await todoCollections.find(query).toArray();
      res.send(allTodo);
    });

    // Get Single Todo by Todo ID
    app.get("/todo/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const singleTodo = await todoCollections.findOne(query);
      res.send(singleTodo);
    });

    // Update Todo Status by ID
    app.put("/todo/:id", async (req, res) => {
      const id = req.params.id;
      const updatedDoc = { $set: { isComplete: true } };
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };

      const result = await todoCollections.updateOne(
        filter,
        updatedDoc,
        options
      );
      res.send(result);
    });

    // Delete Single Todo by ID
    app.delete("/todo/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const result = await todoCollections.deleteOne(filter);
      res.send(result);
    });
  } finally {
  }
}

run().catch(err => console.log(err));

app.listen(port, () => {
  console.log("server is running");
});
