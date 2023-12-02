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


export const AccountList = () => {
    const { address } = useAccount();
    const { chain } = useNetwork();

    const items: TabsProps['items'] = [
        {
            key: '1',
            label: `Tokens`,
            children: (address && chain?.id) ? <TokenList address={address} chainId={chain?.id} /> : <></>,
        },
        {
            key: '2',
            label: `Activity`,
            children: (address && chain?.id) ? <Activity address={address} chainId={chain?.id} /> : <></>,
        },
        {
            key: '3',
            label: `Account`,
            children: <Account />
        },
    ];

    return (
        <Card>
            <GeneralInfo />
            <Row gutter={8}>
                <Col span="8">
                    <Button style={{ width: "100%" }} type="primary">Withdraw</Button>
                </Col>
                <Col span="8">
                    <Button style={{ width: "100%" }} type="primary">Send</Button>
                </Col>

                <Col span="8">
                    <Button style={{ width: "100%" }} type="primary">Update account</Button>
                </Col>


            </Row>
            <Tabs items={items} />
        </Card>
    )
}