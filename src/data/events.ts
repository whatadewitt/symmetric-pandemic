import { EventCard } from '../types/cards';

export const baseGameEvents: EventCard[] = [
  {
    type: 'event',
    name: 'Airlift',
    description: 'Move any 1 pawn to any city. Get permission before moving another player\'s pawn.',
    requiresState: false,
    image: 'images/airlift.png'
  },
  {
    type: 'event',
    name: 'Government Grant',
    description: 'Add 1 research station to any city (no City card needed).',
    requiresState: false,
    image: 'images/governmentgrant.png'
  },
  {
    type: 'event',
    name: 'One Quiet Night',
    description: 'Skip the next Infect Cities step (do not flip over any Infection cards).',
    requiresState: true,
    handler: 'oneQuietNight',
    image: 'images/onequietnight.png'
  },
  {
    type: 'event',
    name: 'Forecast',
    description: 'Draw, look at, and rearrange the top 6 cards of the Infection Deck. Put them back on top.',
    requiresState: true,
    handler: 'forecast',
    image: 'images/forecast.png'
  },
  {
    type: 'event',
    name: 'Resilient Population',
    description: 'Remove any 1 card in the Infection Discard Pile from the game. You may play this between the Infect and Intensify steps of an epidemic.',
    requiresState: true,
    handler: 'resilientPopulation',
    image: 'images/resilientpopulation.png'
  }
];

export const expansionEvents: Record<string, EventCard[]> = {
  onTheBrink: [
    {
      type: 'event',
      name: 'Borrowed Time',
      description: 'Take 2 extra actions this turn.',
      requiresState: false
    },
    {
      type: 'event',
      name: 'Commercial Travel Ban',
      description: 'Until your next turn, other players may not move from or to the city you are in.',
      requiresState: false
    },
    {
      type: 'event',
      name: 'Mobile Hospital',
      description: 'Choose a city. Remove up to 2 disease cubes from that city.',
      requiresState: false
    },
    {
      type: 'event',
      name: 'New Assignment',
      description: 'Take any Role card. Discard your current Role card.',
      requiresState: false
    },
    {
      type: 'event',
      name: 'Rapid Vaccine Deployment',
      description: 'Remove 1 disease cube from every city with at least 1 cube of a single, chosen color.',
      requiresState: false
    },
    {
      type: 'event',
      name: 'Re-examined Research',
      description: 'Take a City card that was discarded when your team Discovered a Cure and add it to any player\'s hand.',
      requiresState: false
    },
    {
      type: 'event',
      name: 'Remote Treatment',
      description: 'Remove 1 disease cube from the city containing the pawn matching a City card in any player\'s hand.',
      requiresState: false
    },
    {
      type: 'event',
      name: 'Special Orders',
      description: 'During this turn, you may move other players\' pawns as if they were your own.',
      requiresState: false
    }
  ]
};