function GameBoard() {
  const rows = 3;
  const columns = 3;
  const gameBoard = Array.from({ length: rows }, () => Array(columns).fill(''));

  const getBoard = () => gameBoard;

  const updateGameState = (row, col, playerSymbol) => {
      if (gameBoard[row][col] === '') {
          gameBoard[row][col] = playerSymbol;
          return true;
      }
      return false;
  };

  const checkWinCondition = (playerSymbol) => {
      for (let i = 0; i < rows; i++) {
          if (gameBoard[i].every(cell => cell === playerSymbol)) return true; // Check rows
          if (gameBoard.every(row => row[i] === playerSymbol)) return true; // Check columns
      }
      if (
          (gameBoard[0][0] === playerSymbol && gameBoard[1][1] === playerSymbol && gameBoard[2][2] === playerSymbol) ||
          (gameBoard[0][2] === playerSymbol && gameBoard[1][1] === playerSymbol && gameBoard[2][0] === playerSymbol)
      ) {
          return true; // Check diagonals
      }
      return false;
  };

  const checkDrawCondition = () => gameBoard.flat().every(cell => cell !== '');

  const resetBoard = () => {
      for (let i = 0; i < rows; i++) {
          for (let j = 0; j < columns; j++) {
              gameBoard[i][j] = '';
          }
      }
  };

  return { getBoard, updateGameState, checkWinCondition, checkDrawCondition, resetBoard };
}

const board = GameBoard();
let currentPlayer = 'X';

function renderBoard() {
  const gameBoardElement = document.getElementById('game-board');
  gameBoardElement.innerHTML = '';

  const gameState = board.getBoard();

  gameState.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
          const cellElement = document.createElement('div');
          cellElement.classList.add('cell');
          cellElement.textContent = cell;
          cellElement.addEventListener('click', () => handleCellClick(rowIndex, colIndex));
          if (cell !== '') cellElement.classList.add('taken');
          gameBoardElement.appendChild(cellElement);
      });
  });
}

function updateStatusMessage(message) {
  const statusMessageElement = document.getElementById('status-message');
  statusMessageElement.textContent = message;
}

function handleCellClick(row, col) {
  if (board.updateGameState(row, col, currentPlayer)) {
      renderBoard();
      if (board.checkWinCondition(currentPlayer)) {
          updateStatusMessage(`Player ${currentPlayer} wins!`);
          setTimeout(restartGame, 2000);
      } else if (board.checkDrawCondition()) {
          updateStatusMessage('The game is a draw!');
          setTimeout(restartGame, 2000);
      } else {
          currentPlayer = 'O'; // Switch to the bot
          updateStatusMessage("Bot's turn...(0)");
          setTimeout(botMove, 1000); // Allow a brief delay before bot move
      }
  }
}

function botMove() {
  const gameState = board.getBoard();

  // Gather valid moves
  let validMoves = [];
  for (let i = 0; i < gameState.length; i++) {
      for (let j = 0; j < gameState[i].length; j++) {
          if (gameState[i][j] === '') {
              validMoves.push({ row: i, col: j });
          }
      }
  }

  // Make a random move if there are valid moves available
  if (validMoves.length > 0) {
      const randomMove = validMoves[Math.floor(Math.random() * validMoves.length)];
      board.updateGameState(randomMove.row, randomMove.col, currentPlayer);
  }

  renderBoard();
  if (board.checkWinCondition(currentPlayer)) {
      updateStatusMessage(`Player ${currentPlayer} (Bot) wins!`);
      setTimeout(restartGame, 4000);
  } else if (board.checkDrawCondition()) {
      updateStatusMessage('The game is a draw!');
      setTimeout(restartGame, 4000);
  } else {
      currentPlayer = 'X'; // Switch back to player
      updateStatusMessage("Your Turn (X)");
  }
}

function restartGame() {
  board.resetBoard();
  currentPlayer = 'X';
  updateStatusMessage("Make Your Move!");
  renderBoard();
}

// Initialize the game board on page load
document.addEventListener('DOMContentLoaded', renderBoard);
