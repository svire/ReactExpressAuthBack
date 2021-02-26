const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();

var corsOptions = {
  origin: "http://localhost:3000",
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

require("./app/routes/auth.routes")(app);
require("./app/routes/user.routes")(app);

app.get("/", (req, res) => {
  res.json({message: "Welcc"});
});

const db = require("./app/models");
const Role = db.role;

/*
 force: true adds a DROP TABLE IF EXISTS before  trying to create the table - if  force,  existing tables will be overwritten.
*/
db.sequelize.sync({force: false}).then(() => {
  console.log("no drop");
});

/*
db.sequelize.sync({force: true}).then(() => {
  console.log("Drop and Resunc Db");
  initial();
});

function initial() {
  Role.create({
    id: 1,
    name: "user",
  });
  Role.create({
    id: 2,
    name: "moderator",
  });

  Role.create({
    id: 3,
    name: "admin",
  });
}

*/

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
