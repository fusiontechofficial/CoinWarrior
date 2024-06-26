import { Contract, Wallet } from 'ethers'
import { Web3Provider } from 'ethers/providers'
import { deployContract } from 'ethereum-waffle'

import { expandTo18Decimals } from './utilities'

import ERC20 from '../../build/ERC20.json'
import CoinWarriorFactory from '../../build/CoinWarriorFactory.json'
import CoinWarriorPair from '../../build/CoinWarriorPair.json'
import CoinWarrior from '../../build/CoinWarrior.json'


interface FactoryFixture {
  factory: Contract
}

const overrides = {
  gasLimit: 9999999
}

export async function factoryFixture(_: Web3Provider, [wallet]: Wallet[]): Promise<FactoryFixture> {
  const factory = await deployContract(wallet, CoinWarriorFactory, [wallet.address, "0x0"], overrides)
  return { factory }
}

interface PairFixture extends FactoryFixture {
  token0: Contract
  token1: Contract
  pair: Contract
}

interface NFTFixture extends PairFixture {
  nftWarrior: Contract
}

export async function pairFixture(provider: Web3Provider, [wallet]: Wallet[]): Promise<PairFixture> {
  const { factory } = await factoryFixture(provider, [wallet])

  const tokenA = await deployContract(wallet, ERC20, [expandTo18Decimals(10000)], overrides)
  const tokenB = await deployContract(wallet, ERC20, [expandTo18Decimals(10000)], overrides)

  await factory.createPair(tokenA.address, tokenB.address, overrides)
  const pairAddress = await factory.getPair(tokenA.address, tokenB.address)
  const pair = new Contract(pairAddress, JSON.stringify(CoinWarriorPair.abi), provider).connect(wallet)

  const token0Address = (await pair.token0()).address
  const token0 = tokenA.address === token0Address ? tokenA : tokenB
  const token1 = tokenA.address === token0Address ? tokenB : tokenA

  return { factory, token0, token1, pair }
}

export async function nftFixture(provider: Web3Provider, [wallet, other]: Wallet[]): Promise<NFTFixture> {
  const nftWarrior = await deployContract(wallet, CoinWarrior, ["Defi Warrior", "FIWA"], overrides);
  const factory = await deployContract(wallet, CoinWarriorFactory, [wallet.address], overrides)

  const tokenA = await deployContract(wallet, ERC20, [expandTo18Decimals(10000)], overrides)
  const tokenB = await deployContract(wallet, ERC20, [expandTo18Decimals(10000)], overrides)

  await factory.createPair(tokenA.address, tokenB.address, overrides)
  const pairAddress = await factory.getPair(tokenA.address, tokenB.address)
  const pair = new Contract(pairAddress, JSON.stringify(CoinWarriorPair.abi), provider).connect(wallet)

  const token0Address = (await pair.token0()).address
  const token0 = tokenA.address === token0Address ? tokenA : tokenB
  const token1 = tokenA.address === token0Address ? tokenB : tokenA

  await token0.transfer(other.address, expandTo18Decimals(100))
  await token1.transfer(other.address, expandTo18Decimals(100))

  await nftWarrior.updateMiner(wallet.address, true)
  await nftWarrior.setCurrency(token0.address);
  await token0.approve(nftWarrior.address, expandTo18Decimals(1000000))

  return { factory, token0, token1, pair, nftWarrior }
}