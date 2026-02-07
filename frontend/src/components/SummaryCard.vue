<template>
  <v-card :color="color" dark>
    <v-card-text>
      <div class="text-subtitle-1">{{ title }}</div>
      <div class="text-h5 font-weight-bold">{{ value }}</div>
    </v-card-text>
  </v-card>
</template>

<script setup>
defineProps({
  title: String,
  value: String,
  color: String,
})
</script>
