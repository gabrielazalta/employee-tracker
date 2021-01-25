INSERT INTO department (name)
VALUES
('Sales'),
('Engineering'),
('Legal'),
('Finance');

INSERT INTO role (title, salary, department_id)
VALUES
('Sales Representative', 68000, 1),
('Software Engineer', 80000, 2),
('Lawyer', 100000, 3),
('Administrative Accountant', 90000, 4),
('Sales Lead', 75000, 1),
('Lead Engineer', 100000, 2),
('Legal Team Lead', 110000, 3),
('Financial Accountant', 100000, 4);


INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
('Jesse', 'Pinkman', 1, NULL),
('Michael', 'Scott', 5, NULL),
('Geralt', 'Rivia', 3, NULL),
('Mike', 'Ehrmantraut', 2, NULL),
('Daniel', 'LaRusso', 7, NULL),
('Jamie', 'Fraser', 4, NULL),
('Robby', 'Keene', 8, NULL),
('Saul', 'Goodman', 6, NULL);

