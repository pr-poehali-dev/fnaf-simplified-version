import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { toast } from '@/components/ui/use-toast';

type ViewDirection = 'center' | 'left' | 'right';

type DoorState = {
  isOpen: boolean;
  hasAnimatronic: string | null;
};

type Location = {
  id: string;
  name: string;
  animatronic: string | null;
};

type Animatronic = {
  name: string;
  behavior: 'aggressive' | 'sneaky' | 'random' | 'fast';
  speed: number;
  icon: string;
};

const ANIMATRONICS: Animatronic[] = [
  { name: 'Freddy', behavior: 'sneaky', speed: 8000, icon: '🐻' },
  { name: 'Bonnie', behavior: 'aggressive', speed: 5000, icon: '🐰' },
  { name: 'Chica', behavior: 'random', speed: 7000, icon: '🐔' },
  { name: 'Foxy', behavior: 'fast', speed: 4000, icon: '🦊' },
];

const INITIAL_LOCATIONS: Location[] = [
  { id: 'stage', name: 'Сцена', animatronic: null },
  { id: 'dining', name: 'Столовая', animatronic: null },
  { id: 'kitchen', name: 'Кухня', animatronic: null },
  { id: 'corridor-left', name: 'Левый коридор', animatronic: null },
  { id: 'corridor-right', name: 'Правый коридор', animatronic: null },
  { id: 'storage', name: 'Подсобка', animatronic: null },
];

export default function Index() {
  const [viewDirection, setViewDirection] = useState<ViewDirection>('center');
  const [leftDoor, setLeftDoor] = useState<DoorState>({ isOpen: true, hasAnimatronic: null });
  const [rightDoor, setRightDoor] = useState<DoorState>({ isOpen: true, hasAnimatronic: null });
  const [power, setPower] = useState(100);
  const [time, setTime] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [victory, setVictory] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [currentCamera, setCurrentCamera] = useState(0);
  const [locations, setLocations] = useState<Location[]>(INITIAL_LOCATIONS);
  const [flashlightOn, setFlashlightOn] = useState(false);
  
  const audioContextRef = useRef<AudioContext | null>(null);

  const playSound = (frequency: number, duration: number, type: OscillatorType = 'sine') => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }
    const ctx = audioContextRef.current;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.frequency.value = frequency;
    oscillator.type = type;
    gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
    
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
  };

  useEffect(() => {
    const ambientInterval = setInterval(() => {
      if (!gameOver && !victory && Math.random() > 0.7) {
        playSound(50 + Math.random() * 100, 0.5, 'triangle');
      }
    }, 8000);

    return () => clearInterval(ambientInterval);
  }, [gameOver, victory]);

  useEffect(() => {
    const moveAnimatronics = setInterval(() => {
      if (gameOver || victory) return;

      ANIMATRONICS.forEach(animatronic => {
        if (Math.random() > 0.6) {
          setLocations(prev => {
            const newLocations = [...prev];
            const currentLocationIndex = newLocations.findIndex(loc => loc.animatronic === animatronic.name);
            
            if (currentLocationIndex === -1 && Math.random() > 0.5) {
              newLocations[0].animatronic = animatronic.name;
              return newLocations;
            }

            if (currentLocationIndex !== -1) {
              const currentLocation = newLocations[currentLocationIndex];
              
              if (currentLocation.id === 'corridor-left') {
                setLeftDoor(prev => {
                  if (!prev.hasAnimatronic) {
                    playSound(200, 0.3, 'sawtooth');
                    playSound(150, 0.5, 'square');
                    toast({
                      title: `⚠️ ${animatronic.icon} ${animatronic.name}`,
                      description: 'У ЛЕВОЙ ДВЕРИ!',
                      variant: 'destructive',
                    });
                  }
                  return { ...prev, hasAnimatronic: animatronic.name };
                });
                
                setTimeout(() => {
                  setLeftDoor(current => {
                    if (current.isOpen && current.hasAnimatronic === animatronic.name) {
                      setGameOver(true);
                      playSound(100, 1, 'sawtooth');
                      toast({
                        title: `💀 ${animatronic.icon} ${animatronic.name}`,
                        description: 'Jumpscare!',
                        variant: 'destructive',
                      });
                    }
                    return current;
                  });
                }, 3000);
                
                return newLocations;
              }
              
              if (currentLocation.id === 'corridor-right') {
                setRightDoor(prev => {
                  if (!prev.hasAnimatronic) {
                    playSound(200, 0.3, 'sawtooth');
                    playSound(150, 0.5, 'square');
                    toast({
                      title: `⚠️ ${animatronic.icon} ${animatronic.name}`,
                      description: 'У ПРАВОЙ ДВЕРИ!',
                      variant: 'destructive',
                    });
                  }
                  return { ...prev, hasAnimatronic: animatronic.name };
                });
                
                setTimeout(() => {
                  setRightDoor(current => {
                    if (current.isOpen && current.hasAnimatronic === animatronic.name) {
                      setGameOver(true);
                      playSound(100, 1, 'sawtooth');
                      toast({
                        title: `💀 ${animatronic.icon} ${animatronic.name}`,
                        description: 'Jumpscare!',
                        variant: 'destructive',
                      });
                    }
                    return current;
                  });
                }, 3000);
                
                return newLocations;
              }
              
              currentLocation.animatronic = null;
              
              const availableLocations = newLocations.filter(loc => 
                loc.id !== currentLocation.id && !loc.animatronic
              );
              
              if (availableLocations.length > 0) {
                let nextLocation;
                if (animatronic.behavior === 'aggressive') {
                  const corridors = availableLocations.filter(loc => 
                    loc.id.includes('corridor')
                  );
                  nextLocation = corridors.length > 0 
                    ? corridors[Math.floor(Math.random() * corridors.length)]
                    : availableLocations[Math.floor(Math.random() * availableLocations.length)];
                } else if (animatronic.behavior === 'fast') {
                  const corridors = availableLocations.filter(loc => 
                    loc.id.includes('corridor')
                  );
                  nextLocation = corridors.length > 0 
                    ? corridors[0]
                    : availableLocations[Math.floor(Math.random() * availableLocations.length)];
                } else {
                  nextLocation = availableLocations[Math.floor(Math.random() * availableLocations.length)];
                }
                
                nextLocation.animatronic = animatronic.name;
                playSound(100 + Math.random() * 50, 0.2);
              }
            }
            
            return newLocations;
          });
        }
      });
    }, 4000);

    return () => clearInterval(moveAnimatronics);
  }, [gameOver, victory]);

  useEffect(() => {
    const powerDrain = setInterval(() => {
      if (gameOver || victory) return;
      
      let drain = 0.5;
      if (!leftDoor.isOpen) drain += 1;
      if (!rightDoor.isOpen) drain += 1;
      if (cameraOpen) drain += 0.5;
      if (flashlightOn) drain += 1;
      
      setPower(prev => {
        const newPower = prev - drain;
        if (newPower <= 0) {
          setGameOver(true);
          playSound(80, 1.5, 'sawtooth');
          toast({
            title: '💀 GAME OVER',
            description: 'Энергия закончилась...',
            variant: 'destructive',
          });
          return 0;
        }
        return newPower;
      });
    }, 1000);

    return () => clearInterval(powerDrain);
  }, [gameOver, victory, leftDoor.isOpen, rightDoor.isOpen, cameraOpen, flashlightOn]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (gameOver || victory) return;
      
      setTime(prev => {
        const newTime = prev + 1;
        if (newTime >= 6) {
          setVictory(true);
          playSound(440, 0.5);
          playSound(554, 0.5);
          setTimeout(() => playSound(659, 0.8), 200);
          toast({
            title: '🎉 ВЫ ВЫЖИЛИ!',
            description: 'Вы пережили ночь!',
          });
          return 6;
        }
        playSound(300, 0.1);
        return newTime;
      });
    }, 45000);

    return () => clearInterval(timer);
  }, [gameOver, victory]);

  const toggleDoor = (side: 'left' | 'right') => {
    if (gameOver || victory) return;
    
    playSound(150, 0.2, 'square');
    
    if (side === 'left') {
      setLeftDoor(prev => {
        const newState = { ...prev, isOpen: !prev.isOpen };
        if (!newState.isOpen && prev.hasAnimatronic) {
          setTimeout(() => {
            setLeftDoor(current => ({ ...current, hasAnimatronic: null }));
            setLocations(locs => {
              const newLocs = [...locs];
              const corridorLeft = newLocs.find(l => l.id === 'corridor-left');
              if (corridorLeft) corridorLeft.animatronic = null;
              return newLocs;
            });
          }, 2000);
        }
        return newState;
      });
    } else {
      setRightDoor(prev => {
        const newState = { ...prev, isOpen: !prev.isOpen };
        if (!newState.isOpen && prev.hasAnimatronic) {
          setTimeout(() => {
            setRightDoor(current => ({ ...current, hasAnimatronic: null }));
            setLocations(locs => {
              const newLocs = [...locs];
              const corridorRight = newLocs.find(l => l.id === 'corridor-right');
              if (corridorRight) corridorRight.animatronic = null;
              return newLocs;
            });
          }, 2000);
        }
        return newState;
      });
    }
  };

  const toggleFlashlight = () => {
    if (gameOver || victory) return;
    playSound(200, 0.1);
    setFlashlightOn(prev => !prev);
  };

  const resetGame = () => {
    setViewDirection('center');
    setLeftDoor({ isOpen: true, hasAnimatronic: null });
    setRightDoor({ isOpen: true, hasAnimatronic: null });
    setPower(100);
    setTime(0);
    setGameOver(false);
    setVictory(false);
    setCameraOpen(false);
    setCurrentCamera(0);
    setLocations(INITIAL_LOCATIONS);
    setFlashlightOn(false);
  };

  const renderOfficeView = () => {
    if (cameraOpen) {
      const currentLocation = locations[currentCamera];
      const animatronicAtLocation = ANIMATRONICS.find(a => a.name === currentLocation.animatronic);
      
      return (
        <div className="relative w-full h-full bg-[#000000] camera-static">
          <div className="absolute inset-0 flex items-center justify-center">
            {animatronicAtLocation ? (
              <div className="text-center animate-pulse">
                <div className="text-8xl mb-4">{animatronicAtLocation.icon}</div>
                <p className="text-3xl font-bold text-[#8B0000] tracking-widest">
                  {animatronicAtLocation.name}
                </p>
                <p className="text-lg text-[#8B0000] mt-2">
                  В ЛОКАЦИИ: {currentLocation.name}
                </p>
              </div>
            ) : (
              <div className="text-center">
                <Icon name="Video" size={80} className="text-[#2d5016] opacity-50 mb-4 mx-auto" />
                <p className="text-xl text-[#2d5016] opacity-70">{currentLocation.name}</p>
                <p className="text-sm text-[#2d5016] opacity-50 mt-2">Локация пуста</p>
              </div>
            )}
          </div>
          <div className="absolute top-2 left-2 text-[#2d5016] text-xs font-mono opacity-70">
            REC ● CAM {currentCamera + 1}
          </div>
          <div className="absolute bottom-2 left-2 right-2">
            <div className="flex gap-2 flex-wrap">
              {locations.map((loc, idx) => (
                <Button
                  key={loc.id}
                  variant={currentCamera === idx ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => {
                    playSound(250, 0.1);
                    setCurrentCamera(idx);
                  }}
                  className={`text-xs ${
                    currentCamera === idx
                      ? 'bg-[#2d5016] text-white'
                      : 'bg-[#0a0a0a] border-[#2d5016] text-[#2d5016]'
                  } ${loc.animatronic ? 'border-[#8B0000] animate-pulse' : ''}`}
                >
                  {loc.name}
                  {loc.animatronic && ' 🔴'}
                </Button>
              ))}
            </div>
          </div>
        </div>
      );
    }

    if (viewDirection === 'center') {
      return (
        <div className="relative w-full h-full bg-gradient-to-b from-[#1a1a1a] to-[#0a0a0a] flex items-center justify-center">
          <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-[#2d2d2d] to-transparent"></div>
          
          <div className="absolute bottom-20 w-full flex justify-center gap-12">
            <div className="bg-[#1a1a1a] border-2 border-[#2d5016] p-4 rounded-lg transition-all hover:scale-105">
              <Icon name="Monitor" size={60} className="text-[#2d5016] mb-2" />
              <p className="text-xs text-[#2d5016] text-center">МОНИТОР</p>
            </div>
            <div className="bg-[#1a1a1a] border-2 border-[#2d5016] p-4 rounded-lg transition-all hover:scale-105">
              <Icon name="Coffee" size={60} className="text-[#2d5016] mb-2" />
              <p className="text-xs text-[#2d5016] text-center">КОФЕ</p>
            </div>
            <div className="bg-[#1a1a1a] border-2 border-[#2d5016] p-4 rounded-lg transition-all hover:scale-105">
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
      const animatronic = leftDoor.hasAnimatronic ? ANIMATRONICS.find(a => a.name === leftDoor.hasAnimatronic) : null;
      
      return (
        <div className="relative w-full h-full bg-gradient-to-r from-[#0a0a0a] to-[#1a1a1a]">
          <div className={`absolute inset-0 border-8 border-[#2d2d2d] flex items-center justify-center ${flashlightOn ? 'brightness-150' : ''}`}>
            {leftDoor.isOpen ? (
              <div className="relative w-full h-full bg-[#050505] flex items-center justify-center border-4 border-[#2d5016]">
                {animatronic ? (
                  <div className="text-center animate-pulse">
                    <div className="text-9xl mb-6">{animatronic.icon}</div>
                    <p className="text-5xl font-bold text-[#8B0000] tracking-widest animate-[glitch_0.3s_infinite]">
                      ⚠️ {animatronic.name} ⚠️
                    </p>
                    <p className="text-2xl text-[#8B0000] mt-4">
                      У ДВЕРИ! ЗАКРОЙ ДВЕРЬ!
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
          {flashlightOn && (
            <div className="absolute inset-0 bg-gradient-radial from-yellow-300/20 to-transparent pointer-events-none"></div>
          )}
        </div>
      );
    }

    if (viewDirection === 'right') {
      const animatronic = rightDoor.hasAnimatronic ? ANIMATRONICS.find(a => a.name === rightDoor.hasAnimatronic) : null;
      
      return (
        <div className="relative w-full h-full bg-gradient-to-l from-[#0a0a0a] to-[#1a1a1a]">
          <div className={`absolute inset-0 border-8 border-[#2d2d2d] flex items-center justify-center ${flashlightOn ? 'brightness-150' : ''}`}>
            {rightDoor.isOpen ? (
              <div className="relative w-full h-full bg-[#050505] flex items-center justify-center border-4 border-[#2d5016]">
                {animatronic ? (
                  <div className="text-center animate-pulse">
                    <div className="text-9xl mb-6">{animatronic.icon}</div>
                    <p className="text-5xl font-bold text-[#8B0000] tracking-widest animate-[glitch_0.3s_infinite]">
                      ⚠️ {animatronic.name} ⚠️
                    </p>
                    <p className="text-2xl text-[#8B0000] mt-4">
                      У ДВЕРИ! ЗАКРОЙ ДВЕРЬ!
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
          {flashlightOn && (
            <div className="absolute inset-0 bg-gradient-radial from-yellow-300/20 to-transparent pointer-events-none"></div>
          )}
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#2d5016] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-radial from-[#1a1a1a] via-[#0a0a0a] to-black opacity-50"></div>
      
      <div className="absolute top-0 left-0 right-0 bg-[#0a0a0a] border-b-2 border-[#2d5016] p-4 flex justify-between items-center z-10">
        <div className="flex gap-6 items-center flex-wrap">
          <div className="text-sm">
            <span className="text-[#8B0000] font-bold">НОЧЬ:</span> <span className="text-[#2d5016]">{time} AM</span>
          </div>
          <div className="text-sm">
            <span className="text-[#8B0000] font-bold">ЭНЕРГИЯ:</span> <span className={power < 30 ? 'text-[#8B0000] animate-pulse' : 'text-[#2d5016]'}>{Math.round(power)}%</span>
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
          SECURITY OFFICE
        </h1>
      </div>

      <div className="relative z-10 w-full max-w-6xl mt-20">
        <Card className="bg-[#0a0a0a] border-2 border-[#2d5016] p-6">
          <div className="relative aspect-video bg-[#000000] rounded-md overflow-hidden">
            {renderOfficeView()}
          </div>

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

      <div className="absolute bottom-4 text-center text-[#2d5016] opacity-50 text-xs z-10 max-w-4xl">
        <p>🐻 Freddy - хитрый | 🐰 Bonnie - агрессивный | 🐔 Chica - случайный | 🦊 Foxy - быстрый</p>
        <p className="mt-1">Следи за камерами • Закрывай двери когда видишь аниматроников • Используй фонарик</p>
      </div>
    </div>
  );
}
