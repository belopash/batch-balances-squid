import assert from 'assert'
import {Chain, ChainContext, EventContext, Event, Result} from './support'
import * as v155 from './v155'
import * as v1001 from './v1001'
import * as v1201 from './v1201'

export class BalancesBalanceSetEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'Balances.BalanceSet')
    this._chain = ctx._chain
    this.event = event
  }

  /**
   * A balance was set by root. \[who, free, reserved\]
   */
  get isV1001(): boolean {
    return this._chain.getEventHash('Balances.BalanceSet') === '7d53ab304de2c1ff2ac70be085ea6ab305e3a4df52dde9c25829171c7376cebc'
  }

  /**
   * A balance was set by root. \[who, free, reserved\]
   */
  get asV1001(): [v1001.AccountId20, bigint, bigint] {
    assert(this.isV1001)
    return this._chain.decodeEvent(this.event)
  }

  /**
   * A balance was set by root.
   */
  get isV1201(): boolean {
    return this._chain.getEventHash('Balances.BalanceSet') === '3a56bc33dc87c1d425edfb16edf3f26eafed9ed9c0e8e6831221be938919d2bd'
  }

  /**
   * A balance was set by root.
   */
  get asV1201(): {who: v1201.AccountId20, free: bigint, reserved: bigint} {
    assert(this.isV1201)
    return this._chain.decodeEvent(this.event)
  }

  /**
   *  A balance was set by root. \[who, free, reserved\]
   */
  get isV155(): boolean {
    return this._chain.getEventHash('Balances.BalanceSet') === '7d53ab304de2c1ff2ac70be085ea6ab305e3a4df52dde9c25829171c7376cebc'
  }

  /**
   *  A balance was set by root. \[who, free, reserved\]
   */
  get asV155(): [v155.AccountId, v155.Balance, v155.Balance] {
    assert(this.isV155)
    return this._chain.decodeEvent(this.event)
  }
}

export class BalancesDepositEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'Balances.Deposit')
    this._chain = ctx._chain
    this.event = event
  }

  /**
   * Some amount was deposited into the account (e.g. for transaction fees). \[who,
   * deposit\]
   */
  get isV1001(): boolean {
    return this._chain.getEventHash('Balances.Deposit') === 'e4f02aa7cee015102b6cbc171f5d7e84370e60deba2166a27195187adde0407f'
  }

  /**
   * Some amount was deposited into the account (e.g. for transaction fees). \[who,
   * deposit\]
   */
  get asV1001(): [v1001.AccountId20, bigint] {
    assert(this.isV1001)
    return this._chain.decodeEvent(this.event)
  }

  /**
   * Some amount was deposited (e.g. for transaction fees).
   */
  get isV1201(): boolean {
    return this._chain.getEventHash('Balances.Deposit') === '43e3321e3408ebd2b7d4c70d42ffa076463495043e47ddb0fb1fbe3e105f5b2f'
  }

  /**
   * Some amount was deposited (e.g. for transaction fees).
   */
  get asV1201(): {who: v1201.AccountId20, amount: bigint} {
    assert(this.isV1201)
    return this._chain.decodeEvent(this.event)
  }

  /**
   *  Some amount was deposited (e.g. for transaction fees). \[who, deposit\]
   */
  get isV155(): boolean {
    return this._chain.getEventHash('Balances.Deposit') === 'e4f02aa7cee015102b6cbc171f5d7e84370e60deba2166a27195187adde0407f'
  }

  /**
   *  Some amount was deposited (e.g. for transaction fees). \[who, deposit\]
   */
  get asV155(): [v155.AccountId, v155.Balance] {
    assert(this.isV155)
    return this._chain.decodeEvent(this.event)
  }
}

export class BalancesEndowedEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'Balances.Endowed')
    this._chain = ctx._chain
    this.event = event
  }

  /**
   * An account was created with some free balance. \[account, free_balance\]
   */
  get isV1001(): boolean {
    return this._chain.getEventHash('Balances.Endowed') === 'e4f02aa7cee015102b6cbc171f5d7e84370e60deba2166a27195187adde0407f'
  }

  /**
   * An account was created with some free balance. \[account, free_balance\]
   */
  get asV1001(): [v1001.AccountId20, bigint] {
    assert(this.isV1001)
    return this._chain.decodeEvent(this.event)
  }

  /**
   * An account was created with some free balance.
   */
  get isV1201(): boolean {
    return this._chain.getEventHash('Balances.Endowed') === 'a773a5c0921f3b97243d311c28ce9bb596c8cc3eacae83e0b616a49c6784a35a'
  }

  /**
   * An account was created with some free balance.
   */
  get asV1201(): {account: v1201.AccountId20, freeBalance: bigint} {
    assert(this.isV1201)
    return this._chain.decodeEvent(this.event)
  }

  /**
   *  An account was created with some free balance. \[account, free_balance\]
   */
  get isV155(): boolean {
    return this._chain.getEventHash('Balances.Endowed') === 'e4f02aa7cee015102b6cbc171f5d7e84370e60deba2166a27195187adde0407f'
  }

  /**
   *  An account was created with some free balance. \[account, free_balance\]
   */
  get asV155(): [v155.AccountId, v155.Balance] {
    assert(this.isV155)
    return this._chain.decodeEvent(this.event)
  }
}

export class BalancesReserveRepatriatedEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'Balances.ReserveRepatriated')
    this._chain = ctx._chain
    this.event = event
  }

  /**
   * Some balance was moved from the reserve of the first account to the second account.
   * Final argument indicates the destination balance type.
   * \[from, to, balance, destination_status\]
   */
  get isV1001(): boolean {
    return this._chain.getEventHash('Balances.ReserveRepatriated') === 'aed9aad67fe073fb38bb01741f1200b1f5f3aa52006f4669a1004d648cdb6e5d'
  }

  /**
   * Some balance was moved from the reserve of the first account to the second account.
   * Final argument indicates the destination balance type.
   * \[from, to, balance, destination_status\]
   */
  get asV1001(): [v1001.AccountId20, v1001.AccountId20, bigint, v1001.BalanceStatus] {
    assert(this.isV1001)
    return this._chain.decodeEvent(this.event)
  }

  /**
   * Some balance was moved from the reserve of the first account to the second account.
   * Final argument indicates the destination balance type.
   */
  get isV1201(): boolean {
    return this._chain.getEventHash('Balances.ReserveRepatriated') === 'daa0192df4c75cafc52e847a38b276d53a6330bf4083906b38c0d1eb5166d98a'
  }

  /**
   * Some balance was moved from the reserve of the first account to the second account.
   * Final argument indicates the destination balance type.
   */
  get asV1201(): {from: v1201.AccountId20, to: v1201.AccountId20, amount: bigint, destinationStatus: v1201.BalanceStatus} {
    assert(this.isV1201)
    return this._chain.decodeEvent(this.event)
  }

  /**
   *  Some balance was moved from the reserve of the first account to the second account.
   *  Final argument indicates the destination balance type.
   *  \[from, to, balance, destination_status\]
   */
  get isV155(): boolean {
    return this._chain.getEventHash('Balances.ReserveRepatriated') === 'aed9aad67fe073fb38bb01741f1200b1f5f3aa52006f4669a1004d648cdb6e5d'
  }

  /**
   *  Some balance was moved from the reserve of the first account to the second account.
   *  Final argument indicates the destination balance type.
   *  \[from, to, balance, destination_status\]
   */
  get asV155(): [v155.AccountId, v155.AccountId, v155.Balance, v155.BalanceStatus] {
    assert(this.isV155)
    return this._chain.decodeEvent(this.event)
  }
}

export class BalancesReservedEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'Balances.Reserved')
    this._chain = ctx._chain
    this.event = event
  }

  /**
   * Some balance was reserved (moved from free to reserved). \[who, value\]
   */
  get isV1001(): boolean {
    return this._chain.getEventHash('Balances.Reserved') === 'e4f02aa7cee015102b6cbc171f5d7e84370e60deba2166a27195187adde0407f'
  }

  /**
   * Some balance was reserved (moved from free to reserved). \[who, value\]
   */
  get asV1001(): [v1001.AccountId20, bigint] {
    assert(this.isV1001)
    return this._chain.decodeEvent(this.event)
  }

  /**
   * Some balance was reserved (moved from free to reserved).
   */
  get isV1201(): boolean {
    return this._chain.getEventHash('Balances.Reserved') === '43e3321e3408ebd2b7d4c70d42ffa076463495043e47ddb0fb1fbe3e105f5b2f'
  }

  /**
   * Some balance was reserved (moved from free to reserved).
   */
  get asV1201(): {who: v1201.AccountId20, amount: bigint} {
    assert(this.isV1201)
    return this._chain.decodeEvent(this.event)
  }

  /**
   *  Some balance was reserved (moved from free to reserved). \[who, value\]
   */
  get isV155(): boolean {
    return this._chain.getEventHash('Balances.Reserved') === 'e4f02aa7cee015102b6cbc171f5d7e84370e60deba2166a27195187adde0407f'
  }

  /**
   *  Some balance was reserved (moved from free to reserved). \[who, value\]
   */
  get asV155(): [v155.AccountId, v155.Balance] {
    assert(this.isV155)
    return this._chain.decodeEvent(this.event)
  }
}

export class BalancesSlashedEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'Balances.Slashed')
    this._chain = ctx._chain
    this.event = event
  }

  /**
   * Some amount was removed from the account (e.g. for misbehavior). \[who,
   * amount_slashed\]
   */
  get isV1001(): boolean {
    return this._chain.getEventHash('Balances.Slashed') === 'e4f02aa7cee015102b6cbc171f5d7e84370e60deba2166a27195187adde0407f'
  }

  /**
   * Some amount was removed from the account (e.g. for misbehavior). \[who,
   * amount_slashed\]
   */
  get asV1001(): [v1001.AccountId20, bigint] {
    assert(this.isV1001)
    return this._chain.decodeEvent(this.event)
  }

  /**
   * Some amount was removed from the account (e.g. for misbehavior).
   */
  get isV1201(): boolean {
    return this._chain.getEventHash('Balances.Slashed') === '43e3321e3408ebd2b7d4c70d42ffa076463495043e47ddb0fb1fbe3e105f5b2f'
  }

  /**
   * Some amount was removed from the account (e.g. for misbehavior).
   */
  get asV1201(): {who: v1201.AccountId20, amount: bigint} {
    assert(this.isV1201)
    return this._chain.decodeEvent(this.event)
  }
}

export class BalancesTransferEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'Balances.Transfer')
    this._chain = ctx._chain
    this.event = event
  }

  /**
   * Transfer succeeded. \[from, to, value\]
   */
  get isV1001(): boolean {
    return this._chain.getEventHash('Balances.Transfer') === 'dfcae516f053c47e7cb49e0718f01587efcb64cea4e3baf4c6973a29891f7841'
  }

  /**
   * Transfer succeeded. \[from, to, value\]
   */
  get asV1001(): [v1001.AccountId20, v1001.AccountId20, bigint] {
    assert(this.isV1001)
    return this._chain.decodeEvent(this.event)
  }

  /**
   * Transfer succeeded.
   */
  get isV1201(): boolean {
    return this._chain.getEventHash('Balances.Transfer') === '23222c59f2992c12387568241620899d2d399ab9027595daca8255637f62ece3'
  }

  /**
   * Transfer succeeded.
   */
  get asV1201(): {from: v1201.AccountId20, to: v1201.AccountId20, amount: bigint} {
    assert(this.isV1201)
    return this._chain.decodeEvent(this.event)
  }

  /**
   *  Transfer succeeded. \[from, to, value\]
   */
  get isV155(): boolean {
    return this._chain.getEventHash('Balances.Transfer') === 'dfcae516f053c47e7cb49e0718f01587efcb64cea4e3baf4c6973a29891f7841'
  }

  /**
   *  Transfer succeeded. \[from, to, value\]
   */
  get asV155(): [v155.AccountId, v155.AccountId, v155.Balance] {
    assert(this.isV155)
    return this._chain.decodeEvent(this.event)
  }
}

export class BalancesUnreservedEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'Balances.Unreserved')
    this._chain = ctx._chain
    this.event = event
  }

  /**
   * Some balance was unreserved (moved from reserved to free). \[who, value\]
   */
  get isV1001(): boolean {
    return this._chain.getEventHash('Balances.Unreserved') === 'e4f02aa7cee015102b6cbc171f5d7e84370e60deba2166a27195187adde0407f'
  }

  /**
   * Some balance was unreserved (moved from reserved to free). \[who, value\]
   */
  get asV1001(): [v1001.AccountId20, bigint] {
    assert(this.isV1001)
    return this._chain.decodeEvent(this.event)
  }

  /**
   * Some balance was unreserved (moved from reserved to free).
   */
  get isV1201(): boolean {
    return this._chain.getEventHash('Balances.Unreserved') === '43e3321e3408ebd2b7d4c70d42ffa076463495043e47ddb0fb1fbe3e105f5b2f'
  }

  /**
   * Some balance was unreserved (moved from reserved to free).
   */
  get asV1201(): {who: v1201.AccountId20, amount: bigint} {
    assert(this.isV1201)
    return this._chain.decodeEvent(this.event)
  }

  /**
   *  Some balance was unreserved (moved from reserved to free). \[who, value\]
   */
  get isV155(): boolean {
    return this._chain.getEventHash('Balances.Unreserved') === 'e4f02aa7cee015102b6cbc171f5d7e84370e60deba2166a27195187adde0407f'
  }

  /**
   *  Some balance was unreserved (moved from reserved to free). \[who, value\]
   */
  get asV155(): [v155.AccountId, v155.Balance] {
    assert(this.isV155)
    return this._chain.decodeEvent(this.event)
  }
}

export class BalancesWithdrawEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'Balances.Withdraw')
    this._chain = ctx._chain
    this.event = event
  }

  /**
   * Some amount was withdrawn from the account (e.g. for transaction fees). \[who, value\]
   */
  get isV1001(): boolean {
    return this._chain.getEventHash('Balances.Withdraw') === 'e4f02aa7cee015102b6cbc171f5d7e84370e60deba2166a27195187adde0407f'
  }

  /**
   * Some amount was withdrawn from the account (e.g. for transaction fees). \[who, value\]
   */
  get asV1001(): [v1001.AccountId20, bigint] {
    assert(this.isV1001)
    return this._chain.decodeEvent(this.event)
  }

  /**
   * Some amount was withdrawn from the account (e.g. for transaction fees).
   */
  get isV1201(): boolean {
    return this._chain.getEventHash('Balances.Withdraw') === '43e3321e3408ebd2b7d4c70d42ffa076463495043e47ddb0fb1fbe3e105f5b2f'
  }

  /**
   * Some amount was withdrawn from the account (e.g. for transaction fees).
   */
  get asV1201(): {who: v1201.AccountId20, amount: bigint} {
    assert(this.isV1201)
    return this._chain.decodeEvent(this.event)
  }
}
