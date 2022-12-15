import TOKEN_ABI from "../abis/Token.json";
import EXCHANGE_ABI from "../abis/Exchange.json";
import { ethers } from "ethers";
export const loadProvider = (dispatch) => {
  const connection = new ethers.providers.Web3Provider(window.ethereum);
  dispatch({ type: "PROVIDER_LOADED", connection });
  return connection;
};
export const loadNetwork = async (provider, dispatch) => {
  const { chainId } = await provider.getNetwork();
  dispatch({ type: "NETWORK_LOADED", chainId });
  return chainId;
};

export const loadAccount = async (provider, dispatch) => {
  const accounts = await window.ethereum.request({
    method: "eth_requestAccounts",
  });

  const account = ethers.utils.getAddress(accounts[0]);
  dispatch({ type: "ACCOUNT_LOADED", account });
  let balance = await provider.getBalance(account);
  balance = ethers.utils.formatEther(balance);
  dispatch({ type: "ETHER_BALANCE_LOADED", balance });
  return account;
};
export const loadTokens = async (provider, addresses, dispatch) => {
  let token, symbol;
  token = new ethers.Contract(addresses, TOKEN_ABI, provider);
  symbol = await token.getSymbol();
  dispatch({ type: "TOKEN_2_LOADED", token, symbol });
};
export const loadExchange = async (provider, address, dispatch) => {
  const exchange = new ethers.Contract(address, EXCHANGE_ABI, provider);
  dispatch({ type: "EXCHANGE_LOADED", exchange });
  return exchange;
};
export const loadBalance = async (exchange, tokens, account, dispatch) => {
  let balance = ethers.utils.formatEther(await tokens[0].getBalance(account));
  dispatch({ type: "TOKEN_2_BALANCE_LOADED", balance });
};
export const buyTokens = async (
  provider,
  exchange,
  tokens,
  amount,
  account,
  dispatch
) => {
  dispatch({ type: "BUY_TOKEN_REQUEST" });
  try {
    const signer = await provider.getSigner();
    await exchange.connect(signer).buyTokens(tokens[0].address, {
      from: account,
      value: tokens_Transform(amount),
    });
  } catch (error) {
    dispatch({ type: "BUY_TOKEN_FAIL" });
  }
};
export const sellTokens = async (
  provider,
  exchange,
  tokens,
  amount,
  account,
  dispatch
) => {
  dispatch({ type: "SELL_TOKEN_REQUEST" });
  try {
    const signer = await provider.getSigner();

    await tokens[0]
      .connect(signer)
      .approve(exchange.address, tokens_Transform(amount));
    await exchange
      .connect(signer)
      .sellToken(tokens[0].address, tokens_Transform(amount));
  } catch (error) {
    dispatch({ type: "SELL_TOKEN_FAIL" });
  }
};

const tokens_Transform = (n) => {
  return ethers.utils.parseEther(n.toString());
};

export const subscribeToEvents = async (exchange, dispatch) => {
  exchange.on("Exchange__TokenPurchased", (owner, token, amount, event) => {
    dispatch({ type: "BUY_TOKEN_SUCCESS", event });
  });
  exchange.on("Exchange__TokenSold", (owner, token, amount, event) => {
    dispatch({ type: "SELL_TOKEN_SUCCESS", event });
  });
};
