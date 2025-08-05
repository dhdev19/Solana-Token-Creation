import json
import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from solders.keypair import Keypair
from solders.pubkey import Pubkey
from solana.rpc.api import Client
from spl.token.instructions import initialize_mint, get_associated_token_address, create_associated_token_account, mint_to, InitializeMintParams, MintToParams
from spl.token.constants import TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID
from solana.transaction import Transaction
import solders.system_program as sp
from spl.token._layouts import MINT_LAYOUT

# Set up the Solana connection - Use devnet for token creation
SOLANA_RPC_URL = os.environ.get("SOLANA_RPC_URL", "https://api.devnet.solana.com")
client = Client(SOLANA_RPC_URL)

app = Flask(__name__)
CORS(app)

@app.route('/')
def index():
    return "CoinLauncher Flask API is running."

@app.route('/health')
def health():
    return jsonify({"status": "healthy", "service": "coinlauncher-api"})

@app.route('/create-token', methods=['POST'])
def create_token():
    try:
        data = request.get_json()
        decimals = int(data['decimals'])
        wallet_address = data['wallet']  # Phantom wallet pubkey
        payer = Pubkey.from_string(wallet_address)

        # Generate a new mint keypair
        # This is the standard approach used by SPL token library
        mint = Keypair()
        mint_pubkey = mint.pubkey()

        # Build transaction instructions
        tx = Transaction()
        blockhash_response = client.get_latest_blockhash()
        recent_blockhash = blockhash_response.value.blockhash
        tx.recent_blockhash = recent_blockhash
        tx.fee_payer = payer

        # Calculate rent for mint account
        rent_response = client.get_minimum_balance_for_rent_exemption(MINT_LAYOUT.sizeof())
        balance_needed = rent_response.value

        # Add create account instruction
        tx.add(
            sp.create_account({
                "from_pubkey": payer,
                "to_pubkey": mint_pubkey,
                "lamports": balance_needed,
                "space": MINT_LAYOUT.sizeof(),
                "owner": TOKEN_PROGRAM_ID,
            })
        )

        # Add initialize mint instruction
        tx.add(
            initialize_mint(
                InitializeMintParams(
                    program_id=TOKEN_PROGRAM_ID,
                    mint=mint_pubkey,
                    decimals=decimals,
                    mint_authority=payer,
                    freeze_authority=None,
                )
            )
        )



        # Following the official Solana documentation exactly
        # For unsigned transactions, we must use serialize_message(), not serialize()
        # serialize() requires a fully signed transaction, which we don't have yet
        from base64 import b64encode
        tx_message = tx.serialize_message()  # Serialize the message, not the transaction
        tx_base64 = b64encode(tx_message).decode("utf-8")
        
        # Return the mint keypair's private key (base58 encoded) so frontend can sign it
        import base58
        # Get the full keypair bytes (64 bytes: 32 bytes secret + 32 bytes public key)
        keypair_bytes = bytes(mint.to_bytes_array())
        print(f"Keypair bytes length: {len(keypair_bytes)}")  # Debug print
        if len(keypair_bytes) != 64:
            raise ValueError(f"Invalid keypair length: {len(keypair_bytes)}, expected 64")
        mint_private_key = base58.b58encode(keypair_bytes).decode("utf-8")

        return jsonify({
            "success": True,
            "transaction": tx_base64,
            "mint": str(mint_pubkey),
            "mint_private_key": mint_private_key,
        })

    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500



@app.route('/mint-to-wallet', methods=['POST'])
def mint_to_wallet():
    try:
        data = request.get_json()
        mint = Pubkey.from_string(data['mint'])
        receiver = Pubkey.from_string(data['receiver'])
        amount = int(data['amount'])
        decimals = int(data['decimals'])

        # Get associated token account
        associated_token_account = get_associated_token_address(receiver, mint)

        # Build transaction instructions
        tx = Transaction()
        blockhash_response = client.get_latest_blockhash()
        recent_blockhash = blockhash_response.value.blockhash
        tx.recent_blockhash = recent_blockhash
        tx.fee_payer = receiver

        # Add create associated token account instruction (if needed)
        tx.add(
            create_associated_token_account(
                payer=receiver,
                owner=receiver,
                mint=mint,
            )
        )

        # Add mint to instruction
        tx.add(
            mint_to(
                MintToParams(
                    program_id=TOKEN_PROGRAM_ID,
                    mint=mint,
                    dest=associated_token_account,
                    mint_authority=receiver,
                    amount=amount * (10 ** decimals),
                    signers=[],
                )
            )
        )

        # Serialize for Phantom - For unsigned transactions, use serialize_message()
        from base64 import b64encode
        tx_message = tx.serialize_message()  # Serialize the message, not the transaction
        tx_base64 = b64encode(tx_message).decode("utf-8")

        return jsonify({
            "success": True,
            "transaction": tx_base64,
        })

    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    debug = os.environ.get("FLASK_ENV") == "development"
    app.run(host='0.0.0.0', port=port, debug=debug)
