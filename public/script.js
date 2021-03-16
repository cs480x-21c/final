let margin = {top: 50, bottom: 50, left: (window.innerWidth-1000)/2, right: 50}, height = 600, width = 1000
let tooltip = d3.select('#tooltip')
console.log(d3)
let the_map = d3.select('#usMap')
    .attr('width', width)
    .attr('height', height)
    .attr('transform', 'translate('+margin.left+','+margin.top+')')
    .append('g')
let deathStats = d3.select('#deathStats')
    .attr('width', width)
    .attr('height', height)
    .attr('transform', 'translate('+margin.left+','+margin.top+')')
    .append('g')
let positiveStats = d3.select('#positiveStats')
    .attr('width', width)
    .attr('height', height)
    .attr('transform', 'translate('+margin.left+','+margin.top+')')
    .append('g')
let colors = d3.interpolateReds

let projection = d3.geoAlbersUsa()
    .translate([width/2, height/2])
    .scale(850)

let stateMatchUp = {1:'AL', 2:'AK', 4:'AZ', 5:'AR', 6:'CA', 8:'CO', 9:'CT',
    10:'DE', 11:'DC', 12:'FL', 13:'GA', 15:'HI', 16:'ID', 17:'IL', 18:'IN',
    19:'IA', 20:'KS', 21:'KY', 22:'LA', 23:'ME', 24:'MD', 25:'MA', 26:'MI',
    27:'MN', 28:'MS', 29:'MO', 30:'MT', 31:'NE', 32:'NV', 33:'NH', 34:'NJ',
    35:'NM', 36:'NY', 37:'NC', 38:'ND', 39:'OH', 40:'OK', 41:'OR', 42:'PA',
    44:'RI', 45:'SC', 46:'SD', 47:'TN', 48:'TX', 49:'UT', 50:'VT', 51:'VA',
    53:'WA', 54:'WV', 55:'WI', 56:'WY'}


// console.log('35: ',values)

let states

let path = d3.geoPath()
    .projection(projection)


d3.json('us.json', function(error, data) {
        if (error) {
            console.log(error)
        } else {
            states = topojson.feature(data, data.objects.states).features
            console.log(states)
            the_map.selectAll('.state')
                .data(states)
                .enter()
                .append('path')
                .attr('class', 'state')
                .attr('d', path)
                .on('click', function(d, i) {
                    console.log(states[i].id)
                    fetch("/postStateId", {
                        method: "POST",
                        body: JSON.stringify({
                            stateId: states[i].id
                        }),
                        headers: {
                            "Content-Type": "application/json"
                        }
                    })
                        .then(response => response.json())
                        .then(response => {
                            console.log("sent");
                            uid = response
                            console.log(response)
                        })
                })
        }
        console.log(data)
    })

function selectThis(id){
    document.getElementById("checkDeath").checked = false
    document.getElementById("checkPositive").checked = false

    document.getElementById(id).checked = true;
    fetch("/postType", {
        method: "POST",
        body: JSON.stringify({
            chartType: id
        }),
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then(response => response.json())
        .then(response => {
            console.log("sent");
            uid = response
            console.log(response)
        })
}

function redirectPage(){
    window.location.href="/redirectPage"
}

let stateId
let chartType
let rawCsvArr
let revisedCsvData
let keys = Object.keys(stateMatchUp);
let val = ''
let finalCsv = []
let index = '01'
let total = 0
let count = 1
function getIdTypeCsv(){
    fetch("/getIdTypeCsv", {
        method: "Get",
    })
        .then(response => response.json())
        .then(response => {
            stateId = response.stateId
            chartType = response.chartType
            rawCsvArr = response.rawCsv
            console.log('script stateId: '+stateId)
            console.log('script chartType: '+chartType)
            revisedCsvData = []



            for (let i = 0; i < keys.length; i++) {
                if (parseInt(keys[i]) === parseInt(stateId)){
                    val = stateMatchUp[keys[i]]
                }
            }
            console.log('stateId: ',stateId)
            console.log('val: ', val)
            for (let i = 0; i < rawCsvArr.length; i++){
                if (rawCsvArr[i][1] === String(val)){
                    let csvItem = []
                    csvItem.push((rawCsvArr[i][0].split('-'))[1])
                    csvItem.push(rawCsvArr[i][1])
                    // console.log('total: '+rawCsvArr[i][19])
                    if (chartType === 'checkPositive') {
                        csvItem.push(rawCsvArr[i][19])
                    }
                    // console.log('item: ',csvItem)
                    revisedCsvData.push(csvItem)
                }
            }
            revisedCsvData.sort((a, b) => parseInt(a[0]) - parseInt(b[0]))


            for (let i = 0; i < revisedCsvData.length-1; i++){
                if (revisedCsvData[i+1][0] !== index || i === revisedCsvData.length-2){
                    if (revisedCsvData[i][2] === ''){
                        total += 0
                    }
                    else {
                        total += parseInt(revisedCsvData[i][2])
                    }
                    let item = []
                    item.push(index)
                    item.push(revisedCsvData[i][1])
                    item.push(total)
                    finalCsv.push(item)
                    index = String(parseInt(index)+1)
                    if (index.length < 2){
                        index = '0'+index
                    }
                }
                else {
                    if (revisedCsvData[i][2] === ''){
                        total += 0
                    }
                    else {
                        total += parseInt(revisedCsvData[i][2])
                    }
                }
            }

            for (let i = 0; i < finalCsv.length; i++) {
                console.log('final: ' + finalCsv[i])
            }

            if (chartType === 'checkDeath'){
                console.log('hello, checkDeath')
            }
            else if (chartType === 'checkPositive'){
                console.log('hello, checkPositive')
                drawPositivePie()
            }
        })
}

let values = []
let piekeys = []
let monthArr = {0:'Jan', 1:'Feb', 2:'Mar', 3:'Apr', 4:'May', 5:'June', 6:'July', 7:'Aug', 8:'Sep',
9:'Oct', 10:'Nov', 11:'Dec'}
// let monthkeys = Object.keys(monthArr);
function drawPositivePie(){
    let pieData = d3.pie()
        .sort(null)
        .value(function(d) {
            let value = d[2]
            values.push(value)
            let key = d[0]
            piekeys.push(key)
            return value
        })(finalCsv)

    console.log('pie data: ',pieData)

    let segments = d3.arc().innerRadius(0).outerRadius(250).padAngle(0.05).padRadius(50)

    positiveStats.append('g')
        .attr('transform', 'translate(500, 300)')
        .selectAll('path')
        .data(pieData)
        .enter()
        .append('path')
        .attr('d', segments)
        .attr('class', 'pieState')
        .attr('pieStateName', function (d, i){
            return piekeys[i]
        })
        .attr('fill', function (d, i){

            let start = Math.min.apply(null, values)
            let end = Math.max.apply(null, values)
            let interval = (end-start)/12

            return colors((values[i]-start)*0.083/interval)
        })
        .on('mouseover', function (d, i){
            positiveStats.append('g')
                .append("text")
                .attr('x', '650px')
                .attr('y', '550px')
                .attr('id', 'tooltip')
                .text('# of People tested positive: '+values[i])
        })
        .on('mouseout', function (d, i){
            positiveStats.select('#tooltip').remove()
        })

    positiveStats
        .selectAll('mySlices')
        .data(pieData)
        .enter()
        .append('text')
        .text(function(d, i) {
            if (i < 3){
                return '2021 '+monthArr[i]
            }
            else return '2020 '+monthArr[i]
        })
        .attr("transform", function(d) {
            let x = 2.3*segments.centroid(d)[0]+500
            let y = 2.3*segments.centroid(d)[1]+300
            return "translate(" +x+','+y  + ")";
        })
        .style("text-anchor", "middle")
        .style("font-size", 16)
        .style('fill', function(d,i){
            let start = Math.min.apply(null, values)
            let end = Math.max.apply(null, values)
            let interval = (end-start)/12

            return colors((values[i]-start)*0.083/interval)
        })


}




