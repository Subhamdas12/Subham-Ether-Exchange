import { useDispatch, useSelector } from "react-redux";
import {
  buyTokens,
  loadAccount,
  loadBalance,
  sellTokens,
} from "../store/interactions";
import Blockies from "react-blockies";
import config from "../config.json";
import { useEffect, useState } from "react";
const Body = () => {
  const chainId = useSelector((state) => state.provider.chainId);
  const account = useSelector((state) => state.provider.account);
  const provider = useSelector((state) => state.provider.connection);
  const balance = useSelector((state) => state.provider.balance);
  const tokens = useSelector((state) => state.tokens.contracts);
  const exchange = useSelector((state) => state.exchange.contract);
  const tokenBalance = useSelector((state) => state.tokens.balances);
  const transferInProgress = useSelector(
    (state) => state.exchange.transferInProgress
  );
  const ether_transaction = useSelector(
    (state) => state.provider.ether_transaction
  );
  const dispatch = useDispatch();
  const [isBuy, setIsBuy] = useState(true);
  const [tokenTransferAmount, setTokenTransferAmount] = useState(0);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (isBuy) {
      if (provider && exchange && tokens && account) {
        buyTokens(
          provider,
          exchange,
          tokens,
          tokenTransferAmount,
          account,
          dispatch
        );
      }
      setTokenTransferAmount(0);
    } else {
      if (provider && exchange && tokens && account) {
        sellTokens(
          provider,
          exchange,
          tokens,
          tokenTransferAmount,
          account,
          dispatch
        );
      }
      setTokenTransferAmount(0);
    }
  };
  const connect_handler = async (e) => {
    await loadAccount(provider, dispatch);
  };
  const actionHandler = async (e) => {
    if (e.target.value === "sell") {
      await setIsBuy(false);
    } else {
      await setIsBuy(true);
    }
  };

  const networkHandler = async (e) => {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [
        {
          chainId: e.target.value,
        },
      ],
    });
  };
  const amountHandler = async (e) => {
    setTokenTransferAmount(e.target.value);
  };
  useEffect(() => {
    if (tokens && exchange && account && provider) {
      loadBalance(exchange, tokens, account, dispatch);
      loadAccount(provider, dispatch);
    }
  }, [
    tokens,
    exchange,
    account,
    dispatch,
    transferInProgress,
    ether_transaction,
    provider,
  ]);
  return (
    <form onSubmit={handleSubmit}>
      <h2 id="title">Subham Ether Exchange</h2>

      {!account && !balance ? (
        <button
          onClick={connect_handler}
          className="button"
          id="exchange__Token "
        >
          <span>Connect </span>
        </button>
      ) : (
        <div className="box__balance">
          <span className="my__balance etH">
            <small>My mETH Balance :</small>
            {tokenBalance ? tokenBalance : "0"}
          </span>
          <span className="my__balance">
            <small>My Ether Balance :</small>
            {Number(balance).toFixed(4)}
          </span>
          <a
            href={
              config[chainId]
                ? `${config[chainId].explorerURL}/address/${account}`
                : `#`
            }
            target="_blank"
            rel="noreferrer"
          >
            {account.slice(0, 5) + "...." + account.slice(38, 42)}
            <Blockies
              seed={account}
              size={10}
              scale={3}
              color="#2187D0"
              bgColor="#F1F2F9"
              spotColor="#767F92"
              className="identicon"
            />
          </a>
        </div>
      )}

      <label>
        Amount:
        <input
          type="text"
          placeholder="0.0000"
          value={tokenTransferAmount === 0 ? "" : tokenTransferAmount}
          onChange={amountHandler}
        />
      </label>

      <label>
        Action :
        <select name="networks" onChange={actionHandler} id="networks">
          <option value="0" disabled>
            Select Action
          </option>
          <option value="buy">BUY</option>
          <option value="sell">SELL</option>
        </select>
      </label>
      <label>
        Network:
        <select
          name="networks"
          id="networks"
          value={config[chainId] ? `0x${chainId.toString(16)}` : `0`}
          onChange={networkHandler}
        >
          <option value="0" disabled>
            Select Network
          </option>
          <option value="0x7A69">Localhost</option>
          <option value="0x5">Goerli</option>
          <option value="0x13881">Mumbai</option>
        </select>
      </label>

      <button id="exchange__Token">Exchange Token</button>
    </form>
  );
};
export default Body;
