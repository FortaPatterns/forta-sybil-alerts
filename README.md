# Sybil Detection Bot

## Description

This bot is designed to detect and mitigate sybil attacks on the Gitcoin platform by analyzing known sybil patterns and taking input from the community.

## Supported Chains

- Ethereum
- Polygon
- BSC
- Avalanche
- Arbitrum
- Optimism
- Fantom

## Getting Started

1. Clone the repository.
2. Install dependencies with `npm install`.
3. Configure environment variables and settings in the `.env` or `config` files as needed.

## Patterns

The bot detects sybil attacks using the following patterns:

1. Donation frequency
2. Transaction nounce
3. Used bridges and exchanges
4. Reports of sybil behavior

We also plan to integrated many more data sources in the near future.

## Alerts

- SYBIL-DETECTION-PATTERN-1

  - Fired when an account donates more than 10 times to a specific grant and has a trust score lower than 100.
  - Severity: "high"
  - Type: "suspicious"

- SYBIL-DETECTION-PATTERN-2

  - Fired when grant owners report sybil behavior.
  - Severity: "medium"
  - Type: "suspicious"

- SYBIL-DETECTION-PATTERN-3

  - Fired when the trending category is used by donors with a trust score less than 100.
  - Severity: "medium"
  - Type: "suspicious"

- SYBIL-DETECTION-PATTERN-4

  - Fired when the age and activity of a GitHub account associated with a donation is deemed suspicious.
  - Severity: "medium"
  - Type: "suspicious"

- SYBIL-DETECTION-PATTERN-5

  - Fired when a low reCAPTCHA score is detected for a transaction made from the Gitcoin platform.
  - Severity: "medium"
  - Type: "suspicious"

- SYBIL-DETECTION-REAL-TIME-FLAGGING
  - Fired based on real-time transaction patterns and input from the community and FDD team.
  - Severity: varies
  - Type: "suspicious"

## Testing

The bot includes a debug mode that enables you to scan for a specific token.
To activate this mode, you'll need to define the following variables prior to running the command:

```bash
$ DEBUG=1 TARGET_TOKEN="0x1234" npm run command...
```

By doing so, the bot will narrow its focus to the designated token, helping you troubleshoot any issues more
efficiently.

> It's important to note that when the bot is operating in debugging mode, it has been configured to restart scanning
> past transactions after every 10 blocks to ensure optimal performance. Consequently, if you need to scan a specific
> block that does not end with 0, you should round up the range accordingly.

#### SYBIL-DETECTION-PATTERN-1

The following command should detect a donation frequency pattern with account 0x1234567890abcdef:

```bash
$ npm run pattern1 0x1234567890abcdef
```

#### SYBIL-DETECTION-PATTERN-2

The following command should detect a sybil behavior report for grant 42:

```bash
$ npm run pattern2 42
```

#### SYBIL-DETECTION-PATTERN-3

The following command should detect usage of the trending category by donors with a trust score less than 100:

```bash
$ npm run pattern3
```

#### SYBIL-DETECTION-PATTERN-4

The following command should detect suspicious age and activity for a GitHub account associated with a donation:

```bash
$ npm run pattern4 github_username
```

#### SYBIL-DETECTION-PATTERN-5

The following command should detect a low reCAPTCHA score for a transaction made from the Gitcoin platform:

```bash
$ npm run pattern5 tx_hash
```

#### SYBIL-DETECTION-REAL-TIME-FLAGGING

The following command should detect real-time sybil flagging based on transaction patterns and input from the community and FDD team:

```bash
$ npm run realtime-flagging
```
