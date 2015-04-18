'use strict';

$(function() {
  $.ajax({
    url: 'http://play.pathhero.com/hunts',
    method: 'GET',
  })
  .done(function(data) {
    console.log('data:',data);
    data.forEach(function(item) {
      $('ul').append('<li>').append('<a href="' + item.url + '">' + item.url + '</a>');
    });
  })
  .fail(function(error) {
    console.log(error);
  });
});
