const { network } = require("hardhat");
const { developmentChains } = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deployer } = await getNamedAccounts();
  const { deploy, log } = deployments;

  log("----------------------------------");
  let args = [];
  const basicNft = await deploy("BasicNft", {
    from: deployer,
    args: args,
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
  });

  // Verify the contract
  if (!developmentChains.includes(network.name)) {
    log("Verifying...");
    await verify(basicNft, args);
  }
};

module.exports.tags = ["all", "basicnft"];
