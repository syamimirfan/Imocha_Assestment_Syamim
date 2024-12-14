# ALL PROJECT IS RUNNING ON THE LOCALHOST / LOCAL SERVER

# NOT MUCH TIME TO SETUP THE HOST

## Test Description

This project allows users to enter their personal information, including name, date of birth, address, postcode, and state. The system then uses the postcode to automatically fill in the state field. When the form is submitted, the information is sent to the backend, where it is stored in a MySQL database.

## Features

- **Form validation**: Ensures that all fields are filled in before submitting the form.
- **Postcode to State mapping**: The state is auto-filled based on the postcode entered by the user.
- **Backend with MySQL database**: The customer data is saved to the database with state information derived from the postcode.
- **AJAX integration**: The frontend communicates with the backend using AJAX for smooth, asynchronous data submission and retrieval.

## Technologies Used

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js, Express
- **Database**: MySQL, Laragon, Apache
- **API TEST**: Imsonia or Postman
- **AJAX**: Fetch API
- **Cryptography**: SHA256 (for generating random customer IDs)

## Installation And Running Instructions

- **Laragon**: Install laragon at https://laragon.org/download/
- **PHPMyAdmin**: Make a PHPMyAdmin for database server
- **Import the file**: Import the imocha.sql file to start the database
- **Run the backend**: npm start
- **Run the frontend**: Install Live Server on VS Code extension and Right click at index.html file and click Open at Live Server
