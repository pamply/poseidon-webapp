import Vue from 'vue';

var webSocketHost = "104.131.53.137";
var webSocketPort = "8085";

alert(webSocketHost);

var ws = new WebSocket("ws://" + webSocketHost + ":" + webSocketPort);

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

var sensor1 = new Vue({
    el: "#sensor1",
    data: dataSensor1
});

var sensor2 = new Vue({
    el: "#sensor2",
    data: dataSensor2
});

var sensor3 = new Vue({
    el: "#sensor3",
    data: dataSensor3
});

ws.onmessage = function(event) {
  var d = JSON.parse(event.data);
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