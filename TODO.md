# Symmetric Pandemic Modernization TODO

## Phase 1: Foundation & Setup
- [x] Research all Pandemic special event/action cards from base game and expansions
- [x] Set up modern React project with TypeScript and Tailwind CSS
- [x] Create data models for cards, decks, and game state
- [x] Implement seeded random number generator as a utility

## Phase 2: Core Game Logic
- [x] Build card database with all special events and their effects
- [x] Create game setup component with expanded options
  - Player count (2-5)
  - Difficulty/Epidemic count (4-7)
  - Expansion selection
  - Random event card selection
- [x] Implement deck generation logic with random event selection
- [x] Create infection deck management with epidemic handling

## Phase 3: User Interface
- [x] Build card display components with Tailwind styling
- [x] Create game board/play area component
- [x] Implement card draw animations
- [x] Build responsive mobile-first UI with touch gestures
- [x] Add deck/discard pile visualizations

## Phase 4: State & Persistence
- [x] Implement game state persistence (localStorage/URL)
- [ ] Add game history and undo/redo functionality
- [x] Create share functionality for symmetric game seeds
- [ ] Support multiple saved games

## Phase 5: Enhancement Features
- [ ] Create game log to track drawn cards for post-game analysis
- [ ] Add PWA capabilities for offline play
- [ ] Implement game statistics tracking
- [ ] Add turn/round counter
- [ ] Create game log export functionality
- [ ] Support for additional expansions

## Phase 6: Testing & Polish
- [ ] Implement automated testing with Jest and React Testing Library
- [ ] Add E2E tests with Cypress or Playwright
- [ ] Performance optimization
- [ ] Accessibility improvements (ARIA labels, keyboard navigation)
- [ ] Documentation and user guide

## Special Event Cards to Include

### Base Game (5 cards)
- Airlift
- Government Grant
- One Quiet Night
- Forecast
- Resilient Population

### On The Brink Expansion (8 cards)
- Remote Transport
- Re-examined Research
- Rapid Vaccine Deployment
- Mobile Hospital
- Commercial Travel Ban
- Borrowed Time
- New Assignment
- Special Orders

### In The Lab Expansion (3 cards)
- Freeze Sample
- Sequenced Genome
- Remote Treatment

### State of Emergency Expansion (4 cards)
- Emergency Conference
- Local Initiative
- Coordinated Response
- Resource Management

## Technical Considerations
- Maintain backward compatibility with existing seed system
- Ensure deterministic deck generation for symmetric play
- Support for future expansion additions
- Consider WebWorker for complex deck calculations
- Implement proper error boundaries in React

## Nice-to-Have Features
- [ ] Dark mode support
- [ ] Sound effects toggle
- [ ] Multiple language support
- [ ] Integration with BoardGameGeek API
- [ ] Network multiplayer support
- [ ] AI assistant for rules questions
- [ ] Custom house rules configuration