function checkFunction(){
    if (document.getElementById('input').checked == true){
        document.getElementById('sort-text-button').innerHTML = "SORT BY LETTER";
    }else {
        document.getElementById('sort-text-button').innerHTML = 'SORT BY SALARY';
    }
}

function aboutClick(e){
    e.preventDefault();
    document.getElementById('hamburger-9').click()
    document.getElementById('salary').classList.add('lorem__moveout')
    document.getElementById('pie').classList.add('heading__text-moveout')
    document.getElementById('line').classList.add('lorem__moveout')
    document.getElementById('usa').classList.add('heading__text-moveout')

    setTimeout(()=>window.location.href='/about', 1200)
}

function homeClick(e){
    e.preventDefault();
    document.getElementById('hamburger-9').click()
    document.getElementById('salary').classList.add('lorem__moveout')
    document.getElementById('pie').classList.add('heading__text-moveout')
    document.getElementById('line').classList.add('lorem__moveout')
    document.getElementById('usa').classList.add('heading__text-moveout')
    document.getElementById('hamburger-9').classList.add('hamburger-gone')
    setTimeout(()=>window.location.href='/', 1200)

}

document.getElementById('hamburger-9').addEventListener('click', ()=>{
    document.getElementById('hamburger-9').classList.toggle('is-active')
    document.getElementById('nav-nav').classList.toggle('nav-nav-display')
})

window.onload = function() {
    var container = document.getElementById('chart');
    var t = d3.transition().duration(1500);
    var xAxis;

    var margin = {top: 20, right: 0, bottom: 240, left: 150},
        width = container.clientWidth - margin.left - margin.right,
        height = container.clientHeight - margin.top - margin.bottom;

    var x = d3.scaleBand()
        .range([0, width])
        .padding(0.1);

    var y = d3.scaleLinear().range([height, 0])

    var svg = d3.select('#chart').append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
            .attr('transform', `translate(${margin.left}, ${margin.top})`)

    
    document.getElementById('input').checked = false;
    

    d3.csv('degrees.csv').then(data => {
        var filteredData = []
        var keys = [];
        data.forEach(d => {
            let degreeSal = {};
            degreeSal.degree = d["Undergraduate Major"];
            keys.push(d["Undergraduate Major"]);
            degreeSal.starting_salary = +d["Starting Median Salary"]
                .slice(1)
                .replace(/,/g, "");
            degreeSal.mid_career_salary =
                +d["Mid-Career Median Salary"].slice(1).replace(/,/g, "") -
                degreeSal.starting_salary;
            filteredData.push(degreeSal);

        });
        draw(filteredData);
        
        window.addEventListener('resize', ()=>{
            redraw(filteredData);
        })
    })

    function createAxis(){
        var formatPercent = d3.format("$,");
        xAxis = d3.axisBottom().scale(x);

        var yAxis = d3.axisLeft()
            .scale(y)
            .tickFormat(formatPercent)

        svg.append('g')
            .attr('class', 'x axis')
            .attr('transform', `translate(0, ${height})`)
            .call(xAxis)
            .selectAll('text')
            .attr('y', '10')
            .attr('x', '-5')
            .attr('text-anchor', 'end')
            .attr('transform', 'rotate(-40)')

        svg.append('g')
            .attr('class', 'y axis')
            .call(yAxis)
            .append('text')
            .attr('transform', 'rotate(-90)')
            .attr('y', 6)
            .attr('dy', '.71em')
            .style('text-anchor', 'end')
            .text('Salary')

        function make_x_gridlines(){
            return d3.axisLeft(y).ticks(10);
        }

        svg
            .append('g')
            .attr('class', 'grid')
            .call(
                make_x_gridlines()
                    .tickSize(-width)
                    .tickFormat('')
            )
    }

    function draw(data){
        
        d3.select('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', `translate(${margin.left}, ${margin.top})`);
        
        var tip = d3
        .tip()
        .attr("class", "d3-tip")
        .html(d => {
            let text = `<strong class="gold">Degree:</strong> <span style='color:#fff'>${
            d.degree
            }</span><br>`;
            let starting_salary_locale = d.starting_salary.toLocaleString();
            text += `<strong class="gold">Starting Salary:</strong> <span style='color:#fff'>$${starting_salary_locale}</span><br>`;
            return text;
        });
        svg.call(tip);

        x.domain(data.map(d => d.degree))
        y
            .range([height, 0])
            .domain([0, 80000])
        var bars = svg.selectAll('.bar')
            .data(data)

        bars.enter().append('rect')
            .attr('class', 'bar')
            .attr('x', (d)=>x(d.degree))
            .attr('width', x.bandwidth())
            .attr('y', y(0))
            .attr('height', 0)
            .on('mouseover', tip.show)
            .on('mouseout', tip.hide)
            .on('resize', tip.hide)
            .transition(t)
            .attr('y', (d)=>y(d.starting_salary))
            .attr('height', (d)=>height-y(d.starting_salary))
        
        

        d3.select('input').on('change', change)

        function change() {
            // Copy-on-write since tweens are evaluated after a delay.
            // var x0 = (this.checked
            //     ? x.domain(filteredData.sort((a,b)=>b.starting_salary - a.starting_salary))
            //     : x.domain(filteredData.map(d=>d.degree)))
            //     .map(function(d) { return d.degree; })
            //     .copy();
            var x0 = x
            .domain(
                data
                .sort(
                    this.checked
                    ? function(a, b) {
                        return b.starting_salary - a.starting_salary;
                        }
                    : function(a, b) {
                        return d3.ascending(a.degree, b.degree);
                        }
                )
                .map(function(d) {
                    return d.degree;
                })
            )
            .copy();

            svg.selectAll(".bar").sort(function(a, b) {
            return x0(a.degree) - x0(b.degree);
            });

            var transition = svg.transition().duration(750),
            delay = function(d, i) {
                return i * 50;
            };

            transition
            .selectAll(".bar")
            .delay(delay)
            .attr("x", function(d) {
                return x0(d.degree);
            });

            transition
            .select(".x.axis")
            .call(xAxis)
            .selectAll("g")
            .delay(delay);
        }
        createAxis()
        
    }

    function redraw(data){
        width = container.clientWidth - margin.left - margin.right;
        height = container.clientHeight - margin.top - margin.bottom;

        d3.select('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)

        x
            .range([0, width])
            .padding(0.1)
            .domain(data.map(d=>d.degree))
        
        y
            .range([height, 0])
            .domain([0, 80000])

        var bars = svg.selectAll('.bar')
            .data(data)
        
        svg.selectAll('.x.axis').remove()
        svg.selectAll('.y.axis').remove()
        svg.selectAll('.grid').remove()

        bars.enter().append('rect')
            .attr('class', 'bar')
        
        bars.exit()
            // .transition()
            //     .duration(300)
            // .attr('y', y(0))
            // .attr('height', height-y(0))
            // .style('fill-opacity', 1e-6)
            .remove()

            var tip = d3
            .tip()
            .attr("class", "d3-tip")
            .html(d => {
                let text = `<strong class="gold">Degree:</strong> <span style='color:#fff'>${
                d.degree
                }</span><br>`;
                let starting_salary_locale = d.starting_salary.toLocaleString();
                text += `<strong class="gold">Starting Salary:</strong> <span style='color:#fff'>$${starting_salary_locale}</span><br>`;
                return text;
            });
            svg.call(tip);

        bars
            .attr('x', (d)=>x(d.degree))
            .attr('width', x.bandwidth())
            .attr('y', d=>y(d.starting_salary))
            .attr('height', d=>height - y(d.starting_salary))
            .on('mouseover', tip.show)
            .on('mouseout', tip.hide)
            .on('resize', tip.hide)

        createAxis();

    }

    
}

function redrawPie(){
    var pieDiv  = d3.select('#pie-content').html("")
    pieWidth = document.getElementById('pie-content').clientWidth
    pieHeight = document.getElementById('pie-content').clientHeight
    console.log("pieHeight", pieHeight)
    if (pieWidth == 0){
        pieWidth = document.getElementById('pie-content').parentNode.clientWidth
    }
    if (pieHeight == 0){
        pieHeight = document.getElementById('pie-content').parentNode.clientHeight
    }

    var svg = d3.select("#pie-content"),
        width = pieWidth,
        height = pieHeight-.2*pieHeight,
        radius = Math.min(width, height ) / 2


    g = svg.append("g").attr("transform", "translate(" + width / 2 + "," + (height) / 2 + ")");



    pieDiv.attr('height', height+20)
        


    g.append('g')
        .attr('class', 'lines')

    var color = d3.scaleOrdinal(["#f7d0cb", "#b76e79", "#f7f6f0", "#aaaaaa", "#61656e"]);

    function midAngle(d) { return d.startAngle + (d.endAngle - d.startAngle) / 2; }

    var pie = d3.pie()
        .sort(null)
        .value(function(d) { return d.percentage; });

    var path = d3.arc()
        .outerRadius(radius - .01*width)
        .innerRadius(radius - .17*width);

    var label = d3.arc()
        .outerRadius(radius - 0)
        .innerRadius(radius - 0);



    d3.csv("data.csv").then(data=>{


    var tip = d3.tip().attr('class', 'd3-tip')
        .html((d)=>{
            let text = `
                <strong class="gold">Ethnicity: </strong><span style="color:#fff">${d.data.ethnicity}</span>
                <br/><strong class="gold">Percentage:</strong> <span style="color:#fff">${d.data.percentage}%</span>`
            return text
        })
        svg.call(tip)

        var arc = g.selectAll(".arc")
        .data(pie(data))
        .enter().append("g")
            .on('mouseover', tip.show)
            .on('mouseout', tip.hide)
            .attr("class", "arc");

        arc.append("path")
            .attr("d", path)
            .attr("fill", function(d) { return color(d.data.ethnicity); });

        if(width > 600){
            arc.append("text")
            .attr("dy", "0.35em")
            .text(function(d) { return d.data.ethnicity; })
            .attr('transform', function(d) {

            // effectively computes the centre of the slice.
            // see https://github.com/d3/d3-shape/blob/master/README.md#arc_centroid
                var pos = label.centroid(d);

                // changes the point to be on left or right depending on where label is.
                pos[0] = radius * 1.1 * (midAngle(d) < Math.PI ? 1 : -1);
                return 'translate(' + pos + ')';
            })
            .style('text-anchor', function(d) {
                // if slice centre is on the left, anchor text to start, otherwise anchor to end
                return (midAngle(d)) < Math.PI ? 'start' : 'end';
            })

            var polyline = svg.select('.lines')
                .selectAll('polyline')
                .data(pie(data), (d)=> d.data.ethnicity)
                .enter().append('polyline')
                .attr('points', function(d) {
                    // see label transform function for explanations of these three lines.
                    var pos = label.centroid(d);
                    pos[0] = radius * 1.1 * (midAngle(d) < Math.PI ? 1 : -1);
                    return [path.centroid(d), label.centroid(d), pos]

                });
        }else {
            arc.append("text")
        .attr("transform", function(d) { return "translate(" + label.centroid(d) + ")"; })
        .attr("dy", "0.35em")
        .text(function(d) { return d.data.ethnicity; });
        }
        
    });
}
redrawPie()
window.addEventListener('resize', ()=>{
    redrawPie();
})

function redrawLine(){
    var pieDiv  = d3.select('#line-content').html("")
    var lineWidth = document.getElementById('line-content').parentNode.clientWidth
    var lineHeight = document.getElementById('line-content').parentNode.clientHeight
    console.log(lineHeight)

    var linesvg = d3.select("#line-content"),
        margin = {top: 20, right: 0, bottom: 30, left: 50},
        width = lineWidth - margin.left - margin.right,
        height = lineHeight - margin.top - margin.bottom,
        g = linesvg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var parseTime = d3.timeParse("%Y%m%d"),
    bisectDate = d3.bisector(function(d) { return d.DATE; }).left;

    var x = d3.scaleTime()
        .rangeRound([0, width]);

    var y = d3.scaleLinear()
        .rangeRound([height, 0]);

    var line = d3.line()
        .curve(d3.curveCardinal)
        .x(function(d) { return x(d.DATE); })
        .y(function(d) { return y(d.TMAX); });

    d3.select("text")
        .attr('class', 'text-box')

    d3.csv("weather.csv").then(data=>{

    data.forEach(d=>{
        d.DATE = parseTime(d.DATE);
        d.TMAX = + d.TMAX
    })

    x.domain(d3.extent(data, function(d) { return d.DATE; }));
    y.domain(d3.extent(data, function(d) { return d.TMAX; }));

    g.append("g")
        .attr("transform", "translate(0," + height + ")")
        .attr('class', 'line-axis-x')
        .call(d3.axisBottom(x).ticks(12).tickFormat(d3.timeFormat('%b')))
        .select(".domain")
        .remove();

    g.append("g")
        .call(d3.axisLeft(y))
        .append("text")
        .attr("fill", "#f6f6f6")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end")
        .attr('class', 'line-text')
        .text("TMAX");

    g.append("path")
        .datum(data)

        .attr('class', 'line-path')
        .attr("stroke", "#ffbd84")
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("d", line);

            var focus = g.append("g")
            .attr("class", "focus")
            .style("display", "none");

        focus.append("line")
            .attr("class", "x-hover-line hover-line")
            .attr("y1", 0)
            .attr("y2", height);

        focus.append("line")
            .attr("class", "y-hover-line hover-line")
            .attr("x1", width)
            .attr("x2", width);

        focus.append("circle")
            .attr("r", 7.5);

        focus.append("text")
            .attr('fill', '#f6f6f6')
            .attr("x", 15)
            .attr("dy", ".31em");

        linesvg.append("rect")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
            .attr("class", "overlay")
            .attr("width", width)
            .attr("height", height)
            .on("mouseover", function() { focus.style("display", null); })
            .on("mouseout", function() { focus.style("display", "none"); })
            .on("mousemove", mousemove);



        function mousemove() {
            var x0 = x.invert(d3.mouse(this)[0]),
                i = bisectDate(data, x0, 1),
                d0 = data[i - 1],
                d1 = data[i],
                d = x0 - d0.DATE > d1.DATE - x0 ? d1 : d0;
            focus.attr("transform", "translate(" + x(d.DATE) + "," + y(d.TMAX) + ")");
            focus.select("text").text(function() { return `${d.DATE.toDateString()} - ${d.TMAX}`.toUpperCase(); });
            focus.select('text').attr('class', 'text-box')
            focus.select(".x-hover-line").attr("y2", height - y(d.TMAX));

        
        }
    });
}

redrawLine();

window.addEventListener('resize', ()=>{
    redrawLine();
})



function redrawChlor(){
    d3.select('#map-div').html("")
    var divWidth = document.getElementById('map-div').parentNode.clientWidth
    var width = divWidth;
    var height = .5625*width;
    console.log(width)

    // D3 Projection
    var projection = d3.geoAlbersUsa()
                    .translate([width/2, height/2])    // translate to center of screen
                    .scale([divWidth]);          // scale things down so see entire US
            
    // Define path generator
    var path = d3.geoPath()               // path generator that will convert GeoJSON to SVG paths
                .projection(projection);  // tell path generator to use albersUsa projection

            
    // Define linear scale for output
    var color = d3.scaleLinear()
                .range(["rgb(213,222,217)","rgb(69,173,168)","rgb(84,36,55)","rgb(217,91,67)"]);


    //Create SVG element and append map to the SVG
    var svg = d3.select(".map-div")
                .append('svg')
                .attr("width", width)
                .attr("height", height);
           
    // Append Div for tooltip to SVG
    var div = d3.select("body")
                .append("div")   
                .attr("class", "tooltip")               
                .style("opacity", 0);

    var div2 = d3.select('.map-description')
        // .append('div')
        // .attr('class', 'map-div-left')

    // Load in my states data!
    d3.csv("stateslived.csv").then((data)=>{
    color.domain([0,1,2,3]); // setting the range of the input data

    // Load GeoJSON data and merge with states data
    d3.json("us-states.json").then(json=>{

            // Bind the data to the SVG and create one path per GeoJSON feature
    svg.selectAll("path")
        .data(json.features)
        .enter()
        .append("path")
        .attr("d", path)
        .style("stroke", "#fff")
        .style("stroke-width", "1")
        .style("fill", function(d) {

        // Get data value
        var value = d.properties.visited;

        if (value) {
        //If value exists…
        return color(value);
        } else {
        //If value is undefined…
        return "rgb(213,222,217)";
        }
    });

            
    d3.csv("shootings.csv").then(data=>{

        
    svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", function(d) {
            if(d['Latitude']){
                return projection([d['Longitude'], d['Latitude']])[0];
            }	
        })
        .attr("cy", function(d) {
            if(d['Latitude']){
                return projection([d['Longitude'], d['Latitude']])[1];
            }	
        })
        .attr("r", function(d) {
            if(d['Latitude']){
                return 5;
            }
            return 0;
            
        })
            .style("fill", "rgb(217,91,67)")	
            .style("opacity", 0.85)	

        // Modification of custom tooltip code provided by Malcolm Maclean, "D3 Tips and Tricks" 
        // http://www.d3noob.org/2013/01/adding-tooltips-to-d3js-graph.html
        .on("mouseover", function(d) {

            var text = d['Location'] ? d['Location'] : d['Title']
            var description = d['Location'] ? `${d['Date']} | ${d['Title']} - ${d['Location']} <br><br> ${d['Summary']}` : `${d['Date']} | ${d['Title']} <br><br> ${d['Summary']}`    
            
            div.transition()        
                .duration(200)      
                .style("opacity", .9);      
            div.text(text)
                .style("left", (d3.event.pageX) + "px")     
                .style("top", (d3.event.pageY - 28) + "px");
            div2
                .html(`<p>${description}</p>`)  

            
        })   

        // fade out tooltip on mouse out               
        .on("mouseout", function(d) {       
            div.transition()        
            .duration(500)      
            .style("opacity", 0);   
        });
    });  
            
        });

    });


}
redrawChlor()
window.addEventListener('resize', ()=>{
    redrawChlor();
})
