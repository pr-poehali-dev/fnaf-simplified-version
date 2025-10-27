import { DoorState } from './types';

interface GameHUDProps {
  time: number;
  power: number;
  leftDoor: DoorState;
  rightDoor: DoorState;
}

export function GameHUD({ time, power, leftDoor, rightDoor }: GameHUDProps) {
  return (
    <div className="absolute top-0 left-0 right-0 bg-[#0a0a0a] border-b-2 border-[#2d5016] p-4 flex justify-between items-center z-10 flex-wrap gap-2">
      <div className="flex gap-6 items-center flex-wrap">
        <div className="text-sm">
          <span className="text-[#8B0000] font-bold">НОЧЬ:</span> <span className="text-[#2d5016]">{time} AM</span>
        </div>
        <div className="text-sm">
          <span className="text-[#8B0000] font-bold">ЭНЕРГИЯ:</span> 
          <span className={power < 20 ? 'text-[#8B0000] animate-pulse font-bold' : power < 50 ? 'text-yellow-500' : 'text-[#2d5016]'}>
            {' '}{Math.round(power)}%
          </span>
        </div>
        <div className="flex gap-2">
          <div className={`text-xs px-2 py-1 rounded ${!leftDoor.isOpen ? 'bg-[#8B0000] text-white' : leftDoor.hasAnimatronic ? 'bg-[#8B0000] text-white animate-pulse' : 'bg-[#1a1a1a] text-[#2d5016]'}`}>
            ← {leftDoor.isOpen ? 'ОТКРЫТА' : 'ЗАКРЫТА'}
          </div>
          <div className={`text-xs px-2 py-1 rounded ${!rightDoor.isOpen ? 'bg-[#8B0000] text-white' : rightDoor.hasAnimatronic ? 'bg-[#8B0000] text-white animate-pulse' : 'bg-[#1a1a1a] text-[#2d5016]'}`}>
            {rightDoor.isOpen ? 'ОТКРЫТА' : 'ЗАКРЫТА'} →
          </div>
        </div>
      </div>
      <h1 className="text-2xl md:text-4xl text-[#8B0000] drop-shadow-[0_0_10px_rgba(139,0,0,0.8)] tracking-wider">
        FIVE NIGHTS AT FREDDY'S
      </h1>
    </div>
  );
}
