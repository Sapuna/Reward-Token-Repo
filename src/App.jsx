import { useState, useEffect } from "react";
import { ethers } from "ethers";
import "./App.css";
import abi from "./contracts/SapunaToken.json";

const contract_ABI = abi.abi;
const contract_address = "0x639A2E0f4B856637f114B506dCaC4e583Df4296A";

function App() {
  const [contractAPI, setContractAPI] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [address, setAddress] = useState(null);
  const [balance, setBalance] = useState(0);
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState(0);
  const [tokenName, setTokenName] = useState("");
  const [tokenDescription, setTokenDescription] = useState("");
  const [symbol, setSymbol] = useState("");
  const [loading, setLoading] = useState(false); // Loading state

  useEffect(() => {
    const connectWallet = async () => {
      let providerInstance;

      if (window.ethereum == null) {
        console.log("MetaMask not installed; using read-only defaults");
        providerInstance = ethers.getDefaultProvider();
      } else {
        providerInstance = new ethers.BrowserProvider(window.ethereum);
        try {
          const signerInstance = await providerInstance.getSigner();
          setSigner(signerInstance);
          setAddress(await signerInstance.getAddress());
        } catch (error) {
          console.error(error);
        }

        const contract_api = new ethers.Contract(contract_address, contract_ABI, providerInstance);
        setContractAPI(contract_api);
      }

      setProvider(providerInstance);
    };

    window.ethereum?.on("accountsChanged", () => {
      window.location.reload();
    });

    connectWallet();
  }, []);

  const fetchTokenDetail = async () => {
    if (contractAPI && address) {
      try {
        const _tokenName = await contractAPI.name();
        setTokenName(_tokenName);
        const bal = await contractAPI.balanceOf(address);
        setBalance(ethers.formatEther(bal));
        const tokenSymbol = await contractAPI.symbol();
        setSymbol(tokenSymbol);
      } catch (error) {
        console.error(error);
      }
    }
  };

  useEffect(() => {
    fetchTokenDetail();
  }, [contractAPI, address]);

  const transferToken = async () => {
    if (contractAPI && address && recipient && amount) {
      try {
        setLoading(true);
        const decimals = await contractAPI.decimals();
        const amountInUnits = ethers.parseUnits(amount.toString(), decimals);
        const tx = await contractAPI.connect(signer).transfer(recipient, amountInUnits);
        await tx.wait();
        fetchTokenDetail(); // Update token details after transfer
      } catch (error) {
        console.error("Error during token transfer:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div id="root">
      <div className="card">
        <div className="card-content">
          <h2>Token Information</h2>
          <div className="token-details">
            <p><strong>Connected Wallet:</strong> {address || "Not connected"}</p>
            <p><strong>Token Name:</strong> {tokenName}</p>
            <p><strong>Token Symbol:</strong> {symbol}</p>
            <p className="balance"><strong>Balance:</strong> {balance}</p>
          </div>
        </div>
        <div className="transfer-container">
          <input
            type="text"
            placeholder="Recipient Address"
            className="address-input"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
          />
          <input
            type="number"
            placeholder="Amount"
            className="amount-input"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <button
            className="transfer-button"
            onClick={transferToken}
            disabled={loading}
          >
            {loading ? "Processing..." : "Transfer"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
