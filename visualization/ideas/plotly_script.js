const plotlyPyramid = (y_label, split_column, pallete ,div) => Papa.parse('clean_dataset.csv', {
  download: true,
  header: true,
  complete: results => {
    // Extract the data from the parsed CSV
    const csvData = results.data;

    // Deduce the distinct values from the split_column
    const distinctValues = [...new Set(csvData.map(row => row[split_column]))];
    console.log(distinctValues);
    if (distinctValues.length !== 2 && !(distinctValues.length === 3 && distinctValues.includes(undefined))) {
      console.error('Split column must have exactly two distinct values.');
      return;
    }

    // Aggregate the count of records by y_label and split_column
    const aggregatedData = csvData.reduce(function(acc, row) {
      const y_label_value = row[y_label];
      const split_value = row[split_column];
      const key = y_label_value + '-' + split_value;
      if (!acc[key]) {
        acc[key] = { [y_label]: y_label_value, [split_column]: split_value, count: 0 };
      }
      acc[key].count++;
      return acc;
    }, {});

    // Extract the aggregated data into separate arrays for the two split values
    const splitValue1 = Object.values(aggregatedData)
      .filter(row => row[split_column] === distinctValues[0])
      .map(row => {
        return {
          [y_label]: row[y_label],
          count: row.count
        };
      });

    const splitValue2 = Object.values(aggregatedData)
      .filter(row => row[split_column] === distinctValues[1])
      .map(row => {
        return {
          [y_label]: row[y_label],
          count: row.count
        };
      });

    // Sort the y_label groups alphanumerically
    splitValue1.sort((a, b) => -a[y_label].localeCompare(b[y_label]));
    splitValue2.sort((a, b) => -a[y_label].localeCompare(b[y_label]));

    // Create the trace objects with the extracted data
    const trace1 = {
      uid: '9f2de8e2-01e2-44cf-9597-d8c9d17a223a',
      meta: { columnNames: { x: 'Count', y: y_label } },
      name: distinctValues[0],
      type: 'bar',
      x: splitValue1.map(row => -row.count), // Negative values for first distinct value
      y: splitValue1.map(row => row[y_label]),
      orientation: 'h',
      marker: { color: pallete[distinctValues[0]] },
      // marker: { color: 'powderblue' },
      hoverinfo: 'x'
    };

    const trace2 = {
      uid: '31653fd0-228e-4932-88af-340740cd1dea',
      meta: { columnNames: { x: 'Count', y: y_label } },
      name: distinctValues[1],
      type: 'bar',
      x: splitValue2.map(row => row.count),
      y: splitValue2.map(row => row[y_label]),
      orientation: 'h',
      marker: { color: pallete[distinctValues[1]] },
      // marker: { color: 'seagreen' },
      hoverinfo: 'x'
    };

    const data = [trace1, trace2];

    // Determine the maximum count value for both split values
    const maxCount = Math.max(
      Math.max(...splitValue1.map(row => row.count)),
      Math.max(...splitValue2.map(row => row.count))
    );

    // Create the layout object
    const layout = {
      xaxis: {
        type: 'linear',
        title: { text: y_label + ' distribution by ' + split_column },
        zeroline: false,
        range: [-maxCount, maxCount], // Set the x-axis range
        side: 'top'
      },
      yaxis: {
        type: 'category',
        title: { text: y_label },
        autorange: 'reversed',
        tickfont: { size: 10 },
        range: [0, splitValue2.length],
        dtick: 1
      },
      bargap: 0.1,
      barmode: 'overlay',
      autosize: true
    };

    // Render the plot using Plotly.js
    Plotly.newPlot(div, data, layout);
  }
});

// populationPyramid('age', 'gender', {'female' : 'pink', 'male' : 'oceangeen'} ,'plotly-div');