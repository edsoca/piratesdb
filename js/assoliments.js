// =========================================
// CONFIGURACIÓ DE FIREBASE (PROJECTE PIRATES)
// =========================================
const firebaseConfig = {
  apiKey: "AIzaSyBr3oCZ9OdWGq7P4COiaWVWipRfJs3bpDw",
  authDomain: "pirates-d1292.firebaseapp.com",
  databaseURL: "https://pirates-d1292-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "pirates-d1292",
  storageBucket: "pirates-d1292.firebasestorage.app",
  messagingSenderId: "965399900397",
  appId: "1:965399900397:web:4ff10a857e782be410dce4",
  measurementId: "G-F9RVP1FMT4"
};

// Evitem inicialitzar dues vegades si s'usa dins d'una altra pàgina
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

// =========================================
// VIGILANT DE SESSIÓ (El Niu del Corb)
// =========================================
firebase.auth().onAuthStateChanged((user) => {
    const contenidor = document.getElementById('modalAssoliments');
    
    if (user) {
        // TENIM USUARI: Dibuixem l'estructura de l'àlbum buida primer
        contenidor.innerHTML = `
            <h2>🏆 Passaport d'Habilitats</h2>
            <div class="progress-bar-container">
                <div class="progress-bar" id="barra-progres"></div>
            </div>
            <p id="text-progres" class="text-progres">Desenterrant els teus tresors...</p>
            <div class="graella-assoliments" id="graella-assoliments"></div>
        `;
        
        // Busquem el catàleg i el botí de l'usuari ALHORA a la base de dades
        Promise.all([
            firebase.database().ref('cataleg_assoliments').once('value'),
            firebase.database().ref('usuaris/' + user.uid + '/assoliments').once('value')
        ]).then((resultats) => {
            const dadesCataleg = resultats[0].val() || {};
            const dadesUsuari = resultats[1].val() || {}; 
            
            // Un cop tenim les dades, pintem les enganxines!
            dibuixarAlbum(dadesCataleg, dadesUsuari);
            
        }).catch((error) => {
            console.error("Error al rescatar les dades:", error);
            document.getElementById('text-progres').innerText = "Hi ha hagut un problema llegint el mapa.";
        });

    } else {
        // NO HI HA USUARI: Mostrem el botó d'entrar amb Google
        contenidor.innerHTML = `
            <div style="text-align: center; padding: 50px 20px;">
                <h2>⚠️ Aturat, foraster!</h2>
                <p style="font-size: 1.3rem; margin-bottom: 30px; color: #ccc;">Has d'iniciar sessió per veure el teu passaport d'habilitats.</p>
                <button onclick="iniciarSessioGoogle()" style="padding: 15px 30px; font-size: 1.3rem; background: linear-gradient(90deg, #ff8c00, #ffd700); color: #111; border: 2px solid #fff; border-radius: 8px; cursor: pointer; font-family: 'Pirata One', cursive; box-shadow: 0 4px 10px rgba(255, 215, 0, 0.4); transition: transform 0.2s;">
                    🏴‍☠️ Entrar amb Google
                </button>
            </div>
        `;
    }
});

// Funció que crida el botó per obrir el login de Google
function iniciarSessioGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider)
        .then(() => {
            // Recarreguem la pàgina perquè el vigilant s'adoni que estem loguejats
            window.location.reload(); 
        })
        .catch((error) => {
            alert("Error a l'iniciar sessió: " + error.message);
        });
}

// =========================================
// PINTAR L'ÀLBUM AMB LES DADES
// =========================================
function dibuixarAlbum(cataleg, assolimentsUsuari) {
    const contenidorGraella = document.getElementById('graella-assoliments');
    contenidorGraella.innerHTML = ''; 
    let aconseguits = 0;
    
    // Convertim el catàleg en una llista per poder-la endreçar per 'ordre'
    const llistaAssoliments = Object.keys(cataleg).map(key => {
        return { id: key, ...cataleg[key] };
    }).sort((a, b) => a.ordre - b.ordre);

    const total = llistaAssoliments.length;

    // Pintem cada enganxina una a una
    llistaAssoliments.forEach(assoliment => {
        // Comprovem si el jugador té l'ID d'aquest assoliment guardat al seu perfil
        const estDesbloquejat = assolimentsUsuari[assoliment.id] === true;
        
        if (estDesbloquejat) aconseguits++;

        const classeEstat = estDesbloquejat ? 'desbloquejada' : 'bloquejada';
        const titolVis = estDesbloquejat ? assoliment.nom : 'Misteri per resoldre';
        const descVis = estDesbloquejat ? assoliment.descripcio : 'Supera aquest repte a les illes per descobrir el tresor ocult.';

        contenidorGraella.innerHTML += `
            <div class="enganxina ${classeEstat}">
                <img src="${assoliment.imatge}" alt="Icona Assoliment">
                <h3>${titolVis}</h3>
                <p>${descVis}</p>
            </div>
        `;
    });

    // Actualitzem la barra i els números
    const percentatge = total === 0 ? 0 : (aconseguits / total) * 100;
    
    // Retardem mig segon l'animació de la barra perquè quedi més èpic
    setTimeout(() => {
        document.getElementById('barra-progres').style.width = percentatge + '%';
    }, 100);
    
    document.getElementById('text-progres').innerText = `${aconseguits}/${total} Assoliments desbloquejats`;
}