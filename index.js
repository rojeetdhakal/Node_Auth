const express = require("express");
const app = express();
const bodyParser=require('body-parser')
const mongoose = require("mongoose");
const dotenv=require('dotenv')
dotenv.config()
//importing Route
const authRoute = require("./route/auth");
const postRoute=require('./route/posts')
const port = 3000;
// Route Middleware
app.use("/api/user", authRoute);
app.use('/api/posts',postRoute)
//connect to db
mongoose
  .connect(process.env.DB_CONNECT)
  .then((result) => {
    app.listen(port, () =>
      console.log(`Database is connected and server is  on port http://localhost:${port}`)
    );
  })
  .catch((err) => {
    console.log(err);
  });
  // middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => res.send("Hello World!"));
