const express = require('express');
const cors = require('cors');
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require("dotenv").config();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mvfiisx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const cattegoryCollection = client.db("SportStoreDB").collection("categories");
    const allEquipmentCollection = client.db("SportStoreDB").collection("AllItems");

    app.get("/categories", async(req, res) => {
        const cursor = cattegoryCollection.find();
        const result = await cursor.toArray();
        res.send(result);
    })

    app.get("/allItems", async(req, res) => {
      const cursor = allEquipmentCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.post("/allItems", async(req, res) => {
        const newItem = req.body;
        const result = await allEquipmentCollection.insertOne(newItem);
        res.send(result);
    })

    app.get("/allItems/category/:category", async(req, res) => {
      const category = req.params.category;
      const query = {category: category}
      const result = await allEquipmentCollection.find(query).toArray();
      res.send(result);
    })

    app.get("/allItems/author/:author", async(req, res) => {
      const author = req.params.author; 
      const query = {author: author};
      const result = await allEquipmentCollection.find(query).toArray()
      res.send(result);
    })
    
    app.get("/allItems/id/:id", async(req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await allEquipmentCollection.findOne(query);
      res.send(result);
    })

    app.put("/allItems/id/:id", async(req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const updatedEquimemt = req.body;
      const options = {upsert : true};
      const equipment = {
        $set: {
          name: updatedEquimemt.name,
          price: updatedEquimemt.price,
          description: updatedEquimemt.description,
          brand: updatedEquimemt.brand,
          image: updatedEquimemt.image,
          rating: updatedEquimemt.rating,
          stock: updatedEquimemt.stock,
          category: updatedEquimemt.category,
        }
      }
      const result = await allEquipmentCollection.updateOne(query, equipment, options);
      res.send(result);
    });

    app.delete("/allItems/id/:id", async(req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await allEquipmentCollection.deleteOne(query);
      res.send(result);
    })
    
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get("/", (req, res) => {
    res.send("the sport shop server is rnning");
})

app.listen(port, () => {
    console.log(`http://localhost:${port}/`)
});