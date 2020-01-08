const express = require('express')

const app = express();

const port = 8000;

readTextFile("/Users/Documents/controlealtdelete-3/convertcsvdata.json", function(text){
    var data = JSON.parse(text);
    console.log(data);
});
app.use(express.static(__dirname + '/public'));

app.get("/", (req, res) => {
	res.render('index.html');
  });

app.listen(port);
