// Write your answer here
import { transactionFileStream } from "./src/util/TransactionFileStream";
import { convertMultipleCoins } from "./src/service/CryptocompareService";

const maxPortofolioTokenFinder = async () => {
  const coinwisePortfolio = {};
  let noOfLines = 0;

  const transactionFileReadStart = Date.now();
  await transactionFileStream((line) => {
    noOfLines++;
    const [, transactionType, token, amount] = line.split(",");
    switch (transactionType) {
      case "DEPOSIT":
        coinwisePortfolio[token] =
          (coinwisePortfolio[token] || 0) + Number(amount);
        break;
      case "WITHDRAW":
        coinwisePortfolio[token] =
          (coinwisePortfolio[token] || 0) - Number(amount);
        break;
    }
  });
  console.log(
    `Processed ${noOfLines} in ${Date.now() - transactionFileReadStart}ms`
  );

  const coinList = Object.keys(coinwisePortfolio);
  console.log(`There are ${coinList.length} different tokens`);
  const coinValues = await convertMultipleCoins(coinList, ["USD"]);
  // TODO: OPTIMISATION: USE REDIS CACHE TO STORE VENDOR API DATA

  const usdConvertedCoinValues = {};
  const maxPortfolio = { currency: null, value: null };
  coinList.forEach((coin) => {
    usdConvertedCoinValues[coin] =
      coinwisePortfolio[coin] * coinValues[coin]["USD"];
    if (
      maxPortfolio.currency == null ||
      maxPortfolio.value < usdConvertedCoinValues[coin]
    ) {
      maxPortfolio.currency = coin;
      maxPortfolio.value = usdConvertedCoinValues[coin];
    }
  });

  return maxPortfolio;
};

maxPortofolioTokenFinder()
  .then((maxPortofolioToken) => {
    console.log(
      `The token with the maximum portfolio is ${maxPortofolioToken.currency} with a value of USD ${maxPortofolioToken.value}`
    );
    process.exit(0);
  })
  .catch((err) => {
    process.exit(1);
  });
