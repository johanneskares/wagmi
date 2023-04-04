import type {
  ContractFunctionConfig,
  MulticallParameters,
  MulticallReturnType,
} from 'viem'

import { ChainNotConfiguredError, ProviderChainsNotFound } from '../../errors'
import { getProvider } from '../providers'

export type MulticallConfig<
  TContracts extends ContractFunctionConfig[] = ContractFunctionConfig[],
  TAllowFailure extends boolean = true,
> = MulticallParameters<TContracts, TAllowFailure> & {
  /** Chain id to use for provider */
  chainId?: number
}

export type MulticallResult<
  TContracts extends ContractFunctionConfig[] = ContractFunctionConfig[],
  TAllowFailure extends boolean = true,
> = MulticallReturnType<TContracts, TAllowFailure>

export async function multicall<
  TContracts extends ContractFunctionConfig[],
  TAllowFailure extends boolean = true,
>({
  chainId,
  contracts,
  blockNumber,
  blockTag,
  ...args
}: MulticallConfig<TContracts, TAllowFailure>): Promise<
  MulticallResult<TContracts, TAllowFailure>
> {
  const provider = getProvider({ chainId })
  if (!provider.chains) throw new ProviderChainsNotFound()

  if (chainId && provider.chain.id !== chainId)
    throw new ChainNotConfiguredError({ chainId })

  return provider.multicall({
    allowFailure: args.allowFailure ?? true,
    blockNumber,
    blockTag,
    contracts,
  } as MulticallParameters<TContracts, TAllowFailure>)
}
