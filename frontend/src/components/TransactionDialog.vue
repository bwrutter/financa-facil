<template>
  <v-dialog :model-value="modelValue" @update:modelValue="emitClose" max-width="500">
    <v-card>
      <v-card-title>
        {{ localTransaction.id ? "Editar" : "Nova" }} Transação
      </v-card-title>

      <v-card-text>
        <v-text-field label="Descrição" v-model="localTransaction.description" />

        <v-select
          label="Tipo"
          :items="[
            { title: 'Entrada', value: 'income' },
            { title: 'Saída', value: 'expense' },
          ]"
          v-model="localTransaction.type"
        />

        <v-text-field
          label="Categoria"
          v-model="localTransaction.category"
        />

        <v-text-field
          label="Valor"
          type="number"
          v-model.number="localTransaction.value"
        />

        <v-text-field
          label="Data"
          type="date"
          v-model="localTransaction.date"
        />
      </v-card-text>

      <v-card-actions class="justify-end">
        <v-btn variant="text" @click="emitClose(false)">Cancelar</v-btn>
        <v-btn color="primary" @click="save">Salvar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, watch } from "vue"

const props = defineProps({
  modelValue: Boolean,
  transaction: Object,
})

const emit = defineEmits(["update:modelValue", "save"])

const localTransaction = ref({
  description: "",
  type: "expense",
  category: "",
  value: 0,
  date: "",
})

watch(
  () => props.transaction,
  (value) => {
    localTransaction.value = value
      ? { ...value }
      : {
          description: "",
          type: "expense",
          category: "",
          value: 0,
          date: "",
        }
  },
  { immediate: true }
)

function emitClose(value = false) {
  emit("update:modelValue", value)
}

function save() {
  emit("save", localTransaction.value)
  emitClose(false)
}
</script>
