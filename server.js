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
    const firstName;
    const lastName;
    const roleId;
    const managerId;
    inquirer.prompt(newEmpQs)
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
    db.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?);', [firstName, lastName, roleId, managerId]);
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
            type: 'input',
            message: 'What department is this role a part of?',
            name: 'dept',
            choices: deptNames
        }]
    const title;
    const salary;
    const departmentId;
    inquirer.prompt(roleQuestions)
        .then((data) => {
            title = data.roleTitle;
            salary = data.salary;
            for (let i = 0; i < deptList.length; i++) {
                if (data.deptNames === departmentList[i].name) {
                    departmentId = departmentList[i].id
                }
            }
        })
        db.query('INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?);', [title, salary, departmentId]);
        updateRoleList();
        console.log('Role added successfully!')
}

function updateRoleList() {
    const roles = db.query('SELECT * FROM role')
    roleList = [];
    roleNames = [];
    for (let i = 0; i < roles.length; i++) {
        roleList.push({ id: roles[i].id, title: roles[i].title, salary: roles[i].salary, department_id: roles[i].department_id});
        roleNames.push(roles[i].title);
    }
}

function allDept() {
    db.query('SELECT * FROM role', function (err, results) {
        console.table(results)
    })
    
}

function addDept() {
    const deptQuestions = 
        {
            type: 'input',
            message: 'What is the new department name',
            name: 'deptName'
        }
    let name;
    inquirer.prompt(deptQuestions)
        .then((data) => name = response.deptQuestions);
    db.query('INSERT INTO department (name) VALUES (?);', [name])
    updateDeptList()
    console.log('Department added successfully!')
}

function updateDeptList() {
    const depts = db.query('SELECT * FROM department');
    deptList = [];
    deptNames = [];
    for (let i = 0; i < depts.length; i++) {
        deptList.push({ id: depts[i].id, name: depts[i].name });
        deptNames.push(roles[i].title);
    }
}

