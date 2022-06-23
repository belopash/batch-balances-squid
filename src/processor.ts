import * as ss58 from '@subsquid/ss58'
import {
    BatchContext,
    BatchProcessorCallItem,
    BatchProcessorEventItem,
    BatchProcessorItem,
    decodeHex,
    SubstrateBatchProcessor,
    SubstrateBlock,
    SubstrateCall,
    toHex,
} from '@subsquid/substrate-processor'
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
import {
    BalancesAccountStorage,
    BalancesFreeBalanceStorage,
    BalancesReservedBalanceStorage,
    SystemAccountStorage,
} from './types/generated/storage'
import { Event, Block, ChainContext } from './types/generated/support'

const processor = new SubstrateBatchProcessor()
    .setBatchSize(500)
    .setDataSource({
        archive: 'https://kusama.archive.subsquid.io/graphql',
        chain: 'wss://kusama-rpc.polkadot.io',
    })
    .setBlockRange({
        from: 0,
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
    .addCall('*', {
        data: { call: { origin: true } },
    } as const)

type Item = BatchProcessorItem<typeof processor>
type EventItem = BatchProcessorEventItem<typeof processor>
type CallItem = BatchProcessorCallItem<typeof processor>
type Context = BatchContext<Store, Item>

processor.run(new TypeormDatabase(), processBalances)

async function processBalances(ctx: Context): Promise<void> {
    const accountIdsHex = new Set<string>()

    for (const block of ctx.blocks) {
        for (const item of block.items) {
            if (item.kind === 'call') {
                processBalancesCallItem(ctx, item, accountIdsHex)
            } else if (item.kind === 'event') {
                processBalancesEventItem(ctx, item, accountIdsHex)
            }
        }
    }

    const block = ctx.blocks[ctx.blocks.length - 1]
    const accountIdsU8 = [...accountIdsHex].map((id) => decodeHex(id))

    await saveAccounts(ctx, block.header, accountIdsU8)
}

async function saveAccounts(ctx: Context, block: SubstrateBlock, accountIds: Uint8Array[]) {
    const balances = await getBalances(ctx, block, accountIds)
    if (!balances) {
        ctx.log.warn('No balances')
        return
    }

    const accounts = new Map<string, Account>()

    for (let i = 0; i < accountIds.length; i++) {
        const id = encodeId(accountIds[i])
        const balance = balances[i]
        if (!balance) continue
        accounts.set(
            id,
            new Account({
                id,
                free: balance.free,
                reserved: balance.reserved,
                total: balance.free + balance.reserved,
                updatedAt: block.height,
            })
        )
    }

    await ctx.store.save([...accounts.values()])

    ctx.log.child('accounts').info(`updated: ${accounts.size}`)
}

function processBalancesCallItem(ctx: Context, item: CallItem, accountIdsHex: Set<string>) {
    const call = item.call as SubstrateCall
    if (call.parent != null) return

    const id = getOriginAccountId(call.origin)
    if (id == null) return

    accountIdsHex.add(id)
}

function processBalancesEventItem(ctx: Context, item: EventItem, accountIdsHex: Set<string>) {
    switch (item.name) {
        case 'Balances.BalanceSet': {
            const account = getBalanceSetAccount(ctx, item.event)
            accountIdsHex.add(account)
            break
        }
        case 'Balances.Endowed': {
            const account = getEndowedAccount(ctx, item.event)
            accountIdsHex.add(account)
            break
        }
        case 'Balances.Deposit': {
            const account = getDepositAccount(ctx, item.event)
            accountIdsHex.add(account)
            break
        }
        case 'Balances.Reserved': {
            const account = getReservedAccount(ctx, item.event)
            accountIdsHex.add(account)
            break
        }
        case 'Balances.Unreserved': {
            const account = getUnreservedAccount(ctx, item.event)
            accountIdsHex.add(account)
            break
        }
        case 'Balances.Withdraw': {
            const account = getWithdrawAccount(ctx, item.event)
            accountIdsHex.add(account)
            break
        }
        case 'Balances.Slashed': {
            const account = getSlashedAccount(ctx, item.event)
            accountIdsHex.add(account)
            break
        }
        case 'Balances.Transfer': {
            const accounts = getTransferAccounts(ctx, item.event)
            accountIdsHex.add(accounts[0])
            accountIdsHex.add(accounts[1])
            break
        }
        case 'Balances.ReserveRepatriated': {
            const accounts = getReserveRepatriatedAccounts(ctx, item.event)
            accountIdsHex.add(accounts[0])
            accountIdsHex.add(accounts[1])
            break
        }
    }
}

function getBalanceSetAccount(ctx: ChainContext, event: Event) {
    const data = new BalancesBalanceSetEvent(ctx, event)

    if (data.isV1031) {
        return toHex(data.asV1031[0])
    } else if (data.isV9130) {
        return toHex(data.asV9130.who)
    } else {
        throw new UnknownVersionError(data.constructor.name)
    }
}

function getTransferAccounts(ctx: ChainContext, event: Event) {
    const data = new BalancesTransferEvent(ctx, event)

    if (data.isV1020) {
        return [toHex(data.asV1020[0]), toHex(data.asV1020[1])]
    } else if (data.isV1050) {
        return [toHex(data.asV1050[0]), toHex(data.asV1050[1])]
    } else if (data.isV9130) {
        return [toHex(data.asV9130.from), toHex(data.asV9130.to)]
    } else {
        throw new UnknownVersionError(data.constructor.name)
    }
}

function getEndowedAccount(ctx: ChainContext, event: Event) {
    const data = new BalancesEndowedEvent(ctx, event)

    if (data.isV1050) {
        return toHex(data.asV1050[0])
    } else if (data.isV9130) {
        return toHex(data.asV9130.account)
    } else {
        throw new UnknownVersionError(data.constructor.name)
    }
}

function getDepositAccount(ctx: ChainContext, event: Event) {
    const data = new BalancesDepositEvent(ctx, event)

    if (data.isV1032) {
        return toHex(data.asV1032[0])
    } else if (data.isV9130) {
        return toHex(data.asV9130.who)
    } else {
        throw new UnknownVersionError(data.constructor.name)
    }
}

function getReservedAccount(ctx: ChainContext, event: Event) {
    const data = new BalancesReservedEvent(ctx, event)

    if (data.isV2008) {
        return toHex(data.asV2008[0])
    } else if (data.isV9130) {
        return toHex(data.asV9130.who)
    } else {
        throw new UnknownVersionError(data.constructor.name)
    }
}

function getUnreservedAccount(ctx: ChainContext, event: Event) {
    const data = new BalancesUnreservedEvent(ctx, event)

    if (data.isV2008) {
        return toHex(data.asV2008[0])
    } else if (data.isV9130) {
        return toHex(data.asV9130.who)
    } else {
        throw new UnknownVersionError(data.constructor.name)
    }
}

function getWithdrawAccount(ctx: ChainContext, event: Event) {
    const data = new BalancesWithdrawEvent(ctx, event)

    if (data.isV9122) {
        return toHex(data.asV9122[0])
    } else if (data.isV9130) {
        return toHex(data.asV9130.who)
    } else {
        throw new UnknownVersionError(data.constructor.name)
    }
}

function getSlashedAccount(ctx: ChainContext, event: Event) {
    const data = new BalancesSlashedEvent(ctx, event)

    if (data.isV9122) {
        return toHex(data.asV9122[0])
    } else if (data.isV9130) {
        return toHex(data.asV9130.who)
    } else {
        throw new UnknownVersionError(data.constructor.name)
    }
}

function getReserveRepatriatedAccounts(ctx: ChainContext, event: Event) {
    const data = new BalancesReserveRepatriatedEvent(ctx, event)

    if (data.isV2008) {
        return [toHex(data.asV2008[0]), toHex(data.asV2008[1])]
    } else if (data.isV9130) {
        return [toHex(data.asV9130.from), toHex(data.asV9130.to)]
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
        (await getBalancesAccountBalances(ctx, block, accounts)) ||
        (await getBalancesAccountBalancesOld(ctx, block, accounts))
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

async function getBalancesAccountBalancesOld(ctx: ChainContext, block: Block, accounts: Uint8Array[]) {
    const storageFree = new BalancesFreeBalanceStorage(ctx, block)

    const dataFree = storageFree.isExists
        ? await storageFree.getManyAsV1020(accounts)
        : new Array(accounts.length).fill(0n)

    const storageReserved = new BalancesReservedBalanceStorage(ctx, block)

    const dataReserved = storageReserved.isExists
        ? await storageReserved.getManyAsV1020(accounts)
        : new Array(accounts.length).fill(0n)

    return dataFree.map((f, i) => ({ free: f, reserved: dataReserved[i] }))
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getOriginAccountId(origin: any) {
    if (origin && origin.__kind === 'system' && origin.value.__kind === 'Signed') {
        return origin.value.value
    } else {
        return undefined
    }
}

export function encodeId(id: Uint8Array) {
    return ss58.codec('kusama').encode(id)
}
