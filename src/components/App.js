import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  loadAccount,
  loadExchange,
  loadNetwork,
  loadProvider,
  loadTokens,
  subscribeToEvents,
} from "../store/interactions";
import config from "../config.json";
import Body from "./Body";
export default function App() {
  const dispatch = useDispatch();

  const loadBlockchainData = async () => {
    const provider = loadProvider(dispatch);
    const chainId = await loadNetwork(provider, dispatch);
    window.ethereum.on("accountsChanged", () => {
      loadAccount(provider, dispatch);
    });
    window.ethereum.on("chainChanged", () => {
      window.location.reload();
    });
    const mETH = config[chainId].mETH;
    loadTokens(provider, mETH.address, dispatch);
    const exchange_config = config[chainId].exchange;
    const exchange = await loadExchange(
      provider,
      exchange_config.address,
      dispatch
    );
    subscribeToEvents(exchange, dispatch);
  };
  useEffect(() => {
    loadBlockchainData();
  });
  return <Body />;
}
