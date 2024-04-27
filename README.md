# Getting Started with Multisig 

### How to Multisig (X/Y) existing account 

Using NEAR CLI run following command Y times with different PK_Y (Private Key of person who will confirm transactions), where `MULTISIG_ACCOUNT_ID.testnet` is the account you want to multisig:

```sh
near add-key MULTISIG_ACCOUNT_ID.testnet PK_Y --contract-id MULTISIG_ACCOUNT_ID.testnet --method-names "add_request" "add_request_and_confirm" "delete_request" "confirm"
```

---

Clone https://github.com/near/core-contracts and run following command, where X — number of confirmations, should be equal or less then Y:

```sh
cd core-contracts/multisig
near deploy --accountId MULTISIG_ACCOUNT_ID.testnet --wasmFile res/multisig.wasm --initFunction new --initArgs '{"num_confirmations": X}'
```

---

Verify that the account has correct set of keys:

```sh
near keys MULTISIG_ACCOUNT_ID.testnet
```

---

Delete all account's FullAccess keys:

```sh
near delete-key MULTISIG_ACCOUNT_ID.testnet FULL_ACCESS_PK
```

### How to send request

```sh
near call MULTISIG_ACCOUNT_ID.testnet add_request '{"request": {"receiver_id": "receiver.testnet", "actions": [{"type": "Transfer", "amount": "1000000000000000000000000"}]}} --accountId MULTISIG_ACCOUNT_ID.testnet'
```

### How to add/delete keys

```sh
near call MULTISIG_ACCOUNT_ID.testnet add_request '{"request": {"receiver_id": "MULTISIG_ACCOUNT_ID.testnet", "actions": [{"type": "AddKey", "public_key": "PK", "permission": { "allowance": null, "method_names": [ "add_request", "add_request_and_confirm", "delete_request", "confirm" ], "receiver_id": "MULTISIG_ACCOUNT_ID.testnet" }}]}}' --accountId MULTISIG_ACCOUNT_ID.testnet

near call MULTISIG_ACCOUNT_ID.testnet add_request '{"request": {"receiver_id": "MULTISIG_ACCOUNT_ID.testnet", "actions": [{"type": "DeleteKey", "public_key": "PK"}]}}' --accountId MULTISIG_ACCOUNT_ID.testnet

near call MULTISIG_ACCOUNT_ID.testnet add_request '{"request": {"receiver_id": "MULTISIG_ACCOUNT_ID.testnet", "actions": [{"type": "AddKey", "public_key": "PK"}]}}' --accountId MULTISIG_ACCOUNT_ID.testnet
```

### How to send FT token

```sh
near call MULTISIG_ACCOUNT_ID.testnet add_request_and_confirm '{"request": {"receiver_id": "FT_TOKEN.testnet", "actions": [{"type": "FunctionCall", "gas": "30000000000000", "method_name": "storage_deposit", "args": "eyJhY2NvdW50X2lkIjoiUkVDRUlWRVIudGVzdG5ldCIsInJlZ2lzdHJhdGlvbl9vbmx5Ijp0cnVlfQ==", "deposit": "1250000000000000000000" }, {"type": "FunctionCall", "gas": "15000000000000", "method_name": "ft_transfer", "args": "eyJhbW91bnQiOiIxMDAwMDAwMDAwMDAwMDAwMDAwIiwicmVjZWl2ZXJfaWQiOiJSRUNFSVZFUi50ZXN0bmV0In0=", "deposit": "1" }]}}' --gas=100000000000000 --accountId MULTISIG_ACCOUNT_ID.testnet
```
