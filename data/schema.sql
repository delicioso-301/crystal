DROP TABLE IF EXISTS birthday;

CREATE TABLE birthday(
  id SERIAL PRIMARY KEY,
  birthday VARCHAR (255),
  album_name VARCHAR(255),
  album_url VARCHAR(255),
  movie_name VARCHAR(255),
  movie_url VARCHAR(255),
  celeb_name VARCHAR(255),
  celeb_url VARCHAR(255) 
)