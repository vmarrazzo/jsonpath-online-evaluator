var express = require('express'),
bodyParser = require('body-parser'),
request = require('request'),
url = require('url');

var app = express();
// Create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended:false})

var server = app.listen(8081, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("JSONPath tester listening at http://%s:%s", host, port)

});

app.use(express.static('.'));

// This responds a GET request for the /list_user page.
app.get('/', function (req, res) {
	console.log("Got a GET request for the homepage");
   	res.sendFile( __dirname + "/" + "index.html" );
});

// This responds a POST request for the homepage
app.post('/fetch-url', urlencodedParser, function (req, res) {
   console.log("Got a POST request for the homepage");

	var urlPostField = req.body.url;

	if ( urlPostField !== undefined && urlPostField !== '' ) {
		
		try {
			var parsedUrl = url.parse(urlPostField);			
			console.log('-----> ' + parsedUrl.href);
			
			var jsonpathPostField = req.body.jsonpath;

			request.get(
				{
					url:parsedUrl.href, 
					json:true,
					//encoding:"utf-8",
					//proxy:'http://10.9.3.21:8080/',
					timeout:10000
				}).on('error', function (error) {
					console.log(error);
					res.send({"status":"error on fectch url"});
				}).pipe(res);
		}
		catch (error) {
			res.send({"status":"probably url is malformed"});
		}
   	}
   	else{
   		console.log('Nothing to fetch!');
   		res.sendFile( __dirname + "/" + "index.html" );
   	}
});