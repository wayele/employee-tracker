USE employee_tracker_db;

INSERT INTO department (name)
VALUES ("Executive_Board"), ("Public_Relations"), ("Crisis_Committee"), 
       ("Award_Committee"), ("Building_Mgmt"), ("Events_Committee");
INSERT INTO role (title, salary, department_id)
VALUES ("President", 50000, 1), ("Vice-President", 45000, 1), ("Treasurer", 42000, 1), 
       ("Secretary", 30000, 1), ("Accountant", 40000, 6), ("Award_Lead", 30000, 4), 
       ("Crisis_Lead", 30000, 3), ("Crisis_help", 25000, 3), ("Events_Lead", 25000, 6), 
       ("Events_help", 20000, 6), ("PR_Lead", 25000, 2), ("PR_help", 20000, 2), 
       ("Bldg_Lead", 25000, 5), ("Bldg_help", 20000, 5);
-- SELECT * FROM role;
-- SELECT * FROM department;
INSERT INTO employee (first_name, last_name, role_id)
VALUES ("Ms", "President", 1), ("Mr", "VicePresident", 2), ("Mr", "Treasurer", 3),
	   ("Mr", "Secretary", 4), ("Mr", "Accountant", 5), ("Ms", "AwardLead", 6),
	   ("Ms", "CrisisLead", 7), ("Mr", "CrisisHelp", 8), ("Mr", "EventsLead", 9),
	   ("Ms", "EventsHelp", 10), ("Ms", "PRLead", 11), ("Mr", "PRHelp", 12),
	   ("Mr", "BldgLead", 13), ("Mr", "BldgHelp", 14);
-- SELECT * FROM employee;
