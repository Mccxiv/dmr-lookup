
var chai = require("chai");
var assert = chai.assert;
var chaiAsPromised = require("chai-as-promised");
var validator = require('validator');
var dm = require("../dm-lookup.js");

chai.use(chaiAsPromised);
chai.should();

describe('dm-lookup search method', function()
{
	describe('search() as a promise', function()
	{
		this.timeout('60000');
		var promise = dm.search('orm');

		it('should look like a promise', function()
		{
			assert.isDefined(promise.then, 'has a then property');
			assert.isFunction(promise.then, 'the then property is a function');
		});

		it('return value should not be empty', function()
		{
			return promise.should.eventually.not.be.empty;
		});

		it('the returned cards should be valid', function()
		{
			return promise.then(validateCards);
		});
	});

	describe('search() via callback', function()
	{
		this.timeout('60000');

		it('should not be empty and should contain only valid cards', function(done)
		{
			dm.search('orm', function(cards)
			{
				try
				{
					assert(cards.length, 'cards array should not be empty');
					validateCards(cards);
					done();
				}
				catch(e) {done(e);}
			});
		});
	});
});

function validateCards(cards)
{
	cards.forEach(function(card)
	{
		assert.ok(card, 'card should be ok');
		assert.ok(card.name, 'card name should be ok');
		assert.ok(card.image, 'card image should be ok');
		assert(validator.isURL(card.image), 'image is url');
	});
}
