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
            // "Remove an Employee",
            // "Remove a Department",
            // "Remove a Role",
            // "View All Employees by Manager",
            // "Update Employee Manager",
            // "Quit"
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
                // case "Remove an Employee":
                //     removeEmployee();
                //     break;
                // case "Remove a Department":
                //     removeDept();
                //     break;
                // case "Remove a Role":
                //     removeRole();
                //     break;
                // case "View All Employees by Manager":
                //     allEmpsByManager();
                //     break;
                // case "Update Employee Manager":
                //     updateEmpManager();
                //     break;
                // case "Quit":
                //     quit();
                //     break;
            }
        });
};
// Query to show all employees
function allEmployees() {
    const query = "SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name AS departmentName FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id;";
    connection.query(query, (err, res) => {
        if (err) { throw err };
        console.table("All Employees: ", res);
    });
    startPrompt();
};
// Query to show all employees by department
function employeeByDept() {
    const query = "SELECT department.id, department.name, employee.first_name, employee.last_name, role.title FROM department LEFT JOIN role ON department.id = role.department_id LEFT JOIN employee ON role.id = employee.role_id;";
    console.log(query);
    connection.query(query, (err, res) => {
        if (err) { throw err };
        console.table("Employees by Department: ", res);
    });
    startPrompt();
};
// Query to show all roles of the organization
function allRoles() {
    const query = "SELECT role.id, role.title, role.salary FROM role LEFT JOIN department ON role.department_id = department.id;";
    connection.query(query, (err, res) => {
        if (err) { throw err };
        console.table("List of Roles: ", res);
    });
    startPrompt();
};
// Query to showl all departments of the organization
function allDepts() {
    const query = "SELECT department.id, department.name FROM department;";
    connection.query(query, (err, res) => {
        if (err) { throw err };
        console.table("List of Departments: ", res);
    });
    startPrompt();
};
// Query to add an employee
function addEmployee() {
    const query = "SELECT role.id, role.title, role.salary FROM role LEFT JOIN department ON role.department_id = department.id;";
    connection.query(query, (err, data) => {
        if (err) { throw err };
        // Prompt for new employee info
        inquirer.prompt([
            {
                name: "first_name",
                type: "input",
                message: "What is the employee's first name?"
            },
            {
                name: "last_name",
                type: "input",
                message: "What is the employee's last name?"
            },
            {
                name: "role_id",
                type: "list",
                choices: function () {
                    let choiceOptions = [];
                    for (let i = 0; i < data.length; i++) {
                        if (i < 9) {
                            choiceOptions.push(`${data[i].id}  ${data[i].title}`);
                        }
                        else { choiceOptions.push(`${data[i].id} ${data[i].title}`); }
                    }
                    return choiceOptions;
                },
                message: "Choose a role for new employee"
            }
        ])
            .then(function (answer) {
                // After prompting, insert new employee info into the db
                let newRole_id = answer.role_id.split(" ");
                let newEmpRole_id = parseInt(newRole_id[0]);

                connection.query(
                    "INSERT INTO employee SET ?",
                    {
                        first_name: answer.first_name,
                        last_name: answer.last_name,
                        role_id: newEmpRole_id,
                        // manager: answer.manager
                    },
                    function (err) {
                        if (err) { throw err };
                        console.log("You successfully added an employee!");
                        allEmployees();
                        // startPrompt();
                    }
                );
            });
    })
};
// Query to add new role to the organization
function addRole() {
    const query = "SELECT * FROM department;";
    connection.query(query, (err, data) => {
        if (err) { throw err };
        inquirer.prompt([
            {
                name: "title",
                type: "input",
                message: "What kind of role would you like to add?"
            },
            {
                name: "salary",
                type: "input",
                message: "What is the salary of this role?"
            },
            {
                name: "department_id",
                type: "list",
                choices: function () {
                    let choiceOptions = [];
                    for (let i = 0; i < data.length; i++) {
                        if (i < 9) {
                            choiceOptions.push(`${data[i].id}  ${data[i].name}`);
                        }
                        else { choiceOptions.push(`${data[i].id} ${data[i].name}`); }
                    }
                    return choiceOptions;
                },
                message: "Which department does this role belong to?"
            },
        ])
            .then(function (answer) {
                // After prompting, insert new role info into the db
                let newDept_id = answer.department_id.split(" ");
                let newParsedDept_id = parseInt(newDept_id[0]);

                connection.query(
                    "INSERT INTO role SET ?",
                    {
                        title: answer.title,
                        salary: answer.salary,
                        department_id: newParsedDept_id,
                    },
                    function (err) {
                        if (err) { throw err };
                        console.log("You successfully added a new role!");
                        allRoles();
                        // startPrompt();
                    }
                );
            });
    });
};
function addDept() {
    const query = "SELECT * FROM department;";
    connection.query(query, (err, data) => {
        if (err) { throw err };
        inquirer.prompt([
            {
                name: "department",
                type: "input",
                message: "What is the name of the department you want to include?",
                validate: function (input) {
                    for (let i = 0; i < data.length; i++) {
                        const Dept = data[i].name;
                        if (Dept.toLowerCase() === input.toLowerCase()) {
                            return "Department already exists";
                        }
                    }
                    return true;
                }
            },
        ])
            .then(function (answer) {
                // After prompting, insert new department info into the db
                connection.query(
                    "INSERT INTO department SET ?",
                    {
                        name: answer.department,
                    },
                    function (err) {
                        if (err) { throw err };
                        console.log("You successfully added a new department!");
                        allDepts();
                        // startPrompt();
                    }
                );
            });
    })
}
// Query to update employee roles
function updateEmpRole() {
    const query = "SELECT employee.id, employee.first_name, employee.last_name, role.id, role.title, role.salary FROM role LEFT JOIN employee ON employee.role_id = role.id;";
    connection.query(query, (err, data) => {
        if (err) { throw err };
        // console.table(res);
        inquirer.prompt([
            {
                name: "roleUpdate",
                type: "list",
                message: "What is the employee role you want to update?",
                choices: function () {
                    let choiceOptions = [];
                    for (let i = 0; i < data.length; i++) {
                        choiceOptions.push(`${data[i].first_name} ${data[i].last_name} ${data[i].title} ${data[i].salary}`);
                    }
                    return choiceOptions;
                }
            },
            {
                name: "first_name",
                type: "input",
                message: "What is the updated first name?"
            },
            {
                name: "last_name",
                type: "input",
                message: "What is the updated last name?"
            },
            {
                name: "role_id",
                type: "list",
                message: "Choose a new role for the employee",
                choices: function () {
                    let choiceOptions = [];
                    for (let i = 0; i < data.length; i++) {
                        if (i < 9) {
                            choiceOptions.push(`${data[i].id}  ${data[i].title}`);
                        }
                        else { choiceOptions.push(`${data[i].id} ${data[i].title}`); }
                    }
                    return choiceOptions;
                }
            },
        ])
            .then(function (answer) {
                connection.query(
                    "UPDATE employee SET ? WHERE ?;",
                    [
                        // {

                        // },
                        {
                            first_name: answer.first_name
                        },
                        {
                            last_name: answer.last_name
                        },
                        {
                            role_id: answer.role_id
                        }
                    ],
                    function (error) {
                        if (error) throw err;
                        console.log("Employee role updated sucessfully!");
                        allEmployees();
                        // startPrompt();
                    }
                )
            })
    })
};
// The update employee function is not working properly. The prompt is fine but "then" function and update query is not actually updating with the new information.
