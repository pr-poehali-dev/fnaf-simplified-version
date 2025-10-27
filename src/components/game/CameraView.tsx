import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Location, Animatronic } from './types';
import { ANIMATRONICS } from './constants';

interface CameraViewProps {
  currentCamera: number;
  setCurrentCamera: (index: number) => void;
  locations: Location[];
  playSound: (frequency: number, duration: number, type?: OscillatorType) => void;
}

export function CameraView({ currentCamera, setCurrentCamera, locations, playSound }: CameraViewProps) {
  const currentLocation = locations[currentCamera];
  const animatronicAtLocation = ANIMATRONICS.find(a => a.name === currentLocation.animatronic);
  
  return (
    <div className="relative w-full h-full bg-[#000000] camera-static">
      <div className="absolute inset-0 flex items-center justify-center">
        {animatronicAtLocation ? (
          <div className="relative w-full h-full">
            <img 
              src={animatronicAtLocation.image} 
              alt={animatronicAtLocation.name}
              className="w-full h-full object-cover opacity-80"
            />
            <div className="absolute bottom-4 left-4 right-4 bg-[#8B0000]/80 p-2 rounded">
              <p className="text-xl font-bold text-white text-center animate-pulse">
                ⚠️ {animatronicAtLocation.name} обнаружен!
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <Icon name="Video" size={80} className="text-[#2d5016] opacity-50 mb-4 mx-auto" />
            <p className="text-xl text-[#2d5016] opacity-70">{currentLocation.name}</p>
            <p className="text-sm text-[#2d5016] opacity-50 mt-2">Локация пуста</p>
          </div>
        )}
      </div>
      <div className="absolute top-2 left-2 text-[#2d5016] text-xs font-mono opacity-70 bg-black/50 px-2 py-1 rounded">
        REC ● CAM {currentLocation.camNumber}
      </div>
      <div className="absolute bottom-2 left-2 right-2">
        <div className="grid grid-cols-5 gap-1">
          {locations.map((loc, idx) => (
            <Button
              key={loc.id}
              variant={currentCamera === idx ? 'default' : 'outline'}
              size="sm"
              onClick={() => {
                playSound(250, 0.1);
                setCurrentCamera(idx);
              }}
              className={`text-xs px-1 py-1 h-auto ${
                currentCamera === idx
                  ? 'bg-[#2d5016] text-white'
                  : 'bg-[#0a0a0a]/80 border-[#2d5016] text-[#2d5016]'
              } ${loc.animatronic ? 'border-[#8B0000] animate-pulse' : ''}`}
            >
              CAM {loc.camNumber}
              {loc.animatronic && ' 🔴'}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
