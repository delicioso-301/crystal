  ------ DANA

  INSERT INTO birthday(birth_day, birth_month, birth_year, nasa_name, nasa_url, fact_year, fact_text)
  VALUES (
   '14',
   '06',
   '1998',
   'Giant Cluster Bends, Breaks Images',
   'https://apod.nasa.gov/apod/image/cl0024_hst_big.gif',
   '1952',
   'June 14th is the day in 1952 that the keel is laid for the nuclear submarine USS Nautilus.'
  );

  INSERT INTO users(user_name, user_password, user_email, birthday_id)
   VALUES (
    'dana-kiswani',
    '123456789',
    'dana-kiswani@gmail.com',
    (SELECT MAX(Id) FROM birthday)
  );

  ------- SALLY

  INSERT INTO birthday(birth_day, birth_month, birth_year, nasa_name, nasa_url, fact_year, fact_text)
  VALUES (
    '03',
    '08',
    '1996',
    'Jupiter Colorful Clouds',
    'https://apod.nasa.gov/apod/image/jupclouds_vgr_big.jpg',
    '1946',
    'August 3rd is the day in 1946 that Santa Claus Land, the first themed amusement park in the world, opens in Santa Claus, Indiana, US.'
  );

  INSERT INTO users(user_name, user_password, user_email, birthday_id)
   VALUES (
    'sallytareq',
    '123456789',
    'sally.ammous@gmail.com',
    (SELECT MAX(Id) FROM birthday)
  );
    --------- RANIA

  INSERT INTO birthday(birth_day, birth_month, birth_year, nasa_name, nasa_url, fact_year, fact_text)
  VALUES (
   '28',
   '06',
   '1998',
   'Comet Hale-Bopp Over Val Parola Pass',
   'https://apod.nasa.gov/apod/image/9703/halebopp5_aac_big.jpg',
   '1989',
   'June 28th is the day in 1989 that the 600th anniversary of the Battle of Kosovo.'
  );

  INSERT INTO users(user_name, user_password, user_email, birthday_id)
   VALUES (
    'raniaabdullahh',
    '123456789',
    'raniaabdullah6600@gmail.com',
    (SELECT MAX(Id) FROM birthday)
  );

    --------- FARAH

  INSERT INTO birthday(birth_day, birth_month, birth_year, nasa_name, nasa_url, fact_year, fact_text)
  VALUES (
    '03',
    '07',
    '1997',
    'Mars:A Journeys End',
    'https://apod.nasa.gov/apod/image/9707/pathland_hst_big.jpg',
    '1970',
    'July 3rd is the day in 1970 that a British Dan-Air De Havilland Comet chartered jetliner crashes into mountains north of Barcelona, Spain killing 113 people.'
  );

  INSERT INTO users(user_name, user_password, user_email, birthday_id)
   VALUES (
    'farahzuot',
    '123456789',
    'farahz997@eng.hu.edu.jo',
    (SELECT MAX(Id) FROM birthday)
  );

  --------- MAHMOUD


  INSERT INTO birthday(birth_day, birth_month, birth_year, nasa_name, nasa_url, fact_year, fact_text)
  VALUES (
    '25',
    '05',
    '1999',
    'NGC 6872:A Stretched Spiral',
    'https://apod.nasa.gov/apod/image/9905/ngc6872_vlt_big.jpg',
    '-567',
    'May 25th is the day in 567 BC that Servius Tullius, king of Rome, celebrates a triumph for his victory over the Etruscans.'
  );

  INSERT INTO users(user_name, user_password, user_email, birthday_id)
   VALUES (
    'mahmoudghnnam',
    '123456789',
    'mahmou999@gmail.com',
    (SELECT MAX(Id) FROM birthday)
  );