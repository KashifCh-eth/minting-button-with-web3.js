import React from "react";
import Web3 from "web3";
import { useNotification } from "web3uikit";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import { useState } from "react";
import { ABI, ContractAddress } from "../../web3Inject/test";

function Mint() {
  const [IsMinting, SetMinting] = useState(false);
  // const chainIdType = "0x38";
  const chainIdType = "0x13881";
  const dispatch = useNotification();

  const handleNewNotification = (DispatchType) => {
    if (DispatchType === "Success") {
      dispatch({
        type: DispatchType,
        message: "Minted! Check Your Opensea Account For CrownNFT!",
        title: "Successfully Minted!",
        position: "topR",
      });
    } else if (DispatchType === "error") {
      dispatch({
        type: DispatchType,
        message: "Sorry, something went wrong please try again later.",
        title: "transaction failed!",
        position: "topR",
      });
    }
  };
  const convert = require("ether-converter");
  const CostinWei = convert("0.033", "ether", "wei");

  async function loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
    }
  }

  async function loadContract() {
    let abi = ABI; // your abi here
    let address = ContractAddress; // your contract address here
    return await new window.web3.eth.Contract(abi, address);
  }
  async function getCurrentAccount() {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    return accounts[0];
  }

  async function run() {
    if (localStorage.getItem("provider")) {
      if (typeof window.ethereum == "undefined") {
        alert("please install MetaMask!! Or Use CrossPay Mint Method!");
      } else {
        if (chainIdType === window.ethereum.chainId) {
          try {
            SetMinting(true);
            await loadWeb3();
            window.contract = await loadContract();
            const account = await getCurrentAccount();
            let result = await window.contract.methods.CustomMint(1).send({
              gasLimit: "350000",
              to: ContractAddress,
              from: account,
              value: CostinWei,
            });
            if (result) {
              alert("Minted! Check Your Opensea Account For CrownNFT!");
              handleNewNotification("Success");
              SetMinting(false);
            }
            console.log(result);
          } catch (error) {
            console.log(error.message);
            handleNewNotification("error");
            SetMinting(false);
          }
        } else {
          alert("Please Connect BNB Chain ");
        }
      }
    } else {
      alert("Connect Wallet First!");
    }
  }

  return (
    <div>
      <div>
        {/* <button className="btn btn-success px-5 pe-5 m-2" onClick={MintCrown}>
            Mint
          </button> */}
        {IsMinting ? (
          <Button className="btn btn-success px-5 pe-5 m-2" disabled>
            <Spinner
              as="span"
              animation="grow"
              size="sm"
              role="status"
              aria-hidden="true"
            />
            Minting...
          </Button>
        ) : (
          <button className="btn btn-success px-5 pe-5 m-2" onClick={run}>
            Mint
          </button>
        )}
      </div>
    </div>
  );
}

export default Mint;
