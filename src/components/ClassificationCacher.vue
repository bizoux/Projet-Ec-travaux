<template>
  <div class="container mt-4">
    <!-- Titre cliquable -->
    <div 
      class="d-flex justify-content-between align-items-center p-3 border rounded bg-white shadow-sm"
      @click="isOpen = !isOpen"
      style="cursor: pointer;"
    >
      <span class="fw-bold">Voir plus de détails</span>

      <!-- Font Awesome Icon -->
      <font-awesome-icon
        icon="chevron-down"
        class="arrow"
        :class="{ rotate: isOpen }"
      />
    </div>

    <!-- Contenu masqué/affiché -->
    <div v-if="isOpen" class="mt-2 p-3 border rounded bg-light">
      <p>
        Voici le contenu affiché quand on clique sur le bouton ou le texte.
      </p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return { isOpen: false };
  }
}
</script>

<style scoped>
.arrow {
  transition: transform 0.3s;
}
.arrow.rotate {
  transform: rotate(180deg);
}
</style>
