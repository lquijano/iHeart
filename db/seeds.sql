INSERT INTO users (name, lastname, cellphone, email, PASSWORD, contact, telephone)
VALUES ("Ben", "Smith", 12345, 'a@a.com', "Sfo", "Rachel Smith", 54321);

-- INSERT INTO firstResponse(user_id, name, lastName, relationship, cellphone) 
-- VALUES (1,"Melissa", "Smith", "Wife", 678910);

INSERT INTO heartRate(heartRateUser_id, heartRate)
VALUES (1, 75);




-- this query shows all tables 

-- SELECT *
-- FROM users
-- LEFT JOIN firstResponse
-- ON users.id = firstResponse.user_id
-- LEFT JOIN heartRate
-- ON users.id = heartRate.heartRateUser_id;