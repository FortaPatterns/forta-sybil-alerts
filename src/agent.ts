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

async function analyzeDonationFrequency(
	txEvent: TransactionEvent
): Promise<number> {
	// Analyze donation frequency based on the transaction data
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

export default {
	// Add monitorGrantOwners to the export
	monitorGrantOwners,
	analyzeDonationFrequency,
	handleTransaction,
};
