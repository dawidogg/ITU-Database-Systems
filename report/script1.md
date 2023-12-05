* Scripts to import the CSV files into the database
** Create the database
    #+begin_src sql
   SHOW DATABASES;
    #+end_src
   
    Results:
    | Database           |
    |--------------------|
    | information_schema |
    | mysql              |
    | openflights        |
    | performance_schema |
   
    #+begin_src sql :results silent
   create database openflights
    #+end_src

    #+begin_src sql
    use openflights;
    show tables;
    #+end_src

    #+RESULTS:
    | Tables_in_openflights |
    |-----------------------|
    | airlines              |
    | airports              |
    | countries             |
    | living_cost           |
    | planes                |
    | routes                |

** airports.csv
   Column format:
   | Airport ID            | Unique OpenFlights identifier for this airport.                                     |
   | Name                  | Name of airport. May or may not contain the City name.                              |
   | City                  | Main city served by airport. May be spelled differently from Name.                  |
   | Country               | Country or territory where airport is located. See Countries to cross-reference to ISO 3166-1 codes. |
   | IATA                  | 3-letter IATA code. Null if not assigned/unknown.                                   |
   | ICAO                  | 4-letter ICAO code. Null if not assigned.                                           |
   | Latitude              | Decimal degrees, usually to six significant digits. Negative is South, positive is North. |
   | Longitude             | Decimal degrees, usually to six significant digits. Negative is West, positive is East. |
   | Altitude              | In feet.                                                                            |
   | Timezone              | Hours offset from UTC. Fractional hours are expressed as decimals, eg. India is 5.5. |
   | DST                   | Daylight savings time. One of E (Europe), A (US/Canada), S (South America), O (Australia), Z (New Zealand), N (None) or U (Unknown). See also: Help: Time |
   | Tz database time zone | Timezone in "tz" (Olson) format, eg. "America/Los_Angeles".                         |
   | Type                  | Type of the airport. Value "airport" for air terminals, "station" for train stations, "port" for ferry terminals and "unknown" if not known. In airports.csv, only type=airport is included. |
   | Source                | Source of this data. "OurAirports" for data sourced from OurAirports, "Legacy" for old data not matched to OurAirports (mostly DAFIF), "User" for unverified user contributions. In airports.csv, only source=OurAirports is included. |
   
   #+begin_src sql :results silent
   use openflights;
   drop table airports;    	
   #+end_src
   
   #+begin_src sql :results silent
   use openflights;
   create table airports (
       id int not null auto_increment,
       name varchar(255) not null,
       city varchar(255) not null,
       country varchar(255) not null,
       iata varchar(10),                  
       icao varchar(10),                 
       latitude float(53),        
       longitude float(53),       
       altitude integer,              
       timezone decimal(5, 2),              
       dst varchar(3),                    
       tz varchar(255),
       type varchar(255),                 
       source varchar(255),
       primary key (id)
   );
   #+end_src
   
   #+begin_src sql
   use openflights;
   show tables;
   load data infile '/var/lib/mysql/airports.csv'
   into table airports
   fields terminated by ','
   enclosed by '"'       
   lines terminated by '\n';
   #+end_src

   #+begin_src sql
   use openflights;
   select * from airports where city='Anchorage';
   #+end_src
   
   Results:
   |   id | name                                        | city      | country       | iata | icao |           latitude |           longitude | altitude | timezone | dst | tz                | type    | source      |
   |------+---------------------------------------------+-----------+---------------+------+------+--------------------+---------------------+----------+----------+-----+-------------------+---------+-------------|
   | 3438 | Merrill Field                               | Anchorage | United States | MRI  | PAMR |   61.2135009765625 |   -149.843994140625 |      137 |    -9.00 | A   | America/Anchorage | airport | OurAirports |
   | 3692 | Elmendorf Air Force Base                    | Anchorage | United States | EDF  | PAED | 61.250999450683594 |  -149.8070068359375 |      212 |    -9.00 | A   | America/Anchorage | airport | OurAirports |
   | 3774 | Ted Stevens Anchorage International Airport | Anchorage | United States | ANC  | PANC | 61.174400329589844 | -149.99600219726562 |      152 |    -9.00 | A   | America/Anchorage | airport | OurAirports |
   | 8051 | Lake Hood Airport                           | Anchorage | United States | NULL | PALH |          61.186946 |         -149.965442 |       73 |    -9.00 | A   | America/Anchorage | airport | OurAirports |

** airlines.csv
   Column format:
   | Airline ID | Unique OpenFlights identifier for this airline.                                      |
   | Name       | Name of the airline.                                                                 |
   | Alias      | Alias of the airline. For example, All Nippon Airways is commonly known as "ANA".    |
   | IATA       | 2-letter IATA code, if available.                                                    |
   | ICAO       | 3-letter ICAO code, if available.                                                    |
   | Callsign   | Airline callsign.                                                                    |
   | Country    | Country or territory where airport is located. See Countries to cross-reference to ISO 3166-1 codes. |
   | Active     | "Y" if the airline is or has until recently been operational, "N" if it is defunct. This field is not reliable: in particular, major airlines that stopped flying long ago, but have not had their IATA code reassigned (eg. Ansett/AN), will incorrectly show as "Y". |

   #+begin_src sql :results silent
   use openflights;
   drop table airlines;    	
   #+end_src

   #+begin_src sql :results silent
   use openflights;
   create table airlines (
       id int not null auto_increment,
       name varchar(255) not null,
       alias varchar(128),
       iata varchar(10),     
       icao varchar(10),          
       callsign varchar(255),
       country varchar(255),  
       active varchar(10),
       primary key (id)   
   );
   #+end_src
   
   #+begin_src sql
   use openflights;
   show tables;
   load data infile '/var/lib/mysql/airlines.csv'
   into table airlines
   fields terminated by ','
   enclosed by '"'       
   lines terminated by '\n';
   #+end_src

   #+begin_src sql
   use openflights;
   select * from airlines limit 10;
   #+end_src

   Results:
   | id | name                                         | alias | iata | icao | callsign       | country        | active |
   |----+----------------------------------------------+-------+------+------+----------------+----------------+--------|
   | -1 | Unknown                                      | NULL  | -    | N/A  | NULL           | NULL           | Y      |
   |  1 | Private flight                               | NULL  | -    | N/A  |                |                | Y      |
   |  2 | 135 Airways                                  | NULL  |      | GNL  | GENERAL        | United States  | N      |
   |  3 | 1Time Airline                                | NULL  | 1T   | RNX  | NEXTIME        | South Africa   | Y      |
   |  4 | 2 Sqn No 1 Elementary Flying Training School | NULL  |      | WYT  |                | United Kingdom | N      |
   |  5 | 213 Flight Unit                              | NULL  |      | TFU  |                | Russia         | N      |
   |  6 | 223 Flight Unit State Airline                | NULL  |      | CHD  | CHKALOVSK-AVIA | Russia         | N      |
   |  7 | 224th Flight Unit                            | NULL  |      | TTF  | CARGO UNIT     | Russia         | N      |
   |  8 | 247 Jet Ltd                                  | NULL  |      | TWF  | CLOUD RUNNER   | United Kingdom | N      |
   |  9 | 3D Aviation                                  | NULL  |      | SEC  | SECUREX        | United States  | N      |

** routes.csv
   Column format:
   | Airline                | 2-letter (IATA) or 3-letter (ICAO) code of the airline.                             |
   | Airline ID             | Unique OpenFlights identifier for airline (see Airline).                            |
   | Source airport         | 3-letter (IATA) or 4-letter (ICAO) code of the source airport.                      |
   | Source airport ID      | Unique OpenFlights identifier for source airport (see Airport)                      |
   | Destination airport    | 3-letter (IATA) or 4-letter (ICAO) code of the destination airport.                 |
   | Destination airport ID | Unique OpenFlights identifier for destination airport (see Airport)                 |
   | Codeshare              | "Y" if this flight is a codeshare (that is, not operated by Airline, but another carrier), empty otherwise. |
   | Stops                  | Number of stops on this flight ("0" for direct)                                     |
   | Equipment              | 3-letter codes for plane type(s) generally used on this flight, separated by spaces |

   #+begin_src sql :results silent
   use openflights;
   drop table routes;    	
   #+end_src

   #+begin_src sql :results silent
   use openflights;
   create table routes (
       airline_name varchar(10) not null,    	  
       airline_id int not null,
       src_airport varchar(10) not null,         
       src_airport_id int not null,
       dest_airport varchar(10) not null,
       dest_airport_id int not null,
       codeshare varchar(10),
       stops int,                   
       equipment varchar(128),             
       foreign key (airline_id)
           references airlines(id),
       foreign key (src_airport_id)
           references airports(id),
       foreign key (dest_airport_id)
           references airports(id)
   );
   #+end_src

   #+begin_src sql
   set foreign_key_checks=0;
   use openflights;
   show tables;
   load data infile '/var/lib/mysql/routes.csv'
   into table routes
   fields terminated by ','
   enclosed by '"'       
   lines terminated by '\n';
   #+end_src

   #+begin_src sql
   use openflights;
   select * from routes limit 10 offset 100;
   #+end_src

   Results:
   | airline_name | airline_id | src_airport | src_airport_id | dest_airport | dest_airport_id | codeshare | stops | equipment |
   |--------------+------------+-------------+----------------+--------------+-----------------+-----------+-------+-----------|
   | 2K           |       1338 | BOG         |           2709 | UIO          |            2688 |           |     0 | 319 320
   | 2K           |       1338 | CLO         |           2715 | GYE          |            2673 |           |     0 | 319
   | 2K           |       1338 | GYE         |           2673 | BOG          |            2709 |           |     0 | 319
   | 2K           |       1338 | GYE         |           2673 | CLO          |            2715 |           |     0 | 319
   | 2K           |       1338 | GYE         |           2673 | SCY          |            6045 |           |     0 | 319 320
   | 2K           |       1338 | GYE         |           2673 | UIO          |            2688 |           |     0 | 320 319
   | 2K           |       1338 | OCC         |           2670 | UIO          |            2688 |           |     0 | 319
   | 2K           |       1338 | SCY         |           6045 | GYE          |            2673 |           |     0 | 319 320
   | 2K           |       1338 | UIO         |           2688 | BOG          |            2709 |           |     0 | 319 320
   | 2K           |       1338 | UIO         |           2688 | GYE          |            2673 |           |     0 | 319
   
** countries.csv
   Column format:
   | name       | Full name of the country or territory.                                              |
   | iso_code   | Unique two-letter ISO 3166-1 code for the country or territory.                     |
   | dafif_code | FIPS country codes as used in DAFIF. Obsolete and primarily of historical interested. |

   #+begin_src sql :results silent
   use openflights;
   drop table countries;
   #+end_src
   
   #+begin_src sql :results silent
   use openflights;
   create table countries (
       name varchar(255),
       iso_code varchar(10),
       dafif_code varchar(10),
       primary key (name)
   );	
   #+end_src

   #+begin_src sql :results silent
   use openflights;
   show tables;
   load data infile '/var/lib/mysql/countries.csv'
   into table countries
   fields terminated by ','
   enclosed by '"'       
   lines terminated by '\n';
   #+end_src

   #+begin_src sql
   use openflights;
   select * from countries limit 10;
   #+end_src

   Results:
   | name                | iso_code | dafif_code |
   |---------------------+----------+------------|
   | Afghanistan         | AF       | AF         |
   | Albania             | AL       | AL         |
   | Algeria             | DZ       | AG         |
   | American Samoa      | AS       | AQ         |
   | Angola              | AO       | AO         |
   | Anguilla            | AI       | AV         |
   | Antarctica          | AQ       | AY         |
   | Antigua and Barbuda | AG       | AC         |
   | Argentina           | AR       | AR         |
   | Armenia             | AM       | AM         |
   
** planes.csv
   Column format:
   | Name      | Full name of the aircraft.                            |
   | IATA code | Unique three-letter IATA identifier for the aircraft. |
   | ICAO code | Unique four-letter ICAO identifier for the aircraft.  |

   #+begin_src sql :results silent
   use openflights;
   drop table planes;
   #+end_src
   
   #+begin_src sql :results silent
   use openflights;
   create table planes (
       name varchar(255),
       iata varchar(10),
       icao varchar(10),
       primary key (name)
   );	
   #+end_src

   #+begin_src sql :results silent
   use openflights;
   show tables;
   load data infile '/var/lib/mysql/planes.csv'
   into table planes
   fields terminated by ','
   enclosed by '"'       
   lines terminated by '\n';
   #+end_src

   #+begin_src sql
   use openflights;
   select * from planes limit 10;
   #+end_src

   Results:
   | name                                         | iata | icao |
   |----------------------------------------------+------+------|
   | Aerospatiale (Nord) 262                      | ND2  | N262 |
   | Aerospatiale (Sud Aviation) Se.210 Caravelle | CRV  | S210 |
   | Aerospatiale SN.601 Corvette                 | NDC  | S601 |
   | Aerospatiale/Alenia ATR 42-300               | AT4  | AT43 |
   | Aerospatiale/Alenia ATR 42-500               | AT5  | AT45 |
   | Aerospatiale/Alenia ATR 42-600               | ATR  | AT46 |
   | Aerospatiale/Alenia ATR 72                   | AT7  | AT72 |
   | Airbus A300                                  | AB3  | A30B |
   | Airbus A300-600                              | AB6  | A306 |
   | Airbus A300-600ST Super Transporter / Beluga | ABB  | A3ST |
   
** cost_of_living_indices.csv
   #+begin_src sql :results silent
   use openflights;
   drop table living_cost;
   #+end_src
   
   #+begin_src sql :results silent
   use openflights;
   create table living_cost (
       city varchar(255) not null,
       country varchar(255) not null,
       slug varchar(128),
       currency varchar(10),
       avg_index decimal(5, 2),
       rent_index decimal(5, 2),
       groceries_index decimal(5, 2),
       restaurant_index decimal(5, 2),
       purchasing_index decimal(5, 2)
    );	
   #+end_src

   #+begin_src sql :results silent
   use openflights;
   show tables;
   load data infile '/var/lib/mysql/cost_of_living_indices.csv'
   into table living_cost
   fields terminated by ','
   enclosed by '"'       
   lines terminated by '\n';
   #+end_src

   #+begin_src sql
   use openflights;
   select * from living_cost limit 10;
   #+end_src

   Results:
   | city      | country     | slug     | currency | avg_index | rent_index | groceries_index | restaurant_index | purchasing_index |
   |-----------+-------------+----------+----------+-----------+------------+-----------------+------------------+------------------|
   | Hamilton  | Bermuda     |          | BMD      |    128.19 |     113.35 |          131.79 |           151.38 |            96.54 |
   | Geneva    | Switzerland | geneva   | CHF      |    103.02 |      70.66 |          129.84 |           131.70 |           121.11 |
   | Basel     | Switzerland |          | CHF      |     92.50 |      51.14 |          135.74 |           120.52 |           102.20 |
   | Zurich    | Switzerland | zurich   | CHF      |     98.72 |      64.69 |          131.73 |           131.71 |           134.50 |
   | Zug       | Switzerland |          | CHF      |     96.13 |      66.03 |          126.15 |           118.38 |            96.22 |
   | Lausanne  | Switzerland | Lausanne | CHF      |     87.60 |      54.82 |          115.00 |           119.34 |           117.56 |
   | Bern      | Switzerland | bern     | CHF      |     82.75 |      45.14 |          116.79 |           113.61 |           100.69 |
   | Lugano    | Switzerland |          | CHF      |     84.54 |      51.44 |          104.96 |           121.17 |            92.46 |
   | Stavanger | Norway      |          | NOK      |     76.08 |      36.73 |          102.26 |           134.69 |           111.35 |
   | Trondheim | Norway      |          | NOK      |     78.10 |      41.60 |          102.06 |           118.57 |            98.92 |
