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
            <h2>ATUREU-VOS, GRUMET!</h2>
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

        llistaAssoliments.forEach(assoliment => {
            if (assolimentsUsuari[assoliment.id] === true) {
                aconseguits++;
            }
        });

        let titolPirata = "Grumet d'Aigua Dolça 🪣";
        if (aconseguits >= 3) titolPirata = "Mariner de Coberta ⛵";
        if (aconseguits >= 6) titolPirata = "Contramestre Temut ⚔️";
        if (aconseguits >= 9) titolPirata = "Capità Llegendari 🏴‍☠️";
        if (aconseguits === total) titolPirata = "El Rei dels Pirates! 👑";

        // Estructura HTML Base (Barra progrés + Graella)
        const htmlBase = `
            <h2>PASSAPORT PIRATA</h2>
            <h3 style="text-align: center; color: #ffd700; font-family: 'IM Fell English', serif; font-style: italic; margin-top: -10px; margin-bottom: 25px;">
                Rang actual: ${titolPirata}
            </h3>
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

            const classeEstat = estDesbloquejat ? 'desbloquejada' : 'bloquejada';
            const titolVis = estDesbloquejat ? assoliment.nom : 'Misteri per resoldre';
            const descVis = estDesbloquejat ? assoliment.descripcio : 'Supera aquest repte per descobrir el tresor ocult.';
            
            // Imatge oculta si no el té
            const imatgeVis = estDesbloquejat ? assoliment.imatge : 'img/assoliment_bloquejat.png';

            contenidorGraella.innerHTML += `
                <div class="enganxina-flip ${classeEstat}">
                    <div class="enganxina-inner">
                        <div class="enganxina-front">
                            <img src="${imatgeVis}" alt="Icona Assoliment">
                        </div>
                        
                        <div class="enganxina-back">
                            <img src="${imatgeVis}" class="back-img" alt="Fons Assoliment">
                            
                            <div class="back-content">
                                <h3>${titolVis}</h3>
                                <p>${descVis}</p>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });

        // Actualitzem la barra i els números amb una petita animació
        const llistaRecompenses = [
            { nom: "Enganxina + Pista del Lloro (A l'examen)", requerits: 3, icona: "🦜" },
            { nom: "Vent a Favor (Enganxina + 0.5 punts)", requerits: 6, icona: "⛵" },
            { nom: "El Gran Tresor (Enganxina + 1 punt!)", requerits: 10, icona: "👑" },
            { nom: "El Rei dels Pirates! (Glòria eterna)", requerits: total, icona: "🏴‍☠️" }
        ];

        const percentatge = total === 0 ? 0 : (aconseguits / total) * 100;
        
        setTimeout(() => {
            // Animem la barra
            const barra = document.getElementById('barra-progres-assoliments');
            if(barra) barra.style.width = percentatge + '%';
            
            const textAconseguits = document.getElementById('text-aconseguits');
            if(textAconseguits) textAconseguits.innerText = aconseguits;

            // Dibuixem els marcadors de recompensa sobre la barra
            const contBarra = document.querySelector('.progress-bar-container');
            if (contBarra) {
                // Creem el contenidor de fites si no existeix encara
                let recContainer = document.getElementById('contenidor-fites');
                if (!recContainer) {
                    recContainer = document.createElement('div');
                    recContainer.id = 'contenidor-fites';
                    contBarra.appendChild(recContainer);
                }

                // Generem l'HTML de cada icona a la seva posició
                let htmlFites = '';
                llistaRecompenses.forEach(rec => {
                    // Calculem on ha d'anar (ex: si calen 5 de 10, anirà al 50% de la barra)
                    const posicioX = (rec.requerits / total) * 100;
                    const estat = aconseguits >= rec.requerits ? 'assolida' : 'pendent';
                    const missatge = aconseguits >= rec.requerits 
                        ? '🏴‍☠️ Desbloquejat!' 
                        : `🔒 Falten ${rec.requerits - aconseguits} enganxines`;

                    htmlFites += `
                        <div class="marcador-fita ${estat}" style="left: ${posicioX}%;">
                            <div class="icona-fita">${rec.requerits}</div>
                            <div class="tooltip-fita">
                                <strong>${rec.nom}</strong><br>
                                <span>${missatge}</span>
                            </div>
                        </div>
                    `;
                });
                recContainer.innerHTML = htmlFites;
            }
        }, 100);

    } catch (error) {
        console.error("Error carregant el passaport:", error);
        document.getElementById('modalAssoliments').innerHTML = `<p style="color:red; text-align:center;">Un pop gegant ha destruït el teu passaport.</p>`;
    }
}