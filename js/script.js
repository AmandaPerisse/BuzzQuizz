let allQuizzes = document.querySelector(".indexAllQuizzesList");
let index = document.querySelector(".index");
let specifiedQuizz = document.querySelector(".OpenedQuizz");


let promise = axios.get('https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes');
promise.then(getQuizzes);

function getQuizzes(resposta){
    allQuizzes.innerHTML = "";
    console.log(resposta.data);
    for(let i = 0; i < resposta.data.length; i++){
        allQuizzes.innerHTML += `
        <button onclick = "searchQuizz(${resposta.data[i].id});" style = "background-image: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(0, 0, 0, 0.5) 64.58%, #000000 100%), url(${resposta.data[i].image});" class = "AllQuizzesQuizz">
            <p>${resposta.data[i].title}</p>
        </button>
        `;
    }
}

function searchQuizz(identificador){
    let promise = axios.get('https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes/'+identificador);
    promise.then(openQuizz);
}

function openQuizz(resposta){
    index.classList.add("escondido");
    specifiedQuizz.innerHTML = "";
    specifiedQuizz.innerHTML += `
    <div style = "background-image: linear-gradient(0deg, rgba(0, 0, 0, 0.57), rgba(0, 0, 0, 0.57)), url(${resposta.data.image});" class = "OpenedQuizzHeader">
        <h4>${resposta.data.title}</h4>
    </div>
    <div class = "OpenedQuizzQuestions"></div>
    `;
    let specifiedQuizzQuestions = document.querySelector(".OpenedQuizzQuestions");
    for(let i =0; i<resposta.data.questions.length;i++){
        specifiedQuizzQuestions.innerHTML +=
        `<div class = "container OpenedQuizzQuestion">
            <div style = "background-color: ${resposta.data.questions[i].color}" class = "OpenedQuizzQuestionTitle">
                <h5>${resposta.data.questions[i].title}</h5>
            </div>
            <div class = "OpenedQuizzQuestionOptions"></div>
        </div>
        `;
        let specifiedQuizzQuestion = document.querySelectorAll(".OpenedQuizzQuestionOptions");
        let arrayRandom = [];
        for(let j =0; j<resposta.data.questions[0].answers.length;j++){
            arrayRandom[j]= 
            `<button class = "OpenedQuizzQuestionOption">
                <img src = "${resposta.data.questions[i].answers[j].image}">
                <h3>${resposta.data.questions[i].answers[j].text}</h3>
            </button>
            `;
        }
        arrayRandom.sort(comparador);
        console.log(arrayRandom);
        for(let j = 0; j<arrayRandom.length;j++){
            specifiedQuizzQuestion[i].innerHTML += arrayRandom[j];
        }
    }
}

function comparador() { 
	return Math.random() - 0.5; 
}