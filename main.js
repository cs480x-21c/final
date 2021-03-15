"use strict";

const EXAMPLE_COURSE = {
    "title": "ELEMENTARY ARABIC I",
    "department_code": "AB",
    "code": "1531",
    "description": "Cat. I An intensive course to introduce the Arabic language to students with no background in Arabic. Oral language acquisition will stress structures and vocabulary required for basic communicative tasks. Emphasis will be on grammar, vocabulary, and writing system. Cultural aspects of Arabic-speaking countries introduced through course material. This course is closed to native speakers of Arabic and heritage speakers except with written permission from the instructor.",
    "credits": "2.000 OR 3.000 Credit hours",
    "levels": "Undergraduate, Graduate",
    "types": "Lecture, Web",
    "department_title": "Humanities and Arts Department",
    "attributes": "Humanities and Arts"
}

const BANNER_CRAWLER_TRIGGER_URL = "https://us-east4-ageless-accord-307519.cloudfunctions.net/bannerCrawler";

let courses = []; // Array of all courses, following object specified above
let currCourses = []; // Array of currently slotted in courses
const currCoursesUpdated = new Event('course');

const TREEMAP_MARGINS = {TOP: 10, RIGHT: 10, BOTTOM: 10, LEFT: 10};

let trackingCategories = []; // Array of all CS tracking sheet areas

let snackbar;

// loadData() loads all WPI courses & info on the CS tracking sheet from JSON files
function loadData() {
    let p0 = fetch("courses.json")
        .then(response => response.json())
        .then(data => {
            courses = data["courses"];
        });

    let p1 = fetch("cstracking.json")
        .then(response => response.json())
        .then(data => {
            trackingCategories = data["categories"];
        });

    return Promise.all([p0, p1]);
}

// drawTreeMap() draws the tree map
function drawTreeMap() {
    // Remove SVG if it already exists
    let container = document.getElementById("treeContainer");
    if (container.firstChild) {
        container.removeChild(container.firstChild);
    }

    // Calculate width and height
    let width = container.clientWidth - TREEMAP_MARGINS.LEFT - TREEMAP_MARGINS.RIGHT;
    let height = container.clientHeight - TREEMAP_MARGINS.TOP - TREEMAP_MARGINS.BOTTOM;

    // Slap down the svg
    let svg = d3.select("#treeContainer")
        .append("svg")
        .attr("width", width + TREEMAP_MARGINS.LEFT + TREEMAP_MARGINS.RIGHT)
        .attr("height", height + TREEMAP_MARGINS.TOP + TREEMAP_MARGINS.BOTTOM)
        .append("g")
        .attr("transform",
            "translate(" + TREEMAP_MARGINS.LEFT + "," + TREEMAP_MARGINS.TOP + ")");

    // Manipulate data to work with treemap
    let catData = [{"name": "root", "parent": null, "value": null}];
    trackingCategories.forEach(val => {
        catData.push({"name": val.name, "parent": "root", "value": val.value});
    });

    // Transform data to be used in tree map
    let root = d3.stratify()
        .id(d => d.name)
        .parentId(d => d.parent)
        (catData);

    // Sum values to determine root leaf size
    root.sum(d => d.value);

    // Calculate tree map leaves
    d3.treemap()
        .size([width, height])
        .padding(4)
        (root);

    // Add rectangles to tree map
    svg.selectAll("g")
        .data(root.leaves())
        .enter()
        .append("rect")
        .attr("x", d => d.x0)
        .attr("y", d => d.y0)
        .attr("width", d => d.x1 - d.x0)
        .attr("height", d => d.y1 - d.y0)
        .style("stroke", "black")
        .style("fill", "none");

    // Add text labels to tree map
    svg.selectAll("g")
        .data(root.leaves())
        .enter()
        .append("text")
        .attr("x", d => (d.x0 + d.x1) / 2)
        .attr("y", d => (d.y0 + d.y1) / 2)
        .attr("text-anchor", "middle")
        .text(d => d.data.name);
}

// initCourseCatalog() sets up the course catalog
function initCourseCatalog() {
    let departments = new Set(courses.map(course => course.department_code));

    const nav = d3.select("#departmentsNav");

    nav.selectAll("li")
        .data(departments)
        .enter()
        .append("li")
        // .attr("class", "mdc-list-item")
        .attr("class", (d, i) => "mdc-list-item" + (i === 0 ? " mdc-list-item--selected" : ""))
        .attr("aria-selected", (d, i) => i === 0 ? true : false)
        .attr("role", "option")
        .attr("tabindex", (d, i) => i === 0 ? 0 : "-1")
        .append("span")
        .attr("class", "mdc-list-item__text")
        .text(d => d);

    nav.selectAll("li")
        .append("span")
        .attr("class", "mdc-list-item__ripple");

    const loadCourses = (department) => {
        let depCourses = courses.filter(c => c.department_code === department);

        if (depCourses.length < 1) {
            return;
        }

        const courseSection = d3.select("#coursesSection");

        courseSection.selectAll("div")
            .remove();

        const drag = d3.drag()
            .on("start", function (e) {
                d3.select(this)
                    .style("opacity", 0.3)
                    .style("position", "absolute");
            })
            .on("drag", function (e) {
                d3.select(this)
                    .style("z-index", 100)
                    .style("top", `${e.y + 15}px`)
                    .style("left", `${e.x - 15}px`)
            })
            .on("end", function (e) {

                d3.select(this)
                    .style("opacity", 1)
                    .style("position", "unset")
                    .style("top", '0')
                    .style("left", '0');
                let inTree = e.sourceEvent.path
                    .findIndex(el => el.id === "treeContainer") > -1;

                if (inTree) {
                    currCourses.push(e.subject);
                    console.log(currCourses);
                    // Reloading Tree Map Here
                    drawTreeMap();
                }
            });

        courseSection.selectAll("div")
            .data(depCourses)
            .enter()
            .append("div")
            .attr("class", "mdc-card mdc-card__primary-action")
            .call(drag)
            .append("h4")
            .text(d => d.code);

    };

    loadCourses(departments.values().next().value);

    nav.selectAll("li")
        .on("click", e => {
            let dep = e.target.innerText;
            loadCourses(dep);
        });

    mdc.list.MDCList.attachTo(nav.node());
}

// initStatistics() sets up the statistics view
function initStatistics() {

}

// populateCoursesFromBanner() populates currently slotted in courses from Banner
function populateCoursesFromBanner() {
    // Disable import button
    document.getElementById("import").disabled = true;

    // Show snackbar saying we are importing
    snackbar.labelText = "Importing from Banner...";
    snackbar.open();

    let user = document.getElementById("userIn").value;
    let pass = document.getElementById("passIn").value;

    let content = {
        "sid": user,
        "PIN": pass
    };

    fetch(BANNER_CRAWLER_TRIGGER_URL, {
        method: "POST",
        body: JSON.stringify(content),
        headers: {
            "Content-Type": "application/json"
        }
    }).then(data => data.json()).then(bannerCourses => {
        document.getElementById("import").disabled = false;

        // Crummy quadratic code
        currCourses = [];
        bannerCourses.forEach(transcriptCourse => {
            for (let i = 0; i < courses.length; i++) {
                let course = courses[i];
                if ((course["department_code"] === transcriptCourse.dep) && (course.code === transcriptCourse.code)) {
                    currCourses.push(course);
                    break;
                }
            }
        })

        snackbar.labelText = currCourses.length + " courses imported from Banner";
        snackbar.open();
    }).catch(e => {
        console.log(e);
        snackbar.labelText = "Failed to import from Banner";
        snackbar.open();
    });
}

// main() is run when the body of the page loads
function main() {
    loadData().then(d => {
        drawTreeMap();
        initCourseCatalog();
        initStatistics();
        mdc.autoInit();
    });

    // Initialize snackbar
    snackbar = new mdc.snackbar.MDCSnackbar(document.querySelector('.mdc-snackbar'));

    // Set up callback for button to import courses from Banner
    document.getElementById("import").onclick = populateCoursesFromBanner;
    document.getElementById("userIn").onkeypress = (e) => {
        if (e.code === "Enter") {
            document.getElementById("passIn").focus();
        }
    }
    document.getElementById("passIn").onkeypress = (e) => {
        if (e.code === "Enter") {
            e.target.blur();
            populateCoursesFromBanner();
        }
    }
}