let countSpan = document.querySelector('.quiz-info .count span')
let submitButton = document.querySelector('.submit-button')
let current = 0;
let rightAnswersCount = 0;
let countdownInterval;

//Function to get all questions from the JSON fle
function getQuestions(){
  let myRequest = new XMLHttpRequest();
  myRequest.onreadystatechange = function(){
    if(this.readyState === 4 && this.status ===200){
      let questions = JSON.parse(this.responseText)

      //To create n bullets equal to number of questions
      createBullets(questions.length)

      //To get The question with given choices
      addQuestionData(questions[current],questions.length)

      countdown(15,questions.length)

      submitButton.onclick =()=>{
        let rightAnswer = questions[current].right_answer;
        checkAnswer(rightAnswer)

        document.querySelector('.quiz-area').innerHTML = '';
        document.querySelector('.answers-area').innerHTML = '';
        current++;
        addQuestionData(questions[current],questions.length);
        handleBullets();

        clearInterval(countdownInterval)
        countdown(15,questions.length)

        showResult(questions.length);
      }
    }
  }
  myRequest.open('Get','questions.json',true);
  myRequest.send();
}

getQuestions()

//To create n bullets equal to number of questions
function createBullets(num){
  countSpan.innerHTML = num;
  for(i=0;i<num;i++){
    let bullet = document.createElement('span');
    if(i===0){
      bullet.className = 'on'
    }
    document.querySelector('.bullets .spans').appendChild(bullet)
  }
}

//To get The question with given choices
function addQuestionData(obj,count){

  if(current < count){
    let qTitle = document.createElement('h2')
    let qText = document.createTextNode(obj['title'])
    qTitle.appendChild(qText)
    document.querySelector('.quiz-area').appendChild(qTitle)
  
    for(i=1; i<5 ; i++){
      let mainDiv = document.createElement('div')
      mainDiv.className = 'answer'
  
      let radioInput = document.createElement('input')
      radioInput.name = 'question'
      radioInput.type = 'radio'
      radioInput.id = `answer_${i}`
      radioInput.dataset.answer = obj[`answer_${i}`]
  
      let label = document.createElement('label')
      label.htmlFor = radioInput.id
      let labelText = document.createTextNode(obj[`answer_${i}`])
      label.appendChild(labelText)
  
      mainDiv.append(radioInput, label)
      document.querySelector('.answers-area').appendChild(mainDiv)
    }
  }
}

function checkAnswer(rAnswer) {
  let answers = document.getElementsByName('question');
  let chosenAnswer;
  for(i=0;i<4;i++){
    if(answers[i].checked){
      chosenAnswer = answers[i].dataset.answer;
    }
  }
  if(rAnswer === chosenAnswer){
    rightAnswersCount ++;
    console.log('Good Answer')
    console.log(rightAnswersCount)
  }
}

function handleBullets(){
  let bulletsSpan = document.querySelectorAll('.bullets .spans span')
  let arrayOfSpans = Array.from(bulletsSpan);
  arrayOfSpans.forEach((span,index) => {
    if(current === index){
      span.className = 'on'
    }
  })
}

function showResult(count){
  let results;
  if(current === count){
    document.querySelector('.quiz-area').remove();
    document.querySelector('.answers-area').remove();
    submitButton.remove();
    document.querySelector('.bullets').remove();

    if(rightAnswersCount > (count/2) && rightAnswersCount < count){
      results = `<span class='good'>Good</span>, ${rightAnswersCount} out of ${count}.`
    }else if (rightAnswersCount === count){
      results = `<span class='perfect'>Perfect</span>, All answers are right.`
    }else{
      results = `<span class='bad'>Bad</span>, ${rightAnswersCount} out of ${count}.`
    }
    
    let resDiv = document.createElement('div')
    resDiv.className = 'results'
    document.querySelector('.quiz-app').appendChild(resDiv)
    resDiv.innerHTML = results;
  }
}

//Set Timer
function countdown(duration, count){
  if(current < count){
    let minutes,seconds;
    countdownInterval = setInterval(function(){
      minutes = parseInt(duration/60)
      seconds = parseInt(duration % 60)

      minutes = minutes < 10 ? `0${minutes}` : minutes
      seconds = seconds < 10 ? `0${seconds}` : seconds

      document.querySelector('.countdown').innerHTML= `${minutes}:${seconds}`

      if(--duration < 0){
        clearInterval(countdownInterval);
        submitButton.click();
      }

    },1000)
  }
}