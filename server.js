const inquirer = require('inquirer');
const db = require('./db/connection');
const mysql = require('mysql2');
require('console.table');

const deptNames = [db.query('SELECT name FROM department', function (err, rows) {
    if(err) {
        throw err;
    }
})]; //name column from table
const deptList = [db.query('SELECT * FROM department', function (err, rows) {
    if(err) {
        throw err;
    } 
})]; //the whole department table
const roleNames = [db.query('SELECT title FROM role', function (err, rows) {
    if(err) {
        throw err;
    }
})]; //title column from the table
const roleList = [db.query('SELECT * FROM role', function (err, rows) {
    if(err) {
        throw err;
    }
})]; //The whole role table.
const empNames = [db.query('SELECT first_name, last_name FROM employee', function (err, rows) {
    if(err) {
        throw err;
    }
})]; //first_name & last_name columns from the table
const empList = [db.query('SELECT * FROM employee', function (err, rows) {
    if(err) {
        throw err;
    }
})]; //The whole employee table

const mainQuestion = {
    type: 'list',
    message: 'What would you like to do?',
    name: 'option',
    choices: ['View All Employees', 'Add Employee', 'Update Employee Role', 'View All Roles', 'Add Role', 'View All Departments', 'Add Department'],
}

function selectOption() {
    inquirer.prompt(mainQuestion)
    .then((data) => {
        switch (data.option) {
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
    })
}

function allEmp() {
    db.query('SELECT employee.id AS employee_id, employee.first_name, employee.last_name, role.title AS job_title, department.name AS department, role.salary, employee.manager_id FROM department INNER JOIN role ON role.department_id = department.id INNER JOIN employee ON employee.role_id = role.id', function (err, results) {
    if (err) {
        console.log(err)
    }
        console.log('\n');
        console.table(results)
        selectOption();
    })
}

async function addEmp() {
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
            type: 'list',
            message: "What is the new employee's role?",
            name: 'role',
            choices: roleNames
        },
        {
            type: 'list',
            message: "Does this employee have a manager?",
            name: 'manager',
            choices: empNames
        }];
    let firstName;
    let lastName;
    let roleId;
    let managerId;
    await inquirer
    .prompt(newEmpQs)
    .then((data) => {
        firstName = data.firstName.trim();
        lastName = data.lastName.trim();
        for (let i = 0; i < roleList.length; i++) {
            if (data.role === roleList[i].title) {
                roleId = roleList[i].id
            }
        }
        for (let i = 0; i < empList.length; i++) {
            const firstLastName = data.manager.split(" ");
            if (firstLastName[0] === empList[i].first_name && firstLastName[1] === empList[i].last_name) {
                managerId = empList[i].id
            }
        }
    })
    await db.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?);', [firstName, lastName, roleId, managerId]);
    await updateEmpList();
    selectOption();
    console.log('\n')
    console.log('Employee added successfully!')
}

async function updateEmpList() {
    const employees = await db.query('SELECT * FROM employee')
    empList = [];
    empNames = [];
    for (let i = 0; i < employees.length; i++) {
        empList.push({ id: employees[i].id, first_name: employees[i].first_name, last_name: employees[i].last_name, role_id: employees[i].role_id, manager_id: employees[i].manager_id })
        empNames.push(`${employees[i].first_name} ${employees[i].last_name}`)
    }
}

async function updateEmp() {
    const updateEmpQuestions = [
        {
            type: 'list',
            message: 'Which employee would you like to update?',
            name: 'updateEmployee',
            choices: empNames,
        },
        {
            type: 'list',
            message: 'What new role would you like to assign this employee?',
            name: 'newRole',
            choices: roleNames
        }];
    let id;
    let roleId;
    await inquirer.prompt(updateEmpQuestions)
        .then((data) => {
            for (let i = 0; i < roleList.length; i++) {
                if (data.newRole === roleList[i].title) {
                    roleId = roleList[i].id
                }
            }
            for (let i = 0; i < empList.length; i++) {
                const firstLastName = data.manager.split(" ");
                if (firstLastName[0] === empList[i].first_name && firstLastName[1] === empList[i].last_name) {
                    id = empList[i].id
                }
            }
        })
    await db.query('UPDATE employee SET role_id = ? WHERE id = ?' [roleId, id]);
    await updateEmpList();
    selectOption();
    console.log('\n');
    console.log('Employee role has been updated!');
}

function allRoles() {
    db.query('SELECT role.id, role.title, department.name AS department, role.salary FROM role JOIN department ON role.department_id = department.id', function (err, results) {
    if (err) {
        console.log(err)
    }
        console.log('\n');
        console.table(results)
        selectOption();
    })
    
}

async function addRole() {
    const roleQuestions = [
        {
            type: 'input',
            message: 'What role would you like to add?',
            name: 'roleTitle'
        },
        {
            type: 'input',
            message: 'What is the salary of this role? (No commas or dollar signs)',
            name: 'salary'
        },
        {
            type: 'list',
            message: 'What department is this role a part of?',
            name: 'dept',
            choices: deptNames
        }]
    let title;
    let salary;
    let departmentId;
    await inquirer.prompt(roleQuestions)
        .then((data) => {
            title = data.roleTitle;
            salary = data.salary;
            for (let i = 0; i < deptList.length; i++) {
                if (data.deptNames === departmentList[i].name) {
                    departmentId = departmentList[i].id
                }
            }
        })
        await db.query('INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?);', [title, salary, departmentId]);
        await updateRoleList();
        selectOption()
        console.log('Role added successfully!')
}

async function updateRoleList() {
    const roles = await db.query('SELECT * FROM role')
    roleList = [];
    roleNames = [];
    for (let i = 0; i < roles.length; i++) {
        roleList.push({ id: roles[i].id, title: roles[i].title, salary: roles[i].salary, department_id: roles[i].department_id});
        roleNames.push(roles[i].title);
    }
}

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

async function addDept() {
    const deptQuestions = 
        {
            type: 'input',
            message: 'What is the new department name',
            name: 'deptName'
        }
    let name;
    await inquirer.prompt(deptQuestions)
        .then((data) => name = data.deptName);
    await db.query('INSERT INTO department (name) VALUES (?);', [name])
    await updateDeptList()
    selectOption()
    console.log('Department added successfully!')
}

async function updateDeptList() {
    const depts = await db.query('SELECT * FROM department');
    deptList = [];
    deptNames = [];
    for (let i = 0; i < depts.length; i++) {
        deptList.push({ id: depts[i].id, name: depts[i].name });
        deptNames.push(roles[i].title);
    }
}

selectOption();
