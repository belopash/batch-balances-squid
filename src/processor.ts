import * as ss58 from '@subsquid/ss58'
import { BatchContext, BatchProcessorItem, SubstrateBatchProcessor } from '@subsquid/substrate-processor'
import { Store, TypeormDatabase } from '@subsquid/typeorm-store'
import { Account } from './model'
import {
    BalancesBalanceSetEvent,
    BalancesDepositEvent,
    BalancesEndowedEvent,
    BalancesReservedEvent,
    BalancesReserveRepatriatedEvent,
    BalancesSlashedEvent,
    BalancesTransferEvent,
    BalancesUnreservedEvent,
    BalancesWithdrawEvent,
} from './types/generated/events'
import { BalancesAccountStorage, SystemAccountStorage } from './types/generated/storage'
import { Event, Block, ChainContext } from './types/generated/support'

const processor = new SubstrateBatchProcessor()
    .setBatchSize(500)
    .setDataSource({
        archive: 'https://kusama.archive.subsquid.io/graphql',
        chain: 'wss://kusama-rpc.polkadot.io',
    })
    .addEvent('Balances.Endowed', {
        data: { event: { args: true } },
    } as const)
    .addEvent('Balances.Transfer', {
        data: { event: { args: true } },
    } as const)
    .addEvent('Balances.BalanceSet', {
        data: { event: { args: true } },
    } as const)
    .addEvent('Balances.Reserved', {
        data: { event: { args: true } },
    } as const)
    .addEvent('Balances.Unreserved', {
        data: { event: { args: true } },
    } as const)
    .addEvent('Balances.ReserveRepatriated', {
        data: { event: { args: true } },
    } as const)
    .addEvent('Balances.Deposit', {
        data: { event: { args: true } },
    } as const)
    .addEvent('Balances.Withdraw', {
        data: { event: { args: true } },
    } as const)
    .addEvent('Balances.Slashed', {
        data: { event: { args: true } },
    } as const)

type Item = BatchProcessorItem<typeof processor>
type Ctx = BatchContext<Store, Item>

processor.run(new TypeormDatabase(), processBalances)

async function processBalances(ctx: Ctx): Promise<void> {
    const accountIdsSet = new Set<Uint8Array>()

    for (const block of ctx.blocks) {
        for (const item of block.items) {
            switch (item.name) {
                case 'Balances.BalanceSet': {
                    const account = getBalanceSetAccount(ctx, item.event)
                    accountIdsSet.add(account)
                    break
                }
                case 'Balances.Endowed': {
                    const account = getEndowedAccount(ctx, item.event)
                    accountIdsSet.add(account)
                    break
                }
                case 'Balances.Deposit': {
                    const account = getDepositAccount(ctx, item.event)
                    accountIdsSet.add(account)
                    break
                }
                case 'Balances.Reserved': {
                    const account = getReservedAccount(ctx, item.event)
                    accountIdsSet.add(account)
                    break
                }
                case 'Balances.Unreserved': {
                    const account = getUnreservedAccount(ctx, item.event)
                    accountIdsSet.add(account)
                    break
                }
                case 'Balances.Withdraw': {
                    const account = getWithdrawAccount(ctx, item.event)
                    accountIdsSet.add(account)
                    break
                }
                case 'Balances.Slashed': {
                    const account = getSlashedAccount(ctx, item.event)
                    accountIdsSet.add(account)
                    break
                }
                case 'Balances.Transfer': {
                    const accounts = getTransferAccounts(ctx, item.event)
                    accountIdsSet.add(accounts[0])
                    accountIdsSet.add(accounts[1])
                    break
                }
                case 'Balances.ReserveRepatriated': {
                    const accounts = getReserveRepatriatedAccounts(ctx, item.event)
                    accountIdsSet.add(accounts[0])
                    accountIdsSet.add(accounts[1])
                    break
                }
            }
        }
    }

    const block = ctx.blocks[ctx.blocks.length - 1]

    const accountIds = [...accountIdsSet]

    const balances = await getBalances(ctx, block.header, accountIds)
    if (!balances) {
        ctx.log.warn('No balances')
        return
    }

    const accounts = new Map<string, Account>()
    const deletions = new Map<string, Account>()

    for (let i = 0; i < accountIds.length; i++) {
        const id = ss58.codec('kusama').encode(accountIds[i])
        const balance = balances[i]
        if (balance) {
            accounts.set(
                id,
                new Account({
                    id,
                    free: balance.free,
                    reserved: balance.reserved,
                    total: balance.free + balance.reserved,
                })
            )
        } else {
            deletions.set(
                id,
                new Account({
                    id,
                })
            )
        }
    }

    await ctx.store.remove([...deletions.values()])
    await ctx.store.save([...accounts.values()])
}

function getBalanceSetAccount(ctx: ChainContext, event: Event) {
    const data = new BalancesBalanceSetEvent(ctx, event)

    if (data.isV1031) {
        return data.asV1031[0]
    } else if (data.isV9130) {
        return data.asV9130.who
    } else {
        throw new UnknownVersionError(data.constructor.name)
    }
}

function getTransferAccounts(ctx: ChainContext, event: Event) {
    const data = new BalancesTransferEvent(ctx, event)

    if (data.isV1020) {
        return data.asV1020.slice(0, 2) as Uint8Array[]
    } else if (data.isV1050) {
        return data.asV1050.slice(0, 2) as Uint8Array[]
    } else if (data.isV9130) {
        return [data.asV9130.from, data.asV9130.to]
    } else {
        throw new UnknownVersionError(data.constructor.name)
    }
}

function getEndowedAccount(ctx: ChainContext, event: Event) {
    const data = new BalancesEndowedEvent(ctx, event)

    if (data.isV1050) {
        return data.asV1050[0]
    } else if (data.isV9130) {
        return data.asV9130.account
    } else {
        throw new UnknownVersionError(data.constructor.name)
    }
}

function getDepositAccount(ctx: ChainContext, event: Event) {
    const data = new BalancesDepositEvent(ctx, event)

    if (data.isV1032) {
        return data.asV1032[0]
    } else if (data.isV9130) {
        return data.asV9130.who
    } else {
        throw new UnknownVersionError(data.constructor.name)
    }
}

function getReservedAccount(ctx: ChainContext, event: Event) {
    const data = new BalancesReservedEvent(ctx, event)

    if (data.isV2008) {
        return data.asV2008[0]
    } else if (data.isV9130) {
        return data.asV9130.who
    } else {
        throw new UnknownVersionError(data.constructor.name)
    }
}

function getUnreservedAccount(ctx: ChainContext, event: Event) {
    const data = new BalancesUnreservedEvent(ctx, event)

    if (data.isV2008) {
        return data.asV2008[0]
    } else if (data.isV9130) {
        return data.asV9130.who
    } else {
        throw new UnknownVersionError(data.constructor.name)
    }
}

function getWithdrawAccount(ctx: ChainContext, event: Event) {
    const data = new BalancesWithdrawEvent(ctx, event)

    if (data.isV9122) {
        return data.asV9122[0]
    } else if (data.isV9130) {
        return data.asV9130.who
    } else {
        throw new UnknownVersionError(data.constructor.name)
    }
}

function getSlashedAccount(ctx: ChainContext, event: Event) {
    const data = new BalancesSlashedEvent(ctx, event)

    if (data.isV9122) {
        return data.asV9122[0]
    } else if (data.isV9130) {
        return data.asV9130.who
    } else {
        throw new UnknownVersionError(data.constructor.name)
    }
}

function getReserveRepatriatedAccounts(ctx: ChainContext, event: Event) {
    const data = new BalancesReserveRepatriatedEvent(ctx, event)

    if (data.isV2008) {
        return data.asV2008.slice(0, 2) as Uint8Array[]
    } else if (data.isV9130) {
        return [data.asV9130.from, data.asV9130.to]
    } else {
        throw new UnknownVersionError(data.constructor.name)
    }
}

interface Balance {
    free: bigint
    reserved: bigint
}

async function getBalances(
    ctx: ChainContext,
    block: Block,
    accounts: Uint8Array[]
): Promise<(Balance | undefined)[] | undefined> {
    return (
        (await getSystemAccountBalances(ctx, block, accounts)) ||
        (await getBalancesAccountBalances(ctx, block, accounts))
    )
}

async function getBalancesAccountBalances(ctx: ChainContext, block: Block, accounts: Uint8Array[]) {
    const storage = new BalancesAccountStorage(ctx, block)
    if (!storage.isExists) return undefined

    const data = await ctx._chain.queryStorage(
        block.hash,
        'Balances',
        'Account',
        accounts.map((a) => [a])
    )

    return data.map((d) => ({ free: d.free, reserved: d.reserved }))
}

async function getSystemAccountBalances(ctx: ChainContext, block: Block, accounts: Uint8Array[]) {
    const storage = new SystemAccountStorage(ctx, block)
    if (!storage.isExists) return undefined

    const data = await ctx._chain.queryStorage(
        block.hash,
        'System',
        'Account',
        accounts.map((a) => [a])
    )

    return data.map((d) => ({ free: d.data.free, reserved: d.data.reserved }))
}

export class UnknownVersionError extends Error {
    constructor(name: string) {
        super(`There is no relevant version for ${name}`)
    }
}
