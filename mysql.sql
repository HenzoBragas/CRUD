CREATE DATABASE card;
use card;
CREATE TABLE numbercard(
	idNumber INT PRIMARY KEY AUTO_INCREMENT,
    cardNumber INT NOT NULL,
    cardHolder VARCHAR(50) NOT NULL,
    expirationMonth INT NOT NULL,
    expirationYear INT NOT NULL,
    cvv INT(3) NOT NULL
);