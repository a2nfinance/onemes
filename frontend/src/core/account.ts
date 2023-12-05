import { FormInstance } from "antd";
import { ethers } from "ethers";
import { Account } from "src/controller/account/accountSlice";
import accountAbi from "../abis/account.json";
import factoryAbi from "../abis/account_factory.json";
import { chainIds, chainSelectors, nativeTokenAddress, networks } from "./networks";


export const getWriteContractConfig = (formValues: FormInstance<any>, chainId: number) => {
    let correctPhoneNumber = formValues["country"].split(" ")[0] + formValues["phone_number"];
    return {
        address: networks[`${chainId}`].accountFactory,
        abi: factoryAbi,
        functionName: 'createAccount',
        args: [
            [
                formValues["onemes_name"] + ".onemes",
                formValues["email"],
                correctPhoneNumber,
                formValues["twitter"] ?? "",
                formValues["telegram"] ?? "",
                formValues["use_wallet_address_to_receive"] ?? true,
            ]
        ]
    }
}

export const getExpandAccountConfig = (selectedAccount: Account, chainId: number) => {
    return {
        chainId: chainId,
        address: networks[`${chainId}`].accountFactory,
        abi: factoryAbi,
        functionName: 'createAccount',
        args: [
            [
                selectedAccount.onemes_name,
                selectedAccount.email,
                selectedAccount.phone_number,
                selectedAccount.twitter ?? "",
                selectedAccount.telegram ?? "",
                selectedAccount.use_wallet_address_to_receive ?? true,
            ]
        ]
    }
}

export const getWithdrawConfig = (formValues: FormInstance<any>, selectedAccount: Account) => {
    const token = formValues["token"];
    if (token === nativeTokenAddress) {
        return {
            chainId: chainIds[selectedAccount.chain],
            address: selectedAccount.onemes_account_address,
            abi: accountAbi,
            functionName: 'withdraw',
            args: [
            ]
        }
    } else {
        return {
            chainId: chainIds[selectedAccount.chain],
            address: selectedAccount.wallet_address,
            abi: accountAbi,
            functionName: 'withdrawToken',
            args: [
                token
            ]
        }
    }

}


export const getTransferConfig = (formValues: FormInstance<any>, selectedAccount: Account) => {
    const selector = chainSelectors.filter(c => c.name === selectedAccount.chain);
    return {
        chainId: chainIds[selectedAccount.chain],
        address: selectedAccount.onemes_account_address,
        abi: accountAbi,
        functionName: 'transferTokensPayLink',
        args: [
            formValues["receiver"],
            formValues["token"],
            ethers.utils.parseUnits(formValues["amount"], "18"),
            (selector.length && selector[0].chainSelector === formValues["chain"])
                ? ethers.BigNumber.from("0")
                : ethers.BigNumber.from(formValues["chain"])
        ]
    }

}


export const getUpdateConfig = (formValues: FormInstance<any>, selectedAccount: Account) => {
    let correctPhoneNumber = formValues["country"].split(" ")[0] + formValues["phone_number"];
    return {
        chainId: chainIds[selectedAccount.chain],
        address: selectedAccount.onemes_account_address,
        abi: accountAbi,
        functionName: 'updateGeneralInfo',
        args: [
            [
                selectedAccount["onemes_name"],
                formValues["email"],
                correctPhoneNumber,
                formValues["twitter"] ?? "",
                formValues["telegram"] ?? "",
                formValues["use_wallet_address_to_receive"] ?? true,
            ]
        ]
    }

}


export const saveAccount = async (data: any, values: any, chainId: number) => {
    // const accountFactoryLog = data.logs.filter(l => l.address === networks[`${chainId}`].accountFactory)[0];
    const accountFactoryLog = data.logs[1];
    const contractInterface = new ethers.utils.Interface(factoryAbi);
    const parsedLog = contractInterface.parseLog(accountFactoryLog);
    const accountAddress = parsedLog.args[1];
    let correctPhoneNumber = values["country"].split(" ")[0] + values["phone_number"];
    values = {
        ...values,
        chain: networks[`${chainId}`].name,
        phone_number: correctPhoneNumber,
        onemes_name: values["onemes_name"] + ".onemes",
        onemes_account_address: accountAddress
    };
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/account/save`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(values)
    })
}

export const expandNewAccount = async (data: any, selectedAccount: Account, chainId: number) => {
    const accountFactoryLog = data.logs[1];
    const contractInterface = new ethers.utils.Interface(factoryAbi);
    const parsedLog = contractInterface.parseLog(accountFactoryLog);
    const accountAddress = parsedLog.args[1];
    let values = {
        ...selectedAccount,
        chain: networks[`${chainId}`].name,
        onemes_account_address: accountAddress
    };

    delete values._id;
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/account/save`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(values)
    })
}


export const updateAccount = async (formValues: FormInstance<any>, selectedAccount: Account) => {
    let correctPhoneNumber = formValues["country"].split(" ")[0] + formValues["phone_number"];
    let correctValues = {
        ...formValues,
        _id: selectedAccount._id,
        phone_number: correctPhoneNumber,
    };
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/account/update`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(correctValues)
    })
}


export const getAccounts = async (walletAddress: string) => {
    console.log(walletAddress);
    const req = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/account/get-accounts`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ walletAddress: walletAddress })
    });

    const res = await req.json();
    return res.accounts;
}


