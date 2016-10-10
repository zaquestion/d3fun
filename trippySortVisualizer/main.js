
var render = {
    space: {
        margin: {},
        strokeWidth: 0,
        width: 0,
        height: 0
    },
    scene: {
        x: null,
        y: null,
        line: null,
        color: null
    },
    data: {
        elements: null,
        n: 0,
        arrays: null
    }
}


var index = 0;
var frames = 24 * 4;
var goingDown = false;

function generateSineData(samples, num, o){
  return d3.range(o, num).map(function(i){
    return Math.sin(i/30);
  });
}

function sortNumber(a,b) {
    return a - b;
}

function sortNumberReverse(a,b) {
    return b - a;
}

/*
var genNums = function(frames_in, upperBound) {
    xs = [];
    for (i = 0; i < frames_in; i++) {
        tmp = (Math.random() + 0.00000001) * upperBound;
        xs[i] = Math.floor(tmp);
    }

    return xs.sort(sortNumber)

}
*/

var genNums3 = function(s, m, o) {
	sd = generateSineData(Math.PI * 3, s, o)
	f = d3.scale.pow().domain([0,s]).range([o, m]);
	a = [];
	for (i = 0; i < s; i++) {
		a[i] = f(i) * sd[i];
	}
	return a;
}
var genNums2 = function(s, m, o) {
	f = d3.scale.pow().domain([0,s]).range([o, m]);
	a = [];
	for (i = 0; i < s; i++) {
		a[i] = f(i);
	}
	return a;
}
var genNums = function(s, m, o) {
	f = d3.scale.quantize().domain([0,s]).range(d3.range(o, m));
	a = [];
	for (i = 0; i < s; i++) {
		a[i] = (f(i));
	}
	return a;
}
vals = genNums(frames, 100, 3);
h1 = genNums3(frames*100, 150, 0);
s1 = genNums2(frames*100, 1, 1);
l1 = genNums2(frames*100, 0.5, 0.4);

h2 = genNums3(frames*100, 190, 175);
s2 = genNums2(frames*100, 1, 1);
l2 = genNums2(frames*100, .5, .5);

console.log(vals);

// n controlls the number of lines being sorted
function DoIt() {
    d3.select("svg").remove();

    if (goingDown) {
        index--;
    } else {
        index++;
    }

    if (index === frames - 1) {
        goingDown = true;
    }

    if (index == 0) {
        goingDown = false;

    }

    console.log("x:", index,"y:", vals[index],"z:");
    render.data.n = vals[index];

    render.data = genElements(render.data)
    var space = {}
    space.margin = {top: 20, right: 20, bottom: 20, left: 20}
    space.strokeWidth = 1

	// These control the height and width of the output
    space.width = 2500 + 40 - space.margin.left - space.margin.right,
    space.height = 1295 + 40 - space.margin.top - space.margin.bottom;

    render.space = space

    render.scene = buildScene(render.space, render.data)

    svg = makeSvg(render.space)
    svg = applySceneAndData(svg, render.scene, render.data)
    window.setTimeout(DoIt, 20)
}

function buildScene(space, data) {
    var scene = {}
    scene.x = d3.scale.ordinal()
    .domain(d3.range(data.n))
    .rangePoints([0, space.width]);

    scene.y = d3.scale.ordinal()
    .domain(d3.range(data.arrays.length))
    .rangePoints([0, space.height]);

    scene.line = d3.svg.line()
    .interpolate(interpolateLine)
    .x(function(d) { return scene.x(d.index); })
    .y(function(d) { return scene.y(d.time); });





// This controls the color. It is hard to understand
// google d3 cubehelix
    scene.color = d3.scale.pow()
    .domain([0, data.n])
    .range([d3.hsl(h1[index], s1[index], l1[index]), d3.hsl(h2[index], s2[index], l2[index])]);
    //.range([d3.hsl(270, .75, .35), d3.hsl(70, 1.5, .8)])

    return scene
}

function makeSvg(space) {

    return svg = d3.select("body").append("svg")
        .attr("width", space.width + space.margin.left + space.margin.right)
        .attr("height", space.height + space.margin.top + space.margin.bottom)
      .append("g")
        .attr("transform", "translate(" + space.margin.left + "," + space.margin.top + ")");
}

function applySceneAndData(svg, scene, data) {
    return svg.append("g")
        .attr("class", "line")
      .selectAll("path")
        .data(data.elements)
      .enter().append("path")
        .style("stroke", function(d) { return scene.color(d.indexes[d.indexes.length - 1].index); })
        .attr("d", function(d) { return scene.line(d.indexes); })
      .select(function() { return this.parentNode.insertBefore(this.cloneNode(false), this); })
        .attr("class", "line-halo")
        .style("stroke", null);
}



function interpolateLine(points) {
  var p0 = points[0],
      x0 = p0[0],
      y0 = p0[1],
      path = [p0];
  for (var i = 1, n = points.length, p1, x1, y1; i < n; ++i) {
    p1 = points[i];
    x1 = p1[0];
    y1 = p1[1];
    path.push("V", (y0 * 2 + y1) / 3, "L", x1, ",", (y0 + y1 * 2) / 3, "V", y1);
    x0 = x1;
    y0 = y1;
  }
  return path.join("");
}

function quicksortC(array) {
	  var qsarrays = [array.slice()],
	      n = array.length;
function quicksort(array, low, high){
	if(high > low){
		var index = getRandomInt(low,high);
		//console.log(low,high,index);
		var pivot  = array[index];
		//console.log("pivot",pivot);
		array = partition(array,pivot);
		qsarrays.push(array.slice())
		//console.log(a);
		quicksort(array,low,index-1);
		quicksort(array,index+1,high);
	}
}
	  quicksort(array, 0, n);
	  return qsarrays;

}

function  partition (a,pivot) {

	var i = 0;
	for( var j=0; j < a.length; j++ ){
		if( a[j]!= pivot && a[j] < pivot ){
			var temp = a[i];
			a[i] = a[j];
			a[j] = temp;
			i++;
		}
	}
	return a;
}



function getRandomInt (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function mergesort(array) {
  var arrays = [array.slice()],
      n = array.length,
      array0 = array,
      array1 = new Array(n);

  for (var m = 1; m < n; m <<= 1) {
    for (var i = 0; i < n; i += (m << 1)) {
      merge(i, Math.min(i + m, n), Math.min(i + (m << 1), n));
    }
    arrays.push(array1.slice());
    array = array0, array0 = array1, array1 = array;
  }

  function merge(left, right, end) {
    for (var i0 = left, i1 = right, j = left; j < end; ++j) {
      array1[j] = array0[i0 < right && (i1 >= end || array0[i0] <= array0[i1]) ? i0++ : i1++];
    }
  }

  return arrays;
}
// n controlls the number of lines being sorted
function genElements(data) {
    var  array = d3.shuffle(d3.range(data.n))
    data.arrays = mergesort(array.slice()),
    //data.arrays = quicksortC(array.slice()),
    data.elements = d3.range(data.n).map(function(i) { return {value: i, indexes: []}; });


    data.arrays.forEach(function(array, t) {
      array.forEach(function(value, i) {
        data.elements[value].indexes.push({time: t, index: i});
      });
    });

    return data
}



d3.select(self.frameElement).style("height", render.space.height + render.space.margin.top + render.space.margin.bottom + "px");

DoIt()
