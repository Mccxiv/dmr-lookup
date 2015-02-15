'use strict';

var EventEmitter = require('events').EventEmitter;
var request = require('request');
var cheerio = require('cheerio');
var _ = require('underscore');
var q = require('q');

/**
 * Returns an event emitting object.
 * Eventually provides a 'simple' card list, followed by each complete card as they become available.
 * The cards in the 'simple' list lack the image, rarity and maxDice fields.
 * Wait until the complete card comes in to obtain the image.
 *
 * @example
 * var search = dm.search('storm');
 *
 * // fires once, always before cards
 * search.on('list', console.log);
 *
 * // fires once for each card in the search results
 * search.on('card', console.log);
 *
 * @public
 * @param {string} query - What to search for in the title, subtitle, and card text.
 * @fires list - Provides a list of all cards in the search results, in 'simple' form.
 * @fires card - Provides a single complete card from the search results.
 * @returns {EventEmitter}
 */
function search(query)
{
	var emitter = new EventEmitter();
	var requests = []; // saving the requests to be able to abort them if needed.
	var cards = [];
	var aborted = false;
	var list;

	var listPromise = fetchList(createSearchParams(query));
	listPromise.then(emitList).then(fetchAndEmitCards);

	if (listPromise.request) requests.push(listPromise.request);

	function emitList(cardList)
	{
		list = cardList;
		emitter.emit('list', cardList);
		return cardList;
	}

	function fetchAndEmitCards(cardList)
	{
		if (!aborted) _(cardList).each(fetchAndEmitCard);
	}

	function fetchAndEmitCard(simpleCard)
	{
		var cardPromise = fetchCard(simpleCard);
		cardPromise.then(emitCard);

		if (cardPromise.request) requests.push(cardPromise.request);
	}

	function emitCard(card)
	{
		cards.push(card);
		emitter.emit('card', card);
		if (cards.length === list.length) emitter.emit('done', cards);
	}

	emitter.abort = function()
	{
		aborted = true;
		_(requests).each(function(r) {r.abort();});
	};

	return emitter;
}

/**
 * Eventually returns an array of 'simple' cards.
 * 'Simple' cards lack the image, rarity and maxDice fields.
 *
 * @private
 * @param {{type: string, query: string}} query
 * @returns {promise} - Eventually an array of 'simple' cards.
 */
function fetchList(query)
{
	var input = query;
	var urlRoot = 'http://www.dicemastersrules.com/advanced-search/';
	var deferred = q.defer();
	var cards = [];

	if (input.query)
	{
		var url = urlRoot+'?'+input.type+'='+encodeURIComponent(input.query);
		deferred.promise.request = request(url, function(error, response, body)
		{
			if (!error) cards = parseHtmlToCards(body);
			deferred.resolve(cards);
		});
	}
	else deferred.resolve(cards);

	return deferred.promise;
}

/**
 * Uses a 'simple' card's url property to fetch and parse it into a complete card
 *
 * @private
 * @param {object} simpleCard
 * @returns {promise} - Eventually returns a complete card
 */
function fetchCard(simpleCard)
{
	var deferred = q.defer();
	if (!simpleCard || !simpleCard.url) fail('Invalid arguments to fetchCard');
	deferred.promise.request = request(simpleCard.url, function(error, response, body)
	{
		if (!error)
		{
			var card = _(simpleCard).extend(parseHtmlToCard(body));
			deferred.resolve(card);
		}
		else fail('Request failed in fetchCard');
	});
	return deferred.promise;
	function fail(msg) {deferred.reject(new Error(msg));}
}

/**
 * Takes the html from a search and turns it into 'simple' cards.
 * 'Simple' cards lack the image, rarity and maxDice fields.
 *
 * @private
 * @param {string} searchResultsHtml
 * @returns {Array} - An Array of 'simple' cards
 */
function parseHtmlToCards(searchResultsHtml)
{
	var cards = [];
	var $ = cheerio.load(searchResultsHtml);
	var tableRows = $('.table-condensed tbody tr');
	tableRows.each(function()
	{
		var el = $(this);
		var card = {};
		card.set = 			el.find('td:nth-child(1)').text();
		card.number = 		el.find('td:nth-child(2)').text();
		card.energy = 		el.find('td:nth-child(3)').text();
		card.affiliation = 	el.find('td:nth-child(4)').text();
		card.cost = 		el.find('td:nth-child(5)').text();
		card.title = 		el.find('td:nth-child(6)').text();
		card.subtitle =		el.find('td:nth-child(7)').text();
		card.url = 			el.find('td:nth-child(7) a').attr('href');
		card.name = 		card.title + ' - ' + card.subtitle;
		cards.push(card);
	});
	return cards;
}

/**
 * Takes html from a specific card's page and returns a card fragment
 * These are the missing bits that a 'simple' card needs to become a complete card
 *
 * @private
 * @param {string} cardPageHtml
 * @returns {{image: string, rarity: string, maxDice: string|number}}
 */
function parseHtmlToCard(cardPageHtml)
{
	var $ = cheerio.load(cardPageHtml);
	var table = $('.table-condensed');
	var img = $('.attachment-full').attr('src') || '';
	return {
		image: img.indexOf('//') === 0? 'http:'+img : img,
		rarity: table.find('tr:nth-child(3) td:nth-child(2)').text(),
		maxDice: table.find('tr:nth-child(7) td:nth-child(2)').text()
	};
}

/**
 * Helper function
 * Converts the public API input into a format that works for the scraping function.
 *
 * @private
 * @param {string | {title: string} | {subtitle: string} | {all: string}} searchInput
 * @return {{type: string, query: string}}
 */
function createSearchParams(searchInput)
{
	if (!searchInput) throw new Error('Invalid search terms');
	var input = {type: 'wpv_post_search', query: ''};

	if (typeof searchInput === 'object')
	{
		if (isString(searchInput.title))
		{
			input.type ='card-title';
			input.query = searchInput.title;
		}
		else if (isString(searchInput.subtitle))
		{
			input.type = 'card-subtitle';
			input.query = searchInput.subtitle;
		}
		else if (isString(searchInput.all)) input.query = searchInput.all;
	}
	else if (isString(searchInput)) input.query = searchInput;

	return input;

	function isString(thing) {return typeof thing === 'string';}
}

module.exports = {search: search};