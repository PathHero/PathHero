'use strict';

$(function() {
  $.ajax({
    url: 'http://create.pathhero.com/hunts',
    method: 'GET',
  })
  .done(function(data) {
    console.log('data:',data);
    data.forEach(function(item) {
      $('ul').append('<li>').append('<a href=http://create.pathhero.com/edit/' + item._id + '>' + item.huntDesc + '</a>');
    });
  })
  .fail(function(error) {
    console.log(error);
  });
});
