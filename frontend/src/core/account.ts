import { FormInstance } from "antd";
import factoryAbi from "../abis/account_factory.json";
import accountAbi from "../abis/account.json";
import { chainSelectors, nativeTokenAddress, networks } from "./networks";
import { ethers } from "ethers";


export const getWriteContractConfig = (formValues: FormInstance<any>, chainId: number) => {
    return {
        address: networks[`${chainId}`].accountFactory,
        abi: factoryAbi,
        functionName: 'createAccount',
        args: [
            [
                formValues["onemes_name"] + ".onemes",
                formValues["email"],
                formValues["phone_number"],
                formValues["twitter"] ?? "",
                formValues["telegram"] ?? "",
                formValues["use_wallet_address_to_receive"] ?? true,
            ]
        ]
    }
}


export const getWithdrawConfig = (formValues: FormInstance<any>, accountAddress: string) => {
    const token = formValues["token"];
    if (token === nativeTokenAddress) {
        return {
            address: accountAddress,
            abi: accountAbi,
            functionName: 'withdraw',
            args: [
            ]
        }
    } else {
        return {
            address: accountAddress,
            abi: accountAbi,
            functionName: 'withdrawToken',
            args: [
                token
            ]
        }
    }

}


export const getTransferConfig = (formValues: FormInstance<any>, accountAddress: string, chainId: number) => {
    const selector = chainSelectors.filter(c => c.name === networks[chainId].name);
    return {
        address: accountAddress,
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