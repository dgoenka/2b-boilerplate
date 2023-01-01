import fs from "fs";
import readline from "readline";
import rootName from "./rootname";

export const transactionFileStream = async (callback: (string) => void) => {
  const rl = readline.createInterface({
    input: fs.createReadStream(`${rootName}/data/transactions.csv`),
    crlfDelay: Infinity,
  });
  rl.on("line", callback);
  await new Promise((res) => rl.once("close", res));
};
