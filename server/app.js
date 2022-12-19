const express = require("express");
const app = express();
const configRoutes = require("./routes");
const static = express.static(__dirname + "/public");
//const redis = require("redis");
//const client = redis.createClient();
const cors = require("cors");

//client.connect().then(() => {});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

configRoutes(app);
app.listen(3001, async () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3001");
});
