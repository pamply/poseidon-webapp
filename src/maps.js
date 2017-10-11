var map;
var marker;

var initMap = function (latLng) {
  map = new google.maps.Map(document.getElementById('map'), {
    center: latLng,
    zoom: 8
  });

  marker = new google.maps.Marker({
    position: latLng,
    map: map
  })
}

module.exports = initMap;
