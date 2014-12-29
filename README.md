# Card data for Marvel Dice Masters™

This module scrapes the web for the collectible dice game's card images.

It is currently powered by [dicemastersrules.com](http://www.dicemastersrules.com/)

```
npm install mccxiv/dm-lookup --save
```

```
var dmr = require('dm-lookup');

dmr.search('orm', console.log);
```

Will output:

```
[ { image: 'http://www.dicemaster...estess.png', name: 'Storm – African Priestess' },
  { image: 'http://www.dicemaster...021-Ro.png', name: 'Storm – Ro' },
  { image: 'http://www.dicemaster...Plains.png', name: 'Storm – Goddess of the Plains' },
  { image: 'http://www.dicemaster...-Rider.png', name: 'Storm – Wind Rider' },
  { image: 'http://www.dicemaster...-Witch.png', name: 'Storm – Weather Witch' },
  { image: 'http://www.dicemaster...erhero.png', name: 'Storm – Superhero' },
  { image: 'http://www.dicemaster...erator.png', name: 'Storm – Lady Liberator' },
  { image: 'http://www.dicemaster...Osborn.png', name: 'Green Goblin – Norman Osborn' },
  { image: 'http://www.dicemaster...-Storm.png', name: 'Human Torch – Johnny Storm' },
  { image: 'http://www.dicemaster...omrade.png', name: 'Magneto – Former Comrade' },
  { image: 'http://www.dicemaster...illain.png', name: 'Quicksilver – Former Villain' },
  { image: 'http://www.dicemaster...on-Ten.png', name: 'Wolverine – Formerly Weapon Ten' } ]
```

Keep in mind that making requests to a Wordpress site is slow.

It will have to do until someone provides a proper API. (｡･ω･｡)