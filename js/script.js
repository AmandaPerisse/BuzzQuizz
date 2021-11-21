let allQuizzes = document.querySelector(".indexAllQuizzesList");
let index = document.querySelector(".index");
let specifiedQuizz = document.querySelector(".OpenedQuizz");
let qtdAcertos = 0;
let levels = [];
let idQuizz = 0;


let promise = axios.get('https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes');
promise.then(getQuizzes);

function getQuizzes(resposta) {
    allQuizzes.innerHTML = "";
    for (let i = 0; i < resposta.data.length; i++) {
        allQuizzes.innerHTML += `
        <button onclick = "searchQuizz(${resposta.data[i].id});" style = "background-image: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(0, 0, 0, 0.5) 64.58%, #000000 100%), url(${resposta.data[i].image});" class = "AllQuizzesQuizz">
            <p>${resposta.data[i].title}</p>
        </button>
        `;
    }
}

function searchQuizz(identificador) {
    qtdAcertos = 0;
    let promise = axios.get('https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes/' + identificador);
    promise.then(openQuizz);
}

function openQuizz(resposta) {
    window.scrollTo(0, 0);
    idQuizz = resposta.data.id;
    index.classList.add("escondido");
    specifiedQuizz.innerHTML = "";
    specifiedQuizz.innerHTML += `
    <div style = "background-image: linear-gradient(0deg, rgba(0, 0, 0, 0.57), rgba(0, 0, 0, 0.57)), url(${resposta.data.image});" class = "OpenedQuizzHeader">
        <h4>${resposta.data.title}</h4>
    </div>
    <div class = "OpenedQuizzQuestions"></div>
    <div class = "container escondido OpenedQuizzResultContainer"></div>
    `;
    let specifiedQuizzQuestions = document.querySelector(".OpenedQuizzQuestions");
    for (let i = 0; i < resposta.data.questions.length; i++) {
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
        let correctAnswer = "";
        levels = resposta.data.levels;
        for (let a = 0; a < resposta.data.questions[i].answers.length; a++) {
            if (resposta.data.questions[i].answers[a].isCorrectAnswer) {
                correctAnswer = resposta.data.questions[i].answers[a].text;
            }
        }
        for (let j = 0; j < resposta.data.questions[i].answers.length; j++) {
            arrayRandom[j] =
                `<button onclick = "chooseAnswer(this, '${correctAnswer}', ${i});" class = "OpenedQuizzQuestionOption">
                <img src = "${resposta.data.questions[i].answers[j].image}">
                <h3>${resposta.data.questions[i].answers[j].text}</h3>
            </button>
            `;
        }
        arrayRandom.sort(comparador);
        for (let j = 0; j < arrayRandom.length; j++) {
            specifiedQuizzQuestion[i].innerHTML += arrayRandom[j];
        }
    }
}

function comparador() {
    return Math.random() - 0.5;
};

function chooseAnswer(elemento, answer, whichQuestion) {
    let questions = document.querySelectorAll(".OpenedQuizzQuestion");
    let question = questions[whichQuestion].children[1];
    if (elemento.children[1].innerHTML == answer) {
        qtdAcertos += 1;
    }
    for (let i = 0; i < question.children.length; i++) {
        if (question.children[i].children[1].innerHTML == answer) {
            question.children[i].classList.add("certaResposta");
            if (question.children[i] != elemento) {
                question.children[i].classList.add("esbranquicado");
            }
            question.children[i].disabled = true;
        }
        else {
            question.children[i].classList.add("erradaResposta");
            if (question.children[i] != elemento) {
                question.children[i].classList.add("esbranquicado");
            }
            question.children[i].disabled = true;
        }
    }
    if (questions[whichQuestion + 1] != null) {
        setTimeout(scroll, 2000, questions[whichQuestion + 1]);
    }
    else {
        let result = document.querySelector(".OpenedQuizzResultContainer");
        result.classList.remove("escondido");
        qtdAcertos = (100 * qtdAcertos) / questions.length;
        for (let i = levels.length - 1; i >= 0; i--) {
            if (qtdAcertos >= levels[i].minValue) {
                result.innerHTML += `
                <div style = "background-color: #EC362D;" class = "OpenedQuizzResult">
                    <h5>${qtdAcertos.toFixed(0)}% de acerto: ${levels[i].title}</h5>
                </div>
                <div class = "openedQuizzResultContent">
                    <img src = "${levels[i].image}">
                    <p>${levels[i].text}</p>
                </div>
                `;
                break;
            }
        }

        // let header = document.querySelector(".OpenedQuizzHeader");
        // setTimeout(scroll, 2000, result);
        // specifiedQuizz.innerHTML += `
        // // <div class = "container buttons">

        // // specifiedQuizz.innerHTML +=`;
        // <div div class="buttons">

        //     <button class="button1">
        //         <h2 onclick="searchQuizz(${idQuizz});" style="color: white;">Reiniciar Quizz</h2>
        //     </button>;
        //     <button onclick="goHome();" class="button2">
        //         <h2 style="color: #818181;">Voltar para home</h2>
        //     </button >
        // </div>

        setTimeout(scroll, 2000, result);
    }
}

function goHome() {
    window.scrollTo(0, 0);
    index.classList.remove("escondido");
    specifiedQuizz.innerHTML = "";
}

function scroll(elemento) {
    elemento.scrollIntoView();
}

// código da amanda termina aqui

// código da kassia começa aqui

function startCreateQuizz() {
    const indexNone = document.querySelector(".container");
    indexNone.classList.add('escondido');

    const createQuizz = document.querySelector(".create-quizz");
    createQuizz.classList.remove('escondido');
}

function isValidUrl(string) {
    try {
        new URL(string);
    } catch (_) {
        return false;
    }
    return true;
}

function makeQuestions() {
    const title = document.querySelector('input[name=titulo]').value;
    const url = document.querySelector('input[name=url]').value;
    const qtdPerg = document.querySelector('input[name=qtdPerg]').value;
    const qtdNiveis = document.querySelector('input[name=qdtNiveis]').value;

    const validateTitle = title.length >= 20 && title.length <= 65;
    const validateUrl = isValidUrl(url);
    const validateQtdPerg = !isNaN(qtdPerg) && parseInt(qtdPerg) >= 3;
    const validateQtdNiveis = !isNaN(qtdNiveis) && parseInt(qtdNiveis) >= 2;

    if (validateTitle && validateUrl && validateQtdPerg && validateQtdNiveis) {
        const passPage = document.querySelector('.page-1');
        passPage.classList.add('escondido');

        const newPage = document.querySelector('.page-2');
        newPage.classList.remove('escondido');
    } else {
        alert('Ops, algo deu errado! Preencha os dados novamente ;)');
    }
}

function makeLevels(passPage2) {
    console.log('funcionando');
    const passPage = document.querySelector('.page-2');
    passPage.classList.add('escondido');

    const newPage = document.querySelector('.page-3');
    newPage.classList.remove('escondido');
}

function finishCreateQuizz(passPage3) {
    console.log('funcionando');
    const passPage = document.querySelector('.page-3');
    passPage.classList.add('escondido');

    const newPage = document.querySelector('.page-4');
    newPage.classList.remove('escondido');
}

function accessQuizz(AccessQuizz) {
    console.log('funcionando');
    const passPage = document.querySelector('.page-4');
    passPage.classList.add('escondido');

    // colocar a classe da página do quizz criado
    const newPage = document.querySelector('');
    newPage.classList.remove('escondido');
}

function backHome(backHome) {
    console.log('funcionando');
    const passPage = document.querySelector('.page-4');
    passPage.classList.add('escondido');

    const newPage = document.querySelector('.container');
    newPage.classList.remove('escondido');
}

// function armazenarInfosQuizz(quizzInfos) {
//     let infosQuizz = document.querySelector('.');
//     infosQuizz.innerHTML = quizzInfos.data

//     // montar a captação das informações no lugar certo, colocando em ordem e gerando a quantidade certa
// }

// let inputQuizz = new Object();
// inputQuizz.