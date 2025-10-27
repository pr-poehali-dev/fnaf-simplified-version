import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { ViewDirection, DoorState } from './types';

interface GameControlsProps {
  viewDirection: ViewDirection;
  setViewDirection: (direction: ViewDirection) => void;
  cameraOpen: boolean;
  setCameraOpen: (open: boolean) => void;
  flashlightOn: boolean;
  toggleFlashlight: () => void;
  leftDoor: DoorState;
  rightDoor: DoorState;
  toggleDoor: (side: 'left' | 'right') => void;
  gameOver: boolean;
  victory: boolean;
  playSound: (frequency: number, duration: number, type?: OscillatorType) => void;
}

export function GameControls({
  viewDirection,
  setViewDirection,
  cameraOpen,
  setCameraOpen,
  flashlightOn,
  toggleFlashlight,
  leftDoor,
  rightDoor,
  toggleDoor,
  gameOver,
  victory,
  playSound,
}: GameControlsProps) {
  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-6">
        <Button
          variant="outline"
          size="lg"
          onClick={() => {
            playSound(220, 0.1);
            setViewDirection('left');
            setCameraOpen(false);
          }}
          disabled={gameOver || victory}
          className={`${viewDirection === 'left' ? 'bg-[#2d5016] text-white' : 'bg-[#1a1a1a] text-[#2d5016]'} border-[#2d5016] hover:bg-[#2d5016] hover:text-white`}
        >
          <Icon name="ArrowLeft" size={20} className="mr-1" />
          Влево
        </Button>

        <Button
          variant="outline"
          size="lg"
          onClick={() => {
            playSound(220, 0.1);
            setViewDirection('center');
            setCameraOpen(false);
          }}
          disabled={gameOver || victory}
          className={`${viewDirection === 'center' ? 'bg-[#2d5016] text-white' : 'bg-[#1a1a1a] text-[#2d5016]'} border-[#2d5016] hover:bg-[#2d5016] hover:text-white`}
        >
          <Icon name="Home" size={20} className="mr-1" />
          Центр
        </Button>

        <Button
          variant="outline"
          size="lg"
          onClick={() => {
            playSound(220, 0.1);
            setViewDirection('right');
            setCameraOpen(false);
          }}
          disabled={gameOver || victory}
          className={`${viewDirection === 'right' ? 'bg-[#2d5016] text-white' : 'bg-[#1a1a1a] text-[#2d5016]'} border-[#2d5016] hover:bg-[#2d5016] hover:text-white`}
        >
          Вправо
          <Icon name="ArrowRight" size={20} className="ml-1" />
        </Button>

        <Button
          variant="outline"
          size="lg"
          onClick={() => {
            playSound(180, 0.15);
            setCameraOpen(!cameraOpen);
          }}
          disabled={gameOver || victory}
          className={`${cameraOpen ? 'bg-[#2d5016] text-white' : 'bg-[#1a1a1a] text-[#2d5016]'} border-[#2d5016] hover:bg-[#2d5016] hover:text-white`}
        >
          <Icon name="Cctv" size={20} className="mr-1" />
          Камеры
        </Button>

        <Button
          variant="outline"
          size="lg"
          onClick={toggleFlashlight}
          disabled={gameOver || victory || viewDirection === 'center'}
          className={`${flashlightOn ? 'bg-yellow-600 text-white' : 'bg-[#1a1a1a] text-[#2d5016]'} border-[#2d5016] hover:bg-yellow-600 hover:text-white`}
        >
          <Icon name={flashlightOn ? 'Lightbulb' : 'LightbulbOff'} size={20} className="mr-1" />
          Свет
        </Button>
      </div>

      {viewDirection === 'left' && !cameraOpen && (
        <Button
          variant={leftDoor.isOpen ? 'destructive' : 'default'}
          size="lg"
          onClick={() => toggleDoor('left')}
          disabled={gameOver || victory}
          className="w-full mt-4"
        >
          <Icon name={leftDoor.isOpen ? 'DoorOpen' : 'DoorClosed'} size={24} className="mr-2" />
          {leftDoor.isOpen ? 'ЗАКРЫТЬ ЛЕВУЮ ДВЕРЬ' : 'ОТКРЫТЬ ЛЕВУЮ ДВЕРЬ'}
        </Button>
      )}

      {viewDirection === 'right' && !cameraOpen && (
        <Button
          variant={rightDoor.isOpen ? 'destructive' : 'default'}
          size="lg"
          onClick={() => toggleDoor('right')}
          disabled={gameOver || victory}
          className="w-full mt-4"
        >
          <Icon name={rightDoor.isOpen ? 'DoorOpen' : 'DoorClosed'} size={24} className="mr-2" />
          {rightDoor.isOpen ? 'ЗАКРЫТЬ ПРАВУЮ ДВЕРЬ' : 'ОТКРЫТЬ ПРАВУЮ ДВЕРЬ'}
        </Button>
      )}
    </>
  );
}
