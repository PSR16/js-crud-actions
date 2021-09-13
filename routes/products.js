var express = require("express");
var router = express.Router();

module.exports = function (db) {
  router.get("/products", (req, res) => { //GET, reading
    res.send(db.get("products").value()); //use response object to send data back
  });

  router.post("/products", (req, res) => {
    const newProduct = req.body;    //get info from request
    res.send(db.get("products").insert(newProduct).write());  //saving product to file, need to call write() after insert()
  });
  return router;
};
