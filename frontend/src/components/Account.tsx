import { Button, Card, Descriptions, Divider, Form, Space } from "antd";
import { useAppDispatch, useAppSelector } from "src/controller/hooks";
import { useState, useCallback } from "react";
import { expandNewAccount, getAccounts, getExpandAccountConfig, getWriteContractConfig, saveAccount } from "src/core/account";
import { prepareWriteContract, writeContract, waitForTransaction, switchNetwork } from "@wagmi/core"
import { setAccounts } from "src/controller/account/accountSlice";
import { chainIds } from "src/core/networks";
import { useNetwork } from "wagmi";
export const Account = () => {
    const { selectedAccount, accounts } = useAppSelector(state => state.account);
    const [form] = Form.useForm();
    const { chain } = useNetwork();

    const [isCreating, setIsCreating] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const dispatch = useAppDispatch();

    const onFinish = useCallback(async (chainId: number) => {
        try {
            setErrorMessage("");
            setIsCreating(true);
            if (chain?.id !== chainId) {
                await switchNetwork({ chainId: chainId });
            }
            const config = getExpandAccountConfig(selectedAccount, chainId);
            const { request } = await prepareWriteContract(config)
            const data = await writeContract(request)
            const returnedData = await waitForTransaction({
                hash: data.hash,
            })
            console.log(returnedData);
            await expandNewAccount(returnedData, selectedAccount, chainId);
            const accountsList = await getAccounts(selectedAccount.wallet_address);
            dispatch(setAccounts(accountsList));
        } catch (e) {
            console.log(e);
            setErrorMessage(e.message);
        }

        setIsCreating(false);

    }, []);
    return (
        <Card>
            <Descriptions layout="vertical" column={2}>
                <Descriptions.Item label="Alias">
                    {selectedAccount?.onemes_name}
                </Descriptions.Item>
                <Descriptions.Item label="Email">
                    {selectedAccount?.email}
                </Descriptions.Item>
                <Descriptions.Item label="Phone number">
                    {selectedAccount?.phone_number}
                </Descriptions.Item>

                <Descriptions.Item label="Twitter">
                    {selectedAccount?.twitter ? selectedAccount?.twitter : "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Telegram">
                    {selectedAccount?.telegram ? selectedAccount?.telegram : "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="To receive token">
                    {selectedAccount?.use_wallet_address_to_receive ? "Use wallet address" : "Use OneMes account address"}
                </Descriptions.Item>
            </Descriptions>
            {

                accounts.length !== 3 && <>
                    <Divider />
                    <Space direction="vertical" style={{ width: "100%" }}>
                        {
                            !(accounts.filter(a => a.chain === "mumbai").length)
                            && <Button style={{ width: "100%" }} type="primary" loading={isCreating} onClick={() => onFinish(chainIds["mumbai"])}>New account on Polygon Mumbai</Button>
                        }
                        {
                            !(accounts.filter(a => a.chain === "sepolia").length) &&
                            <Button style={{ width: "100%" }} type="primary" loading={isCreating} onClick={() => onFinish(chainIds["sepolia"])}>New account on Etherum Sepolia</Button>
                        }
                    </Space>
                </>
            }


        </Card>
    )
}