console.log("Starting Bot");

process.title = "Robo Waiter App";

process.on('uncaughtException', function (err) {
  console.log('Caught exception: ' + err);
});

var util = require('util'),
    twitter = require('twitter');
    
var twit = new twitter({
    consumer_key: 'fIS11wPxaItuJEXzZCv5fQ',
    consumer_secret: 'pgApvYYnNtYSXB55yEt49WFSGy18SVNYqov7mCj8',
    access_token_key: '74145488-HqbsYFq1vpQ9wo75tvd5s06oeJHU9uXBi156gYS0N',
    access_token_secret: 'fY4AZRybIfYNLHihThqeR4vlzzS91yZa5CeX38Fumw'
});

var menu = new Array('The Current Menu at @smallplatesnq looks like this',
                    'BUTTERMILK FRIED CHICKEN w/ roasted peanut sauce\n\n CRISPY PORK CHEEK w/ smoked bacon sauce & Rekordelig mayo',
                    'LAMB MEATBALLS w/ tomato sauce\n\n BREADED WHITEBAIT w/ cockle ‘popcorn’, Rekorderlig mayo',
                    'COD CHEEK IN BEER BATTER w/ mushy peas\n\n MINI SQUID BURGERS w/ lettuce and onion',
                    'MARIS PIPER MASH CAKES w/ cucumber ketchup, smoked salt\n\n YORKSHIRE PUDDINGS w/ whipped blue cheese, chilli jam',
                    'ASPARAGUS SPEARS w/ fondue',
                    '====== Sides (£3.00) ======',
                    'TRIPLE COOKED CHIPS w/ served with ketchup and mayo\n\n ONION RINGS w/ fried in beer batter',
                    'PORK SCRATCHINGS w/ five spice, salt and pepper');

var currentUserID = null;
var messageQueue = null;

function processQueue(data) {
    if(typeof data == 'undefined'){
        //start of queue
        data = new Object({});
    }
    
    if(util.isError(data)){
        console.error('error sending msg');
        console.error(util.inspect(data));
        //Dump & Reset message queue
        console.error(messageQueue);
        messageQueue = null;
        //process.exit(1);
    }else{
        // no data = start of queue so dont need to check respose data
        if (messageQueue.length) {
            // Bloody rate limit
            twit.newDirectMessage(currentUserID, messageQueue.shift(), processQueue);  
            //console.log('now there are ' + messageQueue.length + ' messages left');
        }
    }
}

/**
 * Main program starts here
 */
var date = new Date();
twit.updateStatus('Starting Robo Waiter Twitter Bot \n\n'+date,function(){});

process.on('SIGTERM', function() {
    var date = new Date();
    twit.updateStatus('Shutting down Robo Waiter Twitter Bot \n\n'+date,function(){
        process.exit(code=0); 
    });
});

/**
 * Debug code
 *
 * currentUserID = 35538233;
 * messageQueue = menu.slice(0); //copy array dont referance
 * console.log('DEBUG MODE ON');
 * processQueue();
 */

twit.stream('statuses/filter', {'track' : 'mathesonserver showmenu'}, function(stream) {
	stream.on('data', function(data) {
        currentUserID = data.user.id;
        messageQueue = menu.slice(0); //copy array dont referance
        console.log('Menu requested by @'+data.user.screen_name);
        console.log('Sending ' + messageQueue.length + ' messages');
        processQueue();
    });
});


