import { AxiosRequestConfig } from "axios";

import cryptocompareClient from "../util/CryptocompareClient";

export const convertMultipleCoins = async (
  listOfCoins: string[],
  listofCurrencies: string[]
) => {
  const config: AxiosRequestConfig = {
    method: "get",
    url: "/pricemulti?fsyms=BTC,ETH&tsyms=USD",
    params: {
      fsyms: listOfCoins.join(","),
      tsyms: listofCurrencies.join(","),
    },
  };
  const { data } = await cryptocompareClient(config);
  return data;
};
