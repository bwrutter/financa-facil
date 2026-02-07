<template>
  <v-row>
    <v-col cols="12" class="d-flex justify-space-between align-center">
      <h2>Transações</h2>

      <v-btn color="primary" @click="openDialog">
        Nova Transação
      </v-btn>
    </v-col>

    <v-col cols="12">
      <TransactionTable
        :transactions="transactions"
        @edit="editTransaction"
        @delete="deleteTransaction"
      />
    </v-col>

    <TransactionDialog
      v-model="dialog"
      :transaction="selectedTransaction"
      @save="saveTransaction"
    />
  </v-row>
</template>

<script setup>
import { ref } from "vue"
import TransactionTable from "@/components/TransactionTable.vue"
import TransactionDialog from "@/components/TransactionDialog.vue"

const dialog = ref(false)
const selectedTransaction = ref(null)

const transactions = ref([
  {
    id: 1,
    description: "Salário",
    type: "income",
    category: "Renda",
    value: 8000,
    date: "2024-12-01",
  },
  {
    id: 2,
    description: "Aluguel",
    type: "expense",
    category: "Moradia",
    value: 2500,
    date: "2024-12-05",
  },
])

function openDialog() {
  selectedTransaction.value = null
  dialog.value = true
}

function editTransaction(transaction) {
  selectedTransaction.value = { ...transaction }
  dialog.value = true
}

function saveTransaction(transaction) {
  if (transaction.id) {
    const index = transactions.value.findIndex(t => t.id === transaction.id)
    transactions.value[index] = transaction
  } else {
    transaction.id = Date.now()
    transactions.value.push(transaction)
  }
}

function deleteTransaction(transaction) {
  transactions.value = transactions.value.filter(t => t.id !== transaction.id)
}
</script>
