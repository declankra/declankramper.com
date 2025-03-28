# Product Requirements Document: Fusion Frenzy Trail Game

## Overview
Add an interactive cursor-based game to the homepage where users avoid colliding with AI opponent trails while maintaining compatibility with existing website functionality, based on the popular xbox "Fusion Frenzy Trail" game.


## User Stories
As a user, I want a "Play Game" button to appear on the homepage so I can start the game.
As a user, I want a clear explanation of the game rules before playing.
As a user, I want to play a game where I avoid computer cursor trails with my cursor.
As a user, I want to see my survival time and save my score with my name when I lose.
As a user, I want to view a scoreboard of top players.

## User Experience

### Game Launch
- Add a "Play Game" button in the top right corner of the homepage
- Button should appear with a fade-in animation after 1 second of page load
- Button should not interfere with existing homepage functionality, meaning the cursor effect that exists today should still work

### Gameplay
1. When clicked, display a modal explaining the rules:
   - Avoid running into trails left by other cursors
   - Last as long as possible without colliding with trails
   - Computer opponents will increase speed over time

2. Game mechanics:
   - User controls their cursor normally
   - Three computer opponents (red, blue, green) move randomly around the screen
   - All cursors leave trails behind them
   - Computer cursors increase speed every 5 seconds
   - Game continues until user collides with any trail
   - All existing homepage functionality remains accessible during gameplay

### Game End
- Display a "Game Over" modal showing total survival time
- Allow user to input their name to save to the scoreboard
- Provide option to restart the game or return to normal browsing

### Scoreboard
- Implement using Supabase real-time database
- Display rankings with:
  - Player name
  - Time survived
  - Date achieved
- Sort by longest survival time


## Feature Components

### Game Activation
- Add "Play Game" button in top right corner
- Button appears with subtle fade-in animation after 1 second of page load
- Button styling should match existing site aesthetics

### Game Rules Modal
- Triggered when user clicks "Play Game"
- Clear explanation: "Avoid running into colored trails left by other cursors"
- "Start Game" button to begin playing

### Gameplay Mechanics
- Player cursor maintains existing glowing trail effect
- Three computer opponents with distinct colored trails:
  - Red computer cursor
  - Blue computer cursor
  - Green computer cursor
- component cursors move randomly across the screen
- component cursor speed increases every 5 seconds
- Game continues until player collides with any AI trail
- Trails: Each computer cursor leaves a trail (e.g., red, blue, green) that persists as an obstacle.

### Game Over Experience
- Modal appears displaying "Game Over"
- Shows total survival time in minutes:seconds format
- Input field for player name
- "Save Score" button to record results

### Leaderboard Integration
- Connect to Supabase real-time database
- Display top scores in descending order by survival time
- Each entry shows:
  - Player name
  - Survival time
  - Date achieved
- Real-time updates when new scores are added

## Technical Requirements

### Frontend Implementation
- Canvas-based game overlay that doesn't interfere with underlying page elements
- Collision detection system for cursor trails
- Timer system tracking survival duration
- Responsive design for different screen sizes

### Backend Integration
- Supabase configuration for real-time leaderboard data
- Data schema: player_name (string), time_survived (float), date_achieved (timestamp)
- Next.js server actions for retrieving and submitting scores

1. Game overlay & Homepage integration:
   - Create a transparent canvas overlay that doesn't interfere with existing page content
   - Track cursor positions and draw trails for all players
Compatibility: Game coexists with existing homepage functionality (e.g., glowing cursor effect).
Behavior: When inactive, game elements are hidden; when active, game takes focus without disrupting other features.
Cleanup: Post-game, all game elements are removed, restoring normal homepage state.

2. Game logic:
   - Collision detection between user cursor and computer trails
   - Opponents: Three computer-controlled cursors, colored red, blue, and green.
   - Timer to track survival duration
   - Speed acceleration for computer cursors every 5 seconds
   - Random movement algorithm for computer players

3. Database integration:
   - Set up Supabase table with fields for name, time survived, and date
   - Implement real-time leaderboard updates

4. UI Elements:
   - "Play Game" button with fade-in animation
   - Game instructions modal
   - Game over screen with name input
   - Scoreboard display



### Technical Considerations
- **Implementation**: Use JavaScript with DOM elements for cursors and trails; requestAnimationFrame for smooth animation.
- **Trails**: Represented as small, colored divs updated per frame; limit to ~100 segments per cursor for performance.
- **Collision**: Check distance from user cursor to computer trail segments; trigger game over if within trail width.
- **Database**: Supabase client to insert and fetch scores (e.g., scores table with name, time_survived, date).
- **Optimization**: Reuse trail divs instead of creating new ones; disable homepage interactions during gameplay if needed.


## Design Considerations
   - Visuals: Computer cursors and trails should be distinct (red, blue, green) and align with the homepage’s aesthetic.
   - UI: Pop-ups should be simple, accessible, and responsive.
   - Feedback: Consider subtle indicators (e.g., border) during gameplay.

## Components to use
- CursorTrail.tsx (exists)
- GameCanvas.tsx
- GameOverModal.tsx
- GameRulesModal.tsx
- PlayGameButton.tsx
- Leaderboard.tsx
- lib/actions/saveScore.tsx

## Key Implementation Steps

1. **Modify HomePage Component**
   - Add the PlayGameButton component to the top right
   - Integrate the game components conditionally based on game state

2. **Create Game State Management**
   - Implement a React context or hook to manage game state
   - Track player position, computer cursors positions, collision detection, etc.

3. **Implement the GameCanvas**
   - Extend your existing canvas approach from CursorTrail.tsx
   - Create separate layers for player and computer trails
   - Handle collision detection

4. **Database Integration**
   - Use your existing Supabase setup
   - Create a new table for game scores (dk-fusion-frenzy-scores)