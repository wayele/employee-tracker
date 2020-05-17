require('dotenv').config();
const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");


var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: process.env.DB_PASSWORD,
    database: "employee_tracker_DB"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    startPrompt();
});

function startPrompt() {
    inquirer.prompt({
        name: "choice",
        type: "list",
        message: "What would you like to do?",
        choices: [
            "View All Employees",
            "View All Employees by Department",
            "View All Roles",
            "View All Departments",
            "Add Employee",
            "Add a Role",
            "Add a Department",
            "Update Employee Role",
            "Remove an Employee",
            "Remove a Department",
            "Remove a Role",
            "View All Employees by Manager",
            "Update Employee Manager",
            "Quit"
        ]
    })
        .then(function (answer) {
            switch (answer.choice) {
                case "View All Employees":
                    allEmployees();
                    break;
                case "View All Employees by Department":
                    employeeByDept();
                    break;
                case "View All Roles":
                    allRoles();
                    break;
                case "View All Departments":
                    allDepts();
                    break;
                case "Add Employee":
                    addEmployee();
                    break;
                case "Add a Role":
                    addRole();
                    break;
                case "Add a Department":
                    addDept();
                    break;
                case "Update Employee Role":
                    updateEmpRole();
                    break;
                case "Remove an Employee":
                    removeEmployee();
                    break;
                case "Remove a Deparment":
                    removeDept();
                    break;
                case "Remove a Role":
                    removeRole();
                    break;
                case "View All Employees by Manager":
                    allEmpsByManager();
                    break;
                case "Update Employee Manager":
                    updateEmpManager();
                    break;
                case "Quit":
                    quit();
                    break;
            }
        });
};
function allEmployees() {
    const query = "SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name AS departmentName FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id;";
    connection.query(query, (err, res) => {
        if (err) { throw err };
        console.table(res);
        // connection.end();
    });
    startPrompt();
};