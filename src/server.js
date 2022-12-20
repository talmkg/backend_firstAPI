//const express = require("express") <-- OLD SYNTAX (we don't want to use old stuff)
import express from "express"; // NEW SYNTAX (you can use this only if type:"module" is added on package.json)
import listEndpoints from "express-list-endpoints";
import usersRouter from "./api/users/index.js";

const server = express();
const port = 3001;

server.use(express.json()); // If you don't add this line BEFORE the endpoints, all requests' bodies will be UNDEFINED

// ************************************* ENDPOINTS ******************************************
server.use("/authors", usersRouter); // /users will be the prefix that all the endpoints in the usersRouter will have

server.listen(port, () => {
  console.table(listEndpoints(server));
  console.log(`Server is running on port ${port}`);
});
