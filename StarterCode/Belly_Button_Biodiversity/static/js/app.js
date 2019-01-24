function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel
  // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`
  
  var metaDataTable = d3.select("#sample-metadata")

    // Use `.html("") to clear any existing metadata
  submit = d3.select("#selDataset");
  

  submit.on("click", function () {
    
    var url = `/metadata/${sample}`;
    
    d3.json(url).then(function(response) {
      
      
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
  

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  var chartUrl = `/samples/${sample}`;
  // @TODO: Build a Bubble Chart using the sample data
  d3.json(chartUrl).then(function (response) {

    console.log("pulled data for pie chart:",response);
  
    var sample_values = response.sample_values;
    var otu_ids = response.otu_ids;
    var otu_labels = response.otu_labels;


    console.log("sample_values", sample_values);
    console.log("sample_values", otu_ids);
    console.log("sample_values", otu_labels);

    // @TODO: Build a Pie Chart

  

    var pieData = [{
      values: sample_values.slice(0,10),
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
  });
}

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
