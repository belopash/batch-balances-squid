import type {Result} from './support'

export type AccountId = Uint8Array

export type Balance = bigint

export interface AccountData {
  free: Balance
  reserved: Balance
  miscFrozen: Balance
  feeFrozen: Balance
}

export interface AccountInfo {
  nonce: Index
  refcount: RefCount
  data: AccountData
}

export type Index = number

export type RefCount = number
