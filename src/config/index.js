import { ethers } from 'ethers';
import contracts from "./contracts.json"
import abiTHC from './abi/THCtoken.json'
import abiStaking from './abi/staking.json'

const rpc = process.env.REACT_APP_NETWORK_URL;
const chainid = process.env.REACT_APP_CHAIN_ID;
const addrs = contracts[chainid];

const provider = new ethers.providers.JsonRpcProvider(rpc);

const THCStakingContract = new ethers.Contract(addrs.staking.THC, abiStaking, provider);


export {
    provider,
    THCStakingContract
}