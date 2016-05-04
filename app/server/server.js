var express = require('express'),
bodyParser = require('body-parser'),
request = require('request'),
url = require('url'),
cookieParser = require('cookie-parser');

var app = express();
// Create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended:false})

/**
 *
 **/
/*function processUrl (wantedUrl, res) {

	try {
		var parsedUrl = url.parse(wantedUrl);
		console.log('-----> ' + parsedUrl.href);
		// gestire caso errore su url passata

		request.get(
			{url:parsedUrl.href, 
			json:true,
			encoding:"utf-8",
			timeout:10000}//,
			/*function (error, response, body) {
				if (!error && response.statusCode === 200) {

					// gestire caso errore su JSON
					console.log('++++> JSON received');
					return body;
				};
				// gestire caso errore
			}*/ /*).pipe(res);
	} catch(e) {
		// statements
		console.log('#### Error');
		console.log(e);
		return {};
	}
}*/

var server = app.listen(8081, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("JSONPath tester listening at http://%s:%s", host, port)

});

app.use(express.static('.'));
app.use(cookieParser());

// This responds a GET request for the /list_user page.
app.get('/', function (req, res) {
	console.log("Got a GET request for the homepage");
	res.clearCookie('_url');
	res.clearCookie('_jsonpath');
   	res.sendFile( __dirname + "/" + "index.html" );
});

// This responds a POST request for the homepage
app.post('/', urlencodedParser, function (req, res) {
   console.log("Got a POST request for the homepage");

	var urlPostField = req.body.url;

	if ( urlPostField !== undefined && urlPostField !== '' ) {
		
		var parsedUrl = url.parse(urlPostField);
		console.log('-----> ' + parsedUrl.href);
		// gestire caso errore su url passata

		var jsonpathPostField = req.body.jsonpath;

		res.clearCookie('_url');
		res.cookie('_url', parsedUrl.href, { maxAge: 900000, httpOnly: true });

		res.clearCookie('_jsonpath');
		res.cookie('_jsonpath', jsonpathPostField, { maxAge: 900000, httpOnly: true });

		request.get(
			{
				url:parsedUrl.href, 
				json:true,
				encoding:"utf-8",
				timeout:10000
			}).pipe(res);
   	}
   	else{
   		console.log('Nothing to fetch!');
   		res.sendFile( __dirname + "/" + "index.html" );
   	}
});