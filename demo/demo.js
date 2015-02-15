
var dm = require('./../dm-lookup.js');

var search = dm.search('storm');

search.on('list', console.log);
search.on('card', console.log);
search.on('done', console.log);