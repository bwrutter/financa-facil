<template>
  <v-card elevation="2">
    <v-card-title class="d-flex justify-space-between align-center">
      <span>{{ account.name }}</span>

      <v-menu>
        <template #activator="{ props }">
          <v-btn icon v-bind="props">
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-item @click="$emit('edit', account)">
            <v-list-item-title>Editar</v-list-item-title>
          </v-list-item>
          <v-list-item @click="$emit('delete', account)">
            <v-list-item-title class="text-error">
              Excluir
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-card-title>

    <v-card-text>
      <div class="text-caption text-grey">
        Tipo
      </div>
      <div class="mb-2">
        {{ account.type }}
      </div>

      <div class="text-caption text-grey">
        Saldo
      </div>
      <div
        class="text-h6 font-weight-bold"
        :class="account.balance < 0 ? 'text-error' : 'text-success'"
      >
        R$ {{ account.balance.toFixed(2) }}
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup>
const props = defineProps({
  account: {
    type: Object,
    required: false,
    default: () => ({
      id: 1,
      name: "Conta Principal",
      type: "Conta Corrente",
      balance: 5230.0,
    }),
  },
})
</script>

