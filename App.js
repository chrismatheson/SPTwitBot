var http = require('http');
http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello World from Cloud9\n');
}).listen(process.env.PORT);

console.log("Starting Bot");

var util = require('util'),
    twitter = require('twitter');
    
var twit = new twitter({
    consumer_key: 'fIS11wPxaItuJEXzZCv5fQ',
    consumer_secret: 'pgApvYYnNtYSXB55yEt49WFSGy18SVNYqov7mCj8',
    access_token_key: '74145488-HqbsYFq1vpQ9wo75tvd5s06oeJHU9uXBi156gYS0N',
    access_token_secret: 'fY4AZRybIfYNLHihThqeR4vlzzS91yZa5CeX38Fumw'
});

var menu = new Array([  'The Current Menu at @smallplatesnq looks like this',
                        'BUTTERMILK FRIED CHICKEN w/ roasted peanut sauce\n CRISPY PORK CHEEK w/ smoked bacon sauce & Rekordelig mayo\n LAMB MEATBALLS w/ tomato sauce',
                        'BREADED WHITEBAIT w/ cockle ‘popcorn’, Rekorderlig mayo\n COD CHEEK IN BEER BATTER w/ mushy peas\n MINI SQUID BURGERS w/ lettuce and onion',
                        'MARIS PIPER MASH CAKES w/ cucumber ketchup, smoked salt\n YORKSHIRE PUDDINGS w/ whipped blue cheese, chilli jam\n ASPARAGUS SPEARS w/ fondue',
                        '====== Sides (£3.00) ======',
                        'TRIPLE COOKED CHIPS w/ served with ketchup and mayo\n ONION RINGS w/ fried in beer batter\n PORK SCRATCHINGS w/ five spice, salt and pepper']);

var currentUserID = null;
var messageQueue = null;

var processQueue = function(prevMSG) {
        if (messageQueue.length) {
            twit.newDirectMessage(currentUserID, messageQueue.shift(), processQueue);
            console.log('now there are ' + messageQueue.length + ' messages left');
        }
        else {
            messageQueue = null;
        }
    };

twit.stream('statuses/filter', {'track' : 'mathesonserver showmenu'}, function(stream) {
	stream.on('data', function(data) {
        currentUserID = data.user.id;
        messageQueue = menu.slice(0); //copy array dont referance
        processQueue();
    });
});


