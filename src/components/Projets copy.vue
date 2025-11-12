<template>
    <div class="center-container">
      <h1>Localisation</h1>
    </div>
  </template>
  
  <script>
  export default {
    name: "LocalisationCenter"
  }
  </script>
  
  <style scoped>
  /* antoka fa ny haavon'ny container dia manarona ny efijery iray manontolo */
  .center-container {
    min-height: 100%;          /* raikitra amin'ny haavo efijery */
    display: flex;              /* na ampiasao grid raha tianao */
    justify-content: center;    /* afovoany horizontalement */
    align-items: center;        /* afovoany verticalement */
    padding: 16px;              /* kely fanampiny ho an'ny responsive */
    box-sizing: border-box;
  }
  
  /* fanatsarana kely ho an'ny lohateny */
  h1 {
    margin: 0;
    font-size: 2rem;
    text-align: center;
  }
  </style>
  