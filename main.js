// Program: main.js: for WWW tic-tac-toe
// Author:  Ron Pulcer
// Date:    March 19, 2019
// Version: Initial version (based no the command-line CLI version of tic-tac-toe)

let playerNames;
let msg;
let errMsg;
let startBtn;

function setup() {
    playerNames = document.getElementById("players");
    msg = document.getElementById("msg");
    errMsg = document.getElementById("errmsg");
    startBtn = document.getElementById("start");
    startBtn.addEventListener("click", startGame);
}

function startGame() {
    playerNames.textContent = "";
    msg.textContent = "";
    errMsg.textContent = "";
    startBtn.disabled = true;
    turn = 0;
    window.scrollTo(0,0);
    start();
}

let board = ["1","2","3","4","5","6","7","8","9"];
let players = [
    { player: "X", name: "" },
    { player: "O", name: "" }
];

function printBoard() {
    for(let c=0; c<=8; c++) {
        // The <br> is a bit kludgey, but I couldn't get the vertical-align: center or middle to work!
        document.getElementById("cell-" + c).innerHTML = "<br />" + board[c];
    }
}

function rePrompt(idx) {
    msg.textContent = "Player " + players[idx].player + " - " + players[idx].name + ", please try again.";
}


function check3Cells(cells, fillChar) {
    let winner = "";
    if(cells.length == 3) {
        if(board[cells[0]] == board[cells[1]] && board[cells[0]]== board[cells[2]]) {
            winner = board[cells[0]];
            board[cells[0]] = fillChar;
            board[cells[1]] = fillChar;
            board[cells[2]] = fillChar;
            // Refresh the board with fill character to designate how player won
            printBoard();
        }
    }
    return winner;
}

function check4Winner() {
    let winner = "";
    let win = false;

    // Remember cell # are 0-offset, not as users view cell #.
    winner = check3Cells([0,1,2], '-');
    if(winner != "") {
        congrats(winner);
        win = true;
    }

    if(! win) {
        winner = check3Cells([3,4,5], '-');
        if(winner != "") {
            congrats(winner);
            win = true;
        }
    }

    if(! win) {
        winner = check3Cells([6,7,8], '-');
        if(winner != "") {
            congrats(winner);
            win = true;
        }
    }

    if(! win) {
        winner = check3Cells([0,3,6], '|');
        if(winner != "") {
            congrats(winner);
            win = true;
        }
    }

    if(! win) {
        winner = check3Cells([1,4,7], '|');
        if(winner != "") {
            congrats(winner);
            win = true;
        }
    }

    if(! win) {
        winner = check3Cells([2,5,8], '|');
        if(winner != "") {
            congrats(winner);
            win = true;
        }
    }

    if(! win) {
        winner = check3Cells([0,4,8], '\\');
        if(winner != "") {
            congrats(winner);
            win = true;
        }
    }

    if(! win) {
        winner = check3Cells([2,4,6], '/');
        if(winner != "") {
            congrats(winner);
            win = true;
        }
    }

    return win;
}


function congrats(winner) {
    let winIndex = 0;
    if(winner == "O") { winIndex = 1; }
    msg.textContent = "CONGRATULATIONS Player " + players[winIndex].player + " - " + players[winIndex].name + ", YOU WON !!!";
}

function computerChoice() {
    let choiceOK = false;
    // Choose random # between 1 and 9
    let choice = 1 + Math.floor(Math.random() * 9);
    while(! choiceOK) {
        msg.textContent = "Computer's choice is ... " + choice;
        if(board[choice - 1] == "X" || board[choice - 1] == "O" ) {
            // Try again - cell has already been previously chosen
            choice = 1 + Math.floor(Math.random() * 9);
        }
        else {
            choiceOK = true;
        }
    }

    return choice;
}

function start() {
    let gameOver = false;
    let turn = 0;
    let computerPlayer = false;
    let answer = "";
    let squareNum = 0;

    // Get user choices and process according to game rules
    // First ask if this game is Person vs. Person or Person vs. Computer
    let prompt1 = "Please select game option:\n1. Person vs. Person\n2. Person vs. Computer";
    let answer1 = prompt(prompt1, "2");
    answer1 = answer1.trim();
    if(answer1 != "1" && answer1 != "2") {
        alert("Sorry, invalid game option.  Please try again.")
        startBtn.disabled = false;
       return;
    }
    
    // Get user names
    let answer2 = prompt("Player X name? ");
    answer2 = answer2.trim();
    players[0].name = answer2;

    if(answer1 == "2") {
        players[1].name = "COMPUTER";
        computerPlayer = true;
    }
    else {
        answer2 = prompt("Player O name? ");
        answer2 = answer2.trim();
        players[1].name = answer2;
    }
    playerNames.textContent = "Player X: " + players[0].name + "  |  Player O: " + players[1].name;

    playerIndex = turn % 2;

    while(! gameOver && turn < 9) {
        msg.textContent = "Player " + players[playerIndex].name + "'s turn  |  Turn :" + turn;

        if(playerIndex == 1 && computerPlayer) {
            squareNum = computerChoice();
        }
        else {
            answer = prompt(players[playerIndex].name + "'s turn (" + players[playerIndex].player + "): ");
            answer = answer.trim();
            squareNum = Number.parseInt(answer);
        }

        if(squareNum) {
            if(squareNum >= 1 && squareNum <=9) {
                if(board[squareNum - 1] == "X" || board[squareNum - 1] == "O" ) {
                    errMsg.textContent = "Invalid choice: " + squareNum + " has already been selected.";
                    rePrompt(playerIndex);
                }
                else {
                    board[squareNum - 1] = players[playerIndex].player;
                    errMsg.textContent = "";
                    printBoard();
                    gameOver = check4Winner();
                    if(! gameOver) {
                        turn++;
                        playerIndex = turn % 2;
                    }
                }
            }
            else {
                errMsg.textContent = "Invalid choice: " + squareNum + " is not in the range of 1 - 9.";
                rePrompt(playerIndex);
            }
        }
        else {
            errMsg.textContent = "Invalid choice: " + answer;
            rePrompt(playerIndex);
        }

        if(! gameOver && turn==9) {
            msg.textContent = "STALEMATE - Cat's Game - Nobody Won\n";
        }

    }  // End of Game Over loop

    // In case you want to play again!
    startBtn.disabled = false;
}
