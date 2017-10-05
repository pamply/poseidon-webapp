var Chart  = require('chart.js');
var http   = require('http');
var R      = require('ramda');
var moment = require('moment');

var limitData = 10;

var GET_OPTIONS = {
  host: "104.131.53.137",
  port: "3000",
  path: "/metrics?limit=" + limitData,
  method: "GET",
  headers: {
    "Content-Type": "application/json"
  }
}

var getLabels = function() {
  var labels = []
  for (let i = 0; i < limitData; i++) {
    labels.push("")
  }

  return labels;
}

var initChart = function(metrics) {

  var pressureData = transformData(metrics, 'pressure');
  var flowData     = transformData(metrics, 'flow');

  pressureChart = new Chart("chart-pressure", {
    type: 'line',
    data: {
      datasets: [{
        data: pressureData,
        label: 'Presión'
      }]
    },
    options: getOptions(metrics) 
  });

  flowChart = new Chart("chart-flow", {
    type: 'line',
    data: {
      datasets: [{
        data: flowData,
        label: 'Flujo'
      }]
    },
    options: getOptions(metrics) 
  })

} 

var getOptions = function(data) {
  return {
    scales: {
      xAxes: [{
        id: 'x-axis-time',
        type: 'time',
        time: {
          min: data[limitData-1] ? data[limitData-1].x : 1506723750000
        }
      }],
      yAxes: [{
        id: 'y-axis-value',
        type: 'linear',
        ticks: {
          min: 0
        }
      }]
    }
  };
}

var transformData = function (data, attr) {
  var chartData = []
  var hasAttr = function (metric) {
    return metric[attr] && R.is(Number, metric[attr]) && metric['time_sent']
  }

  var filterData = R.filter(hasAttr, data)

  var createData = function(metric) {
    return {x: moment(metric['time_sent']).valueOf(), y: metric[attr]};
  }

  chartData = R.map(createData, filterData)
  console.log(chartData)
  
  for (let i = 0; i < limitData - data.length; i++) {
    chartData.push(null);
  }

  return chartData
}

var requestChartData = function() {
  http.get(GET_OPTIONS, function(res) {
    res.setEncoding('utf8')
    res.on('data', function(chunk) {
      var data = JSON.parse(chunk)

      if (data.length > 0) {
        initChart(data)
        clearInterval(intervalReq)
      }
    })
  });
}

var intervalReq = setInterval(requestChartData , 3000);

