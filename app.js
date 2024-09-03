const express = require("express");
const connectToDb = require("./config/connectToDb");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const hpp = require("hpp");
const { notFound, errorHandler } = require("./middlewares/error");
const cors = require("cors");
require("dotenv").config();

// Conection To DB
connectToDb();

// Init App
const app = express();

// Security (Helmet)
app.use(helmet());

// Prevent http param pollution
app.use(hpp());

// Prevent XSS attacks
app.use(xss());

// Rate Limiting
app.use(
  rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 200,
  })
);

//Middleware

app.use(express.json()); // this function let the express know the json file which send from the client

// cors policy
app.use(cors({
  origin: "https://blog-front-end-ten.vercel.app"
}));

// routes
app.use("/api/auth", require("./routes/authRoute"));
app.use("/api/users", require("./routes/usersRoute"));
app.use("/api/posts", require("./routes/postsRoute"));
app.use("/api/comments", require("./routes/commentsRoute"));
app.use("/api/categories", require("./routes/categoriesRoute"));
app.use("/api/password", require("./routes/passwordRoute"));



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
