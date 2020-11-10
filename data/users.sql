DROP TABLE IF EXISTS users;

CREATE TABLE users(
  user_id SERIAL PRIMARY KEY, 
  user_name VARCHAR(255), 
  user_password VARCHAR(255),
  birthday_id INT
)