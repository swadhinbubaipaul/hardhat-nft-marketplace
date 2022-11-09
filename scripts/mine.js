const { moveBlocks } = require("../utils/move-blocks");

const BLOCKS = 2;
const SLEEP_AMOUNT = 1000;

async function mine() {
  await moveBlocks(BLOCKS, (sleepAmount = SLEEP_AMOUNT));
}

mine()
  .then(() => process.exit(0))
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
