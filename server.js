const express = require("express");
const app = express();
const bodyparser = require("body-parser")

// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));
app.use(express.static("views"));

// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
    response.sendFile(__dirname + "/index.html");
});


// listen for requests :)
const listener = app.listen(process.env.PORT || 3000, () => {
    console.log("Your app is listening on port " + listener.address().port);
});