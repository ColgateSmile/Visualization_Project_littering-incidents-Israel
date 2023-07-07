// Parse the CSV file using Papa Parse
Papa.parse('clean_dataset.csv', {
    header: true,
    download: true,
    complete: function (results) {
      const data = results.data;
  
      // Extract latitude and longitude columns from the parsed data
      const latitude = data.map(row => row.latitude);
      const longitude = data.map(row => row.longitude);
  
      // Define color mapping for each category
      const categoryColors = {
        cigarettes: 'blue',
        wrappers: 'red',
        liquid: 'green',
        misc: 'purple'
        // Add more category-color mappings as needed
      };
  
      // Create a trace for the scatter map
      const trace = {
        type: 'scattermapbox',
        lat: latitude,
        lon: longitude,
        mode: 'markers',
        marker: {
          size: 10,
          color: data.map(row => categoryColors[row.category]), // Assign color based on the category
          opacity: 0.7
        },
        text: data.map(row => `${row.location_type} - ${row.subcategory}`)
      };
  
      // Define the layout for the scatter map
      const layout = {
        mapbox: {
          style: 'open-street-map', // Set the map style to OpenStreetMap
          center: { lat: 31.9269868, lon: 34.860384 }, // Adjust the center coordinates as per your data
          zoom: 12
        },
        width: 800,
        height: 600
      };
  
      // Create a Plotly.js data array containing the trace and layout
      const plotData = [trace];
  
      // Render the scatter map on the specified HTML element using Plotly.js
      Plotly.newPlot('map', plotData, layout);
    }
  });
  