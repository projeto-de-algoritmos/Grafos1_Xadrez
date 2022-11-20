import './App.css';
import { useState } from 'react';
import { Chess } from 'chess.js';
import { Chessboard } from 'react-chessboard';

export default function App() {
  const [game, setGame] = useState(new Chess());

  function safeGameMutate(modify) {
    setGame((g) => {
      const update = { ...g };
      modify(update);
      return update;
    });
  }

  //Função que movimenta uma peça no tabuleiro
  function makeAMove(move) {
    const gameCopy = { ...game };
    const result = gameCopy.move(move);
    setGame(gameCopy);
    return result;
  }

  //Função que movimenta randomicamente uma peça no tabuleiro
  function makeRandomMove() {
    const possibleMoves = game.moves();

    if (game.game_over() || game.in_draw() || possibleMoves.length === 0)
      return;

    const randomIndex = Math.floor(Math.random() * possibleMoves.length);
    makeAMove(possibleMoves[randomIndex]);
  }

  //Funçao que dispara sempre que o jogador clicar em uma peça
  // function onClick()

  // console.log(game.get('a2')); //Retorna a peça que está na posição clicada
  // console.log(game.moves({square: 'a3'})); //Retorna a lista de possíveis movimentos no quadrado selecionado

  return (
    <div className="App">
      <Chessboard />
    </div>
  )
}