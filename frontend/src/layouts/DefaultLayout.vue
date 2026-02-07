<template>
  <v-app>
    <!-- Top Bar -->
    <v-app-bar app color="primary" dark>
      <v-app-bar-title>Finança Fácil</v-app-bar-title>

      <v-spacer />

      <v-menu>
        <template #activator="{ props }">
          <v-btn v-bind="props" icon>
            <v-icon>mdi-account-circle</v-icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-item @click="logout">
            <v-list-item-title>Sair</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <!-- Sidebar -->
    <v-navigation-drawer app permanent>
      <v-list nav>
        <v-list-item to="/" prepend-icon="mdi-view-dashboard" title="Dashboard" />
        <v-list-item to="/accounts" prepend-icon="mdi-bank" title="Contas" />
        <v-list-item to="/transactions" prepend-icon="mdi-swap-horizontal" title="Transações" />
      </v-list>
    </v-navigation-drawer>

    <!-- Conteúdo -->
    <v-main>
      <v-container fluid>
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { useRouter } from "vue-router"
import { logout } from "@/services/auth.service"

const router = useRouter()

function logoutUser() {
  logout()
  router.push("/login")
}

</script>
