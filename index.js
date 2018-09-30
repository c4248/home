let data = [
    84,85,75,71,92,96,90,61, 
    54,41,58,45,60,52,55,51,
    74,72,65,59,53,48,36,32,
    40,42,49,68,77,79,86,97
]

setTimeout(()=>{
    document.getElementById('description').classList.remove('no_opacity')
}, 150)

setTimeout(()=>{
    document.getElementById('links').classList.remove('no_opacity')
},300)

setTimeout(()=>{
    document.getElementById('title').classList.remove('mtitle_animate')
    document.getElementById('description').classList.remove('mdescription_animate')
    document.getElementById('links').classList.remove('mlinks_animate')
}, 800)
onClick = () => {
    document.getElementById('title').classList.add('move_left_to_gone')
    setTimeout(()=>{
        document.getElementById('description').classList.add('move_left_to_gone')
    }, 200)
    setTimeout(()=>{
        document.getElementById('links').classList.add('move_left_to_gone')
    }, 400)
    document.getElementById('svg_canvas').classList.add('move_way_out_gone')
    setTimeout(()=>{
        window.location.href = 'http://127.0.0.1:8080/about'
    }, 800)
}

let svg = d3.select('svg')

let x = d3.scaleBand()
    .domain(data.map(d=>d))
    .range([0, window.innerWidth])
    .padding(0.2)

let y = d3.scaleLinear()
    .rangeRound([window.innerHeight, 0])
    .domain([0, 120])

let random = 0

let bars = svg.selectAll('.home_bar')
        .data(data)
        .enter().append('rect')
        .attr('class', 'home_bar')
        
draw = () => {
    bars
        .data(data)
        .attr('x', d=>x(d))
        .attr('width', x.bandwidth())
        .attr('height', 0)
        .attr('y', d=>y(20))
        .transition()
        .delay((d,i)=>i*70)
        .duration(500)
        .ease(d3.easeBounceOut)
        .attr('y', d=>y(d))
        .attr('height', (d)=>window.innerHeight - y(d))
        .transition()
        .delay(d=>2200)
        .duration(500)
        .ease(d3.easeBounceOut)
        .attr('y', d=>y(120))
        .attr('height', d=>y(d))
        .transition()
        .delay(d=>2200)
        .duration(500)
        .ease(d3.easeBounceOut)
        .attr('y', d=>y(120))
        .attr('height', d=>y(120))
}

let fields = [
    {value: 12, size: 12, label: "h", update: function(date) { 
        let hour = date.getHours();
        if (hour == 0){
            return 12
        }
        if (hour > 12) {
            return hour - 12
        }
        return hour
    }},
    {value: 60, size: 60, label: "m", update: function(date) { 
        let minutes = date.getMinutes()
        if (minutes < 10){
            return "0"+minutes
        }
        return minutes
    }},
    {value: 60, size: 60, label: "s", update: function(date) { 
        let seconds = date.getSeconds()
        if (seconds < 10){
            return "0"+seconds
        }
        return seconds
    }}
];

let arc = d3.arc()
    .innerRadius(150)
    .outerRadius(200)
    .startAngle(0)
    .endAngle(d=>(d.value / d.size) * 2 * Math.PI)

let field = svg.selectAll('.field')
    .data(fields)
    .enter().append('g')
    .attr('transform', (d,i)=>`translate(${i*450+500}, ${window.innerHeight/2-70})`)
    .attr('class', 'field')

let path = field.append('path')


let label = field.append('text')
    .attr('class', 'label')
    .attr('dy', '4.1rem')

function arcTween(b) {
    var i = d3.interpolate({value: b.previous}, b);
    return function(t) {
        return arc(i(t));
    };
    }

function arcTweenTwo(a) {
    var i = d3.interpolate(a.value, 0 );
    return function(t) {
        a.value = i(t)
        return arc(a);
    };
    }

update = (isFirst) => {
    let now = new Date();
    path
        .attr('d', arc)
        .transition()
        .ease(d3.easeElastic)
        .duration(isFirst ? 1300 : 700)
        .attrTween('d', arcTween)
    
    field
        .each(d=>{d.previous = d.value, d.value = d.update(now)})

    if(isFirst){
        label
            .text(d=>d.value)
            .attr('opacity', '0')
            .transition()
            .duration(1000)
            .attr('opacity', '1')
    }
    else {
        label
            .text(d=>d.value)
    }
    
  
}

undrawPie = () => {
    path
        .transition()
        .duration(1000)
        .ease(d3.easeElastic)
        .attrTween('d',arcTweenTwo)

    label
        .attr('opacity', '1')
        .transition()
        .duration(1200)
        .attr('opacity', '0')
}

let interval

drawOnce = () => {
    draw()
    setTimeout(()=>{
        update(true)
        interval = setInterval(()=>{
            update(false)
        },1000)
    }, 8000)
    setTimeout(()=>{
        clearInterval(interval)
        undrawPie()
    },18000)
}
drawOnce()

setInterval(()=>{
    drawOnce()
}, 19000)