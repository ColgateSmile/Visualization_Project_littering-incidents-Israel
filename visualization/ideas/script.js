trace1 = {
  uid: '9f2de8e2-01e2-44cf-9597-d8c9d17a223a', 
  meta: {columnNames: {
      x: 'Men, x', 
      y: 'Men, y; Women, y'
    }}, 
  name: 'Men', 
  type: 'bar', 
  x: [600, 623, 653, 650, 670, 578, 541, 360, 312, 170], 
  y: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90], 
  marker: {color: 'powderblue'}, 
  hoverinfo: 'x', 
  orientation: 'h'
};

trace2 = {
  uid: '31653fd0-228e-4932-88af-340740cd1dea', 
  meta: {columnNames: {
      x: 'Women, x', 
      y: 'Men, y; Women, y', 
      text: 'text'
    }}, 
  name: 'Women', 
  type: 'bar', 
  x: [-600, -623, -653, -650, -670, -578, -541, -411, -322, -230], 
  y: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90], 
  marker: {color: 'seagreen'}, 
  text: [600, 623, 653, 650, 670, 578, 541, 411, 322, 230], 
  hoverinfo: 'text', 
  orientation: 'h'
};

data = [trace1, trace2];

layout = {
  xaxis: {
    type: 'linear', 
    range: [-1200, 1200], 
    title: {text: 'Number'}, 
    ticktext: [1000, 700, 300, 0, 300, 700, 1000], 
    tickvals: [-1000, -700, -300, 0, 300, 700, 1000]
  }, 
  yaxis: {
    type: 'linear', 
    range: [-5, 95], 
    title: {text: 'Age'}, 
    autorange: true
  }, 
  bargap: 0.1, 
  barmode: 'relative', 
  autosize: true
};
Plotly.plot('plotly-div', {
  data: data,
  layout: layout
});