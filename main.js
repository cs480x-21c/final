"use strict";

const EXAMPLE_COURSE = {
    "title":"ELEMENTARY ARABIC I",
    "department_code":"AB",
    "code":"1531",
    "description":"Cat. I An intensive course to introduce the Arabic language to students with no background in Arabic. Oral language acquisition will stress structures and vocabulary required for basic communicative tasks. Emphasis will be on grammar, vocabulary, and writing system. Cultural aspects of Arabic-speaking countries introduced through course material. This course is closed to native speakers of Arabic and heritage speakers except with written permission from the instructor.",
    "credits":"2.000 OR 3.000 Credit hours",
    "levels":"Undergraduate, Graduate",
    "types":"Lecture, Web",
    "department_title":"Humanities and Arts Department",
    "attributes":"Humanities and Arts"
}

let courses = []; // Array of all courses, following object specified above
let currCourses = []; // Array of currently slotted in courses
const currCoursesUpdated = new Event('course');

// loadCourses() loads all WPI courses from a JSON file
function loadCourses() {
    return fetch("courses.json")
        .then(response => response.json())
        .then(data => {
           courses = data["courses"];
        })
}

// initTreemap() sets up the tree map
function initTreeMap() {

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

        courseSection.selectAll("div")
            .data(depCourses)
            .enter()
            .append("div")
            .attr("class", "mdc-card mdc-card__primary-action")
            .on("click", (e, d) => {
                console.log(d);
            })
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

// main() is run when the body of the page loads
function main() {
    loadCourses().then(d => {
        initTreeMap();
        initCourseCatalog();
        initStatistics();
        mdc.autoInit();
    });
}