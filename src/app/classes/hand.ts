export class Hand {
  hand: Card[];
  displayAll: boolean;
}

export class Card {
  sign: string;
  points: number;
  scalePriority: number;
  trump: boolean;
}

export class AcceptCard {
  username: string;
  card: string;
}
