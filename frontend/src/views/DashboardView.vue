<template>
  <v-row>
    <v-col cols="12" md="4">
      <SummaryCard title="Saldo Total" value="R$ 5.230,00" color="green" />
    </v-col>

    <v-col cols="12" md="4">
      <SummaryCard title="Receitas" value="R$ 8.000,00" color="blue" />
    </v-col>

    <v-col cols="12" md="4">
      <SummaryCard title="Despesas" value="R$ 2.770,00" color="red" />
    </v-col>

    <v-col cols="12" md="6">
      <AccountCard />
    </v-col>

    <v-col cols="12" md="6">
      <TransactionTable />
    </v-col>
  </v-row>
</template>

<script setup>
import SummaryCard from "@/components/SummaryCard.vue"
import AccountCard from "@/components/AccountCard.vue"
import TransactionTable from "@/components/TransactionTable.vue"
</script>
