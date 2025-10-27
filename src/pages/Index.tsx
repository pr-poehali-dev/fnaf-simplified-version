import { Card } from '@/components/ui/card';
import { GameHUD } from '@/components/game/GameHUD';
import { GameControls } from '@/components/game/GameControls';
import { CameraView } from '@/components/game/CameraView';
import { OfficeView } from '@/components/game/OfficeView';
import { GameOverScreen } from '@/components/game/GameOverScreen';
import { useGameLogic } from '@/components/game/useGameLogic';

export default function Index() {
  const {
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
  } = useGameLogic();

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#2d5016] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-radial from-[#1a1a1a] via-[#0a0a0a] to-black opacity-50"></div>
      
      <GameHUD 
        time={time}
        power={power}
        leftDoor={leftDoor}
        rightDoor={rightDoor}
      />

      <div className="relative z-10 w-full max-w-6xl mt-20">
        <Card className="bg-[#0a0a0a] border-2 border-[#2d5016] p-6">
          <div className="relative aspect-video bg-[#000000] rounded-md overflow-hidden">
            {cameraOpen ? (
              <CameraView 
                currentCamera={currentCamera}
                setCurrentCamera={setCurrentCamera}
                locations={locations}
                playSound={playSound}
              />
            ) : (
              <OfficeView 
                viewDirection={viewDirection}
                leftDoor={leftDoor}
                rightDoor={rightDoor}
                flashlightOn={flashlightOn}
              />
            )}
          </div>

          <GameControls
            viewDirection={viewDirection}
            setViewDirection={setViewDirection}
            cameraOpen={cameraOpen}
            setCameraOpen={setCameraOpen}
            flashlightOn={flashlightOn}
            toggleFlashlight={toggleFlashlight}
            leftDoor={leftDoor}
            rightDoor={rightDoor}
            toggleDoor={toggleDoor}
            gameOver={gameOver}
            victory={victory}
            playSound={playSound}
          />
        </Card>

        {(gameOver || victory) && (
          <GameOverScreen 
            victory={victory}
            resetGame={resetGame}
          />
        )}
      </div>

      <div className="absolute bottom-4 text-center text-[#2d5016] opacity-50 text-xs z-10 max-w-4xl px-4">
        <p>Следи за аниматрониками через 10 камер • Закрывай двери когда они у окна • Береги энергию</p>
        <p className="mt-1">Freddy (хитрый) • Bonnie (агрессивный) • Chica (непредсказуемая) • Foxy (быстрый)</p>
      </div>
    </div>
  );
}
