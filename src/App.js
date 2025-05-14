import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [difficulty, setDifficulty] = useState('easy'); // Track selected difficulty
  const [gameStatus, setGameStatus] = useState('');

  useEffect(() => {
    const winner = calculateWinner(squares);
    if (winner) {
      setGameStatus(winner === 'X' ? 'Congratulations, you won!' : 'You lost the game');
      return;
    }
    
    // If board is full and no winner
    if (squares.every(square => square !== null)) {
      setGameStatus('It\'s a tie!');
      return;
    }

    // AI's turn if it's not X's turn
    if (!isXNext) {
      const oIndex = getAiMove(squares);
      if (oIndex !== null) {
        const newSquares = squares.slice();
        newSquares[oIndex] = 'O';
        setSquares(newSquares);
        setIsXNext(true);
      }
    }
  }, [squares, isXNext]);

  function handleClick(index) {
    if (squares[index] || calculateWinner(squares)) return;

    const newSquares = squares.slice();
    newSquares[index] = 'X';
    setSquares(newSquares);
    setIsXNext(false); // Switch turn to O
    setGameStatus('Your Turn (X)'); // Reset game status to prompt user
  }

  function getAiMove(squares) {
    if (difficulty === 'easy') {
      return findRandomAvailableSquare(squares);
    } else if (difficulty === 'medium') {
      return findBestMoveMedium(squares);
    } else {
      return findBestMoveHard(squares); // Hard AI using Minimax algorithm
    }
  }

  function findRandomAvailableSquare(squares) {
    const availableSquares = squares
      .map((square, index) => (square === null ? index : null))
      .filter(index => index !== null);

    return availableSquares.length > 0
      ? availableSquares[Math.floor(Math.random() * availableSquares.length)]
      : null;
  }

  function findBestMoveMedium(squares) {
    const winningMove = findWinningMove(squares, 'O');
    if (winningMove !== null) return winningMove;

    const blockingMove = findWinningMove(squares, 'X');
    if (blockingMove !== null) return blockingMove;

    if (squares[4] === null) return 4;

    const corners = [0, 2, 6, 8];
    for (let corner of corners) {
      if (squares[corner] === null) return corner;
    }

    return findRandomAvailableSquare(squares);
  }

  function findBestMoveHard(squares) {
    const bestMove = minimax(squares, 'O');
    return bestMove.index;
  }

  function findWinningMove(squares, player) {
    for (let i = 0; i < 9; i++) {
      if (squares[i] === null) {
        const newSquares = squares.slice();
        newSquares[i] = player;
        if (calculateWinner(newSquares) === player) {
          return i;
        }
      }
    }
    return null;
  }

  function minimax(squares, player) {
    const availableMoves = getAvailableMoves(squares);
    if (calculateWinner(squares) === 'X') return { score: -10 };
    if (calculateWinner(squares) === 'O') return { score: 10 };
    if (availableMoves.length === 0) return { score: 0 };

    const moves = [];
    for (let move of availableMoves) {
      const newSquares = squares.slice();
      newSquares[move] = player;
      const result = minimax(newSquares, player === 'O' ? 'X' : 'O');
      moves.push({ index: move, score: result.score });
    }

    let bestMove;
    if (player === 'O') {
      bestMove = moves.reduce((acc, move) => (move.score > acc.score ? move : acc), { score: -Infinity });
    } else {
      bestMove = moves.reduce((acc, move) => (move.score < acc.score ? move : acc), { score: Infinity });
    }
    return bestMove;
  }

  function getAvailableMoves(squares) {
    return squares
      .map((square, index) => (square === null ? index : null))
      .filter(index => index !== null);
  }

  function renderSquare(index) {
    return <button className="square" onClick={() => handleClick(index)}>{squares[index]}</button>;
  }

  const winner = calculateWinner(squares);

  return (
    <div className="game">
      <div className="background-text">Haile Games</div>
      <h1>Tic-Tac-Toe</h1>
      <div className="difficulty-label">Select Difficulty:</div>
      <select
        className="difficulty-select"
        value={difficulty}
        onChange={(e) => {
          setDifficulty(e.target.value);
          setSquares(Array(9).fill(null)); // Reset the board when difficulty changes
          setGameStatus('Your Turn (X)');
          setIsXNext(true); // Make sure the player starts the game again
        }}
      >
        <option value="easy">Easy</option>
        <option value="medium">Medium</option>
        <option value="hard">Hard</option>
      </select>
      <div className="status">{gameStatus}</div>
      <div className="board">
        <div className="board-row">
          {renderSquare(0)} {renderSquare(1)} {renderSquare(2)}
        </div>
        <div className="board-row">
          {renderSquare(3)} {renderSquare(4)} {renderSquare(5)}
        </div>
        <div className="board-row">
          {renderSquare(6)} {renderSquare(7)} {renderSquare(8)}
        </div>
      </div>
      <button className="restart" onClick={() => {
        setSquares(Array(9).fill(null));
        setGameStatus('Your Turn (X)');
        setIsXNext(true);
      }}>
        Restart Game
      </button>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let line of lines) {
    const [a, b, c] = line;
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

export default App;
