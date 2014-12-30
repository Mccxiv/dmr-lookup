'use strict';

var request = require('request-promise');
var cheerio = require('cheerio');
var _ = require('underscore');
var q = require('q');

/**
 * Returns an array of cards in this format:
 * [{name: "Card Name - Subtype", image: "url-to-img"}]
 *
 * Works either as a promise (q) or via callback
 *
 * @public
 * @param {string} query - What to search for, in either name or subtype
 * @param {function} [callback] - Will be passed an array of card objects
 * @returns {request.Request.promise|promise|Q.promise} - Promises an array of card objects
 */
function search(query, callback)
{
	var d = q.defer();
	var title = {title: query};
	var subtitle = {subtitle: query};
	q.all([getLinks(title), getLinks(subtitle)]).then(mergeLinks).then(fetchLinks).then(parsePagesToCards).done(finished);
	return d.promise;

	function finished(result)
	{
		if (callback) callback(result);
		d.resolve(result);
	}
}

/**
 * Takes a query object and returns a promise
 * for an array of urls to matching cards.
 *
 * @private
 * @param {Object} obj - Either {title: <query>} or {subtitle: <query>}
 * @returns {request.Request.promise|promise|Q.promise}
 */
function getLinks(obj)
{
	// TODO can be refactored
	var urlRoot = 'http://www.dicemastersrules.com/advanced-search/';
	var deferred = q.defer();
	var links = [];
	var searchType;
	var searchQuery;

	if (obj.title)
	{
		searchType ='card-title';
		searchQuery = obj.title;
	}
	else if (obj.subtitle)
	{
		searchType = 'card-subtitle';
		searchQuery = obj.subtitle;
	}
	else deferred.resolve(links);

	if (searchType)
	{
		var url = urlRoot+'?'+searchType+'='+encodeURIComponent(searchQuery);
		request(url, function(error, response, body)
		{
			if (!error)
			{
				var $ = cheerio.load(body);
				var anchors = $('.table-condensed td:nth-child(7) a');
				anchors.each(function() {links.push($(this).attr('href'));});
			}
			deferred.resolve(links);
		});
	}

	return deferred.promise;
}

/**
 * Merge arrays and remove duplicates
 * Takes [[1, 2, 3], [3, 4]] and returns [1, 2, 3, 4]
 *
 * @private
 * @param {Array[]} arrayOfArrays - An array containing two arrays to be merged
 * @returns {string[]} - A single merged array, no duplicates
 */
function mergeLinks(arrayOfArrays)
{
	var links = arrayOfArrays[0].concat(arrayOfArrays[1]);
	return _(links).uniq();
}

/**
 * Turns an array of urls into an array of html strings
 *
 * @private
 * @param {string[]} links - Array of urls
 * @returns {request.Request.promise|promise|Q.promise}
 */
function fetchLinks(links)
{
	var d = q.defer();
	var fetchedPromises = [];
	_(links).each(function(link) {fetchedPromises.push(request(link));});
	q.all(fetchedPromises).then(d.resolve);
	return d.promise;
}

/**
 * Turns an array of html strings into an array of card objects
 *
 * @private
 * @param pages {string[]} - An array of html pages as strings
 * @returns {Object[]} - An array of card objects
 */
function parsePagesToCards(pages)
{
	return _(pages).map(parsePageIntoCard);
}


/**
 * Parses an html string into a card object
 *
 * @private
 * @param html {string} - An html page as a string
 * @returns {Object} - A card object
 */
function parsePageIntoCard(html)
{
	var card = {};
	var $ = cheerio.load(html);
	card.image = $('.attachment-full').attr('src');
	card.name = $('title').text().split(' |')[0]; // quite frail
	return card;
}

module.exports = {
	search: search,
	privates: {
		getLinks: getLinks,
		mergeLinks: mergeLinks,
		fetchLinks: fetchLinks,
		parsePagesToCards: parsePagesToCards,
		parsePageIntoCard: parsePageIntoCard
	}
};