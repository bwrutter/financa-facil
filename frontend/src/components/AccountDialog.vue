<template>
  <v-dialog
    :model-value="modelValue"
    @update:model-value="emitUpdate"
    max-width="500"
  >
    <v-card>
      <v-card-title>
        {{ account ? 'Editar Conta' : 'Nova Conta' }}
      </v-card-title>

      <v-card-text>
        <v-text-field label="Nome" v-model="localAccount.name" />
        <v-select
          label="Tipo"
          :items="['Conta Corrente', 'Poupança', 'Crédito']"
          v-model="localAccount.type"
        />
        <v-text-field
          label="Saldo"
          type="number"
          v-model.number="localAccount.balance"
        />
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn variant="text" @click="close">Cancelar</v-btn>
        <v-btn color="primary" @click="save">Salvar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { reactive, watch } from 'vue'

const props = defineProps({
  modelValue: Boolean,
  account: Object,
})

const emit = defineEmits(['update:modelValue', 'save'])

const localAccount = reactive({
  name: '',
  type: '',
  balance: 0,
})

watch(
  () => props.account,
  (val) => {
    if (val) Object.assign(localAccount, val)
  },
  { immediate: true }
)

function emitUpdate(value) {
  emit('update:modelValue', value)
}

function close() {
  emit('update:modelValue', false)
}

function save() {
  emit('save', { ...localAccount })
  close()
}
</script>
