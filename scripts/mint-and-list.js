const { ethers, network } = require("hardhat");
const { moveBlocks } = require("../utils/move-blocks");

const PRICE = ethers.utils.parseEther("0.1");
async function mintAndList() {
  const nftMarketplace = await ethers.getContract("NftMarketplace");
  const basicNft = await ethers.getContract("BasicNft");
  const mintTx = await basicNft.mintNft();
  console.log("Minting NFT...");
  const mintTxReceipt = await mintTx.wait(1);
  const tokenId = mintTxReceipt.events[0].args.tokenId;
  const approveTx = await basicNft.approve(nftMarketplace.address, tokenId);
  await approveTx.wait(1);
  const listTx = await nftMarketplace.listItem(
    basicNft.address,
    tokenId,
    PRICE
  );
  console.log("Listing NFT...");
  await listTx.wait(1);

  const listed = await nftMarketplace.getListing(basicNft.address, tokenId);
  const price = ethers.utils.formatEther(listed.price);
  if (price > 0) {
    console.log("NFT Listed!");
  } else {
    console.log("Failed to mint NFT!!!");
  }

  if (network.config.chainId == "31337") {
    await moveBlocks(2, (sleepAmount = 1000));
  }
}

mintAndList()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
