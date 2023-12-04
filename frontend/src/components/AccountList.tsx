import { Button, Card, Tabs, TabsProps } from "antd";
import { useState } from "react";
import { WalletStyle } from "src/styles/wallet";
import { useAccount, useNetwork } from "wagmi";
import { Account } from "./Account";
import { Actions } from "./Actions";
import { Activity } from "./Activity";
import { GeneralInfo } from "./GeneralInfo";
import { QRCodeGenerator } from "./QRCodeGenerator";
import { TokenList } from "./TokenList";


export const AccountList = () => {
    const { address } = useAccount();
    const { chain } = useNetwork();
    const [activeKey, setActiveKey] = useState("1");

    const items: TabsProps['items'] = [
        {
            key: '1',
            label: activeKey === "1" ? <Button type="primary">Tokens</Button> : <>Tokens</>,
            children: (address && chain?.id) ? <TokenList /> : <></>,
        },
        {
            key: '2',
            label:  activeKey === "2" ? <Button type="primary">Activity</Button> : "Activity",
            children: (address && chain?.id) ? <Activity address={address} /> : <></>,
        },
        {
            key: '3',
            label:  activeKey === "3" ? <Button type="primary">Account</Button>: "Account",
            children: <Account />
        },
        {
            key: '4',
            label:  activeKey === "4" ? <Button type="primary">QRCode</Button> : "QRCode",
            children: (address && chain?.id) ? <QRCodeGenerator  /> : <></>,
        }
    ];

    return (
        <Card style={WalletStyle}>
            <GeneralInfo />
            <Actions />
            <Tabs items={items} onChange={(activeKey) => setActiveKey(activeKey)} centered />
        </Card>
    )
}