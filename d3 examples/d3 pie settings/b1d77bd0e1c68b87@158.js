// https://observablehq.com/@d3/pie-settings@158
function _1(md){return(
md`# Pie settings

Illustrating a few options of the [d3.pie](https://github.com/d3/d3-shape/blob/main/README.md#pies) generator.`
)}

function _cornerRadius(Inputs){return(
Inputs.range([0, 30], {
  value: 12,
  label: "corner radius",
  step: 0.1
})
)}

function _innerRadius(Inputs){return(
Inputs.range([0, 150], {
  value: 30,
  label: "inner radius",
  step: 0.1
})
)}

function _padAngle(Inputs){return(
Inputs.range([0, 0.1], {
  value: 0.03,
  step: 0.001,
  precision: 3,
  label: "pad angle (radians)"
})
)}

function _hide(Inputs){return(
Inputs.toggle({label: "hide geometry"})
)}

function _6(DOM,width,height,d3,innerRadius,padAngle,data,cornerRadius,colors,hide)
{
  const context = DOM.context2d(width, height),
    canvas = context.canvas;
  const radius = Math.min(width, height) / 2,
    outerRadius = radius - 10;

  const arc = d3
    .arc()
    .outerRadius(outerRadius)
    .innerRadius(innerRadius)
    .context(context);

  const circle = d3
    .arc()
    .startAngle(0)
    .endAngle(2 * Math.PI)
    .innerRadius(0)
    .context(context);

  const pie = d3.pie().padAngle(padAngle);

  const arcs = pie(data);

  context.translate(width / 2, height / 2);

  arc.cornerRadius(cornerRadius);

  context.globalAlpha = 0.5;
  arcs.forEach(function(d, i) {
    context.beginPath();
    arc(d);
    context.fillStyle = colors[i];
    context.fill();
  });

  context.globalAlpha = 1;
  context.beginPath();
  arcs.forEach(arc);
  context.strokeStyle = "#fff";
  context.stroke();

  if (!hide) {
    context.lineWidth = .5;
    arc.cornerRadius(0);
    context.strokeStyle = "#000";
    arcs.forEach(function(d, i) {
      context.beginPath();
      arc(d);
      context.stroke();
    });

    context.beginPath();
    arcs.forEach(d => {
      const [x, y] = arc.centroid(d);
      context.moveTo(x, y);
      context.arc(x, y, 3, 0, 2 * Math.PI);
    });
    context.fillStyle = "#000";
    context.fill();

    const r =
      Math.asin(
        ((outerRadius - cornerRadius) / (innerRadius + cornerRadius)) *
          Math.sin(padAngle)
      ) / 2;
    context.beginPath();
    arcs.forEach(function(d) {
      corner(d.startAngle + padAngle / 2, outerRadius - cornerRadius, +1);
      corner(d.endAngle - padAngle / 2, outerRadius - cornerRadius, -1);
      if (innerRadius > 0) {
        corner(d.startAngle + r, innerRadius + cornerRadius, +1);
        corner(d.endAngle - r, innerRadius + cornerRadius, -1);
      }
    });
    context.strokeStyle = "#000";
    context.stroke();
  }

  function corner(angle, radius, sign) {
    context.save();
    context.translate(
      sign * cornerRadius * Math.cos(angle) +
        Math.sqrt(radius * radius - cornerRadius * cornerRadius) *
          Math.sin(angle),
      sign * cornerRadius * Math.sin(angle) -
        Math.sqrt(radius * radius - cornerRadius * cornerRadius) *
          Math.cos(angle)
    );
    circle.outerRadius(cornerRadius - 1.5)();
    context.restore();
  }

  return canvas;
}


function _data(){return(
new Set([10, 11, 22, 30, 50, 80, 130])
)}

function _colors(d3){return(
d3.schemeCategory10
)}

function _height(width){return(
Math.min(width, 500)
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("viewof cornerRadius")).define("viewof cornerRadius", ["Inputs"], _cornerRadius);
  main.variable(observer("cornerRadius")).define("cornerRadius", ["Generators", "viewof cornerRadius"], (G, _) => G.input(_));
  main.variable(observer("viewof innerRadius")).define("viewof innerRadius", ["Inputs"], _innerRadius);
  main.variable(observer("innerRadius")).define("innerRadius", ["Generators", "viewof innerRadius"], (G, _) => G.input(_));
  main.variable(observer("viewof padAngle")).define("viewof padAngle", ["Inputs"], _padAngle);
  main.variable(observer("padAngle")).define("padAngle", ["Generators", "viewof padAngle"], (G, _) => G.input(_));
  main.variable(observer("viewof hide")).define("viewof hide", ["Inputs"], _hide);
  main.variable(observer("hide")).define("hide", ["Generators", "viewof hide"], (G, _) => G.input(_));
  main.variable(observer()).define(["DOM","width","height","d3","innerRadius","padAngle","data","cornerRadius","colors","hide"], _6);
  main.variable(observer("data")).define("data", _data);
  main.variable(observer("colors")).define("colors", ["d3"], _colors);
  main.variable(observer("height")).define("height", ["width"], _height);
  return main;
}
