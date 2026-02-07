import api from "./api"

export async function getAccounts() {
  const { data } = await api.get("/accounts")
  return data
}

export async function createAccount(payload) {
  await api.post("/accounts", payload)
}

export async function updateAccount(id, payload) {
  await api.put(`/accounts/${id}`, payload)
}

export async function deleteAccountById(id) {
  await api.delete(`/accounts/${id}`)
}
