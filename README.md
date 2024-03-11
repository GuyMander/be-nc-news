# My Northcoder's News API Project

## <span style="color:limegreen">How To Use</span>

<!-- A link to the hosted version.
A summary of what the project is.
Clear instructions of how to clone, install dependencies, seed local database, and run tests.
Information about how to create the two .env files.
The minimum versions of Node.js, and Postgres needed to run the project. -->

## <span style="color:skyblue">Additional setup required</span>

To run the code you will need to create 2 .env files in the "be-nc-news" directory. Feel free to use the default values within the setup.sql file as the values for the 2 .env files below.

1) The first file will need to be named ".env.development". Its contents should point towards the development database:

`PGDATABASE="<name_of_development_database_here_"`

2) The second file should be named ".env.test". Its contents should should point towards the testing database:

`PGDATABASE="<name_of_testing_database_here>"`

3) Finally make sure to run the setup.sql file. It will have the following format below:

```
DROP DATABASE IF EXISTS <name_of_test_database>;
DROP DATABASE IF EXISTS <name_of_development_database>;

CREATE DATABASE <name_of_test_database>;
CREATE DATABASE <name_of_development_database>;
```
