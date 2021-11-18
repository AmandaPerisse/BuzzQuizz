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
    `;
}
