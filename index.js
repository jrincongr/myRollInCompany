const inquirer = require("inquirer");
const mysql = require("mysql");

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Rirj890425bx9",
    database: "myRollinCompany"
});

connection.connect(err => {
    if (err) throw err
    // console.log("We're in!")
})
const mainOptions = ["View Data", "Add Data", "Update Employee Roles"]
const viewOptions = ["View Departments", "View Roles", "View Employee"]
const addOptions = ["Add to Departments", "Add to Roles", "Add to Employees"]
let currentDep = []
let currentRoles = []
let currentEmp = []

function init() {
    loadDep();
    loadRoles();
    loadEmp();
    inquirer.prompt([
        {
            type: "list",
            message: "Which Option would you like to start with?",
            choices: mainOptions,
            name: "main"
        }
    ]).then(response => {
        if (response.main == "View Data") {
            view();
        } else if (response.main == "Add Data") {
            add();
        } else {
            update();
        }
    })
}

function view() {
    inquirer.prompt([
        {
            type: "list",
            message: "What would you like to do?",
            choices: viewOptions,
            name: "choice"
        }
    ])
        .then(response => {
            if (response.choice == "View Departments") {
                connection.query("SELECT * FROM department", (err, res) => {
                    if (err) throw err;

                    console.table(res);
                    init();
                })
            } else if (response.choice == "View Roles") {
                connection.query("SELECT * FROM roles", (err, res) => {
                    if (err) throw err;

                    console.table(res);
                    init();
                })
            } else if (response.choice == "View Employee") {
                connection.query("SELECT * FROM employee", (err, res) => {
                    if (err) throw err;

                    console.table(res);
                    init();
                })

            }
        })
}

function add() {
    inquirer.prompt([
        {
            type: "list",
            message: "Which Table would you like to add to?",
            choices: addOptions,
            name: "addChoice"
        }
    ]).then(response => {
        if (response.addChoice == "Add to Departments") {
            inquirer.prompt([
                {
                    message: "What is your new Department",
                    name: "newDep"
                }
            ]).then(response => {
                let query = `
                INSERT INTO department (dep_name)
                VALUES (?)`;

                connection.query(query, [response.newDep], (err, res) => {
                    if (err) throw err;
                    loadDep();
                    init();
                })
            })
        } else if (response.addChoice == "Add to Roles") {
            inquirer.prompt([
                {
                    type: "list",
                    message: "Which department would you like to add a role to?",
                    choices: currentDep,
                    name: "addChoice"
                },
                {
                    message: "What new Role would you like to add?",
                    name: "newRole"
                },
                {
                    message: "How much will they get paid?",
                    name: "newPay"
                }
            ]).then(response => {
                let query = `
                INSERT INTO roles (title, salary, department_id)
                VALUES (?,?,?)`;

                connection.query(query, [response.newRole, response.newPay, (currentDep.indexOf(response.addChoice) + 1)],
                    (err, res) => {
                        if (err) throw err;
                        loadRoles();
                        init();
                    })
            })
        } else if (response.addChoice == "Add to Employees") {
            inquirer.prompt([
                {
                    type: "list",
                    message: "Which Role would you like to assign the new Employee to?",
                    choices: currentRoles,
                    name: "addChoice"
                },
                {
                    message: "What is the name of the new Employee",
                    name: "newFirst"
                },
                {
                    message: "What is the Last name of the new Employee",
                    name: "newLast"
                }
            ]).then(response => {
                let query = `
                INSERT INTO employee (first_name, last_name, role_id)
                VALUES (?,?,?)`;

                connection.query(query, [response.newFirst, response.newLast, (currentRoles.indexOf(response.addChoice) + 1)],
                    (err, res) => {
                        if (err) throw err;
                        init();
                    })
            })
        }
    })
}

function update() {
    inquirer.prompt([
        {
            type: "list",
            message: "Which Employee would you like to Update?",
            choices: currentEmp,
            name: "employee"
        },
        {
            type: "list",
            message: "What is this Employee's new role?",
            choices: currentRoles,
            name: "role"
        }
    ]).then(response => {
        let query = `
        UPDATE employee
        SET role_id = ?
        WHERE employee.id = ?`
        connection.query(query, [(currentRoles.indexOf(response.role) + 1), (currentEmp.indexOf(response.employee) + 1)],
            (err, res) => {
                if (err) throw err;
                console.log(res)
                init();
            })
    })
}

function loadDep() {
    currentDep = [];
    connection.query("SELECT * FROM department", (err, res) => {
        if (err) throw err;
        for (i = 0; i < res.length; i++) {
            currentDep.push(res[i].dep_name)
        }
    })
}

function loadRoles() {
    currentRoles = [];
    connection.query("SELECT * FROM roles", (err, res) => {
        if (err) throw err;
        for (i = 0; i < res.length; i++) {
            currentRoles.push(res[i].title)
        }
    })
}

function loadEmp() {
    currentEmp = [];
    connection.query("SELECT * FROM employee", (err, res) => {
        if (err) throw err;
        for (i = 0; i < res.length; i++) {
            currentEmp.push(res[i].first_name)
        }
    })
}

init();
