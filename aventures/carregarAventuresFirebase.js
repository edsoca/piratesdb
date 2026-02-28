const nousReptes = {
  "malediccio-perla-negra": {
    "tempsFinal": 1200,
    "titol_repte": "La Maledicció de la Perla Negra",
    "levels": {
      "level1": { "titol": "Sector 1: L'Atracament", "contingut": "<h2>Sector 1: L'Atracament</h2><p>Grumet! El malvat Capità Barbossa ens ha robat la nau. Abans de perseguir-lo, necessitem recordar la potència de foc del nostre estimat vaixell.</p><p>Quants canons (<b>numberOfCanons</b>) té el vaixell anomenat <b>'Black Pearl'</b> a la taula <b>ships</b>?</p>", "solucio": "32" },
      "level2": { "titol": "Sector 2: El Motí", "contingut": "<h2>Sector 2: El Motí</h2><p>Per posar preu al seu cap, necessitem analitzar el seu historial al registre de la Marina.</p><p>Cerca a la taula <b>pirates</b> quantes cicatrius (<b>numberOfScars</b>) té el pirata el nom del qual (<b>name</b>) comença exactament per <b>'Hector'</b> (Pista: Fes servir <code>LIKE</code>).</p>", "solucio": "5" },
      "level3": { "titol": "Sector 3: El Rastre de la Llegendària", "contingut": "<h2>Sector 3: El Rastre de la Llegendària</h2><p>Ens han dit que Barbossa busca el cofre maleït per trencar la seva maledicció.</p><p>En quina illa es troba amagat el tresor anomenat <b>'Davy Jones Chest'</b>? Necessito el nom de l'illa (<b>islands.name</b>), hauràs de fer un <code>JOIN</code> entre <b>islands</b> i <b>treasures</b>!</p>", "solucio": "Skull Island" },
      "level4": { "titol": "Sector 4: Parada a Tortuga", "contingut": "<h2>Sector 4: Parada a Tortuga</h2><p>Abans d'anar-hi, farem parada a Tortuga. Necessitem saber si hi haurà molta guàrdia.</p><p>Calcula la densitat de població (divideix <b>population</b> entre <b>surface</b> de la taula <b>islands</b>) de l'illa de <b>'Tortuga'</b>. Arrodoneix el resultat a <b>2 decimals</b> usant la funció <code>ROUND()</code>.</p>", "solucio": "20.75" },
      "level5": { "titol": "Sector 5: Espiant l'Enemic", "contingut": "<h2>Sector 5: Espiant l'Enemic</h2><p>Necessitem saber a quants homes ens enfrontarem si abordem el vaixell de Barbossa.</p><p>Fent un <code>JOIN</code> entre les taules <b>pirates</b> i <b>ships</b>, digues-me quants pirates en total (<code>COUNT</code>) tenen assignat el vaixell anomenat <b>'Queen Anne\\'s Revenge'</b>.</p>", "solucio": "2" },
      "level6": { "titol": "Sector 6: El Rei dels Pirates", "contingut": "<h2>Sector 6: El Rei dels Pirates</h2><p>Hem d'escollir el nostre primer objectiu a abatre durant l'abordatge: el més perillós del seu vaixell.</p><p>Busca el nom (<b>name</b>) del pirata a la taula <b>pirates</b> que té el major nombre de cicatrius (<b>numberOfScars</b>), però <i>només</i> d'aquells que naveguen al vaixell <b>'Queen Anne\\'s Revenge'</b>. Fes servir <code>ORDER BY</code> i <code>LIMIT</code>!</p>", "solucio": "Blackbeard" }
    }
  },
  "illa-del-mico": {
    "tempsFinal": 1500,
    "titol_repte": "El Misteri de l'Illa del Mico",
    "levels": {
      "level1": { "titol": "Sector 1: El Gran Lladre", "contingut": "<h2>Sector 1: El Gran Lladre</h2><p>Sóc en Guybrush Threepwood, un temible pirata! Per comprar un vaixell de segona mà necessito saber l'or que podria aconseguir.</p><p>Quantes monedes d'or (<b>goldCoins</b>) té el tresor anomenat <b>'Big Whoop'</b> a la taula <b>treasures</b>?</p>", "solucio": "10000" },
      "level2": { "titol": "Sector 2: El Lladre de Mapes", "contingut": "<h2>Sector 2: El Lladre de Mapes</h2><p>Algú ha robat una còpia del nostre mapa! Sabem que va ser un pirata molt excèntric.</p><p>Busca a la taula <b>copyMaps</b> (creuant-la amb <b>pirates</b>) la data exacta (<b>date</b>) en què el pirata <b>'Jack Sparrow'</b> va fer una còpia d'un mapa. Format (YYYY-MM-DD).</p>", "solucio": "1720-05-10" },
      "level3": { "titol": "Sector 3: Dies a la Deriva", "contingut": "<h2>Sector 3: Dies a la Deriva</h2><p>Per arribar a l'Illa del Mico, hem de llogar el vaixell adequat: el 'The Sea Monkey'.</p><p>Necessitem saber quants dies (<b>days</b> de la taula <b>ships_islands</b>) ha estat atracat el vaixell <b>'The Sea Monkey'</b> a l'illa <b>'Monkey Island'</b>. Et caldrà creuar <b>ships_islands</b>, <b>islands</b> i <b>ships</b>.</p>", "solucio": "3650" },
      "level4": { "titol": "Sector 4: Baralles de Taverna", "contingut": "<h2>Sector 4: Baralles de Taverna</h2><p>El temible pirata fantasma LeChuck ens busca. Hem de mesurar la seva força.</p><p>Quants combats en total (fent servir <code>COUNT</code> a la taula <b>fights</b>) ha tingut el pirata el nom del qual és <b>'Zombie LeChuck'</b>? <i>(Pista: has de mirar tant si és idPirate1 com si és idPirate2, creuant amb la taula pirates)</i>.</p>", "solucio": "2" },
      "level5": { "titol": "Sector 5: El Codi de la Sacerdotessa", "contingut": "<h2>Sector 5: El Codi de la Sacerdotessa</h2><p>La Sacerdotessa del vudú ens demana una contrasenya de pas.</p><p>Busca el nom de l'illa que té exactament <b>0 platges</b> (<b>numberOfBeaches</b>) però que té més de 0 habitants (<b>population</b>). Un cop la trobis, la resposta és el seu nom escrit en <b>MAJÚSCULES</b>, substituint totes les lletres <b>'a'</b> per <b>'o'</b>. <br><i>(Fes servir <code>UPPER()</code> i <code>REPLACE()</code>)</i>.</p>", "solucio": "SCOBB ISLOND" },
      "level6": { "titol": "Sector 6: La Gran X", "contingut": "<h2>Sector 6: La Gran X</h2><p>Ja hi som! Per obrir la porta del tresor i guanyar, hem de posar al mecanisme la suma total de l'or de la nostra ruta.</p><p>Calcula la suma d'or <b>goldCoins</b> d'aquells tresors (<b>treasures</b>) que es troben a les illes visitades pel vaixell on està assignat el pirata <b>'Guybrush Threepwood'</b> </p>", "solucio": "10000" }
    }
  }
};

firebase.database().ref('reptes').update(nousReptes)
  .then(() => alert("🏴‍☠️ Reptes afegits amb èxit!"))
  .catch((error) => console.error("Error:", error));