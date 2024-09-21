import colors from "tailwindcss/colors";
import GameBoard from "@/app/gameBoard";

const players = [
 { name: "Red", color: colors.red["500"] },
 { name: "Blue", color: colors.blue["500"] },
 { name: "Violet", color: colors.violet["500"] },
 { name: "Yellow", color: colors.yellow["500"] },
];
export default function Home() {
 return (
  <div className="flex min-h-screen flex-col items-center justify-center gap-10 p-16">
   <GameBoard
    players={players}
    rows={4}
    cols={4}
    randomStarter={~~(Math.random() * players.length)}
   />
  </div>
 );
}
