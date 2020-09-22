/*global document*/
/*theChoosenAnswer = answers.filter(answer => answer.checked)[0].dataset.answer;*/
//define your variables and options
var info             = document.querySelector(".info");
    spanCount        = document.querySelector(".info .count span"),
	category         = document.querySelector(".info .category span"),
	quizArea         = document.querySelector(".quiz-area");
	question         = document.querySelector(".quiz-area .question"),
	optionsContainer = document.querySelector(".quiz-area .options"),
	submit           = document.querySelector(".submit"),
	details          = document.querySelector(".details");
	bulletsContainer = document.querySelector(".details .bullets"),
	timerContainer   = document.querySelector(".details .timer"),
	result           = document.querySelector(".result");
	
var	currentIndex     = 0,
	correctTries     = 0,
    countDown;

//get the questions from the json file
function getQuestions() { 
	let request = new XMLHttpRequest();
	request.onreadystatechange = function() {
		if(this.readyState === 4 && this.status === 200) {
			let questions = JSON.parse(this.responseText);
			let questionsLength = questions.length;
			
			createBullets(questionsLength);  //call the createBullets function
			questionData(questions[currentIndex], questionsLength); //call the questionData function 
			timer(120, questionsLength);  // call the timer function before submit to start time in the first question
			
			submit.onclick = function() {
				let rightAnswer =  questions[currentIndex].right_answer;
				currentIndex++;
				checkAnswer(rightAnswer);
				optionsContainer.innerHTML = "";
				question.innerHTML = "";
				questionData(questions[currentIndex], questionsLength);
				handleBullets();
				clearInterval(countDown);
				timer(120, questionsLength);
				showResult(questionsLength);
			};
		} 	
	};
	request.open("GET", "questions.json", true);
	request.send();
}
	
getQuestions();

//create the bullets
function createBullets(count) {
	spanCount.innerHTML = count;
	for (let i= 0; i < count; i++) {
		var bullet = document.createElement("span");
		bulletsContainer.appendChild(bullet);
		
		if(i === 0) {
			bullet.className = "on";
		}
	}	
}

//create the question data
function questionData(obj, count) {
	if(currentIndex < count) {
		var heading     = document.createElement("h2");
		var headingText = document.createTextNode(obj.title);
		heading.appendChild(headingText);
		question.appendChild(heading);

		for(let i=1; i <= 4; i++) {
			var inputs       = document.createElement("input");
			var labels       = document.createElement("label");
			var labelsText   = document.createTextNode(obj[`answer_${i}`]);
			labels.appendChild(labelsText);

			labels.htmlFor = `answer_${i}`;
			inputs.type    =  "radio";
			inputs.id      =  `answer_${i}`;
			inputs.name    =   "Qoption";
			inputs.dataset.answer = obj[`answer_${i}`];

			optionDiv = document.createElement("div");
			optionDiv.appendChild(inputs);
			optionDiv.appendChild(labels);
			
			optionDiv.className = "option";
			optionsContainer.appendChild(optionDiv);
		}
	}
}

//checkAnswer function
function checkAnswer(correctAnswer) {
	let options = document.getElementsByName("Qoption");
	let chosenOption;
	for (let i= 0 ; i < options.length; i++) {
		if (options[i].checked) {
			chosenOption = options[i].dataset.answer; 
		}
	}
	if (correctAnswer === chosenOption) {
		correctTries++;
	}
}

//handleBullets function
function handleBullets() {
	let bullets = document.querySelectorAll(".bullets span");
	let bulletsArray = Array.from(bullets);
	bulletsArray.forEach((bullet, bulletIndex) => {
		if (currentIndex === bulletIndex) {
			bullet.classList.add("on");
		}
	});
}

//show result function
function showResult(count) {
	if(currentIndex === count) {
		info.remove();
		quizArea.remove();
		submit.remove(); 
		details.remove();

		result.classList.add("show");
	
		if (correctTries > count /2 && correctTries < count) {
			result.innerHTML = `<span class="good">Good</span> you answered ${correctTries} Questions of ${count} correctly`;
		} else if (correctTries == count) {
			result.innerHTML = `<span class="perfect">Perfect</span> you answered all the questions correctly`;
		} else {
			result.innerHTML = `<span class="bad">Bad</span> you answered ${correctTries} Questions of ${count} correctly`;
		}
	}
}

//timerFunction
function timer(duration, count) {
	if (currentIndex < count) {
		    countDown = setInterval(()=> {
			let min = parseInt(duration/60);
			let sec = duration % 60;
			duration--;
			min = min < 10 ? `0${min}` : min;
			sec = sec < 10 ? `0${sec}` : sec;

			timerContainer.innerHTML = `${min} : ${sec}`;
			if(duration < 0) {
				clearInterval(countDown);
				submit.click();
			} 
			if(min == 0 && sec < 10) {
				timerContainer.classList.add("count-down");
			} else {
				timerContainer.classList.remove("count-down");
			}
			
		}, 1000)
	}
}