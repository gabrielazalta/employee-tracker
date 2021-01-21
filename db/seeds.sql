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
('Sales Lead', 75000, 5),
('Lead Engineer', 100000, 6),
('Legal Team Lead', 110000, 7),
('Financial Accountant', 100000, 8);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
('Jesse', 'Pinkman', 1),
('Michael', 'Scott', 5),
('Geralt', 'Rivia', 3),
('Mike', 'Ehrmantraut', 2),
('Daniel', 'LaRusso', 7),
('Jamie', 'Fraser', 4),
('Robby', 'Keene', 8),
('Saul', 'Goodman', 6);