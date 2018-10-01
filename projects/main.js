const cities = [
    {
        city: "Irvine",
        state: "CA",
        lat: 33.67801,
        long: -117.77363,
        population: "POP: 266,122 "
    },
    {
        city: "Bellevue",
        state: "WA",
        lat: 47.59624,
        long: -122.15356,
        population: "POP: 141,400"
    },
    {
        city: "Mountain View",
        state: "CA",
        lat: 37.39992,
        long: -122.07954,
        population: "POP: 80,447"
    },
    {
        city: "Plano",
        state: "TX",
        lat: 33.05021,
        long: -96.74864,
        population: "POP: 279,088"
    },
    {
        city: "Jersey City",
        state: "NJ",
        lat: 40.71881,
        long: -74.06877,
        population: "POP: 264,152"
    }
]
const width = window.innerWidth
const height = window.innerHeight

let city, lnglat, point, cityForDeanimate
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
    const x = width / 2 - centroid[0] - width*.4
    const y = height / 2 - centroid[1] - height*.3

    return d3.zoomIdentity
        // .translate(x-(width*.4),y-(height*.2))
        .translate(x,y)
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

    index = index % cities.length
    cityForDeanimate = city.city
    setTimeout(()=>deanimateText(cityForDeanimate),1000)
    
    city = cities[index]

    svg.transition()
        .duration(1500)
        .call(zoom.transform, transform)
        .transition()
        .on('start', animateText)
}

const zoom = d3.zoom()
    .on('zoom', zoomed)

const drawChart = (data) => {
    city = cities[index]
    cityForDeanimate = city.city

    const center = [cities[index].long, cities[index].lat]
    projection
        .scale(7000)
        .center(center)
        .translate([width/2-width*.4, height/2-height*.3])

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
    point.append('text')
        .attr('class', "city-text")
        .attr('id', d=>"city-text"+d.city)

    point.append('text')
        .classed('detail-text', true)
        .attr('id', d=>"details"+d.city)

    point.append('text')
        .classed('detail-lat', true)
        .attr('id', d=>"lat"+d.city)

    point.append('text')
        .classed('detail-long', true)
        .attr('id', d=>"long"+d.city)

    point.append('div')
        .classed('typer', true)
    animateText()
}

const animateText = () => {
    let cityName = `${city.city}, ${city.state}`.toUpperCase().split('')
    theCity = city
    latCity = "LAT: "+ theCity.lat
    longCity = "LONG: "+ theCity.long

    cityName.map((d,i)=>{
        setTimeout(()=>{
            document.getElementById(`city-text${theCity.city}`).innerHTML +=d
        }, i*130)
    })    
    theCity.population.split("").map((d,i)=>{
        setTimeout(()=>{
            document.getElementById(`details${theCity.city}`).innerHTML +=d
        }, i*75)
    })
    latCity.split("").map((d,i)=>{
        setTimeout(()=>{
            document.getElementById(`lat${theCity.city}`).innerHTML +=d
        }, i*100)
    })
    longCity.split("").map((d,i)=>{
        setTimeout(()=>{
            document.getElementById(`long${theCity.city}`).innerHTML +=d
        }, i*80)
    })
}

const deanimateText = (cityDe) => {
    document.getElementById(`city-text${cityDe}`).innerHTML = ''
    document.getElementById(`details${cityDe}`).innerHTML = ""
    document.getElementById(`lat${cityDe}`).innerHTML = ''
    document.getElementById(`long${cityDe}`).innerHTML = ''
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
    },1300)
})