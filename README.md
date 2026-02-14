# Newton Video Games Catalogue

## Design Choices

### Business Rules & Optimistic Concurrency

The assignment scope is intentionally simple. To demonstrate realistic
backend behavior and enable meaningful unit testing, I added lightweight
business rules, including optimistic concurrency control.

This provides non-trivial scenarios beyond basic CRUD and reflects
patterns commonly used in production systems.

### Data Seeding

The database is automatically seeded with representative data on
startup. This allows proper testing of: - Paging - Sorting - Search

The seed ensures the UI behaves correctly under realistic data volume.

### Testing Strategy

The project includes testing at multiple levels: - **Backend unit
tests** focused on business logic and concurrency scenarios - **Angular
unit tests** for component behavior - **End-to-end tests** validating
critical user flows

The goal was to demonstrate testing across logic, component, and full
integration levels --- not only isolated mocks.

------------------------------------------------------------------------

## How to Run

From the src folder:

``` powershell
.\start.ps1
```

This script will: - Start the backend using the HTTPS launch profile -
Ensure the database is created and seeded - Install frontend
dependencies if needed - Start the Angular development server

The application will be available at: - Frontend:
http://localhost:4200 - Backend (Swagger):
https://localhost:7258/swagger

------------------------------------------------------------------------

## Alternative Manual Run

Backend: - Open the API project in Visual Studio - Run using the
**https** launch profile

Frontend (from `src/web`):

``` bash
npm ci
npm start
```

------------------------------------------------------------------------

No additional setup is required. The database is created automatically
using SQL Server LocalDB.
