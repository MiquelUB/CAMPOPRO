# PREMISSA ABSOLUTA: ZERO DADES FICTÍCIES

**AQUESTA REGLA ÉS CRÍTICA I D'OBLIGAT COMPLIMENT EN TOT MOMENT.**

1. **NO GENERIS MAI DADES HARDCODEJADES:** Està totalment prohibit introduir dades fictícies, clients "dummy", feines de prova o registres falsos en qualsevol part del codi.
2. **ENTORN DE PRODUCCIÓ:** Treballem sempre assumint un entorn de producció. Si no hi ha dades al sistema o a la base de dades (ex. `localStorage`, backend), la UI ha de mostrar estats buits reals (ex. "No hi ha dades", "Client no trobat", "Llista buida").
3. **VALIDACIÓ REAL:** És impossible validar si l'aplicació funciona correctament si el sistema s'inventa les dades quan hi ha fallades de lectura o absència d'aquestes.
4. **COMPROVACIÓ PRÈVIA:** Abans de proposar o modificar qualsevol arxiu, llegeix i assegura't que no estàs injectant dades "de demostració".

Consulta sempre aquesta regla abans de crear components de UI o de processar dades de backend/localStorage.

# REGLES DE DESPLEGAMENT I GITHUB

1. **NO TREBALLEM EN LOCAL:** El desplegament es fa a GitHub per a que Easypanel ho pugi automàticament. L'usuari no treballa ni comprova els canvis en local.
2. **NO DEMANIS FER GIT PULL:** Està completament prohibit demanar a l'usuari que faci `git pull origin main` al seu ordinador per comprovar res, ja que no hi ha entorn local.
3. **PUSH OBLIGATORI:** En finalitzar qualsevol canvi o tasca, és obligatori fer un `git commit` i un `git push origin main` automàticament, abans d'informar a l'usuari.
4. **NOM DEL COMMIT:** En la resposta, informa sempre del nom exacte de l'últim commit (el missatge del commit) que has pujat a `main`, perquè l'usuari el pugui verificar a Easypanel/GitHub.
