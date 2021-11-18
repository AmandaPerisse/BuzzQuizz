let allQuizzes = document.querySelector(".indexAllQuizzesList");

let promise = axios.get('https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes');
promise.then(getQuizzes);

function getQuizzes(resposta){
    allQuizzes.innerHTML = "";
    console.log(resposta.data);
    for(let i = 0; i < resposta.data.length; i++){
        allQuizzes.innerHTML += `
        <button style = "background-image: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(0, 0, 0, 0.5) 64.58%, #000000 100%), url(${resposta.data[i].image});" class = "AllQuizzesQuizz">
            <p>${resposta.data[i].title}</p>
        </button>
        `;
    }
}