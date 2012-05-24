var MY_SEED;

Array.prototype.shuffle = function() {
	var s = new Array();
	while (this.length) s.push(this.splice(rng.next() * this.length, 1)[0]);
	while (s.length) this.push(s.pop());
	return this;
}

Array.prototype.contains = function(obj) {
    var i = this.length;
    while (i--) {
        if (this[i] === obj) {
            return true;
        }
    }
    return false;
}

var locations_red = [
	"Beijing",
	"Seoul",
	"Tokyo",
	"Shanghai",
	"Osaka",
	"Taipei",
	"Hong Kong",
	"Bangkok",
	"Ho Chi Minh",
	"Manila",
	"Jakarta",
	"Sydney"
]

var locations_blue = [
	"St. Petersburg",
	"Milan",
	"Essen",
	"Paris",
	"Madrid",
	"London",
	"Toronto",
	"New York",
	"Washington DC",
	"Atlanta",
	"Chicago",
	"San Francisco"
]

var locations_yellow = [
	"Los Angeles",
	"Mexico",
	"Miami",
	"Bogota",
	"Lima",
	"Santiago",
	"Buenos Aires",
	"Sao Paulo",
	"Kinshasa",
	"Lagos",
	"Khartoum",
	"Johannesburg"
]

var locations_black = [
	"Chennai",
	"Kolkata",
	"Mumbai",
	"Delhi",
	"Karachi",
	"Riyadh",
	"Tehran",
	"Baghdad",
	"Istanbul",
	"Algiers",
	"Cairo",
	"Moscow"
]

var events = [
	"Remote Transport",
	"Re-examined Research",
	"Rapid Vaccine Deployment",
	"Mobile Hospital",
	"Airlift",
	"Government Grant",
	"Special 7",
	"Special 8",
	"Special 9",
	"Special 10",
]

var infections = [
	"Infection 1",
	"Infection 2",
	"Infection 3",
	"Infection 4",
	"Infection 5",
	"Infection 6"
]	

var infectionDeck = new Array();
var playerDeck = new Array();
var rng;

function setSeed() {
	MY_SEED = $('#seed').val();
	rng = CustomRandom(MY_SEED);

	buildGame();

	$('#overlay').hide();
}

function buildGame() {

	infectionDeck = new Array();
	playerDeck = new Array();
	drawn = new Array();

	var num_players = $('input[name="roles"]:checked').val();
	var num_infections = $('input[name="infections"]:checked').val();

	infectionDeck = infectionDeck.concat(locations_black, locations_blue, locations_red, locations_yellow);
	infectionDeck.shuffle();

	var game_events = events.splice(0, num_players * 2);
	console.log(game_events);
	playerDeck = playerDeck.concat(locations_yellow, locations_red, locations_blue, locations_black, game_events);
	playerDeck.shuffle();

	// these are the "safe" cards for the original ones the players will draw
	var safecards = playerDeck.splice(0, num_players * 2);
	console.log(safecards);

	var tdeck1 = new Array();
	var tdeck2 = new Array();
	var tdeck3 = new Array();
	var tdeck4 = new Array();
	var tdeck5 = new Array();
	var tdeck6 = new Array();

	// gotta make this cleaner, just rushing something together
	if (4 == num_infections) {
		for (var i = 0; i < playerDeck.length; i++) {
			if (i % 4 == 0) tdeck1.push(playerDeck[i]);
			else if (i % 4 == 1) tdeck2.push(playerDeck[i]);
			else if (i % 4 == 2) tdeck3.push(playerDeck[i]);
			else if (i % 4 == 3) tdeck4.push(playerDeck[i]);
		}

		tdeck1.push(infections[0]);
		tdeck2.push(infections[1]);
		tdeck3.push(infections[2]);
		tdeck4.push(infections[3]);

	} else if (5 == num_infections) {
		for (var i = 0; i < playerDeck.length; i++) {
			if (i % 5 == 0) tdeck1.push(playerDeck[i]);
			else if (i % 5 == 1) tdeck2.push(playerDeck[i]);
			else if (i % 5 == 2) tdeck3.push(playerDeck[i]);
			else if (i % 5 == 3) tdeck4.push(playerDeck[i]);
			else if (i % 5 == 4) tdeck5.push(playerDeck[i]);
		}

		tdeck1.push(infections[0]);
		tdeck2.push(infections[1]);
		tdeck3.push(infections[2]);
		tdeck4.push(infections[3]);
		tdeck5.push(infections[4]);

	} else if (6 == num_infections) {
		for (var i = 0; i < playerDeck.length; i++) {
			if (i % 6 == 0) tdeck1.push(playerDeck[i]);
			else if (i % 6 == 1) tdeck2.push(playerDeck[i]);
			else if (i % 6 == 2) tdeck3.push(playerDeck[i]);
			else if (i % 6 == 3) tdeck4.push(playerDeck[i]);
			else if (i % 6 == 4) tdeck5.push(playerDeck[i]);
			else if (i % 6 == 5) tdeck6.push(playerDeck[i]);
		}

		tdeck1.push(infections[0]);
		tdeck2.push(infections[1]);
		tdeck3.push(infections[2]);
		tdeck4.push(infections[3]);
		tdeck5.push(infections[4]);
		tdeck6.push(infections[5]);
	}

	
	tdeck1.shuffle();
	tdeck2.shuffle();
	tdeck3.shuffle();
	tdeck4.shuffle();
	tdeck5.shuffle();
	tdeck6.shuffle();

	playerDeck = new Array();
	playerDeck = playerDeck.concat(safecards, tdeck1, tdeck2, tdeck3, tdeck4, tdeck5, tdeck6);

	console.log(playerDeck);
	console.log(infectionDeck);

	$('#player_counter .count').html(playerDeck.length);
	$('#infection_counter .count').html(drawn.length);
}

var drawn = [];
var clearNext = true;

function drawPlayer() {

	$('#board').empty();

	if (playerDeck.length > 0) {
		var player_card = playerDeck.shift();
		var card_class = '';
		
		if (locations_yellow.contains(player_card)) card_class = "yellow";
		else if (locations_black.contains(player_card)) card_class = "black";
		else if (locations_blue.contains(player_card)) card_class = "blue";
		else if (locations_red.contains(player_card)) card_class = "red";
		else if (events.contains(player_card)) card_class = "event";
		else if (infections.contains(player_card)) card_class = "infections";

		// add the card to the screen
		
		$('<div/>', {
		    class: 'card ' + card_class
		}).appendTo('#board');
		$('<div/>', {
		    class: 'inner'
		}).appendTo('.card');
		$('<div/>', {
		    class: 'content'
		}).appendTo('.inner');

		if ( "event" == card_class ) {

			$('<h2/>', {
			    text: player_card
			}).appendTo('.content');
		
		} else if ( "infections" == card_class ) {

			$('<span/>', {
			    class: 'ball'
			}).appendTo('.content');
			$('<h2/>', {
			    text: "Infection!"
			}).appendTo('.content');

			clearNext = false;

			drawInfection();

			resetInfections();

		} else {
			
			$('<div/>', {
			    class: 'header'
			}).appendTo('.content');

			$('<span/>', {
			    class: 'ball'
			}).appendTo('.header');
			$('<h2/>', {
			    text: player_card
			}).appendTo('.header');
			
			$('<div/>', {
			    class: 'map'
			}).appendTo('.content');

			clearNext = true;
		}
		
	} else {
		alert("No more cards...");
	}

	$('#player_counter .count').html(playerDeck.length);
}

function drawInfection() {
	
	if (clearNext)
		$('#board').empty();

	drawn.push(infectionDeck.pop());
	console.log(drawn);
	var card_class = '';
	if (locations_yellow.contains(drawn[drawn.length - 1])) card_class = "yellow";
	else if (locations_black.contains(drawn[drawn.length - 1])) card_class = "black";
	else if (locations_blue.contains(drawn[drawn.length - 1])) card_class = "blue";
	else if (locations_red.contains(drawn[drawn.length - 1])) card_class = "red";

	$('<div/>', {
	    class: 'infection card ' + card_class
	}).appendTo('#board');
	$('<div/>', {
	    class: 'inner'
	}).appendTo('.infection.card');
	$('<div/>', {
	    class: 'content'
	}).appendTo('.infection .inner');

	$('<div/>', {
	    class: 'header'
	}).appendTo('.infection .content');

	$('<span/>', {
	    class: 'ball'
	}).appendTo('.infection .header');
	$('<h2/>', {
	    text: drawn[drawn.length - 1]
	}).appendTo('.infection .header');
	
	$('<div/>', {
	    class: 'map'
	}).appendTo('.infection .content');

	clearNext = true;

	$('#infection_counter .count').html(drawn.length);
}

function resetInfections() {
	//drawn.push(infectionDeck.pop());
	drawn.shuffle();
	console.log(drawn);
	while (drawn.length) infectionDeck.unshift(drawn.pop());
	console.log(infectionDeck);

	$('#infection_counter .count').html(drawn.length);
}

// random seed function thanks to: 
// http://michalbe.blogspot.ca/2011/02/javascript-random-numbers-with-custom_23.html
function CustomRandom(nseed) {    

	var seed,    
		constant = Math.pow(2, 13)+1,    
	    prime = 1987,    
		//any prime number, needed for calculations, 1987 is my favorite:)  
	    maximum = 1000;    
		//maximum number needed for calculation the float precision of the numbers (10^n where n is number of digits after dot)  
	    if (nseed) {    
	      seed = nseed;    
	    }    
	    
	    if (seed == null) {    
		//before you will correct me in this comparison, read Andrea Giammarchi's text about coercion http://goo.gl/N4jCB  
	      
	      seed = (new Date()).getTime();   
		//if there is no seed, use timestamp     
	    }     
	    
	    return {    
	      next : function(min, max) {  

	      	while (seed > constant) seed = seed/prime;

	        seed *= constant;    
	        seed += prime;    
	        
	        return min && max ? min+seed%maximum/maximum*(max-min) : seed%maximum/maximum;  
			// if 'min' and 'max' are not provided, return random number between 0 & 1  
	      }    
	    }    
	}

window.addEventListener("load",function() {
	// Set a timeout...
	setTimeout(function(){
		// Hide the address bar!
		window.scrollTo(0, 1);
	}, 0);
});

$(document).ready(function() {

	$('#player_counter .count').html(playerDeck.length);
	$('#infection_counter .count').html(drawn.length);

	$('#seed_btn').click(function() {
		if ($('#seed').val().length > 0) {
			$('#seed').removeClass('empty');
			setSeed();
		} else {
			$('#seed').addClass('empty');
		}

	});

	$('#reset').click(function() {

		var r=confirm("Reset Game?");
		if (r==true) {

			$('#board').empty();
			
			$('#overlay').show().children('#seed').val('');
		}
		else {
			console.log("cancel");
		}

	});
});