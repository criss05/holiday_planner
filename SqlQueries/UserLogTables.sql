CREATE TABLE user_activity_log (
	log_id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
	user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
	action TEXT NOT NULL,
	timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE monitored_users(
	id SERIAL PRIMARY KEY,
	user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
	monitored_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

SELECT role_id FROM Users WHERE user_id = 2
SELECT role_name FROM roles WHERE role_id = 1
SELECT * FROM user_activity_log;
SELECT * FROM monitored_users;