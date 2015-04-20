'use strict';

$(function() {
  $.ajax({
    url: window.location.origin+'/hunts',
    method: 'GET',
  })
  .done(function(data) {
    console.log('data:',data);
    data.forEach(function(item) {
      $('.HuntList').append('<div>').append(
        '<a href="' + item.url + '" class="list-group-item">' + 
          '<h5>' + item.huntName + '</h5>' + 
          item.huntDesc + 
        '</a>');
    });
  })
  .fail(function(error) {
    console.log(error);
  });
});
