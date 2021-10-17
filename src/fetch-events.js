const fetch = require('node-fetch');
const cheerio = require('cheerio');

module.exports = url => fetch(url)
  .then(res => {
    if (res.status === 404) {
      return Promise.reject(new Error('404, page not found'));
    }
    return res.text();
  })
  .then(res => {
    const $ = cheerio.load(res);
    const events = [];

    $('.event-wrapper').each(function () {
      events.push({
        url: $(this).find('a').attr('href'),
        imageWrapUrl: $(this).find($('.image-wrap')).children('img').attr('src'),
        eventLogoUrl: $(this).find($('.event-logo')).children('img').attr('src'),
        name: $(this).find('h3').text(),
        eventDate: $(this).find($('.event-date')).text(),
        startDate: $(this).find('meta[itemprop = \'startDate\']').attr('content'),
        endDate: $(this).find('meta[itemprop = \'endDate\']').attr('content'),
        eventLocation: $(this).find($('.event-location')).text().replace(/(\r\n|\n|\r|\s)/gm, ""),
        eventHybridNotes: $(this).find($('.event-hybrid-notes')).children('span').text(),

      });
    });

    return events;
  });
