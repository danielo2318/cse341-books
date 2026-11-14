# Books API Week 02 Spec - Version 1

## Feature 1: Book CRUD Operations and Author References

### Goal
Update the existing Week 01 book API so book documents include a reference to an author and the API supports all CRUD operations for books. Every book route must be documented and testable in Swagger.

### Data Model
Book documents will be stored in the `books` collection.

Required book fields:
- `id`: string, required, custom id such as `b1`
- `authorId`: string, required, references the `id` field of an author document
- `title`: string, required
- `publicationDate`: string, required

Books will continue to use custom string ids instead of MongoDB `_id` values for route parameters.

### Relationship to Authors
Each book will identify its author with an `authorId` field. The value of `authorId` must match the custom `id` value of an existing author document.

When creating or updating a book, the API should reject the request with a `400` status code if the submitted `authorId` does not match an existing author.

### Routes

#### GET /books
Purpose: Return all books.

Success:
- Status code: `200`
- Response body: an array of book objects

Errors:
- `500` if an unexpected server or database error occurs

#### GET /books/:id
Purpose: Return one book by its custom id.

Success:
- Status code: `200`
- Response body: the matching book object

Errors:
- `404` if no book exists with that id
- `500` if an unexpected server or database error occurs

#### POST /books
Purpose: Create a new book.

Request body:

    {
      "id": "b4",
      "authorId": "a1",
      "title": "Example Book Title",
      "publicationDate": "2026-01-15"
    }

Success:
- Status code: `201`
- Response body: the newly created book object

Errors:
- `400` if a required field is missing
- `400` if the `id` already exists
- `400` if the `authorId` does not match an existing author
- `500` if an unexpected server or database error occurs

#### PUT /books/:id
Purpose: Update an existing book.

Request body:

    {
      "authorId": "a2",
      "title": "Updated Book Title",
      "publicationDate": "2026-02-20"
    }

Success:
- Status code: `200`
- Response body: the updated book object

Errors:
- `400` if a required field is missing
- `400` if the `authorId` does not match an existing author
- `404` if no book exists with that id
- `500` if an unexpected server or database error occurs

#### DELETE /books/:id
Purpose: Delete an existing book.

Success:
- Status code: `204`
- Response body: none

Errors:
- `404` if no book exists with that id
- `500` if an unexpected server or database error occurs

### Swagger Documentation
Swagger must document every book route.

### Deployment Expectations
After implementation, the book routes must work locally and from the deployed Render application. The deployed Swagger page at `/api-docs` must allow someone to test every book route from the browser.

## Feature 2: Author CRUD Operations

TODO: Follow the example above to complete a spec for the authors feature.







# Books & Authors API Week 02 Spec - Version 2

## Overview
This specification documents the complete CRUD operations, database relationships, status codes, and error-handling strategies for the Books and Authors API (Week 02).

---

## Feature 1: Book CRUD Operations and Author References

### Goal
Extend the existing Books API to support full CRUD operations (`GET`, `POST`, `PUT`, `DELETE`). Replace inline author names with an `authorId` reference pointing to an existing author document. Ensure all endpoints are documented and testable via Swagger UI (`/api-docs`).

### Data Model
Book documents are stored in the `books` collection.

**Required Fields:**
- `id`: string, required, custom unique identifier (e.g., `"b1"`).
- `authorId`: string, required, references the `id` field of a document in the `authors` collection.
- `title`: string, required, non-empty.
- `publicationDate`: string, required, valid ISO date format (`YYYY-MM-DD`).

### Relationship to Authors
Each book maintains a logical reference to an author via `authorId`. 
- When creating (`POST`) or updating (`PUT`) a book, the API verifies that `authorId` corresponds to an existing author document in the `authors` collection.
- If the referenced `authorId` does not exist, the API rejects the request with a `400 Bad Request` status code.

### Routes

#### GET /books
- **Purpose:** Retrieve all books.
- **Success Response:**
  - Code: `200 OK`
  - Body: Array of book objects.
- **Error Responses:**
  - Code: `500 Internal Server Error`: `{ "message": "Unable to retrieve books" }`

#### GET /books/:id
- **Purpose:** Retrieve a single book by its custom string `id`.
- **Success Response:**
  - Code: `200 OK`
  - Body: Book object.
- **Error Responses:**
  - Code: `404 Not Found`: `{ "message": "Book not found" }`
  - Code: `500 Internal Server Error`: `{ "message": "Unable to retrieve book" }`

#### POST /books
- **Purpose:** Create a new book.
- **Request Body:**
  ```json
  {
    "id": "b4",
    "authorId": "a1",
    "title": "Cien años de soledad",
    "publicationDate": "1967-05-30"
  }

  Success Response:

Code: 201 Created

Body: The newly created book object.

Error Responses:

Code: 400 Bad Request: { "message": "Missing required fields: id, authorId, title, and publicationDate are required" }

Code: 400 Bad Request: { "message": "Book ID already exists" }

Code: 400 Bad Request: { "message": "Referenced authorId does not exist" }

Code: 500 Internal Server Error: { "message": "Unable to create book" }

### PUT /books/:id
Purpose: Update an existing book's details.

Request Body:

JSON
{
  "authorId": "a1",
  "title": "Cien años de soledad (Edición Especial)",
  "publicationDate": "1967-05-30"
}
Success Response:

Code: 200 OK

Body: The updated book object.

Error Responses:

Code: 400 Bad Request: { "message": "Missing required fields" }

Code: 400 Bad Request: { "message": "Referenced authorId does not exist" }

Code: 404 Not Found: { "message": "Book not found" }

Code: 500 Internal Server Error: { "message": "Unable to update book" }

DELETE /books/:id
Purpose: Delete a book by its custom id.

Success Response:

Code: 204 No Content

Body: None.

Error Responses:

Code: 404 Not Found: { "message": "Book not found" }

Code: 500 Internal Server Error: { "message": "Unable to delete book" }

Feature 2: Author CRUD Operations
Goal
Implement a dedicated authors collection supporting full CRUD operations (GET, POST, PUT, DELETE). Enforce referential integrity when attempting to delete authors with associated books. Ensure full Swagger documentation at /api-docs.

Data Model
Author documents are stored in the authors collection.

Required Fields:

id: string, required, custom unique identifier (e.g., "a1").

name: string, required, non-empty author full name.

birthYear: number, required, integer representing the birth year.

Referential Integrity on Deletion
To prevent orphaned book references:

Before deleting an author via DELETE /authors/:id, the API checks if any book in the books collection has an authorId matching the author's id.

If one or more books reference the author, the deletion is blocked, returning a 400 Bad Request status code.

Routes
GET /authors
Purpose: Retrieve all authors.

Success Response:

Code: 200 OK

Body: Array of author objects.

Error Responses:

Code: 500 Internal Server Error: { "message": "Unable to retrieve authors" }

GET /authors/:id
Purpose: Retrieve a single author by custom string id.

Success Response:

Code: 200 OK

Body: Author object.

Error Responses:

Code: 404 Not Found: { "message": "Author not found" }

Code: 500 Internal Server Error: { "message": "Unable to retrieve author" }

POST /authors
Purpose: Create a new author.

Request Body:

JSON
{
  "id": "a3",
  "name": "Jorge Luis Borges",
  "birthYear": 1899
}
Success Response:

Code: 201 Created

Body: The newly created author object.

Error Responses:

Code: 400 Bad Request: { "message": "Missing required fields: id, name, and birthYear are required" }

Code: 400 Bad Request: { "message": "Author ID already exists" }

Code: 500 Internal Server Error: { "message": "Unable to create author" }

PUT /authors/:id
Purpose: Update an existing author.

Request Body:

JSON
{
  "name": "Jorge Luis Borges",
  "birthYear": 1899
}
Success Response:

Code: 200 OK

Body: The updated author object.

Error Responses:

Code: 400 Bad Request: { "message": "Missing required fields" }

Code: 404 Not Found: { "message": "Author not found" }

Code: 500 Internal Server Error: { "message": "Unable to update author" }

DELETE /authors/:id
Purpose: Delete an author by custom string id.

Success Response:

Code: 204 No Content

Body: None.

Error Responses:

Code: 400 Bad Request: { "message": "Cannot delete author with associated books. Remove or reassign the books first." }

Code: 404 Not Found: { "message": "Author not found" }

Code: 500 Internal Server Error: { "message": "Unable to delete author" }

Swagger Documentation Strategy
OpenAPI 3.0.0 syntax is used across all route controllers/routers (src/router.js or dedicated router modules).

Each route defines tags (Books or Authors), parameters, JSON request body schemas, and explicit HTTP response status codes (200, 201, 204, 400, 404, 500).