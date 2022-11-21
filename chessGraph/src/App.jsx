import './App.css';
import { useRef, useState } from 'react';
import { Chess } from 'chess.js';
import { Chessboard } from 'react-chessboard';
import { useEffect } from 'react';

export default function App() {
  const chessboardRef = useRef();
  const [game, setGame] = useState(new Chess());
  const [moveFrom, setMoveFrom] = useState('');
  const [moveSquares, setMoveSquares] = useState({});
  const [optionSquares, setOptionSquares] = useState({});
  const [nomePeca, setNomePeca] = useState('Nenhuma peça selecionada!');
  const [posicoes, setPosicoes] = useState({
    a: { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0, '6': 0, '7': 0, '8': 0 },
    b: { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0, '6': 0, '7': 0, '8': 0 },
    c: { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0, '6': 0, '7': 0, '8': 0 },
    d: { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0, '6': 0, '7': 0, '8': 0 },
    e: { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0, '6': 0, '7': 0, '8': 0 },
    f: { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0, '6': 0, '7': 0, '8': 0 },
    g: { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0, '6': 0, '7': 0, '8': 0 },
    h: { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0, '6': 0, '7': 0, '8': 0 }
  })
  const [boardSize, setBoardSize] = useState(window.innerWidth/2.8);
  
  useEffect(() => {
    function handleBoardResize() {
      setBoardSize(window.innerWidth/2.8);
    }

    window.addEventListener('resize', handleBoardResize);

    return () => {
      window.removeEventListener('resize', handleBoardResize);
    }
  }, []);

  let pecaSelecionada;
  let nomesPecas = {
    'p': 'Peão',
    'K': 'Rei',
    'Q': 'Rainha',
    'n': 'Cavalo',
    'B': 'Bispo',
    'R': 'Torre'
  };
  let novaMatriz = {
    a: { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0, '6': 0, '7': 0, '8': 0 },
    b: { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0, '6': 0, '7': 0, '8': 0 },
    c: { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0, '6': 0, '7': 0, '8': 0 },
    d: { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0, '6': 0, '7': 0, '8': 0 },
    e: { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0, '6': 0, '7': 0, '8': 0 },
    f: { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0, '6': 0, '7': 0, '8': 0 },
    g: { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0, '6': 0, '7': 0, '8': 0 },
    h: { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0, '6': 0, '7': 0, '8': 0 }
  }

  function blackTurnMove(move) {
    if(game.turn() !== 'b')
      return;
    game.move(move);
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
    if(game.turn() === 'w'){
      return;
    }
    const possibleMoves = game.moves();
    if (game.isGameOver() || game.isDraw() || possibleMoves.length === 0)
      return;
    const randomIndex = Math.floor(Math.random() * possibleMoves.length);
    blackTurnMove(possibleMoves[randomIndex]);
  }

  //Caso o jogador clique em algum quadrado, movimentar as peças
  function onSquareClick(square) {
    //Caso haja uma peça no quadrado selecionado
    if (game.get(square)) {
      pecaSelecionada = game.get(square).type;
      setNomePeca(nomesPecas[pecaSelecionada]);
      let posicoesValidas = game.moves({ square: square, verbose:true });
      console.log(posicoesValidas);

      for (let i in posicoesValidas) {
        novaMatriz[posicoesValidas[i]['to'][0]][posicoesValidas[i]['to'][1]] = 1;
      }
      setPosicoes(novaMatriz);
    }

    //Função que altera a variável moveFrom para ter um "histórico" de onde o jogador clicou
    function resetFirstMove(square) {
      setMoveFrom(square);
      getMoveOptions(square);
    }

    //Caso seja a primeira seleção da peça
    if (!moveFrom) {
      resetFirstMove(square);
      return;
    }

    const gameCopy = game;
    const move = gameCopy.move({ from: moveFrom, to: square });
    setGame(gameCopy);

    //Caso a movimentação seja inválida
    if (move === null) {
      console.log('Movimentação inválida!');
      resetFirstMove(square);
      return;
    }
    
    makeRandomMove();
    setMoveFrom('');
    setOptionSquares({});
  }

  // console.log(game.get('a2')); //Retorna a peça que está na posição clicada
  // console.log(game.moves({square: 'a3'})); //Retorna a lista de possíveis movimentos no quadrado selecionado

  return (
    <div className="App">
      <div className="title">
        <h1>Chess Graph Game</h1>
        <p>Por favor, selecione uma peça</p>
      </div>
      <div className="game">
        <div className="board">
          <Chessboard
            className="oi"
            animationDuration={300}
            boardWidth={boardSize}
            arePiecesDraggable={false}
            position={game.fen()}
            onSquareClick={onSquareClick}
            customSquareStyles={{
              ...moveSquares,
              ...optionSquares,
            }}
            ref={chessboardRef} />
        </div>
        <div className="matrix">
          <div className="table">
            <h2>{nomePeca}</h2>
            <table>
              <tbody>
                <tr>
                  <td> </td>
                  <td>1</td>
                  <td>2</td>
                  <td>3</td>
                  <td>4</td>
                  <td>5</td>
                  <td>6</td>
                  <td>7</td>
                  <td>8</td>
                </tr>
                <tr>
                  <td>a</td>
                  <td>{posicoes['a']['1']}</td>
                  <td>{posicoes['a']['2']}</td>
                  <td>{posicoes['a']['3']}</td>
                  <td>{posicoes['a']['4']}</td>
                  <td>{posicoes['a']['5']}</td>
                  <td>{posicoes['a']['6']}</td>
                  <td>{posicoes['a']['7']}</td>
                  <td>{posicoes['a']['8']}</td>
                </tr>
                <tr>
                  <td>b</td>
                  <td>{posicoes['b']['1']}</td>
                  <td>{posicoes['b']['2']}</td>
                  <td>{posicoes['b']['3']}</td>
                  <td>{posicoes['b']['4']}</td>
                  <td>{posicoes['b']['5']}</td>
                  <td>{posicoes['b']['6']}</td>
                  <td>{posicoes['b']['7']}</td>
                  <td>{posicoes['b']['8']}</td>
                </tr>
                <tr>
                  <td>c</td>
                  <td>{posicoes['c']['1']}</td>
                  <td>{posicoes['c']['2']}</td>
                  <td>{posicoes['c']['3']}</td>
                  <td>{posicoes['c']['4']}</td>
                  <td>{posicoes['c']['5']}</td>
                  <td>{posicoes['c']['6']}</td>
                  <td>{posicoes['c']['7']}</td>
                  <td>{posicoes['c']['8']}</td>
                </tr>
                <tr>
                  <td>d</td>
                  <td>{posicoes['d']['1']}</td>
                  <td>{posicoes['d']['2']}</td>
                  <td>{posicoes['d']['3']}</td>
                  <td>{posicoes['d']['4']}</td>
                  <td>{posicoes['d']['5']}</td>
                  <td>{posicoes['d']['6']}</td>
                  <td>{posicoes['d']['7']}</td>
                  <td>{posicoes['d']['8']}</td>
                </tr>
                <tr>
                  <td>e</td>
                  <td>{posicoes['e']['1']}</td>
                  <td>{posicoes['e']['2']}</td>
                  <td>{posicoes['e']['3']}</td>
                  <td>{posicoes['e']['4']}</td>
                  <td>{posicoes['e']['5']}</td>
                  <td>{posicoes['e']['6']}</td>
                  <td>{posicoes['e']['7']}</td>
                  <td>{posicoes['e']['8']}</td>
                </tr>
                <tr>
                  <td>f</td>
                  <td>{posicoes['f']['1']}</td>
                  <td>{posicoes['f']['2']}</td>
                  <td>{posicoes['f']['3']}</td>
                  <td>{posicoes['f']['4']}</td>
                  <td>{posicoes['f']['5']}</td>
                  <td>{posicoes['f']['6']}</td>
                  <td>{posicoes['f']['7']}</td>
                  <td>{posicoes['f']['8']}</td>
                </tr>
                <tr>
                  <td>g</td>
                  <td>{posicoes['g']['1']}</td>
                  <td>{posicoes['g']['2']}</td>
                  <td>{posicoes['g']['3']}</td>
                  <td>{posicoes['g']['4']}</td>
                  <td>{posicoes['g']['5']}</td>
                  <td>{posicoes['g']['6']}</td>
                  <td>{posicoes['g']['7']}</td>
                  <td>{posicoes['g']['8']}</td>
                </tr>
                <tr>
                  <td>h</td>
                  <td>{posicoes['h']['1']}</td>
                  <td>{posicoes['h']['2']}</td>
                  <td>{posicoes['h']['3']}</td>
                  <td>{posicoes['h']['4']}</td>
                  <td>{posicoes['h']['5']}</td>
                  <td>{posicoes['h']['6']}</td>
                  <td>{posicoes['h']['7']}</td>
                  <td>{posicoes['h']['8']}</td>
                </tr>
              </tbody>
            </table>
          </div>
      </div>
    </div>
  </div>
  )
}