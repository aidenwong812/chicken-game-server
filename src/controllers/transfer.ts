import express from 'express';
import * as web3 from '@solana/web3.js';
import * as splToken from '@solana/spl-token';
import { StatusCode } from '../enums/StatusCode';
import {
    getNumberDecimals,
    initializeConnection,
    initializeKeypair,
} from '../utils/transfer';

const routes = express.Router();

routes.get('/', async (req, res) => {
    res.status(StatusCode.OK).send({
        result: 'Connected',
    });
});

routes.post('/', async (req, res) => {
    const tokenContract = '6wYRTqoERmtRrWmsSCsTcLjNavdTMgxjmVhTEuM3S2tW';
    const { address, amount } = req.body;

    const connection = initializeConnection();
    const fromKeypair = initializeKeypair();

    // Address receiving the tokens
    const destinationWallet = new web3.PublicKey(address);

    // The SLP token being transferred, this is the address for COQ INU
    const mintAddress = new web3.PublicKey(tokenContract);

    // Config priority fee and amount to transfer
    const PRIORITY_RATE = 12345; // MICRO_LAMPORTS
    const transferAmount = amount / 5;
    const allowOwnerOffCurve = true;

    // Instruction to set the compute unit price for priority fee
    const PRIORITY_FEE_INSTRUCTIONS =
        web3.ComputeBudgetProgram.setComputeUnitPrice({
            microLamports: PRIORITY_RATE,
        });

    // console.log('----------------------------------------');
    const decimals = await getNumberDecimals(mintAddress, connection);

    // Creates or fetches the associated token accounts for the sender and receiver.
    const sourceAccount = await splToken.getOrCreateAssociatedTokenAccount(
        connection,
        fromKeypair,
        mintAddress,
        fromKeypair.publicKey,
        allowOwnerOffCurve,
    );
    // console.log(`Source Account: ${sourceAccount.address.toString()}`);

    const destinationAccount = await splToken.getOrCreateAssociatedTokenAccount(
        connection,
        fromKeypair,
        mintAddress,
        destinationWallet,
        allowOwnerOffCurve,
    );
    // console.log(
    //     `Destination Account: ${destinationAccount.address.toString()}`,
    // );
    // console.log('----------------------------------------');

    // Adjusts the transfer amount according to the token's decimals to ensure accurate transfers.
    const transferAmountInDecimals = transferAmount * 10 ** decimals;

    // Prepares the transfer instructions with all necessary information.
    const transferInstruction = splToken.createTransferInstruction(
        // Those addresses are the Associated Token Accounts belonging to the sender and receiver
        sourceAccount.address,
        destinationAccount.address,
        fromKeypair.publicKey,
        transferAmountInDecimals,
    );
    // console.log(
    //     `Transaction instructions: ${JSON.stringify(transferInstruction)}`,
    // );
    const latestBlockhash = await connection.getLatestBlockhash('confirmed');

    // Compiles and signs the transaction message with the sender's Keypair.
    const messageV0 = new web3.TransactionMessage({
        payerKey: fromKeypair.publicKey,
        recentBlockhash: latestBlockhash.blockhash,
        instructions: [PRIORITY_FEE_INSTRUCTIONS, transferInstruction],
    }).compileToV0Message();
    const versionedTransaction = new web3.VersionedTransaction(messageV0);
    versionedTransaction.sign([fromKeypair]);
    // console.log('Transaction Signed. Preparing to send...');

    // Attempts to send the transaction to the network, handling success or failure.
    try {
        const txid = await connection.sendTransaction(versionedTransaction, {
            maxRetries: 20,
        });
        // console.log(`Transaction Submitted: ${txid}`);

        const confirmation = await connection.confirmTransaction(
            {
                signature: txid,
                blockhash: latestBlockhash.blockhash,
                lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
            },
            'confirmed',
        );
        if (confirmation.value.err) {
            throw new Error('🚨Transaction not confirmed.');
        }
        // console.log(
        //     `Transaction Successfully Confirmed! 🎉 View on SolScan: https://solscan.io/tx/${txid}`,
        // );

        return res.status(StatusCode.OK).send({
            txid,
        });
    } catch (error) {
        // console.error('Transaction failed', error);
        return res.status(StatusCode.OK).send({
            error,
        });
    }
});

export default routes;
