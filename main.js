const EXAMPLE_COURSE = {
    // Department code (CS for Computer Science)
    department: "CS",
    // ID of course (this is a string b/c it could be something like ###x)
    id: "1101",
    // Description from course catalog
    description: "This course introduces principles of computation and programming with an emphasis on program design. Topics include the design, implementation and testing of programs that use a variety of data structures (such as structures, lists, and trees), functions, conditionals, recursion and higher-­‐order functions. Students will be expected to design simple data models, and implement and debug programs in a functional programming language.",
    // Recommended background (prereqgs / equivalent knowledge)
    background: "None",
    // List of courses which this course cannot be taken for credit along with (e.g., cannot receive credit for BOTH 1101 and 1102)
    exclusive_credit_with: [
        "1102"
    ]
}

let courses = []; // Array of all courses, following object specified above
let currCourses = []; // Array of currently slotted in courses

// loadCourses() loads all WPI courses from a JSON file
function loadCourses() {

}

// initTreemap() sets up the tree map
function initTreeMap() {

}

// initCourseCatalog() sets up the course catalog
function initCourseCatalog() {

    // Will remove variable when loadCourses() is implmented
    let courses = [{ department: "CS", id: "2102" }, { department: "CS", id: "2102" }, { department: "CS", id: "2102" }, { department: "CS", id: "2102" }, { department: "CS", id: "2102" }, { department: "CS", id: "2102" }, { department: "CS", id: "2102" }, { department: "CS", id: "2102" }, { department: "CS", id: "2102" }, { department: "CS", id: "2102" }, { department: "CS", id: "2102" }, { department: "CS", id: "2102" }, { department: "CS", id: "2102" }, { department: "CS", id: "2102" }, { department: "CS", id: "2102" }, { department: "CS", id: "2102" }, { department: "CS", id: "2102" }, { department: "CS", id: "2102" }, { department: "CS", id: "2102" }, { department: "CS", id: "2102" }, { department: "CS", id: "2102" }, { department: "CS", id: "2102" }, { department: "CS", id: "2102" }, { department: "CS", id: "2102" }, { department: "CS", id: "2102" },
        { department: "MA", id: "2100" }, { department: "CS", id: "1101" }, { department: "IMGD", id: "1001" }
    ];
    let departments = new Set(courses.map(course => course.department));


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
        let depCourses = courses.filter(c => c.department === department);

        if (depCourses.length < 1) {
            return;
        }

        const courseSectgion = d3.select("#coursesSection");

        courseSectgion.selectAll("div")
            .remove();

        courseSectgion.selectAll("div")
            .data(depCourses)
            .enter()
            .append("div")
            .attr("class", "mdc-card mdc-card__primary-action")
            .on("click", (e, d) => {
                console.log(d);
            })
            .append("h4")
            .text(d => d.id);

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
    loadCourses();

    initTreeMap();
    initCourseCatalog();
    initStatistics();
    mdc.autoInit();
}