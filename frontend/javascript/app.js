var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var app = express();


//create express app
app.use(bodyParser.urlencoded({extended: true}));

//connect to the mongoDB
var db = require('mongoskin').db("mongodb://relayer:colislapepite@ds123331.mlab.com:23331/relayer-clients", { w: 0});
    db.bind('event');

//use public folder for static files

app.use(express.static(path.join(__dirname, '../public')));

app.get('/init', function(req, res){
    db.event.insert({
        text:"My test event A",
        start_date: new Date(2017,4,18),
        end_date:   new Date(2017,4,19)
    });
    db.event.insert({
        text:"One more test event",
        start_date: new Date(2017,4,21),
        end_date:   new Date(2017,4,24),
        color: "#DD8616"
    });

    /*... skipping similar code for other test events...*/

    res.send("Test events were added to the database")
});


app.get('/data', function(req, res){
    db.event.find().toArray(function(err, data){
        //set id property for all records
        for (var i = 0; i < data.length; i++)
            data[i].id = data[i]._id;

        //output response
        res.send(data);
    });
});

app.post('/data', function(req, res){
    var data = req.body;

    console.log(data);

    //get operation type
    var mode = data["!nativeeditor_status"];
    //get id of record
    var sid = data.id;
    var tid = sid;

    //remove properties which we do not want to save in DB
    delete data.id;
    delete data.gr_id;
    delete data["!nativeeditor_status"];


    //output confirmation response
    function update_response(err, result){
        if (err)
            mode = "error";
        else if (mode == "inserted")
            tid = data._id;

        res.setHeader("Content-Type","text/xml");
        res.send("<data><action type='"+mode+"' sid='"+sid+"' tid='"+tid+"'/></data>");
    }

    //run db operation
    if (mode == "updated")
        db.event.updateById( sid, data, update_response);
    else if (mode == "inserted")
        db.event.insert(data, update_response);
    else if (mode == "deleted")
        db.event.removeById( sid, update_response);
    else
        res.send("Not supported operation");
});

//is necessary for parsing POST request


app.listen(3000);
