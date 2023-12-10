# Database Project - Traveling cost estimator
  An interactive traveling cost estimation application. User can choose their start location and destination city on an interactive map, indicate the number of days, and an estimated cost of their travel including plane tickets and daily expenses will be presented.

# Team members
- Başak Mehlepçi - 150200008
- Denıs Iurıe Davıdoglu - 150200916
- Mahmut Mert Özdemir - 150200740

# Datadase
- https://openflights.org/data.html
- https://www.numbeo.com/cost-of-living/rankings_current.jsp
- Registered user accounts
- Randomized fake data
  + Airlines cost
  + Interest cost according to country
  + Adjust costs according to age (normal distribution)
	https://www.bls.gov/opub/btn/volume-4/consumer-expenditures-vary-by-age.htm
	
# Modules
## Backend & Frontend
### Node.js dependencies (`npm install ...`):
- react-router-dom
- react-helmet
- mysql2

### MySQL settings
- user: `root`
- host: `localhost`
- password: `<R00tUser>`
- database: `openflights`

### MySQL quick setup
- https://dev.mysql.com/doc/refman/8.0/en/resetting-permissions.html
```
mysql> FLUSH PRIVILEGES;
mysql> ALTER USER 'root'@'localhost' IDENTIFIED BY '<R00tUser>';
```

### MySQL Node.js Tutorial
- https://www.youtube.com/watch?v=Hej48pi_lOc

## Registration page
## Interactive map
## Calculator
## Order
## Add to calendar
## Admin page

