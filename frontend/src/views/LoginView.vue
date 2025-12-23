<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { login } from '../services/auth.service'

const email = ref('')
const password = ref('')
const error = ref(null)

const router = useRouter()

async function handleLogin() {
  try {
    error.value = null
    await login(email.value, password.value)
    router.push('/')
  } catch (err) {
    error.value = 'Email ou senha inválidos'
  }
}
</script>

<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="4">
        <v-card>
          <v-card-title>Login</v-card-title>

          <v-card-text>
            <v-alert v-if="error" type="error" class="mb-3">
              {{ error }}
            </v-alert>

            <v-text-field
              label="Email"
              v-model="email"
            />

            <v-text-field
              label="Senha"
              type="password"
              v-model="password"
            />
          </v-card-text>

          <v-card-actions>
            <v-btn color="primary" block @click="handleLogin">
              Entrar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
