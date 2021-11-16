# Video Game Back End

## Routes 

- user
- game 
- report
- review

### user
- POST /register - create a new user
- POST /login - login existing user
- GET / - get user info ordered by offences(for admin)
- DELETE /:id - delete user by id

### game
- POST / - create a new game
- PUT /:id - update game by id
- DELETE /:id - delete game by id
- GET /genre/:genre - get game by genre
- GET /title/:title - get game by title
- GET /platform/:platform - get game by platform

### report 
- POST / - create a new report
- PUT /:id - update report by id

### review
- POST / - create a new review
- PUT, GET, DELETE /id/:id - update, get or delete a review by id
- GET /user - get reviews for user identified by token
