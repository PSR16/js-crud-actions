var express = require("express");
var router = express.Router();

module.exports = function (db) {
  router.get("/products", (req, res) => {
    res.send(db.get("products").value()); //use response object 
  });
  return router;
};
