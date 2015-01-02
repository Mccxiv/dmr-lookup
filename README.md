
# Card data for Marvel Dice Masters™

This module scrapes the web for the collectible dice game's card images. It is currently powered by [dicemastersrules.com](http://www.dicemastersrules.com/)

### Installation
```
npm install --save dm-lookup
```

### Usage
```
var dm = require('dm-lookup');

var search = dm.search('storm');

search.on('list', console.log); //quick list, the cards lack some fields like image
search.on('card', console.log); //full card info, fires for each result
search.on('done', console.log); //complete list of full cards, slow!
```

### .on('list', fn)
```
[ { set: 'Avengers vs X-Men',
    number: '78',
    energy: 'Bolt',
    affiliation: 'Fantastic Four',
    cost: '4',
    title: 'Human Torch',
    subtitle: 'Johnny Storm',
    url: 'http://www.dicemastersrules.com/card/human-torch-johnny-storm/',
    name: 'Human Torch - Johnny Storm' },
  { set: 'Avengers vs X-Men',
    number: '19',
    energy: 'Mask',
    affiliation: 'X-Men',
    cost: '3',
    title: 'Storm',
    subtitle: 'African Priestess',
    url: 'http://www.dicemastersrules.com/card/storm-african-priestess/',
    name: 'Storm - African Priestess' } ... More not shown ]
```

### .on('card', fn)
```
{ set: 'Avengers vs X-Men',
  number: '19',
  energy: 'Mask',
  affiliation: 'X-Men',
  cost: '3',
  title: 'Storm',
  subtitle: 'African Priestess',
  url: 'http://www.dicemastersrules.com/card/storm-african-priestess/',
  name: 'Storm - African Priestess',
  image: 'http://www.dicemastersrules.com/wp-content/uploads/2014/05/019-African-Priestess.png',
  rarity: 'Common',
  maxDice: '4' }
```

### .on('done', fn)
```
[ { set: 'Avengers vs X-Men',
    number: '21',
    energy: 'Mask',
    affiliation: 'X-Men',
    cost: '2',
    title: 'Storm',
    subtitle: '\'Ro',
    url: 'http://www.dicemastersrules.com/card/storm-ro/',
    name: 'Storm - \'Ro',
    image: 'http://www.dicemastersrules.com/wp-content/uploads/2014/05/021-Ro.png',
    rarity: 'Common',
    maxDice: '4' } ... More not shown ]
```

### Running tests
Clone the repository from github, then:
```
npm install
npm run test
```

---

### Considerations
Making multiple requests to a Wordpress site is slow.
It will have to do until someone provides a proper API. (｡･ω･｡)