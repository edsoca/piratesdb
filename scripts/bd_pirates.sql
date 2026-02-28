DROP DATABASE IF EXISTS pirates_DB;
CREATE DATABASE pirates_DB;

USE pirates_DB;

CREATE TABLE islands (
    idIsland  INTEGER AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR (50) NOT NULL,
    surface DOUBLE NOT NULL,
    numberOfBeaches INTEGER NOT NULL,
    population INTEGER NOT NULL);

CREATE TABLE treasures (
    idTreasure  INTEGER AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR (50) NOT NULL,
    goldCoins INTEGER NOT NULL,
    weight DOUBLE NOT NULL,
    idIsland INTEGER,
	FOREIGN KEY (idIsland) REFERENCES islands(idIsland)
	ON DELETE CASCADE ON UPDATE CASCADE);

CREATE TABLE originalMaps (
    idOriginalMap  INTEGER AUTO_INCREMENT PRIMARY KEY,
    scale VARCHAR (50) NOT NULL,
    height DOUBLE NOT NULL,
    width DOUBLE NOT NULL,
    idIsland INTEGER NOT NULL,
	FOREIGN KEY (idIsland) REFERENCES islands(idIsland)
	ON DELETE CASCADE ON UPDATE CASCADE);

CREATE TABLE ships (
    idShip  INTEGER AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR (50) NOT NULL,
    height DOUBLE NOT NULL,
    weight DOUBLE NOT NULL,
    numberOfCanons INTEGER NOT NULL);

CREATE TABLE ships_islands (
    idIsland INTEGER  NOT NULL,
    idShip INTEGER NOT NULL,
   	days INTEGER NOT NULL,
    PRIMARY KEY (idIsland, idShip),
	FOREIGN KEY (idIsland) REFERENCES islands(idIsland)
	ON DELETE CASCADE ON UPDATE CASCADE,
	FOREIGN KEY (idShip) REFERENCES ships(idShip)
	ON DELETE CASCADE ON UPDATE CASCADE);

CREATE TABLE pirates (
    idPirate INTEGER AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
   	age INTEGER NOT NULL,
    height DOUBLE NOT NULL,
    weight DOUBLE NOT NULL,
    numberOfScars INTEGER NOT NULL,
    idShip INTEGER,
	FOREIGN KEY (idShip) REFERENCES ships(idShip)
	ON DELETE CASCADE ON UPDATE CASCADE);

CREATE TABLE fights (
    idPirate1 INTEGER NOT NULL,
	idPirate2 INTEGER NOT NULL,
	PRIMARY KEY (idPirate1, idPirate2),
    FOREIGN KEY (idPirate1) REFERENCES pirates(idPirate)
	ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (idPirate2) REFERENCES pirates(idPirate)
	ON DELETE CASCADE ON UPDATE CASCADE);

CREATE TABLE copyMaps (
    idCopyMap INTEGER NOT NULL,
	idOriginalMap INTEGER NOT NULL,
    date DATE NOT NULL,
    idPirate INTEGER NOT NULL,
	PRIMARY KEY (idCopyMap, idOriginalMap),
    FOREIGN KEY (idOriginalMap) REFERENCES originalMaps(idOriginalMap)
	ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (idPirate) REFERENCES pirates(idPirate)
	ON DELETE CASCADE ON UPDATE CASCADE);

-- =======================================================
-- 2. INSERTS D'ILLES (Islands)
-- =======================================================
INSERT INTO islands (name, surface, numberOfBeaches, population) VALUES
('Crani Somrient', 120.5, 5, 230),         -- ID 1
('Atol del Drac Blau', 340.2, 12, 1200),   -- ID 2
('Tempesta Roja', 89.7, 3, 80),            -- ID 3
('Illa del Barret de Palla', 210.4, 7, 540),
('Cala de les Ombres', 45.3, 2, 0),
('Kraken Rient', 510.9, 15, 3200),
('Arxipèlag del Vent Salat', 600.1, 20, 4100),
('Illa de l’Os Daurat', 98.6, 4, 150),
('Roc Negre', 30.2, 1, 0),
('Illa del Llop de Mar', 275.0, 9, 980),   -- ID 10
('Illa del Sol Partit', 410.7, 11, 2600),
('Illa del Calamar Gegant', 150.8, 6, 430),
('Illa del Cant de Sirena', 190.3, 8, 870),
('Illa dels Mapes Perduts', 60.9, 2, 40),
('Illa del Foc Etern', 720.4, 18, 5100),
('Illa del Núvol Negre', 330.3, 10, 1400),
('Illa del Sabre Corbat', 110.1, 4, 210),
('Illa del Port Tort', 255.6, 9, 1600),
('Illa de la Lluna Trencada', 480.0, 14, 2900),
('Illa del Tresor Callat', 95.5, 3, 65),   -- ID 20
('Illa del Vent Boig', 370.8, 12, 1800),
('Illa del Casc Esberlat', 130.0, 5, 300),
('Illa del Fang Viu', 205.2, 7, 620),
('Illa del Far Antic', 55.4, 2, 25),
('Illa del Martell Roent', 610.6, 16, 4200),
('Illa Oblidada', 12.5, 1, 0),
('Water 7', 430.2, 6, 5000),
('Dressrosa', 390.0, 8, 3200),
('Whole Cake Island', 610.5, 14, 4200),
('Alabasta', 900.0, 4, 8000),              -- ID 30
('Tortuga', 120.5, 4, 2500),
('Isla de Muerta', 50.0, 1, 0),
('Skull Island', 300.2, 2, 50),
('Singapore', 80.0, 10, 5000),
('Rumrunner Isle', 15.5, 1, 5),
('Mêlée Island', 45.0, 1, 500),
('Monkey Island', 100.0, 5, 8),
('Scabb Island', 35.5, 0, 200),
('Blood Island', 60.2, 3, 45);

-- =======================================================
-- 3. INSERTS DE TRESORS (Treasures)
-- =======================================================
-- CORRECCIÓ: Canvi de cometes dobles (") a simples (')
-- CORRECCIÓ: Escapat apòstrofs amb doble '' (Ex: d''Alabasta)
INSERT INTO treasures (name, goldCoins, weight, idIsland) VALUES
('Tresor del Rei Calavera', 5000, 320.5, 1),
('Cofre del Drac Blau', 8200, 540.2, 2),
('Botí de la Tempesta', 1200, 98.4, 3),
('Tresor del Barret Perdut', 4300, 210.0, 4),
('Ombres Daurades', 900, 60.3, 5),
('Tresor del Kraken', 15000, 890.7, 6),
('Or del Vent Salat', 7600, 410.9, 7),
('Cofre de l’Os Antic', 2300, 180.1, 8),
('Tresor de Roc Negre', 400, 45.0, 9),
('Botí del Llop de Mar', 5400, 300.6, 10),
('Sol Daurat', 9800, 620.2, 11),
('Cofre del Calamar', 3100, 200.8, 12),
('Tresor de la Sirena', 2700, 175.5, 13),
('Mapes en Or', 1500, 95.0, 14),
('Tresor del Foc Etern', 20000, 1200.0, 15),
('Ombra del Núvol', 3600, 240.4, 16),
('Cofre del Sabre', 1900, 130.7, 17),
('Tresor del Port Tort', 6100, 350.0, 18),
('Lluna Daurada', 8700, 510.6, 19),
('Tresor Callat', 800, 55.2, 20),
('Vent Boig', 4200, 260.8, 21),
('Casc Antic', 2100, 140.0, 22),
('Or del Fang', 3300, 215.9, 23),
('Far Perdut', 600, 40.5, 24),
('Martell del Nord', 11000, 700.3, 25),
('Tresor del Regne d''Alabasta', 2500, 300.0, (SELECT idIsland FROM islands WHERE name = 'Alabasta' LIMIT 1)),
('Tresor Secret de Dressrosa', 1800, 250.0, (SELECT idIsland FROM islands WHERE name = 'Dressrosa' LIMIT 1)),
('Tresor de Big Mom', 3200, 400.0, (SELECT idIsland FROM islands WHERE name = 'Whole Cake Island' LIMIT 1)),
('Tresor Submergit de Water 7', 900, 150.0, (SELECT idIsland FROM islands WHERE name = 'Water 7' LIMIT 1)),
('Aztec Gold', 882, 50.0, (SELECT idIsland FROM islands WHERE name = 'Isla de Muerta' LIMIT 1)),
('Davy Jones Chest', 450, 10.0, (SELECT idIsland FROM islands WHERE name = 'Skull Island' LIMIT 1)),
('Singapore Spices', 300, 20.0, (SELECT idIsland FROM islands WHERE name = 'Rumrunner Isle' LIMIT 1)),
('Captain Kidds Loot', 600, 40.0, (SELECT idIsland FROM islands WHERE name = 'Tortuga' LIMIT 1)),
('Big Whoop', 10000, 0.0, (SELECT idIsland FROM islands WHERE name = 'Monkey Island' LIMIT 1)),
('Rubber Chicken with Pulley', 5, 1.0, (SELECT idIsland FROM islands WHERE name = 'Mêlée Island' LIMIT 1)),
('Cursed Diamond Ring', 5000, 0.2, (SELECT idIsland FROM islands WHERE name = 'Blood Island' LIMIT 1));

-- =======================================================
-- 4. INSERTS DE MAPES (OriginalMaps)
-- =======================================================
INSERT INTO originalMaps (scale, height, width, idIsland) VALUES
('1:1000', 60, 40, 1),('1:1500', 70, 50, 2),('1:800', 45, 30, 3),('1:1200', 65, 45, 4),('1:500', 30, 20, 5),
('1:2000', 80, 60, 6),('1:1800', 75, 55, 7),('1:900', 50, 35, 8),('1:400', 25, 18, 9),('1:1300', 68, 48, 10),
('1:1600', 72, 52, 11),('1:1100', 63, 43, 12),('1:1400', 69, 49, 13),('1:600', 35, 25, 14),('1:2500', 90, 70, 15),
('1:1700', 74, 54, 16),('1:950', 52, 36, 17),('1:1250', 66, 46, 18),('1:1900', 78, 58, 19),('1:550', 33, 23, 20),
('1:1450', 71, 51, 21),('1:1000', 60, 40, 22),('1:1350', 67, 47, 23),('1:450', 28, 19, 24),('1:2200', 85, 65, 25),('1:3000', 100, 80, 1),
('1:3000', 90.0, 70.0, (SELECT idIsland FROM islands WHERE name = 'Alabasta' LIMIT 1)),
('1:1500', 55.0, 45.0, (SELECT idIsland FROM islands WHERE name = 'Dressrosa' LIMIT 1)),
('1:2000', 80.0, 60.0, (SELECT idIsland FROM islands WHERE name = 'Whole Cake Island' LIMIT 1)),
('1:5000', 50.0, 40.0, (SELECT idIsland FROM islands WHERE name = 'Isla de Muerta' LIMIT 1)),
('1:10000', 100.0, 80.0, (SELECT idIsland FROM islands WHERE name = 'Skull Island' LIMIT 1)),
('1:2000', 30.0, 30.0, (SELECT idIsland FROM islands WHERE name = 'Rumrunner Isle' LIMIT 1)),
('1:100', 20.0, 20.0, (SELECT idIsland FROM islands WHERE name = 'Mêlée Island' LIMIT 1)),
('1:50', 15.0, 15.0, (SELECT idIsland FROM islands WHERE name = 'Monkey Island' LIMIT 1));

-- =======================================================
-- 5. INSERTS DE VAIXELLS (Ships)
-- =======================================================
INSERT INTO ships (name, height, weight, numberOfCanons) VALUES
('La Perla Bruta', 18.5, 120.3, 20),
('El Kraken Rient', 22.0, 180.0, 32),
('La Ventafocs Marina', 16.2, 95.4, 14),
('El Sabre Negre', 19.8, 140.6, 24),
('La Balena Roja', 24.5, 210.8, 40),
('El Drac Salat', 21.0, 165.0, 30),
('La Sirena Boja', 17.9, 110.2, 18),
('El Fantasma Blau', 20.3, 150.7, 26),
('La Tempesta Vella', 23.1, 190.5, 36),
('El Llop dels Mars', 18.0, 125.9, 22),
('La Calavera Daurada', 25.0, 220.0, 44),
('El Barret Trencat', 15.7, 90.3, 12),
('La Fulla Ràpida', 16.8, 105.6, 16),
('El Tro del Nord', 26.2, 240.4, 46),
('La Lluna Sagnant', 21.5, 170.0, 28),
('El Corb Negre', 19.0, 135.8, 24),
('La Brisa Salvatge', 17.3, 108.1, 18),
('El Martell del Mar', 27.0, 260.0, 50),
('La Daga Marina', 16.0, 98.0, 14),
('El Sol Negre', 22.7, 185.2, 34),
('La Marea Fosca', 20.1, 145.0, 26),
('El Trident Perdut', 23.8, 200.4, 38),
('La Rosa del Vent', 18.9, 132.6, 22),
('El Casc Antic', 24.0, 210.0, 40),
('La Fúria Marina', 26.5, 250.5, 48),
('El Silenci Etern', 19.0, 130.0, 20),
('Going Merry', 28.0, 280.0, 0),
('Thousand Sunny', 35.0, 320.0, 0),
('Red Force (vaixell de Shanks)', 42.0, 480.0, 20),
('Saber of Xebec', 48.0, 550.0, 36),
('Black Pearl', 40.0, 180.5, 32),
('Flying Dutchman', 50.0, 400.0, 48),
('Queen Anne\'s Revenge', 45.0, 300.0, 38),
('The Jolly Roger', 25.0, 100.0, 12),
('Silent Mary', 55.0, 350.0, 50),
('The Sea Monkey', 15.0, 80.0, 2),
('LeChucks Demon Ship', 60.0, 500.0, 100),
('The Dainty Lady', 20.0, 90.0, 4);

-- =======================================================
-- 6. INSERTS DE PIRATES (Pirates)
-- =======================================================
INSERT INTO pirates (name, age, height, weight, numberOfScars, idShip) VALUES
('Barret de Palla', 19, 1.72, 68.0, 2, 1),
('Tempesta Roja', 27, 1.68, 62.0, 4, 2),
('Ull de Drac', 35, 1.80, 85.0, 7, 3),
('Sirena d’Acer', 24, 1.65, 59.0, 1, 3),
('Calavera Rient', 41, 1.90, 92.0, 10, 3),
('Lluna Negra', 29, 1.70, 64.0, 3, 5),
('Dents de Ferro', 38, 1.85, 88.0, 8, 7),
('Vent Ràpid', 21, 1.60, 55.0, 0, 8),
('Martell Boig', 44, 1.95, 110.0, 12, 9),
('Rosa del Nord', 26, 1.66, 60.0, 2, 9),
('Corb Blau', 33, 1.78, 75.0, 5, 9),
('Fulla Silenciosa', 22, 1.62, 54.0, 1, 12),
('Trident Roig', 36, 1.83, 82.0, 6, 13),
('Brisa Clara', 20, 1.59, 52.0, 0, 14),
('Casc Trencat', 47, 1.88, 95.0, 11, 15),
('Ombra Rialla', 28, 1.67, 61.0, 3, 15),
('Llop Mut', 39, 1.84, 90.0, 9, 15),
('Daga Ràpida', 23, 1.63, 56.0, 1, 18),
('Sol Cremat', 34, 1.79, 78.0, 5, 19),
('Marea Fosca', 31, 1.71, 66.0, 4, 20),
('Ull Tèrbol', 42, 1.87, 98.0, 10, 21),
('Rosa Negra', 25, 1.64, 58.0, 2, 22),
('Drac Antic', 50, 1.92, 105.0, 15, 23),
('Lluna Pàl·lida', 19, 1.58, 50.0, 0, 24),
('Vent del Sud', 37, 1.82, 83.0, 6, 25),
('Fantasma Pacífic', 40, 1.75, 70.0, 0, 1),
('Monkey D. Luffy', 19, 1.74, 65, 2, (SELECT idShip FROM ships WHERE name = 'Going Merry' LIMIT 1)),
('Roronoa Zoro', 21, 1.81, 85, 7, (SELECT idShip FROM ships WHERE name = 'Going Merry' LIMIT 1)),
('Nami', 20, 1.70, 55, 1, (SELECT idShip FROM ships WHERE name = 'Going Merry' LIMIT 1)),
('Sanji', 21, 1.80, 75, 3, (SELECT idShip FROM ships WHERE name = 'Thousand Sunny' LIMIT 1)),
('Nico Robin', 30, 1.88, 70, 2, (SELECT idShip FROM ships WHERE name = 'Thousand Sunny' LIMIT 1)),
('Jack Sparrow', 40, 1.78, 70.5, 2, (SELECT idShip FROM ships WHERE name = 'Black Pearl' LIMIT 1)),
('Hector Barbossa', 55, 1.80, 75.0, 5, (SELECT idShip FROM ships WHERE name = 'Queen Anne\'s Revenge' LIMIT 1)),
('Will Turner', 25, 1.75, 68.0, 1, (SELECT idShip FROM ships WHERE name = 'Flying Dutchman' LIMIT 1)),
('Elizabeth Swann', 23, 1.70, 55.0, 0, (SELECT idShip FROM ships WHERE name = 'Black Pearl' LIMIT 1)),
('Davy Jones', 150, 1.90, 100.0, 0, (SELECT idShip FROM ships WHERE name = 'Flying Dutchman' LIMIT 1)),
('Mr. Smee', 45, 1.60, 80.0, 0, (SELECT idShip FROM ships WHERE name = 'The Jolly Roger' LIMIT 1)),
('Blackbeard', 60, 1.95, 110.0, 15, (SELECT idShip FROM ships WHERE name = 'Queen Anne\'s Revenge' LIMIT 1)),
('Guybrush Threepwood', 20, 1.80, 70.0, 1, (SELECT idShip FROM ships WHERE name = 'The Sea Monkey' LIMIT 1)),
('Zombie LeChuck', 200, 2.10, 150.0, 50, (SELECT idShip FROM ships WHERE name = 'LeChucks Demon Ship' LIMIT 1)),
('Elaine Marley', 22, 1.75, 60.0, 0, (SELECT idShip FROM ships WHERE name = 'The Sea Monkey' LIMIT 1)),
('Murray the Skull', 500, 0.20, 2.0, 0, (SELECT idShip FROM ships WHERE name = 'LeChucks Demon Ship' LIMIT 1)),
('Stan S. Stanman', 40, 1.85, 75.0, 0, (SELECT idShip FROM ships WHERE name = 'The Sea Monkey' LIMIT 1)),
('Carla The Sword Master', 28, 1.78, 72.0, 3, (SELECT idShip FROM ships WHERE name = 'The Dainty Lady' LIMIT 1));

-- =======================================================
-- 7. RELACIONS VAIXELLS-ILLES
-- =======================================================
INSERT INTO ships_islands (idIsland, idShip, days) VALUES
(1,1,12),(2,1,3),(3,1,5),(2,2,20),(3,3,5),(4,4,14),(5,5,3),(6,6,25),(7,7,18),(8,8,9),(9,9,2),(10,10,16),
(11,11,22),(12,12,8),(13,13,15),(1,13,2),(5,13,1),(2,13,1),(10,13,7),(14,14,4),(15,15,30),(16,16,19),(17,17,7),(18,18,21),(19,19,24),(20,20,6),
(21,21,17),(22,22,10),(25,25,28),(10,25,1),(13,25,2),(1,25,6),
((SELECT idIsland FROM islands WHERE name = 'Water 7' LIMIT 1), (SELECT idShip FROM ships WHERE name = 'Going Merry' LIMIT 1),20),
((SELECT idIsland FROM islands WHERE name = 'Alabasta' LIMIT 1), (SELECT idShip FROM ships WHERE name ='Going Merry' LIMIT 1),15),
((SELECT idIsland FROM islands WHERE name = 'Dressrosa' LIMIT 1), (SELECT idShip FROM ships WHERE name = 'Thousand Sunny' LIMIT 1),18),
((SELECT idIsland FROM islands WHERE name = 'Whole Cake Island' LIMIT 1), (SELECT idShip FROM ships WHERE name = 'Thousand Sunny' LIMIT 1),25),
((SELECT idIsland FROM islands WHERE name = 'Tortuga' LIMIT 1), (SELECT idShip FROM ships WHERE name = 'Black Pearl' LIMIT 1), 15),
((SELECT idIsland FROM islands WHERE name = 'Isla de Muerta' LIMIT 1), (SELECT idShip FROM ships WHERE name = 'Black Pearl' LIMIT 1), 3),
((SELECT idIsland FROM islands WHERE name = 'Skull Island' LIMIT 1), (SELECT idShip FROM ships WHERE name = 'Flying Dutchman' LIMIT 1), 100),
((SELECT idIsland FROM islands WHERE name = 'Singapore' LIMIT 1), (SELECT idShip FROM ships WHERE name = 'Queen Anne\'s Revenge' LIMIT 1), 5),
((SELECT idIsland FROM islands WHERE name = 'Tortuga' LIMIT 1), (SELECT idShip FROM ships WHERE name = 'The Jolly Roger' LIMIT 1), 1),
((SELECT idIsland FROM islands WHERE name = 'Monkey Island' LIMIT 1), (SELECT idShip FROM ships WHERE name = 'The Sea Monkey' LIMIT 1), 3650),
((SELECT idIsland FROM islands WHERE name = 'Mêlée Island' LIMIT 1), (SELECT idShip FROM ships WHERE name = 'LeChucks Demon Ship' LIMIT 1), 50),
((SELECT idIsland FROM islands WHERE name = 'Scabb Island' LIMIT 1), (SELECT idShip FROM ships WHERE name = 'The Dainty Lady' LIMIT 1), 7);

-- =======================================================
-- 8. LLUITES (Fights)
-- =======================================================
INSERT INTO fights (idPirate1, idPirate2) VALUES
(1,2),(3,4),(5,6),(7,8),(9,10),(11,12),(13,14),(15,16),(17,18),(19,20),
(21,22),(23,24),(25,1),(2,3),(4,5),(6,7),(8,9),(10,11),(12,13),(14,15),
(16,17),(18,19),(20,21),(22,23),(24,25),
((SELECT idPirate FROM pirates WHERE name LIKE '%Luffy%' LIMIT 1), (SELECT idPirate FROM pirates WHERE name LIKE '%Zoro%' LIMIT 1)),
((SELECT idPirate FROM pirates WHERE name LIKE '%Luffy%' LIMIT 1), (SELECT idPirate FROM pirates WHERE name = 'Sanji' LIMIT 1)),
((SELECT idPirate FROM pirates WHERE name LIKE '%Zoro%' LIMIT 1), (SELECT idPirate FROM pirates WHERE name = 'Sanji' LIMIT 1)),
((SELECT idPirate FROM pirates WHERE name = 'Nami' LIMIT 1), (SELECT idPirate FROM pirates WHERE name = 'Sanji' LIMIT 1)),
((SELECT idPirate FROM pirates WHERE name = 'Jack Sparrow' LIMIT 1), (SELECT idPirate FROM pirates WHERE name = 'Hector Barbossa' LIMIT 1)),
((SELECT idPirate FROM pirates WHERE name = 'Jack Sparrow' LIMIT 1), (SELECT idPirate FROM pirates WHERE name = 'Will Turner' LIMIT 1)),
((SELECT idPirate FROM pirates WHERE name = 'Will Turner' LIMIT 1), (SELECT idPirate FROM pirates WHERE name = 'Davy Jones' LIMIT 1)),
((SELECT idPirate FROM pirates WHERE name = 'Hector Barbossa' LIMIT 1), (SELECT idPirate FROM pirates WHERE name = 'Blackbeard' LIMIT 1)),
((SELECT idPirate FROM pirates WHERE name = 'Guybrush Threepwood' LIMIT 1), (SELECT idPirate FROM pirates WHERE name = 'Carla The Sword Master' LIMIT 1)),
((SELECT idPirate FROM pirates WHERE name = 'Guybrush Threepwood' LIMIT 1), (SELECT idPirate FROM pirates WHERE name = 'Zombie LeChuck' LIMIT 1)),
((SELECT idPirate FROM pirates WHERE name = 'Elaine Marley' LIMIT 1), (SELECT idPirate FROM pirates WHERE name = 'Zombie LeChuck' LIMIT 1));

-- =======================================================
-- 9. MAPES COPIATS (copyMaps)
-- =======================================================
INSERT INTO copyMaps (idCopyMap, idOriginalMap, date, idPirate) VALUES
(1,1,'2024-01-10',1),(1,2,'2024-01-12',2),(1,3,'2024-01-15',3),(1,4,'2024-01-18',4),(1,5,'2024-01-20',5),
(1,6,'2024-01-22',6),(1,7,'2024-01-25',7),(1,8,'2024-01-27',8),(1,9,'2024-01-30',9),(1,10,'2024-02-01',10),
(2,10,'2024-02-03',11),(3,10,'2024-02-05',12),(1,13,'2024-02-08',13),(1,14,'2024-02-10',14),(1,15,'2024-02-12',15),
(1,16,'2024-02-15',16),(2,16,'2024-02-17',17),(1,18,'2024-02-20',18),(2,18,'2024-02-22',19),(3,18,'2024-02-25',19),
(4,18,'2024-02-27',21),(1,22,'2024-03-01',22),(1,23,'2024-03-03',23),(1,24,'2024-03-05',24),(2,24,'2024-03-08',25),
(1,(SELECT idOriginalMap FROM originalMaps WHERE idIsland = (SELECT idIsland FROM islands WHERE name = 'Alabasta' LIMIT 1) LIMIT 1), '1520-03-01', (SELECT idPirate FROM pirates WHERE name = 'Nami' LIMIT 1)),
(2,(SELECT idOriginalMap FROM originalMaps WHERE idIsland = (SELECT idIsland FROM islands WHERE name = 'Alabasta' LIMIT 1) LIMIT 1), '1525-03-01', (SELECT idPirate FROM pirates WHERE name = 'Nico Robin' LIMIT 1)),
(1,(SELECT idOriginalMap FROM originalMaps WHERE idIsland = (SELECT idIsland FROM islands WHERE name = 'Dressrosa' LIMIT 1) LIMIT 1), '1521-06-18', (SELECT idPirate FROM pirates WHERE name = 'Nico Robin' LIMIT 1)),
(1,(SELECT idOriginalMap FROM originalMaps WHERE idIsland = (SELECT idIsland FROM islands WHERE name = 'Whole Cake Island' LIMIT 1) LIMIT 1), '1522-09-10', (SELECT idPirate FROM pirates WHERE name = 'Sanji' LIMIT 1)),
(1,(SELECT idOriginalMap FROM originalMaps WHERE idIsland = (SELECT idIsland FROM islands WHERE name = 'Isla de Muerta' LIMIT 1) LIMIT 1), '1720-05-10', (SELECT idPirate FROM pirates WHERE name = 'Jack Sparrow' LIMIT 1)),
(1,(SELECT idOriginalMap FROM originalMaps WHERE idIsland = (SELECT idIsland FROM islands WHERE name = 'Skull Island' LIMIT 1) LIMIT 1), '1721-01-01', (SELECT idPirate FROM pirates WHERE name = 'Will Turner' LIMIT 1));

-- 1. Afegim una nova Illa i els Vaixells de la història
INSERT INTO islands (idIsland, name, population, surface) VALUES
(96, 'Illa de la Mitja Lluna', 150, 450.5);

INSERT INTO ships (idShip, name, numberOfCanons, weight) VALUES
(96, 'Xabec Morisc', 12, 120),
(97, 'Vaixell Reial Cristià', 30, 350);

-- 2. Afegim el Tresor (Relació 1:1 exacta amb l'Illa de la Mitja Lluna)
INSERT INTO treasures (idTreasure, name, weight, goldCoins, idIsland) VALUES
(96, 'El Penjoll de la Blanca', 2, 50, 96);

-- 3. Afegim els Personatges (a la taula general de 'pirates')
INSERT INTO pirates (idPirate, name, age, numberOfScars, weight, idShip) VALUES
(96, 'Saïd', 25, 5, 75, 96),
(97, 'Blanca', 20, 0, 55, 96),     -- Navega al Xabec (retinguda)
(98, 'Joanot', 45, 10, 85, 96),    -- El renegat cristià
(99, 'Hassèn', 62, 12, 70, 96),    -- El vell savi
(100, 'Don Carles', 55, 2, 80, 97); -- Persegueix el Xabec amb el vaixell reial