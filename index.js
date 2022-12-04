const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();
const cors = require("cors");

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
  } finally {

  }
}

run().catch(err => console.log(err));

app.listen(port, () => {
  console.log("server is running");
});
