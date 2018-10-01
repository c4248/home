const str_list = [   
    "Spent a decent amount of time with CSS on Xanga",
    "Fell in love with Ubuntu", 
    "Spent some time with HTML/CSS/JS, but even more with Flash :(",
    "I did some cool things with Flash like decompiling .swf sites to .fla and unlocking internals to some big sites.",
    "Used BackTrack 2 and 3 (now known as Kali Linux) to find hidden SSIDs, and crack WEP passwords.",
    "Took APCS1, HCS2(Algorithms), and participated in CS club in high school (Java)",
    "Enrolled for Computer Science @ University of Texas @ Dallas",
    "Dropped out",
    "Did some arduino projects with LEDs and motors",
    "Built a gallery with HTML/CSS/JS and JQuery for animations",
    "Built monolithic applications with Django where I also touched Redis and Celery for daily automated tasks",
    "Learned Angular 1.5 with Django REST Framework",
    "React and Redux, SASS, ESLint, responsive design, CSS transitions and animations, Heroku",
    "Next.js, Jest, redux-saga, flask-restful, SQLAlchemy, Postgres, system design, Firebase, Digital Ocean",
    "Authentication - JWT, salting and hashing, and a lot of d3"
]

setTimeout(()=>{
    document.getElementById('age').classList.remove('enter_visible')
    document.getElementById('fcontainer').classList.remove('enter_visible')
},1000)

const points = [
    52, 55, 65,
    66, 52, 58,
    61, 44, 31,
    28, 27, 17,
    25, 18, 19,
    20, 15, 12,
    7, 9, 11,
    22, 15, 25,
    30, 32, 37,
    41, 48, 45,
    42, 58, 60,
    72, 60, 50,
    55, 61, 73,
    80, 81, 82
]
let counter = 0

let pointsToDraw = []

var svg = d3.select("svg")

var x = d3.scaleLinear()
    .range([0, window.innerWidth])
    .domain([0, 41])

var y = d3.scaleLinear()
    .range([window.innerHeight, 0])
    .domain([0, 100])

var line = d3.line()
    .x((d,i)=>x(i))
    .y(d=>y(d))
    .curve(d3.curveCardinal)

function transition(path) {
    path.transition()
        .duration(1000)
        .attrTween("stroke-dasharray", tweenDash);
}

function transition2(path) {
    path.transition()
        .duration(1000)
        .attrTween("stroke-dasharray", tweenBackDash);

}

let totalLength = 0
let lengthBefore = 0
//IMPLEMENT STACK QUEUE TO KEEP TRACK OF ALL LENGTHS
let queue = []

function tweenDash() {
    var l = this.getTotalLength()
    queue.push(l)
    startLength = queue[queue.length-2]

    var i = d3.interpolateString(startLength ? startLength:0 + "," + l, l + "," + l)
    lengthBefore = totalLength
    totalLength = this.getTotalLength()
    return function (t) { return i(t); };
}

function tweenBackDash() {
    var l = this.getTotalLength()
    let position = queue.pop()
    var i = d3.interpolateString(position,queue[queue.length-1]);

    return function (t) {
        return i(t); 
    }
}
var path = svg.append("path")

var t = d3.transition()
    .duration(800)
    .ease(d3.easeExpInOut)

draw = (data, isForward) => {
    path
        .datum(data)
        .attr('d', line)
        .attr('class', 'area')
    if(isForward){
        path.call(transition)
    }
    
}

document.getElementById("f-mid").innerHTML = str_list[0]
document.getElementById("f-bot").innerHTML = str_list[1]

let scrollPlacement = 0
let timeout = false
let age = 12

window.addEventListener('wheel', e=>{
    if(timeout){
        return ;
    }
    if(!timeout){
        timeout = true
    }
    if(e.deltaY<0){
        if(scrollPlacement >= 14) {
            if(document.getElementById('age').classList.contains('animate_up_to_gone')){
                document.getElementById('fcontainer').classList.remove('animate_up_to_gone')
                document.getElementById('age').classList.remove('animate_up_to_gone')

                document.getElementById('fcontainer').classList.add('animate_down_to_show')
                document.getElementById('age').classList.add('animate_down_to_show')

                document.getElementById('fcontainer').classList.add('animate_down_to_show')
                setTimeout(()=>{
                    document.getElementById('fcontainer').classList.remove('animate_down_to_show')
                    document.getElementById('age').classList.remove('animate_down_to_show')
                }, 600)
                age++ 
            }
        }
        if(scrollPlacement > 0){
            scrollPlacement !== 0 && document.getElementById("f-top").classList.add('animate_down_to_white')
            document.getElementById("f-mid").classList.add('animate_down_to_black')
            document.getElementById("f-bot").classList.add('animate_down_to_gone')
            scrollPlacement--
            age--
            document.getElementById("age-number").innerHTML = age
            counter--
            if (scrollPlacement >= 14){
               
            }
            else {
                path
                    .transition()
                    .duration(1000)
                    .attrTween("stroke-dasharray", tweenBackDash);
                setTimeout(()=>{
                    pointsToDraw = points.slice(0, counter*3)
                    draw(pointsToDraw, false)   
                }, 1000)
            }
            
            
        }

    }
    if(e.deltaY>0){
        if(scrollPlacement < str_list.length-1){
            document.getElementById("f-top").classList.add('animate_up_to_gone')
            document.getElementById("f-mid").classList.add('animate_up_to_black')
            scrollPlacement != str_list.length-1 && document.getElementById("f-bot").classList.add('animate_up_to_white')
            scrollPlacement++
            age++
            document.getElementById("age-number").innerHTML = age
            counter++;
            pointsToDraw = points.slice(0, counter*3)
            draw(pointsToDraw, true)    
            if(scrollPlacement==1){
                document.getElementById('end_button').classList.add('enter_visible')
                document.getElementById('end_button').classList.add('yes_opacity')
            }       
        }
        else {
            document.getElementById('fcontainer').classList.add('animate_up_to_gone')
            document.getElementById('age').classList.add('animate_up_to_gone')
            scrollPlacement++
        }
    }

    setTimeout(()=>{
        let ftop = document.getElementById("f-top")
        ftop.innerHTML = str_list[scrollPlacement-1] === undefined ? null : str_list[scrollPlacement-1]
        let fmid = document.getElementById("f-mid")
        fmid.innerHTML = str_list[scrollPlacement] === undefined ? null : str_list[scrollPlacement]
        let fbot = document.getElementById("f-bot")
        fbot.innerHTML = str_list[scrollPlacement+1] === undefined ? null : str_list[scrollPlacement+1]

        const fdom = [ftop, fmid, fbot]

        fdom.map(f=>{
            if (f.classList.contains('animate_up_to_black')) {
                f.classList.remove('animate_up_to_black')
            }
            if (f.classList.contains('animate_down_to_black')){
                f.classList.remove('animate_down_to_black')
            }
            if (f.classList.contains('animate_up_to_white')){
                f.classList.remove('animate_up_to_white')
            }
            if (f.classList.contains('animate_down_to_white')){
                f.classList.remove('animate_down_to_white')
            }
            if (f.classList.contains('animate_up_to_gone')){
                f.classList.remove('animate_up_to_gone')
            }
            if (f.classList.contains('animate_down_to_gone')){
                f.classList.remove('animate_down_to_gone')
            }
        })
    }, 280)
    setTimeout(()=>{timeout = false}, 500)    
})  

goToEnd = () =>{
    document.getElementById('fcontainer').classList.add('animate_up_to_gone')
    document.getElementById('age').classList.add('animate_up_to_gone')
    document.getElementById('end_button').classList.add('animate_up_to_gone')
    scrollPlacement = 14;
    counter = 14;
    age = 26;
    draw(points, true)
}

let fullLinks = document.getElementsByClassName('main_link')
console.log(fullLinks)

let linkCounter = 0

document.getElementById('end_button').classList.add('no_opacity')
