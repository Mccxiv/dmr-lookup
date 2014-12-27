# Card data for Marvel Dice Masters™

This module scrapes the web for the collectible dice game's card images.
It is powered by [dicemastersrules.com](http://www.dicemastersrules.com/)

```javascript
var dmr = require('dmr-lookup');

dmr.search('orm', console.log);

```
Will output:

```
[ { image: 'http://www.dicemaster...estess.png', title: 'Storm – African Priestess' },
  { image: 'http://www.dicemaster...021-Ro.png', title: 'Storm – Ro' },
  { image: 'http://www.dicemaster...Plains.png', title: 'Storm – Goddess of the Plains' },
  { image: 'http://www.dicemaster...-Rider.png', title: 'Storm – Wind Rider' },
  { image: 'http://www.dicemaster...-Witch.png', title: 'Storm – Weather Witch' },
  { image: 'http://www.dicemaster...erhero.png', title: 'Storm – Superhero' },
  { image: 'http://www.dicemaster...erator.png', title: 'Storm – Lady Liberator' },
  { image: 'http://www.dicemaster...Osborn.png', title: 'Green Goblin – Norman Osborn' },
  { image: 'http://www.dicemaster...-Storm.png', title: 'Human Torch – Johnny Storm' },
  { image: 'http://www.dicemaster...omrade.png', title: 'Magneto – Former Comrade' },
  { image: 'http://www.dicemaster...illain.png', title: 'Quicksilver – Former Villain' },
  { image: 'http://www.dicemaster...on-Ten.png', title: 'Wolverine – Formerly Weapon Ten' } ]
```

Keep in mind that making requests to a Wordpress site is slow.
It will have to do until someone provides a proper API. (｡･ω･｡)