<template>
  <v-container>
    <h1 class="mb-4">Minhas Contas</h1>

    <v-row>
      <v-col
        v-for="account in accounts"
        :key="account._id"
        cols="12"
        md="4"
      >
        <AccountCard :account="account" />
      </v-col>
    </v-row>
    <v-btn variant="tonal" base-color="blue" class="ma-4">
      Button
    </v-btn>
    <v-alert
      v-if="accounts.length === 0"
      type="info"
      variant="tonal"
    >
      Você ainda não possui contas cadastradas.
    </v-alert>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getAccounts } from "@/services/account.service";
import AccountCard from "@/components/AccountCard.vue";

const accounts = ref([]);

onMounted(async () => {
  try {
    const { data } = await getAccounts();
    accounts.value = data;
  } catch (err) {
    console.error("Erro ao carregar contas", err);
  }
});
</script>
