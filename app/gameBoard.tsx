"use client";

import React, { useState } from "react";
import { Line, Positions } from "@/components/line";
import { Player, usePlayers } from "@/hooks/usePlayer";

type PossibleOptions = string | undefined;
type Box = {
 top: PossibleOptions;
 left: PossibleOptions;
 right: PossibleOptions;
 bottom: PossibleOptions;
 closedBy: PossibleOptions;
};

type GameBoardProps = {
 players: Player[];
 randomStarter?: number;
 cols: number;
 rows: number;
};

function TurnCard({ player }: { player: Player }) {
 return (
  <div className="flex items-center justify-center gap-3 font-medium">
   It's
   <span
    className="rounded-full px-2"
    style={{ backgroundColor: player.color }}
   >
    <span className="text-gray-50">{player.name}'s</span>
   </span>
   turn
  </div>
 );
}

function FinishCard({
 winner: player,
 onPressReset,
}: {
 winner: Player;
 onPressReset: () => void;
}) {
 return (
  <div className="relative flex items-center justify-center gap-2 font-medium">
   <span
    className="rounded-full px-2 text-gray-50"
    style={{ backgroundColor: player.color }}
   >
    {player.name} Won
   </span>
   <button
    className="rounded-md border-2 px-5"
    style={{ borderColor: player.color, color: player.color }}
    onClick={() => onPressReset()}
   >
    Reset
   </button>
  </div>
 );
}

const GameBoard = ({ randomStarter, players, cols, rows }: GameBoardProps) => {
 const [finished, setFinished] = useState(false);
 const [winner, setWinner] = useState<Player | null>(null);
 const { player, nextRound } = usePlayers(players, randomStarter);
 const [board, setBoard] = useState<Array<Array<Box>>>(
  initiateBoard(cols, rows),
 );
 return (
  <React.Fragment>
   <div className="flex aspect-square w-full max-w-[38rem] flex-col">
    {[...new Array(cols)].map((_, col) => (
     <div key={col} className="flex flex-1">
      {[...new Array(rows)].map((_, row) => (
       <div key={row} className="relative flex flex-1 rounded-xl">
        <div className="absolute -left-1.5 -top-1.5 size-3 rounded-full bg-zinc-600" />

        <div
         className="absolute inset-4 rounded-xl transition duration-300"
         style={{ backgroundColor: board[col][row].closedBy || "transparent" }}
        />

        <Line
         position="top"
         hoverColor={player.color}
         onClick={() => onClickLines(col, row, "top", player.color)}
         color={board[col][row]?.top}
        />

        <Line
         position="left"
         hoverColor={player.color}
         onClick={() => onClickLines(col, row, "left", player.color)}
         color={board[col][row]?.left}
        />

        {col > cols - 2 && (
         <>
          <Line
           position="bottom"
           hoverColor={player.color}
           onClick={() => onClickLines(col, row, "bottom", player.color)}
           color={board[col][row]?.bottom}
          />
          <div className="absolute -bottom-1.5 -left-1.5 size-3 rounded-full bg-zinc-600" />
         </>
        )}
        {row > rows - 2 && (
         <>
          <Line
           position="right"
           hoverColor={player.color}
           onClick={() => onClickLines(col, row, "right", player.color)}
           color={board[col][row]?.right}
          />
          <div className="absolute -right-1.5 -top-1.5 size-3 rounded-full bg-zinc-600" />
         </>
        )}
        {row > rows - 2 && col > cols - 2 && (
         <div className="absolute -bottom-1.5 -right-1.5 size-3 rounded-full bg-zinc-600" />
        )}
       </div>
      ))}
     </div>
    ))}
   </div>
   {finished && winner ? (
    <FinishCard winner={winner} onPressReset={reset} />
   ) : (
    <TurnCard player={player} />
   )}
  </React.Fragment>
 );

 function onClickLines(
  col: number,
  row: number,
  position: Positions,
  color: string,
 ) {
  if (board[col][row][position]) return;
  board[col][row] = { ...board[col][row], [position]: color };

  const box = {
   ...board[col][row],
   bottom: col < cols - 1 ? board[col + 1][row]?.top : board[col][row]?.bottom,
   right: row < rows - 1 ? board[col][row + 1]?.left : board[col][row]?.right,
   closedBy: undefined,
  };

  let stopNext: boolean[] = [];
  if (row > 0) {
   board[col][row - 1] = { ...board[col][row - 1], right: box.left };
   stopNext.push(checkBox(board[col][row - 1], color));
  }
  if (col > 0) {
   board[col - 1][row] = { ...board[col - 1][row], bottom: box.top };
   stopNext.push(checkBox(board[col - 1][row], color));
  }
  stopNext.push(checkBox(box, color));
  board[col][row] = { ...board[col][row], ...box };

  setBoard([...board]);
  checkGameState();

  if (!stopNext.includes(true)) nextRound();
 }

 function checkGameState() {
  const mappedPlayers = new Map<string | undefined, number>();
  board.forEach((value) =>
   value.forEach((box) => {
    const score = mappedPlayers.has(box.closedBy)
     ? mappedPlayers.get(box.closedBy)! + 1
     : 1;
    mappedPlayers.set(box.closedBy, score);
   }),
  );
  if (!mappedPlayers.has(undefined)) {
   setFinished(true);
   const [winner] = Array.from(mappedPlayers, ([name, value]) => ({
    name,
    value,
   })).sort((a, b) => (a.value > b.value ? -1 : 1));

   setWinner(players.find(({ color }) => color === winner.name)!);
  }
 }

 function reset() {
  setBoard(initiateBoard(cols, rows));
  setWinner(null);
  setFinished(false);
 }
};

export default GameBoard;

function checkBox(box: any, color: string) {
 if (box.closedBy) return false;
 if (
  Object.keys(box).every((value) =>
   value === "closedBy" ? true : !!box[value],
  )
 ) {
  box.closedBy = color;
  return true;
 }
 return false;
}

function initiateBoard(cols: number, rows: number): Array<Array<Box>> {
 const board: Array<Array<Box>> = [];
 for (let x = 0; x < rows; x++) {
  board[x] = [];
  for (let y = 0; y < cols; y++)
   board[x][y] = {
    top: undefined,
    left: undefined,
    right: undefined,
    bottom: undefined,
    closedBy: undefined,
   };
 }
 return board;
}
