


function buildCharts(patientID) {

  // Read and interpret

  // Read in the JSON data
  d3.json("data/samples.json").then((data => {

      // Define samples
      var samples = data.samples
      var metadata = data.metadata
      var filteredMetadata = metadata.filter(bacteriaInfo => bacteriaInfo.id == patientID)[0]

      // Filter by patient ID
      var filteredSample = samples.filter(bacteriaInfo => bacteriaInfo.id == patientID)[0]

      // Create variables for chart
      // Grab sample_values for the bar chart
      var sample_values = filteredSample.sample_values

      // Use otu_ids as the labels for bar chart
      var otu_ids = filteredSample.otu_ids

      // use otu_labels as the hovertext for bar chart
      var otu_labels = filteredSample.otu_labels

      // Bar
      var bar_data = [{
          // Use otu_ids for the x values
          x: sample_values.slice(0, 10).reverse(),
          // Use sample_values for the y values
          y: otu_ids.slice(0, 10).map(otu_id => `OTU ${otu_id}`).reverse(),
          // Use otu_labels for the text values
          text: otu_labels.slice(0, 10).reverse(),
          type: 'bar',
          orientation: 'h',
          marker: {
              color: 'rgb(242, 113, 102)'
          },
      }]




      // Define plot layout
      var bar_layout = {
          title: "Top 10 Microbial Species in Belly Buttons",
          xaxis: { title: "Bacteria Sample Values" },
          yaxis: { title: "OTU IDs" }
      };

      // Display plot
      Plotly.newPlot('bar', bar_data, bar_layout)

      // Bubble chart
      var bubble_data = [{
          // Use otu_ids for the x values
          x: otu_ids,
          // Use sample_values for the y values
          y: sample_values,
          // Use otu_labels for the text values
          text: otu_labels,
          mode: 'markers',
          marker: {
              // Use otu_ids for the marker colors
              color: otu_ids,
              // Use sample_values for the marker size
              size: sample_values,
              colorscale: 'PuOr'
          }
      }];


      // Define plot layout
      var layout = {
          title: "Belly Button Samples",
          xaxis: { title: "OTU IDs" },
          yaxis: { title: "Sample Values" }
      };

      // Display plot
      Plotly.newPlot('bubble', bubble_data, layout)

      // Gauge chart
      var washFreq = filteredMetadata.wfreq

      // Create the trace
      var gauge_data = [
          {
              domain: { x: [0, 1], y: [0, 1] },
              value: washFreq,
              title: { text: "Washing Frequency (Times per Week)" },
              type: "indicator",
              mode: "gauge+number",
              gauge: {
                  bar: {color: 'black'},
                  axis: { range: [null, 10] },
                  steps: [
                      { range: [0, 2], color: 'red' },
                      { range: [2, 4], color: 'orange' },
                      { range: [4, 6], color: 'yellow' },
                      { range: [6, 8], color: 'lightgreen' },
                      { range: [8, 10], color: 'green' },
                  ],
                  // threshold: {
                  //     line: { color: "white" },
                  // }
              }
          }
      ];

      // Define Plot layout
      var gauge_layout = { width: 500, height: 400, margin: { t: 0, b: 0 } };

      // Display plot
      Plotly.newPlot('gauge', gauge_data, gauge_layout);
  }))


};



function populateDemoInfo(patientID) {

  var demographicInfoBox = d3.select("#sample-metadata");

  d3.json("data/samples.json").then(data => {
      var metadata = data.metadata
      var filteredMetadata = metadata.filter(bacteriaInfo => bacteriaInfo.id == patientID)[0]

      console.log(filteredMetadata)
      Object.entries(filteredMetadata).forEach(([key, value]) => {
          demographicInfoBox.append("p").text(`${key}: ${value}`)
      })


  })
}


function optionChanged(patientID) {
  console.log(patientID);
  buildCharts(patientID);
  populateDemoInfo(patientID);
}


function initDashboard() {
  var dropdown = d3.select("#selDataset")
  d3.json("data/samples.json").then(data => {
      var patientIDs = data.names;
      patientIDs.forEach(patientID => {
          dropdown.append("option").text(patientID).property("value", patientID)
      })
      buildCharts(patientIDs[0]);
      populateDemoInfo(patientIDs[0]);
  });
};

initDashboard();




