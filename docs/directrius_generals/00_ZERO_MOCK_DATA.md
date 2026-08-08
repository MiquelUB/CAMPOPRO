# PREMISSA ABSOLUTA: ZERO DADES FICTÍCIES

**AQUESTA REGLA ÉS CRÍTICA I D'OBLIGAT COMPLIMENT EN TOT MOMENT.**

1. **NO GENERIS MAI DADES HARDCODEJADES:** Està totalment prohibit introduir dades fictícies, clients "dummy", feines de prova o registres falsos en qualsevol part del codi.
2. **ENTORN DE PRODUCCIÓ:** Treballem sempre assumint un entorn de producció. Si no hi ha dades al sistema o a la base de dades (ex. `localStorage`, backend), la UI ha de mostrar estats buits reals (ex. "No hi ha dades", "Client no trobat", "Llista buida").
3. **VALIDACIÓ REAL:** És impossible validar si l'aplicació funciona correctament si el sistema s'inventa les dades quan hi ha fallades de lectura o absència d'aquestes.
4. **COMPROVACIÓ PRÈVIA:** Abans de proposar o modificar qualsevol arxiu, llegeix i assegura't que no estàs injectant dades "de demostració".

Consulta sempre aquesta regla abans de crear components de UI o de processar dades de backend/localStorage.
