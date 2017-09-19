import Vue from 'vue';

//localhost
//var webSocketHost = "localhost";
//var webSocketPort = "8085";

//server
var WEBSOCKET_HOST = "104.131.53.137";
var WEBSOCKET_PORT = "8085";

var ws = new WebSocket("ws://" + WEBSOCKET_HOST + ":" + WEBSOCKET_PORT);

var MAP_STATUS = {
  "1": 'Sistema Estable',
  "2": 'Fuga baja en el sistema',
  "3": 'Fuga alta en el sistema'
}

var MAP_LEAK_MAGNITUD = {
  "1": "Fuga Baja",
  "2": "Fuga Mediana",
  "3": "Fuga Alta"
}

var dataSensor1 = {
  id: '', 
  pressure: '',
  flow : '',
  lat: '',
  lon: '',
  timeSent: ''
};

var dataSensor2 = {
  id: '', 
  pressure: '',
  flow : '',
  lat: '',
  lon: '',
  timeSent: ''
};

var dataSensor3 = {
  id: '', 
  pressure: '',
  flow : '',
  lat: '',
  lon: '',
  timeSent: ''
};

var systemStatus = {
  status: ''
};

new Vue({
  el: "#sensor1",
  data: dataSensor1
});

new Vue({
  el: "#sensor2",
  data: dataSensor2
});

new Vue({
  el: "#sensor3",
  data: dataSensor3
});

new Vue({
  el: "#system-status",
  data: systemStatus
});

ws.onmessage = function(event) {
  var d = JSON.parse(event.data);
  systemStatus.status = MAP_STATUS[d.status];
  switch(d.id) {
    case 1:
      dataSensor1.id = d.id;
      dataSensor1.pressure = d.pressure;
      dataSensor1.flow = d.flow;
      dataSensor1.lat = d.lat;
      dataSensor1.lon = d.lon;
      dataSensor1.timeSent = d.time_sent;
    break;
    case 2:
      dataSensor2.id = d.id;
      dataSensor2.pressure = d.pressure;
      dataSensor2.flow = d.flow;
      dataSensor2.lat = d.lat;
      dataSensor2.lon = d.lon;
      dataSensor2.timeSent = d.time_sent;
    break;
    case 3:
      dataSensor3.id = d.id;
      dataSensor3.pressure = d.pressure;
      dataSensor3.flow = d.flow;
      dataSensor3.lat = d.lat;
      dataSensor3.lon = d.lon;
      dataSensor3.timeSent = d.time_sent;
    break;
  }
}