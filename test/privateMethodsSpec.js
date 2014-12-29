
var chai = require("chai");
var assert = chai.assert;
var chaiAsPromised = require("chai-as-promised");
var dm = require("../dm-lookup.js");

chai.use(chaiAsPromised);
chai.should();

describe('dm-lookup Private methods', function()
{
	describe('getLinks()', function()
	{
		this.timeout('60000');
		var liveSearchPromise = dm.privates.getLinks({title: 'orm'});

		it('when searching with {title: "orm"}, be a non empty array', function()
		{
			return liveSearchPromise.should.eventually.be.an('Array').and.not.be.empty;
		});

		it('when searching with {title: "orm"}, return a particular url', function()
		{
			return liveSearchPromise.should.eventually.contain('http://www.dicemastersrules.com/card/storm-african-priestess/');
		});

		it('when searching {title: ""}, be an empty array', function()
		{
			return dm.privates.getLinks({title: ''}).should.eventually.be.an('Array').and.be.empty;
		});

		it('when searching {title: null}, be an empty array', function()
		{
			return dm.privates.getLinks({title: null}).should.eventually.be.an('Array').and.be.empty;
		});
	});

	describe('mergeLinks()', function()
	{
		it('should merge the arrays and not contain duplicates', function()
		{
			var arrays = [['a', 'd', 'c'], ['e', 'c']];
			var result = dm.privates.mergeLinks(arrays);

			result.should.include('a');
			result.should.include('c');
			result.should.include('d');
			result.should.include('e');
			result.should.be.of.length(4);
		});
	});

	describe('fetchLinks()', function()
	{
		this.timeout('60000');
		var links = ["http://www.dicemastersrules.com/card/storm-african-priestess/", "http://www.dicemastersrules.com/card/storm-goddess-of-the-plains/"];

		it('should fetch the urls into an array of html strings', function(done)
		{
			dm.privates.fetchLinks(links).then(function(htmlPages)
			{
				assert(Array.isArray(htmlPages), 'is an array');
				assert(htmlPages[0].indexOf('http://www.dicemastersrules.com/wp-content/uploads/2014/05/019-African-Priestess.png') > -1, 'seems to have fetched the correct page (1/2)');
				assert(htmlPages[1].indexOf('http://www.dicemastersrules.com/wp-content/uploads/2014/05/020-Godess-of-the-Plains.png') > -1, 'seems to have fetched the correct page (2/2)');
				done();
			}).catch(done);
		});
	});

	describe('parseResultsToCards()', function()
	{
		this.timeout('60000');
		var links = ["http://www.dicemastersrules.com/card/storm-african-priestess/", "http://www.dicemastersrules.com/card/storm-goddess-of-the-plains/"];

		it('should parse html strings into cards with image and name properties', function()
		{
			return dm.privates.fetchLinks(links).then(dm.privates.parseResultsToCards).should.eventually.deep.include.members([
			{
				image: 'http://www.dicemastersrules.com/wp-content/uploads/2014/05/019-African-Priestess.png',
				name: 'Storm – African Priestess'
			},
			{
				image: 'http://www.dicemastersrules.com/wp-content/uploads/2014/05/020-Godess-of-the-Plains.png',
				name: 'Storm – Goddess of the Plains'
			}]);
		});
	});
});