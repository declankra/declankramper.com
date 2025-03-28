'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '@/components/game/GameContext';
import { X } from 'lucide-react';

export default function MobileMessage() {
  const { gameState, setGameState } = useGame();
  const isOpen = gameState === 'instructions' || gameState === 'active';

  const handleClose = () => {
    setGameState('inactive');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-background/90 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 flex items-center justify-center z-50"
          >
            <div className="w-full max-w-md bg-card border rounded-lg shadow-lg p-6 relative">
              <button 
                onClick={handleClose}
                className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X size={18} />
              </button>
              
              <div className="space-y-4 text-center">
                <h2 className="text-xl font-medium">Desktop Experience Required</h2>
                
                <p className="text-muted-foreground">
                  The Fusion Frenzy Trail game requires a desktop device with a mouse to play.
                </p>
                
                <p className="text-sm mt-4">
                  Please visit this site on a desktop computer to enjoy the full experience.
                </p>
                
                <button
                  onClick={handleClose}
                  className="mt-4 px-4 py-2 bg-primary text-primary-foreground text-sm rounded-md font-medium hover:bg-primary/90 transition-all duration-200"
                >
                  Got it
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
} 