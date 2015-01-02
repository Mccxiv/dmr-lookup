
var chai = require("chai");
var assert = chai.assert;
var chaiAsPromised = require("chai-as-promised");
var validator = require('validator');
var dm = require("../dm-lookup.js");

chai.use(chaiAsPromised);
chai.should();

describe('Public methods', function()
{
	describe('input tests', function()
	{
		this.timeout('30000');

		it('should throw error when passed null', function()
		{
			assert.throws(function() {dm.search(null);}, 'Invalid search terms');
		});

		it('should throw error when passed nothing', function()
		{
			assert.throws(function() {dm.search();}, 'Invalid search terms');
		});
	});

	describe('.abort() tests', function()
	{
		this.timeout('30000');

		it('should not emit "list" event after immediately calling abort', function(done)
		{
			var finished = false;
			var s = dm.search('storm');
			s.abort();

			setTimeout(function() {if (!finished) done();}, 10000);

			s.on('list', function()
			{
				finished = true;
				done(new Error('This event should have never been fired'));
			});
		});

		it('should not emit card events after immediately calling abort on "list"', function(done)
		{
			var s = dm.search('storm');
			var finished = false;

			s.on('list', function()
			{
				s.abort();

				// if the event hasn't fired one after 10 sec assume success
				setTimeout(function() {if (!finished) done();}, 10000);
			});

			s.on('card', function()
			{
				finished = true;
				done(new Error('Card fired but it shouldnt have'));
			});
		});

		it('should not emit card events after aborting 50ms into it', function(done)
		{
			var s = dm.search('storm');
			var finished = false;

			s.on('list', function()
			{
				// assumes scraping any individual card takes longer than 50 ms
				setTimeout(s.abort, 50);

				// if the event hasn't fired one after 10 sec assume the abort worked
				setTimeout(function() {if (!finished) done();}, 10000);
			});

			s.on('card', function()
			{
				finished = true;
				done(new Error('Card fired but it shouldnt have'));
			});
		});
	});

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