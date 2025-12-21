import Account from "./account.model.js";

export function createAccount(data) {
  return Account.create(data);
}

export function listAccountsByUser(userId) {
  return Account.find({ userId });
}

export function deleteAccount(accountId, userId) {
  return Account.findOneAndDelete({ _id: accountId, userId });
}
