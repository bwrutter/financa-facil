<template>
  <v-card>
    <v-table>
      <thead>
        <tr>
          <th>Descrição</th>
          <th>Categoria</th>
          <th>Tipo</th>
          <th>Valor</th>
          <th>Data</th>
          <th></th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="t in transactions" :key="t.id">
          <td>{{ t.description }}</td>
          <td>{{ t.category }}</td>
          <td>
            <v-chip
              :color="t.type === 'income' ? 'green' : 'red'"
              size="small"
            >
              {{ t.type === 'income' ? 'Entrada' : 'Saída' }}
            </v-chip>
          </td>
          <td
            :class="t.type === 'income' ? 'text-success' : 'text-error'"
          >
            R$ {{ t.value.toFixed(2) }}
          </td>
          <td>{{ t.date }}</td>
          <td class="text-right">
            <v-btn icon size="small" @click="$emit('edit', t)">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn icon size="small" @click="$emit('delete', t)">
              <v-icon color="error">mdi-delete</v-icon>
            </v-btn>
          </td>
        </tr>
      </tbody>
    </v-table>
  </v-card>
</template>

<script setup>
defineProps({
  transactions: {
    type: Array,
    required: true,
  },
})
</script>
