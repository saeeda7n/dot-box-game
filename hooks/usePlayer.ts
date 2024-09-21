import { useState } from "react";

export type Player = {
 name: string;
 color: string;
};

export function usePlayers(players: Player[], randomStarter?: number) {
 const [round, setRound] = useState(randomStarter || 0);

 function nextRound() {
  setRound((p) => (p + 1) % players.length);
 }

 return { round, player: players[round], nextRound };
}
