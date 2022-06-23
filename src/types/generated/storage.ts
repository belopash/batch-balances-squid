import assert from 'assert'
import {Block, Chain, ChainContext, BlockContext, Result} from './support'
import * as v1020 from './v1020'
import * as v1050 from './v1050'
import * as v2025 from './v2025'
import * as v2028 from './v2028'
import * as v2030 from './v2030'

export class BalancesAccountStorage {
  private readonly _chain: Chain
  private readonly blockHash: string

  constructor(ctx: BlockContext)
  constructor(ctx: ChainContext, block: Block)
  constructor(ctx: BlockContext, block?: Block) {
    block = block || ctx.block
    this.blockHash = block.hash
    this._chain = ctx._chain
  }

  /**
   *  The balance of an account.
   * 
   *  NOTE: THIS MAY NEVER BE IN EXISTENCE AND YET HAVE A `total().is_zero()`. If the total
   *  is ever zero, then the entry *MUST* be removed.
   * 
   *  NOTE: This is only used in the case that this module is used to store balances.
   */
  get isV1050() {
    return this._chain.getStorageItemTypeHash('Balances', 'Account') === '0b3b4bf0dd7388459eba461bc7c3226bf58608c941710a714e02f33ec0f91e78'
  }

  /**
   *  The balance of an account.
   * 
   *  NOTE: THIS MAY NEVER BE IN EXISTENCE AND YET HAVE A `total().is_zero()`. If the total
   *  is ever zero, then the entry *MUST* be removed.
   * 
   *  NOTE: This is only used in the case that this module is used to store balances.
   */
  async getAsV1050(key: v1050.AccountId): Promise<v1050.AccountData> {
    assert(this.isV1050)
    return this._chain.getStorage(this.blockHash, 'Balances', 'Account', key)
  }

  async getManyAsV1050(keys: v1050.AccountId[]): Promise<(v1050.AccountData)[]> {
    assert(this.isV1050)
    return this._chain.queryStorage(this.blockHash, 'Balances', 'Account', keys.map(k => [k]))
  }

  /**
   * Checks whether the storage item is defined for the current chain version.
   */
  get isExists(): boolean {
    return this._chain.getStorageItemTypeHash('Balances', 'Account') != null
  }
}

export class BalancesFreeBalanceStorage {
  private readonly _chain: Chain
  private readonly blockHash: string

  constructor(ctx: BlockContext)
  constructor(ctx: ChainContext, block: Block)
  constructor(ctx: BlockContext, block?: Block) {
    block = block || ctx.block
    this.blockHash = block.hash
    this._chain = ctx._chain
  }

  /**
   *  The 'free' balance of a given account.
   * 
   *  This is the only balance that matters in terms of most operations on tokens. It
   *  alone is used to determine the balance when in the contract execution environment. When this
   *  balance falls below the value of `ExistentialDeposit`, then the 'current account' is
   *  deleted: specifically `FreeBalance`. Further, the `OnFreeBalanceZero` callback
   *  is invoked, giving a chance to external modules to clean up data associated with
   *  the deleted account.
   * 
   *  `system::AccountNonce` is also deleted if `ReservedBalance` is also zero (it also gets
   *  collapsed to zero if it ever becomes less than `ExistentialDeposit`.
   */
  get isV1020() {
    return this._chain.getStorageItemTypeHash('Balances', 'FreeBalance') === '0bac40afaf72ceea5a87ae2baaa5fe7f69915323f3293bdd970e7790a9d968c0'
  }

  /**
   *  The 'free' balance of a given account.
   * 
   *  This is the only balance that matters in terms of most operations on tokens. It
   *  alone is used to determine the balance when in the contract execution environment. When this
   *  balance falls below the value of `ExistentialDeposit`, then the 'current account' is
   *  deleted: specifically `FreeBalance`. Further, the `OnFreeBalanceZero` callback
   *  is invoked, giving a chance to external modules to clean up data associated with
   *  the deleted account.
   * 
   *  `system::AccountNonce` is also deleted if `ReservedBalance` is also zero (it also gets
   *  collapsed to zero if it ever becomes less than `ExistentialDeposit`.
   */
  async getAsV1020(key: v1020.AccountId): Promise<v1020.Balance> {
    assert(this.isV1020)
    return this._chain.getStorage(this.blockHash, 'Balances', 'FreeBalance', key)
  }

  async getManyAsV1020(keys: v1020.AccountId[]): Promise<(v1020.Balance)[]> {
    assert(this.isV1020)
    return this._chain.queryStorage(this.blockHash, 'Balances', 'FreeBalance', keys.map(k => [k]))
  }

  /**
   * Checks whether the storage item is defined for the current chain version.
   */
  get isExists(): boolean {
    return this._chain.getStorageItemTypeHash('Balances', 'FreeBalance') != null
  }
}

export class BalancesReservedBalanceStorage {
  private readonly _chain: Chain
  private readonly blockHash: string

  constructor(ctx: BlockContext)
  constructor(ctx: ChainContext, block: Block)
  constructor(ctx: BlockContext, block?: Block) {
    block = block || ctx.block
    this.blockHash = block.hash
    this._chain = ctx._chain
  }

  /**
   *  The amount of the balance of a given account that is externally reserved; this can still get
   *  slashed, but gets slashed last of all.
   * 
   *  This balance is a 'reserve' balance that other subsystems use in order to set aside tokens
   *  that are still 'owned' by the account holder, but which are suspendable.
   * 
   *  When this balance falls below the value of `ExistentialDeposit`, then this 'reserve account'
   *  is deleted: specifically, `ReservedBalance`.
   * 
   *  `system::AccountNonce` is also deleted if `FreeBalance` is also zero (it also gets
   *  collapsed to zero if it ever becomes less than `ExistentialDeposit`.)
   */
  get isV1020() {
    return this._chain.getStorageItemTypeHash('Balances', 'ReservedBalance') === '0bac40afaf72ceea5a87ae2baaa5fe7f69915323f3293bdd970e7790a9d968c0'
  }

  /**
   *  The amount of the balance of a given account that is externally reserved; this can still get
   *  slashed, but gets slashed last of all.
   * 
   *  This balance is a 'reserve' balance that other subsystems use in order to set aside tokens
   *  that are still 'owned' by the account holder, but which are suspendable.
   * 
   *  When this balance falls below the value of `ExistentialDeposit`, then this 'reserve account'
   *  is deleted: specifically, `ReservedBalance`.
   * 
   *  `system::AccountNonce` is also deleted if `FreeBalance` is also zero (it also gets
   *  collapsed to zero if it ever becomes less than `ExistentialDeposit`.)
   */
  async getAsV1020(key: v1020.AccountId): Promise<v1020.Balance> {
    assert(this.isV1020)
    return this._chain.getStorage(this.blockHash, 'Balances', 'ReservedBalance', key)
  }

  async getManyAsV1020(keys: v1020.AccountId[]): Promise<(v1020.Balance)[]> {
    assert(this.isV1020)
    return this._chain.queryStorage(this.blockHash, 'Balances', 'ReservedBalance', keys.map(k => [k]))
  }

  /**
   * Checks whether the storage item is defined for the current chain version.
   */
  get isExists(): boolean {
    return this._chain.getStorageItemTypeHash('Balances', 'ReservedBalance') != null
  }
}

export class SystemAccountStorage {
  private readonly _chain: Chain
  private readonly blockHash: string

  constructor(ctx: BlockContext)
  constructor(ctx: ChainContext, block: Block)
  constructor(ctx: BlockContext, block?: Block) {
    block = block || ctx.block
    this.blockHash = block.hash
    this._chain = ctx._chain
  }

  /**
   *  The full account information for a particular account ID.
   */
  get isV1050() {
    return this._chain.getStorageItemTypeHash('System', 'Account') === '2208f857b7cd6fecf78ca393cf3d17ec424773727d0028f07c9f0dc608fc1b7a'
  }

  /**
   *  The full account information for a particular account ID.
   */
  async getAsV1050(key: v1050.AccountId): Promise<v1050.AccountInfo> {
    assert(this.isV1050)
    return this._chain.getStorage(this.blockHash, 'System', 'Account', key)
  }

  async getManyAsV1050(keys: v1050.AccountId[]): Promise<(v1050.AccountInfo)[]> {
    assert(this.isV1050)
    return this._chain.queryStorage(this.blockHash, 'System', 'Account', keys.map(k => [k]))
  }

  /**
   *  The full account information for a particular account ID.
   */
  get isV2025() {
    return this._chain.getStorageItemTypeHash('System', 'Account') === 'eb40f1d91f26d72e29c60e034d53a72b9b529014c7e108f422d8ad5f03f0c902'
  }

  /**
   *  The full account information for a particular account ID.
   */
  async getAsV2025(key: v2025.AccountId): Promise<v2025.AccountInfo> {
    assert(this.isV2025)
    return this._chain.getStorage(this.blockHash, 'System', 'Account', key)
  }

  async getManyAsV2025(keys: v2025.AccountId[]): Promise<(v2025.AccountInfo)[]> {
    assert(this.isV2025)
    return this._chain.queryStorage(this.blockHash, 'System', 'Account', keys.map(k => [k]))
  }

  /**
   *  The full account information for a particular account ID.
   */
  get isV2028() {
    return this._chain.getStorageItemTypeHash('System', 'Account') === '73070b537f1805475b37167271b33ac7fd6ffad8ba62da08bc14937a017b8bb2'
  }

  /**
   *  The full account information for a particular account ID.
   */
  async getAsV2028(key: v2028.AccountId): Promise<v2028.AccountInfo> {
    assert(this.isV2028)
    return this._chain.getStorage(this.blockHash, 'System', 'Account', key)
  }

  async getManyAsV2028(keys: v2028.AccountId[]): Promise<(v2028.AccountInfo)[]> {
    assert(this.isV2028)
    return this._chain.queryStorage(this.blockHash, 'System', 'Account', keys.map(k => [k]))
  }

  /**
   *  The full account information for a particular account ID.
   */
  get isV2030() {
    return this._chain.getStorageItemTypeHash('System', 'Account') === '1ddc7ade926221442c388ee4405a71c9428e548fab037445aaf4b3a78f4735c1'
  }

  /**
   *  The full account information for a particular account ID.
   */
  async getAsV2030(key: v2030.AccountId): Promise<v2030.AccountInfo> {
    assert(this.isV2030)
    return this._chain.getStorage(this.blockHash, 'System', 'Account', key)
  }

  async getManyAsV2030(keys: v2030.AccountId[]): Promise<(v2030.AccountInfo)[]> {
    assert(this.isV2030)
    return this._chain.queryStorage(this.blockHash, 'System', 'Account', keys.map(k => [k]))
  }

  /**
   * Checks whether the storage item is defined for the current chain version.
   */
  get isExists(): boolean {
    return this._chain.getStorageItemTypeHash('System', 'Account') != null
  }
}

export class SystemAccountNonceStorage {
  private readonly _chain: Chain
  private readonly blockHash: string

  constructor(ctx: BlockContext)
  constructor(ctx: ChainContext, block: Block)
  constructor(ctx: BlockContext, block?: Block) {
    block = block || ctx.block
    this.blockHash = block.hash
    this._chain = ctx._chain
  }

  /**
   *  Extrinsics nonce for accounts.
   */
  get isV1020() {
    return this._chain.getStorageItemTypeHash('System', 'AccountNonce') === '25f0d63900988134e6767c7fe398885c0448fd3bd7a0d8ff90cf6b33a482cebd'
  }

  /**
   *  Extrinsics nonce for accounts.
   */
  async getAsV1020(key: v1020.AccountId): Promise<v1020.Index> {
    assert(this.isV1020)
    return this._chain.getStorage(this.blockHash, 'System', 'AccountNonce', key)
  }

  async getManyAsV1020(keys: v1020.AccountId[]): Promise<(v1020.Index)[]> {
    assert(this.isV1020)
    return this._chain.queryStorage(this.blockHash, 'System', 'AccountNonce', keys.map(k => [k]))
  }

  /**
   * Checks whether the storage item is defined for the current chain version.
   */
  get isExists(): boolean {
    return this._chain.getStorageItemTypeHash('System', 'AccountNonce') != null
  }
}
