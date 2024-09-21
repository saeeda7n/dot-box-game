export type Positions = "left" | "top" | "bottom" | "right";

type LineProps = {
 position: Positions;
 hoverColor: string;
 color?: string;
 onClick: () => void;
};

const classNames: Record<Positions, string> = {
 left: "inset-y-4 -left-1 w-2",
 bottom: "left-4 right-4 -bottom-1 h-2",
 top: "left-4 right-4 -top-1 h-2",
 right: "top-4 bottom-4 -right-1 w-2",
};

export function Line({ position, hoverColor, color, onClick }: LineProps) {
 return (
  <div
   onClick={() => onClick()}
   style={
    {
     "--hoverColor": color || hoverColor,
     backgroundColor: color,
    } as React.CSSProperties
   }
   className={`absolute flex items-center justify-center rounded-full bg-gray-400 transition duration-300 ${classNames[position]} hover:bg-[--hoverColor]`}
  >
   <div
    className={`absolute aspect-square rounded-full ${["left", "right"].includes(position) ? "h-full" : "w-full"}`}
   />
  </div>
 );
}
