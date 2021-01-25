var mysql = require("mysql");
const cTable = require('console.table');
var inquirer = require('inquirer');
const {
    allowedNodeEnvironmentFlags
} = require("process");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Lucy0927!",
    database: "employee_db",
    multipleStatements: true
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    mainMenu();
});

function mainMenu() {
    inquirer.prompt({
        name: 'mainMenu',
        type: 'list',
        message: 'What would you like to do?',
        choices: [
            'view all departments',
            'view all roles',
            'view all employees',
            'add a department',
            'add a role',
            'add an employee',
            'update an employee role',
            'update an employee manager',
            'all done!'
        ]
    }).then((answer) => {
        switch (answer.mainMenu) {
            case 'view all departments':
                readDepartments();
                break;
            case 'view all roles':
                readRoles();
                break;
            case 'view all employees':
                readEmployees();
                break;
            case 'add a department':
                addDepartment();
                break;
            case 'add a role':
                addRole();
                break;
            case 'add an employee':
                addEmployee();
                break;
            case 'update an employee role':
                updateEmployeeRole();
                break;
            case 'update an employee manager':
                updateEmployeeManager();
                break;
            case 'all done!':
                closeApp();
                break;
        }
    })
}

//read from tables

//show departments
function readDepartments() {
    console.log("Showing all departments:");
    connection.query("SELECT * FROM department", function (err, res) {
        if (err) throw err;
        console.table(res);
        mainMenu();
    });
}

//show roles
function readRoles() {
    console.log("Showing all roles:");
    connection.query("SELECT * FROM role", function (err, res) {
        if (err) throw err;
        console.table(res);
        mainMenu();
    });
}

//show employees
function readEmployees() {
    console.log("Showing all employees:");
    connection.query("SELECT * FROM employee", function (err, res) {
        if (err) throw err;
        console.table(res);
        mainMenu();
    });
}


//add to table

//add new dept
function addDepartment() {
    inquirer.prompt([{
        name: 'newDepartment',
        type: 'input',
        message: "What is the new department's name?"
    }]).then(function (answer) {
        var query = connection.query(
            "INSERT INTO department SET ?", {
                name: answer.newDepartment
            },

            function (err, res) {
                if (err) throw err;
                console.log(answer.newDepartment + ' succesfully added!');
                console.table(answer);
                readDepartments();
            }
        );
    })
}

//add new role
function addRole() {
    connection.query(`SELECT * FROM department`, function (err, results) {
        if (err) throw err;

        let choiceList = results.map(choice => choice.name);

        inquirer.prompt([{
                name: 'newRole',
                type: 'input',
                message: "What is the name of this role?"
            },
            {
                name: 'newSalary',
                type: 'input',
                message: "What is the salary for this role?"
            },
            {
                name: 'newDeptId',
                type: 'list',
                message: "What departement does this role belong to?",
                choices: choiceList
            },
        ]).then(function (answer) {
            connection.query(
                `INSERT INTO role(title, salary, department_id) 
                 VALUES 
                 ("${answer.newRole}", "${answer.newSalary}", 
                 (SELECT id FROM department WHERE name = "${answer.newDeptId}"));`
            )
            console.log(answer.newRole + ' succesfully added!');
            readRoles();
        });
    });
};


//add new employee
function addEmployee() {
    tableVariable = `SELECT id AS "employee_id", first_name AS "first_name", last_name AS "last_name" FROM employee; SELECT id AS "role_id", title FROM role`;

    connection.query(tableVariable, function (err, results) {
        if (err) throw err;

        let employeeList = results[0].map(choice => choice.first_name);
        let roleList = results[1].map(choice => choice.title);

        // console.log("---test---");
        // console.log(roleList);

        inquirer.prompt([{
                name: 'employeeName',
                type: 'input',
                message: "What is this employee's first name?"
            },
            {
                name: 'employeeLastName',
                type: 'input',
                message: "What is this employees last name?"
            },
            {
                name: 'roleId',
                type: 'list',
                message: "What is this employees role?",
                choices: roleList
            },
            {
                name: 'employeeManager',
                type: 'list',
                message: "Who is this employee's manager?",
                choices: employeeList
            }

        ]).then(function (answer) {
            connection.query(
                `SET @roleID = (SELECT id FROM role WHERE title = "${answer.roleId}");
                SET @employeeID = (SELECT id FROM employee WHERE first_name = "${answer.employeeName}");

                INSERT INTO employee(first_name, last_name, role_id, manager_id)
                 VALUES ("${answer.employeeName}", "${answer.employeeLastName}", 
                 @roleID, @employeeID)`,

                function (err, res) {
                    if (err) throw err;
                    console.log(answer.employeeName + " " + answer.employeeLastName + ' has been succesfully added!');
                    readEmployees();
                }
            );
        })
    })
}


//update employee role
function updateEmployeeRole() {
    tableVariable = `SELECT id AS "employee_id", first_name AS "first_name", last_name AS "last_name" FROM employee; SELECT id AS "role_id", title FROM role`;

    connection.query(tableVariable, function (err, results) {
        if (err) throw err;

        let employeeList = results[0].map(choice => choice.first_name);
        let roleList = results[1].map(choice => choice.title);

        inquirer.prompt([{
                name: 'chooseRole',
                type: 'list',
                message: "What employee would you like to update?",
                choices: employeeList
            },
            {
                name: 'newRole',
                type: 'list',
                message: "What role would you like to assign to this employee?",
                choices: roleList
            },

        ]).then(function (answer) {
            connection.query(
                `SET @roleID = (SELECT id FROM role WHERE title = "${answer.newRole}");
                SET @employeeID = (SELECT id FROM employee WHERE first_name = "${answer.chooseRole}");
                UPDATE employee SET role_id = @roleID  WHERE id = @employeeID;`,

                function (err, results) {
                    if (err) throw err;
                    console.log(answer.chooseRole + "'s" + " role has been updated to " + answer.newRole);
                    readEmployees();
                }
            );
        });
    });
}
//update employee manager
function updateEmployeeManager() {
    connection.query(`SELECT * FROM employee`, function (err, results) {
        if (err) throw err;

        let employeeList = results.map(choice => choice.first_name);

        inquirer.prompt([{
                name: 'chooseEmployee',
                type: 'list',
                message: "What employee would you like to update?",
                choices: employeeList
            },
            {
                name: 'newManager',
                type: 'list',
                message: "What manager would you like to assign to this employee?",
                choices: employeeList
            }

        ]).then(function (answer) {
            connection.query(
                `SET @employee = (SELECT id FROM employee WHERE first_name = "${answer.chooseEmployee}");
                SET @manager = (SELECT id FROM employee WHERE first_name = "${answer.newManager}");
                UPDATE employee SET manager_id = @manager  WHERE id = @employee;`,

                function (err, res) {
                    if (err) throw err;
                    console.log(answer.chooseEmployee + "'s" + " manager has been updated to " + answer.newManager);
                    readEmployees();
                }
            );
        })
    })
}

function closeApp() {
    console.log("Thank you for using the Employee Tracker App! Please press CTRL + C to exit.");
    console.log("Bye!!!");
}