SELECT *
FROM role
JOIN department ON role.department_id = department.id;

SELECT *
FROM employee
JOIN role ON employee.role_id = role.id;

SELECT employee.id, employee.first_name, employee.last_name, role.title, employee.manager_id
FROM employee
JOIN role ON employee.role_id = role.id;

SELECT *
FROM department
INNER JOIN role ON role.department_id = department.id
INNER JOIN employee ON employee.role_id = role.id;
