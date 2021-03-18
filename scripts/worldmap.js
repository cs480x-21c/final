
// Constants
var windowWidth = window.innerWidth;
var windowHeight = window.innerHeight * (0.6);
var width = windowWidth;
var height = windowHeight - 90;
const scale = 300;
const margin = {top: 0, right: 0, bottom: 0, left: 0},
    svgWidth = width - margin.left - margin.right,
    svgHeight = height - margin.top - margin.bottom;

const astronautColorDefault = "#FFFFFF";
const astronautColorOutline = "#34a8eb"
const astronautColorClicked = "#a700cc"
const countryColorDefault = "#000000";

const zoomOutLimit = 1;
const zoomInLimit = 18;

var mapSvg;

// Map projection transform
const gMapProjection = d3.geoCylindricalStereographic()
    .translate([150, 200])
    .scale(scale);

// Map SVG transform (changes often)
var gTransform;
var zoomTransform = {x: 0, y: 0};

var gAstronautCities;
var gCurrentAstronauts = [];



/**
 * The function which creates the worldmap from the geo.json file.
 *
 * @param geoData
*/
function makeWorldMap(countries, astronautCities)
{


    gAstronautCities = astronautCities;



    mapSvg = d3.select("#map")
    .append("svg")
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", "0 0 "+ svgWidth +" "+ svgHeight +"")
        .classed("svg-content-responsive", true)

    const geoPath = d3.geoPath()
        .projection(gMapProjection)


    mapSvg.selectAll('path')
        .data(countries.features)
        .enter()
        .append('path')
            .attr('id', function(d) {return d.properties.Name})
            .attr('d', function(d){return geoPath(d)})
            .attr('stroke-width', 1)
            .attr('stroke', '#FFFFFF')
            .attr('fill', countryColorDefault);

    // This path drawing algorithm will NOT draw cities twice
    // It will also just not draw some cities, which is bs
    // So doing it this way
    for (let i in astronautCities.features)
    {
        let coordinates = gMapProjection([astronautCities.features[i].geometry.coordinates[0], astronautCities.features[i].geometry.coordinates[1]]);
        mapSvg.append('circle')
            .attr('id', () => {return "A" + astronautCities.features[i].properties.ID})
            .attr('cx', () => {return coordinates[0]})
            .attr('cy', () => {return coordinates[1]})
            .attr('r', 5)
            .attr('stroke-width', 1)
            .attr('stroke', astronautColorOutline)
            .attr('class', "astronautCity")
            .attr('fill', astronautColorDefault)
            .attr('opacity', 0.8)
            .on('mouseover', () => 
            {
                let cx = parseFloat(d3.select('#' + "A" + astronautCities.features[i].properties.ID).attr("cx"));
                let cy = parseFloat(d3.select('#' + "A" + astronautCities.features[i].properties.ID).attr("cy"));
                let dx = (cx + (100/(gTransform.k * 2)));
                let dy = (cy + (100/(gTransform.k * 2)));

                let rwx = 600/(gTransform.k);
                let rhx = 40/gTransform.k;
                
                let tdx = 2/(gTransform.k);
                let tdy = 15/(gTransform.k / 2);
                let textSize = Math.floor(10/(gTransform.k / 2)).toString();

                // Get rid of previous annotation
                mapSvg.selectAll("#annotation").remove();
                
                // line to text
                mapSvg.append('line')
                    .attr('id', 'annotation')
                    .attr('x1', cx)
                    .attr('y1', cy)
                    .attr('x2', dx)
                    .attr('y2', dy)
                    .attr('stroke-width', 1)
                    .attr('stroke', '#FFFFFF')
                
                // box for annotation 
                mapSvg.append('rect')
                    .attr('id', 'annotation')
                    .attr('x', dx)
                    .attr('y', dy)
                    .attr('width', rwx)
                    .attr('height', rhx)
                    .attr('fill', '#FFFFFF')
                    .text(astronautCities.features[i].properties.Name)

                // text
                mapSvg.append('text')
                    .attr('id', 'annotation')
                    .attr('x', dx + tdx)
                    .attr('y', dy + tdy)
                    .style('font', 'bold ' + textSize +'px sans-serif')
                    .style('fill', '#000000')
                    .text(astronautCities.features[i].properties.Name + ", " +
                        "Born in: " + astronautCities.features[i].properties["Birth Place"]
                    );

                

                let e = {transform: gTransform}
                zoomed(e);
            });
    }

    // Zoom on map
    var mapZoom = d3.zoom()
        .on('zoom', zoomed);

    var zoomSettings = d3.zoomIdentity
        .translate(width/3, height/2)
        .scale(zoomOutLimit);

    mapSvg.call(mapZoom)
        .call(mapZoom.transform, zoomSettings);

    function zoomed(e)
    {
        //console.log(e.transform.k);
        console.log(zoomTransform.x)
        if (e.transform.k < zoomOutLimit) {
            e.transform.k = zoomOutLimit;
            e.transform.x = zoomTransform.x;
            e.transform.y = zoomTransform.y;
        }
        
        else if (e.transform.k > zoomInLimit) {
            e.transform.k = zoomInLimit;
            e.transform.x = zoomTransform.x;
            e.transform.y = zoomTransform.y;
        }
        else{
            mapSvg.selectAll('*').attr('transform', e.transform);

            mapSvg.selectAll('circle').attr('transform', (e.transform))
                .attr('r', 5/(e.transform.k / 2))
                .attr('stroke-width', 1/(e.transform.k / 2));
        }
        zoomTransform.x = e.transform.x;
        zoomTransform.y = e.transform.y;
        gTransform = e.transform;
    }

    // Cluster selection
    mapSvg.on("click", function(e)
    {
        // Scale the offset by the transformed svg size
        var element = document.querySelector('#map');
        var scaleX = svgWidth / element.offsetWidth;
        var scaleY = svgHeight / element.offsetHeight;

        // Invert the svg coordiantes to map coordinates
        let mapCoordinate = gTransform.invert([e.offsetX * scaleX, e.offsetY * scaleY]);

        // Invert the map coordinates to feature space
        let featureCoordinate = gMapProjection.invert(mapCoordinate);

        // erase previous selection
        gCurrentAstronauts = [];

        d3.selectAll(".astronautCity")
            .attr("fill", astronautColorDefault)
            .attr('stroke', astronautColorOutline);

        // Hard to change, since it's non-linear, go the current one through trying a few points

        let searchRadius = getRadiusTransform(gTransform.k);

        let currentAstronauts = [];

        // Select all circles within the radius
        for (let i = 0; i < gAstronautCities.features.length; i++)
        {
            if (geoContains(gAstronautCities.features[i].geometry.coordinates, featureCoordinate, searchRadius))
            {
                currentAstronauts.push(gAstronautCities.features[i].properties);

                d3.select("#" + "A" + gAstronautCities.features[i].properties.ID)
                    .attr("fill", astronautColorClicked)
                    .attr('stroke', astronautColorClicked);
            }
        }

        GetLinks(currentAstronauts);
    });
}

// Because d3's expects an exact coordinate and doesn't let me put in a proximity
// So had to make my own version
function geoContains(featureCoordinate, coordinate, radius)
{
    // https://stackoverflow.com/questions/481144/equation-for-testing-if-a-point-is-inside-a-circle
    // pythagorus method
    return ((Math.pow(featureCoordinate[0] - coordinate[0], 2)
    + Math.pow(featureCoordinate[1] - coordinate[1], 2)) < Math.pow(radius, 2))
}

/**
 * Radius transform function, Non-linear
 * @param {} k zoom level
 * @returns the transformed radius size
 */
function getRadiusTransform(k)
{
    // Zoom out max: 3
    // Zoom in max: ~1.4
    // k: 1 -> inf
    return 2.4/(k + 1) + 1.4;
}
