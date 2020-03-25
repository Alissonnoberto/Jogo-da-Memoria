'use strict';
// variáveis do jogo
let clickCount = 0;
let hits = 0;
let guesses = 0;
let card = {};

const verifyVictory = () => {
    // todas as cartas encontradas
    if (hits === 8) {
        setTimeout(() => {
            clearInterval(updateTimer);
            showVictoryModel();
        }, 2000);
    }
};

const verifyCards = (event) => {
    setTimeout(() => { // remove os efeitos anteriores
        document.getElementById(card.id).classList.remove('flipInY');
        document.getElementById(event.target.id).classList.remove('flipInY');
    }, 100);
    if (card.name === event.target.className) { // quando acertar
        hits++;
        document.getElementById('hits').innerText = hits; // incrementar o contador
        // marca as cartas
        document.getElementById(card.id).classList = `${card.name} flash`;
        document.getElementById(card.id).style.backgroundImage = 'linear-gradient(to right bottom, rgb(2, 235, 247), rgb(114, 199, 204), rgb(176, 117, 244), rgb(150, 14, 247))';
        document.getElementById(event.target.id).classList = `${event.target.className} flash`;
        document.getElementById(event.target.id).style.backgroundImage = 'linear-gradient(to bottom right, rgb(2, 235, 247), rgb(114, 199, 204), rgb(176, 117, 244), rgb(150, 14, 247))';
        clickCount = 0;

        verifyVictory();
    } else {
        // quando errar
        setTimeout(() => { // retorna os cards para exibição normal
            document.getElementById(card.id).style.background = 'rgb(43, 41, 45)';
            document.getElementById(event.target.id).style.background = 'rgb(43, 41, 45)';
            clickCount = 0;
            card = {};
        }, 1200);
    }
};

const selectCard = (event) => {
    if (event.target.nodeName.toLowerCase() === 'i') {
        // mostra a carta
        event.target.style.backgroundImage = 'linear-gradient(to right bottom, rgb(2, 235, 247), rgb(114, 199, 204), rgb(176, 117, 244), rgb(150, 14, 247))';
        event.target.classList = `${event.target.className} flipInY`;
        clickCount++;

        // primeiro carta
        if (clickCount === 1) {
            card = { name: event.target.className, id: event.target.id };
        } // segunda carta, verifica se corresponde ao primeiro
        else {
            verifyCards(event);
            // incrementa o contador de "palpites"
            guesses++;
            document.getElementById('guesses').innerText = guesses;
        }
    }
};

const handleClick = (event) => {
    if (event.target.id === card.id || clickCount >= 2 || event.target.style.backgroundImage === 'linear-gradient(to right bottom, rgb(2, 235, 247), rgb(114, 199, 204), rgb(176, 117, 244), rgb(150, 14, 247))') return;
    selectCard(event);
};

const prepareBoard = () => {
    let cardNames = ['fa-spider', 'fa-frog', 'fa-horse', 'fa-fish', 
        'fa-cat', 'fa-crow', 'fa-hippo', 'fa-dog'];
    let deck = [...cardNames, ...cardNames];

    // embaralhar as cartas
    deck.sort((a, b) => {
        return Math.random() - Math.random();
    });

    // coloca as cartas no tabuleiro
    for (let i = 1; i <= 16; i++) {
        document.getElementById(i.toString()).classList.add(deck[i - 1]);
    }
    // adiciona animate css para as cartas
    for (let i of document.querySelectorAll('.board-row i')) {
        i.classList.add('animated');
    }
};

const resetBoard = () => {
    document.getElementById('board').classList = 'animated zoomOut';
    setTimeout(() => {
        // resetar as variáveis
        clickCount = 0;
        hits = 0;
        guesses = 0;
        card = {};
        // reseta a pontuação
        document.getElementById('hits').innerText = 0;
        document.getElementById('guesses').innerText = 0;
        // reset classes and background of cards
        for (let i of document.querySelectorAll('.board-row i')) {
            i.classList = 'card fas';
            i.style.background = 'rgb(43, 41, 45)';
        }
        prepareBoard();
        document.getElementById('board').classList = 'animated zoomIn';
    }, 500);
    // reseta o tempo
    document.getElementById('clock').innerText = '00:00:00';
};

const showVictoryModel = () => {
    // ocultar conteúdo principal
    document.getElementsByTagName('MAIN')[0].style.opacity = 0;
    document.getElementById('win-model').classList = 'model animated fadeIn slower';
    document.getElementById('win-model').style.display = 'flex';
    document.getElementById('conclusion-time').innerText = document.getElementById('clock').innerText;
    // muda o fundo
    document.body.style.backgroundImage = 'linear-gradient(to right bottom, rgb(70,130,180), rgb(173, 216, 230))';

    // qualificar o resultado
    let stars = document.getElementsByClassName('fas fa fa-star');
    let coloredStars = 0;
    if (guesses <= 14) coloredStars = 3;
    else if (guesses <= 16) coloredStars = 2;
    else if (guesses <= 18) coloredStars = 1;
    else coloredStars = 1;
    // paint the stars
    for (; coloredStars > 0; coloredStars--) {
        stars[coloredStars - 1].style.color = 'rgb(247, 232, 27)';
        stars[coloredStars - 1].style.textShadow = '2px 2px black';
    }
};

const hideVictoryModel = () => {
    location.reload();
};

const updateTimer = () => {
    let [hh, mm, ss] = document.getElementById('clock').innerText.split(':');
    // adicionar 1 segundo
    ss = parseInt(ss) + 1;
    if (parseInt(ss) === 60) { // transforma segundos em minutos
        mm = parseInt(mm) + 1;
        ss = 0;
    }
    if (parseInt(mm) === 60) { // transforma minutos em horas
        hh = parseInt(hh) + 1;
        mm = 0;
    } // ajusta os zeros
    hh = `${hh}`.length > 1 ? hh : `0${hh}`;
    mm = `${mm}`.length > 1 ? mm : `0${mm}`;
    ss = `${ss}`.length > 1 ? ss : `0${ss}`;
    // atualiza o relógio
    document.getElementById('clock').innerText = `${hh}:${mm}:${ss}`;
};

const startGame = () => {
    // esconde o botão iniciar
    document.getElementById('start').style.display = 'none';
    // mostra os botões do jogo e do tabuleiro
    document.getElementsByTagName('MAIN')[0].style.display = 'flex';
    // coloca as cartas aleatoriamente no tabuleiro 
    prepareBoard();
    document.getElementById('board').addEventListener('click', handleClick);
    // adiciona funções de botão
    document.getElementById('reset').addEventListener('click', resetBoard);
    // adiciona o evento de fechar a tela de vitória
    document.getElementById('model-close').addEventListener('click', hideVictoryModel);
    // atualiza o relógio
    setInterval(updateTimer, 1000);
};

// espera o DOM para ser carregado
document.addEventListener('DOMContentLoaded', () => {
    // adiciona evento ao botão iniciar jogo
    document.getElementById('start').addEventListener('click', startGame);
});
