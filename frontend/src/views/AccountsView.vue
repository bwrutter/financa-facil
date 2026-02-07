<template>
  <v-container>
    <v-row class="mb-4">
      <v-col>
        <h2>Contas</h2>
      </v-col>
      <v-col class="text-right">
        <v-btn color="primary" @click="openDialog">
          Nova Conta
        </v-btn>
      </v-col>
    </v-row>

    <v-row>
      <v-col
        v-for="account in accounts"
        :key="account.id"
        cols="12"
        md="4"
      >
        <AccountCard
          :account="account"
          @edit="editAccount"
          @delete="deleteAccount"
        />
      </v-col>
    </v-row>

    <AccountDialog
      v-model="dialog"
      :account="selectedAccount"
      @save="saveAccount"
    />
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import AccountCard from '@/components/AccountCard.vue'
import AccountDialog from '@/components/AccountDialog.vue'

const dialog = ref(false)
const selectedAccount = ref(null)

const accounts = ref([
  { id: 1, name: 'Banco Inter', type: 'Conta Corrente', balance: 2500 },
  { id: 2, name: 'Nubank', type: 'Crédito', balance: -1200 },
  { id: 3, name: 'Poupança', type: 'Poupança', balance: 8500 },
])

function openDialog() {
  selectedAccount.value = null
  dialog.value = true
}

function editAccount(account) {
  selectedAccount.value = { ...account }
  dialog.value = true
}

function saveAccount(account) {
  if (selectedAccount.value) {
    const index = accounts.value.findIndex(a => a.id === selectedAccount.value.id)
    accounts.value[index] = { ...account, id: selectedAccount.value.id }
  } else {
    accounts.value.push({
      ...account,
      id: Date.now(),
    })
  }
}

function deleteAccount(account) {
  accounts.value = accounts.value.filter(a => a.id !== account.id)
}
</script>
