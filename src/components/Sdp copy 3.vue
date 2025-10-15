<template>


<div class="container">
    <br>
  <!-- Titre principal -->
    <div class="card shadow-sm mb-4">
      <div class="card-body text-center">
        <h4 class="mb-3 text-primary fw-bold">
          CADRE DE SOUS DETAIL DE PRIX
        </h4>
      </div>
    </div>

  <br>
  <div class="mb-3 text-end">
          <button class="btn btn-primary" @click="modaleSdp">Nouveau Sdp</button>
  </div>


        <!-- MODALE AJOUT SDP -->

<form @submit.prevent="ajouterTache()">       

    <div class="bloc-modale" v-if="afficherModaleSdp">

        <div class="overlay" v-on:click="AffichageSdp()"></div>
        
        <div class="modale card">

            <div class="btn-modale btn btn-danger" v-on:click="AffichageSdp()">X</div>
            <h1 class="styleTexte">Ajouter Designation Sdp</h1><br>

          <!-- Designation bde -->

          <div class="row">

            <div class="col-md-6">

              <div class="mb-3">

                <label class="form-label">Projet <b style="color: rgb(255, 0, 0);">*</b></label>
                <select v-model="ProjetSelectionner" class="form-control" @change="DesignationCorrespondant" required>

                  <option disabled value="">-- Choisir un projet --</option>
                  <option v-for="devis in ProjetList" :key="devis.idDevis" :value="devis.idDevis">
                    {{ devis.nomProjet }}
                  </option>
                
                </select>
      
              </div>

            </div>
            





            <div class="col-md-6">

              <div class="mb-3">

                <label for="" class="form-label">Désignation <b style="color: rgb(255, 0, 0);">*</b></label>
                <select class="form-control" v-model="selectedDesBde" @change="UniteCorrespondant" required>
      
                  <option disabled value="">-- Choisir une designation --</option>
                  <option v-for="desProjet in ListeDesignationProjet" :key="desProjet.Num" :value="desProjet">
                    {{ desProjet.Designation }}
                  </option>
      
                </select>

              </div>           

            </div>

            
          </div>

           <div class="row">


              <div class="col-md-6">
                <div class="mb-3">
                    <label for="" class="form-label">Coefficient K <b style="color: rgb(255, 0, 0);">*</b></label>
                    <input class="form-control" v-model="coefficientK" placeholder="coefficient" required/>
                  </div>
              </div>



             <div class="col-md-6">
                <div class="mb-3">
                  <label for="" class="form-label">Unité <b style="color: rgb(255, 0, 0);">*</b></label>
                  <input class="form-control" v-model="unite" placeholder="unité" readonly/>
                </div>
             </div>

           
            </div>



           <div class="row">

              <div class="col-md-6">
                <div class="mb-3">

                  <label for="" class="form-label">Quantité à réaliser <b style="color: rgb(255, 0, 0);">*</b></label>
                  <input class="form-control" v-model="quantiteR" placeholder="quantité" required/>
          
                </div>
              </div>




             <div class="col-md-6">
               <div class="mb-3">
          
                <label for="" class="form-label">Rendement Journalier R <b style="color: rgb(255, 0, 0);">*</b></label>
                <input class="form-control" v-model="rendementJ" placeholder="rendement" required/>
        
                </div>
              </div>

           </div>

           <div class="row">

              <div class="col-md-6">

                  <div class="mb-3">
          
                    <label for="" class="form-label">Durée de la tâche <b style="color: rgb(255, 0, 0);">*</b></label>
                    <input class="form-control" v-model="dureeJ" placeholder="durée" readonly/>
        
                  </div>
        

              </div>

           </div>
           
      
            
        <button class="btn btn-primary">Enregistrer</button>
            

        </div>
      
    </div>

</form>







  <multiselect v-model="selectedTache" :options="tacheList" placeholder="Choisir Designation" :searchable="true" :close-on-select="true" :show-labels="false" label="Designation" track-by="idTache" @select="chargerTache">
            <template #noResult>

              <div style="padding: 5px; color: red;">
      
                Aucun résultat trouvé. Veuillez vérifier votre saisie. <br><br>  

              </div>
    
    
              </template>
          
  </multiselect>
  <br>



 <!-- TABLEAU SDP DESIGNATION -->
<div>
  <h3>Sous Détail de Prix N°</h3>
  <h3 style="float: right;font-weight: 700;" v-if="selectedTache">
     K1 = {{ formatCoefficient(selectedTache.coefficientK) }}
  </h3>
</div>




<table class="table table-bordered table-hover sdp-tableDesignation">
  <thead>
    <tr>
      <th>Désignation</th>
      <th>Unité</th>
      <th>Quantité à réaliser</th>
      <th>Rendement Journalier R</th>
      <th>Durée de la tâche</th>
      <th>Action</th>
    </tr>
  </thead>
  <tbody>
    <tr v-for="t in sdp.tacheCorrespondant" :key="t.idTache" style="text-align: center;">
      <td>{{ t.Designation }}</td>
      <td>{{ t.unite }}</td>
      <td>{{ formatQte(t.quantiteR) }}</td>
      <td>{{ formatQte(t.rendementJ) }}</td>
      <td>{{ formatQte(t.dureeJ) }}
        <!-- <span v-if="!t.terminee" style="color:green;font-weight:bold;">✔️</span> -->
      </td>
      <td>
<!--         
        <font-awesome-icon v-if="t.terminee" icon="check-circle" class="text-success"/>
        <font-awesome-icon v-else="!t.terminee" icon="times-circle" class="text-danger"/> -->
        <font-awesome-icon :icon="t.terminee ? 'check-circle' : 'times-circle'" :class="t.terminee ? 'text-success' : 'text-danger'" style="font-size: 25px;" />
      </td>
      <td>
        <button v-if="t.terminee" class="btn btn-sm btn-outline-success" disabled>Terminée</button>
        <button v-else="!t.terminee" class="btn btn-sm btn-outline-success" @click="toggleTerminee(t)"><font-awesome-icon icon="plus"/> Ajouter</button>
        <button class="btn btn-sm btn-outline-primary" style="float: right;" v-on:click="RecupererTache(t.idTache,t.Designation)"><font-awesome-icon icon="pen" /> Modifier</button>
      </td>
      
    </tr>
  </tbody>
</table>

<br>



<!-- MODALE MODIF TACHE SDP -->

    <div class="bloc-modale" v-if="modalModifTacheSdp">

        <div class="overlay" v-on:click="AffichageModifTacheSdp()"></div>
        
        <div class="modale card">

            <div class="btn-modale btn btn-danger" v-on:click="AffichageModifTacheSdp()">X</div>
            <h1 class="styleTexte">Modification Sdp</h1><br>
            
            
            <div class="row">
              
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">Projet <b style="color: rgb(255, 0, 0);"> *</b></label>
                <select v-model="modifProjet" class="form-control" @change="DesignationCorrespondantModif" required>

                  <option disabled value="">-- Choisir un projet --</option>
                  <option v-for="devis in ProjetList" :key="devis.idDevis" :value="devis.idDevis">
                    {{ devis.nomProjet }}
                  </option>
                
                </select>
                </div>
              </div>

              <div class="col-md-6">
                <div class="mb-3">
                <label for="" class="form-label">Désignation <b style="color: rgb(255, 0, 0);">*</b></label>
                <select class="form-control" v-model="modifDesignation" required>
      
                  <option disabled value="">-- Choisir une designation --</option>
                  <option v-for="desProjet in ListeDesignationProjetModif" :key="desProjet.Num" :value="desProjet.Num">
                    {{ desProjet.Designation }}
                  </option>
      
                </select>
                </div>
              </div>

            </div>

              


                
                

            <div class="row">


              <div class="col-md-6">
                <div class="mb-3">
                    <label for="" class="form-label">Coefficient K <b style="color: rgb(255, 0, 0);">*</b></label>
                    <input class="form-control" v-model="modifCoefficientK" placeholder="coefficient" required/>
                  </div>
              </div>



             <div class="col-md-6">
                <div class="mb-3">
                  <label for="" class="form-label">Unité <b style="color: rgb(255, 0, 0);">*</b></label>
                  <input class="form-control" v-model="modifUnite" placeholder="unité" required/>
                </div>
             </div>

           
            </div>



           <div class="row">

              <div class="col-md-6">
                <div class="mb-3">

                  <label for="" class="form-label">Quantité à réaliser <b style="color: rgb(255, 0, 0);">*</b></label>
                  <input class="form-control" v-model="modifQuantiteR" placeholder="quantité" required/>
          
                </div>
              </div>




             <div class="col-md-6">
               <div class="mb-3">
          
                <label for="" class="form-label">Rendement Journalier R <b style="color: rgb(255, 0, 0);">*</b></label>
                <input class="form-control" v-model="modifRendementJ" placeholder="rendement" required/>
        
                </div>
              </div>

           </div>

           <div class="row">

              <div class="col-md-6">

                  <div class="mb-3">
          
                    <label for="" class="form-label">Durée de la tâche <b style="color: rgb(255, 0, 0);">*</b></label>
                    <input class="form-control" v-model="modifDureeJ" placeholder="durée" readonly/>
        
                  </div>
        

              </div>

           </div>
              
             <button class="btn btn-primary" v-on:click="ModifierTacheSdp()">Enregistrer</button>
            </div>
            
           
            
            
      
    </div>






  <table class="table table-bordered table-hover sdp-table">
    <thead>
      <tr>
        <th>Composante du prix</th>
        <th>Qté unitaire</th>
        <th>Unité ou jour</th>
        <th>Quantité totale</th>
        <th>Prix unitaire sec</th>
        <th>Total</th>
      </tr>
    </thead>
    <tbody>
      <!-- MAIN D'OEUVRE -->
      <tr>
        <td><center><strong>Main d'œuvre</strong></center></td>
      </tr>
      <tr v-for="item in sdp.mainOeuvre" :key="'mo-' + item.id">
        <td>{{ item.nom }}</td>
        <td>{{ formatQte(item.qteU) }}</td>
        <td>{{ item.uniteJ }}</td>
        <td>{{ formatQte(item.qteTotale) }}</td>
        <td>{{ formatPrice(item.Pu) }}</td>
        <td>{{ formatTotal(item.total) }}</td>
      </tr>



       <tr>
        <td>

          <multiselect v-model="selectedMainOeuvre" :options="MainOeuvreList" placeholder="Choisir main d'oeuvre" :searchable="true" :close-on-select="true" :show-labels="false" label="nomCategorie" track-by="CodeMainOeuvre" @select="SelectionMainOeuvre">
            <template #noResult>

              <div style="padding: 5px; color: red;background: linear-gradient(200deg,#cfe4e465,#c6d2df,#a4c3c79a);">
      
                Aucun résultat trouvé. Veuillez vérifier votre saisie. <br><br>  

              </div>
      
              <hr>  
              <button type="button" @click="modaleMainOeuvre">
                      Créer cette main d'oeuvre
              </button>
      
    
              </template>
          </multiselect>




    <!-- MODALE AJOUT DESIGNATION MAIN OEUVRE -->

    <div class="bloc-modale" v-if="afficherModale">

        <div class="overlay" v-on:click="Affichage()"></div>
        
        <div class="modale card">

            <div class="btn-modale btn btn-danger" v-on:click="Affichage()">X</div>
            <h1 class="styleTexte">Ajouter main d'oeuvre</h1><br>
            <h5 style="background:  linear-gradient(100deg,#08b4b4ee,#557497,#00bbd49a);text-align: center;font-weight: 800;color:white;padding:10px;">{{ CategorieSelectionner }}</h5>
        
        <div class="mb-3">
          <label for="" class="form-label">Quantité unitaire</label>
          <input class="form-control" v-model="qteU" placeholder="qteU"/>
        </div>
      
        <div class="mb-3">
          <label for="" class="form-label">Unité ou jours</label>
          <input class="form-control" v-model="uniteJ" placeholder="uniteJ" required/>
        </div>

        <div class="mb-3">
          <label for="" class="form-label">Quantité totale</label>
          <input class="form-control" v-model="qteTotale" placeholder="qteTotale" disabled/>
          
        </div>
        
        <div class="mb-3">
          
          <label for="" class="form-label">Prix unitaire sec</label>
          <input class="form-control" v-model="Pu" placeholder="Pu" disabled/>
        
        </div>
      
            
            <button class="btn btn-primary" v-on:click="ajouterTacheMainOeuvre">Ajouter</button>
            

        </div>
      
    </div>


    <!-- MODALE AJOUT NOUVEAU MAIN OEUVRE -->

    <div class="bloc-modale" v-if="afficherModaleMainOeuvre">

        <div class="overlay" v-on:click="AffichageMainOeuvre()"></div>
        
        <div class="modale card">

            <div class="btn-modale btn btn-danger" v-on:click="AffichageMainOeuvre()">X</div>
            <h1 class="styleTexte">Nouveau main d'oeuvre</h1><br>
            

            
        <div class="mb-3">
          <label for="" class="form-label">Nom de la Main d'oeuvre</label>
          <input class="form-control" v-model="nom" placeholder="nom" required/>
        </div>
      
        <div class="mb-3">
          <label for="" class="form-label">Salaire de base</label>
          <input class="form-control" v-model="SalaireBase" placeholder="SalaireBase" required/>
        </div>

        <div class="mb-3">
          <label for="" class="form-label">Heure de base</label>
          <input class="form-control" v-model="HeureBase" placeholder="HeureBase" required/>
          
        </div>
      
            
            <button class="btn btn-primary" v-on:click="ajouterMainOeuvre">Ajouter</button>
            

        </div>
      
    </div>




        </td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        
      </tr>


      <tr class="a">
        <td style="background: linear-gradient(200deg,#02303065,#557497,#00bbd49a);color: white;"><strong style="float: right;">Total partiel</strong></td>
        <td colspan="4"></td>
        <td><strong>{{ formatTotal(sdp.totalMainOeuvre) }}</strong></td>
      </tr>
      
     

      <!-- MATERIELS -->

      <tr>
        <td><center><strong>Matériels</strong></center></td>
      </tr>
      <tr v-for="item in sdp.materiels" :key="'mat-' + item.id">
        <td>{{ item.nom }}</td>
        <td>{{ formatQte(item.qteU) }}</td>
        <td>{{ item.uniteJ }}</td>
        <td>{{ formatQte(item.qteTotale) }}</td>
        <td>{{ formatPrice(item.Pu) }}</td>
        <td>{{ formatTotal(item.total) }}</td>
      </tr>



      
       <tr>
        <td>

          <multiselect v-model="selectedMateriel" :options="MaterielList" placeholder="Choisir materiel" :searchable="true" :close-on-select="true" :show-labels="false" label="Materiels" track-by="Code" @select="modaleMateriel">
            <template #noResult>

              <div style="padding: 5px; color: red;background-color: rgba(0, 0, 0, 0.205);">
      
                Aucun résultat trouvé. Veuillez vérifier votre saisie. <br><br>  

              </div>
      
              <hr>  
              <button type="button" @click="modaleNouveauMateriel">
                      Créer ce materiel
              </button>
      
    
              </template>
          
            </multiselect>




    <!-- MODALE AJOUT NOUVEAU DESIGNATION MATERIEL -->

    <div class="bloc-modale" v-if="afficherModaleMateriel">

        <div class="overlay" v-on:click="AffichageMateriel()"></div>
        
        <div class="modale card">

            <div class="btn-modale btn btn-danger" v-on:click="AffichageMateriel()">X</div>
            <br><h1 class="styleTexte">Ajouter materiel</h1><br>
            <h5 style="background:  linear-gradient(100deg,#08b4b4ee,#557497,#00bbd49a);text-align: center;font-weight: 800;color:white;padding:10px;">{{ MaterielSelectionner }}</h5>
        
        
        <div class="mb-3">
          <label for="" class="form-label">Quantité unitaire</label>
          <input class="form-control" v-model="qteUMat" placeholder="qteU" required/>
        </div>
      
        <div class="mb-3">
          <label for="" class="form-label">Unité ou jours</label>
          <input class="form-control" v-model="uniteJMat" placeholder="uniteJ" required/>
        </div>

        <div class="mb-3">
          <label for="" class="form-label">Quantité totale</label>
          <input class="form-control" v-model="qteTotaleMat" placeholder="qteTotale" disabled/>
          
        </div>
        
        <div class="mb-3">
          
          <label for="" class="form-label">Prix unitaire sec</label>
          <input class="form-control" v-model="PuMat" placeholder="Pu" disabled/>
        
        </div>
      
            
            <button class="btn btn-primary" v-on:click="ajouterTacheMateriel">Ajouter</button>
            

        </div>
      
    </div>


    <!-- NOUVEAU MATERIEL -->


    <div class="bloc-modale" v-if="afficherModaleMaterielAjout">

        <div class="overlay" v-on:click="AffichageMaterielModale()"></div>
        
        <div class="modale card">

            <div class="btn-modale btn btn-danger" v-on:click="AffichageMaterielModale()">X</div>
            <br><h1 class="styleTexte">Nouveau materiel</h1><br>


        
        <div class="mb-3">
          <label for="" class="form-label">Code</label>
           <input v-model="Code" type="number" class="form-control" placeholder="Code" required>
        </div>
      
        <div class="mb-3">
          <label for="" class="form-label">Matériel</label>
           <input v-model="Materiels" type="text" class="form-control" placeholder="Matériel" required>
        </div>

        <div class="mb-3">
          <label for="" class="form-label">Unité</label>
          <input v-model="Unite" type="text" class="form-control" placeholder="Unité" required>
          
        </div>
        
        <div class="mb-3">
          
          <label for="" class="form-label">Prix</label>
         <input v-model="Prix" type="number" class="form-control" placeholder="Prix" required>
        
        </div>

        <div class="mb-3">
          
          <label for="" class="form-label">Observation</label>
          <input v-model="Observation" type="text" class="form-control" placeholder="Observation">
        
        </div>
      
            
            <button class="btn btn-primary" v-on:click="ajouterMateriel">Ajouter</button>
            

        </div>
      
    </div>


        </td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        
      </tr>



      <tr>
        <td style="background: linear-gradient(200deg,#02303065,#557497,#00bbd49a);color: white;"><strong style="float: right;">Total partiel</strong></td>
        <td colspan="4"></td>
        <td><strong>{{ formatTotal(sdp.totalMateriels) }}</strong></td>
      </tr>


      <!-- MATERIAUX -->
      
      <tr>
        <td><center><strong>Matériaux</strong></center></td>
      </tr>
      <tr v-for="item in sdp.materiaux" :key="'mat-' + item.id">
        <td>{{ item.nom }}</td>
        <td>{{ formatQte(item.qteU) }}</td>
        <td>{{ item.uniteJ }}</td>
        <td>{{ formatQte(item.qteTotale) }}</td>
        <td>{{ formatPrice(item.Pu) }}</td>
        <td>{{ formatTotal(item.total) }}</td>
      </tr>

      
       <tr>
        <td>

          <multiselect v-model="selectedMateriaux" :options="MateriauxList" placeholder="Choisir materiaux" :searchable="true" :close-on-select="true" :show-labels="false" label="Materiaux" track-by="id" @select="modaleMateriaux">
            <template #noResult>

              <div style="padding: 5px; color: red;background-color: rgba(0, 0, 0, 0.205);">
      
                Aucun résultat trouvé. Veuillez vérifier votre saisie. <br><br>  

              </div>
      
              <hr>  
              <button type="button" @click="modaleMateriaux">
                      Créer cette materiaux
              </button>
      
    
              </template>
          
            </multiselect>




    <!-- MODALE AJOUT NOUVEAU DESIGNATION MATERIAUX -->

    <div class="bloc-modale" v-if="afficherModaleMateriaux">

        <div class="overlay" v-on:click="AffichageMateriaux()"></div>
        
        <div class="modale card">

            <div class="btn-modale btn btn-danger" v-on:click="AffichageMateriaux()">X</div>
            <h1 class="styleTexte">Ajouter materiaux</h1><br>
            <h5 style="background:  linear-gradient(100deg,#08b4b4ee,#557497,#00bbd49a);text-align: center;font-weight: 800;color:white;padding:10px;">{{ MateriauxSelectionner }}</h5>
        
        <div class="mb-3">
          <label for="" class="form-label">Quantité unitaire</label>
          <input class="form-control" v-model="qteUMater" placeholder="qteU" required/>
        </div>
      
        <div class="mb-3">
          <label for="" class="form-label">Unité ou jours</label>
          <input class="form-control" v-model="uniteJMater" placeholder="unite" required/>
        </div>

        <div class="mb-3">
          <label for="" class="form-label">Quantité totale</label>
          <input class="form-control" v-model="qteTotaleMater" placeholder="qteTotale" disabled/>
          
        </div>
        
        <div class="mb-3">
          
          <label for="" class="form-label">Prix unitaire sec</label>
          <input class="form-control" v-model="PuMater" placeholder="Pu" disabled/>
        
        </div>
      
            
            <button class="btn btn-primary" v-on:click="ajouterTacheMateriaux">Ajouter</button>
            

        </div>
      
    </div>


    <!-- NOUVEAU MATERIAUX -->

    <div class="bloc-modale" v-if="afficherModaleMateriauxAjout">

        <div class="overlay" v-on:click="AffichageMateriauxModale()"></div>
        
        <div class="modale card">

            <div class="btn-modale btn btn-danger" v-on:click="AffichageMateriauxModale()">X</div>
            <h1 class="styleTexte">Nouveau materiaux</h1><br>
        
        <div class="mb-3">
          <label for="" class="form-label">Quantité unitaire</label>
          <input class="form-control" v-model="qteUMater" placeholder="qteUMater" required/>
        </div>
      
        <div class="mb-3">
          <label for="" class="form-label">Unité ou jours</label>
          <input class="form-control" v-model="uniteJMater" placeholder="uniteJMater" required/>
        </div>

        <div class="mb-3">
          <label for="" class="form-label">Quantité totale</label>
          <input class="form-control" v-model="qteTotaleMater" placeholder="qteTotaleMater" required/>
          
        </div>
        
        <div class="mb-3">
          
          <label for="" class="form-label">Prix unitaire sec</label>
          <input class="form-control" v-model="PuMater" placeholder="PuMater" disabled/>
        
        </div>
      
            
            <button class="btn btn-primary" v-on:click="ajouterTacheMateriaux">Ajouter</button>
            

        </div>
      
    </div>

        </td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        
      </tr>


      <tr>
        <td style="background: linear-gradient(200deg,#02303065,#557497,#00bbd49a);color: white;"><strong style="float: right;">Total partiel</strong></td>
        <td colspan="4"></td>
        <td><strong>{{ formatTotal(sdp.totalMateriaux) }}</strong></td>
      </tr>

      <!-- TOTAL FINAL -->
      <tr>
        <td></td>
        <td></td>
        <td></td>
        <td style="background: linear-gradient(200deg,#e3e7e765,#f8fbff,#0b3d449a);color: black;" colspan="2"><center><strong>Total des déboursés sec</strong></center></td>
        <td><strong>{{ formatTotal(sdp.totalGeneral) }}</strong></td>
        
      </tr><br>
      <tr>
        <td></td>
        <td></td>
        <td></td>
        <td style="background: linear-gradient(200deg,#02303065,#557497,#00bbd49a);color: white;" colspan="2"><center><strong>Prix unitaire de reglèment</strong></center></td>
        <td>{{ formatPrice(sdp.totalGeneral) }}</td>
      </tr>
    </tbody>
    
  </table>

</div>

  <button @click="generatePDF">Télécharger PDF</button>

</template>

<script>
import multiselect from 'vue-multiselect'
import 'vue-multiselect/dist/vue-multiselect.min.css'
import db from '@/db';
import jsPDF from "jspdf";
import "jspdf-autotable";

export default {
  components: {
    multiselect
  },
  data() {
    return {

      // modification sdp

      modifProjet:'',
      modifDesignation:'',
      modifUnite:'',
      modifQuantiteR:'',
      modifRendementJ:'',
      modifDureeJ:'',
      modifCoefficientK:'',
      modifTerminee:'',


      // selection

      ProjetSelectionner:'',
      CategorieSelectionner:'',
      MaterielSelectionner:'',
      MateriauxSelectionner:'',

      // attribut affichage modale main d'oeuvre

      nom:'',
      SalaireBase:'',
      HeureBase:'',
      heures: {
              base: 48,
              hs25: 8,
              hs50: 0,
              hs100: 0,
            },
            charges: {
              salariales: 25,
              prime: 0,
            },

      // attribut affichage modale

      afficherModaleSdp:false,
      afficherModale:false,
      afficherModaleMateriel:false,
      afficherModaleMateriaux:false,
      afficherModaleMainOeuvre:false,
      afficherModaleMaterielAjout:false,
      afficherModaleMateriauxAjout:false,
      modalModifTacheSdp:false,


      // attribut pour faire sdp de chaque designation
    
    Num:'',
    unite:'',
    quantiteR:'',
    rendementJ:'',
    dureeJ:'',
    coefficientK:'',

      

      // attribut main d'oeuvre

    CodeMainOeuvre:'', 
    qteU:'', 
    uniteJ:'', 
    qteTotale:'', 
    Pu:'',

    // attribut materiel

    // Code:'',
    qteUMat:'',
    uniteJMat:'',
    qteTotaleMat:'',
    PuMat:'',

    
    // attribut materiaux

    id:'',
    qteUMater:'',
    uniteJMater:'',
    qteTotaleMater:'',
    PuMater:'',

      // SELECTED

      selectedDesBde:'',
      selectedTache:'',
      selectedMainOeuvre:'',
      selectedMateriel:'',
      selectedMateriaux:'',
      
      // LIST
      
      ProjetList:[],
      DesignationBdeList:[],
      MainOeuvreList:[],
      MaterielList:[],
      MateriauxList:[],
      tacheList:[],
      ListeDesignationProjet:[],
      ListeDesignationProjetModif:[],


      selected: null,
      sdp: {
        mainOeuvre: [],
        materiels: [],
        materiaux: [],
        tacheCorrespondant:[],
        totalMainOeuvre: 0,
        totalMateriels: 0,
        totalMateriaux:0,
        totalGeneral: 0
      },

      // attribut nouveau materiel

      // Réinitialiser formulaire
      
      Code : '',
      Materiels : '',
      Unite : '',
      Prix : '',
      Observation : ''



    }
  },

watch :{

qteU:function(val){
this.qteU = val;
this.qteTotale = val * this.selectedTache.dureeJ;
},

qteUMat:function(val){
this.qteUMat = val;
this.qteTotaleMat  = val * this.selectedTache.dureeJ;
},

qteUMater:function(val){
  this.qteUMater = val;
  this.qteTotaleMater  = val * this.selectedTache.dureeJ;
},

quantiteR:function(val) {
    this.calculerDuree();
  },
  rendementJ:function(val) {
    this.calculerDuree();
  },

            // MODIF  
  
modifQuantiteR:function(val) {
    this.calculerDureeModif();
  },
modifRendementJ:function(val) {
    this.calculerDureeModif();
  },



},
   async mounted() {

    // await this.loadData();
    await this.ListeProjets();
    await this.ListeMainOeuvre();
    await this.ListeMateriel();
    await this.ListeMateriaux();
    await this.ListeDesignationBde();
    await this.ListeTaches();
    // await this.DesignationCorrespondantModif();
  
  },
  methods: {
     

calculerDuree() {
    if (this.rendementJ && this.rendementJ !== 0) {
      this.dureeJ = (this.quantiteR / this.rendementJ).toFixed(2);
    } else {
      this.dureeJ = 0;
    }
  },

  calculerDureeModif() {
    if (this.modifRendementJ && this.modifRendementJ !== 0) {
      this.modifDureeJ = (this.modifQuantiteR / this.modifRendementJ).toFixed(2);
    } else {
      this.modifDureeJ = 0;
    }
  },

  /**
 * Met à jour la durée de la tache et recalcule qteTotale dans les tables liées.
 * idTache : id de la tache
 * newDuree : Number (durée en nombre)
 */
async updateRelatedQteTotale(idTache, newDuree) {
  if (!idTache) return;

  // s'assurer que newDuree est bien un Number
  const duree = Number(newDuree) || 0;

  try {
    await db.transaction('rw',
      db.taches,
      db.tache_main_oeuvre,
      db.tache_materiel,
      db.tache_materiaux,
      async () => {
        // 1) Mettre à jour la durée dans la table taches
        await db.taches.update(idTache, { dureeJ: duree });

        // 2) Mettre à jour qteTotale = qteU * duree dans chaque table liée
        await db.tache_main_oeuvre
          .where({ idTache })
          .modify((row) => {
            row.qteTotale = Number(row.qteU || 0) * duree;
          });

        await db.tache_materiel
          .where({ idTache })
          .modify((row) => {
            row.qteTotale = Number(row.qteU || 0) * duree;
          });

        await db.tache_materiaux
          .where({ idTache })
          .modify((row) => {
            row.qteTotale = Number(row.qteU || 0) * duree;
          });
      }
    );

    // Après la transaction, recharger les données affichées pour mettre à jour l'UI
    if (this.selectedTache && this.selectedTache.idTache === idTache) {
      await this.chargerTache(this.selectedTache);
    }
    await this.ListeTaches(); // si tu affiches la liste des taches ailleurs
    console.log(`updateRelatedQteTotale: mise à jour OK pour tache ${idTache}`);
  } catch (err) {
    console.error("Erreur updateRelatedQteTotale:", err);
  }
},


  async ModifierTacheSdp() {
  // suppose que this.selectedTache.idTache est la tache modifiée
  const id = this.selectedTache ? this.selectedTache.idTache : null;
  if (!id) return;
  alert(id);

  // 1) Mettre à jour les champs de la tache (quantiteR, rendementJ, dureeJ, unite, coefficientK, terminee, ...)
  await db.taches.update(id, {
    idDevis: this.modifProjet,
    Num: this.modifDesignation,
    unite: this.modifUnite,
    quantiteR: Number(this.modifQuantiteR),
    rendementJ: Number(this.modifRendementJ),
    dureeJ: Number(this.modifDureeJ),
    coefficientK: Number(this.modifCoefficientK),
    terminee: this.modifTerminee
  });

  // 2) Propager la nouvelle dureeJ dans les tables liées (qteTotale = qteU * dureeJ)
  await this.updateRelatedQteTotale(id, Number(this.modifDureeJ));

  // 3) Recharger la tâche complète (pour recalculer totalGeneral)
  const tache = await db.taches.get(id);

  // 4) Mettre à jour le prix unitaire dans la table bde
  await this.updatePrixUnitaireBde(tache);


  // 5) fermer modal, recharger UI
  this.modalModifTacheSdp = false;
  await this.ListeTaches();
  if (this.selectedTache) await this.chargerTache(this.selectedTache);
},




    // MODIFICATION

      // RECUPERER TRAVAUX

async RecupererTache(idTache,Designation) {
  // const trav = await db.Travaux.get(idTravaux);
  // if (trav) {
  //   this.idTravauxEnCours = trav.CodeTrav;
  //   this.modifNomTrav = trav.travaux;
  //   this.modalModifTrav = true;
  // }

  
  const tache = await db.taches.get(idTache);
  if (tache) {
    
    this.modalModifTacheSdp = true;
    this.modifProjet = tache.idDevis;
    this.modifDesignation = tache.Num;
    this.modifUnite = tache.unite,
    this.modifQuantiteR = tache.quantiteR,
    this.modifRendementJ = tache.rendementJ,
    this.modifDureeJ = tache.dureeJ,
    this.modifCoefficientK = tache.coefficientK,
    this.modifTerminee = tache.terminee
    await this.DesignationCorrespondantModif();

  }


},

    // FORMAT

    formatQte(val) {
  if (val === null || val === undefined || isNaN(val)) {
    return '0,00';
  }
  return Number(val).toLocaleString('fr-FR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
},
    formatCoefficient(val) {
  if (val === null || val === undefined || isNaN(val)) {
    return '0,00';
  }
  return Number(val).toLocaleString('fr-FR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
},




    // FAIRE SDP DE CHAQUE DESIGNATION

  async ajouterTache(){

      // Vérifier si déjà présent
  const existe = await db.taches
    .where({ 
      idDevis: this.ProjetSelectionner, 
      Num: this.selectedDesBde.Num // ou la valeur dynamique de ta tâche
    }).first();

  if (existe) {
    alert("Cette tache existe déja !");
    return;
  }



  await db.taches.add({
    
    idDevis:this.ProjetSelectionner,
    Num:this.selectedDesBde.Num,
    unite:this.unite,
    quantiteR:Number(this.quantiteR),
    rendementJ:Number(this.rendementJ),
    dureeJ:Number(this.dureeJ),
    coefficientK:Number(this.coefficientK),
    terminee:false

    });

    this.afficherModaleSdp = false;
    await this.ListeTaches();

},




    // AJOUT



 async ajouterMateriel() {

  const Code = parseInt(this.Code);
    // Ajouter le matériel
    await db.materiel.add({
      Code,
      Materiels: this.Materiels,
      Unite: this.Unite,
      Prix: this.Prix,
      Observation: this.Observation
    });

    // Réinitialiser formulaire
    this.Code = '';
    this.Materiels = '';
    this.Unite = '';
    this.Prix = '';
    this.Observation = '';

    await this.ListeMateriel();
    

    // await this.chargerMateriels();

    // if (navigator.onLine) {
    //   await syncToSupabase();
    // }
  },    


 async ajouterMainOeuvre() {

    await db.Mainoeuvre.add({
      nomCategorie: this.nom,
      salaireBase: parseFloat(this.SalaireBase),
      heureSupp: this.calculHeuresSupp({ salaireBase: this.SalaireBase }),
      totalPartiel: this.totalPartiel({ salaireBase: parseFloat(this.SalaireBase) }),
      chargeSalariales: this.chargesSalariales(this.totalPartiel({ salaireBase: parseFloat(this.SalaireBase) })),
      pmjFinal: this.pmjFinal({ salaireBase: parseFloat(this.SalaireBase) }),
      
    });

    this.afficherModaleMainOeuvre = false;
    await this.ListeMainOeuvre();

},



async ajouterTacheMainOeuvre() {

  // Vérifier si déjà présent
  const existe = await db.tache_main_oeuvre
    .where({ 
      CodeMainOeuvre: this.selectedMainOeuvre.CodeMainOeuvre, 
      idTache: this.selectedTache.idTache // ou la valeur dynamique de ta tâche
    }).first();

  if (existe) {
    alert("Cette main d'œuvre est déjà ajoutée pour cette tâche !");
    return;
    // await this.test();
    return;
  }

  // Ajout si pas trouvé
  await db.tache_main_oeuvre.add({
    idTache: this.selectedTache.idTache,
    CodeMainOeuvre: this.selectedMainOeuvre.CodeMainOeuvre,
    qteU: this.qteU,
    uniteJ: this.uniteJ,
    qteTotale: this.qteTotale,
    Pu: this.formatPrice(this.Pu)
  });

  this.afficherModale = false;
  this.annulerAjoutTacheMainOeuvre();
  // await this.loadData();
  await this.chargerTache(this.selectedTache);
  await this.ListeMainOeuvre();
  this.sdpMainOeuvre();
},


async ajouterTacheMateriel() {

  // Vérifier si déjà présent
  const existe = await db.tache_materiel
    .where({ 
      Code: this.selectedMateriel.Code, 
      idTache: this.selectedTache.idTache // ou la valeur dynamique de ta tâche
    }).first();

  if (existe) {
    alert("Cette materiel est déjà ajoutée pour cette tâche !");
    return;
  }

  // Ajout si pas trouvé
  await db.tache_materiel.add({
    idTache: this.selectedTache.idTache,
    Code: this.selectedMateriel.Code,
    qteU: this.qteUMat,
    uniteJ: this.uniteJMat,
    qteTotale: this.qteTotaleMat,
    Pu: this.PuMat
  });

  this.afficherModaleMateriel = false;
  this.annulerAjoutTacheMateriel();
  // await this.loadData();
  await this.chargerTache(this.selectedTache);
  await this.ListeMateriel();
  this.sdpMateriel();
},


async ajouterTacheMateriaux() {

  // Vérifier si déjà présent
  const existe = await db.tache_materiaux
    .where({ 
      idTache: this.selectedTache.idTache, 
      id: this.selectedMateriaux.id // ou la valeur dynamique de ta tâche
    }).first();

  if (existe) {
    alert("Cette materiaux est déjà ajoutée pour cette tâche !");
    return;
  }

  // Ajout si pas trouvé
  await db.tache_materiaux.add({
    idTache: this.selectedTache.idTache,
    id: this.selectedMateriaux.id,
    qteU: this.qteUMater,
    uniteJ: this.uniteJMater,
    qteTotale: this.qteTotaleMater,
    Pu: this.PuMater
  });

  this.afficherModaleMateriaux = false;
  this.annulerAjoutTacheMateriaux();
  // await this.loadData();
  await this.chargerTache(this.selectedTache);
  await this.ListeMateriaux();
  this.sdpMateriaux();
},

annulerAjoutTacheMainOeuvre(){
  this.qteU = "",
  this.unteJ = "",
  this.qteTotale = "",
  this.Pu = ""
},

annulerAjoutTacheMateriel(){
  this.qteUMat = "",
  this.uniteJMat = "",
  this.qteTotaleMat = "",
  this.PuMat = ""
},

annulerAjoutTacheMateriaux(){
  this.qteUMater = "",
  this.uniteJMater = "",
  this.qteTotaleMater = "",
  this.PuMater = ""
},


    async test(){
        
        this.$swal({
        icon:'error',
        title:'Tsy tontosa ny famafana',
        text:"an'ireo lisitran'ny anjara",
        timer:2500,
        showConfirmButton:false
      })
        
    },

    async sdpTerminee(){
        
        this.$swal({
        icon:'success',
        title:'Ajout sdp',
        text:"Avec succès",
        timer:2500,
        showConfirmButton:false
      })
        
    },

    async sdpMainOeuvre(){
        
        this.$swal({
        icon:'success',
        title:"Ajout Main d'oeuvre",
        text:"Avec succès",
        timer:2500,
        showConfirmButton:false
      })
        
    },

    async sdpMateriel(){
        
        this.$swal({
        icon:'success',
        title:"Ajout Materiel",
        text:"Avec succès",
        timer:2500,
        showConfirmButton:false
      })
        
    },

    async sdpMateriaux(){
        
        this.$swal({
        icon:'success',
        title:"Ajout Materiaux",
        text:"Avec succès",
        timer:2500,
        showConfirmButton:false
      })
        
    },
     


    // MODALE

     SelectionMainOeuvre(item) {
    if (!item) return;
    this.Pu = item.pmjFinal;
    this.afficherModale = true;
    this.CategorieSelectionner = item.nomCategorie;
},

modaleMainOeuvre(){

  this.afficherModaleMainOeuvre = true;

},

modaleNouveauMateriel(){

  this.afficherModaleMaterielAjout = true;

},

modaleMateriaux(){

  this.afficherModaleMateriauxAjout = true;

},
     
  
  modaleSdp() {
  this.afficherModaleSdp = true;
},

  modaleMateriel(item) {
    if (!item) return;
  this.afficherModaleMateriel = true;
  this.PuMat = item.Prix;
  this.MaterielSelectionner = item.Materiels;
},

  modaleMateriaux(item) {
    if (!item) return;
  this.afficherModaleMateriaux = true;
  this.PuMater = item.Pu;
  this.MateriauxSelectionner = item.Materiaux;
},
    
     AffichageSdp:function(){
            this.afficherModaleSdp = !this.afficherModaleSdp;
        },

     AffichageMateriel:function(){
            this.afficherModaleMateriel = !this.afficherModaleMateriel;
        },

     AffichageMateriaux:function(){
            this.afficherModaleMateriaux = !this.afficherModaleMateriaux;
        },
     
     Affichage:function(){
            this.afficherModale = !this.afficherModale;
        },

     AffichageMainOeuvre:function(){

            this.afficherModaleMainOeuvre = !this.afficherModaleMainOeuvre;
        
          },

     AffichageMaterielModale:function(){

            this.afficherModaleMaterielAjout = !this.afficherModaleMaterielAjout;
        
          },

     AffichageMateriauxModale:function(){

            this.afficherModaleMateriauxAjout = !this.afficherModaleMateriauxAjout;
        
          },

    AffichageModifTacheSdp:function(){
            this.modalModifTacheSdp = !this.modalModifTacheSdp;
        },      


    // LISTE 

    async ListeProjets(){

          this.ProjetList = await db.Devis.toArray();

      },

    async ListeMainOeuvre(){

         this.MainOeuvreList = await db.Mainoeuvre.toArray();

    },

    async ListeMateriel(){

         this.MaterielList = await db.materiel.toArray();

    },

    async ListeMateriaux(){

         this.MateriauxList = await db.Materiaux.toArray();

    },


    async DesignationCorrespondant(){

      if (!this.ProjetSelectionner) {
        this.ListeDesignationProjet = [];
        return;
      }

      const bdeList = await db.bde
        .where("idDevis")               // ⚠️ champ clé étrangère vers projet
        .equals(this.ProjetSelectionner)
        .toArray();

        // 2. Vider la liste d'abord puis reconstruire
  this.ListeDesignationProjet = await Promise.all(
    bdeList.map(async (bde) => {
      const des = await db.designation.get(bde.CodeDes); // FK vers désignation
      return {
        Num: bde.Num,
        Unite:bde.Unite,
        Designation: des.Designation
      };
    })
  );


},



    async DesignationCorrespondantModif(){

      if (!this.modifProjet) {
        this.ListeDesignationProjetModif = [];
        return;
      }

      const bdeList = await db.bde
        .where("idDevis")               // ⚠️ champ clé étrangère vers projet
        .equals(this.modifProjet)
        .toArray();

        // 2. Vider la liste d'abord puis reconstruire
  this.ListeDesignationProjetModif = await Promise.all(
    bdeList.map(async (bde) => {
      const des = await db.designation.get(bde.CodeDes); // FK vers désignation
      return {
        Num: bde.Num,
        Designation: des.Designation
      };
    })
  );


},

UniteCorrespondant() {
    if (this.selectedDesBde) {
      this.unite = this.selectedDesBde.Unite; // 🔹 injection auto
    } else {
      this.unite = "";
    }
  },


    async ListeTaches() {
  // On récupère toute la liste des taches
  const tacheList = await db.taches.toArray();

  // On prépare un tableau pour stocker le résultat final
  const resultat = [];

  // Pour chaque tache
  for (const tache of tacheList) {
    // On récupère le bde correspondant grâce à Num
    const bdeItem = await db.bde.get({ Num: tache.Num });

    if (bdeItem) {
      // On récupère la désignation correspondante grâce à CodeDes
      const des = await db.designation.get({ CodeDes: bdeItem.CodeDes });

      if (des) {
        // On crée un nouvel objet complet
        const elementComplet = {
          ...tache,                  // Données de tache
          Designation: des.Designation, // Nom de la désignation
          Description: des.Description  // Description de la désignation
        };

        // On ajoute dans le tableau résultat
        resultat.push(elementComplet);
      }
    }
  }

  // On met à jour la donnée pour Vue
  this.tacheList = resultat;
},


    async ListeDesignationBde(){

const listeBde = await db.bde.toArray();

         // On prépare un tableau pour stocker le résultat final
const resultat = [];

// Pour chaque élément dans sdpList
for (const bde of listeBde) {

// On récupère la désignation correspondante grâce à CodeDes
const des = await db.designation.get(bde.CodeDes);

// Si on trouve la désignation, on crée un nouvel objet
if (des) {
  const elementComplet = {
    ...bde,                 // On garde toutes les données de bde
    Designation: des.Designation,  // On ajoute la désignation
    Description: des.Description   // On ajoute la description
  };

  // On ajoute cet objet dans notre tableau résultat
  resultat.push(elementComplet);
}
}
  // console.log('Liste finale DesignationBdeList:', resultat);

  // On met à jour la donnée dans Vue pour l’utiliser ailleurs
  this.DesignationBdeList = resultat;

    },


async chargerTache(tache) {
    if (!tache) return;

    const Taches = await db.taches
      .where("idTache")
      .equals(tache.idTache)
      .toArray();

    const mainOeuvreTaches = await db.tache_main_oeuvre
      .where("idTache")
      .equals(tache.idTache)
      .toArray();

    const materielsTaches = await db.tache_materiel
      .where("idTache")
      .equals(tache.idTache)
      .toArray();

    const materiauxTaches = await db.tache_materiaux
      .where("idTache")
      .equals(tache.idTache)
      .toArray();

    const tacheCorrespondant = await Promise.all(Taches.map(async t => {
    
      const bdeItem = await db.bde.get(t.Num);

      if (bdeItem) {
      // On récupère la désignation correspondante grâce à CodeDes
      const des = await db.designation.get({ CodeDes: bdeItem.CodeDes });
        return { ...t, Designation: des.Designation };
    
    }
      
    }));



    const mainOeuvre = await Promise.all(mainOeuvreTaches.map(async t => {
      const mo = await db.Mainoeuvre.get(Number(t.CodeMainOeuvre));
      const total = mo.pmjFinal * t.qteTotale;
      return { ...t, nom: mo.nomCategorie, Pu: mo.pmjFinal, total };
      
    }));

    const materiels = await Promise.all(materielsTaches.map(async t => {
      const mat = await db.materiel.get(t.Code);
      const total = mat.Prix * t.qteTotale;
      return { ...t, nom: mat.Materiels, Pu: mat.Prix, total };
    }));

    const materiaux = await Promise.all(materiauxTaches.map(async t => {
      const materiaux = await db.Materiaux.get(t.id);
      const total = materiaux.Pu * t.qteTotale;
      return { ...t, nom: materiaux.Materiaux, Pu: materiaux.Pu, total };
      
    }));




    const totalMainOeuvre = mainOeuvre.reduce((sum, i) => sum + i.total, 0);
    const totalMateriels = materiels.reduce((sum, i) => sum + i.total, 0);
    const totalMateriaux = materiaux.reduce((sum, i) => sum + i.total, 0);

    this.sdp = {
      mainOeuvre,
      materiels,
      materiaux,
      tacheCorrespondant,
      totalMainOeuvre,
      totalMateriels,
      totalMateriaux,
      totalGeneral: totalMainOeuvre + totalMateriels + totalMateriaux
    };
    // --- Ici, totalGeneral est calculé, donc on peut mettre à jour BDE ---
  
  },


      async toggleTerminee(tache) {

          await db.taches.update(tache.idTache,{
          terminee: true  
          });
          await this.sdpTerminee();
          await this.ListeTaches();
          await this.updatePrixUnitaireBde(tache);
      // this.loadTaches()
    },


  // MODIFICATION

  async updatePrixUnitaireBde(tache) {
  if (!tache) return;

  // Récupérer l'élément BDE correspondant à la tâche
  const bdeItem = await db.bde.get({ Num: tache.Num });

  if (bdeItem) {
    // Mettre à jour le prix unitaire avec le total général de sdp
    await db.bde.update(bdeItem.Num, {
      Pu: this.sdp.totalGeneral
    });

    console.log("Prix unitaire mis à jour dans BDE :", this.sdp.totalGeneral);
  } else {
    console.warn("BDE introuvable pour cette tâche :", tache.Num);
  }
},


    // AJOUT




  tauxHoraire(cat) {
      return cat.salaireBase / this.heures.base;
    },


  // CALCULE HEURE SUPPLEMENTAIRE

    calculHeuresSupp(cat) {
      const taux = this.tauxHoraire(cat);
      const hs25 = this.heures.hs25 * taux * 0.25;
      const hs50 = this.heures.hs50 * taux * 0.5;
      const hs100 = this.heures.hs100 * taux * 1.0;
      return hs25 + hs50 + hs100;
    },

    // CALCULE TOTAL PARTIEL

    totalPartiel(cat) {
      return cat.salaireBase + this.calculHeuresSupp(cat);
    },

    // CALCULE CHARGES SALARIALES

    chargesSalariales(total) {
      return total * (this.charges.salariales / 100);
    },

    // CALCULE PRIX MOYENS DE LA JOURNEE

    pmjFinal(cat) {
      const total = this.totalPartiel(cat);
      const charges = this.chargesSalariales(total);
      return total + charges;
    },


    
    async ajouterMainOeuvreA() {

    if (!this.selectedMainOeuvre) {
      alert("Veuillez choisir une main d'œuvre");
      return;
    }

    // Création de l'objet à insérer
    const newItem = {
      id: Date.now(), // ou autre identifiant
      nom: this.selectedMainOeuvre.nomCategorie,
      qteU: 1, // valeur par défaut
      uniteJ: "jour", // valeur par défaut
      qteTotale: 1, // valeur par défaut
      Pu: this.selectedMainOeuvre.pmjFinal,
      total: this.selectedMainOeuvre.pmjFinal
    };

    // Ajout dans le tableau mainOeuvre
    this.sdp.mainOeuvre.push(newItem);

    // Mise à jour du total main d'œuvre
    this.sdp.totalMainOeuvre = this.sdp.mainOeuvre.reduce((sum, mo) => sum + mo.total, 0);

    // Mise à jour du total général
    this.sdp.totalGeneral = this.sdp.totalMainOeuvre + this.sdp.totalMateriels;

    // Réinitialiser le select
    this.selectedMainOeuvre = null;
  },


    generatePDF() {
    const doc = new jsPDF();

    // Colonnes du tableau
    const columns = [
      { header: "Composante du prix", dataKey: "composante" },
      { header: "Qté unitaire", dataKey: "qteU" },
      { header: "Unité ou jour", dataKey: "uniteJ" },
      { header: "Quantité totale", dataKey: "qteTotale" },
      { header: "Prix unitaire sec", dataKey: "pu" },
      { header: "Total", dataKey: "total" }
    ];

    // Fonction pour formater prix (comme dans ton code)
    const formatPrice = this.formatPrice;
    const formatTotal = this.formatTotal;

    // Construire les lignes du tableau PDF
    const rows = [];

    // -- Section Main d'œuvre (titre)
    rows.push({
      composante: "Main d'œuvre",
      qteU: "",
      uniteJ: "",
      qteTotale: "",
      pu: "",
      total: "",
      isSection: true
    });

    // -- Lignes mainOeuvre
    this.sdp.mainOeuvre.forEach(item => {
      rows.push({
        composante: item.nom,
        qteU: item.qteU,
        uniteJ: item.uniteJ,
        qteTotale: item.qteTotale,
        pu: formatPrice(item.Pu),
        total: formatTotal(item.total)
      });
    });

    // -- Total partiel mainOeuvre
    rows.push({
      composante: "Total partiel",
      qteU: "",
      uniteJ: "",
      qteTotale: "",
      pu: "",
      total: formatTotal(this.sdp.totalMainOeuvre),
      isSubtotal: true
    });

    // -- Section Matériels (titre)
    rows.push({
      composante: "Matériels",
      qteU: "",
      uniteJ: "",
      qteTotale: "",
      pu: "",
      total: "",
      isSection: true
    });

    // -- Lignes matériels
    this.sdp.materiels.forEach(item => {
      rows.push({
        composante: item.nom,
        qteU: item.qteU,
        uniteJ: item.uniteJ,
        qteTotale: item.qteTotale,
        pu: formatPrice(item.Pu),
        total: formatTotal(item.total)
      });
    });

    // -- Total partiel matériels
    rows.push({
      composante: "Total partiel",
      qteU: "",
      uniteJ: "",
      qteTotale: "",
      pu: "",
      total: formatTotal(this.sdp.totalMateriels),
      isSubtotal: true
    });

    // -- Total général
    rows.push({
      composante: "Total des déboursés sec",
      qteU: "",
      uniteJ: "",
      qteTotale: "",
      pu: "",
      total: formatTotal(this.sdp.totalGeneral),
      isTotal: true
    });

    // -- Ligne Prix unitaire de règlement
    rows.push({
      composante: "Prix unitaire de règlement",
      qteU: "",
      uniteJ: "",
      qteTotale: "",
      pu: "",
      total: formatPrice(this.sdp.totalGeneral),
      isTotal: true
    });

    // Utiliser autoTable pour générer le tableau
    doc.autoTable({
      head: [columns.map(c => c.header)],
      body: rows.map(row => columns.map(c => row[c.dataKey] || "")),

      didParseCell: (data) => {
        const row = rows[data.row.index];

        // Style pour les sections (fusionner toutes les colonnes sur la 1ère colonne)
        if (row.isSection) {
          data.cell.styles.fontStyle = "bold";
          data.cell.styles.fillColor = [220, 220, 220]; // gris clair
          if (data.column.index > 0) {
            data.cell.styles.fillColor = [255, 255, 255];
            data.cell.text = "";
          }
          if (data.column.index === 0) {
            // Centrer le titre section
            data.cell.styles.halign = "center";
            data.cell.colSpan = columns.length;
          }
        }

        // Style pour les sous-totaux
        if (row.isSubtotal) {
          if (data.column.index === 0) {
            data.cell.styles.fontStyle = "bold";
            data.cell.styles.halign = "right";
          }
          if (data.column.index === columns.length - 1) {
            data.cell.styles.fontStyle = "bold";
          }
        }

        // Style pour les totaux finaux
        if (row.isTotal) {
          data.cell.styles.fontStyle = "bold";
          data.cell.styles.fillColor = [200, 255, 200]; // vert clair
          if (data.column.index === 0) {
            data.cell.styles.halign = "left";
          }
        }
      },

      margin: { top: 20 },
      styles: { fontSize: 10 }
    });

    // Sauvegarder ou afficher le PDF
    doc.save("sdp.pdf");
  },


    formatTotal(val) {
      return val ? val.toLocaleString('fr-FR', { minimumFractionDigits: 2,maximumFractionDigits: 2 }) : '0,00'
    },
    
    formatPrice(val) {
      

      let multiple = 10;
  if (val >= 1000000) {
    multiple = 10000;
  } else if (val >= 100000) {
    multiple = 1000;
  } else if (val >= 10000) {
    multiple = 100;
  }

  // Arrondir vers le bas au multiple choisi
  const arrondi = Math.round(val / multiple) * multiple;

  // 4. Formater avec 2 décimales en français
  return arrondi.toLocaleString('fr-FR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

    },

    async loadData() {
  const mainOeuvreTaches = await db.tache_main_oeuvre.toArray()
  const materielsTaches = await db.tache_materiel.toArray()

  const mainOeuvre = await Promise.all(mainOeuvreTaches.map(async t => {
    const mo = await db.Mainoeuvre.get(Number(t.CodeMainOeuvre))
    const total = mo.pmjFinal * t.qteTotale
    return {
      id: t.idTacheM,
      nom: mo.nomCategorie,
      qteU: t.qteU,
      uniteJ: t.uniteJ,
      qteTotale: t.qteTotale,
      Pu: mo.pmjFinal,
      total
    }
  }))

  const materiels = await Promise.all(materielsTaches.map(async t => {
    const mat = await db.materiel.get(t.Code)
    const total = mat.Prix * t.qteTotale
    return {
      id: t.idTacheMateriel,
      nom: mat.Materiels,
      qteU: t.qteU,
      uniteJ: t.uniteJ,
      qteTotale: t.qteTotale,
      Pu: mat.Prix,
      total
    }
  }))

  // Calcul des totaux avec une boucle for (pas de reduce)
  let totalMainOeuvre = 0
  for (const item of mainOeuvre) {
    totalMainOeuvre += item.total
  }

  let totalMateriels = 0
  for (const item of materiels) {
    totalMateriels += item.total
  }

  this.sdp = {
    mainOeuvre,
    materiels,
    totalMainOeuvre,
    totalMateriels,
    totalGeneral: totalMainOeuvre + totalMateriels
  }
}


  }
 
}
</script>

<style scoped>

/* MODALE */

 .bloc-modale{

        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
    
    }
    .overlay{
        background: rgba(0, 0, 0, 0.295);
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        backdrop-filter: blur(2px);
    -webkit-backdrop-filter: blur(2px);
    transition: backdrop-filter 0.3s ease, background 0.3s ease;
    /* AO AMBADIKAN'NY MODALE NY PLASINY */
    z-index: 9998;
    }
    .modale{
        background: linear-gradient(200deg,#02303065,#557497,#00bbd49a);
        color: #333;
        padding: 35px;
        position: fixed;
        /* AMBONY NY PLASINY */
        z-index: 10000;

    }
    .btn-modale{
        position: absolute;
        top: 10px;
        right: 10px;
    }
    .styleTexte{
            font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
            color:white;
            text-align: center;
        }
    .form-label{
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            color: white;
            font-size: 16px;
    }
    .btn-primary{
        font-size: 20px;
    }


/* Fond global */
body {
  background: linear-gradient(135deg, #ffffff, #0b587cb0);
  min-height: 100vh;
  margin: 0;
}

/* Table dans un bloc clair */
.table-container {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  margin: 30px auto;
  max-width: 95%;
}

/* Style table Bootstrap amélioré */
.sdp-table {
  width: 100%;
}


.sdp-table thead th {
  background-color: #1e8cbe;
  color: white;
  text-align: center;
}

.sdp-table tbody tr:nth-child(even) {
  background-color: rgba(0, 88, 124, 0.05);
}

.sdp-table tbody tr:hover {
  background-color: rgba(0, 88, 124, 0.15);
  transition: background 0.3s;
}



/* Style table Bootstrap designation */
.sdp-tableDesignation {
  width: 100%;
}

.sdp-tableDesignation thead th {
  background: linear-gradient(700deg, #242222f8, #1e2020b0);
  color: white;
  text-align: center;
}

.sdp-tableDesignation tbody tr:nth-child(even) {
  background-color: rgba(0, 88, 124, 0.05);
}

.sdp-tableDesignation tbody tr:hover {
  background-color: rgba(0, 88, 124, 0.15);
  transition: background 0.3s;
}

</style>
