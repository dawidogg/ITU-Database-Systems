drop database traveling_cost;
create database traveling_cost;

use traveling_cost;

create table countries (
name varchar(255),
iso_code varchar(10),
dafif_code varchar(10),
primary key (name)
);

create table airlines (
id int not null auto_increment,
name varchar(255) not null,
alias varchar(128),
iata varchar(10),     
icao varchar(10),          
callsign varchar(255),
country varchar(255),  
active varchar(10),
primary key (id),
foreign key (country) references countries(name)
);

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
primary key (id),
foreign key (country) references countries(name)
);

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

create table planes (
name varchar(255),
iata varchar(10),
icao varchar(10),
primary key (name)
);

create table living_cost (
city varchar(255) not null, 
country varchar(255) not null,
slug varchar(128),
currency varchar(10),
avg_index decimal(5, 2),
rent_index decimal(5, 2),
groceries_index decimal(5, 2),
restaurant_index decimal(5, 2),
purchasing_index decimal(5, 2),
id int not null auto_increment,
primary key (id),
foreign key (country) references countries(name)
);	

create table users (
email varchar(255) not null
check(email like '_%@_%' and length(email) >= 4),
password_hash varchar(255) not null,
first_name varchar(255),
last_name varchar(255),
age int check (age >= 18),
interests varchar(255),
primary key (email)
);

create table user_history(
id int not null auto_increment,
email varchar(255) not null,
origin_airport_id int,
destination_airport_id int,
days int,
cost int,	 				 
time_stamp datetime default current_timestamp(),
primary key (id),
foreign key (email) references users(email),
foreign key	(origin_airport_id) references airports(id),
foreign key	(destination_airport_id) references airports(id)
);

create table airline_costs (
id int not null,
category int check(category >= 1 and category <= 5),
primary key (id),
foreign key (id) references airlines(id)
);
