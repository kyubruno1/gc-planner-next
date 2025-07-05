export interface Card {
  type: string[];
  name: string;
  img: string;
  effects: {
    name: string;
    value: number;
  }[];
}

