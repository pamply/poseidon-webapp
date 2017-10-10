var Chart  = require('chart.js');
var http   = require('http');
var R      = require('ramda');
var _      = require('lodash')
var moment = require('moment');

var limitData = 200;
var overMinutes = 10;

var GET_OPTIONS = {
  host: "104.131.53.137",
  port: "3000",
  path: "/metrics?limit=" + limitData + "&overMinutes=" + overMinutes,
  method: "GET",
  headers: {
    "Content-Type": "application/json",
    "Accept-Encoding": "gzip, deflate"
  }

}

var COLORS_LINE = ['#14A676', '#3E4A9C', '#C63838']

var getLabels = function(data) {
  var labels = []
  for (let i = 0; i < limitData; i++) {
    labels.push("")
  }
  return labels;
}

var getDatasets = function(metrics, type, label) {

  var commmonOptions = {
    tension: 0,
    borderWidth: 2,
    radius: 0,
    hitRadius: 4,
    pointStyle: 'line',
    cubicInterpolationMode: 'monotone',
    backgroundColor: "transparent"    
  }

  var sensorIds = [];
  var datasets = [];

  console.log(metrics)
  
  var sensors = _.uniqBy(metrics, 'id')

  _.map(sensors, function(sensor, idx) {
    var dataset = _.filter(metrics, function(metric) {
      if (metric.id === sensor.id) {
        return true;
      }
    });

    console.log(dataset)
    var options = _.clone(commmonOptions)
    options.borderColor = COLORS_LINE[idx]
    options.data = transformData(dataset, type)
    
    if (type === 'flow') {
      map_index_sensor_flow[sensor.id] = idx
    } else {
      map_index_sensor_pressure[sensor.id] = idx
    }

    options.label = "Sensor " + sensor.id + " (" + _.capitalize(label) + ")",
    datasets.push(options)
  });

  return datasets;
}

var initChart = function(metrics) {

  pressureChart = new Chart("chart-pressure", {
    type: 'line',
    data: {
      datasets: getDatasets(metrics, 'pressure', 'Presión'),
      labels: getLabels()
    },
    options: getOptions(metrics) 
  });

  flowChart = new Chart("chart-flow", {
    type: 'line',
    data: {
      datasets: getDatasets(metrics, 'flow', 'Flujo'),
      labels: getLabels()
    },
    options: getOptions(metrics) 
  })

} 

var getOptions = function(data) {
  return {
    scales: {
      xAxes: [{
        id: 'x-axis-time',
        gridLines: {
          display: false
        },
        ticks: {
          maxTicksLimit: 4,
          maxRotation: 0
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
  
  for (let i = 0; i < limitData - data.length; i++) {
    chartData.unshift(null);
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

