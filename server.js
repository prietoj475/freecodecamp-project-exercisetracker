const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const shortId = require('shortid');
require('dotenv').config()

// moongose setup
const mySecret = process.env['MONGODB_KEY']
mongoose.connect(mySecret, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const Schema = mongoose.Schema;
const usersSchema = new Schema({
  _id: {type: String, default: shortId.generate},
  username: String,
  count: Number,
  log: [
    {
      description: String,
      duration: Number,
      date: String
    }
  ] 
});
const Users = mongoose.model("Users", usersSchema);

// middelware
app.use(bodyParser.urlencoded({extended: false}));
app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

//api
app.route('/api/users')
  .get((req,res) => {
    Users.find({}, "username")
      .then(users => res.json(users))
      .catch(err => next(err));
  })
  .post((req,res) => {
    var input_name = req.body.username;
    Users.findOne({username: input_name}, (err, model) => {
      if (err) return console.log(err);
      if (!model) {
        model = new Users({username: input_name, count: 0});
        model.save((err,data) => {
          if (err) return console.log(err);
          res.json({
            username: model.username,
            _id: model._id
          });
        });
      }
      else {
        res.json({
            username: model.username,
            _id: model._id
        });
      };
    });
  });

app.route('/api/users/:_id/exercises')
  .post((req,res) => {
    var date = req.body.date;
    if (!date) {
      date = new Date();
    };
    date = new Date(date).toDateString();

    // // new exerciese creation
    Users.findOne({_id: req.params._id}, (err,user) => {
      if (err) return console.log(err);
      if (user) {
        user.count++;
        user.log.push({
          description: req.body.description,
          duration: parseInt(req.body.duration),
          date: date
        });
        user.save();
        res.json({
          username: user.username,
          description: req.body.description,
          duration: parseInt(req.body.duration),
          _id: req.params._id,
          date: date
        });
      }
      else {
        console.log("not working");
      };
    });
});

app.route('/api/users/:_id/logs')
  .get((req,res) => {
    Users.findOne({_id: req.params._id}, {__v: 0, log:{_id: 0}}, (err, user) => {
      if (err) return console.log("findOne exercise error");
      
      var fromDate = req.query.from;
      var toDate = req.query.to;

      if (!fromDate) {
        fromDate = new Date(0);
      }
      if (!toDate) {
        toDate = new Date();
      }

      fromDate = new Date(fromDate).getTime();
      toDate = new Date(toDate).getTime();
      
      var logFilter = user.log.filter(logs => {
        var logDate = new Date(logs.date).getTime();
        return logDate >= fromDate && logDate <= toDate;
      });
      if (req.query.limit) {logFilter = logFilter.slice(0,req.query.limit);};

      res.json({
        username: user.username,
        count: logFilter.length,
        _id: user._id,
        log: logFilter
      });
    
    });
  });




const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
