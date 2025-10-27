import { useState, useEffect, useRef } from 'react';
import { toast } from '@/components/ui/use-toast';
import { ViewDirection, DoorState, Location } from './types';
import { ANIMATRONICS, INITIAL_LOCATIONS, PATH_MAP } from './constants';

export function useGameLogic() {
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
  const attackTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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
        if (Math.random() > 0.65) {
          setLocations(prev => {
            const newLocations = [...prev];
            const currentLocationIndex = newLocations.findIndex(loc => loc.animatronic === animatronic.name);
            
            if (currentLocationIndex === -1 && Math.random() > 0.5) {
              const showStage = newLocations.find(l => l.id === 'show-stage');
              if (showStage && !showStage.animatronic) {
                showStage.animatronic = animatronic.name;
              }
              return newLocations;
            }

            if (currentLocationIndex !== -1) {
              const currentLocation = newLocations[currentLocationIndex];
              
              if (currentLocation.id === 'west-hall-corner') {
                setLeftDoor(prev => {
                  if (!prev.hasAnimatronic) {
                    playSound(200, 0.3, 'sawtooth');
                    playSound(150, 0.5, 'square');
                    toast({
                      title: `⚠️ ${animatronic.name}`,
                      description: 'У ЛЕВОЙ ДВЕРИ!',
                      variant: 'destructive',
                    });
                  }
                  return { ...prev, hasAnimatronic: animatronic.name };
                });
                
                if (attackTimeoutRef.current) clearTimeout(attackTimeoutRef.current);
                attackTimeoutRef.current = setTimeout(() => {
                  setLeftDoor(current => {
                    if (current.isOpen && current.hasAnimatronic === animatronic.name) {
                      setGameOver(true);
                      playSound(100, 1, 'sawtooth');
                      toast({
                        title: `💀 ${animatronic.name} атаковал!`,
                        description: 'Jumpscare!',
                        variant: 'destructive',
                      });
                    }
                    return current;
                  });
                }, 5000);
                
                return newLocations;
              }
              
              if (currentLocation.id === 'east-hall-corner') {
                setRightDoor(prev => {
                  if (!prev.hasAnimatronic) {
                    playSound(200, 0.3, 'sawtooth');
                    playSound(150, 0.5, 'square');
                    toast({
                      title: `⚠️ ${animatronic.name}`,
                      description: 'У ПРАВОЙ ДВЕРИ!',
                      variant: 'destructive',
                    });
                  }
                  return { ...prev, hasAnimatronic: animatronic.name };
                });
                
                if (attackTimeoutRef.current) clearTimeout(attackTimeoutRef.current);
                attackTimeoutRef.current = setTimeout(() => {
                  setRightDoor(current => {
                    if (current.isOpen && current.hasAnimatronic === animatronic.name) {
                      setGameOver(true);
                      playSound(100, 1, 'sawtooth');
                      toast({
                        title: `💀 ${animatronic.name} атаковал!`,
                        description: 'Jumpscare!',
                        variant: 'destructive',
                      });
                    }
                    return current;
                  });
                }, 5000);
                
                return newLocations;
              }
              
              currentLocation.animatronic = null;
              
              const possibleMoves = PATH_MAP[currentLocation.id] || [];
              const availableMoves = possibleMoves
                .map(id => newLocations.find(loc => loc.id === id))
                .filter(loc => loc && !loc.animatronic) as Location[];
              
              if (availableMoves.length > 0) {
                let nextLocation;
                
                if (animatronic.behavior === 'aggressive') {
                  const doorMoves = availableMoves.filter(loc => 
                    loc.id.includes('corner')
                  );
                  nextLocation = doorMoves.length > 0 
                    ? doorMoves[0]
                    : availableMoves[Math.floor(Math.random() * availableMoves.length)];
                } else if (animatronic.behavior === 'fast') {
                  const doorMoves = availableMoves.filter(loc => 
                    loc.id.includes('corner')
                  );
                  nextLocation = doorMoves.length > 0 
                    ? doorMoves[0]
                    : availableMoves[0];
                } else {
                  nextLocation = availableMoves[Math.floor(Math.random() * availableMoves.length)];
                }
                
                nextLocation.animatronic = animatronic.name;
                playSound(100 + Math.random() * 50, 0.2);
              }
            }
            
            return newLocations;
          });
        }
      });
    }, 6000);

    return () => {
      clearInterval(moveAnimatronics);
      if (attackTimeoutRef.current) clearTimeout(attackTimeoutRef.current);
    };
  }, [gameOver, victory]);

  useEffect(() => {
    const powerDrain = setInterval(() => {
      if (gameOver || victory) return;
      
      let drain = 0.095;
      if (!leftDoor.isOpen) drain += 0.095;
      if (!rightDoor.isOpen) drain += 0.095;
      if (cameraOpen) drain += 0.01;
      if (flashlightOn) drain += 0.05;
      
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
    }, 100);

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
            title: '🎉 6 AM - ВЫ ВЫЖИЛИ!',
            description: 'Вы пережили ночь!',
          });
          return 6;
        }
        playSound(300, 0.1);
        return newTime;
      });
    }, 90000);

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
              const corner = newLocs.find(l => l.id === 'west-hall-corner');
              if (corner) corner.animatronic = null;
              return newLocs;
            });
          }, 3000);
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
              const corner = newLocs.find(l => l.id === 'east-hall-corner');
              if (corner) corner.animatronic = null;
              return newLocs;
            });
          }, 3000);
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
    if (attackTimeoutRef.current) clearTimeout(attackTimeoutRef.current);
  };

  return {
    viewDirection,
    setViewDirection,
    leftDoor,
    rightDoor,
    power,
    time,
    gameOver,
    victory,
    cameraOpen,
    setCameraOpen,
    currentCamera,
    setCurrentCamera,
    locations,
    flashlightOn,
    toggleDoor,
    toggleFlashlight,
    resetGame,
    playSound,
  };
}
