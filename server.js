const express = require("express");
const app = express();
const bodyparser = require("body-parser")
const fs = require('fs');


// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));
app.use(express.static("views"));


var parse = require('csv-parse');

var csvData=[];
fs.createReadStream('./all-states-history.csv')
    .pipe(parse({delimiter: ','}))
    .on('data', function(csvrow) {
        // console.log(csvrow);
        csvData.push(csvrow);
    })
    .on('end',function() {
        //do something with csvData
        // console.log(csvData);
    });
var populationData = []
fs.createReadStream('./all-states-population.csv')
    .pipe(parse({delimiter: ','}))
    .on('data', function(csvrow) {
        // console.log(csvrow);
        populationData.push(csvrow);
    })
    .on('end',function() {
        //do something with csvData
        // console.log(populationData);
    });



// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
    response.sendFile(__dirname + "/index.html");
});


// listen for requests :)
const listener = app.listen(process.env.PORT || 3000, () => {
    console.log("Your app is listening on port " + listener.address().port);
});

let stateID
let chartType
app.post('/postStateId',  bodyparser.json(), function( req, res ){
    stateID = 0
    stateID = req.body.stateId
    console.log(stateID)
    res.json({response: 'sent'})
})
app.post('/postType',  bodyparser.json(), function( req, res ){
    chartType = ''
    chartType = req.body.chartType
    console.log(chartType)
    res.json({response: 'sent'})
})

app.get('/redirectPage', function(req, res) {
    if (chartType === 'checkDeath') {
        res.sendFile(__dirname + '/views/index_final.html')
    }
    if (chartType === 'checkPositive') {
        res.sendFile(__dirname + '/views/positiveStatistics.html')
    }
});

app.get('/getIdTypeCsv', function( req, res ){
    res.end(JSON.stringify({
        stateId: stateID,
        chartType: chartType,
        rawCsv: csvData
    }))
})

app.get('/getCsv', function( req, res ){
    res.end(JSON.stringify({
        rawCsv: csvData
    }))
})

app.get('/getPopulationCsv', function( req, res ){
    res.end(JSON.stringify({
        rawPopulationCsv: populationData
    }))
})