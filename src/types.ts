export interface Hero {
  id: number;
  name: string;
  films: number[];
  starships: number[];
}

export interface HeroDetailed {
  id: number;
  name: string;
  films: Film[];
  starships: Starship[];
}

export interface Film {
  id: number;
  title: string;
  starships: number[];
}

export interface Starship {
  id: number;
  name: string;
  model: string;
  films: number[];
}
