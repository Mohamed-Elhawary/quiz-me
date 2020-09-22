/*global document*/
//1-define your variables and options
var info             = document.querySelector(".info");
    spanCount        = document.querySelector(".info .count span"),
	language         = document.querySelector(".info .language span"),
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

//2-get the question from the json file
function getQuestions() { 
	let request = new XMLHttpRequest();
	request.onreadystatechange = function() {
		if(this.readyState === 4 && this.status === 200) {
			let questions = JSON.parse(this.responseText);
			let questionsLength = questions.length;

			shuffleQuestions(questions); //4-call the shuffleQuestions function
			

			//5-get 10 random questions from the the shuffle questions and make a sliced array from them
			let randomQ;
			let slicedArray;
			let slicedArrayLength;
			randomQ = Math.floor(Math.random() * questionsLength);
			if (randomQ > 20) {
				slicedArray = questions.slice(randomQ - 10, randomQ);
				slicedArrayLength = slicedArray.length;
			} else {
				slicedArray = questions.slice(randomQ, randomQ + 10);
				slicedArrayLength = slicedArray.length;
			}
		

            createBullets(slicedArrayLength);  //12-call the createBullets function
			questionData(slicedArray[currentIndex], slicedArrayLength); //13-call the questionData function 
			timer(120, slicedArrayLength);  //14-call the timer function before submit to start time in the first question

			//15-the effect of clicking on the submit button
			submit.onclick = function() {
				let rightAnswer =  slicedArray[currentIndex].right_answer;
				currentIndex++;
				checkAnswer(rightAnswer);
				optionsContainer.innerHTML = "";
				question.innerHTML = "";
				questionData(slicedArray[currentIndex], slicedArrayLength);
				handleBullets();
				clearInterval(countDown);
				timer(120, slicedArrayLength);
                showResult(slicedArrayLength); 
			};
		} 	
	};
	//2-get the question from the json file
	request.open("GET", "questions.json", true);
	request.send();
}

//16-call the getQuestions() function	
getQuestions();

//3-Shuffle the question function
function shuffleQuestions(array) {
    let current = array.length,
        random;
    while (current > 0) {
        random = Math.floor(Math.random() * current);
        current--;
        [array[current], array[random]] = [array[random], array[current]] //ES6 Shuffle method
    }
    return array;
}

//6-create the bullets
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

//7-create the question data
function questionData(obj, count) {
	if(currentIndex < count) {
        language.innerHTML = obj.language;
        //shuffleOptions(obj); //call the shuflleOptions function
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

//8-checkAnswer function
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

//9-handleBullets function
function handleBullets() {
	let bullets = document.querySelectorAll(".bullets span");
	let bulletsArray = Array.from(bullets);
	bulletsArray.forEach((bullet, bulletIndex) => {
		if (currentIndex === bulletIndex) {
			bullet.classList.add("on");
		}
	});
}

//10-show result function
function showResult(count) {
	if(currentIndex === count) {
		info.remove();
		quizArea.remove();
		submit.remove(); 
		details.remove();

		result.classList.add("show");
	
		if (correctTries > count /2 && correctTries < count) {
			result.innerHTML = `<span class="good">Good</span> you answered ${correctTries} Questions of ${count} correctly <button class="good-button">want another Quiz ??</button>`;
		} else if (correctTries == count) {
			result.innerHTML = `<span class="perfect">Perfect</span> you answered all the questions correctly<button class="perfect-button">want another Quiz ??</button>`;
		} else {
			result.innerHTML = `<span class="bad">Bad</span> you answered ${correctTries} Questions of ${count} correctly<button class="bad-button">Try Again ?</button>`;
		}
	}
	//when clicking on the buuton inside the result Div
	document.addEventListener("click", (e) => {
		if(e.target.classList.contains("bad-button") || e.target.classList.contains("good-button") || e.target.classList.contains("perfect-button")) {
			window.location.reload();
		}
	});
}

//11-timerFunction
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
			/* note that : you can use >> if(--duration < 0) {}, instead of using >> duration-- above, and it will 
			do the same thing of duration-- and the timer value will decrease  by one (-1) every 1s, and at the same time the condition of (duration > 0) will be checked also , so we can say that
			if(--duration > 0) means two things : 1- check the condition of duration > 0 , 2- decrease the timer value by one (-1) every 1s,
			But don't use the two things together >> if(--duration > 0) & duration-- , because the timer value will decrease twice (-2) every 1s, so the timer logic will fail*/
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