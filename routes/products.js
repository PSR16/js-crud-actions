var express = require("express");
var router = express.Router();

module.exports = function (db) {
  router.route("/products")
  .get((req, res) => { //GET, reading
    res.send(db.get("products").value()); //use response object to send data back
  })
  .post((req, res) => {
    const newProduct = req.body;    //get info from request
    res.send(db.get("products").insert(newProduct).write());  //saving product to file, need to call write() after insert()
  });

  router.patch("/products/:id", (req, res) => {
    res.send(db.get("products").find({id: req.params.id}).assign(req.body).write());  //find object by id and update then write()
  });

  router.delete("/products/:id", (req, res) => {
    db.get("products").remove({id: req.params.id}).write();  //delete object, no res.send() bc object is deleted so nothing to send
    res.status(204).send();
  });

  router.get("/products/:id", (req, res) => {
    res.send(db.get("products").find({id: req.params.id}).value());  //find object by id
  });

  return router;
};
