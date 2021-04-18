const express = require("express");
const cors = require("cors");
const fs = require("fs");
const fileUpload = require("express-fileupload");
const ObjectID = require("mongodb").ObjectID;
const MongoClient = require("mongodb").MongoClient;
require("dotenv").config();

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.8tihy.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static("service"));
app.use(fileUpload());

const port = 5000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const serviceCollection = client.db("carRepair").collection("services");
  const reviewCollection = client.db("carRepair").collection("review");
  const ordersCollection = client.db("carRepair").collection("order");
  const adminCollection = client.db("carRepair").collection("admin");
  app.post("/addAService", (req, res) => {
    const file = req.files.file;
    const name = req.body.name;
    const price = req.body.price;
    const description = req.body.description;
      const newImg = req.files.file.data;
      const encImg = newImg.toString("base64");

      var image = {
        contentType: file.mimetype,
        size: file.size,
        img: Buffer.from(encImg, "base64"),
      };
      serviceCollection
        .insertOne({ name, price, description, image })
        .then((result) => {
            res.send(result.insertedCount > 0);
        });
  });

  app.get("/services", (req, res) => {
    serviceCollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });

  app.get("/service/:id", (req, res) => {
    const id = ObjectID(req.params.id);
    serviceCollection.find({ _id: id }).toArray((err, documents) => {
      res.send(documents[0]);
    });
  });

  app.post("/addAReview", (req, res) => {
    const name = req.body.name;
    const designation = req.body.designation;
    const description = req.body.description;
    console.log(designation, description, name);
    reviewCollection
      .insertOne({ designation, description, name })
      .then((result) => {
        res.send(result.insertedCount > 0);
      });
  });

  app.get("/reviews", (req, res) => {
    reviewCollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });

  app.get("/manageServices", (req, res) => {
    serviceCollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });

  app.delete("/deleteService/:id", (req, res) => {
    serviceCollection
      .deleteOne({ _id: ObjectID(req.params.id) })
      .then((result) => {
        console.log(result);
      });
  });

  app.post("/addOrder", (req, res) => {
    const order = req.body;
    ordersCollection.insertOne(order).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });

  app.get("/orders", (req, res) => {
    ordersCollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });

  app.get("/orderList", (req, res) => {
    ordersCollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });

  app.post("/addAdmin", (req, res) => {
    const email = req.body.email;
    console.log(email);
    adminCollection.insertOne({ email }).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });
});

app.listen(process.env.PORT || port)
