export const provider = (state = {}, action) => {
  switch (action.type) {
    case "PROVIDER_LOADED":
      return { ...state, connection: action.connection };
    case "NETWORK_LOADED":
      return { ...state, chainId: action.chainId };
    case "ACCOUNT_LOADED":
      return {
        ...state,
        account: action.account,
      };
    case "ETHER_BALANCE_LOADED":
      return {
        ...state,
        balance: action.balance,
        ether_transaction: true,
      };
    default:
      return state;
  }
};
const DEFAULT_TOKEN_STATE = {
  loaded: false,
  contracts: [],
  symbols: [],
};
export const tokens = (state = DEFAULT_TOKEN_STATE, action) => {
  switch (action.type) {
    case "TOKEN_2_LOADED":
      return { ...state, contracts: [action.token], symbols: [action.symbol] };
    case "TOKEN_2_BALANCE_LOADED":
      return {
        ...state,
        balances: [action.balance],
      };
    default:
      return state;
  }
};

const DEFAULT_EXCHANGE_STATE = {
  loaded: false,
  contract: {},
  transaction: {
    isSuccessful: false,
  },
};
export const exchange = (state = DEFAULT_EXCHANGE_STATE, action) => {
  switch (action.type) {
    case "EXCHANGE_LOADED":
      return {
        ...state,
        loadad: true,
        contract: action.exchange,
      };
    case "BUY_TOKEN_REQUEST":
      return {
        ...state,
        transaction: {
          isSuccessful: false,
          isPending: true,
          transactionType: "Buy",
        },
        transferInProgress: true,
      };
    case "BUY_TOKEN_SUCCESS":
      return {
        ...state,
        transaction: {
          isSuccessful: true,
          isPending: false,
          transactionType: "Buy",
        },
        transferInProgress: false,
      };
    case "BUY_TOKEN_FAIL":
      return {
        ...state,
        transaction: {
          isSuccessful: true,
          isPending: false,
          isError: true,
          transactionType: "Buy",
        },
        transferInProgress: false,
      };
    case "SELL_TOKEN_REQUEST":
      return {
        ...state,
        transaction: {
          isSuccessful: false,
          isPending: true,
          transactionType: "Sell",
        },
        transferInProgress: true,
      };

    case "SELL_TOKEN_SUCCESS":
      return {
        ...state,
        transaction: {
          isSuccessful: true,
          isPending: false,
          transactionType: "Sell",
        },
        transferInProgress: false,
      };

    case "SELL_TOKEN_FAIL":
      return {
        ...state,
        transaction: {
          isSuccessful: true,
          isPending: false,
          isError: true,
          transactionType: "Sell",
        },
        transferInProgress: false,
      };
    default:
      return state;
  }
};
