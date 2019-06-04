function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`

    // Use `.html("") to clear any existing metadata

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.

    var URL = "/metadata/" + sample;

    var panel = d3.select("#sample-metadata");

    panel.html("");

    d3.json(URL).then(function (data) {
      Object.entries(data).forEach(([key, value]) => {
         panel.append("p").text(`${key}: ${value}`)
    });




    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
  });
}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots

    // @TODO: Build a Bubble Chart using the sample data

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).

  var URL = "/samples/" + sample;
    d3.json(URL).then(function(data){

    var trace1 = {
      x: data.otu_ids,
      y: data.sample_values,
      mode: 'markers',
      marker: {
        color: data.otu_ids,
        size: data.sample_values
      },
      text: data.otu_labels
    }
    var data1 = [trace1]

    var bubbleHeight = document.getElementById("bubble").offsetHeight;

    var bubbleWidth = document.getElementById("bubble").offsetWidth;

    var layout = {
      showlegend: false,
      height: bubbleHeight,
      width: bubbleWidth,
      xaxis: {
        title: 'OTU_IDS'
      },
      yaxis: {
        title: 'sample_values'
      }
    };

    Plotly.newPlot("bubble", data1, layout, {responsive: true});

    window.onresize = function() {
      Plotly.relayout("bubble", {
        width: bubbleWidth,
        height: bubbleHeight
      })
    }






    var trace2 = {
        values: data.sample_values.slice(0,10),
        labels: data.otu_ids.slice(0,10),
        hovertext: data.otu_labels.slice(0,10),
        type: 'pie'

    };

    var data2 = [trace2];

    var pieHeight = document.getElementById("pie").offsetHeight;

    var pieWidth = document.getElementById("pie").offsetWidth;

    var layout2 = {
      showlegend: true,
      title: "Top 10 Samples",
      height: pieHeight,
      width: pieWidth
    };


    Plotly.newPlot("pie", data2, layout2, {responsive: true});

    window.onresize = function() {
      Plotly.relayout("pie", {
        width: pieWidth,
        height: pieHeight
      })
    }




    // (function() {
    //   var d3 = Plotly.d3;
      
    //   var WIDTH_IN_PERCENT_OF_PARENT = 80,
    //       HEIGHT_IN_PERCENT_OF_PARENT = 80;
      
    //   var gd3 = d3.select(document.getElementById("pie"))
    //       .append('pie')
    //       .style({
    //           width: WIDTH_IN_PERCENT_OF_PARENT + '%',
    //           'margin-left': (100 - WIDTH_IN_PERCENT_OF_PARENT) / 2 + '%',
      
    //           height: HEIGHT_IN_PERCENT_OF_PARENT + 'vh',
    //           'margin-top': (100 - HEIGHT_IN_PERCENT_OF_PARENT) / 2 + 'vh'
    //       });
      
    //   var gd = gd3.node();
      
    //   Plotly.newPlot(gd, data2, layout2, {responsive: true});
      
    //   window.onresize = function() {
    //       Plotly.Plots.resize(gd);
    //   };
      
    //   })();




  
  })



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
