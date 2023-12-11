import { Alert, Button, Card, Space, TabsProps, Typography } from "antd";
import { useEffect, useState } from "react";
import { AccountList } from "src/components/AccountList";
import { ExtraButtons } from "src/components/ExtraButtons";
import { NewAccountForm } from "src/components/NewAccountForm";
import { setAccounts } from "src/controller/account/accountSlice";
import { useAppDispatch, useAppSelector } from "src/controller/hooks";
import { getAccounts } from "src/core/account";
import { ConnectWalletStyle } from "src/styles/wallet";
import {
    useAccount,
    useConnect,
} from 'wagmi';

const { Title, Text } = Typography;
export default function Index() {
    const [client, setClient] = useState(false);
    const { address, isConnected } = useAccount()
    const { connect, connectors, error, isLoading, pendingConnector } = useConnect()
    const { accounts } = useAppSelector(state => state.account);
    const dispatch = useAppDispatch();

    const items: TabsProps['items'] = [
        {
            key: '1',
            label: `Account`,
            children: accounts.length ? <AccountList /> : <NewAccountForm />,
        },
        {
            key: '5',
            label: `Transactions`,
            children: <></>
        }
    ];

    async function getCurrentAccounts(address) {
        const accountsList = await getAccounts(address);
        dispatch(setAccounts(accountsList));
    }

    useEffect(() => {
        setClient(true);
        getCurrentAccounts(address);
    }, [address])


    if (isConnected && client) {
        return (
            <>

                <Alert style={{ borderRadius: 0, border: 0 }} type="info" message={
                    accounts.length ? <Text>
                        OneMes is accessible on <b>Ethereum Sepolia, Polygon Mumbai, and Avalanche Fuji testnets.</b> Ensure your account contract is funded with native tokens to cover gas fees.
                        For <b>testing crosschain transfers</b>, fund your account contract with <a href="https://faucets.chain.link/fuji" target="blank">Link tokens</a> and the corresponding supported crosschain chain tokens <a href="https://docs.chain.link/ccip/test-tokens#mint-tokens-in-the-documentation" target="_blank">CCIP-BnM.</a>.
                        Initiate token transfers by sending a message to either the designated phone number <i>({process.env.NEXT_PUBLIC_TWILIO_GLOBAL_NUMBER})</i> or <a href="http://t.me/Onemes_a2n_bot" target="_blank">Telegram chatbot</a>.
                    </Text> :
                        <Text>
                            If you don't have a OneMes account yet, kindly create a new one. Your account will be on <b>the Avalanche Fuji testnet</b> initially. Prior to submission, please <b>double-check your information</b> to ensure accurate token transfers during the testing phase.
                        </Text>
                } />

                <div style={{ maxWidth: 420, marginRight: "auto", marginLeft: "auto", padding: 20, height: "100%" }}>
                    {accounts.length ? <AccountList /> : <NewAccountForm />}
                    <ExtraButtons />
                </div>
            </>

        )
    }

    return (
        client && <>
            <Alert style={{ borderRadius: 0, border: 0, textAlign: "center" }} type="info" message={
                <Text>
                    Welcome to OneMes! Connect your wallet and establish a OneMes account to <b>seamlessly transfer tokens online or offline</b>. Utilize <b>SMS or our Telegram chatbot</b> for hassle-free token transfers.
                </Text>
            } />
            <Card
                //@ts-ignore
                style={ConnectWalletStyle}>
                <Space direction="vertical" style={{ width: "100%", textAlign: "center" }}>
                    <Title level={3}>ONE MES</Title>
                    <Text>Instant Token Transfers with Just One Message: Simplifying Crypto Transactions, Anywhere, Anytime!</Text>
                    {connectors.map((connector) => (
                        <Button
                            style={{ width: "100%" }}
                            size="large"
                            type="primary"
                            disabled={!connector.ready}
                            key={connector.id}
                            loading={isLoading &&
                                connector.id === pendingConnector?.id}
                            onClick={() => connect({ connector })}
                        >
                            {!connector?.ready ? `${connector?.name} (unsupported)` : connector?.name}
                        </Button>
                    ))}

                    {error && <Alert type="error" message={error.message} showIcon />}
                </Space>
            </Card>
        </>
    )
}