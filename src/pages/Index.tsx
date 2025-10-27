import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { toast } from '@/components/ui/use-toast';

type Location = {
  id: string;
  name: string;
  hasAnimatronic: boolean;
};

const LOCATIONS: Location[] = [
  { id: 'corridor', name: 'Коридор', hasAnimatronic: false },
  { id: 'ventilation', name: 'Вентиляция', hasAnimatronic: false },
  { id: 'kitchen', name: 'Кухня', hasAnimatronic: false },
  { id: 'stage', name: 'Сцена', hasAnimatronic: false },
  { id: 'dining', name: 'Столовая', hasAnimatronic: false },
  { id: 'storage', name: 'Подсобка', hasAnimatronic: false },
];

const ANIMATRONIC_NAMES = ['Freddy', 'Bonnie', 'Chica', 'Foxy'];

export default function Index() {
  const [currentCamera, setCurrentCamera] = useState(0);
  const [locations, setLocations] = useState<Location[]>(LOCATIONS);
  const [power, setPower] = useState(100);
  const [time, setTime] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isWarning, setIsWarning] = useState(false);

  useEffect(() => {
    const moveAnimatronics = setInterval(() => {
      if (gameOver) return;

      setLocations(prev => {
        const newLocations = [...prev];
        const randomIndex = Math.floor(Math.random() * newLocations.length);
        const shouldMove = Math.random() > 0.6;

        if (shouldMove) {
          newLocations[randomIndex].hasAnimatronic = !newLocations[randomIndex].hasAnimatronic;

          if (newLocations[randomIndex].hasAnimatronic) {
            const animatronicName = ANIMATRONIC_NAMES[Math.floor(Math.random() * ANIMATRONIC_NAMES.length)];
            
            setIsWarning(true);
            setTimeout(() => setIsWarning(false), 500);

            toast({
              title: '⚠️ ДВИЖЕНИЕ ОБНАРУЖЕНО',
              description: `${animatronicName} в локации: ${newLocations[randomIndex].name}`,
              variant: 'destructive',
            });
          }
        }

        return newLocations;
      });
    }, 5000);

    return () => clearInterval(moveAnimatronics);
  }, [gameOver]);

  useEffect(() => {
    const powerDrain = setInterval(() => {
      if (gameOver) return;
      
      setPower(prev => {
        const newPower = prev - 1;
        if (newPower <= 0) {
          setGameOver(true);
          toast({
            title: '💀 GAME OVER',
            description: 'Энергия закончилась...',
            variant: 'destructive',
          });
          return 0;
        }
        return newPower;
      });
    }, 2000);

    return () => clearInterval(powerDrain);
  }, [gameOver]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (gameOver) return;
      
      setTime(prev => {
        if (prev >= 6) {
          setGameOver(true);
          toast({
            title: '🎉 ВЫ ВЫЖИЛИ!',
            description: 'Вы пережили ночь!',
          });
          return 6;
        }
        return prev + 1;
      });
    }, 30000);

    return () => clearInterval(timer);
  }, [gameOver]);

  const handleCameraSwitch = (direction: 'left' | 'right') => {
    if (gameOver) return;
    
    setPower(prev => Math.max(0, prev - 2));
    
    if (direction === 'left') {
      setCurrentCamera(prev => (prev === 0 ? locations.length - 1 : prev - 1));
    } else {
      setCurrentCamera(prev => (prev === locations.length - 1 ? 0 : prev + 1));
    }
  };

  const resetGame = () => {
    setCurrentCamera(0);
    setLocations(LOCATIONS);
    setPower(100);
    setTime(0);
    setGameOver(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#2d5016] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-radial from-[#1a1a1a] via-[#0a0a0a] to-black opacity-50"></div>
      
      <div className="absolute top-0 left-0 right-0 bg-[#0a0a0a] border-b-2 border-[#2d5016] p-4 flex justify-between items-center z-10">
        <div className="flex gap-6 items-center">
          <div className="text-sm">
            <span className="text-[#8B0000] font-bold">НОЧЬ:</span> <span className="text-[#2d5016]">{time} AM</span>
          </div>
          <div className="text-sm">
            <span className="text-[#8B0000] font-bold">ЭНЕРГИЯ:</span> <span className={power < 30 ? 'text-[#8B0000] animate-pulse' : 'text-[#2d5016]'}>{power}%</span>
          </div>
        </div>
        <h1 className="text-2xl md:text-4xl text-[#8B0000] drop-shadow-[0_0_10px_rgba(139,0,0,0.8)] tracking-wider">
          FIVE NIGHTS AT FREDDY'S
        </h1>
      </div>

      <div className="relative z-10 w-full max-w-6xl mt-20">
        <Card className={`bg-[#0a0a0a] border-2 ${isWarning ? 'border-[#8B0000]' : 'border-[#2d5016]'} p-6 camera-static transition-all`}>
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="outline"
              size="lg"
              onClick={() => handleCameraSwitch('left')}
              disabled={gameOver}
              className="bg-[#1a1a1a] border-[#2d5016] text-[#2d5016] hover:bg-[#2d5016] hover:text-white"
            >
              <Icon name="ChevronLeft" size={24} />
            </Button>

            <div className="flex-1 text-center">
              <h2 className="text-3xl mb-2 text-[#8B0000] tracking-wider drop-shadow-[0_0_8px_rgba(139,0,0,0.6)]">
                CAM {currentCamera + 1}: {locations[currentCamera].name}
              </h2>
              <p className="text-xs text-[#2d5016] opacity-70 font-mono">
                {new Date().toLocaleTimeString()}
              </p>
            </div>

            <Button
              variant="outline"
              size="lg"
              onClick={() => handleCameraSwitch('right')}
              disabled={gameOver}
              className="bg-[#1a1a1a] border-[#2d5016] text-[#2d5016] hover:bg-[#2d5016] hover:text-white"
            >
              <Icon name="ChevronRight" size={24} />
            </Button>
          </div>

          <div className="relative aspect-video bg-[#000000] border-2 border-[#2d5016] rounded-md overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              {locations[currentCamera].hasAnimatronic ? (
                <div className="text-center animate-pulse">
                  <Icon name="Skull" size={120} className="text-[#8B0000] mb-4 mx-auto drop-shadow-[0_0_20px_rgba(139,0,0,0.8)]" />
                  <p className="text-4xl font-bold text-[#8B0000] tracking-widest animate-[glitch_0.3s_infinite]">
                    ⚠️ ВНИМАНИЕ ⚠️
                  </p>
                  <p className="text-xl text-[#8B0000] mt-2">
                    АНИМАТРОНИК ОБНАРУЖЕН
                  </p>
                </div>
              ) : (
                <div className="text-center">
                  <Icon name="Video" size={80} className="text-[#2d5016] opacity-50 mb-4 mx-auto" />
                  <p className="text-xl text-[#2d5016] opacity-70">
                    Локация чиста
                  </p>
                </div>
              )}
            </div>
            
            <div className="absolute top-2 left-2 text-[#2d5016] text-xs font-mono opacity-70">
              REC ●
            </div>
          </div>

          <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mt-6">
            {locations.map((location, index) => (
              <Button
                key={location.id}
                variant={currentCamera === index ? 'default' : 'outline'}
                size="sm"
                onClick={() => {
                  if (!gameOver) {
                    setCurrentCamera(index);
                    setPower(prev => Math.max(0, prev - 1));
                  }
                }}
                disabled={gameOver}
                className={`relative ${
                  currentCamera === index
                    ? 'bg-[#2d5016] text-white border-[#2d5016]'
                    : 'bg-[#0a0a0a] border-[#2d5016] text-[#2d5016] hover:bg-[#1a1a1a]'
                }`}
              >
                {location.name}
                {location.hasAnimatronic && (
                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#8B0000] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-[#8B0000]"></span>
                  </span>
                )}
              </Button>
            ))}
          </div>
        </Card>

        {gameOver && (
          <div className="absolute inset-0 bg-black/90 flex items-center justify-center backdrop-blur-sm">
            <Card className="bg-[#0a0a0a] border-4 border-[#8B0000] p-8 text-center max-w-md">
              <h2 className="text-5xl mb-4 text-[#8B0000] tracking-widest drop-shadow-[0_0_15px_rgba(139,0,0,1)]">
                {time >= 6 ? '🎉 ПОБЕДА!' : '💀 GAME OVER'}
              </h2>
              <p className="text-xl text-[#2d5016] mb-6">
                {time >= 6 
                  ? 'Вы пережили ночь в пиццерии Freddy Fazbear!' 
                  : 'Аниматроники вас поймали...'}
              </p>
              <Button
                onClick={resetGame}
                size="lg"
                className="bg-[#8B0000] hover:bg-[#6B0000] text-white border-2 border-[#2d5016]"
              >
                <Icon name="RotateCcw" size={20} className="mr-2" />
                Начать заново
              </Button>
            </Card>
          </div>
        )}
      </div>

      <div className="absolute bottom-4 text-center text-[#2d5016] opacity-50 text-xs z-10">
        <p>Используйте стрелки для переключения камер | Следите за энергией</p>
      </div>
    </div>
  );
}
