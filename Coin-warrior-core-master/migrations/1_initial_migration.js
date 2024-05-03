const Migrations = artifacts.require("Migrations");
const CoinWarriorFactory = artifacts.require("CoinWarriorFactory");
const NFTWarrior = artifacts.require("NFTWarrior");

module.exports = function (deployer) {
  deployer.deploy(Migrations);
  deployer.deploy(CoinWarriorFactory, "0x6148Ce093DCbd629cFbC4203C18210567d186C66");
  deployer.deploy(NFTWarrior, "Defi Warrior", "FIWA");
};
