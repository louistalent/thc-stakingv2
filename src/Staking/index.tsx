import React, { useState, useEffect } from "react";
import "./index.scss";
import "../responsive.scss";
import { THCStakingContract } from "../config";
import {
  errHandler,
  tips,
  /* toValue, */ fromValue,
  fromBigNum,
} from "../util";
import { ethers } from "ethers";
import { Link, Outlet } from "react-router-dom";
import { useWallet } from "../hooks/useWallet";
import web3 from "web3";
import { useWebContext } from "../context";

interface IDOType {
  lockPeriod: number;
  apy: number;
  extendsLockOnRegistration: boolean;
  earlyUnstakeFee: number;
  unstakeFee: number;
  locked: boolean;
}
interface StakingStatus {
  ido: IDOType;
  balance: number;
  stakedAmount: number;
  THCTotalAmountToWallet: number;
  claimStatus: boolean;
}
const chainId_ = process.env.REACT_APP_CHAIN_ID;
const BNBDecimal = 8;
const Staking = () => {
  const [state, { dispatch }] = useWebContext();
  const [signedStakingContracts, setSignedStakingContracts] =
    useState(THCStakingContract);

  const [stakingBNB, setStakingBNB] = useState(100);
  const [THCTotalAmountToWallet, setTHCTotalAmountToWallet] = useState(0);
  const [MaxTHCTotalAmountToWallet, setMaxTHCTotalAmountToWallet] = useState(0);

  const [ready, setReady] = useState(false);
  const { connect, account, active, library, chainId } = useWallet();


  useEffect(() => {
    const setSignedContracts = async () => {
      try {
        const provider = new ethers.providers.Web3Provider(library.provider);
        const signer = await provider.getSigner();
        var signedStakingContracts = THCStakingContract.connect(signer);

        setSignedStakingContracts(signedStakingContracts);
        setReady(true);
      } catch (err) {
        errHandler(err);
      }
    };
    if (active) {
      setSignedContracts();
    }
  }, [account, chainId]);

  const getBalance = async () => {
    try {
      if (active) {
        var provider = new ethers.providers.Web3Provider(library.provider);
        const signer = provider.getSigner();
        var MyContract = THCStakingContract.connect(signer);
        // let tokenDecimals = (await MyContract.decimals()).toString();
        let balance = await MyContract.getContractBalance();
        let bigBal = fromBigNum(balance, BNBDecimal);
        console.log(bigBal);
        let BNBBalanceOfContract = Number(bigBal.toFixed(3));
        setStakingBNB(BNBBalanceOfContract);

      } else if (!active) {
        return tips("Please Connect Metamask Wallet");
      }
    } catch (err) {
      console.log("context : getBalance error", err);
      // toast.error("context : getBalance error", err);
    }
  };
  const getStakingInfo = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(library.provider);
      const signer = await provider.getSigner();
      var signedStakingContracts = THCStakingContract.connect(signer);

      var stakeDate = await signedStakingContracts.stakers(account);
      var nowTime = await signedStakingContracts.nowUnixTime();
      console.log("stakeDate : ");
      console.log(stakeDate);
      // console.log('nowTime', nowTime);
      // console.log('nowTime-', Number(nowTime));


    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!state.disconnect_able) {
    } else {
      getStakingInfo();
    }
  }, [state.disconnect_able]);

  useEffect(() => {
    getStakingInfo();
    getBalance();
  }, [account]);

  const handleStaking = async () => {
    try {
      if (chainId !== chainId_) return tips("Please change network to your wallet.");
      // if (MaxTHCTotalAmountToWallet === 0)
      //   return tips("Please enter the amount of THC you want to stake");
      // if (MaxTHCTotalAmountToWallet < 30000)
      //   return tips("Hi, you can't stake less than 30,000 THC");
      // if (MaxTHCTotalAmountToWallet > 15000000)
      //   return tips("Hey! You can't stake more than 15,000,000 THC");

      if (!active) return tips("Please connect your wallet");
      // if (loading) return tips("in progress")
      // setLoading(true);

      // THC token check on users wallet
      if (THCTotalAmountToWallet <= 0)
        return tips("Hi, You do not have enough THC Token to stake.");
      if (THCTotalAmountToWallet < MaxTHCTotalAmountToWallet)
        return tips("You have entered much amount than your wallet amount.");
      if (THCTotalAmountToWallet >= MaxTHCTotalAmountToWallet) {
        {
          // let tokenDecimals = (
          //   await signedTokenContracts.decimals()
          // ).toString();
          // let stakeAmount = ethers.utils.parseUnits(
          //   MaxTHCTotalAmountToWallet.toString(),
          //   tokenDecimals
          // );
          // var allowance = await signedTokenContracts.allowance(
          //   account,
          //   signedStakingContracts.address
          // );
          // if (allowance.toString() !== "0" && allowance < stakeAmount) {
          //   stakeAmount = allowance;
          // }
          // if (allowance < stakeAmount) {
          //   var tx = await signedTokenContracts.approve(
          //     signedStakingContracts.address,
          //     stakeAmount.sub(allowance)
          //   );
          //   if (tx != null) {
          //     await tx.wait();
          //   }
          // }

          // await staking(stakeAmount);
        }
      }
    } catch (err) {
      errHandler(err);
    }
    // setLoading(false);
  };

  const staking = async (stakeAmount: any) => {
    try {
      console.log("statusApp.ido.lockPeriod, stakeAmount");
      // console.log(statusApp.ido.lockPeriod, stakeAmount);
      // var tx = await signedStakingContracts.stake(
      //   statusApp.ido.lockPeriod,
      //   stakeAmount
      // );
      // if (tx != null) {
      //   await tx.wait();
      //   tips("Staking account created. Success!");
      //   // staking success
      //   getBalance();
      //   getStakingInfo();
      // }
    } catch (error) {
      console.log(error);
      errHandler(error);
    }
  };


  return (
    <section className="py-7 bg-hero" id="home">
      <div className="container">
        <div className="stake-panel">

          <div className="period-btn-group">
          </div>

          <div className="ido-list">
            <div className="list-item">
              <span>Staking Amount</span>
              <span>{stakingBNB} BNB</span>
            </div>
          </div>
          <div className={`panel-sm `}>
            <div className="amount-input-form">
              <div>
                Balance: {state.disconnect_able ? THCTotalAmountToWallet : 0}{" "}
                THC
              </div>
              <input
                className="input-amount"
                type="text"
                value={MaxTHCTotalAmountToWallet}
                onChange={(e) =>
                  setMaxTHCTotalAmountToWallet(Number(e.target.value))
                }
              />
            </div>

          </div>
          <div className={`panel-sm`}>
            <div className="create-btn-form">
              <button
                onClick={handleStaking}
                className={`btn btn-primary btn-block `}
              >
                Create Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Staking;
