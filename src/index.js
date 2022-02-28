let gameCount = 0;
let gameWon = 0;
let gameDraw = 0;
let gameLost = 0;
let moveCount = 1; // for advanced only
let playerTurn = true
let board = [['_', '_', '_'], ['_', '_', '_'], ['_', '_', '_']]
let playerOne = 'x'
let playerTwo = 'o'
let vsBot = true
let winner = false
let currentClass = ''
let level = ''

const getBoard = document.getElementById('board');
const cellElements = document.querySelectorAll('.cell');
const messageBox = document.getElementById('messageBox');
const gameOverMsg = document.getElementById('gameOverMsg');
const restartBtn = document.getElementById('restartBtn');
const radioButtons = document.querySelectorAll('input[type="radio"]');
const startBtn = document.getElementById('startBtn');
const quitBtn = document.getElementById('quitBtn');

startBtn.addEventListener('click', loadGame);

function loadGame() {

    for (let i = 0; i < radioButtons.length; i++) {
        if (radioButtons[i].checked) {
            level = radioButtons[i].value;
        }
    }

    if (level == '') {
        restartBtn.addEventListener('click', ()=>{messageBox.classList.remove('show')},{once: true});
        alertMsg();
    } else {
        restartBtn.addEventListener('click', startGame);
        alertMsg(level);
    }
}

function startGame() {
    gameCount++
    playerTurn = true
    moveCount = 1;
    document.getElementsByTagName('radio').disabled = true;

    getBoard.classList.remove(playerOne)
    getBoard.classList.remove(playerTwo)

    cellElements.forEach(cell => {
        cell.setAttribute('data-marker', '');
        cell.classList.remove(playerOne);
        cell.classList.remove(playerTwo);
        cell.addEventListener('click', handleClick, { once: true })
    });
    restartBtn.addEventListener('click', startGame);
    quitBtn.addEventListener('click', () => {location.reload()});

    getBoard.classList.add('x')
    messageBox.classList.remove('show');
    startBtn.style.display = "none";
    quitBtn.style.display = "inline";
    board = [['_', '_', '_'], ['_', '_', '_'], ['_', '_', '_']]

    if (gameCount % 2 == 0) {
        document.querySelector('#display > p').innerHTML ="Bot's Turn";
        setTimeout(botMove, 500);
    } else {
        document.querySelector('#display > p').innerHTML ="Player's Turn";
    }
}

function switchPlay() {
    playerTurn = !playerTurn //switch player
    
    getBoard.classList.remove(playerOne);
    getBoard.classList.remove(playerTwo);
    if (playerTurn) {
        getBoard.classList.add(playerOne)
    } else {
        getBoard.classList.add(playerTwo)
    }
}

function createBoard(currentClass, cellPick) {
    switch (cellPick) {
        case 0:
            board[0][0] = currentClass;
            break;
        case 1:
            board[0][1] = currentClass;
            break;
        case 2:
            board[0][2] = currentClass;
            break;
        case 3:
            board[1][0] = currentClass;
            break;
        case 4:
            board[1][1] = currentClass;
            break;
        case 5:
            board[1][2] = currentClass;
            break;
        case 6:
            board[2][0] = currentClass;
            break;
        case 7:
            board[2][1] = currentClass;
            break;
        case 8:
            board[2][2] = currentClass;
            break;
    }
}

function handleClick(event) {
    const cell = event.target; // event.currentTarget

    currentClass = playerTurn ? playerOne : playerTwo;

    let cellPick = parseInt(cell.getAttribute('data-cell'))
    createBoard(currentClass, cellPick)

    placeMarker(cell, currentClass);
    winner = checkWin(currentClass);
    document.querySelector('#display > p').innerHTML ="Bot's Turn";

    if (winner) {
        endGame(false);
    } else if (checkDraw()) {
        endGame(true);
    } else {
        switchPlay();
        if (vsBot) {
            setTimeout(botMove, 500);
        }
    }
    moveCount++
}

function botMove() {

    let check = evaluate(board, currentClass);
    let emptyCell = []
    cellElements.forEach((cell, index) => {
        if (cell.getAttribute('data-marker') == '') {
            emptyCell.push(index);
        }
    })

    currentClass = playerTurn ? playerOne : playerTwo;

    switch (level) {
        case 'A':
            advanced(currentClass, check);
            break;
        case 'I':
            if (check <= 8) {
                createBoard(currentClass, check)
                cellElements[check].classList.add(currentClass)
                cellElements[check].dataset.marker = currentClass;
                cellElements[check].removeEventListener('click', handleClick);
            } else {
                let randomCell = Math.floor(Math.random() * emptyCell.length)
                createBoard(currentClass, emptyCell[randomCell])

                cellElements[emptyCell[randomCell]].classList.add(currentClass)
                cellElements[emptyCell[randomCell]].dataset.marker = currentClass;
                cellElements[emptyCell[randomCell]].removeEventListener('click', handleClick);
            }
            break;
        case 'B':
            let randomCell = Math.floor(Math.random() * emptyCell.length)
            createBoard(currentClass, emptyCell[randomCell])

            cellElements[emptyCell[randomCell]].classList.add(currentClass)
            cellElements[emptyCell[randomCell]].dataset.marker = currentClass;
            cellElements[emptyCell[randomCell]].removeEventListener('click', handleClick);
            break;
    }

    winner = checkWin(currentClass);
    if (winner) {
        endGame(false);
    } else if (checkDraw()) {
        endGame(true);
    } else {
        switchPlay();
        document.querySelector('#display > p').innerHTML ="Player's Turn";
    }
    moveCount++
}

function advanced(currentClass, blockCheck) {
    let winCheck = evaluate(board, currentClass);
    let emptyCell = []
    let randomCell = '';

    if (winCheck <= 8) {
        botMarker(currentClass, winCheck);
    } else if (blockCheck <= 8) {
        botMarker(currentClass, blockCheck);
    } else {
        blockCheck = 0;
        switch (moveCount) {
            case 1:
                emptyCell = [0, 2, 6, 8]
                randomCell = Math.floor(Math.random() * emptyCell.length)
                botMarker(currentClass, emptyCell[randomCell]);
                break;
            case 2:
                if (board[1][1] == '_') {
                    botMarker(currentClass, 4);
                } else {
                    emptyCell = [0, 2, 6, 8]
                    let randomCell = Math.floor(Math.random() * emptyCell.length)
                    botMarker(currentClass, emptyCell[randomCell]);
                }
                break;
            case 3:
                for (let i = 1; i < 8; i += 2) {
                    if (cellElements[i].getAttribute('data-marker') == !currentClass) {
                        emptyCell.push(i);
                    }
                }
                if (emptyCell.length < 4) { // opponent take side
                    for (let i = 0; i <= 8; i += 2) {
                        if (cellElements[i].getAttribute('data-marker') == currentClass) {
                            if (i == 0) {
                                if (board[1][0] != '_') {
                                    blockCheck = 2;
                                } else { blockCheck = 6; }
                            } else if (i == 2) {
                                if (board[0][1] != '_') {
                                    blockCheck = 8
                                } else { blockCheck = 0; }
                            } else if (i == 6) {
                                if (board[1][0] != '_') {
                                    blockCheck = 8;
                                } else { blockCheck = 0; }
                            } else {
                                if (board[1][2] != '_') {
                                    blockCheck = 6;
                                } else { blockCheck = 2; }
                            }
                        }
                    }
                    botMarker(currentClass, blockCheck)
                } else if (board[1][1] != '_') { //opponent take center
                    for (let i = 0; i <= 8; i += 2) {
                        if (cellElements[i].getAttribute('data-marker') == currentClass) {
                            if (i == 0) { blockCheck = 8; }
                            else if (i == 2) { blockCheck = 6; }
                            else if (i == 6) { blockCheck = 2; }
                            else { blockCheck = 0 };
                        }
                    }
                    botMarker(currentClass, blockCheck)
                } else {
                    for (let i = 0; i <= 8; i += 2) {
                        if (cellElements[i].getAttribute('data-marker') == currentClass) {
                            if (i == 0) {
                                if (board[2][2] == '_') {
                                    blockCheck = 8;
                                } else {blockCheck = 2}
                            } else if (i == 2) {
                                if (board[2][0] == '_') {
                                    blockCheck = 6;
                                } else {blockCheck = 0}
                            } else if (i == 6) {
                                if (board[0][2] == '_') {
                                    blockCheck = 2;
                                } else {blockCheck = 8}
                            } else {
                                if (board[0][0] == '_') {
                                    blockCheck = 0;
                                } else {blockCheck = 6}
                             }
                        }
                    }
                    botMarker(currentClass, blockCheck)
                }
                break;
            case 4:
                for (let i = 1; i < 8; i += 2) {
                    if (cellElements[i].getAttribute('data-marker') == '') {
                        emptyCell.push(i);
                    } else if (cellElements[i].getAttribute('data-marker') != currentClass && cellElements[i].getAttribute('data-marker') != '') {
                        if (i == 1 || i == 7) {
                            blockCheck = i + 1;
                        } else if (i == 5) {
                            blockCheck = 2
                        } else { blockCheck = 0 }
                    }
                }
                if (emptyCell.length == 4) {
                    randomCell = Math.floor(Math.random() * emptyCell.length)
                    botMarker(currentClass, emptyCell[randomCell]);
                } else {
                    botMarker(currentClass, blockCheck);
                }
                break;
            case 5:
                if (board[1][1] == '_') {
                    botMarker(currentClass, 4);
                }
                break;
            default:
                cellElements.forEach((cell, index) => {
                    if (cell.getAttribute('data-marker') == '') {
                        emptyCell.push(index);
                    }
                })
                randomCell = Math.floor(Math.random() * emptyCell.length)
                botMarker(currentClass, emptyCell[randomCell]);
                break;
        }
    }
}

function botMarker(currentClass, index) {
    createBoard(currentClass, index)
    cellElements[index].classList.add(currentClass)
    cellElements[index].dataset.marker = currentClass;
    cellElements[index].removeEventListener('click', handleClick);
}

function endGame(draw) {
    restartBtn.innerText = `Restart`;
    if (draw) {
        gameDraw += 1
        gameOverMsg.innerText = 'Game Tie!';
    } else {
        if (gameCount % 2 != 0) {
            gameOverMsg.innerText = `${playerTurn ? 'Player' : 'Bot'} Wins!`;
            if (playerTurn) {
                gameWon += 1;
            } else {
                gameLost += 1;
            }
        } else {
            gameOverMsg.innerText = `${playerTurn ? 'Bot' : 'Player'} Wins!`;
            if (!playerTurn) {
                gameWon += 1;
            } else {
                gameLost += 1;
            }
        }
    }
    messageBox.classList.add('show');
    insertRecord();
}

function alertMsg(level = 'X') {
    if (level == 'X') {
        restartBtn.innerText = `Click Me`;
        gameOverMsg.innerText = `Yo!!! .. you forgot to select a level`;
        messageBox.classList.add('show');
    } else {
        restartBtn.innerText = `Click Me`;
        gameOverMsg.innerText = `Let the games begin!!!`;
        messageBox.classList.add('show');
    }

}

function placeMarker(cell, currentClass) {
    cell.dataset.marker = currentClass;
    cell.classList.add(currentClass);
}

function checkWin(currentPlayer) {
    let winner = false
    cellElements.forEach(() => {

        if (cellElements[0].getAttribute('data-marker') == currentPlayer) {
            if (cellElements[0].getAttribute('data-marker') == cellElements[1].getAttribute('data-marker')
                && cellElements[0].getAttribute('data-marker') == cellElements[2].getAttribute('data-marker')) {
                winner = true;
            }
            if (cellElements[0].getAttribute('data-marker') == cellElements[3].getAttribute('data-marker')
                && cellElements[0].getAttribute('data-marker') == cellElements[6].getAttribute('data-marker')) {
                winner = true;
            }
            if (cellElements[0].getAttribute('data-marker') == cellElements[4].getAttribute('data-marker')
                && cellElements[0].getAttribute('data-marker') == cellElements[8].getAttribute('data-marker')) {
                winner = true;
            }
        }

        if (cellElements[1].getAttribute('data-marker') == currentPlayer) {
            if (cellElements[1].getAttribute('data-marker') == cellElements[4].getAttribute('data-marker')
                && cellElements[1].getAttribute('data-marker') == cellElements[7].getAttribute('data-marker')) {
                winner = true;
            }
        }

        if (cellElements[2].getAttribute('data-marker') == currentPlayer) {
            if (cellElements[2].getAttribute('data-marker') == cellElements[4].getAttribute('data-marker')
                && cellElements[2].getAttribute('data-marker') == cellElements[6].getAttribute('data-marker')) {
                winner = true;
            }
            if (cellElements[2].getAttribute('data-marker') == cellElements[5].getAttribute('data-marker')
                && cellElements[2].getAttribute('data-marker') == cellElements[8].getAttribute('data-marker')) {
                winner = true;
            }
        }

        if (cellElements[3].getAttribute('data-marker') == currentPlayer) {
            if (cellElements[3].getAttribute('data-marker') == cellElements[4].getAttribute('data-marker')
                && cellElements[3].getAttribute('data-marker') == cellElements[5].getAttribute('data-marker')) {
                winner = true;
            }
        }

        if (cellElements[6].getAttribute('data-marker') == currentPlayer) {
            if (cellElements[6].getAttribute('data-marker') == cellElements[7].getAttribute('data-marker')
                && cellElements[6].getAttribute('data-marker') == cellElements[8].getAttribute('data-marker')) {
                winner = true;
            }
        }
    });

    return winner;
}

function checkDraw() {
    if ((cellElements[0].getAttribute('data-marker') != '') && (cellElements[1].getAttribute('data-marker') != '') && (cellElements[2].getAttribute('data-marker') != '') &&
        (cellElements[3].getAttribute('data-marker') != '') && (cellElements[4].getAttribute('data-marker') != '') && (cellElements[5].getAttribute('data-marker') != '') &&
        (cellElements[6].getAttribute('data-marker') != '') && (cellElements[7].getAttribute('data-marker') != '') && (cellElements[8].getAttribute('data-marker') != '')) {

        return true;
    } else { return false }
}

function evaluate(b, currentClass) {
    let check = currentClass
    // Checking for Rows for X or O victory.
    for (let row = 0; row < 3; row++) {
        if (b[row][0] == b[row][1] && b[row][2] == '_' && b[row][0] == check) {
            if (row == 0) {
                return 2;
            } else if (row == 1) {
                return 5
            } else { return 8 }
        }
        if (b[row][0] == b[row][2] && b[row][1] == '_' && b[row][0] == check) {
            if (row == 0) {
                return 1;
            } else if (row == 1) {
                return 4
            } else { return 7 }
        }
        if (b[row][1] == b[row][2] && b[row][0] == '_' && b[row][1] == check) {
            if (row == 0) {
                return 0;
            } else if (row == 1) {
                return 3
            } else { return 6 }
        }
    }

    // Checking for Columns for X or O victory.
    for (let col = 0; col < 3; col++) {
        if (b[0][col] == b[1][col] && b[2][col] == '_' && b[0][col] == check) {
            if (col == 0) {
                return 6;
            } else if (col == 1) {
                return 7
            } else { return 8 }
        }
        if (b[0][col] == b[2][col] && b[1][col] == '_' && b[0][col] == check) {
            if (col == 0) {
                return 3;
            } else if (col == 1) {
                return 4
            } else { return 5 }
        }
        if (b[1][col] == b[2][col] && b[0][col] == '_' && b[1][col] == check) {
            if (col == 0) {
                return 0;
            } else if (col == 1) {
                return 1
            } else { return 2 }
        }
    }

    // Checking for Diagonals for X or O victory.
    if (b[0][0] == b[1][1] && b[2][2] == '_' && b[0][0] == check) {
        return 8
    }
    if (b[0][0] == b[2][2] && b[1][1] == '_' && b[0][0] == check) {
        return 4
    }
    if (b[1][1] == b[2][2] && b[0][0] == '_' && b[1][1] == check) {
        return 0
    }

    if (b[0][2] == b[1][1] && b[2][0] == '_' && b[0][2] == check) {
        return 6
    }
    if (b[0][2] == b[2][0] && b[1][1] == '_' && b[0][2] == check) {
        return 4
    }
    if (b[1][1] == b[2][0] && b[0][2] == '_' && b[1][1] == check) {
        return 2
    }

    // Else if none of them have won then return 9
    return 9;
}

function insertRecord() { //Write to table
    let gameRecordTbl = document.getElementById('gamesRecordBody');
    let newRow = gameRecordTbl.insertRow(-1);  // insert row at the end of table
    let newCell = newRow.insertCell(0);  // insert cell in the row at index 0
    let newText = document.createTextNode(gameCount);
    newCell.appendChild(newText);

    newCell = newRow.insertCell(1)
    if (level == 'B') {
        newText = document.createTextNode('Why you always win?');
    } else if (level == 'I') {
        newText = document.createTextNode('Trying hard not to lose');
    } else {
        newText = document.createTextNode('Can you win me?')
    }

    newCell.appendChild(newText);
    newCell = newRow.insertCell(2)
    newText = document.createTextNode(gameOverMsg.innerText);
    newCell.appendChild(newText);

    let percentDraw = ((gameDraw / gameCount) * 100).toFixed(0)
    let percentWon = ((gameWon / gameCount) * 100).toFixed(0)
    let percentLost = ((gameLost / gameCount) * 100).toFixed(0)

    console.log('D:',gameDraw)
    console.log('L:',gameLost)
    console.log('W:',gameWon)
    document.querySelector('#gamesPlay').innerHTML =`Total Played: ${gameCount}`;
    document.querySelector('#gamesDraw').innerHTML =`Total Draw: ${gameDraw} (${percentDraw}%)`;
    document.querySelector('#gamesWon').innerHTML =`Total Won: ${gameWon} (${percentWon}%)`;
    document.querySelector('#gamesLost').innerHTML =`Total Lost: ${gameLost} (${percentLost}%)`;
}