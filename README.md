# Northcoders News API

## Initial setup info

To run the code you will need to create 2 .env files in the "be-nc-news" directory

1) The first file will need to be named ".env.development". Its contents should point towards the development database:

`PGDATABASE="<name_of_development_database_here_"`

2) The second file should be named ".env.test". Its contents should should point towards the testing database:

`PGDATABASE="<name_of_testing_database_here>"`

3) Finally make sure to run a setup.sql file with the following code:

```
DROP DATABASE IF EXISTS <name_of_test_database>;
DROP DATABASE IF EXISTS <name_of_development_database>;

CREATE DATABASE <name_of_test_database>;
CREATE DATABASE <name_of_development_database>;
```