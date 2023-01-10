//const express = require("express") <-- OLD SYNTAX (we don't want to use old stuff)
import express from "express"; // NEW SYNTAX (you can use this only if type:"module" is added on package.json)
import listEndpoints from "express-list-endpoints";
import blogsRouter from "./api/blogposts/index.js";
import usersRouter from "./api/users/index.js";
import cors from "cors";
import path from "path";
import multer from "multer";
import productsRouter from "./api/products/index.js";
import reviewsRouter from "./api/reviews/index.js";
import {
  genericErrorHandler,
  notFoundHandler,
  badRequestHandler,
  unauthorizedHandler,
} from "./errorHandlers.js";
const server = express();
const port = 3001;
//
// ***************** MIDDLEWARES ********************

// const loggerMiddleware = (req, res, next) => {
//   // console.log(req.headers)
//   console.log(
//     `Request method ${req.method} -- url ${req.url} -- ${new Date()}`
//   );
//   req.user = "Dan";
//   next(); // gives the control to whom is coming next (either another middleware or route handler)
// };
//
// server.use(loggerMiddleware);
server.use(cors());
server.use(express.json()); // If you don't add this line BEFORE the endpoints, all requests' bodies will be UNDEFINED
// ****************** ENDPOINTS *********************
server.use("/products", productsRouter); // All users related endpoints will share the same /users prefix in their urls
server.use("/reviews", reviewsRouter);
// IMAGES START
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    console.log(file);
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });
server.set("view engine", "ejs");
//IMAGES END
//
//
//
// METHODS
server.get("/upload", (req, res) => {
  res.render("upload");
});
//posting here
server.post("/upload", upload.single("image"), (req, res) => {
  res.send("Image uploaded!");
});

// // ************************************* ENDPOINTS ******************************************
server.use("/authors", usersRouter); // /users will be the prefix that all the endpoints in the usersRouter will have
server.use("/blogposts", blogsRouter);
server.use(badRequestHandler); // 400
server.use(unauthorizedHandler); // 401
server.use(notFoundHandler); // 404
server.use(genericErrorHandler); // 500
server.listen(port, () => {
  console.table(listEndpoints(server));
  console.log(`Server is running on port ${port}`);
});
