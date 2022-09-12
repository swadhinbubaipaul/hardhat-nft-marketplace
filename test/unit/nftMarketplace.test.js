const { assert, expect } = require("chai");
const { network, deployments, ethers } = require("hardhat");
const { developmentChains } = require("../../helper-hardhat-config");

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("NftMarketplace tests", function () {
      let nftMarketplace, basicNft, deployer, player;
      const PRICE = ethers.utils.parseEther("0.1");
      const TOKEN_ID = 0;

      beforeEach(async function () {
        deployer = (await getNamedAccounts()).deployer;
        // player = (await getNamedAccounts()).player;
        const accounts = await ethers.getSigners();
        player = accounts[1];
        await deployments.fixture(["all"]);
        nftMarketplace = await ethers.getContract("NftMarketplace");
        basicNft = await ethers.getContract("BasicNft");
        await basicNft.mintNft();
        await basicNft.approve(nftMarketplace.address, TOKEN_ID);
      });

      describe("listItem", function () {
        it("lists and can be bought", async function () {
          await nftMarketplace.listItem(basicNft.address, TOKEN_ID, PRICE);
          const playerConnectedMarketplace = nftMarketplace.connect(player);
          await playerConnectedMarketplace.buyItem(basicNft.address, TOKEN_ID, {
            value: PRICE,
          });
          const newOwner = await basicNft.ownerOf(TOKEN_ID);
          const deployerProceeds = await nftMarketplace.getProceeds(deployer);
          assert(newOwner.toString() == player.address);
          assert(deployerProceeds.toString() == PRICE.toString());
        });
      });
    });
