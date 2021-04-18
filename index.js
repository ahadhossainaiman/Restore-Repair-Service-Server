const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const ObjectId = require('mongodb').ObjectID;
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());
const port = 5000;





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wirvw.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const servicesCollection = client.db("repair-services").collection("service");
  const feedbackCollection = client.db("repair-services").collection("feedback");
  const selectionCollection = client.db("repair-services").collection("selection");
  const adminCollection = client.db("repair-services").collection("admin");
  
  



  app.post("/admin", (req,res) => {
    const admin = req.body;
    adminCollection.insertOne(admin)
    .then(result =>{
      res.send(result.insertedCount > 0)
     })
  })


  app.get("/admin", (req,res) => {
    const admin = req.query.email;
    adminCollection.find({email: admin})
    .toArray((err,doc) => {
      if(doc.length > 0){
        res.send(true);
      }
      else{
        res.send(false);
      }
    })
  })

  app.get("/allOrders", (req,res) => {
    selectionCollection.find({})
    .toArray((err,document) => {
        res.send(document);
    })
  })


    app.get("/services", (req,res) => {
      servicesCollection.find({})
        .toArray((err,document) => {
          res.send(document);
         })
    })

    app.get("/userService/:id", (req,res) => {
      servicesCollection.find({_id: ObjectId(req.params.id)})
      .toArray((err,document) => {
          res.send(document[0]);
      })
  })


  app.delete('/deleteService/:id',(req,res) => {
    const id = ObjectId(req.params.id);
    servicesCollection.deleteOne({_id:id})
    .then(result => {
      res.send(result.insertedCount > 0);
      res.redirect('/manageService');
    })
  })


  app.get("/userService", (req,res) => {
    selectionCollection.find({email: req.query.email})
    .toArray((err,document) => {
        res.send(document);
    })
})


  app.post("/selectedService", (req,res) => {
    const services = req.body;
    selectionCollection.insertOne(services)
    .then(result =>{
        res.send(result.insertedCount > 0)
       })
})



    app.get("/feedback", (req,res) => {
      feedbackCollection.find({})
          .toArray((err,document) => {
              res.send(document);
          })
  })

    app.post("/yourfeedback", (req,res) => {
  const feedback = req.body;
  feedbackCollection.insertOne(feedback)
  .then(result =>{
        res.send(result.insertedCount > 0)
       })

})

  app.post("/addService", (req,res) => {
    const service = req.body;
    servicesCollection.insertOne(service)
    .then(result =>{
        res.send(result.insertedCount > 0)
    })
  })
 
});








app.get('/', (req, res) => {
  res.send('Hello World!')
  
})

app.listen(process.env.PORT || port);
