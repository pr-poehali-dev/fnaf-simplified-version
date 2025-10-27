import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface GameOverScreenProps {
  victory: boolean;
  resetGame: () => void;
}

export function GameOverScreen({ victory, resetGame }: GameOverScreenProps) {
  return (
    <div className="absolute inset-0 bg-black/95 flex items-center justify-center backdrop-blur-sm">
      <Card className="bg-[#0a0a0a] border-4 border-[#8B0000] p-8 text-center max-w-md">
        <h2 className="text-5xl mb-4 text-[#8B0000] tracking-widest drop-shadow-[0_0_15px_rgba(139,0,0,1)]">
          {victory ? '🎉 6 AM!' : '💀 GAME OVER'}
        </h2>
        <p className="text-xl text-[#2d5016] mb-6">
          {victory 
            ? 'Вы пережили ночь в Freddy Fazbear Pizza!' 
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
  );
}
