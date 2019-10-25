# cart-app-cc-validator

- This project is a typical credit card validator used on a cart app to pay for Items purchased.
- This project fetches it's details from this Api: https://randomapi.com/api/006b08a801d82d0c9824dcfdfdfa3b3c
- it then displays the fetched details. it displays the Price to be paid for items in the users country (matching an array of countries with their corresponding currency and code) using the JavaScript in-built toLocaleString() function.
- The project includes speak() method of the speechSynthesis. used on click of the Formatted bill.

-It then allows a user to input credit card details (Card Number, Name and Surname, Expiry date). It then checks for the Validity of these fields and flags them as valid or invalid accordingly.

- The credit card validator was achieved using Luhn algorithm (see https://en.wikipedia.org/wiki/Luhn_algorithm for insight)

- This project is subject to refactoring and possible addition of features.

# Technologies Used
- HTML
-	CSS
-	JavaScript

# Tools
- Vs Code editor
- Git Version control
