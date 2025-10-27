import Icon from '@/components/ui/icon';
import { ViewDirection, DoorState } from './types';
import { ANIMATRONICS } from './constants';

interface OfficeViewProps {
  viewDirection: ViewDirection;
  leftDoor: DoorState;
  rightDoor: DoorState;
  flashlightOn: boolean;
}

export function OfficeView({ viewDirection, leftDoor, rightDoor, flashlightOn }: OfficeViewProps) {
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
                <div className="relative w-full h-full">
                  <img 
                    src={animatronic.image} 
                    alt={animatronic.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-10 left-0 right-0 text-center">
                    <p className="text-5xl font-bold text-[#8B0000] tracking-widest animate-[glitch_0.3s_infinite] drop-shadow-[0_0_20px_rgba(139,0,0,1)]">
                      ⚠️ {animatronic.name} ⚠️
                    </p>
                    <p className="text-2xl text-[#8B0000] mt-4 font-bold animate-pulse">
                      ЗАКРОЙ ДВЕРЬ СЕЙЧАС!
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <Icon name="DoorOpen" size={100} className="text-[#2d5016] opacity-30 mb-4 mx-auto" />
                  <p className="text-xl text-[#2d5016] opacity-50">
                    West Hall пуст
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
                <div className="relative w-full h-full">
                  <img 
                    src={animatronic.image} 
                    alt={animatronic.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-10 left-0 right-0 text-center">
                    <p className="text-5xl font-bold text-[#8B0000] tracking-widest animate-[glitch_0.3s_infinite] drop-shadow-[0_0_20px_rgba(139,0,0,1)]">
                      ⚠️ {animatronic.name} ⚠️
                    </p>
                    <p className="text-2xl text-[#8B0000] mt-4 font-bold animate-pulse">
                      ЗАКРОЙ ДВЕРЬ СЕЙЧАС!
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <Icon name="DoorOpen" size={100} className="text-[#2d5016] opacity-30 mb-4 mx-auto" />
                  <p className="text-xl text-[#2d5016] opacity-50">
                    East Hall пуст
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

  return null;
}
