// 1. CONFIGURACIÓ FIREBASE
// Copia exactament el bloc 'firebaseConfig' que tens al teu webRepte.js
// 1. CONFIGURACIÓ
    const firebaseConfig = {
      // ...
    };

// Inicialitzem Firebase abans de qualsevol crida
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

let contadorPreguntes = 0;

// 2. FUNCIÓ PER AFEGIR MISSIÓ
window.afegirPreguntaHTML = function() {
    contadorPreguntes++;
    const llista = document.getElementById('llista-preguntes');
    
    const div = document.createElement('div');
    div.className = 'pregunta-card'; // Per defecte NO té la classe 'activa'
    div.id = `card-${contadorPreguntes}`;
    
    div.innerHTML = `
        <div class="missio-header">
            <div onclick="toggleMissio(${contadorPreguntes})" style="flex-grow:1;">
                <span class="fletxa">▼</span> 
                <strong id="titol-display-${contadorPreguntes}">ENIGMA ${contadorPreguntes}: Nou enimga</strong>
            </div>
            <button class="btn-delete" onclick="eliminarPregunta(${contadorPreguntes})">☠️ ELIMINAR</button>
        </div>
        <div class="missio-body">
            <label>Títol de l'Enigma</label>
            <input type="text" class="p-titol" placeholder="Ex: El mapa perdut" oninput="actualitzarTitol(${contadorPreguntes}, this.value)">
            
            <label>Contingut / Enunciat</label>
            <textarea class="p-desc" rows="4" placeholder="Escriu l'enigma aquí..."></textarea>
            
            <label>Solució Exacta</label>
            <input type="text" class="p-sol" placeholder="La resposta secreta...">
        </div>
    `;
    
    llista.appendChild(div);
};

// Funció per obrir/tancar
window.toggleMissio = function(id) {
    const card = document.getElementById('card-' + id);
    card.classList.toggle('activa');
};

// Corregim el selector del títol perquè coincideixi amb el nou ID 'titol-display'
window.actualitzarTitol = function(id, text) {
    const display = document.getElementById(`titol-display-${id}`);
    if (display) {
        display.innerText = `ENIGMA ${id}: ${text || 'Nou enigma'}`;
    }
};

window.eliminarPregunta = function(id) {
    document.getElementById('card-' + id).remove();
};

// 3. GUARDAR A FIREBASE
window.guardarRepte = function() {
    const idRepte = document.getElementById('admin-id-repte').value.trim().toLowerCase();
    const nomRepte = document.getElementById('admin-nom-repte').value.trim();
    const minuts = parseInt($('#temps-repte').val()) || 10;
    const segonsTotals = minuts * 60; // Ho guardem sempre en segons per facilitar el cronòmetre

    if (!idRepte || !nomRepte) {
        Swal.fire('DADES INCOMPLETES', 'L\'ID i el Nom del repte són obligatoris.', 'warning');
        return;
    }

    let levels = {};
    const cards = document.querySelectorAll('.pregunta-card');
    let valid = true;

    cards.forEach((card, index) => {
        const i = index + 1;
        const titol = card.querySelector('.p-titol').value.trim();
        const contingut = card.querySelector('.p-desc').value.trim();
        const solucio = card.querySelector('.p-sol').value.trim();

        if (!titol || !contingut || !solucio) {
            valid = false;
            card.classList.add('activa');
        }

        levels[`level${i}`] = {
            titol,
            contingut,
            solucio
        };
    });

    if (!valid) {
        Swal.fire('ERROR', 'Falten dades en algunes missions.', 'error');
        return;
    }

    // Loader de SweetAlert
    Swal.fire({ 
        title: 'PUJANT DADES...', 
        text: 'Sincronitzant amb la base de dades...',
        allowOutsideClick: false,
        didOpen: () => { Swal.showLoading(); } 
    });

// --- NOU CODI: PREPAREM TOTS ELS GUARDATS ---
    
    // 1. Recollim les dades de l'assoliment dels nous inputs
    const assoNom = document.getElementById('admin-asso-nom').value.trim();
    const assoDesc = document.getElementById('admin-asso-desc').value.trim();
    const assoImg = document.getElementById('admin-asso-img').value.trim();
    const assoOrdre = parseInt(document.getElementById('admin-asso-ordre').value) || 1;

    // Creem una llista d'accions (promeses) a enviar a Firebase
    const promesesGuardat = [];

    // 2. Afegim l'acció de guardar el repte principal
    promesesGuardat.push(
        db.ref('reptes/' + idRepte).set({
            titol_repte: nomRepte,
            levels: levels,
            tempsFinal: segonsTotals
        })
    );

    // 3. Afegim l'acció de guardar l'assoliment (NOMÉS si el capità ha posat un nom)
    if (assoNom !== '') {
        promesesGuardat.push(
            db.ref('cataleg_assoliments/' + idRepte).set({
                nom: assoNom,
                descripcio: assoDesc,
                imatge: assoImg,
                ordre: assoOrdre
            })
        );
    }

    // 4. Disparem tots els canons alhora!
    Promise.all(promesesGuardat)
        .then(() => {
            Swal.fire('⚓ TRESOR ENTERRAT!', 'El repte i l\'assoliment s\'han guardat correctament.', 'success');
        })
        .catch(error => {
            console.error("Error al guardar:", error);
            Swal.fire('ERROR CRÍTIC', error.message, 'error');
        });
};

document.addEventListener('DOMContentLoaded', () => {
    // Si la llista està buida, creem 5 per defecte
    if(document.getElementById('llista-preguntes').children.length === 0) {
        for(let i=0; i<5; i++) afegirPreguntaHTML();
    }
});

window.carregarRepteExistent = function() {
    const id = document.getElementById('admin-id-repte').value.trim().toLowerCase();
    if (!id) return Swal.fire('ID buit', 'Escriu un ID per buscar', 'info');

    Swal.showLoading();
    
    // Fem dues peticions alhora: busquem el repte i l'assoliment
    Promise.all([
        db.ref('reptes/' + id).once('value'),
        db.ref('cataleg_assoliments/' + id).once('value')
    ]).then((resultats) => {
        Swal.close();
        const dataRepte = resultats[0].val();
        const dataAsso = resultats[1].val();

        if (!dataRepte) {
            Swal.fire('No trobat', 'Aquest ID és nou. Omple les dades per crear-lo.', 'info');
            return;
        }

        // Omplim dades bàsiques del joc
        document.getElementById('admin-nom-repte').value = dataRepte.titol_repte;
        $('#temps-repte').val(dataRepte.tempsFinal / 60);

        // Omplim dades de l'assoliment (si en té un d'associat)
        if (dataAsso) {
            document.getElementById('admin-asso-nom').value = dataAsso.nom || '';
            document.getElementById('admin-asso-desc').value = dataAsso.descripcio || '';
            document.getElementById('admin-asso-img').value = dataAsso.imatge || '';
            document.getElementById('admin-asso-ordre').value = dataAsso.ordre || 1;
        } else {
            // Si el repte existeix però no tenia assoliment, deixem les caselles en blanc
            document.getElementById('admin-asso-nom').value = '';
            document.getElementById('admin-asso-desc').value = '';
            document.getElementById('admin-asso-img').value = 'img/logro_nou.png';
            document.getElementById('admin-asso-ordre').value = 1;
        }

        // Netejem i carreguem les preguntes
        const llista = document.getElementById('llista-preguntes');
        llista.innerHTML = "";
        contadorPreguntes = 0;

        Object.keys(dataRepte.levels).forEach((key, index) => {
            const level = dataRepte.levels[key];
            afegirPreguntaHTML(); // Creem la card
            
            // Omplim la última card creada
            const card = llista.lastElementChild;
            card.querySelector('.p-titol').value = level.titol;
            card.querySelector('.p-contingut').value = level.contingut;
            card.querySelector('.p-solucio').value = level.solucio;
        });
    }).catch(err => {
        Swal.close();
        console.error("Error al carregar:", err);
        Swal.fire('Error', 'No s\'ha pogut connectar amb la base de dades', 'error');
    });

};  
