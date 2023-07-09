const display_chart = (result_chart) => Papa.parse('clean_dataset.csv', {
  download: true,
  header: true,
  complete: result_chart
})

const aggregate_by = (data, aggregation_label, split_label) => data.reduce(function(acc, row) {
  const y_label_value = row[aggregation_label];
  const split_value = row[split_label];
  const key = y_label_value + '-' + split_value;
  if (!acc[key]) {
    acc[key] = { [aggregation_label]: y_label_value, [split_label]: split_value, count: 0 };
  }
  acc[key].count++;
  return acc;
}, {});

const highchartsPyramid = (y_label, split_column, palette, div) => {
  const pyramid = results => {
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

    // Create the chart series data arrays with the extracted data
    const seriesData1 = splitValue1.map(row => ({
      name: distinctValues[0],
      y: -row.count // Negative values for first distinct value
    }));

    const seriesData2 = splitValue2.map(row => ({
      name: distinctValues[1],
      y: row.count
    }));

    // Create the chart options object
    const options = {
      chart: {
        type: 'bar',
        renderTo: div
      },
      title: {
        text: y_label + ' distribution by ' + split_column
      },
      xAxis: [{
        categories: splitValue1.map(row => row[y_label]),
        reversed: true,
        title: {
          text: y_label
        }
      }, { // mirror axis on right side
        opposite: true,
        reversed: true,
        linkedTo: 0,
        categories: splitValue1.map(row => row[y_label]),
        labels: {
          step: 1
        }
      }],
      yAxis: {
        title: {
          text: null
        }
      },
      legend: {
        reversed: false
      },
      plotOptions: {
        series: {
          stacking: 'normal'
        }
      },
      tooltip: {
        formatter: function() {
          return (
            '<b>' +
            this.series.name +
            ', ' +
            y_label +
            ' ' +
            this.point.category +
            '</b><br/>Littering incidents: ' +
            Math.abs(this.point.y)
          );
        }
      },
      series: [{ name: distinctValues[0], data: seriesData1 }, { name: distinctValues[1], data: seriesData2 }]
    };

    // Apply the color palette to the chart series
    Object.keys(palette).forEach((key, index) => {
      options.series[index].color = palette[key];
    });

    // Create the chart using Highcharts
    new Highcharts.Chart(options);
  }
  display_chart(pyramid)
}