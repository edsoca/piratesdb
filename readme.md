# Joc Consultes BD Pirata

# 🏴‍☠️ MANUAL DEL MESTRE PIRATA: Guia Docent de la Plataforma SQL

Benvinguts, mestres navegants! Aquest document explica l'arquitectura de la nostra plataforma d'aprenentatge gamificada. Aquí trobareu com navegar per les diferents pàgines, com funciona el motor del joc i, el més important, com crear les vostres pròpies aventures i exàmens des del tauler d'administració.

## 🗺️ 1. Mapa de Navegació (Les Pàgines de la Web)

El projecte està format per diverses pantalles que es connecten en temps real gràcies a Firebase.

- [https://pirates.descodifi.cat/](https://pirates.descodifi.cat/)
    - **(El Camp de Batalla):** És la pàgina on juguen els alumnes. Mostra la història, el temps restant i els enigmes a resoldre.
        - *Com s'hi accedeix?* Els alumnes hi poden entrar directament i la mateixa web els demanarà el "Codi del tresor" (ID del repte). Com a professor, també els pots donar l'enllaç directe afegint-hi el paràmetre, per exemple: `index.html?repte=repte_onepiece`.
- [https://pirates.descodifi.cat/monitor.html](https://pirates.descodifi.cat/monitor.html)
    - **(La Torre de Guaita):** Tauler dissenyat per projectar-se a la pissarra. Mostra en viu les vides, el temps i el progrés (barra de percentatge) de cada alumne/equip connectat. S’haurà d’introduir l’ID del repte a quina hora ha començat el repte (i abans que es connectin).
- [https://pirates.descodifi.cat/admin.html](https://pirates.descodifi.cat/admin.html)
    - **(La Cabina del Capità):** L'eina de creació. Un formulari visual on els professors poden crear reptes nous o editar-ne d'existents. Envia les dades directament a la base de dades.
- [https://pirates.descodifi.cat/assoliments.html](https://pirates.descodifi.cat/assoliments.html)
    - **(La Sala del Tresor):** L'àlbum virtual on cada grumet pot veure les enganxines que ha desbloquejat superant els diferents reptes.

---

## 🛠️ 2. Guia Pas a Pas: Com Crear un Nou Repte

Crear un examen camuflat de "El Senyor dels Anells", "Harry Potter" o qualsevol altra temàtica és molt senzill. No cal tocar codi, només heu de seguir aquests passos:

1. **Prepareu les consultes (SQL):** Dissenyeu les consultes que els alumnes hauran de resoldre. Recordeu que la consulta de l'alumne ha de retornar **un únic valor exacte** (una paraula, un número) usant clàusules com `LIMIT 1`.
2. **Obriu `admin.html` al navegador.**
3. Quan entreu, us demanarà unes credencials:
    
    > **usuari**: `capita`
    **contrasenya**: `piratesDB`
    > 
4. **Escriviu l'ID del repte:** A dalt de tot, poseu un identificador únic en minúscules i sense espais (ex: `repte_anells`). Si voleu modificar un repte existent, escriviu el seu ID i cliqueu a **"CARREGAR EXISTENT"**.
5. **Ompliu les dades generals:** * Títol, Temps Límite (en segons) i la Història inicial (podeu posar-hi etiquetes HTML bàsiques com `<b>` o `<br>`).
6. **Configureu l'Assoliment (Enganxina):**
    - Poseu-li un nom, una descripció èpica i assegureu-vos d'haver guardat prèviament la imatge a la vostra carpeta local i indicar-ne la ruta (ex: `img/logro_anells.png`).
7. **Afegiu els Enigmes (Nivells):**
    - Cliqueu a **"+ AFEGIR NOU ENIGMA"** per cada pregunta.
    - Escriviu el títol del nivell, l'enunciat explicant què han de buscar i **la solució en text pla** (l'ordinador ja s'encarregarà d'encriptar-la per vosaltres).
8. **Pugeu-ho al servidor:**
    - Un cop revisat, cliqueu el gran botó verd **"ENTERRA EL TRESOR (GUARDAR)"**. Si tot va bé, us sortirà un avís de confirmació i el repte ja estarà en línia a Firebase.
9. **Repartiu el mapa:** Compartiu amb els alumnes l'enllaç de joc: `index.html?repte=repte_anells`.

---

# 🏴‍☠️ Base de Dades Pirates: Reptes SQL

A continuació es mostren els reptes que ja hi ha creats, ordenats per la dificultat de les clàusules i estructures SQL necessàries per resoldre'ls.

| **Nom del repte** | **Codi del repte** | **Resum del tipus de consultes (Progressió de dificultat)** |
| --- | --- | --- |
| **El Misteri de l'Illa del Mico** | `illa-del-mico` | Consultes bàsiques centrades en l'ús de **SELECT**, **FROM** i la clàusula **WHERE** per buscar dades exactes. |
| **Retorn a Mai Més** | `repte_peterpan` | Reforç del **SELECT**, **FROM** i **WHERE**, incrementant la complexitat lògica amb **AND/OR**, i els operadors *BETWEEN* i *IN*. |
| **La Maledicció de la Perla Negra** | `malediccio-perla-negra` | Utilitza **SELECT**, **FROM**, **WHERE**, i introdueix les clàusules **ORDER BY** i **LIMIT** per trobar extrems. |
| **Rumb al Nou Món** | `repte_onepiece` | Combina totes les clàusules anteriors (**SELECT -> FROM -> ORDER BY -> LIMIT -> WHERE -> AND/OR**). |
| **Xef de Dades de Fondo de Bikini** | `repte_bikini` | Funcions d'agregació (SUM, MIN, AVG). Afegeix **GROUP BY** i **HAVING** per filtrar grups, juntament amb **ORDER BY** i **LIMIT**. |
| **Simbad i el Llibre de la Pau** | `repte_simbad` | Iniciació a l'enllaç de dades. Utilitza el **JOIN simple** per relacionar taules juntament amb **WHERE** i **AND/OR**. |
| **L'Herència de Flint** | `repte_hispaniola` | Domini de les relacions. Es basa fonamentalment en l'art d'utilitzar el **JOIN simple** i avança cap als enllaços entre múltiples taules. |
| **La Recerca de Westley i el Secret de Florin** | `repte_princesa_promesa` | Passos avançats en els enllaços. Utilitza **JOIN simple** i introdueix els *OUTER JOINs* (consultes multitaula per trobar elements sense correspondència). |
| **El Diari de Sang del Navegant Cec** | `diari_sang` | Incrementa la dificultat barrejant el **JOIN múltiple** i les primeres nocions de **subconsultes** bàsiques. |
| **Mestre Navegant** | `repte_maricel` | Combina les agrupacions i els enllaços. Treballa amb **GROUP BY**, **JOIN múltiple** i **subconsultes** a la clàusula FROM o WHERE. |
| **La Ruta cap a Laugh Tale** | `repte_onepiece_2` | Domini pràcticament absolut dels enllaços i consultes niuades. Usa **JOIN múltiple** i **subconsultes** complexes. |
| **El Misteri del Dobló de Ferro** | `goonies` | Repte global: aplica **GROUP BY** i **HAVING**, passant per **JOIN múltiple** i **subconsultes**. |
| **L'Últim Alè de LeChuck** | `repte_illa_mico_2` | El nivell màxim. Implica **subconsultes correlacionades** i càlculs analítics avançats. |

---

## ⚙️ 4. El Motor del Joc i la Seguretat Màgica

<aside>
⚠️

Tota la informació de les aventures està emmagatzemada a **Firebase Realtime Database**. El sistema compta amb un mecanisme antiboicot per evitar que els alumnes llegeixin les solucions al codi font:

- **Encriptació Automàtica:** Quan un professor crea una pregunta a `admin.html`, només ha d'escriure la solució en text normal (ex: `Skull Island`). En clicar a "Guardar", l'script `admin.js` detecta si el text té 50 caràcters o menys i **ho converteix automàticament a un codi xifrat** (Hash SHA-256) abans de pujar-ho.
- **Edició Segura:** Si més endavant carregueu un repte per editar una errata, les solucions ja estaran xifrades (seran un text llarguíssim). Com que tenen més de 50 caràcters, el sistema sabrà que ja són un Hash i no les tornarà a encriptar!
</aside>

## 🖍️ Solucions

**🏝️ 1. El Misteri de l'Illa del Mico (`illa-del-mico`)**

| nivell | consulta SQL | solució |
| --- | --- | --- |
| Nivell 1 | `SELECT numberOfScars FROM pirates WHERE name = 'Carla The Sword Master';` | 3 |
| Nivell 2 | `SELECT weight FROM ships WHERE name = 'The Sea Monkey';` | 80 |
| Nivell 3 | `SELECT numberOfCanons FROM ships WHERE name = 'LeChucks Demon Ship';` | 100 |
| Nivell 4 | `SELECT idIsland FROM treasures WHERE name = 'Rubber Chicken with Pulley';` | 36 |
| Nivell 5 | `SELECT weight FROM pirates WHERE name = 'Murray the Skull';` | 2.0 |
| Nivell 6 | `SELECT name FROM treasures WHERE goldCoins = 10000;` (→ B) <br> `SELECT numberOfBeaches FROM islands WHERE name = 'Tortuga';` (→ 4) | Monkey Island |

**🏴‍☠️ 2. La Maledicció de la Perla Negra (`malediccio-perla-negra`)**

| nivell | consulta SQL | solució |
| --- | --- | --- |
| Nivell 1 | `SELECT numberOfCanons FROM ships WHERE name = 'Black Pearl';` | 32 |
| Nivell 2 | `SELECT numberOfScars FROM pirates WHERE name LIKE '%ssa%';` | 5 |
| Nivell 3 | `SELECT i.name FROM islands i JOIN treasures t ON i.idIsland = t.idIsland WHERE t.name = 'Davy Jones Chest';` | Skull Island |
| Nivell 4 | `SELECT ROUND(population/surface, 2) FROM islands WHERE name = 'Tortuga';` | 20.75 |
| Nivell 5 | `SELECT COUNT(*) FROM pirates WHERE idShip = (SELECT idShip FROM ships WHERE name = "Queen Anne's Revenge");` | 2 |
| Nivell 6 | `SELECT name FROM pirates WHERE idShip = (SELECT idShip FROM ships WHERE name = "Queen Anne's Revenge") ORDER BY numberOfScars DESC LIMIT 1;` | Blackbeard |

**🧚 3. Retorn a Mai Més (`repte_peterpan`)**

| nivell | consulta SQL | solució |
| --- | --- | --- |
| Nivell 1 | `SELECT name FROM pirates WHERE age = 45 AND numberOfScars = 0;` | Mr. Smee |
| Nivell 2 | `SELECT name FROM ships WHERE numberOfCanons BETWEEN 10 AND 15 AND weight = 100;` | The Jolly Roger |
| Nivell 3 | `SELECT name FROM pirates WHERE numberOfScars = 5 AND (weight > 105 OR age > 50);` | Hector Barbossa |
| Nivell 4 | `SELECT name FROM islands WHERE population IN (50, 5, 8) AND surface > 200;` | Skull Island |
| Nivell 5 | `SELECT name FROM treasures WHERE weight BETWEEN 5 AND 50 AND goldCoins IN (450, 300);` | Davy Jones Chest |

**🍩 4. L'Abordatge de Fondo de Bikini (`repte_bikini`)**

| nivell | consulta SQL | solució |
| --- | --- | --- |
| Nivell 1 | `SELECT COUNT(*) FROM pirates WHERE idShip = (SELECT idShip FROM ships WHERE name = 'The Patty Wagon');` | 4 |
| Nivell 2 | `SELECT SUM(goldCoins) FROM treasures GROUP BY idIsland ORDER BY goldCoins DESC LIMIT 1;` | 1000500 |
| Nivell 3 | `SELECT ROUND(AVG(age), 1) FROM pirates GROUP BY idShip ORDER BY 1 ASC LIMIT 1;` | 19.0 |
| Nivell 4 | `SELECT MIN(weight) FROM pirates GROUP BY idShip HAVING COUNT(*) > 1 ORDER BY 1 ASC LIMIT 1;` | 0.5 |
| Nivell 5 | `SELECT MAX(numberOfScars) FROM pirates GROUP BY idShip HAVING AVG(age) < 30 ORDER BY 1 DESC LIMIT 1;` | 7 |
| Nivell 6 | (Coordenada F7 basat en vaixell de 48 canons/400kg i pirates amb 2 cicatrius/alçada < 2) | Illa del Calamar Gegant |

**🌊 5. Rumb al Nou Món (`repte_onepiece`)**

| nivell | consulta SQL | solució |
| --- | --- | --- |
| Nivell 1 | `SELECT age FROM pirates WHERE name = 'Monkey D. Luffy';` | 19 |
| Nivell 2 | `SELECT weight FROM ships WHERE name LIKE 'T%' AND numberOfCanons = 0;` | 320 |
| Nivell 3 | `SELECT name FROM ships WHERE numberOfCanons = 0 ORDER BY weight DESC LIMIT 1;` | Thousand Sunny |
| Nivell 4 | `SELECT idShip FROM pirates GROUP BY idShip HAVING AVG(age) = 21;` | 8 |
| Nivell 5 | `SELECT numberOfScars FROM pirates GROUP BY numberOfScars HAVING COUNT(*) = 3;` | 3 |
| Nivell 6 | `SELECT name FROM islands WHERE surface > 500 AND population > 5000 ORDER BY numberOfBeaches DESC LIMIT 1;` | Illa del Foc Etern |

**🍩 6. El Misteri del Dobló de Ferro (`goonies`)**

| nivell | consulta SQL | solució |
| --- | --- | --- |
| Nivell 1 | `SELECT p.name FROM originalMaps om JOIN copyMaps cm USING (idOriginalMap) JOIN pirates p USING (idPirate) GROUP BY p.name ORDER BY 2 DESC, age ASC LIMIT 1;` | Nico Robin |
| Nivell 2 | (Coordenada D2 basat en pirata de 100kg i pirates de més de 400 anys) | Illa del Far Antic |
| Nivell 3 | `SELECT weight FROM treasures WHERE idIsland = (SELECT idIsland FROM islands WHERE NAME LIKE '%Far%');` | 40.5 |
| Nivell 4 | `SELECT SUM(goldCoins) FROM treasures WHERE idIsland IN (SELECT idIsland FROM islands WHERE numberOfBeaches = 1);` | 6587 |
| Nivell 5 | `SELECT name FROM ships ORDER BY (SELECT SUM(days) FROM ships_islands WHERE idShip = ships.idShip) DESC LIMIT 1;` | The Sea Monkey |
| Nivell 6 | `SELECT name FROM pirates WHERE idShip = (SELECT idShip FROM ships WHERE NAME = 'Queen Anne\'s Revenge') AND numberOfScars = (SELECT numberOfScars FROM pirates WHERE NAME = 'Drac Antic');` | Blackbeard |

**🔱 7. Simbad i el Llibre de la Pau (`repte_simbad`)**

| nivell | consulta SQL | solució |
| --- | --- | --- |
| Nivell 1 | `SELECT name FROM pirates WHERE idShip = (SELECT idShip FROM ships WHERE name = 'El Quimera') ORDER BY age DESC LIMIT 1;` | Kale |
| Nivell 2 | `SELECT days FROM ships_islands WHERE idIsland = (SELECT idIsland FROM islands WHERE name = 'Illa de la Balena');` | 1 |
| Nivell 3 | `SELECT i.name FROM islands i JOIN treasures t ON i.idIsland = t.idIsland WHERE t.weight BETWEEN 100 AND 250 ORDER BY goldCoins DESC LIMIT 1;` | Vall dels Diamants |
| Nivell 4 | `SELECT scale FROM originalMaps WHERE idIsland = (SELECT idIsland FROM islands WHERE name = 'Tartarus');` | 1:5000 |
| Nivell 5 | `SELECT p.name FROM pirates p JOIN ships s ON p.idShip = s.idShip WHERE p.numberOfScars = 0 AND s.numberOfCanons = 30;` | Eris |

**🩸 8. El Diari de Sang del Navegant Cec (`diari_sang`)**

| nivell | consulta SQL | solució |
| --- | --- | --- |
| Nivell 1 | `SELECT name FROM ships ORDER BY numberOfCanons DESC LIMIT 1;` | LeChucks Demon Ship |
| Nivell 2 | `SELECT goldCoins FROM treasures WHERE idIsland = (SELECT idIsland FROM islands WHERE name = 'Isla de Muerta');` | 882 |
| Nivell 3 | `SELECT name FROM islands WHERE population = 50;` | Skull Island |
| Nivell 4 | `SELECT numberOfBeaches FROM islands WHERE name = 'Monkey Island';` | 5 |
| Nivell 5 | `SELECT p.name FROM pirates p JOIN copyMaps cm ON p.idPirate = cm.idPirate JOIN originalMaps om ON cm.idOriginalMap = om.idOriginalMap WHERE om.scale = '1:10000';` | Will Turner |
| Nivell 6 | `SELECT name FROM treasures WHERE idIsland = (SELECT idIsland FROM islands WHERE name = 'Monkey Island');` | Big Whoop |
| Nivell 7 | `SELECT days FROM ships_islands WHERE idShip = 37 AND idIsland = 38;` | 50 |

**⚔️ 9. L'Herència del Capità Flint (`repte_hispaniola`)**

| nivell | consulta SQL | solució |
| --- | --- | --- |
| Nivell 1 | `SELECT scale FROM originalMaps om JOIN islands i ON om.idIsland = i.idIsland WHERE i.name LIKE '%llat%';` | 1:550 |
| Nivell 2 | `SELECT p.name FROM pirates p JOIN ships s ON p.idShip = s.idShip WHERE s.name = 'La Rosa del Vent';` | Drac Antic |
| Nivell 3 | `SELECT s.name FROM ships s JOIN ships_islands si ON s.idShip = si.idShip WHERE si.idIsland = (SELECT idIsland FROM islands WHERE name = 'Illa del Tresor Callat');` | El Sol Negre |
| Nivell 4 | `SELECT p.name FROM pirates p JOIN copymaps cm USING(idPirate) JOIN originalmaps om USING (idOriginalMap) JOIN islands i USING (idIsland) WHERE i.name = 'Illa del Tresor Callat';` | Ull Tèrbol |
| Nivell 5 | `SELECT t.weight*t.goldCoins FROM treasures t JOIN islands i USING (idIsland) WHERE i.name = 'Illa del Tresor Callat';` | 44160 |

**🕌 10. L'Abordatge Morisc (`repte_maricel`)**

| nivell | consulta SQL | solució |
| --- | --- | --- |
| Nivell 1 | `SELECT name FROM pirates WHERE idShip = (SELECT idShip FROM ships WHERE name = 'Xabec Morisc') ORDER BY numberOfScars DESC LIMIT 1;` | Hassèn |
| Nivell 2 | `SELECT p.name FROM pirates p JOIN ships s ON p.idShip = s.idShip WHERE s.numberOfCanons = (SELECT numberOfCanons FROM ships WHERE NAME = 'El Drac Salat');` | Eris |
| Nivell 3 | `SELECT ROUND(AVG(age), 1) FROM pirates GROUP BY idShip ORDER BY COUNT(*) DESC LIMIT 1;` | 38.0 |
| Nivell 4 | `SELECT t.name FROM treasures t JOIN islands i ON t.idIsland = i.idIsland WHERE i.surface > (SELECT surface FROM islands WHERE NAME = 'Skull Island') AND i.population < (SELECT population FROM islands WHERE NAME = 'Rumrunner Isle');` | Ou de l'Au Roc |
| Nivell 5 | `SELECT SUM(weight) FROM pirates GROUP BY idShip HAVING COUNT(*) BETWEEN 3 AND 4 AND AVG(age) > 35 ORDER BY 1 DESC LIMIT 1;` | 246 |

**💍 11. La Recerca de Westley i el Secret de Florin (`repte_princesa_promesa`)**

| nivell | consulta SQL | solució |
| --- | --- | --- |
| Nivell 1 | `SELECT i.name FROM islands i JOIN ships_islands si ON i.idIsland = si.idIsland JOIN pirates p ON p.idShip = si.idShip WHERE p.name = 'Westley' ORDER BY si.days DESC LIMIT 1;` | Cliffs of Insanity |
| Nivell 2 | `SELECT name FROM islands WHERE population = 0 AND surface BETWEEN 100 AND 200 AND idIsland NOT IN (SELECT idIsland FROM treasures);` | Fire Swamp |
| Nivell 3 | `SELECT p.name FROM pirates p JOIN copyMaps cm ON p.idPirate = cm.idPirate JOIN originalMaps om ON cm.idOriginalMap = om.idOriginalMap WHERE om.idIsland = (SELECT idIsland FROM islands WHERE name = 'Florin');` | Count Rugen |
| Nivell 4 | `SELECT name FROM islands WHERE idIsland NOT IN (SELECT idIsland FROM ships_islands) ORDER BY population ASC, surface ASC LIMIT 1;` | Illa Oblidada |

**🍖 12. La Ruta cap a Laugh Tale (`repte_onepiece_2`)**

| nivell | consulta SQL | solució |
| --- | --- | --- |
| Nivell 1 | `SELECT name FROM islands WHERE name LIKE '%a%' AND numberOfBeaches BETWEEN 5 AND 15 ORDER BY population/surface DESC LIMIT 1;` | Singapore |
| Nivell 2 | `SELECT s.name, COUNT(*) FROM ships s JOIN pirates p ON s.idShip = p.idShip WHERE p.age > 30 GROUP BY s.name ORDER BY COUNT(*) DESC LIMIT 1;` | Revenge |
| Nivell 3 | `SELECT name FROM pirates WHERE numberOfScars >= (SELECT numberOfScars FROM pirates WHERE NAME = 'Monkey D. Luffy') AND name <> 'Monkey D. Luffy' ORDER BY numberOfScars DESC LIMIT 1;` | The Flying Dutchman (Pirate) |
| Nivell 4 | `SELECT i.name FROM islands i JOIN ships_islands si ON i.idIsland = si.idIsland JOIN ships s USING(idShip) GROUP BY i.idIsland HAVING COUNT(DISTINCT idShip) > 2 ORDER BY SUM(si.days) ASC, MAX(s.numberOfCanons) DESC LIMIT 1;` | Crani Somrient |

**☠️ 13. L'Últim Alè de LeChuck (`repte_illa_mico_2`)**

| nivell | consulta SQL | solució |
| --- | --- | --- |
| Nivell 1 | `SELECT p.name FROM pirates p JOIN copyMaps cm ON p.idPirate = cm.idPirate JOIN originalMaps om ON cm.idOriginalMap = om.idOriginalMap JOIN islands i ON om.idIsland = i.idIsland WHERE i.surface BETWEEN 600 AND 610;` | Dents de Ferro |
| Nivell 2 | `SELECT p.name FROM pirates p WHERE p.age > (SELECT AVG(age) FROM pirates p2 WHERE p.idShip = p2.idShip) ORDER BY numberOfScars DESC LIMIT 1;` | Kale |
| Nivell 3 | `SELECT name FROM ships ORDER BY (SELECT SUM(days) FROM ships_islands WHERE idShip = ships.idShip) DESC LIMIT 1;` | The Sea Monkey |
| Nivell 4 | `SELECT name FROM islands WHERE idIsland = (SELECT idIsland FROM originalMaps WHERE scale = '1:10000');` | Skull Island |
| Nivell 5 | `SELECT name FROM pirates WHERE idShip = (SELECT idShip FROM ships ORDER BY numberOfCanons DESC LIMIT 1) AND name <> 'Zombie LeChuck';` | Murray the Skull |
| Nivell 6 | (Coordenada B4 basat en vaixell de 32 canons/2 visites i illes amb superfície < 30% de Tortuga) | Monkey Island |