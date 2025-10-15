import Dexie from 'dexie';

const db = new Dexie('db_Ec_Travaux');
db.version(13).stores({

  materiel: 'Code, Materiels, Unite, Prix, Observation',
  Mainoeuvre : '++CodeMainOeuvre,nomCategorie,salaireBase,heureSupp,totalPartiel,chargeSalariales,pmjFinal',
  Materiaux : 'id,Categorie,Type,Materiaux,Unites,Pu,CoutTrans,PrixChantier',
  taches: '++idTache, idDevis, Num, unite, quantiteR, rendementJ, dureeJ, coefficientK, terminee',     
  tache_main_oeuvre: '++idTacheM, idTache, CodeMainOeuvre, qteU, uniteJ, qteTotale, Pu',
  tache_materiel: '++idTacheMateriel, idTache, Code, qteU, uniteJ, qteTotale, Pu',
  tache_materiaux: '++idTacheMateriaux, idTache, id, qteU, uniteJ, qteTotale, Pu',
  sdp:'++idSdp,idTacheM,idTacheMateriel,idTacheMateriaux',
  Devis : 'idDevis,nomProjet,type',
  bde : '++Num,idDevis,CodeTrav,CodeDes,Unite,Quantite,Pu,Montant',
  Travaux : '++CodeTrav,travaux',
  designation : '++CodeDes,Designation,Description',
  // SDP
  // SUPPRESSION
  suppressions: '++id, userId',


}); 

export default db;
