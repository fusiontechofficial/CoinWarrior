import chai, { expect } from 'chai'
import { Contract } from 'ethers'
import { solidity, MockProvider, createFixtureLoader } from 'ethereum-waffle'
import { expandTo18Decimals } from './shared/utilities'
import { nftFixture } from './shared/fixtures'


chai.use(solidity)

describe('CoinWarriorPair', () => {
  const provider = new MockProvider({
    hardfork: 'istanbul',
    mnemonic: 'horn horn horn horn horn horn horn horn horn horn horn horn',
    gasLimit: 9999999
  })

  const [wallet, other] = provider.getWallets()
  const loadFixture = createFixtureLoader(provider, [wallet, other])

  let factory: Contract
  let token0: Contract
  let token1: Contract
  let pair: Contract
  let nftWarrior: Contract

  beforeEach(async () => {
    const fixture = await loadFixture(nftFixture)
    factory = fixture.factory
    token0 = fixture.token0
    token1 = fixture.token1
    pair = fixture.pair
    nftWarrior = fixture.nftWarrior
  })

  it('mint warrior', async () => {
    await nftWarrior.mint(wallet.address, 0)
    await nftWarrior.mint(other.address, 1)
    await nftWarrior.transferFrom(wallet.address, other.address, 0)
    console.log(await nftWarrior.numWarriorInPlannet(wallet.address, 0))
    console.log(await nftWarrior.numWarriorInPlannet(other.address, 0))
  })

})