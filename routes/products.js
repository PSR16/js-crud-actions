var express = require("express");
var router = express.Router();
const qs = require('qs');

module.exports = function (db) {
  router.route("/products")
  .get((req, res) => { //GET, reading
    res.send(db.get("products").value()); //use response object to send data back
  })
  .post((req, res) => {
    const newProduct = req.body;    //get info from request

    //used for adding data to DB, need to validate data first
    const errors = [];
    if (!newProduct.name) {
      errors.push({
        field: "name",
        error: "required",
        message: "Name is required"
      });
    }

    if (newProduct.price && isNaN(Number(newProduct.price))) {
      errors.push({
        field: "price",
        error: "type",
        message: "Price must be a number"
      });
    }

    if (newProduct.name > 25) {
      errors.push({
        field: "name",
        error: "length",
        message: "Name cannot be longer than 25 characters"
      });
    }

    const allowedColors = [
      "red",
      "blue",
      "orange",
      "black",
      "brown",
      "",
      null,
      undefined
    ]

    if (!allowedColors.some((_) => _ === newProduct.color)) {
      errors.push({
        field: "color",
        error: "allowedValue",
        message: "Must be one of the following colors: red, blue, orange, black, brown"
      });
    }

    if (errors.length) {
      res.status(422).send(errors);
    } else {
      res.send(db.get("products").insert(newProduct).write());  //saving product to file, need to call write() after insert()
    }

  });

  //move search above the id
  router.route('/products/search').get((req, res) => {
    const keywords = req.query.keywords;
    const result = db.get("products").filter(_ => {
      //create dataset to search on
      const fullText = _.description + _.name + _.color;
      return fullText.indexOf(keywords) !== -1;
    });

    res.send(result);
  });

  router.route('/products/detailSearch').get((req, res) => {
    const query = qs.parse(req.query);
    const results = db.get("products").filter(_ => {
      return Object.keys(query).reduce((found, key) => {
        const obj = query[key]; //get obj of key
        switch (obj.op) {
          case "lt":
            found = found && _[key] < obj.val; //compare to value passed in
            break;
          case "eq": 
            found = found && _[key] == obj.val; //compare to value passed in
            break;
          default:
            found = found && _[key].indexOf(obj.val) !== -1; //compare to value passed in
            break;
        }
        
        return found;
      }, true); //default found to be true
    }); 

    res.send(results);
  });

  router.patch("/products/:id", (req, res) => {
    res.send(db.get("products").find({id: req.params.id}).assign(req.body).write());  //find object by id and update then write()
  });

  router.delete("/products/:id", (req, res) => {
    db.get("products").remove({id: req.params.id}).write();  //delete object, no res.send() bc object is deleted so nothing to send
    res.status(204).send();
  });

  router.get("/products/:id", (req, res) => {
    const result = db.get("products").find({id: req.params.id}).value();  //find object by id
    if (result) {
      res.send(result);
    } else {
      res.status(404).send();
    }
  });

  return router;
};
