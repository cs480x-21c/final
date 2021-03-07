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
    let courses = [{ department: "CS" }, { department: "MA" }, { department: "CS" }, { department: "IMGD" }];
    let departments = new Set(courses.map(course => course.department));

    console.log(departments);

    d3.select("#departmentsNav")
        .selectAll("span")
        .data(departments)
        .enter()
        .append("span")
        .text(d => d);

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
}