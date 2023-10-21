const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

const cors = require("cors");

// Middleware========Start

// for taking
app.use(cors());
// for posting
app.use(express.json());

// Middleware========End

// MongoDB

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.49jhv2u.mongodb.net/?retryWrites=true&w=majority`;

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
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const carCollection = client.db("carsDB").collection("cars");
    const cartCollection = client.db("carsDB").collection("carts")
    const userCollection = client.db("carsDB").collection("users");

    // Cars Collection Data

    app.post("/cars", async (req, res) => {
      const car = req.body;
      console.log(car);
      const result = await carCollection.insertOne(car);
      res.send(result);
    });

    app.get("/cars", async (req, res) => {
      const cursor = carCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // R = Read Specific Data API
    app.get("/cars/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      console.log(query);
      const car = await carCollection.findOne(query);
      res.send(car);
    });

    //  Update API

    app.put("/cars/:id", async (req, res) => {
      const id = req.params.id;
      const car = req.body;
      console.log(id);

      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedCar = {
        $set: {
          brand: car.brand,
          image: car.image,
          model: car.model,
          type: car.type,
          price: car.price,
          ratings: car.ratings,
          description: car.description,
        },
      };
      const result = await carCollection.updateOne(filter, updatedCar, options);
      res.send(result);
    });

    // Cart Collection Data
    // Cart Collection Data
    // Cart Collection Data

    app.post("/carts", async (req, res) => {
      const cart = req.body;    
      const result = await cartCollection.insertOne(cart);
      res.send(result);
    });

    app.get("/carts", async (req, res) => {
      const cursor = cartCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // R = Read Specific Data API
    app.get("/carts/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      console.log(query);
      const cart = await cartCollection.findOne(query);
      res.send(cart);
    }); 


    // D = Delete Data
    app.delete('/carts/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await cartCollection.deleteOne(query);
      res.send(result)
  })



    // User Collection Data
    // User Collection Data
    // User Collection Data
    // User Collection Data

    app.post("/users", async (req, res) => {
      const user = req.body;    
      const result = await userCollection.insertOne(user);
      res.send(result);
    });

    app.get("/users", async (req, res) => {
      const cursor = userCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // R = Read Specific Data API
    app.get("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      console.log(query);
      const user = await carCollection.findOne(query);
      res.send(user);
    }); 


    // D = Delete Data
    app.delete('/users/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await userCollection.deleteOne(query);
      res.send(result)
  })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World My First API with Server");
});

app.listen(port);
