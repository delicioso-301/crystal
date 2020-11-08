DROP TABLE IF EXISTS birthday;

CREATE TABLE birthday(
  id SERIAL PRIMARY KEY,
  birth_day VARCHAR (255),
  birth_month VARCHAR (255),
  birth_year VARCHAR (255),  
  nasa_name VARCHAR(255),
  nasa_url VARCHAR(255),
  fact VARCHAR(255)
)