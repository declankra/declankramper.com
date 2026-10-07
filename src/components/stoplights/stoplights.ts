// The book's pages, in the order they turn: places Declan has been, Europe
// west to east, then the Americas north to south. Every photo is openly
// licensed; the page lists the credits under the book.

export interface StoplightCredit {
  author: string
  license: string
  licenseUrl: string
  sourceUrl: string
  site: 'Wikimedia Commons' | 'Flickr'
}

export interface Stoplight {
  slug: string
  country: string
  alt: string
  credit: StoplightCredit
}

// Each photo is a 4:5 crop exported at two widths.
export const stoplightImage = (slug: string, width: 480 | 960) =>
  `/stoplights/${slug}-${width}.webp`

export const STOPLIGHTS: Stoplight[] = [
  {
    slug: 'portugal',
    country: 'portugal',
    alt: 'A pedestrian signal with the red man lit, in front of the blue-and-white azulejo tiles of the Capela das Almas in Porto',
    credit: {
      author: 'Francisco Anzola',
      license: 'CC BY 2.0',
      licenseUrl: 'https://creativecommons.org/licenses/by/2.0/',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Traffic_light_(47498289842).jpg',
      site: 'Wikimedia Commons',
    },
  },
  {
    slug: 'spain',
    country: 'spain',
    alt: 'A Barcelona pedestrian signal in its yellow housing, the green walking man lit, on a city street',
    credit: {
      author: 'Eric Fischer',
      license: 'CC BY 2.0',
      licenseUrl: 'https://creativecommons.org/licenses/by/2.0/',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Incandescent_%22walk%22_signal_(18437639905).jpg',
      site: 'Wikimedia Commons',
    },
  },
  {
    slug: 'france',
    country: 'france',
    alt: 'A Paris pedestrian signal at dusk, the red standing man glowing beside the unlit green walker',
    credit: {
      author: 'James Petts',
      license: 'CC BY-SA 2.0',
      licenseUrl: 'https://creativecommons.org/licenses/by-sa/2.0/',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Crossing_sign_(30169951972).jpg',
      site: 'Wikimedia Commons',
    },
  },
  {
    slug: 'italy',
    country: 'italy',
    alt: "An Italian three-light pedestrian signal with its amber walking figure lit, at Palermo's Quattro Canti beside a baroque statue and fountain",
    credit: {
      author: 'Jorge Franganillo',
      license: 'CC BY 2.0',
      licenseUrl: 'https://creativecommons.org/licenses/by/2.0/',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Palermo_(43973750555).jpg',
      site: 'Wikimedia Commons',
    },
  },
  {
    slug: 'croatia',
    country: 'croatia',
    alt: 'A Zagreb crossing at dusk: the red man lit, and a red light strip glowing on the curb for people looking down at their phones',
    credit: {
      author: 'Free To Use Sounds',
      license: 'CC BY-SA 4.0',
      licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Red_street_light_in_Zagreb_at_night.jpg',
      site: 'Wikimedia Commons',
    },
  },
  {
    slug: 'czech-republic',
    country: 'czech republic',
    alt: "The green man lit on the signal at Prague's narrowest alley, which only fits one person at a time",
    credit: {
      author: 'MOs810',
      license: 'CC BY 4.0',
      licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Alley_to_the_%C4%8Certovka_Restaurant_in_Praha_(1).jpg',
      site: 'Wikimedia Commons',
    },
  },
  {
    slug: 'canada',
    country: 'canada',
    alt: "A Québec City pedestrian signal with a 45-second countdown, above a sign that reads 'attendez votre feu'",
    credit: {
      author: 'abdallahh',
      license: 'CC BY 2.0',
      licenseUrl: 'https://creativecommons.org/licenses/by/2.0/',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Qu%C3%A9bec_(5590977699).jpg',
      site: 'Wikimedia Commons',
    },
  },
  {
    slug: 'united-states',
    country: 'united states',
    alt: 'An orange raised-hand signal glowing at dusk in Brooklyn, with the Manhattan skyline behind',
    credit: {
      author: 'Jongsun Lee',
      license: 'CC BY 3.0',
      licenseUrl: 'https://creativecommons.org/licenses/by/3.0/',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Stop_(219093643).jpeg',
      site: 'Wikimedia Commons',
    },
  },
  {
    slug: 'colombia',
    country: 'colombia',
    alt: 'A Bogotá traffic light showing red on a yellow pole, with brick towers and green mountains behind',
    credit: {
      author: 'Felipe Restrepo Acosta',
      license: 'CC BY-SA 4.0',
      licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Bogota_sem%C3%A1foro_en_rojo.JPG',
      site: 'Wikimedia Commons',
    },
  },
  {
    slug: 'peru',
    country: 'peru',
    alt: 'A Lima pedestrian signal under a yellow mast arm, the green walker lit beside a 45-second countdown',
    credit: {
      author: 'John Seb Barber',
      license: 'CC BY 2.0',
      licenseUrl: 'https://creativecommons.org/licenses/by/2.0/',
      sourceUrl: 'https://www.flickr.com/photos/69875617@N00/14196671261',
      site: 'Flickr',
    },
  },
]
