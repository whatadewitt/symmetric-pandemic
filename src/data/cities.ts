import { CityCard } from '../types/cards';

export const cities: Record<string, CityCard[]> = {
  red: [
    { type: 'city', name: 'Beijing', color: 'red', population: 17311000, image: '/images/beijing.png' },
    { type: 'city', name: 'Seoul', color: 'red', population: 22547000, image: '/images/seoul.png' },
    { type: 'city', name: 'Tokyo', color: 'red', population: 33400000, image: '/images/tokyo.png' },
    { type: 'city', name: 'Shanghai', color: 'red', population: 13482000, image: '/images/shanghai.png' },
    { type: 'city', name: 'Osaka', color: 'red', population: 20877000, image: '/images/osaka.png' },
    { type: 'city', name: 'Taipei', color: 'red', population: 8338000, image: '/images/taipei.png' },
    { type: 'city', name: 'Hong Kong', color: 'red', population: 7106000, image: '/images/hongkong.png' },
    { type: 'city', name: 'Bangkok', color: 'red', population: 9121000, image: '/images/bangkok.png' },
    { type: 'city', name: 'Ho Chi Minh City', color: 'red', population: 8314000, image: '/images/hochiminhcity.png' },
    { type: 'city', name: 'Manila', color: 'red', population: 20767000, image: '/images/manila.png' },
    { type: 'city', name: 'Jakarta', color: 'red', population: 26063000, image: '/images/jakarta.png' },
    { type: 'city', name: 'Sydney', color: 'red', population: 3785000, image: '/images/sydney.png' }
  ],
  blue: [
    { type: 'city', name: 'St. Petersburg', color: 'blue', population: 4879000, image: '/images/stpetersburg.png' },
    { type: 'city', name: 'Milan', color: 'blue', population: 5232000, image: '/images/milan.png' },
    { type: 'city', name: 'Essen', color: 'blue', population: 575000, image: '/images/essen.png' },
    { type: 'city', name: 'Paris', color: 'blue', population: 10755000, image: '/images/paris.png' },
    { type: 'city', name: 'Madrid', color: 'blue', population: 5427000, image: '/images/madrid.png' },
    { type: 'city', name: 'London', color: 'blue', population: 8586000, image: '/images/london.png' },
    { type: 'city', name: 'Toronto', color: 'blue', population: 5583000, image: '/images/toronto.png' },
    { type: 'city', name: 'New York', color: 'blue', population: 20464000, image: '/images/newyorkcity.png' },
    { type: 'city', name: 'Washington', color: 'blue', population: 4679000, image: '/images/washington.png' },
    { type: 'city', name: 'Atlanta', color: 'blue', population: 4715000, image: '/images/atlanta.png' },
    { type: 'city', name: 'Chicago', color: 'blue', population: 9121000, image: '/images/chicago.png' },
    { type: 'city', name: 'San Francisco', color: 'blue', population: 5864000, image: '/images/sanfrancisco.png' }
  ],
  yellow: [
    { type: 'city', name: 'Los Angeles', color: 'yellow', population: 14900000, image: '/images/losangeles.png' },
    { type: 'city', name: 'Mexico City', color: 'yellow', population: 19463000, image: '/images/mexicocity.png' },
    { type: 'city', name: 'Miami', color: 'yellow', population: 5582000, image: '/images/miami.png' },
    { type: 'city', name: 'Bogotá', color: 'yellow', population: 8702000, image: '/images/bogota.png' },
    { type: 'city', name: 'Lima', color: 'yellow', population: 9121000, image: '/images/lima.png' },
    { type: 'city', name: 'Santiago', color: 'yellow', population: 6015000, image: '/images/santiago.png' },
    { type: 'city', name: 'Buenos Aires', color: 'yellow', population: 13639000, image: '/images/buenosaires.png' },
    { type: 'city', name: 'São Paulo', color: 'yellow', population: 20186000, image: '/images/saopaulo.png' },
    { type: 'city', name: 'Kinshasa', color: 'yellow', population: 9046000, image: '/images/kinshasa.png' },
    { type: 'city', name: 'Lagos', color: 'yellow', population: 11547000, image: '/images/lagos.png' },
    { type: 'city', name: 'Khartoum', color: 'yellow', population: 4887000, image: '/images/khartoum.png' },
    { type: 'city', name: 'Johannesburg', color: 'yellow', population: 3888000, image: '/images/johannesburg.png' }
  ],
  black: [
    { type: 'city', name: 'Chennai', color: 'black', population: 8865000, image: '/images/chennai.png' },
    { type: 'city', name: 'Kolkata', color: 'black', population: 14374000, image: '/images/kolkata.png' },
    { type: 'city', name: 'Mumbai', color: 'black', population: 16910000, image: '/images/mumbai.png' },
    { type: 'city', name: 'Delhi', color: 'black', population: 22242000, image: '/images/delhi.png' },
    { type: 'city', name: 'Karachi', color: 'black', population: 20711000, image: '/images/karachi.png' },
    { type: 'city', name: 'Riyadh', color: 'black', population: 5037000, image: '/images/riyadh.png' },
    { type: 'city', name: 'Tehran', color: 'black', population: 7419000, image: '/images/teheran.png' },
    { type: 'city', name: 'Baghdad', color: 'black', population: 6204000, image: '/images/baghdad.png' },
    { type: 'city', name: 'Istanbul', color: 'black', population: 13576000, image: '/images/istanbul.png' },
    { type: 'city', name: 'Algiers', color: 'black', population: 2946000, image: '/images/algiers.png' },
    { type: 'city', name: 'Cairo', color: 'black', population: 14718000, image: '/images/cairo.png' },
    { type: 'city', name: 'Moscow', color: 'black', population: 15512000, image: '/images/moscow.png' }
  ]
};

export const getAllCities = (): CityCard[] => {
  return Object.values(cities).flat();
};