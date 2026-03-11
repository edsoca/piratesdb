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

const db = firebase.database(); // Inicialitzem db globalment

// =========================================
// VIGILANT DE SESSIÓ (El Niu del Corb)
// =========================================
firebase.auth().onAuthStateChanged((user) => {
    const contenidor = document.getElementById('modalAssoliments');
    
    if (user) {
        // --- TENIM USUARI: Dibuixem el passaport amb les seves dades ---
        dibuixarPassaport(user);
    } else {
        // --- NO HI HA USUARI: Mostrem missatge per iniciar sessió ---
        contenidor.innerHTML = `
            <h2>NO SOU BENVINGUTS AQUÍ</h2>
            <p style="text-align: center;">Per veure el vostre passaport d'habilitats heu d'estar enrolats a una aventura.</p>
            <button id="btnLogin" class="btn-action" style="display: block; margin: 30px auto;">
                🔓 ENROLAR-SE AMB GOOGLE
            </button>
        `;

        // Activem el botó
        document.getElementById('btnLogin').addEventListener('click', iniciarAutenticacioGoogle);
    }
});

// =========================================
// FUNCIÓ PER INICIAR SESSIÓ AMB GOOGLE
// =========================================
function iniciarAutenticacioGoogle() {
    // ⚠️ AQUÍ ESTAVA L'ERROR: És auth.GoogleAuthProvider() SENSE parèntesis a auth
    const provider = new firebase.auth.GoogleAuthProvider();
    
    firebase.auth().signInWithPopup(provider)
        .then((result) => {
            console.log("Pirata identificat:", result.user.displayName);
            // La funció onAuthStateChanged es carregarà automàticament ara
        })
        .catch((error) => {
            console.error("Error d'abordatge:", error);
            Swal.fire('ERROR DE LOGIN', 'No has pogut pujar a bord. Revisa els permisos.', 'error');
        });
}

// =========================================
// FUNCIÓ PRINCIPAL: DIBUIXAR EL PASSAPORT
// =========================================
async function dibuixarPassaport(user) {
    const uid = user.uid;

    try {
        // 1. Demanem el CATÀLEG TOTAL d'assoliments i els del JUGADOR alhora
        const [snapCataleg, snapUsuari] = await Promise.all([
            db.ref('cataleg_assoliments').once('value'),
            db.ref(`usuaris/${uid}/assoliments`).once('value')
        ]);

        const cataleg = snapCataleg.val() || {};
        const assolimentsUsuari = snapUsuari.val() || {};

        let aconseguits = 0;

        // Convertim l'objecte del catàleg en un Array i l'ordenem per 'ordre'
        const llistaAssoliments = Object.keys(cataleg).map(key => {
            return { id: key, ...cataleg[key] };
        }).sort((a, b) => a.ordre - b.ordre);

        const total = llistaAssoliments.length;

        // Estructura HTML Base (Barra progrés + Graella)
        const htmlBase = `
            <h2>PASSAPORT PIRATA</h2>
            <div class="progress-bar-container">
                <div class="progress-bar-fill" id="barra-progres-assoliments" style="width: 0%;"></div>
            </div>
            <p style="text-align: center; font-size: 1.5rem; margin-top: 10px; color: var(--gold);">
                <span id="text-aconseguits">0</span> de ${total} Tresors Descoberts
            </p>
            <div class="graella-assoliments" id="graella-assoliments"></div>
        `;

        document.getElementById('modalAssoliments').innerHTML = htmlBase;
        const contenidorGraella = document.getElementById('graella-assoliments');

        // Pintem cada enganxina una a una
        llistaAssoliments.forEach(assoliment => {
            const estDesbloquejat = assolimentsUsuari[assoliment.id] === true;
            if (estDesbloquejat) aconseguits++;

            const classeEstat = estDesbloquejat ? 'desbloquejada' : 'bloquejada';
            const titolVis = estDesbloquejat ? assoliment.nom : 'Misteri per resoldre';
            const descVis = estDesbloquejat ? assoliment.descripcio : 'Supera aquest repte a les illes per descobrir el tresor ocult.';
            
            // Imatge oculta si no el té
            const imatgeVis = estDesbloquejat ? assoliment.imatge : 'img/assoliment_bloquejat.png';

            contenidorGraella.innerHTML += `
                <div class="enganxina ${classeEstat}">
                    <img src="${imatgeVis}" alt="Icona Assoliment">
                    <h3>${titolVis}</h3>
                    <p>${descVis}</p>
                </div>
            `;
        });

        // Actualitzem la barra i els números amb una petita animació
        const percentatge = total === 0 ? 0 : (aconseguits / total) * 100;
        
        setTimeout(() => {
            const barra = document.getElementById('barra-progres-assoliments');
            if(barra) barra.style.width = percentatge + '%';
            
            const textAconseguits = document.getElementById('text-aconseguits');
            if(textAconseguits) textAconseguits.innerText = aconseguits;
        }, 100);

    } catch (error) {
        console.error("Error carregant el passaport:", error);
        document.getElementById('modalAssoliments').innerHTML = `<p style="color:red; text-align:center;">Un pop gegant ha destruït el teu passaport.</p>`;
    }
}