$(setup());	// set up on page load
$correct = $("#submitguess");
function setup() {
	// make gloabl variables
	correctNumber = 1 + Math.floor(Math.random()*100);
	maxGuesses = 4;
	enableGuessing();
	guessesRemaining = maxGuesses;
	previousGuess = -10;
	guessHistory = [];
}





//$("#theguess").change(validateInput());
/*	if you go down the path of validating the iput on #theguess change/keypress/blur, 
		and you enable/disable the guess button in validation, you need an extra check
		to make sure if they get the guess right, then type in a new number they don't 
		accidentally enable the button again
*/
function validateInput() {
	// returns true if input is good
	var guess = $("#theguess").val();
	if(	$.isNumeric(guess) && (Math.floor(guess)==guess)) {
		// input is numeric
		if((guess < 1) || (guess > 100)) {
			//disableGuesses();
			err = "Input must be between 1 and 100";
			notifyUser(err);
			return false;
		}
		else {
			// input is valid
			//enableGuessing();
			notifyUser("");
			return true;
		}
	}
	else {
		// not an integer
		//disableGuesses();
		err = "Please enter a whole number. Input must be between 1 and 100";
		notifyUser(err);
		return false;
	}
}




$("#submitguess").click(function() {
	// step one: validate input
	canProceed = validateInput();
	if(canProceed==true) {
		// limit to certain amount of guesses, let them know when they run out of guesses
		guessesRemaining--;
		
		var num = $("#theguess").val();
		if(num != correctNumber) {
			// they guessed wrong
			var badGuess = "";
			// is guess a repeat guess?
			if(isRepeat(num)==true) {
				badGuess += "Seriously? You've already guessed "+num+". Just scroll down and see for yourself!"
				badGuess += "<br><br>";
			}
			// now that we've checked if it's a repeat, we can add this guess to the array
			guessHistory.push(num);

			// tell user if guess is hot or cold
			var difference = Math.abs(correctNumber-num);
			var guessIsCold = true;	// assume they're cold to start
			if(previousGuess<1) {
				// first guess
				if(difference < 50) {
					guessIsCold = false;
					badGuess += "You're hot."
				}
				else {
					badGuess += "You're cold."
				}
			}
			else {
				// subsequent guesses
				var lastDiff = Math.abs(correctNumber - previousGuess)
				/* technically, i never deal with the case that they guess the same number twice.
					but if they do guess the same number twice, they are not getting any close
					AND because I'm giving them hints, that's just dumb. So i'm comfortable saying
					that guessing the same number twice in a row is cold (and cold is assumed, so no
					need to check)
				*/
				if( difference < lastDiff) {	// getting warmer
					guessIsCold = false;
					badGuess += "You're getting warmer.";
				}
				else {
					badGuess += "You're getting colder."
				}
			}

			// tell user to guess higher or lower
			var clue = "lower"
			if(num<correctNumber) {
				clue = "higher";
			}
			badGuess += "<br>";
			badGuess += "You guessed "+num+", which is incorrect.";
			badGuess += "<br>";
			badGuess += "I recommend guessing "+clue+" next time. But what do I know, I'm just a web app.";
			
			var guessLeftStr = "";
			if(guessesRemaining == 1) {
				guessLeftStr = "1 guess";
			}
			else {
				guessLeftStr = guessesRemaining + " more guesses";
			}
			badGuess += "<br>FYI: You have " + guessLeftStr + " left."
			
			// display div
			$nextDiv = $("<div></div>");
			if(guessIsCold) {
				$nextDiv.addClass("cold hint");
			}
			else {
				$nextDiv.addClass("hot hint");
			}
			$nextDiv.html(badGuess);
			$correct.after($nextDiv);
			
			// setup for next guess
			previousGuess = num;
			
			// are they done?
			checkIfDone();
		}
		else {
			// they guessed correctly
			disableGuesses();
			$nextDiv = $("<div></div>");
			$nextDiv.addClass("hint");
			goodMessage = "Congratulations! You guessed it, the number is " + num + ".";
			goodMessage += '<br><a href="https://www.youtube.com/watch?v=6-HUgzYPm9g">Click here to claim your prize!</a>';
			$nextDiv.html(goodMessage);
			$correct.after($nextDiv);
		}
	}
});


function checkIfDone() {
	if(guessesRemaining<1) {
		// no guesses left
		disableGuesses();
		$nextDiv = $("<div></div>");
		$nextDiv.addClass("hint");
		$nextDiv.html("Bummer, you're out of guesses. You can always try again. And just so it doesn't keep you up at night, the number I was thinking of was "+correctNumber+". Better luck next time.");
		$correct.after($nextDiv);
	}
}


function isRepeat(thisGuess) {
	for(x=0; x < guessHistory.length; x++) {
		if(thisGuess == guessHistory[x]) {
			return true;
		}
	}
	return false;
}



function notifyUser(message) {
	$("#notification").text(message);
}

function disableGuesses() {
	$("#submitguess").prop("disabled",true);
}
function enableGuessing() {
	$("#submitguess").prop("disabled",false);
}

// button shows answer
$("#showHint").click(function() {
	msg = "Try guessing the number " + correctNumber + "...ya dirty cheater";
	notifyUser(msg);
});


// new game button resets game
$("#reset").click(function() {
	// div id = correct
	// span id = notification
	$(".hint").remove();
	setup();
});