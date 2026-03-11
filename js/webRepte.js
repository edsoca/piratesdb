// =========================================
// 1. CONFIGURACIÓ I EFECTES SONORS
// =========================================
const soTecleig = new Audio('https://www.soundjay.com/communication_c2026/sounds/writing-signature-1.mp3');
const soError = new Audio('https://www.soundjay.com/misc_c2026/sounds/coin-drop-1.mp3');
const soExit = new Audio('https://www.soundjay.com/door_c2026/sounds/door-3-open.mp3');
const soExplosio = new Audio('https://www.soundjay.com/mechanical_c2026/sounds/explosion-01.mp3');
const soPaper = new Audio('https://www.soundjay.com/misc_c2026/sounds/page-flip-01a.mp3');
const soNavegar = new Audio('https://www.soundjay.com/transportation_c2026/sounds/rowing-boat-push-water-02.mp3');
soTecleig.volume = 0.2;
soError.volume = 0.4;

// Funció per abandonar la partida
window.tancarSessioJoc = function() {
    firebase.auth().signOut().then(() => {
        // Redirigim a la pàgina neta sense el ?repte=...
        window.location.href = window.location.pathname;
    });
};

// ==========================================
// FUNCIÓ PER XIFRAR LES RESPOSTES (SHA-256)
// ==========================================
async function generarHash(text) {
    // Passem a minúscules i traiem els espais del principi i del final
    const textNet = text.trim().toLowerCase();
    
    // Convertim el text a un format que l'algoritme pugui llegir
    const encoder = new TextEncoder();
    const data = encoder.encode(textNet);
    
    // Generem el hash màgic
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    
    // Convertim el buffer a una cadena de text hexadecimal llegible
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    return hashHex;
}

// =========================================
// 2. INICIALITZACIÓ DE FIREBASE
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

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.database();

// =========================================
// 3. VARIABLES DE JOC
// =========================================
let nivellActual = 1;
let totalNivells = 0;
let dadesMissions = {};
let tempsRestant = 0;
let intervalCronometre;
let jocActiu = false;
let vides = 7;
let idRepteActiu = "";
let tempsInicialRepte = 0;

$(document).ready(function() {

    $('#resultat').on('keydown', function() {
        // Clonem el so perquè pugui sonar ràpid si l'usuari escriu de pressa
        let soInstancia = soTecleig.cloneNode();
        soInstancia.volume = 0.1;
        // Variem la velocitat una mica (entre 0.9 i 1.1)
        soInstancia.playbackRate = 0.9 + Math.random() * 0.2;
        soInstancia.play();
    });

    // Gestió del Nou Modal del Mapa de Coordenades
    dibuixarMapaAmbGrid(); // Dibuixa la graella només carregar

    $('#btn-mapa').on('click', function() {
        $('.modal-pirata').hide(); 
        soPaper.play();
        $('#modalMapa').fadeIn(300);
    });

    // Gestió del Modal de l'Esquema ER
    $('#obrirModal').on('click', function() {
        $('.modal-pirata').hide(); 
        soPaper.play();
        $('#modalEsquema img').attr('src', 'img/piratesER.png'); 
        $('#modalEsquema').fadeIn(300);
    });

    $('#btn-ranking').on('click', function() {
        $('.modal-pirata').hide(); 
        $('#modalRanking').fadeIn(300);
        carregarHallOfFame();
    });

    $('.btn-eject').on('click', function() {
        tancarSessioJoc(); 
    });

    // --- TANCAR QUALSEVOL MODAL ---
    $('.tancar-modal').on('click', function() {
        $(this).closest('.modal-pirata').fadeOut(300);
        soPaper.play();
    });

    // Tancar qualsevol modal en prémer la tecla ESC
    $(document).keyup(function(e) {
        if (e.key === "Escape") { 
            $('.modal-pirata').fadeOut(300);
            soPaper.play();
        }
    });

    // Clic al botó d'assoliments
    $(document).on('click', '#btn-assoliments', function() {
        soPaper.play(); 
        window.open('assoliments.html', '_blank'); 
    });

    // Tancar si es clica fora de la caixa
    $('.modal-pirata').on('click', function(e) {
        if (e.target === this) {
            $(this).fadeOut(300);
        }
    });

    // Login i inici de joc
    $('#btnLogin').on('click', function() {
        const idRepte = $('#id-repte').val().trim().toLowerCase();
        if (!idRepte) {
            AlertaPirata.fire('¡ATENCIÓ!', 'Has d\'introduir el codi del repte.', 'warning');
            return;
        }

        idRepteActiu = idRepte;

        // Verifiquem si el repte existeix a la bitàcola (DB)
        db.ref('reptes/' + idRepte).once('value', (snapshot) => {
            if (snapshot.exists()) {
                iniciarAutenticacioGoogle();
            } else {
                AlertaPirata.fire('MAPA NO TROBAT', 'Aquest codi no correspon a cap illa coneguda.', 'error');
            }
        });
    });

    // DETECCIÓ DE REPTE ACTIU PER URL
    const urlParams = new URLSearchParams(window.location.search);
    const repteURL = urlParams.get('repte');

    // Escoltador d'estat d'autenticació
    firebase.auth().onAuthStateChanged((user) => {
        if (user && repteURL) {
            console.log("Sessió activa detectada per al repte:", repteURL);
            idRepteActiu = repteURL;
            carregarDadesRepte(); 
        }
    });

    function iniciarAutenticacioGoogle() {
        const provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithPopup(provider)
            .then((result) => {
                const novaURL = window.location.protocol + "//" + window.location.host + window.location.pathname + '?repte=' + idRepteActiu;
                window.history.pushState({ path: novaURL }, '', novaURL);
                const user = result.user;
                console.log("Pirata identificat:", user.displayName);
                carregarDadesRepte();
            })
            .catch((error) => {
                console.error("Error d'abordatge:", error);
                AlertaPirata.fire('ERROR DE LOGIN', 'No has pogut pujar a bord.', 'error');
            });
    }

    function carregarDadesRepte() {
        const user = firebase.auth().currentUser;
        if (!user) return;

        db.ref('reptes/' + idRepteActiu).once('value', (snapshot) => {
            const dadesRepte = snapshot.val();
            if (!dadesRepte) return;

            dadesMissions = dadesRepte.levels;
            totalNivells = Object.keys(dadesMissions).length;
            $('#nom-missio').text(dadesRepte.titol_repte.toUpperCase());
            tempsInicialRepte = parseInt(dadesRepte.tempsFinal) || 600;

            db.ref(`usuaris/${user.uid}/reptes_actius/${idRepteActiu}`).once('value', (progresSnap) => {
                if (progresSnap.exists()) {
                    const progres = progresSnap.val();
                    nivellActual = progres.level || 1;
                    vides = (progres.vides !== undefined) ? progres.vides : 7;
                    tempsRestant = parseInt(progres.temps_segons);
                    console.log(`Reprenent partida de ${progres.nick}: Nivell ${nivellActual}, Vides ${vides}, Segons ${tempsRestant}`);
                } else {
                    nivellActual = 1;
                    vides = 7;
                    tempsRestant = parseInt(dadesRepte.tempsFinal) || 600; 
                    sincronitzarAmbFirebase();
                }

                actualitzarVidesUI(vides);
                actualitzarProgressio();
                
                $('#pantalla-login').fadeOut();
                $('#joc').removeClass('ocult');
                
                jocActiu = true;

                if(nivellActual > totalNivells){
                    bloquejarJocGuanyat();
                } else if (tempsRestant <= 0) {
                    tempsRestant = 0;
                    bloquejarJocPerdut();
                } else {
                    iniciarCronometre(); 
                    mostrarNivell();
                }

            });
        });
    }

    function sincronitzarAmbFirebase() {
        const user = firebase.auth().currentUser;
        if (user && idRepteActiu && jocActiu) {
            db.ref(`usuaris/${user.uid}/reptes_actius/${idRepteActiu}`).update({
                level: nivellActual,
                vides: vides,
                temps_segons: tempsRestant,
                nick: user.displayName, 
                ultima_connexio: firebase.database.ServerValue.TIMESTAMP
            });
        }
    }

    // =========================================
    // 5. CRONÒMETRE I UI
    // =========================================
    function iniciarCronometre() {
        if (intervalCronometre) clearInterval(intervalCronometre);
        
        intervalCronometre = setInterval(() => {
            if(tempsRestant>0) tempsRestant--;
            if (tempsRestant % 10 === 0) sincronitzarAmbFirebase();
            const m = Math.floor(tempsRestant / 60);
            const s = tempsRestant % 60;
            $('#cronometre').text(`${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`);
            if(tempsRestant < 60) $('#cronometre').addClass('danger-time');
            if (tempsRestant <= 0) perdrePartida("El temps s'ha esgotat!");
        }, 1000);
    }

    // =========================================
    // 4. LÒGICA DELS ENIGMES
    // =========================================
    function mostrarNivell() {
        const missio = dadesMissions[`level${nivellActual}`];
        if (missio) {
            $('#titol-nivell').html(`<span class="emoji-icon">🧭</span>ENIGMA ${nivellActual}: ${missio.titol}`);
            $('#descripcio-nivell').html(missio.contingut); 
            $('#resultat').val('').focus();
        }
    }

    $('#btnEnviar').on('click', validarResposta);

    // ⚠️ ATENCIÓ AQUÍ: Hem afegit 'async' abans de function
    async function validarResposta() {
        if (!jocActiu) return;

        const respostaUsuari = $('#resultat').val().trim().toLowerCase();
        
        // Ara la funció generarHash existirà i funcionarà
        const hashAlumne = await generarHash(respostaUsuari);
        const solucioCorrecta = dadesMissions[`level${nivellActual}`].solucio.toLowerCase();

        if (hashAlumne === solucioCorrecta) {
            // --- CAS D'ÈXIT ---
            soExit.play();
            nivellActual++;
            
            sincronitzarAmbFirebase();

            if (nivellActual > totalNivells) {
                guanyarPartida();
            } else {
                AlertaPirata.fire({
                    title: '¡BON COP, PIRATA!',
                    text: 'L\'enigma ha estat resolt.',
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false
                });
                mostrarNivell();
                actualitzarProgressio();
            }
        } else {
            // --- CAS D'ERROR (PERD VIDA) ---
            vides--; 
            soError.play();
            
            sincronitzarAmbFirebase(); 
            actualitzarVidesUI(vides);
            
            if (vides <= 0) {
                perdrePartida("T'has quedat sense doblons i t'han llençat als taurons.");
            } else {
                AlertaPirata.fire({
                    title: '¡A L\'AIGUA!',
                    text: `Aquesta no és la clau. Et queden ${vides} monedes.`,
                    icon: 'error',
                    confirmButtonText: 'TORNAR A INTENTAR-HO'
                });
            }
        }
    }

    function actualitzarProgressio() {
        actualitzarVaixell(nivellActual, totalNivells);
        const percentatge = Math.round(((nivellActual - 1) / totalNivells) * 100);
        $('.progress-bar').css('width', percentatge + '%');
    }

    function actualitzarVidesUI(v) {
        $('.vides').text(v);
        if (v <= 1) {
            $('.heart-container').css({'color': '#ff4444', 'border-color': '#ff4444'});
        }
    }

    function guanyarPartida() {
        jocActiu = false;
        clearInterval(intervalCronometre);
        
        const segonsGastats = Math.max(0, tempsInicialRepte - tempsRestant);
        const pirataNom = firebase.auth().currentUser.displayName || "Pirata Anònim";

        db.ref(`hallOfFame/${idRepteActiu}`).push({
            nom: pirataNom,
            segons_gastats: segonsGastats,
            data: firebase.database.ServerValue.TIMESTAMP
        });

        atorgarAssoliment(idRepteActiu);
        bloquejarJocGuanyat();

        AlertaPirata.fire({
            title: '¡BOTÍ RECUPERAT!',
            text: 'Ets una llegenda! Vols veure el rànquing?',
            icon: 'success',
            showCancelButton: true,
            confirmButtonText: 'SÍ, VEURE RÀNQUING',
            cancelButtonText: 'TORNAR A PORT'
        }).then((result) => {
            if (result.isConfirmed) {
                $('#btn-ranking').click();
            }
        });
    }

    function perdrePartida(motiu) {
        jocActiu = false;
        clearInterval(intervalCronometre);
        soExplosio.play();

        AlertaPirata.fire({
            title: '⚔️ ¡ABORDATGE! 🏴‍☠️',
            text: 'El temps s\'ha esgotat i els enemics han assaltat el teu vaixell.',
            confirmButtonText: 'Acceptar el destí',
            confirmButtonColor: '#8b0000',
            background: '#f4e4bc url("https://www.transparenttextures.com/patterns/papyrus.png")',
            backdrop: `rgba(139, 0, 0, 0.4)`
        });

        bloquejarJocPerdut();
    }

    function carregarHallOfFame() {
        db.ref(`hallOfFame/${idRepteActiu}`).orderByChild('segons_gastats').limitToFirst(5).on('value', (snapshot) => {
            let html = '';
            let posicio = 1;
            snapshot.forEach((child) => {
                const dada = child.val();
                const minuts = Math.floor(dada.segons_gastats / 60);
                const segons = dada.segons_gastats % 60;
                const tempsFormatat = `${minuts}:${segons.toString().padStart(2, '0')}`;
                
                let icona = posicio === 1 ? '🥇' : (posicio === 2 ? '🥈' : '🥉');
                if (posicio > 3) icona = '💀';

                html += `<tr>
                    <td>${icona} ${dada.nom}</td>
                    <td>${tempsFormatat}</td>
                </tr>`;
                posicio++;
            });
            soPaper.play();
            $('#hall-fame-body').html(html || '<tr><td colspan="2">Encara no hi ha herois...</td></tr>');
        });
    }

    function actualitzarVaixell(nivellActual, totalNivells) {
        if (!totalNivells || totalNivells === 0) return;

        let percentatge = ((nivellActual-1) / totalNivells) * 100;
        let posicioCSS = (percentatge * 0.9) + 5; 
        soNavegar.play();
        $('#vaixell-progres').css('left', posicioCSS + '%');

        crearBombolles();
    }

    function crearBombolles() {
        const $ocea = $('.ocea-progres-header');
        const numBombolles = 15; 

        let comptador = 0;
        const intervalBombolles = setInterval(() => {
            const $vaixell = $('#vaixell-progres');
            const posicio = $vaixell.position(); 

            const mida = Math.random() * 6 + 2;
            const $b = $('<div class="bombolla"></div>').css({
                left: (posicio.left + 15) + 'px', 
                top: (posicio.top + 28) + 'px',
                width: mida + 'px',
                height: mida + 'px'
            });

            $ocea.append($b);

            setTimeout(() => $b.remove(), 800);

            comptador++;
            if (comptador > numBombolles) clearInterval(intervalBombolles);
        }, 50); 
    }

    function bloquejarJocGuanyat() {
        $('body').addClass('joc-guanyat');
        actualitzarVaixell(totalNivells+1, totalNivells);

        $('#titol-nivell').html(`
            <div style="text-align: center;">⚓ MISSIÓ COMPLETADA ⚓</div>`);
        
        $('#descripcio-nivell').html(`
            <div style="text-align: center; padding: 10px;">
                <span class="emoji-icon-gran">💰</span>
                <h2 style="color: var(--gold);">¡ENHORABONA, CAPITÀ!</h2>
                <p>Has desxifrat tots els enigmes i el tresor és teu.</p>
                <button id="btn-assoliments" class="btn-action" style="background-color: #2b4a2b; border-color: #55ff55; color: #55ff55; font-size: 1rem; padding: 8px 16px; margin-top: 10px; box-shadow: 0 0 10px rgba(85, 255, 85, 0.4);">
                    🎖️ VEURE EL MEU PASSAPORT
                </button>
            </div>
        `);

        $('#resultat').prop('disabled', true).val("TRESOR TROBAT");
        $('#btnEnviar').prop('disabled', true).addClass('boto-desactivat').text("FINALITZAT");
        $('#cronometre').text("COMPLETAT");
    }

    function bloquejarJocPerdut() {
        $('body').addClass('joc-perdut');

        $('#titol-nivell').html('<span class="emoji-icon">🔥</span> VAIXELL ABORDAT');
        $('#descripcio-nivell').html(`
            <div style="text-align: center; color: #ff4444;">
                <span class="emoji-icon" style="font-size: 4rem; display: block; margin-bottom: 20px;">💀</span>
                <h2>HAS PERDUT LA BATALLA</h2>
                <p>El teu vaixell ha sigut capturat per la flota enemiga.</p>
                <p>No has estat prou ràpid desxifrant els mapes...</p>
            </div>
        `);

        $('#resultat').prop('disabled', true).val("TEMPS ESGOTAT");
        $('#btnEnviar').prop('disabled', true).addClass('boto-desactivat').text("DERROTA");
        $('#cronometre').text("00:00").css('color', 'red');
    }
});

// =========================================
// GESTIÓ D'ASSOLIMENTS GLOBLAS
// =========================================
function atorgarAssoliment(idAssoliment) {
    const user = firebase.auth().currentUser;
    if (user) {
        const uid = user.uid;
        
        db.ref('usuaris/' + uid + '/assoliments/' + idAssoliment).set(true)
            .then(() => {
                console.log("Tresor desbloquejat: " + idAssoliment);
                
                Swal.fire({
                    title: '🏆 NOU ASSOLIMENT!',
                    text: 'Has desbloquejat una nova enganxina al teu passaport!',
                    icon: 'success',
                    toast: true,
                    position: 'top-end', 
                    showConfirmButton: false,
                    timer: 4000
                });
            })
            .catch((error) => console.error("Error guardant l'assoliment:", error));
    }
}

// =========================================
// GESTIÓ DEL MAPA INTERACTIU
// =========================================
function dibuixarMapaAmbGrid() {
    const gridContainer = document.getElementById('mapa-grid');
    if (!gridContainer) return;

    gridContainer.innerHTML = ''; 

    const lletres = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

    const emptyCorner = document.createElement('div');
    emptyCorner.className = 'grid-header';
    gridContainer.appendChild(emptyCorner);

    for (let c = 1; c <= 8; c++) {
        const headerNum = document.createElement('div');
        headerNum.className = 'grid-header';
        headerNum.innerHTML = String(c); 
        gridContainer.appendChild(headerNum);
    }

    for (let f = 0; f < 8; f++) {
        const rowHeader = document.createElement('div');
        rowHeader.className = 'grid-header';
        rowHeader.innerHTML = lletres[f];
        gridContainer.appendChild(rowHeader);

        for (let c = 1; c <= 8; c++) {
            const cell = document.createElement('div');
            cell.className = 'grid-cell playable';
            cell.id = `cell-${lletres[f]}-${c}`;

            let illaHTML = "";

            if (lletres[f] === 'A' && c === 2) {
                    illaHTML = crearIllaHTML("🏝️", "Mêlée Island");
                }
                else if (lletres[f] === 'B' && c === 7) {
                    illaHTML = crearIllaHTML("🐢", "Tortuga");
                }
                else if (lletres[f] === 'C' && c === 3) {
                    illaHTML = crearIllaHTML("💀", "Skull Island");
                } 
                else if (lletres[f] === 'F' && c === 5) {
                    illaHTML = crearIllaHTML("🌑", "Isla de Muerta");
                    cell.style.filter = "grayscale(0.5)"; 
                }
                else if (lletres[f] === 'H' && c === 8) {
                    illaHTML = crearIllaHTML("❌", "Illa del Tresor Callat");
                    cell.style.backgroundColor = "rgba(255, 68, 68, 0.2)";
                }
                else if (lletres[f] === 'A' && c === 6) {
                    illaHTML = crearIllaHTML("🌩️", "Illa del Núvol Negre");
                    cell.style.backgroundColor = "rgba(100, 100, 255, 0.1)"; 
                }
                else if (lletres[f] === 'B' && c === 4) {
                    illaHTML = crearIllaHTML("🐒", "Monkey Island");
                }
                else if (lletres[f] === 'D' && c === 2) {
                    cell.addEventListener('click', () => {
                        // Comprovem quin és el repte actiu just EN EL MOMENT de fer clic
                        if (idRepteActiu === 'goonies') {
                            $('#modalMapa').hide();
                            soPaper.play(); 
                            AlertaPirata.fire({
                                title: '🧭 Illa del Far Antic!',
                                html: '<p>Has trobat les restes del vell far.',
                                icon: 'info',
                                confirmButtonText: 'Els Goonies Mai Diuen Morir!'
                            });
                        } else {
                            console.log("Només aigua salada...");
                        }
                    });
                }
                else if (lletres[f] === 'E' && c === 4) {
                    illaHTML = crearIllaHTML("🔥", "Illa del Foc Etern");
                }
                else if (lletres[f] === 'E' && c === 8) {
                    illaHTML = crearIllaHTML("🩸", "Blood Island");
                }
                else if (lletres[f] === 'F' && c === 7) {
                    illaHTML = crearIllaHTML("🦑", "Illa del Calamar Gegant");
                }
                else if (lletres[f] === 'G' && c === 2) {
                    illaHTML = crearIllaHTML("🐙", "Kraken Rient");
                } 
                else if (lletres[f] === 'C' && c === 3) {
                    illaHTML = crearIllaHTML("💎", "Vall dels Diamants");
                }
                else if (lletres[f] === 'A' && c === 7) {
                    illaHTML = crearIllaHTML("🌋", "Tartarus");
                    // Opcional: donar-li un toc vermellós al mar de Tartarus
                    cell.style.backgroundColor = "rgba(255, 50, 50, 0.15)"; 
                }
                else if (lletres[f] === 'G' && c === 6) {
                    illaHTML = crearIllaHTML("🐳", "Illa de la Balena");
                }

                if (illaHTML !== "") {
                    cell.innerHTML = illaHTML;
                }

            gridContainer.appendChild(cell);
        }

        function crearIllaHTML(icona, nom) {
            return `
                <div class="illa-visual">
                    <span class="illa-icona">${icona}</span>
                    <span class="illa-nom">${nom}</span>
                </div>`;
        }
    }
}

// Plantilla per les alertes pirates
const AlertaPirata = Swal.mixin({
    customClass: {
        popup: 'swal-pirata',
        title: 'swal-title-pirata',
        htmlContainer: 'swal-text-pirata',
        confirmButton: 'swal-btn-pirata'
    },
    buttonsStyling: false, // Desactivem els botons per defecte perquè agafi el nostre CSS
    background: '#1a0f00',
    color: '#ffcc00'
});