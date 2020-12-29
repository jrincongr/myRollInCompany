USE myRollinCompany;

INSERT INTO department (dep_name)
VALUES ("Administration"),
("Accounting"),
("Engineering"),
("Marketing");

INSERT INTO roles (title, salary, department_id)
VALUES ("Admin", 75000.00, 1),
("Marketing Specialist", 60000.00, 4);

INSERT INTO employee (first_name, last_name, role_id)
VALUES("Javier", "Rincon", 1),
("Andres", "Long", 2);