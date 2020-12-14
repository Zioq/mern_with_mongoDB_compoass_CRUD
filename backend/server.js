const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID;
const app = express();

//setting for cors and body parser
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// the the local mongoDB compass url
const url = "mongodb://localhost:27017";



//Get the users info
app.get("/api/users", (req, res) => {
  MongoClient.connect(url, (err, db) => {
    if (err) throw err;

    // Make dbo with `database name`
    const dbo = db.db("Exercise");

    //In the database, find collection with `.collection("COLLECTION_NAME")`
    dbo
      .collection("user")
      .find()
      .toArray((error, result) => {
        if (error) res.status(400).send("Error", error);
        else {
          //Change it to the JSON format
          res.status(200).send(JSON.stringify(result));
        }
      });
  });
});

//Post user info
app.post("/api/user", (req, res) => {
  console.log(req.body);
  const username = req.body.username;

  const myUser = {
    username: username,
  };

  //Connect DB and post data object
  MongoClient.connect(url, (err, db) => {
    if (err) throw err;

    const dbo = db.db("Exercise");
    dbo.collection("user").insertOne(myUser, (error, result) => {
      if (error) res.status(400).send("Error", error);
      else {
        res.status(200).json("User Added");
        db.close();
      }
    });
  });
});

// Get the exercises info
app.get("/api/exercises", (req, res) => {
  console.log("Check empty search term");
  MongoClient.connect(url, (err, db) => {
    if (err) throw err;

    const dbo = db.db("Exercise");

    dbo
      .collection("exercise")
      .find()
      .toArray((err, result) => {
        if (err) res.status(400).send("Error", err);
        else {
          //Change it to the JSON format
          res.status(200).send(JSON.stringify(result));
        }
      });
  });
});

// Post exercise info
app.post("/api/exercise/add", (req, res) => {
  const username = req.body.username;
  const description = req.body.description;
  const duration = req.body.duration;
  const date = Date.parse(req.body.date);

  const newExercise = {
    username: username,
    description: description,
    duration: duration,
    date: date,
  };

  //Connect DB and post data object
  MongoClient.connect(url, (err, db) => {
    if (err) throw err;

    const dbo = db.db("Exercise");
    dbo.collection("exercise").insertOne(newExercise, (error, result) => {
      if (error) res.status(400).send("Error", error);
      else {
        res.status(200).json("New exercise Added");
        db.close();
      }
    });
  });
});

// Get one exercise info using a _id
app.get("/api/exercise/:id", (req, res) => {
  const id = req.params.id;
  const objectId = ObjectId(id);

  MongoClient.connect(url, (err, db) => {
    if (err) throw err;

    const dbo = db.db("Exercise");
    dbo
      .collection("exercise")
      .find({ _id: objectId })
      .toArray((err, result) => {
        if (err) res.status(400).send("Error", err);
        else {
          //Change it to the JSON format
          res.status(200).send(JSON.stringify(result));
        }
      });
  });
});

// Update exercise info
app.put("/api/exercise/update/:id", (req, res) => {
  console.log(req.body);
  const id = req.params.id;
  const objectId = ObjectId(id);

  const username = req.body.username;
  const description = req.body.description;
  const duration = req.body.duration;
  const date = Date.parse(req.body.date);

  const where = { _id: objectId };

  const newExercise = {
    $set: {
      username: username,
      description: description,
      duration: duration,
      date: date,
    },
  };

  MongoClient.connect(url, (err, db) => {
    if (err) throw err;

    const dbo = db.db("Exercise");
    dbo
      .collection("exercise")
      .updateOne(where, newExercise, (error, result) => {
        if (error) res.status(400).send("Error", error);
        else {
          if (result.modifiedCount === 1) {
            res.status(200).json("Exercise updated");
            db.close();
          }
        }
      });
  });
});

//Delete Exercise info
app.delete("/api/exercise/delete/:id", (req, res) => {
  const id = req.params.id;
  const objectId = ObjectId(id);

  const myObj = { _id: objectId };

  MongoClient.connect(url, (err, db) => {
    if (err) throw err;

    const dbo = db.db("Exercise");
    dbo.collection("exercise").deleteOne(myObj, (error, result) => {
      if (error) {
        res.send("Error", error);
        return;
      }
      if (result.deletedCount === 1) res.send("Record deleted successfully");
      db.close();
    });
  });
});

app.post("/api/search",(req,res)=> {

    const term = req.body.searchTerm;

    console.log(term); // Here I can check the request coming well
    if(term) {
      MongoClient.connect(url,(err,db)=> {
        if(err) throw err;

        const dbo = db.db("Exercise");
        var collection = dbo.collection('exercise');
        //console.log(collection);
        collection.indexExists('username').then(function(indexExists){
            if(!indexExists)
                collection.createIndexes( { username: 'text'} );
                console.log("Set the index as username");
        }).then(function(result){
            collection.find({
                $text: {
                    $search: term,
                    $caseSensitive: false
                }
            }).toArray((err,result)=> {
              if (err) res.status(400).send("Error", err);
              else {
                //Change it to the JSON format
                res.status(200).send(JSON.stringify(result));
              }
            });
        });
    });
    } else {
        MongoClient.connect(url,(err,db)=> {
          if(err) throw err;

          const dbo = db.db("Exercise");
          dbo.collection("exercise")
              .find()
              .toArray((err, result) => {
                if (err) res.status(400).send("Error", err);
                else {
                  //Change it to the JSON format
                  res.status(200).send(JSON.stringify(result));
                }
              });
        });
    }
    
});

app.post("/api/imgdata",(req,res)=> {
  console.log(req.body);

  const dataDummy = req.body;

  MongoClient.connect(url,(err,db) => {
    if(err) throw err;

    const dbo = db.db("Apidata");
    dbo.collection("rawdata").insertMany(dataDummy,(err,result) => {
      if (err) res.status(400).send("Error", err);
      else {
        res.status(200).json("Image Added");
        db.close();
      }
    })
  })

})

// Listening the port
const port = 5000;
app.listen(port, () => {
  console.log(`The server is listening on port ${port}`);
});
