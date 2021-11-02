const inquirer = require('inquirer');
const db = require('./db/connection');

const deptNames = [db.query('SELECT name FROM department')] //name column from table
const deptList = [db.query('SELECT * FROM department')] //the whole department table
const roleNames = [db.query('SELECT title FROM role')]; //title column from the table
const roleList = [db.query('SELECT * FROM role')]; //The whole role table.
const empNames = [db.query('SELECT first_name, last_name FROM employee')]; //first_name & last_name columns from the table
const empList = [db.query('SELECT * FROM employee')]; //The whole employee table

const mainQuestion = {
    type: 'list',
    message: 'What would you like to do?',
    name: 'option',
    choices: ['View All Employees', 'Add Employee', 'Update Employee Role', 'View All Roles', 'Add Role', 'View All Departments', 'Add Department'],
}

function selectOption() {
    inquirer.prompt(mainQuestion)
    .then((data) => {
        switch (data.mainQuestion) {
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
            case 'Add Departments':
                addDept();
                break;
            
        }
    })
}

function allEmp() {
    db.query('SELECT * FROM role', function (err, results) {
        console.table(results)
    })
}

function addEmp() {
    const newEmpQs = [
        {
            type: 'input',
            message: "What is the new employee's first name?",
            name: 'firstName',
        },
        {
            type: 'input',
            message: "What is the new employee's last name?",
            name: 'lastName',
        },
        {
            type: 'input',
            message: "What is the new employee's role?",
            name: 'role',
            choices: roleNames
        },
        {
            type: 'input',
            message: "Does this employee have a manager?",
            name: 'manager',
            choices: empNames
        }];
    const first_name;
    const last_name;
    const role_id;
    const manager_id;
    inquirer.prompt(newEmpQs)
    .then((data) => {
        first_name = data.firstName.trim();
        last_name = data.lastName.trim();
        for (let i = 0; i < roleList.length; i++) {
            if (data.role === roleList[i].title) {
                role_id = roleList[i].id
            }
        }
        for (let i = 0; i < empList.length; i++) {
            const firstLastName = response.manager.split(" ");
            if (firstLastName[0] === empList[i].first_name && firstLastName[1] === empList[i].last_name) {
                manager_id = empList[i].id
            }
        }
    })
    db.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)' [first_name, last_name, role_id, manager_id])
    updateEmpList();
    selectOption();
    console.log('Employee added successfully!')
}

function updateEmpList() {
    const employees = db.query('SELECT * FROM employee')
    empList = [];
    empNames = [];
    for (let i = 0; i < employees.length; i++) {
        empList.push({ id: employees[i].id, first_name: employees[i].first_name, last_name: employees[i].last_name, role_id: employees[i].role_id, manager_id: employees[i].manager_id })
        empNames.push(`${employees[i].first_name} ${employees[i].last_name}`)
    }
}

function updateEmp() {

}

function allRoles() {
    db.query('SELECT * FROM role', function (err, results) {
        console.table(results)
    })
    
}

function addRole() {

}

function allDept() {
    db.query('SELECT * FROM role', function (err, results) {
        console.table(results)
    })
    
}

function addDept() {

}


