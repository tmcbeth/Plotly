function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel
  // Use `d3.json` to fetch the metadata for a sample
  // Use d3 to select the panel with id of `#sample-metadata`
  
  var metaDataTable = d3.select("#sample-metadata")

  // Use `.html("") to clear any existing metadata
  submit = d3.select("#selDataset");
  

  submit.on("click", function () {
    
    var url = `/metadata/${sample}`;
    
    d3.json(url).then(function (response) {
      
      
      // var metaDataTable = d3.select("#sample-metadata")
      var data = response;
      console.log(data);
      
      metaDataTable.html("");

      // data.forEach(function (bellyButtonData) {
      //   console.log(bellyButtonData);
      //   var row = metaDataTable.append("tr");

      // for (var key in data) {
      //   console.log(data)
      //   var row = metaDataTable.append("tr");
      

      Object.entries(data).forEach(function ([key, value]) {
        console.log(key, value);
        var row = metaDataTable.append("tr");
        var cell = metaDataTable.append("td");
        cell.text(key);
        var cell = metaDataTable.append("td");
        cell.text(value);
      });
      
    });
  });
};

  // BONUS: Build the Gauge Chart
  // buildGauge(data.WFREQ);


  function buildCharts(sample) {

    // @TODO: Use `d3.json` to fetch the sample data for the plots
    var chartUrl = `/samples/${sample}`;
    // @TODO: Build a Bubble Chart using the sample data
    d3.json(chartUrl).then(function (response) {

      console.log("pulled data for pie chart:", response);
    
    
      var sample_values = response.sample_values;
      var otu_ids = response.otu_ids;
      var otu_labels = response.otu_labels;


      // console.log("sample_values", sample_values);
      // console.log("sample_values", otu_ids);
      // console.log("sample_values", otu_labels);

      // @TODO: Build a Pie Chart

  

      var pieData = [{
        values: sample_values.slice(0, 10),
        labels: otu_ids.slice(0, 10),
        hovertext: otu_labels.slice(0, 10),
        hoverinfo: 'hovertext',
        type: 'pie'
      }];
    
      var layout = {
        height: 500,
        width: 500
      };
    
      Plotly.newPlot('pie', pieData, layout);
      // HINT: You will need to use slice() to grab the top 10 sample_values,
      // otu_ids, and labels (10 each).


      // BUBBLE CHART

      var trace1 = {
        x: otu_ids,
        y: sample_values,
        mode: 'markers',
        text: otu_labels,
        marker: {
          color: "red",
          opacity: [0.6],
          size: sample_values
        }
      };
    
      var data = [trace1];
    
      var layout = {
        title: '',
        showlegend: false,
        height: 600,
        width: 1200
      };
    
      Plotly.newPlot('bubble', data, layout);
    });

    // Gauge Chart


    var chartUrl = `/wfreq/${sample}`;
    // @TODO: Build a Bubble Chart using the sample data
    d3.json(chartUrl).then(function (response) {

      console.log("pulled data for gauge chart:", response);
    
    
      var wfreq = response.WFREQ;

      console.log("WFREQ:", wfreq);
      
      // Enter a speed between 0 and 180
      var level = wfreq;
    

      // Trig to calc meter point
      var degrees = 180 - (level* 20),
        radius = .5;
      var radians = degrees * Math.PI / 180;
      var x = radius * Math.cos(radians);
      var y = radius * Math.sin(radians);
    

      // Path: may have to change to create a better triangle
      var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
        pathX = String(x),
        space = ' ',
        pathY = String(y),
        pathEnd = ' Z';
      var path = mainPath.concat(pathX, space, pathY, pathEnd);

      var data = [{
        type: 'scatter',
        x: [0], y: [0],
        marker: { size: 28, color: '850000' },
        showlegend: false,
        name: 'Scrubs per Week',
        text: level,
        hoverinfo: 'text+name'
      },
      {
        values: [50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50],
        rotation: 90,
        text: ['8-9', '7-8', '6-7', '5-6',
          '4-5', '3-4', '2-3', '1-2', '0-1', ''],
        textinfo: 'text',
        textposition: 'inside',
        marker: {
          colors: ['rgba(0,69,41,.5)', 'rgba(0,104,55, .5)',
            'rgba(35,132,67, .5)', 'rgba(65,171,93, .5)',
            'rgba(120,198,121, .5)', 'rgba(173,221,142, .5)',
            'rgba(217,240,163, .5)', 'rgba(247,252,185, .5)', 'rgba(255,255,229, .5)', 'rgba(255, 255, 255, 0)']
        },
        labels: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3', '1-2', '0-1', ''],
        hoverinfo: 'label',
        hole: .5,
        type: 'pie',
        showlegend: false
      }];

      var layout = {
        shapes: [{
          type: 'path',
          path: path,
          fillcolor: '850000',
          line: {
            color: '850000'
          }
        }],
        title: 'Scrubs per Week',
        Speed: '0-100',
        height: 500,
        width: 500,
        xaxis: {
          zeroline: false, showticklabels: false,
          showgrid: false, range: [-1, 1]
        },
        yaxis: {
          zeroline: false, showticklabels: false,
          showgrid: false, range: [-1, 1]
        }
      };

      Plotly.newPlot('gauge', data, layout);
    });

  };




  
    
    
    
function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
