const mongo = require('mongodb');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://nayera:1234@cluster0-dwvui.mongodb.net";

exports.getTodaysWinner = function(req, res) {
    MongoClient.connect(url, function(err, db) {
        if (err) //connection error
        {
          return res.status(500).send("Weak Internet Connection");
        } 
        var dbo = db.db("Fattarny");
        dbo.collection("winnerRestaurants").findOne({date: req.params.date}, function(err, winner) {
          if (err)
          {
            res.status(500).send("Weak Internet Connection");
          } 
          if(winner != null) 
          {
            res.status(200).send(winner.id);
          }
          else
          {
            var query = {date: req.params.date};
            dbo.collection("votesHistory").find(query).toArray(function(err, result) {
              if (err) res.status(500).send("Weak Internet Connection");
              else 
              {
                for(var i = 0; i < result.length; i++) {
                    var obj = result[i];
                    //console.log(obj);
                    var rest = new Map();
                    if(rest.has(obj.id)) {rest.set(obj.id, rest.get(obj.id)+1);}
                    else {rest.set(obj.id, 1);}
                }
                var max = -1;
                var winnerId;
                var value;
                for (let [k, v] of rest) {
                  if(v > max){
                      max = v;
                      winnerId = k;
                  }
                }
                var newWinner = { 
                    id: winnerId,
                    date: req.params.date};
                    console.log(newWinner);
                dbo.collection("winnerRestaurants").insertOne(newWinner, function(err, r) {
                    if (err)
                    {
                      console.log(err);
                      res.status(500).send("Weak Internet Connection");
                    }
                    else
                    {
                      res.status(200).send(winnerId);
                    } 
                    db.close();
                  });              
              }
            });          
          }         
        });
      });
  };