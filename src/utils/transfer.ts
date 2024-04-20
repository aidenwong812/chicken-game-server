import * as web3 from '@solana/web3.js';
import * as bs58 from 'bs58';

export async function getNumberDecimals(
    mintAddress: web3.PublicKey,
    connection: web3.Connection,
): Promise<number> {
    const info = await connection.getParsedAccountInfo(mintAddress);
    const decimals = (info.value?.data as web3.ParsedAccountData).parsed.info
        .decimals as number;
    console.log(`Token Decimals: ${decimals}`);
    return decimals;
}

// Initializes a Keypair from the secret key stored in environment variables. Essential for signing transactions.
export function initializeKeypair(): web3.Keypair {
    const privateKey = new Uint8Array(bs58.decode(process.env.ADMIN_WALLET!));
    const keypair = web3.Keypair.fromSecretKey(privateKey);
    console.log(
        `Initialized Keypair: Public Key - ${keypair.publicKey.toString()}`,
    );
    return keypair;
}

// Sets up the connection to the Solana cluster, utilizing environment variables for configuration.
export function initializeConnection(): web3.Connection {
    const rpcUrl = 'https://api.mainnet-beta.solana.com';
    const connection = new web3.Connection(rpcUrl, {
        commitment: 'confirmed',
        wsEndpoint: 'wss://api.mainnet-beta.solana.com',
    });
    // Redacting part of the RPC URL for security/log clarity
    console.log(`Initialized Connection to Solana RPC: ${rpcUrl.slice(0, -32)}`);
    return connection;
}
