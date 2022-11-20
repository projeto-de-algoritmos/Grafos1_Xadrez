import './App.css';
import { useRef, useState } from 'react';
import { Chess } from 'chess.js';
import { Chessboard } from 'react-chessboard';

export default function App({ boardWidth }) {
  const chessboardRef = useRef();
  const [game, setGame] = useState(new Chess());
  const [moveFrom, setMoveFrom] = useState('');
  const [moveSquares, setMoveSquares] = useState({});
  const [optionSquares, setOptionSquares] = useState({});
  const [rightClickedSquares, setRightClickedSquares] = useState({});

  function safeGameMutate(modify) {
    setGame((g) => {
      const update = g ;
      modify(update);
      return update;
    });
  }

  function getMoveOptions(square) {
    const moves = game.moves({
      square,
      verbose: true
    });
    if (moves.length === 0) {
      return;
    }

    const newSquares = {};
    moves.map((move) => {
      newSquares[move.to] = {
        background:
          game.get(move.to) && game.get(move.to).color !== game.get(square).color
            ? 'radial-gradient(circle, rgba(0,0,0,.1) 85%, transparent 85%)'
            : 'radial-gradient(circle, rgba(0,0,0,.1) 25%, transparent 25%)',
        borderRadius: '50%'
      };
      return move;
    });
    newSquares[square] = {
      background: 'rgba(255, 255, 0, 0.4)'
    };
    setOptionSquares(newSquares);
  }

  function makeRandomMove() {
    const possibleMoves = game.moves();
    if(game.isGameOver() || game.isDraw() || possibleMoves.length === 0)
      return;
    const randomIndex = Math.floor(Math.random() * possibleMoves.length);
    safeGameMutate((game) => {
      game.move(possibleMoves[randomIndex]);
    });
  }

  //Caso o jogador clique em algum quadrado, movimentar as peças
  function onSquareClick(square) {

    //Função que altera a variável moveFrom para ter um "histórico" de onde o jogador clicou
    function resetFirstMove(square){
      setMoveFrom(square);
      getMoveOptions(square);
    }

    //Caso seja a primeira seleção da peça
    if(!moveFrom){
      resetFirstMove(square);
      return;
    }

    const gameCopy = game;
    const move = gameCopy.move({from: moveFrom, to: square});
    setGame(gameCopy);

    //Caso a movimentação seja inválida
    if(move === null){
      console.log('Movimentação inválida!');
      resetFirstMove(square);
      return;
    }

    makeRandomMove();
    setMoveFrom('');
    setOptionSquares({});
  }

  function onSquareRightClick(square) {
    console.log(square);
  }
  // console.log(game.get('a2')); //Retorna a peça que está na posição clicada
  // console.log(game.moves({square: 'a3'})); //Retorna a lista de possíveis movimentos no quadrado selecionado

  return (
    <div className="App">
      <div className="screen">
        <div className="game">
          <div className="board">
            <Chessboard
              id="ClickToMove"
              animationDuration={200}
              arePiecesDraggable={false}
              boardWidth={boardWidth}align content css não centraliza
              position={game.fen()}
              onSquareClick={onSquareClick}
              onSquareRightClick={onSquareRightClick}
              customBoardStyle={{
                borderRadius: '4px',
                boxShadow: '0 5px 15px rgba(0, 0, 0, 0.5)'
              }}
              customSquareStyles={{
                ...moveSquares,
                ...optionSquares,
                ...rightClickedSquares
              }}
              ref={chessboardRef} />
            <div className="buttons">
              <button
                className="rc-button"
                onClick={() => {
                  safeGameMutate((game) => {
                    game.reset();
                  });
                  chessboardRef.current.clearPremoves();
                  setMoveSquares({});
                  setRightClickedSquares({});
                }}
              >
                Reset
              </button>
              <button
                className="rc-button"
                onClick={() => {
                  safeGameMutate((game) => {
                    game.undo();
                  });
                  chessboardRef.current.clearPremoves();
                  setMoveSquares({});
                }}
              >
                Undo
              </button>
            </div>
          </div>
          <div>Matriz</div>
        </div>
      </div>
    </div>
  )
}