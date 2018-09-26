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

let city
let index = 0 

const svg = d3.select('svg').append('g')
const projection = d3.geoMercator();

const path = d3.geoPath()
    .projection(projection);

const zoomed = () => {
    svg.attr('transform', `translate(${d3.event.transform.x}, ${d3.event.transform.y}) scale(${d3.event.transform.k}, ${d3.event.transform.k})`);
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
    }

    const centroid = path.centroid(cityPoint)
    const x = width / 2 - centroid[0]
    const y = height /2 - centroid[1]

    return d3.zoomIdentity
        .translate(x, y)
}

const transition = () => {
    index++;
    index = index % cities.length

    city = cities[index]
    svg.transition()
        .delay(500)
        .duration(3000)
        .call(zoom.transform, transform)
        .on('end', () => {svg.call(transition) })
}

const zoom = d3.zoom()
    .on('zoom', zoomed)

const drawChart = (data) => {
    // cities = data[0].filter( d=>{
    //     return CITIES.indexOf(d.PlaceName) !== -1
    // })
    // .map( d => {
    //     const lnglat = d.Geolocation.replace(/[\(\)\s]/g, '').split(',').map(d => +d).reverse()

    //     return {
    //         stateAbbr: d.StateAbbr,
    //         placeName: d.PlaceName,
    //         lng: lnglat[0],
    //         lat: lnglat[1],
    //         lnglat: lnglat
    //     }
    // })

    // city = cities[index]

    const us = data[0]
    const center = [cities[0].long, cities[1].lat]

    svg.call(transition)

    projection
        .scale(7000)
        .center(center)

    svg.append('g')
        .attr('class', 'counties')
        .selectAll('path')
        .data(topojson.feature(us, us.objects.counties).features)
        .enter().append('path')
        .attr('d', path)

    svg.append('path')
        .attr('class', 'state-borders')
        .attr('d', path(topojson.mesh(us, us.objects.counties, (a, b) => a !== b )))

    const point = svg.selectAll('.city')
        .data(cities).enter()
        .append('g')
        .classed('city', true)
        .attr('transform', d=> {
            let location = [d.long, d.lat]
            console.log(projection(location))
            return `translate(${projection(location)[0]}, ${projection(location)[1]})`
        })

    point.append('circle')
        .classed('city-circle', true)
        .attr('r', '.8px')

    // point.append('text')
    //     .classed('city-text', true)
    //     .text(d => d.placeName)
}

const mapRequest = d3.json('us.json');

Promise.all([mapRequest])
.then( result => {
    drawChart(result);
})
.catch(error => {
    throw (error);
});

