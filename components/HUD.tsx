import { PlayerStats, BlockType } from '@/types/game';

interface HUDProps {
  playerStats: PlayerStats;
  inventory: BlockType[];
  selectedSlot: number;
  uiScale: number;
}

export default function HUD({ playerStats, inventory, selectedSlot, uiScale }: HUDProps) {
  const scale = uiScale;

  const blockIcons: Record<BlockType, string> = {
    grass: '🟩',
    dirt: '🟫',
    stone: '⬜',
    wood: '🪵',
    leaves: '🍃',
    sand: '🟨',
    water: '💧',
    cobblestone: '⬛',
    planks: '🪚',
  };

  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{ transform: `scale(${scale})`, transformOrigin: 'center' }}
    >
      {/* Health and Hunger Bar */}
      <div className="absolute top-4 left-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="flex gap-0.5">
            {Array.from({ length: 10 }).map((_, i) => {
              const filled = i < Math.ceil(playerStats.health / 2);
              const half = playerStats.health % 2 === 1 && i === Math.floor(playerStats.health / 2);
              return (
                <div
                  key={i}
                  className="relative"
                  style={{
                    width: '16px',
                    height: '16px',
                  }}
                >
                  <div
                    className="absolute inset-0"
                    style={{
                      background: '#000',
                      border: '1px solid #fff',
                      imageRendering: 'pixelated',
                    }}
                  />
                  {filled && (
                    <div
                      className="absolute inset-0.5"
                      style={{
                        background: half
                          ? 'linear-gradient(to right, #e74c3c 50%, transparent 50%)'
                          : '#e74c3c',
                        imageRendering: 'pixelated',
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex gap-0.5">
            {Array.from({ length: 10 }).map((_, i) => {
              const filled = i < Math.ceil(playerStats.hunger / 2);
              const half = playerStats.hunger % 2 === 1 && i === Math.floor(playerStats.hunger / 2);
              return (
                <div
                  key={i}
                  className="relative"
                  style={{
                    width: '16px',
                    height: '16px',
                  }}
                >
                  <div
                    className="absolute inset-0"
                    style={{
                      background: '#000',
                      border: '1px solid #fff',
                      imageRendering: 'pixelated',
                    }}
                  />
                  {filled && (
                    <div
                      className="absolute inset-0.5"
                      style={{
                        background: half
                          ? 'linear-gradient(to right, #f39c12 50%, transparent 50%)'
                          : '#f39c12',
                        imageRendering: 'pixelated',
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Hotbar */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
        <div className="flex gap-1">
          {inventory.map((blockType, index) => (
            <div
              key={index}
              className="relative flex items-center justify-center"
              style={{
                width: '48px',
                height: '48px',
                background: selectedSlot === index ? '#8B8B8B' : '#3A3A3A',
                border: selectedSlot === index ? '3px solid #FFF' : '2px solid #000',
                boxShadow: selectedSlot === index
                  ? 'inset 0 0 0 1px #000, 0 0 0 1px #FFF'
                  : 'inset 0 0 0 1px #5A5A5A',
                imageRendering: 'pixelated',
              }}
            >
              <span className="text-2xl">{blockIcons[blockType]}</span>
              <span
                className="absolute bottom-0.5 right-1 text-white text-xs"
                style={{
                  textShadow: '1px 1px 0 #000',
                  fontFamily: 'monospace',
                  fontWeight: 'bold',
                }}
              >
                {index + 1}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Crosshair */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="relative" style={{ width: '20px', height: '20px' }}>
          <div
            className="absolute top-1/2 left-0 right-0 -translate-y-1/2"
            style={{
              height: '2px',
              background: 'white',
              boxShadow: '0 0 2px black',
            }}
          />
          <div
            className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2"
            style={{
              width: '2px',
              background: 'white',
              boxShadow: '0 0 2px black',
            }}
          />
        </div>
      </div>
    </div>
  );
}
