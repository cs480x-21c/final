let margin = {top: 50, bottom: 50, left: (window.innerWidth-1000)/2, right: 50}, height = 600, width = 1000
let tooltip = d3.select('#tooltip')
let perArea = d3.select('#perArea')
console.log(d3)
let the_map = d3.select('#usMap')
    .attr('width', width)
    .attr('height', height)
    .attr('transform', 'translate('+margin.left+','+margin.top+')')
    .append('g')

let positiveStats = d3.select('#positiveStats')
    .attr('width', width)
    .attr('height', height)
    .attr('transform', 'translate('+margin.left+','+margin.top+')')
    .append('g')

let positiveStatsLine = d3.select('#positiveStatsLine')
    .attr('width', window.innerWidth-100)
    .attr('height', height)
    .attr('transform', 'translate(50'+','+margin.top+')')
    .append('g')
// perArea.attr('transform', 'translate('+String(margin.left-20)+','+margin.top+')')
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

let rawCsvArr

let totalDeath

let thisState

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
                .attr('stroke-width', 0.5)
                .on('click', function(d, i) {
                    console.log(states[i].id)
                    fetch("/postStateId", {
                        method: "POST",
                        body: JSON.stringify({
                            stateId: states[i].id,
                            hello:'hello'
                        }),
                        headers: {
                            "Content-Type": "application/json"
                        }
                    })
                        .then(response => response.json())
                        .then(response => {
                            console.log("sent");
                            // uid = response
                            console.log(response)
                        })
                })

            fetch("/getCsv", {
                method: "Get",
            })
                .then(response => response.json())
                .then(response => {
                    let deathArr = []
                    rawCsvArr = response.rawCsv
                    the_map.selectAll('.state')
                        .attr('fill', function (d, i){
                            thisState = ''
                            totalDeath = 0
                            // console.log(d)
                            if (d.id !== 72 && d.id !== 78){
                                thisState = stateMatchUp[d.id]
                                for (let j = 0; j < rawCsvArr.length; j++){
                                    if (thisState === rawCsvArr[j][1]
                                        && rawCsvArr[j][0] === '2021-03-07'){
                                        totalDeath = parseInt(rawCsvArr[j][2])
                                        deathArr.push(totalDeath)
                                    }
                                }
                            }
                            // deathArr.sort((a, b) => a - b)
                            // console.log(deathArr)
                            let start = 208
                            let end = 54124
                            let interval = (end-start)/6

                            return colors((totalDeath-start)*0.1167/interval+0.3)
                        })
                    // console.log('arr',rawCsvArr)
                })
        }
        console.log(data)
    })

function selectThis(id){
    document.getElementById("checkDeath").checked = false
    document.getElementById("checkPositive").checked = false
    document.getElementById("checkAirport").checked = false

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

function colorselectThis(id){
    document.getElementById("colorTotal").checked = false
    document.getElementById("colorPerPpl").checked = false
    document.getElementById(id).checked = true;
    thisState = ''
    totalDeath = 0
    if (document.getElementById("colorTotal").checked == true) {
        the_map.selectAll('.state')
            .attr('fill', function (d, i) {
                // console.log(d)
                if (d.id !== 72 && d.id !== 78) {
                    thisState = stateMatchUp[d.id]
                    for (let j = 0; j < rawCsvArr.length; j++) {
                        if (thisState === rawCsvArr[j][1]
                            && rawCsvArr[j][0] === '2021-03-07') {
                            totalDeath = parseInt(rawCsvArr[j][2])
                            // deathArr.push(totalDeath)
                        }
                    }
                }
                // deathArr.sort((a, b) => a - b)
                // console.log(deathArr)
                let start = 208
                let end = 54124
                let interval = (end - start) / 6

                return colors((totalDeath - start) * 0.1167 / interval + 0.3)
            })
    }
    else {
        // let tmp = []
        // console.log('switch')
        let rawPplArr = []
        totalDeath = 0
        let average
        fetch("/getPopulationCsv", {
            method: "Get",
        })
            .then(response => response.json())
            .then(response => {
                rawPplArr = response.rawPopulationCsv
                // console.log(rawPplArr)
                the_map.selectAll('.state')
                    .attr('fill', function (d, i) {
                        // console.log(d.id)
                        if (d.id !== 72 && d.id !== 78) {
                            thisState = stateMatchUp[d.id]
                            // console.log(thisState)
                            for (let j = 0; j < rawCsvArr.length; j++) {
                                if (thisState === rawCsvArr[j][1]
                                    && rawCsvArr[j][0] === '2021-03-07') {
                                    totalDeath = parseInt(rawCsvArr[j][2])
                                    // console.log(totalDeath)
                                    // deathArr.push(totalDeath)
                                }
                            }
                            for (let j = 0; j < rawPplArr.length; j++) {
                                if (thisState === rawPplArr[j][0]
                                    && rawPplArr[j][1] === 'total' && rawPplArr[j][2] === '2013') {
                                    // console.log(thisState)
                                    average = (totalDeath/parseInt(rawPplArr[j][3])*1000).toFixed(2)
                                    // tmp.push(average)
                                    // console.log(average)
                                    // deathArr.push(totalDeath)
                                }
                            }
                        }
                        // console.log(tmp.sort((a, b) => a - b))
                        // console.log(deathArr)
                        let start = 0.32
                        let end = 2.65
                        let interval = (end - start) / 6

                        return colors((average - start) * 0.1167 / interval + 0.3)
                    })
            })

    }
}

function redirectPage(){
    window.location.href="/redirectPage"
}

let stateId
let chartType
let revisedCsvData
let keys = Object.keys(stateMatchUp);
let val = ''
let finalCsv = []
let index = '01'
let total = 0
let count = 1
function getIdTypeCsv(){
    total = 0
    index = '01'
    finalCsv = []
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
                        csvItem.push(rawCsvArr[i][21])
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

            if (chartType === 'checkPositive'){
                console.log('hello, checkPositive')
                drawPositivePie()
                drawPositiveLine()
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
                .attr('x', '730px')
                .attr('y', '550px')
                .attr('id', 'tooltip')
                .text('# of Positive Increase: '+values[i])
                .attr('fill', 'yellow')
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

function drawPositiveLine(){
    let csvArr1 = finalCsv.slice(0, 3)
    let csvArr2 = finalCsv.slice(3, 12)
    let csvBar = csvArr2.concat(csvArr1)
    console.log('csv bar: ', csvBar)
    let maxDeath = (finalCsv.sort((a, b) => parseInt(a[2]) - parseInt(b[2])))[11][2]
    let minDeath = (finalCsv.sort((a, b) => parseInt(a[2]) - parseInt(b[2])))[0][2]
    let orderedArr = [3,4,5,6,7,8,9,10,11,0,1,2]
    // console.log('max death value: ',maxDeath)

    let yScale = d3.scaleLinear()
        .domain([0, maxDeath])
        .range([550, 50])
    let xScale = d3.scaleBand()
        .domain(orderedArr.map(function (d){
            if (d < 3) {
                return '2021 '+monthArr[d]
            }
            return '2020 '+monthArr[d]
        }))
        .range([0, window.innerWidth-300])
    let yAxis = positiveStatsLine.append('g')
        .classed('yAxis', true)
        .attr('transform', 'translate(100, 0)')
        .call(d3.axisLeft(yScale))
    let xAxis = positiveStatsLine.append('g')
        .classed('xAxis', true)
        .attr('transform', 'translate(100, 550)')
        .call(d3.axisBottom(xScale))

    let rectGrp = positiveStatsLine.append('g')
        .attr('transform', 'translate(100, 50)')

    rectGrp.selectAll('rect')
        .data(csvBar)
        .enter()
        .append('rect')
        .attr('width', xScale.bandwidth())
        .attr('height', function (d, i){
            return 500-yScale(d[2])
            // return 50
        })
        .attr('x', function (d, i){
            // console.log('x: ',d[0])
            if (parseInt(d[0]) < 4) {
                return xScale('2021 '+monthArr[parseInt(d[0]) - 1])
            }
            else {
                return xScale('2020 '+monthArr[parseInt(d[0]) - 1])
            }
        })
        .attr('y', function (d, i){
            return yScale(parseInt(d[2]))
        })
        .attr('fill', function (d, i){
            let interval = (maxDeath-minDeath)/12
            return colors((parseInt(d[2])-minDeath)*0.083/interval)
        })

    positiveStatsLine.selectAll('rect')
        .on('mouseover', function (d, i){
            positiveStatsLine.append('g')
                .append("text")
                .attr('x', window.innerWidth-370)
                .attr('y', '50px')
                .attr('id', 'tooltip2')
                .text('# of Positive Increase: '+d[2])
                .attr('fill', 'yellow')
        })
        .on('mouseout', function (d, i){
            positiveStatsLine.select('#tooltip2').remove()
        })



}



