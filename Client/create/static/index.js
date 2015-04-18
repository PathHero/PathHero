'use strict';

$(function() {
  $.ajax({
    url: window.location.origin+'/hunts',
    method: 'GET',
  })
  .done(function(data) {
    console.log('data:',data);
    data.forEach(function(item) {
      $('ul').append('<li>').append('<span>Title: <a href='+window.location.origin + 
                                              '/edit/' + item._id + '>' +
                                              item.huntName + '</a>  Description: ' + 
                                              item.huntDesc +'</span>');
    });
  })
  .fail(function(error) {
    console.log(error);
  });
});
