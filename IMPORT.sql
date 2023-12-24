use traveling_cost;

load data infile 'countries.csv' ignore
into table countries
fields terminated by ','
enclosed by '"'       
lines terminated by '\n';

load data infile 'airlines.csv' ignore
into table airlines
fields terminated by ','
enclosed by '"'       
lines terminated by '\n';

load data infile 'airports.csv' ignore
into table airports
fields terminated by ','
enclosed by '"'       
lines terminated by '\n';

load data infile 'routes.csv' ignore
into table routes
fields terminated by ','
enclosed by '"'       
lines terminated by '\n';

load data infile 'planes.csv' ignore
into table planes
fields terminated by ','
enclosed by '"'       
lines terminated by '\n';

load data infile 'cost_of_living_indices.csv' ignore
into table living_cost
fields terminated by ','
enclosed by '"'       
lines terminated by '\n'
(city,
country,
slug,
currency,
avg_index,
rent_index,
groceries_index,
restaurant_index,
purchasing_index);

drop procedure generate_airline_costs;
delimiter $$
create procedure generate_airline_costs()
    begin
        declare i int;
		declare airlines_count int;
        set i = 0;
		set airlines_count = (select count(*) from airlines);
        start transaction;
		delete from airline_costs;
        while i < airlines_count do
            insert into airline_costs (select id, (1 + ceil(rand()*4)) from airlines limit 1 offset i) ;
            set i = i + 1;
        end while;
        commit;
    end$$
delimiter ;

call generate_airline_costs();


drop function distance_between_airports;
delimiter $$
create function distance_between_airports(a int, b int) returns int
deterministic
begin
return (select ST_Distance_Sphere(
point((select longitude from airports where id = a), (select latitude from airports where id = a)),
point((select longitude from airports where id = b), (select latitude from airports where id = b))			  
)); 
end$$
delimiter ;

drop function closest_airport;
delimiter $$

create function closest_airport(p_lat double, p_long double) returns int
deterministic
begin
return (select id
		from airports
		order by ST_Distance_Sphere(
		point(longitude, latitude), 
		point(p_long, p_lat)
		) limit 1);
end$$
delimiter ;  
