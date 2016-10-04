var express = require('express'),
bodyParser = require('body-parser'),
request = require('request'),
url = require('url');

var log4js = require('log4js');
log4js.configure({
	appenders: [
		{
			type: 'console'
		},
		{
			type: 'file',
			filename: 'server.log',
			maxLogSize: 20480,
			category: ['logger','console']
		}
	],
	replaceConsole: true
});

var logger = log4js.getLogger('logger');
//logger.setLevel('ERROR');

var app = express();
// Create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended:false})

var server = app.listen(8081, function () {

	var host = server.address().address
	var port = server.address().port

	logger.info("JSONPath tester listening at http://%s:%s", host, port)
});

app.use(express.static('.'));

// This responds a GET request for the /list_user page.
app.get('/', function (req, res) {
	logger.info("HTTP GET request for the homepage");
	res.sendFile( __dirname + "/" + "index.html" );
});

// jsonpath queries service for monitoring
app.post('/jsonpath-queries', urlencodedParser, function(req,res) {
	logger.info("jsonpath queries request for something XXXY!");

	try {
		// prendo il json in ingresso nel body
		var body = req.body;
		var urlFromReq = body.url.link;

		var queries = body.queries;
		
		var parsedUrl = url.parse(urlFromReq);
		logger.info('Requested url to fetch ' + parsedUrl.href);

		var returnedData

		request.get({
			url:parsedUrl.href, 
			json:true,
			//encoding:"utf-8",
			//proxy:'http://10.9.3.21:8080/',
			timeout:10000
		}).on('error', function (error) {
			logger.error(error);
			res.send({"status":"error on fectch url"});
		}).on('response', function(response) {
    		logger.debug(body.url.description + " returns " + response.statusCode);
    		logger.debug(response.headers['content-type']);
    		returnedData = response.body;
  		})

		for(var query in queries){
			logger.info("@@@@ Query id -> " + query[id] + " value -> " + query[query]);
		}

		// eseguo la query se mi riesce

		// per ogni query nella richiesta eseguo jsonpath

		// formatto risposta e mando

		var jsonpathPostField = req.body.jsonpath;

		request.get({
			url:parsedUrl.href, 
			json:true,
			//encoding:"utf-8",
			//proxy:'http://10.9.3.21:8080/',
			timeout:10000
		}).on('error', function (error) {
			logger.error(error);
			res.send({"status":"error on fectch url"});
		}).pipe(res);



	}
	catch (error) {
		logger.warn("Probably requested url is malformed")
		res.send({"status":"probably url is malformed"});
	}
});


// This responds a POST request for the homepage
app.post('/fetch-url', urlencodedParser, function (req, res) {
	logger.info("HTTP POST request for the homepage");

	var urlPostField = req.body.url;

	if ( urlPostField !== undefined && urlPostField !== '' ) {
		
		try {
			var parsedUrl = url.parse(urlPostField);
			logger.info('Requested url to fetch ' + parsedUrl.href);

			//var jsonpathPostField = req.body.jsonpath;

			request.get({
				url:parsedUrl.href, 
				json:true,
				//encoding:"utf-8",
				//proxy:'http://10.9.3.21:8080/',
				timeout:10000
			}).on('error', function (error) {
				logger.error(error);
				res.send({"status":"error on fectch url"});
			}).pipe(res);
		}
		catch (error) {
			logger.warn("Probably requested url is malformed")
			res.send({"status":"probably url is malformed"});
		}
	}
	else{
		logger.debug("Nothing to fetch!");
		res.sendFile( __dirname + "/" + "index.html" );
	}
});
