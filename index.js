const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const ObjectId = require("mongodb").ObjectId;
const { MongoClient, ServerApiVersion } = require("mongodb");
const port = process.env.PORT || 5000;

//TODO: add middleware
app.use(cors());
app.use(express.json());



// TODO:mongodb
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.SECRET_KEY}@cluster0.rkyae.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

// TODO:CRUD Operation:
async function run() {
  try {
    await client.connect();
    const todoCollection = client.db("todoList").collection("myTodos");


    // TODO:get All Bike
    app.get("/myTodoList", async (req, res) => {
      const query = {};
      const cursor = todoCollection.find(query);
      const todoLists = await cursor.toArray();
      res.send(todoLists);
    });


    // TODO: get a bike:
    app.get("/inventory/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await bikeCollection.findOne(query);
      res.send(result);
    });


    //TODO: delate a bike
    app.delete("/inventory/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: ObjectId(id) };
      const result = await bikeCollection.deleteOne(query);
      res.send(result);
    });



    //  TODO:Update a quantity:
    app.put("/inventory/:id", async (req, res) => {
      const id = req.params.id;
      const updatedQuantity = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          quantity: updatedQuantity.newQuantity,
        },
      };
      const result = await bikeCollection.updateOne(
        filter,
        updatedDoc,
        options
      );
      res.send(result);
    });



    // TODO: Add a new bike
    app.post("/myTodoList", async (req, res) => {
      const newTodo = req.body;
      console.log("adding a new todolist", newTodo);
      const result = await todoCollection.insertOne(newTodo);
      res.send(result);
    });



    // TODO:get All newBike ..  verifyJWT,
    app.get("/inventory", async (req, res) => {
      const decodedEmail = req.decoded.email;
      console.log("decoded email", decodedEmail);
      const authHeader = req.headers.authorization;
      console.log(authHeader);
      const email = req.query.email;
      console.dir(email);
        const query = { email: email };
        const cursor = bikeCollection.filter(query);
        const bikes = await cursor.toArray();
        res.send(bikes);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Running My TodoList Server");
});

app.listen(port, () => {
  console.log("todoList-server-side is running :", port);
});
