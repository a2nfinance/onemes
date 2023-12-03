import { Button, Card, Col, Descriptions, Divider, Flex, Row, Select, Space, Tabs, TabsProps } from "antd"
import { useAppSelector } from "src/controller/hooks"
import { useAddress } from "src/hooks/useAddress";
import { useAccount, useDisconnect, useNetwork } from "wagmi";
import { Account } from "./Account";
import { TokenList } from "./TokenList";
import { Balance } from "./Balance";
import { setSelectedAccount } from "src/controller/account/accountSlice";
import { GeneralInfo } from "./GeneralInfo";
import { Activity } from "./Activity";
import { Actions } from "./Actions";
import { QRCodeGenerator } from "./QRCodeGenerator";
import { WalletStyle } from "src/styles/wallet";
import { useState } from "react";


export const AccountList = () => {
    const { address } = useAccount();
    const { chain } = useNetwork();
    const [activeKey, setActiveKey] = useState("1");

    const items: TabsProps['items'] = [
        {
            key: '1',
            label: activeKey === "1" ? <Button type="primary">Tokens</Button> : <>Tokens</>,
            children: (address && chain?.id) ? <TokenList chainId={chain?.id} /> : <></>,
        },
        {
            key: '2',
            label:  activeKey === "2" ? <Button type="primary">Activity</Button> : "Activity",
            children: (address && chain?.id) ? <Activity address={address} chainId={chain?.id} /> : <></>,
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