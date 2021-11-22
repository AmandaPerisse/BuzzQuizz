let allQuizzes = document.querySelector(".indexAllQuizzesList");
let index = document.querySelector(".index");
let specifiedQuizz = document.querySelector(".OpenedQuizz");
let qtdAcertos = 0;
let levels = [];
let idQuizz = 0;
let payload = {};
let qtdPerg;
let qtdNiveis;

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
    qtdPerg = document.querySelector('input[name=qtdPerg]').value;
    qtdNiveis = document.querySelector('input[name=qdtNiveis]').value;

    const validateTitle = title.length >= 20 && title.length <= 65;
    const validateUrl = isValidUrl(url);
    const validateQtdPerg = !isNaN(qtdPerg) && parseInt(qtdPerg) >= 3;
    const validateQtdNiveis = !isNaN(qtdNiveis) && parseInt(qtdNiveis) >= 2;

    // if (validateTitle && validateUrl && validateQtdPerg && validateQtdNiveis) {
    const passPage = document.querySelector('.page-1');
    passPage.classList.add('escondido');

    const newPage = document.querySelector('.page-2');
    newPage.classList.remove('escondido');
    // } else {
    //     alert('Ops, algo deu errado! Preencha os dados novamente ;)');
    // }

    payload = { title: title, url: url }

    let questions = document.querySelector('.page-2 .info-quizz')
    for (let i = 0; i < parseInt(qtdPerg); i++) {
        questions.innerHTML += `
            <h7>Pergunta ${i + 1}</h7>
            <input class="input-quizz" type="text" name="title-quest${i + 1}" placeholder="Texto da pergunta">
            <input class="input-quizz" type="text" name="color-quest${i + 1}" placeholder="Cor de fundo da pergunta">
            <h7>Resposta correta</h7>
            <input class="input-quizz" type="text" name="correctAnswers-quest${i + 1}" placeholder="Resposta correta">
            <input class="input-quizz" type="text" name="urlAnswers-quest${i + 1}" placeholder="URL da imagem">
            <h7>Respostas Incorretas</h7>
            <input class="input-quizz" type="text" name="incorrectAnswers1-quest${i + 1}" placeholder="Resposta incorreta 1">
            <input class="input-quizz" type="text" name="urlAnswers1-quest${i + 1}" placeholder="URL da imagem 1">
            <input class="input-quizz" type="text" name="incorrectAnswers2-quest${i + 1}" placeholder="Resposta incorreta 2">
            <input class="input-quizz" type="text" name="urlAnswers2-quest${i + 1}" placeholder="URL da imagem 2">
            <input class="input-quizz" type="text" name="incorrectAnswers3-quest${i + 1}" placeholder="Pergunta incorreta 3">
            <input class="input-quizz" type="text" name="urlAnswers3-quest${i + 1}" placeholder="URL da imagem 3">
        `
    }

    let levels = document.querySelector('.page-3 .info-quizz')
    for (let i = 0; i < parseInt(qtdNiveis); i++) {
        levels.innerHTML += `
            <h7>Nível ${i + 1}</h7>
            <input class="input-quizz" type="text" name="title-level${i + 1}" placeholder="Título do nível">
            <input class="input-quizz" type="text" name="percent-level${i + 1}" placeholder="% de acerto mínima">
            <input class="input-quizz" type="text" name="url-level${i + 1}" placeholder="URL da imagem do nível">
            <input class="input-quizz" type="text" name="descrition-level${i + 1}" placeholder="Descrição do nível">
        `
    }
}

function isHexColor(hex) {
    return typeof hex === 'string'
        && hex.length === 6
        && !isNaN(Number('0x' + hex))
}

function makeLevels(passPage2) {
    let validate = true;
    let listQuestions = [];

    for (let i = 0; i < parseInt(qtdPerg); i++) {
        const title = document.querySelector(`input[name=title-quest${i + 1}]`).value;
        const colorQuest = document.querySelector(`input[name=color-quest${i + 1}]`).value;
        const correctAnswers = document.querySelector(`input[name=correctAnswers-quest${i + 1}]`).value;
        const urlAnswers = document.querySelector(`input[name=urlAnswers-quest${i + 1}]`).value;
        const incorrectAnswers1 = document.querySelector(`input[name=incorrectAnswers1-quest${i + 1}]`).value;
        const urlAnswers1 = document.querySelector(`input[name=urlAnswers1-quest${i + 1}]`).value;
        const incorrectAnswers2 = document.querySelector(`input[name=incorrectAnswers2-quest${i + 1}]`).value;
        const urlAnswers2 = document.querySelector(`input[name=urlAnswers2-quest${i + 1}]`).value;
        const incorrectAnswers3 = document.querySelector(`input[name=incorrectAnswers3-quest${i + 1}]`).value;
        const urlAnswers3 = document.querySelector(`input[name=urlAnswers3-quest${i + 1}]`).value;

        const validateTitle = title.length >= 20;
        const validateColor = isHexColor(colorQuest);
        const validateAnswers = correctAnswers != undefined && incorrectAnswers1 != undefined || incorrectAnswers2 != undefined || incorrectAnswers3 != undefined;
        const validateUrl = isValidUrl(urlAnswers) && isValidUrl(urlAnswers1) && isValidUrl(urlAnswers2) && isValidUrl(urlAnswers3);

        // if (!validateTitle || !validateColor || !validateAnswers || !validateUrl) {
        //     alert('Ops, algo deu errado! Preencha os dados novamente ;)');
        //     validate = false;
        //     break;
        // }

        let objQuestion = {
            title: title,
            color: colorQuest,
            answers: [{
                text: correctAnswers,
                image: urlAnswers,
                isCorrectAnswer: true
            }]
        }

        if (incorrectAnswers1 != undefined) {
            objQuestion.answers.push({
                text: incorrectAnswers1,
                image: urlAnswers1,
                isCorrectAnswer: false
            })
        }
        if (incorrectAnswers2 != undefined) {
            objQuestion.answers.push({
                text: incorrectAnswers2,
                image: urlAnswers2,
                isCorrectAnswer: false
            })
        }
        if (incorrectAnswers3 != undefined) {
            objQuestion.answers.push({
                text: incorrectAnswers3,
                image: urlAnswers3,
                isCorrectAnswer: false
            })
        }

        listQuestions.push(objQuestion);

    }

    if (validate) {
        payload = { ...payload, questions: listQuestions };
        console.log("🚀 ~ file: script.js ~ line 290 ~ makeLevels ~ payload", payload)

        console.log('funcionando');
        const passPage = document.querySelector('.page-2');
        passPage.classList.add('escondido');

        const newPage = document.querySelector('.page-3');
        newPage.classList.remove('escondido');
    }
}

function finishCreateQuizz(passPage3) {
    let validate = true;
    let listPercent = [];
    let listLevels = [];

    for (let i = 0; i < parseInt(qtdNiveis); i++) {
        const title = document.querySelector(`input[name=title-level${i + 1}]`).value;
        const percent = document.querySelector(`input[name=percent-level${i + 1}]`).value;
        const url = document.querySelector(`input[name=url-level${i + 1}]`).value;
        const descrition = document.querySelector(`input[name=descrition-level${i + 1}]`).value;

        const validateTitle = title.length >= 10;
        console.log("🚀 ~ file: script.js ~ line 322 ~ finishCreateQuizz ~ validateTitle", validateTitle)
        const validatePercent = parseInt(percent) >= 0 && parseInt(percent) <= 100;
        console.log("🚀 ~ file: script.js ~ line 324 ~ finishCreateQuizz ~ validatePercent", validatePercent)
        const validateUrl = isValidUrl(url);
        console.log("🚀 ~ file: script.js ~ line 326 ~ finishCreateQuizz ~ validateUrl", validateUrl)
        const validateDescrition = descrition.length >= 30;
        console.log("🚀 ~ file: script.js ~ line 328 ~ finishCreateQuizz ~ validateDescrition", validateDescrition)

        if (!validateTitle || !validatePercent || !validateUrl || !validateDescrition) {
            alert('Ops, algo deu errado! Preencha os dados novamente ;)');
            validate = false;
            break;
        }

        listPercent.push(percent);

        listLevels.push({
            title: title,
            image: url,
            text: descrition,
            // minValue: percent,
        })
    }

    // if (!listPercent.includes("0")) {
    //     alert("Pelo menos uma porcentagem de acerto deve ser 0%")
    //     validate = false;
    // }

    if (validate) {
        payload = { ...payload, levels: listLevels };
        console.log('funcionando');
        const passPage = document.querySelector('.page-3');
        passPage.classList.add('escondido');

        const newPage = document.querySelector('.page-4');
        newPage.classList.remove('escondido');
    }
}

function accessQuizz(AccessQuizz) {
    const passPage = document.querySelector('.page-4');
    passPage.classList.add('escondido');

    // colocar a classe da página do quizz criado
    const newPage = document.querySelector('');
    newPage.classList.remove('escondido');

}

function backHome(backHome) {
    console.log('funcionando');
    document.location.reload(true)
}

// function armazenarInfosQuizz(quizzInfos) {
//     let infosQuizz = document.querySelector('.');
//     infosQuizz.innerHTML = quizzInfos.data

//     // montar a captação das informações no lugar certo, colocando em ordem e gerando a quantidade certa
// }

