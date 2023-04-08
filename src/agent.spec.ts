import {
  FindingType,
  FindingSeverity,
  Finding,
  HandleTransaction,
  createTransactionEvent,
  ethers,
} from "forta-agent";
import agent, {
  ERC20_TRANSFER_EVENT,
  TETHER_ADDRESS,
  TETHER_DECIMALS,
} from "./agent";

describe("donation frequency analysis", () => {
  it("should analyze donation frequency correctly", async () => {
    expect(mockTxEvent.filterLog).toHaveBeenCalledWith(
      ERC20_TRANSFER_EVENT,
      TETHER_ADDRESS
    );
  });

  const normalizedValue = mockTetherTransferEvent.args.value.div(
    10 ** TETHER_DECIMALS
  );
  expect(findings).toStrictEqual([
    Finding.fromObject({
      name: "High Tether Transfer",
      description: `High amount of USDT transferred: ${normalizedValue}`,
      alertId: "FORTA-1",
      severity: FindingSeverity.Low,
      type: FindingType.Info,
      metadata: {
        to: mockTetherTransferEvent.args.to,
        from: mockTetherTransferEvent.args.from,
      },
    }),
  ]);
  expect(mockTxEvent.filterLog).toHaveBeenCalledTimes(1);
  expect(mockTxEvent.filterLog).toHaveBeenCalledWith(
    ERC20_TRANSFER_EVENT,
    TETHER_ADDRESS
  );
});

import agent, { analyzeNonce } from "./agent";
// ...
describe("nonce analysis", () => {
  const mockTxEvent = createTransactionEvent({} as any);

  beforeAll(() => {
    // Example: Assuming the transaction event object has a nonce property
    mockTxEvent.nonce = 42;
  });

  it("should log the transaction nonce", async () => {
    const consoleLogSpy = jest.spyOn(console, "log");
    consoleLogSpy.mockImplementation(() => {});

    await analyzeNonce(mockTxEvent);

    expect(consoleLogSpy).toHaveBeenCalledWith("Transaction nonce: 42");

    consoleLogSpy.mockRestore();
  });
});



  describe("handleTransaction", () => {
    it("returns empty findings if there are no Tether transfers", async () => {
      mockTxEvent.filterLog = jest.fn().mockReturnValue([]);

      const findings = await handleTransaction(mockTxEvent);

      expect(findings).toStrictEqual([]);
      expect(mockTxEvent.filterLog).toHaveBeenCalledTimes(1);
      expect(mockTxEvent.filterLog).toHaveBeenCalledWith(
        ERC20_TRANSFER_EVENT,
        TETHER_ADDRESS
      );
    });

    import agent, { getProviderForNetwork, handleTransactionForNetwork } from "./agent";
// ...
describe("network support", () => {
  const mockTxEvent = createTransactionEvent({} as any);

  it("should get the provider for the specified network", async () => {
    const mainnetProvider = await getProviderForNetwork("mainnet");
    const rinkebyProvider = await getProviderForNetwork("rinkeby");

    expect(mainnetProvider).toBeInstanceOf(ethers.providers.JsonRpcProvider);
    expect(rinkebyProvider).toBeInstanceOf(ethers.providers.JsonRpcProvider);
    expect(mainnetProvider.network.chainId).toEqual(1);
    expect(rinkebyProvider.network.chainId).toEqual(4);
  });

  it("should throw an error for unsupported networks", async () => {
    await expect(getProviderForNetwork("unsupported")).rejects.toThrow("Network not supported: unsupported");
  });

  it("should handle transaction for a specific network", async () => {
    const handleTransactionForNetworkSpy = jest.spyOn(agent, "handleTransactionForNetwork");

    await handleTransactionForNetwork(mockTxEvent, "mainnet");

    expect(handleTransactionForNetworkSpy).toHaveBeenCalledWith(mockTxEvent, "mainnet");

    handleTransactionForNetworkSpy.mockRestore();
  });
});

import agent, { analyzeDonationFrequency } from "./agent";
// ...
describe("donation frequency analysis", () => {
  const mockTxEvent = createTransactionEvent({} as any);

  beforeAll(() => {
    // Set up mock donation data
    mockTxEvent.donationData = [
      { timestamp: 1000, amount: 100 },
      { timestamp: 2000, amount: 200 },
      { timestamp: 3000, amount: 300 },
    ];
  });

  it("should calculate donation frequency", async () => {
    const frequency = await analyzeDonationFrequency(mockTxEvent);

    expect(frequency).toEqual(3);
  });
});


    it("returns a finding if there is a Tether transfer over 10,000", async () => {
      const mockTetherTransferEvent = {
        args: {
          from: "0xabc",
          to: "0xdef",
          value: ethers.BigNumber.from("20000000000"), //20k with 6 decimals
        },
      };
      mockTxEvent.filterLog = jest
        .fn()
        .mockReturnValue([mockTetherTransferEvent]);

      const findings = await handleTransaction(mockTxEvent);

    
    });
  });
});
