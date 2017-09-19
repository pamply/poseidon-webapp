import WebSocket from 'ws';

var ws = new WebSocket('ws://localhossst:8085');

ws.on('open', function() {
  ws.send('success')
});

ws.on('message', function(data) {
  console.log(data);
});