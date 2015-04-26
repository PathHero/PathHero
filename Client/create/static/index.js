'use strict';

$(function() {
  $.ajax({
    url: window.location.origin+'/hunts',
    method: 'GET',
  })
  .done(function(data) {
    console.log('data:',data);
    data.forEach(function(item) {
      $('.HuntList').append(
        '<a href="' + window.location.origin + '/edit/' + item._id + '" class="list-group-item">' + 
          '<h5>' + item.huntName + '</h5>' + 
          '<p>' + item.huntDesc + '</p>' + 
        '</a>');
    });
  })
  .fail(function(error) {
    console.log(error);
  });
});
