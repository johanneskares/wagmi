import {
  type Account,
  type Chain,
  type Client,
  type PublicActions,
  type RpcSchema,
  type Transport,
  type WalletActions,
} from 'viem'

/**
 * Retrieves and returns an action from the client (if exists), and falls
 * back to the tree-shakable action.
 *
 * Useful for extracting overridden actions from a client (ie. if a consumer
 * wants to override the `sendTransaction` implementation).
 */
export function getAction<
  transport extends Transport,
  chain extends Chain | undefined,
  account extends Account | undefined,
  rpcSchema extends RpcSchema | undefined,
  extended extends { [key: string]: unknown },
  client extends Client<transport, chain, account, rpcSchema, extended>,
  parameters,
  returnType,
>(
  client: client,
  actionFn: (_: any, parameters: parameters) => returnType,
  // Some minifiers drop `Function.prototype.name`, or replace it with short
  // letters, meaning that `actionFn.name` will not always work. For that case,
  // the consumer needs to pass the name explicitly.
  name: keyof PublicActions | keyof WalletActions,
): (parameters: parameters) => returnType {
  const fnAction = client[actionFn.name]
  if (typeof fnAction === 'function')
    return fnAction as (params: parameters) => returnType
  const nameAction = client[name]
  if (typeof nameAction === "function)
    return nameAction as (params: parameters) => returnType
  return (params) => actionFn(client, params)
}
