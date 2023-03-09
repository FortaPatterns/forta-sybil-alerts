import {
	BlockEvent,
	Finding,
	Initialize,
	HandleBlock,
	HandleTransaction,
	HandleAlert,
	AlertEvent,
	TransactionEvent,
	FindingSeverity,
	FindingType,
} from "forta-agent";
import { IS_DEVELOPMENT, IS_DEBUG, DEBUG_TARGET_TOKEN } from "./contants";
import { readFileSync } from "fs";

const CONFIG_FILE = "config.json";
const config = JSON.parse(readFileSync(CONFIG_FILE, "utf-8"));

const donationFrequency: Record<string, number> = {};

async function analyzeDonationFrequency(
	txEvent: TransactionEvent
): Promise<void> {
	// Example: Assuming the transaction event object has a donation property
	const donation = txEvent.donation;
	const from = txEvent.from.toLowerCase();

	if (donation) {
		if (!donationFrequency[from]) {
			donationFrequency[from] = 0;
		}
		donationFrequency[from]++;

		console.log(
			`Updated donation frequency for ${from}: ${donationFrequency[from]}`
		);
	}
}

interface FundingRound {
	id: string;
	startDate: Date;
	endDate: Date;
	totalFunds: number;
}

const fundingRounds: Record<string, FundingRound> = {
	// Fill this object with funding round data
};

async function analyzeFundingRound(txEvent: TransactionEvent): Promise<void> {
	// Example: Assuming the transaction event object has a fundingRoundId property
	const fundingRoundId = txEvent.fundingRoundId;

	if (fundingRoundId) {
		const fundingRound = fundingRounds[fundingRoundId];

		if (fundingRound) {
			console.log(
				`Funding round ${fundingRoundId} details: ${JSON.stringify(
					fundingRound
				)}`
			);
		}
	}
}

export const ERC20_TRANSFER_EVENT =
	"event Transfer(address indexed from, address indexed to, uint256 value)";
export const TETHER_ADDRESS = "0xdAC17F958D2ee523a2206206994597C13D831ec7";
export const TETHER_DECIMALS = 6;
let findingsCount = 0;

let TICK_INTERVAL = 4 * 60 * 60; // 4h

if (IS_DEBUG) {
	Logger.debug(`Debug mode enabled. Target contract: ${DEBUG_TARGET_TOKEN}`);
	TICK_INTERVAL = 0;
}

const handleTransaction: HandleTransaction = async (
	txEvent: TransactionEvent
) => {
	const findings: Finding[] = [];

	// limiting this agent to emit only 5 findings so that the alert feed is not spammed
	if (findingsCount >= 5) return findings;

	// filter the transaction logs for Tether transfer events
	const tetherTransferEvents = txEvent.filterLog(
		ERC20_TRANSFER_EVENT,
		TETHER_ADDRESS
	);

	tetherTransferEvents.forEach((transferEvent) => {
		// extract transfer event arguments
		const { to, from, value } = transferEvent.args;
		// shift decimals of transfer value
		const normalizedValue = value.div(10 ** TETHER_DECIMALS);

		// if more than 10,000 Tether were transferred, report it
		if (normalizedValue.gt(10000)) {
			findings.push(
				Finding.fromObject({
					name: "High Tether Transfer",
					description: `High amount of USDT transferred: ${normalizedValue}`,
					alertId: "FORTA-1",
					severity: FindingSeverity.Low,
					type: FindingType.Info,
					metadata: {
						to,
						from,
					},
				})
			);
			findingsCount++;
		}
	});

	return findings;
};

const grantOwners: Set<string> = new Set([
	// Add the list of grant owners' addresses here
]);

async function monitorGrantOwners(txEvent: TransactionEvent): Promise<void> {
	const from = txEvent.from.toLowerCase();

	if (grantOwners.has(from)) {
		console.log(`Grant owner activity detected from address: ${from}`);
	}
}

const categories: Record<string, number> = {};

async function trackTrendingCategories(
	txEvent: TransactionEvent
): Promise<void> {
	// Example: Assuming the transaction event object has a category property
	const category = txEvent.category;

	if (category) {
		if (!categories[category]) {
			categories[category] = 0;
		}
		categories[category]++;

		console.log(`Updated trending categories: ${JSON.stringify(categories)}`);
	}
}

async function flagPotentialSybil(txEvent: TransactionEvent): Promise<void> {
	// Example: Assuming the transaction event object has an isSybil property
	const isSybil = txEvent.isSybil;

	if (isSybil) {
		console.log(
			`Potential Sybil attack detected in transaction: ${txEvent.transaction.hash}`
		);
	}
}

// const initialize: Initialize = async () => {
//   // do some initialization on startup e.g. fetch data
// }

// const handleBlock: HandleBlock = async (blockEvent: BlockEvent) => {
//   const findings: Finding[] = [];
//   // detect some block condition
//   return findings;
// }

// const handleAlert: HandleAlert = async (alertEvent: AlertEvent) => {
//   const findings: Finding[] = [];
//   // detect some alert condition
//   return findings;
// }

import { ethers } from "ethers";

interface NetworkConfig {
	name: string;
	rpcUrl: string;
	chainId: number;
}

const networks: Record<string, NetworkConfig> = {
	mainnet: {
		name: "mainnet",
		rpcUrl: "https://mainnet.infura.io/v3/YOUR-PROJECT-ID",
		chainId: 1,
	},
	rinkeby: {
		name: "rinkeby",
		rpcUrl: "https://rinkeby.infura.io/v3/YOUR-PROJECT-ID",
		chainId: 4,
	},
	// Add more networks if needed
};

async function getProviderForNetwork(
	network: string
): Promise<ethers.providers.JsonRpcProvider> {
	const networkConfig = networks[network];

	if (!networkConfig) {
		throw new Error(`Network not supported: ${network}`);
	}

	return new ethers.providers.JsonRpcProvider(
		networkConfig.rpcUrl,
		networkConfig.chainId
	);
}

async function handleTransactionForNetwork(
	txEvent: TransactionEvent,
	network: string
): Promise<void> {
	const provider = await getProviderForNetwork(network);

	// Perform network-specific transaction handling using the provider
}
import { ethers } from "ethers";

interface NetworkConfig {
	name: string;
	rpcUrl: string;
	chainId: number;
}

const networks: Record<string, NetworkConfig> = {
	mainnet: {
		name: "mainnet",
		rpcUrl: "https://mainnet.infura.io/v3/YOUR-PROJECT-ID",
		chainId: 1,
	},
	rinkeby: {
		name: "rinkeby",
		rpcUrl: "https://rinkeby.infura.io/v3/YOUR-PROJECT-ID",
		chainId: 4,
	},
	// Add more networks if needed
};

async function getProviderForNetwork(
	network: string
): Promise<ethers.providers.JsonRpcProvider> {
	const networkConfig = networks[network];

	if (!networkConfig) {
		throw new Error(`Network not supported: ${network}`);
	}

	return new ethers.providers.JsonRpcProvider(
		networkConfig.rpcUrl,
		networkConfig.chainId
	);
}

async function handleTransactionForNetwork(
	txEvent: TransactionEvent,
	network: string
): Promise<void> {
	const provider = await getProviderForNetwork(network);

	// Perform network-specific transaction handling using the provider
}

import { ethers } from 'ethers';

interface NetworkConfig {
  name: string;
  rpcUrl: string;
  chainId: number;
}

const networks: Record<string, NetworkConfig> = {
  mainnet: {
    name: 'mainnet',
    rpcUrl: 'https://mainnet.infura.io/v3/YOUR-PROJECT-ID',
    chainId: 1,
  },
  rinkeby: {
    name: 'rinkeby',
    rpcUrl: 'https://rinkeby.infura.io/v3/YOUR-PROJECT-ID',
    chainId: 4,
  },
  // Add more networks if needed
};

async function getProviderForNetwork(network: string): Promise<ethers.providers.JsonRpcProvider> {
  const networkConfig = networks[network];

  if (!networkConfig) {
    throw new Error(`Network not supported: ${network}`);
  }

  return new ethers.providers.JsonRpcProvider(networkConfig.rpcUrl, networkConfig.chainId);
}

async function handleTransactionForNetwork(txEvent: TransactionEvent, network: string): Promise<void> {
  const provider = await getProviderForNetwork(network);

  // Perform network-specific transaction handling using the provider
}


export default {
	// Add monitorGrantOwners to the export
	monitorGrantOwners,
	analyzeDonationFrequency,
	handleTransaction,
};
