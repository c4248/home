const cities = [
    {
        city: "Irvine",
        state: "CA",
        lat: 33.67801089040,
        long: -117.773633283
    },
    {
        city: "Bellevue",
        state: "WA",
        lat: 47.59624376060,
        long: -122.153569982
    },
    {
        city: "Mountain View",
        state: "CA",
        lat: 37.39992523790,
        long: -122.079544343
    },
    {
        city: "Plano",
        state: "TX",
        lat: 33.05021492780,
        long: -96.7486409797
    },
    {
        city: "Jersey City",
        state: "NJ",
        lat: 40.71881308520,
        long: -74.0687740635
    }
]
const width = window.innerWidth
const height = window.innerHeight

let city, lnglat
let index = 0

const svg = d3.select('svg').append('g')
const projection = d3.geoMercator()

const path = d3.geoPath()
    .projection(projection)

const zoomed = () => {
    svg.attr('transform', `translate(${d3.event.transform.x}, ${d3.event.transform.y}) scale(${d3.event.transform.k}, ${d3.event.transform.k})`)
}

const transform = () => {
    const cityPoint = {
        "type": "Feature",
        "geometry": {
            "type": "Point",
            "coordinates": [city.long, city.lat]
        },
        "properties": {
            "name": "Dinagat Islands"
        }
    };

    const centroid = path.centroid(cityPoint)
    const x = width / 2 - centroid[0]
    const y = height / 2 - centroid[1]

    return d3.zoomIdentity
        .translate(x-(width*.4),y-(height*.2))
}

const transition = (isDown) => {

    if(isDown){
        index++
    }else {
        index--
        if(index < 0){
            index = cities.length-1
        }
    }
    console.log(index)

    index = index % cities.length


    city = cities[index]

    svg.transition()
        .duration(1500)
        .call(zoom.transform, transform)
        // .on('end', ()=>svg.call(transition))
}

const zoom = d3.zoom()
    .on('zoom', zoomed)

const drawChart = (data) => {
    city = cities[index]

    const center = [cities[0].long, cities[0].lat]

    projection
        .scale(7000)
        .center(center)

    svg.append('g')
        .attr('class', 'states')
        .selectAll('path')
        .data(topojson.feature(data, data.objects.counties).features)
        .enter().append('path')
        .attr('d', path)

    svg.append('path')
        .attr('class', 'state-borders')
        .attr('d', path(topojson.mesh(data, data.objects.states, (a,b)=> a!==b)))

    const point = svg.selectAll('.city')
        .data(cities).enter()
        .append('g')
        .classed('city', true)
        .attr('transform', d=>`translate(${projection([d.long,d.lat])[0]}, ${projection([d.long,d.lat])[1]})`)

    point.append('circle')
        .classed('city-circle', true)
        .attr('r', '10px')

    // svg.append('path')
    //     .attr('class', 'state-borders')
    //     .attr('d', path(topojson.mesh(data, data.objects.nation, (a,b)=> a!==b)))
}


// const citiesRequest = d3.csv('us_cities.csv');
const mapRequest = d3.json('us.json')

// Promise.all([citiesRequest, mapRequest])
mapRequest
.then( result => {
    drawChart(result);
})
.catch(error => {
    throw (error);
});


let callIsReady = true

window.addEventListener('wheel', e=>{

    if(e.deltaY>0 && callIsReady){
        svg.call(()=>transition(true))
    }

    else if(e.deltaY <0 && callIsReady){
        svg.call(()=>transition(false))
    }

    callIsReady = false
    setTimeout(()=>{
        callIsReady = true
    },1000)
})