let allQuizzes = document.querySelector(".indexAllQuizzesList");
let index = document.querySelector(".index");
let specifiedQuizz = document.querySelector(".OpenedQuizz");
let qtdAcertos = 0;
let levels = [];


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
    let promise = axios.get('https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes/' + identificador);
    promise.then(openQuizz);
}

function openQuizz(resposta) {
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
}

function chooseAnswer(elemento, answer, whichQuestion) {
    let questions = document.querySelectorAll(".OpenedQuizzQuestion");
    let question = questions[whichQuestion].children[1];
    if (elemento.children[1].innerHTML == answer){
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
    if(questions[whichQuestion+1] != null){
        setTimeout(sroll, 2000, questions[whichQuestion+1]);
    }
    else{
        let result = document.querySelector(".OpenedQuizzResultContainer");
        result.classList.remove("escondido");
        qtdAcertos = (100*qtdAcertos)/questions.length;
        for(let i = levels.length-1; i>= 0; i--){
            if (qtdAcertos >= levels[i].minValue){
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
        setTimeout(sroll, 2000, result);
    }
}

function sroll(elemento){
    elemento.scrollIntoView();
}

// Início da criação de um Quizz

/*const makeQuizz = axios.post("https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes", {
    title: "O quão Potterhead é você?",
    image: "https://s3-alpha-sig.figma.com/img/60f6/4bae/cb4c4e815fc36d9f0f0579a657241eba?Expires=1638144000&Signature=cqsR1gZIngLBQPZ6LeL~vWnXsiDVfmQfBKYm6yHFxTCpkJNI4l~uNmpM4KredvdqP4M4T8h2xvw-kEkW91z3Ii8L~jTr-AIxLemInFf6fpM1-9tG2vQjPhlIeSgyhGfLiR5p53jnvg~uRzAgjshXhSaSxCjbyCtFzBmvzLYS8Zq0GxXw2MKCq3xRg18DnPy~qpJTrPQnSwp-h1dEFiVC5vcriL42Rn4qCtaKpDlf8KPGTVZO8WmsDKlW-IzcZhbLaRpc3HacjA9EELnZR8nZzw22qHuROyoyhKmVGM1OU2OF9Nej~Y~p5eFFXWzcLQ0VjG-0dApwkzDBqnpchxoF8w__&Key-Pair-Id=APKAINTVSUGEWH5XD5UA",
    questions: [
        {
            title: "Em qual animal Olho-Tonto Moody transfigurou Malfoy?",
            color: "#434CA0",
            answers: [
                {
                    text: "Gatíneo",
                    image: "https://s3-alpha-sig.figma.com/img/7212/aa92/e0229a2cb5aea15ab3fd2b5d36cb9a60?Expires=1638144000&Signature=E-djO4UvnSNyGrh4porzOF3~ateDCWBO7F03TgYzJFjSa02ZWO-YximHyOVzp2mV87abw44lrUzQjKrJ44Acd-S2xSfkrtbDvTQN3-QiLDB-fJH8ml48RD6RD-X7V9oKUBg7NFaZzmq~V3ra~iewSHFKNFS9d5KUwQanKvcqYIYKgmkEaePHMifpKIJ3FSjXHeV1JTP7VLnuFKIM5qbwhCJVlYJsv29HmJDft6BpbXsss0atSrtN2VdLkr4vnnbeGl9luFqV0MtM3djI5FjBhy3FUGrNvU2MPEUVEfChpLh1zcER1JBAsXC8iW3fELbPU0WwN2P9A1l5Ob5fSenSIA__&Key-Pair-Id=APKAINTVSUGEWH5XD5UA",
                    isCorrectAnswer: false
                },
                {
                    text: "Ratata",
                    image: "https://s3-alpha-sig.figma.com/img/6070/8f4d/4fe85b83d17f9b3c7faf3a738a2df140?Expires=1638144000&Signature=MIFffQtyvsz8Cb3c5F~KI6DCs8nJhw8sIs6D2jAusXPFAoDI~jIbRR8CEqI5HBuLxMuGAA3x2yEWTLBrx0vaHVYxQW7meyl8Qf1PJU~QeDuqM99PquCyvW8OXtGT1YUZnR5XF-qdhgkpwGhzCze0rF-KQIYpDC4S6ah3tCTj4C2KsS-B4fmWS4rnl2kWONRJdWMAWOnB-euSct3qU3gRxn7Iq1G15E3vMc0eUBoSIHooyCEaDMKyJyA0QvduyIKJ3FqB2WCx6-8CC~XqrO4K9sBDLYOrrqnqdwmzqyOGp2b9v~bFK~FzXJXGjvtth9W25BW5KCsREzOFUCjVmZB1hA__&Key-Pair-Id=APKAINTVSUGEWH5XD5UA",
                    isCorrectAnswer: false
                },
                {
                    text: "Sapo gordo",
                    image: "https://s3-alpha-sig.figma.com/img/c7e0/64f3/0145b79667e2e9f0f8193b64984531af?Expires=1638144000&Signature=LPJeK-SLHYDHkHbcn-ZSs7PNM2E4WcDnTIQzWNtdK7wVysYL9ML2B3bhPBfzs0al4b0UHoMP5dEFNCkgmYDmWy1zRr2KWQzVUSkQWmYKVZX2~yv-1aT2nvLDSUd0kCXMYII314M-dssachHGjvlzT6rjis0llYC-UTO9y5DhVfaBqmz~FGxUwkxvGZ9PeIS7E4MRAhk1R~6gjL59QEXD04kwpKmGOfHCjYpNJSoNk3d0LEZzb4vzJdk3Is9A09oTfkJ1PtBgulwinCu8VHIyM0m3LHukyZIA0jeNo2YOkXX4yK8xLKjv-z7QgMaQNTFMu2dXBTAnC0zEOL8~4ELuDg__&Key-Pair-Id=APKAINTVSUGEWH5XD5UA",
                    isCorrectAnswer: false
                },
                {
                    text: "Mustela putorius (o Furão)",
                    image: "https://s3-alpha-sig.figma.com/img/4bfb/7d5f/52d4ab9bee7b444cfed9506a1c2bc0ea?Expires=1638144000&Signature=Eec70CIe4MMPSI1sER~FsSP2W7Y6WCXg6yxFMbY8M7-DO5wDf3Y72G2AuJzz9ujtAXDEss92nvNQ20~H76EP9byY1vUb--mHYLzWzAusI5Z99hZr12XCVjeewEyBeNEtTE-vN2s400nIVCx1~8rlw80wMKcRd0nDMbFAoXnfbtSe9KYbgCQGjFpKDJeGXOOMefr9GaAHZjMeoA136uNeEYQhz0M7eH7bC6e~mS6y3YSRccNUu21~L69mJZuGOJpwigIVJwz~LWp2MBUkhDyBH9HdumuZ5mSA3ZIFrBulQkBJeCP1WrQ5k0i9rYfnLQiKDRt1vEAfswNoIl7Z88tZtg__&Key-Pair-Id=APKAINTVSUGEWH5XD5UA",
                    isCorrectAnswer: true
                }
            ]
        },
        {
            title: "Qual dos objetos abaixo NÃO é uma horcrux?",
            color: "#A0438D",
            answers: [
                {
                    text: "The boy who lived",
                    image: "https://s3-alpha-sig.figma.com/img/2740/7e61/76bf2840f187b7ce4cb283ea504a15ef?Expires=1638144000&Signature=CgMViY~br3d0wEDyrMVktK5F7mHESpVWO4L50TD3wTOVYOq6fymNHmtPCpbun~B7fJKVlRw9VzuXdhwdYQThzESuFOzu2AV5O5Q0j3tm99cb~YCj3dt3R7pLiXigsd6X9P2CZI5Jd~AYk~i8Nq8e4KJXgz0p4EVyx5M5Zh93VmR43L4Y3oUU~8Jk6jLNogv1ZjP8odO~bqo5CdgzKfQY2CIbUdWeD7hyBT-nijy~0eZxROOP-5V3P-eJ21UKNa5Zw1vM9~Vm3ZHV-MJSbfmb4g745~BjzSW0Q-Im4vnUULyQC8qHgx2C1nj9wXAQK85R-zjbq1y1FEdELf4rd~xa6Q__&Key-Pair-Id=APKAINTVSUGEWH5XD5UA",
                    isCorrectAnswer: false
                },
                {
                    text: "O livro monstruoso dos monstros",
                    image: "https://s3-alpha-sig.figma.com/img/3755/8b53/b9c97f627e2eef3a1ced585d7854cc4a?Expires=1638144000&Signature=QAvlsYD35ooPKmRwkbOKDtoVAmzZau2AUKjKOs9LahenZfBCvS8cY~7fSnQHwT4RE750rr1fwKrFxHpg6ZH59KgTB9euTA~~U8C5Dpg8PKuLGP5dQYWJQVjJAXD3epUrGlQxQG75b1-04v1R0LmVCEOwAoN6dCJIOkp-tg6VjgntTOHmc5PTJfOr6Junlrqf50XEgbDMRIW~oUG9qfzzsOIwNZ~Vny26QGAGzYjU8q1ryLoISOXxXYYVZDpI5EEJm~BZlpqqSNfF9Ec4byb7WlQgA15l3L8FyqueRJjcfCYaw3WuQue9czYb2ut9Xepf8XNLTL3zHOP4-kPJaW54tw__&Key-Pair-Id=APKAINTVSUGEWH5XD5UA",
                    isCorrectAnswer: true
                },
                {
                    text: "Anel velho",
                    image: "https://s3-alpha-sig.figma.com/img/90b9/a1c9/a69e93b136bcf4c2f58e546fe7c5eb7f?Expires=1638144000&Signature=ZyodZNDe9EOG0Eq~1tNS4g1JPWT9~1V~BEBioOJTXcBgxCPHUzUBhEKI4HmwJ0aMJH3YU6plxj4Qa-ZXdXdDic1eKEIH4fL4u9uqdjFyDjDxKhJxputzD0jzWzTGjJ5xZva6lRcvJq0YVoZAM9K5SsknOId3MuSQqFsYLDrTt2EpywjoA2LS9pRnIaYQOFeLhOIR32xRC-3AEMyEQ13lIz6Pb2nHA0Iy0rIxWWtcPXA3H6jVItDSaUz5aC~DcQXZbY7ShQubg~T0DWCmiJ75STQpl1aggwOLWCazBVcGIoqHXmTR7NGprV7hB-a9FwST3vZnCfU~xVKtWLhc-8SRww__&Key-Pair-Id=APKAINTVSUGEWH5XD5UA",
                    isCorrectAnswer: false
                },
                {
                    text: "Diadema da Revenclaw",
                    image: "https://s3-alpha-sig.figma.com/img/44b3/55b9/309baf633b5cf3311081d33cd5ae90af?Expires=1638144000&Signature=B56BRF2~-own79pUSmSM5tUJ6spc098~ynN0-Ot25Gh75nOn~A0wR0ar~iC9SWOZCXBhGwAshCRwIYyjyVPlW5YPYMBKDqiVyfbYT0ZDGsuqwswo1jkYeV9Zy2htJX~ehBbatLB1k4LNptABeiSCQVnoms49EPmJI1UXnPBa8STn7BQuZeVLrDV7yo01Q1FS-ugwd2KrKbW5CF3ugXlwnwutk9xDRvozvoXTiHqcWRCS0fXwf4QJyANn~Op0pw7jhSLRbzFhrmsjPZS2zlzpBBJty1I3ks80DA2eUYKwoSWvtebjrqISB6pr1VscYP5OpbE2VdooGWK4bMK9wwdpMA__&Key-Pair-Id=APKAINTVSUGEWH5XD5UA",
                    isCorrectAnswer: false
                }
            ]
        },
        {
            title: "Em quem foi o primeiro beijo de Harry?",
            color: "#123456",
            answers: [
                {
                    text: "Cho Chang",
                    image: "http://images5.fanpop.com/image/photos/28200000/Cho-Chang-promo-pics-ravenclaw-28214458-1919-2560.jpg",
                    isCorrectAnswer: true
                },
                {
                    text: "Gina Weasley",
                    image: "http://3.bp.blogspot.com/_8WWXEMIBGG4/SFEMxE_7vfI/AAAAAAAAAEc/QuhKEeq4cec/s320/18738813.jpg",
                    isCorrectAnswer: false
                },
                {
                    text: "Hermione Granger",
                    image: "https://upload.wikimedia.org/wikipedia/en/thumb/d/d3/Hermione_Granger_poster.jpg/220px-Hermione_Granger_poster.jpg",
                    isCorrectAnswer: false
                },
                {
                    text: "Luna Lovegood",
                    image: "https://static.wikia.nocookie.net/harrypotter/images/e/e0/00b9f68d18d99b06ed839d0b86425a0c.jpg/revision/latest/top-crop/width/360/height/450?cb=20201128020550&path-prefix=pt-br",
                    isCorrectAnswer: false
                }
            ]
        }
    ],
    levels: [
        {
            title: "Nível básico: Só as clichês",
            image: "https://img.quizur.com/f/img60a5389b511b19.70117162.jpg?lastEdited=1621440693",
            text: "Descrição do nível 1",
            minValue: 0
        },
        {
            title: "Nível médio: Quero ver!",
            image: "https://img.quizur.com/f/img619514d2dc29e4.78114568.jpg?lastEdited=1637160157",
            text: "Descrição do nível 2",
            minValue: 50
        },
        {
            title: "Nível difícil: Poxa! Você realmente é um Potterhead",
            image: "https://static1.purebreak.com.br/articles/8/15/12/8/@/74547-harry-hermione-e-rony-de-harry-diapo-2.jpg",
            text: "Descrição do nível 2",
            minValue: 90
        }
    ]
}
)*/

// Final da criação do Quizz