'use strict';

var request = require('request-promise');
var cheerio = require('cheerio');
var _ = require('underscore');
var q = require('q');

function search(query, callback)
{
	var title = {title: query};
	var subtitle = {subtitle: query};
	q.all([getLinks(title), getLinks(subtitle)]).then(mergeLinks).then(fetchLinks).then(parseResultsToCards).done(callback);
}

function getLinks(obj)
{
	// TODO can be refactored
	var urlRoot = 'http://www.dicemastersrules.com/advanced-search/';
	var deferred = q.defer();
	var links = [];
	var searchType;
	var searchQuery;

	if (obj['title'])
	{
		searchType ='card-title';
		searchQuery = obj['title'];
	}
	else if (obj['subtitle'])
	{
		searchType = 'card-subtitle';
		searchQuery = obj['subtitle'];
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

function mergeLinks(arrayOfArrays)
{
	var links = arrayOfArrays[0].concat(arrayOfArrays[1]);
	return _(links).uniq();
}

function fetchLinks(links)
{
	var d = q.defer();
	var fetchedPromises = [];
	_(links).each(function(link) {fetchedPromises.push(request(link))});
	q.all(fetchedPromises).then(d.resolve);
	return d.promise;
}

function parseResultsToCards(results)
{
	return _(results).map(parsePageIntoCard);
}

function parsePageIntoCard(html)
{
	var card = {};
	var $ = cheerio.load(html);
	card.image = $('.attachment-full').attr('src');
	card.title = $('title').text().split(' |')[0]; // quite frail
	return card;
}

module.exports = {search: search};