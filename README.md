# Contacts CRUD API

A simple REST API for storing contacts(people, not lenses)

## Usage
*Note: To run the server, [Node.js](http://nodejs.org) and [npm](https://npmjs.com) must be installed.*

### Setup
Clone the repo:
```bash
$ git clone git@github.com:rigganhart/contacts-crud-api.git
```

Install dependencies:
```bash
$ npm install
```

Start the server:
```bash
$ npm start
```

Specify API_PORT with env vars (see `config.js` for other env var options): 
```bash
$ API_PORT=4000 node index.js
```

On first startup the server will create a new [nedb]() embeded datastore that will persist in memory.

By default the server will listen on `localhost:3000` TODO: add a config or something for host/port listneing

### Endpoints
TODO: add example calls for each endpoint
GET /contacts - Retrieve a list of all contacts
Example Call:
```bash
$ curl -X GET \
    http://localhost:3000/contacts \
    -H 'cache-control: no-cache'
```
POST /contacts - Create a new contact uses an autosequence function to auto imcrement the id
```bash
$ curl -X POST \
    http://localhost:3000/contacts \
    -H 'Content-Type: application/json' \
    -H 'cache-control: no-cache' \
    -d '{
    "name": {
      "first": "George",
      "last":"Washington"
    },
    "address": {
      "street": "3200 Mount Vernon Memorial Hwy",
      "city": "Mount Vernon",
      "state": "VA",
      "zip": "22121"
    },
    "phone": [
      {
        "number": "(555)-555-5555",
        "type": "home"
      }
    ],
    "email": "firstFoundingFather@presidents.com"
    }'
```

PUT /contacts/{id} - Update a single contact by id
```bash
$ curl -X PUT \
    http://localhost:3000/contacts/1 \
    -H 'Content-Type: application/json' \
    -H 'cache-control: no-cache' \
    -d '{
    "name": {
      "first": "George",
      "last":"Washington"
    },
    "address": {
      "street": "1600 Pensylvania Ave",
      "city": "Washington",
      "state": "DC",
      "zip": "20500"
    },
    "phone": [
      {
        "number": "(555)-555-5555",
        "type": "home"
      }
    ],
    "email": "firstFoundingFather@presidents.com"
  }'
```

GET /contacts/{id} - Retreive a single contact by id
Example Call for 3rd id:
```bash
$ curl -X GET \
    http://localhost:3000/contacts/3 \
    -H 'cache-control: no-cache'
```

DELETE /contatcs/{id} - Delete a single contact by id
```bash
$ curl -X DELETE \
    http://localhost:3000/contacts/1 \
    -H 'cache-control: no-cache'
```

## Development

### Technologies Used And Why
[Fastify]() - "Try something new". I always enjoy learning a new framework, this seemd like a good time. I use Hapi.js at work and ive used Express.js before
[Nedb]() - It was strongly recomended, and for a simple use case it was nice to experiment with.
[Jest]() - I use this at work, and did not feel like going through syntax challenges between different test suites
[Standard]() - I saw this in the docs for Fastify CLI and thought it had some interesting straightforward ideas.

### Routes
Fastify requires routes to be setup as a specific type of plugin: [Fastify - Routes]()
All Routes are in the `/routes` directory and all route specific logic should be handled in each specific route file. 
Should route logic become too complex for the handler function in the route file, each route should become its own directory exporting the route pulgin object with seperate files for broken out logic.

### Plugins
[Fastify Plugins]() are where the shared code for all the routes live.
In these plugins we are able to decorate the fastify request object with our shared code.
This is a great place for datasource connections/creation.
If you feel like multiple routes need some shared logic plugins is where to keep that logic.

### Testing
Jest is the chosen test framework

Test files are located in the test directory in each directory - this is simply a personal preference over a single test directory

run all tests
```bash
$ npm test
```
run a test for a single file
```bash
$ npm run test-file /path/to/test/file.test.js
```

### Linting
[![JavaScript Style Guide](https://cdn.rawgit.com/standard/standard/master/badge.svg)](https://github.com/standard/standard)
I like the line in the docs about never arguing about code style on a PR again....
*Note: I did need to add to package.json some ignores due to jest adding test functions to global scope*

Run the linter
```bash
$ npm run lint
```

Run fixes(some fixes have to be done manually)
```bash
$ npm run fix
```

### Datastores
Nedb creates single datastores that act like single limited mongoDB collections.
To make a new "collection", add a new plugin similar to the contact db plugin `/plugins/db.js`
In the `path.resolve` function pass the string `'datasources/{datasource name}.db'`
use fasitfy decorators to add the datastore to the fastify server, or to fastify request
