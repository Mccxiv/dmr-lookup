
var chai = require("chai");
var assert = chai.assert;
var chaiAsPromised = require("chai-as-promised");
var validator = require('validator');
var dm = require("../dm-lookup.js");

chai.use(chaiAsPromised);
chai.should();

describe('Public methods', function()
{
	describe('search("storm")', function ()
	{
		this.timeout('30000');

		it('The "list" event should return a non empty array', function(done)
		{
			var search = dm.search('storm');

			search.once('list', function(simpleCards)
			{
				try
				{
					assert.isArray(simpleCards);
					assert(simpleCards.length > 0);
					done();
				}
				catch (e) {done(e)}
			});
		});

		it('The "card" event should return a valid card', function(done)
		{
			var search = dm.search('storm');

			search.once('card', function(card)
			{
				try
				{
					validateCard(card);
					done();
				}
				catch (e) {done(e)}
			});
		});

		it('should fire "list" 1 time', function(done)
		{
			var search = dm.search('storm');
			var listCallCounter = 0;
			search.on('list', function() {listCallCounter++;});

			search.on('done', function()
			{
				try
				{
					assert.strictEqual(listCallCounter, 1);
					done();
				}
				catch (e) {done(e)}
			});
		});

		it('should fire "card" 8 times', function(done)
		{
			var search = dm.search('storm');
			var cardCallCounter = 0;
			search.on('card', function() {cardCallCounter++;});

			search.on('done', function()
			{
				try
				{
					assert.strictEqual(cardCallCounter, 8);
					done();
				}
				catch (e) {done(e)}
			});
		});
	});
});

function validateCard(card)
{
	assert.ok(card);
	assert.ok(card.name);
	assert.ok(card.set);
	assert.ok(card.number);
	assert.ok(card.energy);
	assert.ok(card.affiliation);
	assert.ok(card.cost);
	assert.ok(card.title);
	assert.ok(card.subtitle);
	assert.ok(validator.isURL(card.url));
	assert.ok(validator.isURL(card.image));
	assert.ok(card.rarity);
	assert.ok(card.maxDice);
}