import { GameSettings } from '@/types/game';

interface PauseMenuProps {
  onResume: () => void;
  onSave: () => void;
  onExit: () => void;
  settings: GameSettings;
  onSettingsChange: (settings: Partial<GameSettings>) => void;
}

export default function PauseMenu({
  onResume,
  onSave,
  onExit,
  settings,
  onSettingsChange,
}: PauseMenuProps) {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/70 pointer-events-auto z-50">
      <div
        className="relative p-8"
        style={{
          background: '#3A3A3A',
          border: '4px solid #000',
          boxShadow: 'inset 0 0 0 2px #5A5A5A, 0 8px 0 #000',
          minWidth: '400px',
          imageRendering: 'pixelated',
        }}
      >
        <h1
          className="text-white text-center mb-6"
          style={{
            fontSize: '24px',
            textShadow: '3px 3px 0 #000',
            fontFamily: 'monospace',
            fontWeight: 'bold',
          }}
        >
          GAME PAUSED
        </h1>

        <div className="flex flex-col gap-3">
          <MenuButton onClick={onResume}>Resume Game</MenuButton>
          <MenuButton onClick={onSave}>Save Game</MenuButton>

          <div className="my-4">
            <h2
              className="text-white mb-3 text-sm"
              style={{
                textShadow: '2px 2px 0 #000',
                fontFamily: 'monospace',
              }}
            >
              SETTINGS
            </h2>

            <div className="space-y-3">
              <div>
                <label className="text-white text-xs block mb-1">
                  Mouse Sensitivity: {settings.mouseSensitivity.toFixed(1)}
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="2"
                  step="0.1"
                  value={settings.mouseSensitivity}
                  onChange={(e) =>
                    onSettingsChange({ mouseSensitivity: parseFloat(e.target.value) })
                  }
                  className="w-full"
                  style={{
                    accentColor: '#5C8B3C',
                  }}
                />
              </div>

              <div>
                <label className="text-white text-xs block mb-1">
                  UI Scale: {settings.uiScale.toFixed(1)}
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={settings.uiScale}
                  onChange={(e) =>
                    onSettingsChange({ uiScale: parseFloat(e.target.value) })
                  }
                  className="w-full"
                  style={{
                    accentColor: '#5C8B3C',
                  }}
                />
              </div>

              <div>
                <label className="text-white text-xs block mb-1">
                  Render Distance: {settings.renderDistance}
                </label>
                <input
                  type="range"
                  min="50"
                  max="200"
                  step="10"
                  value={settings.renderDistance}
                  onChange={(e) =>
                    onSettingsChange({ renderDistance: parseInt(e.target.value) })
                  }
                  className="w-full"
                  style={{
                    accentColor: '#5C8B3C',
                  }}
                />
              </div>
            </div>
          </div>

          <div className="border-t-2 border-black/50 pt-3 mt-2">
            <MenuButton onClick={onExit} variant="danger">
              Exit to Menu
            </MenuButton>
          </div>
        </div>

        <div className="mt-4 text-center text-xs text-gray-400">
          <p>Press ESC to resume</p>
        </div>
      </div>
    </div>
  );
}

interface MenuButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  variant?: 'default' | 'danger';
}

function MenuButton({ onClick, children, variant = 'default' }: MenuButtonProps) {
  const bgColor = variant === 'danger' ? '#8B3A3A' : '#5C8B3C';
  const hoverColor = variant === 'danger' ? '#A04040' : '#6FA043';

  return (
    <button
      onClick={onClick}
      className="w-full py-3 px-4 text-white font-bold transition-all"
      style={{
        background: bgColor,
        border: '3px solid #000',
        boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.3), 0 4px 0 #000',
        textShadow: '2px 2px 0 #000',
        fontFamily: 'monospace',
        fontSize: '14px',
        imageRendering: 'pixelated',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = hoverColor;
        e.currentTarget.style.transform = 'translateY(2px)';
        e.currentTarget.style.boxShadow = 'inset 0 0 0 1px rgba(255,255,255,0.3), 0 2px 0 #000';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = bgColor;
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'inset 0 0 0 1px rgba(255,255,255,0.3), 0 4px 0 #000';
      }}
    >
      {children}
    </button>
  );
}
