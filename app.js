const express = require("express");
const connectToDb = require("./config/connectToDb");
const { notFound, errorHandler } = require("./middlewares/error");
require("dotenv").config();

// Conection To DB
connectToDb();

// Init App
const app = express();

//Middleware

app.use(express.json()); // this function let the express know the json file which send from the client


// routes
app.use("/api/auth", require("./routes/authRoute"));
app.use("/api/users", require("./routes/usersRoute"));
app.use("/api/posts", require("./routes/postsRoute"));
app.use("/api/comments", require("./routes/commentsRoute"));
app.use("/api/categories", require("./routes/categoriesRoute"));



// Error Handler middlware
app.use(notFound);
app.use(errorHandler);

// Running The server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () =>
  console.log(
    `server is running in ${process.env.NODE_ENV} mode on port ${PORT}`
  )
);
