const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { MongoClient, ServerApiVersion } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;
const ObjectId = require("mongodb").ObjectId;

app.get("/", (req, res) => {
  res.send("I love u and not love u");
});
require("dotenv").config();

//DB User - Nisharga , DB Pass - aDj8QSwONIMYsWtK
//middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

const users = [
  { id: 1, name: "nisharga", email: "kabir@gmail.com" },
  { id: 2, name: "jannati", email: "jannati@gmail.com" },
  { id: 3, name: "sabina", email: "bisab@gmail.com" },
  { id: 4, name: "nannu", email: "nannu@gmail.com" },
];

const uri = `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@cluster0.qemdz.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const dbCollection = client
      .db("CreativeAgency")
      .collection("CreativeAgencyReview");

    app.get("/update/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const cursor = dbCollection.find(query);
      const users = await cursor.toArray();
      res.send(users);
    });

    app.put("/update/:id", async (req, res) => {
      const data = req.body;
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const result = await dbCollection.updateOne(
        filter,
        { $set: { name: data.name, email: data.email } },
        options
      );
      res.send(data);
    });

    // order collection api
    app.get("/order", async (req, res) => {
      const email2 = req.query.email;
      console.log(email2);
      const query = { email: email2 };
      const cursor = dbCollection.find(query);
      const users = await cursor.toArray();
      res.send(users);
    });

    app.get("/user", async (req, res) => {
      const query = {};
      const cursor = dbCollection.find(query);
      const users = await cursor.toArray();
      res.send(users);
    });

    app.get("/user/email", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const cursor = dbCollection.findOne(query);
      const user = await cursor.toArray();
      res.send(user);
    });

    app.post("/user", async (req, res) => {
      const dataGet = req.body;
      console.log("Data received", dataGet);
      const result = await dbCollection.insertOne(dataGet);
      res.send("data paisi res e");
      console.log(result, "gese data all");
    });

    app.delete("/user/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await dbCollection.deleteOne(query);
      if (result.deletedCount === 1) {
        console.log("Successfully deleted one document.");
      } else {
        console.log("No documents matched the query. Deleted 0 documents.");
      }
      res.send("DELETED");
    });
    //       const doc = {
    //          title: "new Record of a Shriveled Datum",
    //          content: "new No bytes, no problem. Just insert a document, in MongoDB",
    //        }
    //    const result = await dbCollection.insertOne(doc);
    //        console.log("DAta geses")
  } finally {
    //        await client.close()
  }
}
run().catch(console.dir);

app.get("/users/:id", (req, res) => {
  const id = req.params.id;
  const user = users.find((u) => u.id == id);
  res.send(user);
});

app.listen(port, () => {
  console.log("port listen");
});
