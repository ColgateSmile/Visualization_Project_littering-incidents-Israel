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

const get_split = (aggregatedData, aggregation_label, split_column, value) => Object.values(aggregatedData)
.filter(row => row[split_column] === value)
.map(row => {
  return {
    [aggregation_label]: row[aggregation_label],
    count: row.count
  };
});

const make_reflected = (seriesData, splitValues, distinctValues) => {
  for (const value of distinctValues) {
    seriesData[value] = splitValues[value].map(row => ({
      name: value,
      y: value === distinctValues[0] ? -row.count : row.count // Negative values for first distinct value
    }));
  }
  return seriesData;
}

const highchartsPyramid = options => {

  if (!options)
    return;
  if (!options['data'] || !options['layout'])
    return;
  
  const data = options['data'];
  const layout = options['layout'];

  if (!data['aggregated_column'] || !data['split_column']){
    console.log('Missing required data columns.');
    return;
  }
  if (!layout['palette'] || !layout['div_id']){
    console.log('Missing required layout options.');
    return;
  }

  const aggregated_column = data['aggregated_column']
  const split_column = data['split_column']

  const palette = layout['palette']
  const div = layout['div_id']

  const sort = data['sort'] || undefined
  if (sort && sort !== 'asc' && sort !== 'desc') {
    console.error('Sort must be either "asc" or "desc".');
    return;
  }

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
    if (distinctValues.includes(undefined)) {
      distinctValues.splice(distinctValues.indexOf(undefined), 1);
    }

    // Aggregate the count of records by aggregated_column and split_column
    const aggregatedData = aggregate_by(csvData, aggregated_column, split_column)

    // Extract the aggregated data into separate arrays for the two split values
    const splitValues = {}
    for (const value of distinctValues) {
      splitValues[value] = get_split(aggregatedData, aggregated_column, split_column, value)
    }

    // Sort the aggregated_column groups alphanumerically
    if (sort) {
      const order = sort === 'asc' ? 1 : -1;
      for (const value of distinctValues) {
        
        splitValues[value].sort((a, b) => order * a[aggregated_column].localeCompare(b[aggregated_column]));
      }
    }

    // Create the chart series data arrays with the extracted data
    const seriesData = make_reflected({}, splitValues, distinctValues);

    const series = [];
    for (const value of distinctValues) {
      series.push({ name: value, data: seriesData[value] });
    }
    
    // Create the chart options object
    const options = {
      chart: {
        type: 'bar',
        renderTo: div
      },
      title: {
        text: aggregated_column + ' distribution by ' + split_column
      },
      xAxis: [{
        categories: splitValues[distinctValues[0]].map(row => row[aggregated_column]),
        reversed: true,
        title: {
          text: aggregated_column
        }
      }, { // mirror axis on right side
        opposite: true,
        reversed: true,
        linkedTo: 0,
        categories: splitValues[distinctValues[1]].map(row => row[aggregated_column]),
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
            aggregated_column +
            ' ' +
            this.point.category +
            '</b><br/>Littering incidents: ' +
            Math.abs(this.point.y)
          );
        }
      },
      series: series
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