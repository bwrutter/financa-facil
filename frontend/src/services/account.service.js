import api from "./api";

export function getAccounts() {
  return api.get("/accounts");
}

export function createAccount(data) {
  return api.post("/accounts", data);
}
