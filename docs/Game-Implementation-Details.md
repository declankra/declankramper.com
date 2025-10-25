# Implementation Details

A full Fusion Frenzy game implementation for your portfolio website. Here's what's included:

## Game Components

### Game Context (GameContext.tsx)
- Manages all game state ('inactive', 'instructions', 'active', 'gameOver') and logic.
- Controls computer cursor movements (random movement, bouncing, speed increase) and collision detection.
- Handles player cursor state, including trail generation and shrinking (game over if trail disappears after grace period).
- Implements a brief grace period at the start of the game.
- Tracks survival time and game over reasons ('collision', 'trailShrunk', 'exited').
- Handles score saving and retrieval from Supabase, including real-time leaderboard updates via Supabase subscriptions.

### Play Game Button (PlayGameButton.tsx)
- Appears in the top right corner with a fade-in animation after 1 second.
- Triggers the game state to 'instructions' when clicked.
- Includes logic to check for mobile devices (though the message is handled by `FusionFrenzyGame` and `MobileMessage`).

### Game Rules Modal (GameRulesModal.tsx)
- Displays when game state is 'instructions'.
- Explains how to play, including avoiding trails and the trail shrinking mechanic.
- Includes a button to start the game ('active' state).
- Allows toggling to view the `Leaderboard` component.

### Game Canvas (GameCanvas.tsx)
- Renders the player and computer cursors and their trails using HTML Canvas API.
- Implements smooth trail animations using quadratic curves.
- Draws cursor points as circles with white borders for visibility.
- Listens for mouse movement to update the player's position.
- Only active and visible during the 'active' game state.
- Includes temporary debug overlay (can be removed).

### Game HUD (GameHUD.tsx)
- Displays the current formatted survival time (MM:SS) during active gameplay.
- Includes an 'X' button allowing the player to exit the game manually (triggers 'gameOver' state with 'exited' reason).
- Positioned centrally at the top of the screen.

### Game Over Modal (GameOverModal.tsx)
- Displays when game state is 'gameOver'.
- Shows the final survival time (formatted as MM:SS.ms).
- Displays the reason for the game ending (collision, trail shrunk, exited).
- Allows players to input a name and save their score to the leaderboard via Supabase.
- Shows the `Leaderboard` and `ShareButton` components after the score is successfully saved.
- Includes buttons to 'Play Again' (resets game to 'instructions') or 'Leave' (closes modal, sets state to 'inactive' - only visible after saving).

### Leaderboard (Leaderboard.tsx)
- Displays top scores fetched from `GameContext` (originally from Supabase).
- Shows player rank, name, time survived (MM:SS.ms), and date achieved in a scrollable table.
- Handles loading/empty states.

### Main Game Component (FusionFrenzyGame.tsx)
- Integrates all game-related components.
- Wraps the application in the `GameProvider` context.
- Detects if the user is on a mobile device based on screen width.
- Conditionally renders either the `MobileMessage` component or the full suite of game components (`GameRulesModal`, `GameCanvas`, `GameHUD`, `GameOverModal`) based on the device type.

### Mobile Message (MobileMessage.tsx)
- Displays a modal specifically on mobile devices when the game is initiated ('instructions' or 'active' state).
- Informs the user that the game requires a desktop experience.
- Provides a button to close the message and return to the 'inactive' state.

### Share Button (ShareButton.tsx)
- Included in the `GameOverModal` after a score is saved.
- Allows users to share their score using the Web Share API (`navigator.share`) if available.
- Falls back to copying a formatted message (including score and website URL) to the clipboard if Web Share API is not supported or fails.
- Provides visual feedback when the text is copied.