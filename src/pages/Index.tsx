import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { toast } from '@/components/ui/use-toast';

type ViewDirection = 'center' | 'left' | 'right';

type DoorState = {
  isOpen: boolean;
  hasAnimatronic: boolean;
};

const ANIMATRONIC_NAMES = ['Freddy', 'Bonnie', 'Chica', 'Foxy'];

export default function Index() {
  const [viewDirection, setViewDirection] = useState<ViewDirection>('center');
  const [leftDoor, setLeftDoor] = useState<DoorState>({ isOpen: true, hasAnimatronic: false });
  const [rightDoor, setRightDoor] = useState<DoorState>({ isOpen: true, hasAnimatronic: false });
  const [power, setPower] = useState(100);
  const [time, setTime] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [victory, setVictory] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false);

  useEffect(() => {
    const moveAnimatronics = setInterval(() => {
      if (gameOver || victory) return;

      const shouldMoveLeft = Math.random() > 0.7;
      const shouldMoveRight = Math.random() > 0.7;

      if (shouldMoveLeft) {
        setLeftDoor(prev => {
          const newHasAnimatronic = !prev.hasAnimatronic;
          if (newHasAnimatronic) {
            const animatronicName = ANIMATRONIC_NAMES[Math.floor(Math.random() * ANIMATRONIC_NAMES.length)];
            toast({
              title: '⚠️ ЛЕВАЯ ДВЕРЬ',
              description: `${animatronicName} приближается слева!`,
              variant: 'destructive',
            });
            
            if (prev.isOpen) {
              setTimeout(() => {
                setGameOver(true);
                toast({
                  title: '💀 GAME OVER',
                  description: 'Аниматроник проник через открытую дверь!',
                  variant: 'destructive',
                });
              }, 3000);
            }
          }
          return { ...prev, hasAnimatronic: newHasAnimatronic };
        });
      }

      if (shouldMoveRight) {
        setRightDoor(prev => {
          const newHasAnimatronic = !prev.hasAnimatronic;
          if (newHasAnimatronic) {
            const animatronicName = ANIMATRONIC_NAMES[Math.floor(Math.random() * ANIMATRONIC_NAMES.length)];
            toast({
              title: '⚠️ ПРАВАЯ ДВЕРЬ',
              description: `${animatronicName} приближается справа!`,
              variant: 'destructive',
            });
            
            if (prev.isOpen) {
              setTimeout(() => {
                setGameOver(true);
                toast({
                  title: '💀 GAME OVER',
                  description: 'Аниматроник проник через открытую дверь!',
                  variant: 'destructive',
                });
              }, 3000);
            }
          }
          return { ...prev, hasAnimatronic: newHasAnimatronic };
        });
      }
    }, 6000);

    return () => clearInterval(moveAnimatronics);
  }, [gameOver, victory]);

  useEffect(() => {
    const powerDrain = setInterval(() => {
      if (gameOver || victory) return;
      
      let drain = 1;
      if (!leftDoor.isOpen) drain += 2;
      if (!rightDoor.isOpen) drain += 2;
      if (cameraOpen) drain += 1;
      
      setPower(prev => {
        const newPower = prev - drain;
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
  }, [gameOver, victory, leftDoor.isOpen, rightDoor.isOpen, cameraOpen]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (gameOver || victory) return;
      
      setTime(prev => {
        if (prev >= 6) {
          setVictory(true);
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
  }, [gameOver, victory]);

  const toggleDoor = (side: 'left' | 'right') => {
    if (gameOver || victory) return;
    
    if (side === 'left') {
      setLeftDoor(prev => ({ ...prev, isOpen: !prev.isOpen }));
    } else {
      setRightDoor(prev => ({ ...prev, isOpen: !prev.isOpen }));
    }
  };

  const resetGame = () => {
    setViewDirection('center');
    setLeftDoor({ isOpen: true, hasAnimatronic: false });
    setRightDoor({ isOpen: true, hasAnimatronic: false });
    setPower(100);
    setTime(0);
    setGameOver(false);
    setVictory(false);
    setCameraOpen(false);
  };

  const renderOfficeView = () => {
    if (cameraOpen) {
      return (
        <div className="relative w-full h-full bg-[#000000] camera-static">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <Icon name="Cctv" size={80} className="text-[#2d5016] opacity-50 mb-4 mx-auto" />
              <p className="text-xl text-[#2d5016] opacity-70">СИСТЕМА КАМЕР</p>
              <p className="text-sm text-[#2d5016] opacity-50 mt-2">Мониторинг локаций</p>
            </div>
          </div>
          <div className="absolute top-2 left-2 text-[#2d5016] text-xs font-mono opacity-70">
            REC ●
          </div>
        </div>
      );
    }

    if (viewDirection === 'center') {
      return (
        <div className="relative w-full h-full bg-gradient-to-b from-[#1a1a1a] to-[#0a0a0a] flex items-center justify-center">
          <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-[#2d2d2d] to-transparent"></div>
          
          <div className="absolute bottom-20 w-full flex justify-center gap-12">
            <div className="bg-[#1a1a1a] border-2 border-[#2d5016] p-4 rounded-lg">
              <Icon name="Monitor" size={60} className="text-[#2d5016] mb-2" />
              <p className="text-xs text-[#2d5016] text-center">МОНИТОР</p>
            </div>
            <div className="bg-[#1a1a1a] border-2 border-[#2d5016] p-4 rounded-lg">
              <Icon name="Coffee" size={60} className="text-[#2d5016] mb-2" />
              <p className="text-xs text-[#2d5016] text-center">КОФЕ</p>
            </div>
            <div className="bg-[#1a1a1a] border-2 border-[#2d5016] p-4 rounded-lg">
              <Icon name="Lightbulb" size={60} className="text-[#2d5016] mb-2" />
              <p className="text-xs text-[#2d5016] text-center">ЛАМПА</p>
            </div>
          </div>
          
          <div className="absolute top-1/2 left-10 transform -translate-y-1/2 text-[#2d5016] opacity-50 text-xs">
            ← ЛЕВАЯ ДВЕРЬ
          </div>
          <div className="absolute top-1/2 right-10 transform -translate-y-1/2 text-[#2d5016] opacity-50 text-xs">
            ПРАВАЯ ДВЕРЬ →
          </div>
        </div>
      );
    }

    if (viewDirection === 'left') {
      return (
        <div className="relative w-full h-full bg-gradient-to-r from-[#0a0a0a] to-[#1a1a1a]">
          <div className="absolute inset-0 border-8 border-[#2d2d2d] flex items-center justify-center">
            {leftDoor.isOpen ? (
              <div className="relative w-full h-full bg-[#050505] flex items-center justify-center border-4 border-[#2d5016]">
                {leftDoor.hasAnimatronic ? (
                  <div className="text-center animate-pulse">
                    <Icon name="Skull" size={150} className="text-[#8B0000] mb-4 mx-auto drop-shadow-[0_0_30px_rgba(139,0,0,1)]" />
                    <p className="text-5xl font-bold text-[#8B0000] tracking-widest animate-[glitch_0.3s_infinite]">
                      ⚠️ ОПАСНОСТЬ ⚠️
                    </p>
                    <p className="text-2xl text-[#8B0000] mt-4">
                      АНИМАТРОНИК У ДВЕРИ!
                    </p>
                  </div>
                ) : (
                  <div className="text-center">
                    <Icon name="DoorOpen" size={100} className="text-[#2d5016] opacity-30 mb-4 mx-auto" />
                    <p className="text-xl text-[#2d5016] opacity-50">
                      Коридор пуст
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="w-full h-full bg-[#1a1a1a] flex items-center justify-center border-4 border-[#8B0000]">
                <Icon name="DoorClosed" size={120} className="text-[#8B0000]" />
                <p className="absolute bottom-10 text-2xl text-[#8B0000] font-bold">ДВЕРЬ ЗАКРЫТА</p>
              </div>
            )}
          </div>
        </div>
      );
    }

    if (viewDirection === 'right') {
      return (
        <div className="relative w-full h-full bg-gradient-to-l from-[#0a0a0a] to-[#1a1a1a]">
          <div className="absolute inset-0 border-8 border-[#2d2d2d] flex items-center justify-center">
            {rightDoor.isOpen ? (
              <div className="relative w-full h-full bg-[#050505] flex items-center justify-center border-4 border-[#2d5016]">
                {rightDoor.hasAnimatronic ? (
                  <div className="text-center animate-pulse">
                    <Icon name="Skull" size={150} className="text-[#8B0000] mb-4 mx-auto drop-shadow-[0_0_30px_rgba(139,0,0,1)]" />
                    <p className="text-5xl font-bold text-[#8B0000] tracking-widest animate-[glitch_0.3s_infinite]">
                      ⚠️ ОПАСНОСТЬ ⚠️
                    </p>
                    <p className="text-2xl text-[#8B0000] mt-4">
                      АНИМАТРОНИК У ДВЕРИ!
                    </p>
                  </div>
                ) : (
                  <div className="text-center">
                    <Icon name="DoorOpen" size={100} className="text-[#2d5016] opacity-30 mb-4 mx-auto" />
                    <p className="text-xl text-[#2d5016] opacity-50">
                      Коридор пуст
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="w-full h-full bg-[#1a1a1a] flex items-center justify-center border-4 border-[#8B0000]">
                <Icon name="DoorClosed" size={120} className="text-[#8B0000]" />
                <p className="absolute bottom-10 text-2xl text-[#8B0000] font-bold">ДВЕРЬ ЗАКРЫТА</p>
              </div>
            )}
          </div>
        </div>
      );
    }
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
          <div className="flex gap-2">
            <div className={`text-xs px-2 py-1 rounded ${!leftDoor.isOpen ? 'bg-[#8B0000] text-white' : 'bg-[#1a1a1a] text-[#2d5016]'}`}>
              ← {leftDoor.isOpen ? 'ОТКРЫТА' : 'ЗАКРЫТА'}
            </div>
            <div className={`text-xs px-2 py-1 rounded ${!rightDoor.isOpen ? 'bg-[#8B0000] text-white' : 'bg-[#1a1a1a] text-[#2d5016]'}`}>
              {rightDoor.isOpen ? 'ОТКРЫТА' : 'ЗАКРЫТА'} →
            </div>
          </div>
        </div>
        <h1 className="text-2xl md:text-4xl text-[#8B0000] drop-shadow-[0_0_10px_rgba(139,0,0,0.8)] tracking-wider">
          SECURITY OFFICE
        </h1>
      </div>

      <div className="relative z-10 w-full max-w-6xl mt-20">
        <Card className="bg-[#0a0a0a] border-2 border-[#2d5016] p-6">
          <div className="relative aspect-video bg-[#000000] rounded-md overflow-hidden">
            {renderOfficeView()}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <Button
              variant="outline"
              size="lg"
              onClick={() => setViewDirection('left')}
              disabled={gameOver || victory}
              className={`${viewDirection === 'left' ? 'bg-[#2d5016] text-white' : 'bg-[#1a1a1a] text-[#2d5016]'} border-[#2d5016] hover:bg-[#2d5016] hover:text-white`}
            >
              <Icon name="ArrowLeft" size={24} className="mr-2" />
              Левая дверь
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={() => setViewDirection('center')}
              disabled={gameOver || victory}
              className={`${viewDirection === 'center' ? 'bg-[#2d5016] text-white' : 'bg-[#1a1a1a] text-[#2d5016]'} border-[#2d5016] hover:bg-[#2d5016] hover:text-white`}
            >
              <Icon name="Home" size={24} className="mr-2" />
              Центр
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={() => setViewDirection('right')}
              disabled={gameOver || victory}
              className={`${viewDirection === 'right' ? 'bg-[#2d5016] text-white' : 'bg-[#1a1a1a] text-[#2d5016]'} border-[#2d5016] hover:bg-[#2d5016] hover:text-white`}
            >
              Правая дверь
              <Icon name="ArrowRight" size={24} className="ml-2" />
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={() => setCameraOpen(!cameraOpen)}
              disabled={gameOver || victory}
              className={`${cameraOpen ? 'bg-[#2d5016] text-white' : 'bg-[#1a1a1a] text-[#2d5016]'} border-[#2d5016] hover:bg-[#2d5016] hover:text-white`}
            >
              <Icon name="Cctv" size={24} className="mr-2" />
              Камеры
            </Button>
          </div>

          {viewDirection === 'left' && (
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

          {viewDirection === 'right' && (
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
        </Card>

        {(gameOver || victory) && (
          <div className="absolute inset-0 bg-black/95 flex items-center justify-center backdrop-blur-sm">
            <Card className="bg-[#0a0a0a] border-4 border-[#8B0000] p-8 text-center max-w-md">
              <h2 className="text-5xl mb-4 text-[#8B0000] tracking-widest drop-shadow-[0_0_15px_rgba(139,0,0,1)]">
                {victory ? '🎉 ПОБЕДА!' : '💀 GAME OVER'}
              </h2>
              <p className="text-xl text-[#2d5016] mb-6">
                {victory 
                  ? 'Вы пережили ночь в охранной!' 
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
        <p>Поворачивайтесь и закрывайте двери когда видите аниматроников | Следите за энергией</p>
      </div>
    </div>
  );
}
