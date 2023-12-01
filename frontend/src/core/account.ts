import { FormInstance } from "antd";
import abi from "../abis/account_factory.json";
import { networks } from "./networks";
import { ethers } from "ethers";


export const getWriteContractConfig = (formValues: FormInstance<any>, chainId: number) => {
    return {
        address: networks[`${chainId}`].accountFactory,
        abi: abi,
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

export const saveAccount = async (data: any, values: any, chainId: number) => {
    // const accountFactoryLog = data.logs.filter(l => l.address === networks[`${chainId}`].accountFactory)[0];
    const accountFactoryLog = data.logs[1];
    const contractInterface = new ethers.utils.Interface(abi);
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
    console.log(res.accounts);
    return res.accounts;
}