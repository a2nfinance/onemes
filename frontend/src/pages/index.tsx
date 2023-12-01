import { Button, Tabs, TabsProps } from "antd";
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
} from 'wagmi'
export default function Index() {
    const [client, setClient] = useState(false);
    const { address, connector, isConnected } = useAccount()
    const { data: ensName } = useEnsName({ address })
    const { data: ensAvatar } = useEnsAvatar({ name: ensName })
    const { connect, connectors, error, isLoading, pendingConnector } = useConnect()
    const { disconnect } = useDisconnect();
    const {accounts} = useAppSelector(state => state.account);
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

    async function getCurrentAccounts() {
        const accountsList = await getAccounts(address);
        dispatch(setAccounts(accountsList));
    }

    useEffect(() => {
        setClient(true);
        getCurrentAccounts();
    }, [])


    if (isConnected && client) {
        return (
            <>
                {/* <img src={ensAvatar} alt="ENS Avatar" />
                <div>{ensName ? `${ensName} (${address})` : address}</div>
                <div>Connected to {connector?.name}</div>
                <Button onClick={() => disconnect()}>Disconnect</Button> */}

                <div style={{ maxWidth: 550, marginRight: "auto", marginLeft: "auto", marginTop: 40, marginBottom: 40, padding: 20 }}>
                    <Tabs defaultActiveKey="1" items={items} onChange={() => { }} />
                </div>


            </>

        )
    }

    return (
        client && <div>
            {connectors.map((connector) => (
                <Button
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

            {error && <div>{error.message}</div>}
        </div>
    )
}