const mysql = require('mysql2');
const inquirer = require('inquirer');
require('console.table');
const db = require('./db/connection');

const selectOption = () => {
    console.log('\n');
    console.log('What would you like to do?');
    console.log('\n');

    return inquirer
    .prompt([
    {
        type: 'list',
        name: 'choices',
        choices: ['View All Departments', 'View All Roles', 'View All Employees', 'Add Department', 'Add Role', 'Add Employee', 'Update Employee Role',],
    },
    ])
    .then((data) => {
        switch (data.choices) {
            case 'View All Employees':
                allEmp();
                break;
            case 'Add Employee':
                addEmp();
                break;
            case 'Update Employee Role':
                updateEmp();
                break;
            case 'View All Roles':
                allRoles();
                break;
            case 'Add Role':
                addRole();
                break;
            case 'View All Departments':
                allDept();
                break;
            case 'Add Department':
                addDept();
                break;
            default:
                break;
        }
    });
};

function allDept() {
    db.query('SELECT * FROM department', function (err, results) {
        if (err) {
            console.log(err)
        }
            console.log('\n');
            console.table(results)
            selectOption();
        })
}

function allRoles() {
    db.query('SELECT * FROM role', function (err, results) {
    if (err) {
        console.log(err)
    }
        console.log('\n');
        console.table(results)
        selectOption();
    })
}

function allEmp() {
    db.query("SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name AS department, CONCAT(manager.first_name, ' ' ,  manager.last_name) AS manager FROM employee employee LEFT JOIN employee manager ON employee.manager_id = manager.id INNER JOIN role ON employee.role_id = role.id INNER JOIN department ON role.department_id = department.id", function (err, results) {
    if (err) {
        console.log(err)
    }
        console.log('\n');
        console.table(results)
        selectOption();
    })
}

addDept = () => {
    inquirer.prompt([
        {
        name: 'newDept',
        type: 'input',
        message: 'What is the new department name?',
        },
    ])
    .then((data) => {
        let intoQuery = `INSERT INTO department (name) VALUES (?)`;
        db.query(intoQuery, data.newDept, (err, res) => {
        if (err) {
            console.log(err);
        }
        console.log('\n');
        console.log('Department successfully added!');
        console.log('\n');
        allDept();
        });
    });
};

addRole = () => {
    const getQuery = 'SELECT * FROM department';
    db.query(getQuery, (err, results) => {
    if (err) {
        console.log(err);
    }
    let deptNames = [];
    results.forEach((department) => {
        deptNames.push(department.name);
    });
    inquirer.prompt([
        {
            name: 'dept',
            type: 'list',
            message: 'Which department is this new role part of?',
            choices: deptNames,
        },
        ])
        .then((data) => {
        newRole(data);
        });
    const newRole = (deptData) => {
        inquirer.prompt([
            {
            name: 'newRole',
            type: 'input',
            message: 'What is the name of the new role?',
            },
            {
            name: 'salary',
            type: 'input',
            message: 'What is the salary of the new role?',
            },
        ])
        .then((data) => {
            let deptId;
            results.forEach((department) => {
            if (deptData.departmentName === department.name) {
                deptId = department.id;
            }
            });
            let intoQuery = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`;
            let newRoleArray = [data.newRole, data.salary, deptId];
            db.query(intoQuery, newRoleArray, (err) => {
            if (err) {
                console.log(err);
            }
            console.log('\n');
            console.log('New role added!');
            console.log('\n');
            allRoles();
            });
        });
    };
    });
};

const addEmp = () => {
    inquirer.prompt([
        {
        type: 'input',
        name: 'firstName',
        message: "What is the employee's first name?",
        },
        {
        type: 'input',
        name: 'lastName',
        message: "What is the employee's last name?",
        },
    ])
    .then((data) => {
        const empName = [data.firstName, data.lastName];
        const getQuery = `SELECT role.id, role.title FROM role`;
        db.query(getQuery, (err, results) => {
        if (err) {
            console.log(err);
        }
        const roleNames = results.map(({ id, title }) => ({ name: title, value: id }));
        inquirer
            .prompt([
            {
                type: 'list',
                name: 'role',
                message: "What is the new employee's role?",
                choices: roleNames,
            },
            ])
            .then((data) => {
            const roleChoice = data.role;
            empName.push(roleChoice);
            const getQuery = `SELECT * FROM employee`;
            db.query(getQuery, (err, results) => {
                if (err) {
                console.log(err);
                }
                const managerNames = results.map(({ id, first_name, last_name }) => ({
                name: first_name + ' ' + last_name,
                value: id,
                }));
                inquirer.prompt([
                    {
                    type: 'list',
                    name: 'manager',
                    message: "Who is the new employee's manager?",
                    choices: managerNames,
                    },
                ])
                .then((data) => {
                    const empsManager = data.manager;
                    empName.push(empsManager);
                    const intoQuery = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`;
                    db.query(intoQuery, empName, (err) => {
                    if (err) {
                        console.log(err);
                    }
                    console.log('\n');
                    console.log('New employee added!');
                    console.log('\n');
                    allEmp()
                    });
                });
            });
            });
        });
    });
};

const updateEmp = () => {
    let getQuery = `SELECT employee.id, employee.first_name, employee.last_name, role.id AS 'role' FROM employee, role, department WHERE department.id = role.department_id AND role.id = employee.role_id`;
    db.query(getQuery, (err, results) => {
    if (err) {
    console.log(err);
    }
    let empNames = [];
    results.forEach((employee) => {
        empNames.push(`${employee.first_name} ${employee.last_name}`);
    });
    let getQuery = `SELECT role.id, role.title FROM role`;
    db.query(getQuery, (err, results) => {
        if (err) {
        console.log(err);
        }
        let rolesArray = [];
        results.forEach((role) => {
        rolesArray.push(role.title);
        });
        inquirer.prompt([
            {
            name: 'chosenEmployee',
            type: 'list',
            message: 'Which employee would you like to update?',
            choices: empNames,
            },
            {
            name: 'chosenRole',
            type: 'list',
            message: 'What is his/her new role?',
            choices: rolesArray,
            },
        ])
        .then((data) => {
            let updatedRole
            let empId
            results.forEach((role) => {
            if (data.chosenRole === role.title) {
                updatedRole = role.id;
            }
            });
            results.forEach((employee) => {
            if (data.chosenEmployee === `${employee.first_name} ${employee.last_name}`) {
                empId = employee.id;
            }
            });
            let updateEmployee = `UPDATE employee SET role_id = ? WHERE employee.id = ?`;
            db.query(updateEmployee, [updatedRole, empId], (err) => {
            if (err) {
                console.log(err);
            }
            console.log('\n');
            console.log("Employee's role updated!");
            console.log('\n');
            allEmp();
            });
        });
    });
    });
};

selectOption();