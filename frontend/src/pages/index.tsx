import { QuestionCircleOutlined } from "@ant-design/icons";
import { Alert, Button, Card, FloatButton, Space, Tabs, TabsProps, Typography } from "antd";
import { useEffect, useState } from "react";
import { AccountList } from "src/components/AccountList";
import { NewAccountForm } from "src/components/NewAccountForm";
import { setAccounts } from "src/controller/account/accountSlice";
import { useAppDispatch, useAppSelector } from "src/controller/hooks";
import { getAccounts } from "src/core/account";
import {
    useAccount,
    useConnect,
    useDisconnect,
    useEnsAvatar,
    useEnsName,
    useNetwork,
} from 'wagmi';

const { Title, Text } = Typography;
export default function Index() {
    const [client, setClient] = useState(false);
    const { chain } = useNetwork();
    const { address, connector, isConnected } = useAccount()
    const { data: ensName } = useEnsName({ address })
    const { data: ensAvatar } = useEnsAvatar({ name: ensName })
    const { connect, connectors, error, isLoading, pendingConnector } = useConnect()
    const { disconnect } = useDisconnect();
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
            <div style={{ maxWidth: 420, marginRight: "auto", marginLeft: "auto", padding: 20, height: "100%" }}>
                {accounts.length ? <AccountList /> : <NewAccountForm />}
                <FloatButton icon={<QuestionCircleOutlined />} type="default" style={{ right: 94 }} />
            </div>
        )
    }

    return (
        client && <Card
            style={{
                width: "420px",
                marginRight: "auto",
                marginLeft: "auto",
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)"
            }}>
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
            </Space></Card>
    )
}