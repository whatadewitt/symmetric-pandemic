# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Symmetric Pandemic is a web-based deck manager for the Pandemic board game that uses seeded random generation to enable reproducible games and team vs team competition. It manages both player and infection card decks while maintaining symmetry even after infection shuffles.

## Architecture

### Core Components

1. **Deck Management System** (`js/pandemic.js`)
   - Seeded random number generator using CustomRandom function
   - Player deck construction with epidemic cards distributed across subdivided decks
   - Infection deck management with bottom-card drawing and reshuffling

2. **Card Types**
   - 48 City cards divided into 4 color groups (red, blue, yellow, black) 
   - 6 Special Event cards (subset of available cards to maintain deck sync)
   - 6 Epidemic cards (labeled as "Infection 1-6")

3. **Game Flow**
   - Initial setup based on player count (2-5) and epidemic count (4-6)
   - Player deck divided into equal subdivisions with one epidemic per subdivision
   - Infection deck managed separately with special handling for epidemics

### Key Implementation Details

- Uses jQuery 1.7.2 for DOM manipulation (loaded from Google CDN)
- Custom Array prototype extensions for shuffle() and contains() methods
- Deck state tracked in global arrays: `playerDeck`, `infectionDeck`, `drawn`
- Visual feedback through CSS classes for different card types
- Mobile-optimized with iOS web app capabilities

## Development

### Running the Application
Open `index.html` in a web browser. No build process or server required.

### Testing
Manual testing only - no automated test framework configured.

### Key Files
- `index.html` - Main HTML structure and game UI
- `js/pandemic.js` - Core game logic and deck management
- `css/style.css` - Visual styling for cards and UI elements
- `images/` - Map images for city cards (public domain CIA World Factbook)

### Important Considerations
- Maintains deck synchronization for symmetric gameplay
- Special events limited to prevent shuffle desynchronization
- Google Analytics tracking included (UA-7542529-4)