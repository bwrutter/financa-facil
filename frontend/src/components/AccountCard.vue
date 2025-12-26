<template>
  <v-card elevation="2" rounded="lg">
    <v-card-title class="d-flex justify-space-between">
      <span>{{ account.name }}</span>
      <strong>R$ {{ account.balance.toFixed(2) }}</strong>
    </v-card-title>

    <v-card-subtitle>
      Tipo: {{ account.type }}
    </v-card-subtitle>
  </v-card>
</template>

<script setup>
defineProps({
  account: {
    type: Object,
    required: true
  }
});
</script>
