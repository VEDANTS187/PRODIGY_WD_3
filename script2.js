const board = document.getElementById('board');
const resetButton = document.getElementById('reset');
const turnElement = document.getElementById('turn');
let currentPlayer = 'X';
let gameState = ['', '', '', '', '', '', '', '', ''];

// Handle user clicks
function handleClick(event) {
  const index = event.target.cellIndex + event.target.parentNode.rowIndex * 3;
  if (gameState[index] === '' && event.target.tagName === 'TD') {
    event.target.textContent = currentPlayer;
    gameState[index] = currentPlayer;
    checkWin();
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    turnElement.textContent = `Player ${currentPlayer}'s turn`;
  }
}

// Track game state
function checkWin() {
  const winningCombos = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]
  ];

  for (let i = 0; i < winningCombos.length; i++) {
    const [a, b, c] = winningCombos[i];
    if (gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
      alert(`Player ${gameState[a]} wins!`);
      resetBoard();
      return;
    }
  }

  if (!gameState.includes('')) {
    alert('It\'s a draw!');
    resetBoard();
  }
}

// Reset game on reset button click
resetButton.addEventListener('click', resetBoard);

// Add event listener to board
board.addEventListener('click', handleClick);

// Reset game state
function resetBoard() {
  gameState = ['', '', '', '', '', '', '', '', ''];
  for (let i = 0; i < board.rows.length; i++) {
    for (let j = 0; j < board.rows[i].cells.length; j++) {
      board.rows[i].cells[j].textContent = '';
    }
  }
  currentPlayer = 'X';
  turnElement.textContent = `Player X's turn`;
}

// Add AI functionality
function aiMove() {
  if (!gameState.includes('')) {
    return;
  }

  let bestScore = -Infinity;
  let move;

  for (let i = 0; i < 9; i++) {
    if (gameState[i] === '') {
      gameState[i] = currentPlayer;
      const score = minimax(gameState, 0, false);
      gameState[i] = '';
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }

  const td = board.rows[Math.floor(move / 3)].cells[move % 3];
  td.textContent = currentPlayer;
  gameState[move] = currentPlayer;
  checkWin();
  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  turnElement.textContent = `Player ${currentPlayer}'s turn`;
}

// Minimax algorithm
function minimax(gameState, depth, isMaximizing) {
  const winningCombos = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]
  ];

  for (let i = 0; i < winningCombos.length; i++) {
    const [a, b, c] = winningCombos[i];
    if (gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
      return isMaximizing ? -1 : 1;
    }
  }

  if (!gameState.includes('')) {
    return 0;
  }

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (gameState[i] === '') {
        gameState[i] = 'O';
        const score = minimax(gameState, depth + 1, false);
        gameState[i] = '';
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < 9; i++) {
      if (gameState[i] === '') {
        gameState[i] = 'X';
        const score = minimax(gameState, depth + 1, true);
        gameState[i] = '';
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
}

// Call AI move function after a short delay
setTimeout(() => {
  aiMove();
}, 500);