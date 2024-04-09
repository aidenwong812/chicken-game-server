import express from 'express';
import * as web3 from "@solana/web3.js";
import * as splToken from "@solana/spl-token";
import { StatusCode } from '../enums/StatusCode';

const routes = express.Router();

routes.post('/', async (req, res) => {
  const privateKey = process.env.ADMIN_WALLET;
  const { address, amount } = req.body;

  // Connect to cluster
  var connection = new web3.Connection(web3.clusterApiUrl("devnet"));
  // Construct wallet keypairs
  var fromWallet = web3.Keypair.fromSecretKey(DEMO_WALLET_SECRET_KEY);
  var toWallet = web3.Keypair.generate();
  // Construct my token class
  var myMint = new web3.PublicKey("My Mint Public Address");
  var myToken = new splToken.Token(
    connection,
    myMint,
    splToken.TOKEN_PROGRAM_ID,
    fromWallet
  );
  // Create associated token accounts for my token if they don't exist yet
  var fromTokenAccount = await myToken.getOrCreateAssociatedAccountInfo(
    fromWallet.publicKey
  )
  var toTokenAccount = await myToken.getOrCreateAssociatedAccountInfo(
    toWallet.publicKey
  )
  // Add token transfer instructions to transaction
  var transaction = new web3.Transaction()
    .add(
      splToken.Token.createTransferInstruction(
        splToken.TOKEN_PROGRAM_ID,
        fromTokenAccount.address,
        toTokenAccount.address,
        fromWallet.publicKey,
        [],
        0
      )
    );
  // Sign transaction, broadcast, and confirm
  var signature = await web3.sendAndConfirmTransaction(
    connection,
    transaction,
    [fromWallet]
  );
  console.log("SIGNATURE", signature);
  console.log("SUCCESS");
});

export default routes;
