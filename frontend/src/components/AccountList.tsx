import { Button, Card, Col, Descriptions, Divider, Row, Space } from "antd"
import { useAppSelector } from "src/controller/hooks"
import { useAddress } from "src/hooks/useAddress";
import { useAccount, useDisconnect, useNetwork } from "wagmi";

export const AccountList = () => {
    const { accounts } = useAppSelector(state => state.account);
    const { address } = useAccount();
    const {chain} = useNetwork();
    const { getShortAddress, getObjectExplorerURL } = useAddress();

    const { disconnect } = useDisconnect();
    return (
        <Card>
            <Descriptions layout="vertical" column={2}>
                <Descriptions.Item label="Frienly Name">
                    {accounts[0]?.onemes_name}
                </Descriptions.Item>
                <Descriptions.Item label="Email">
                    {accounts[0]?.email}
                </Descriptions.Item>
                <Descriptions.Item label="Phone number">
                    {accounts[0]?.phone_number}
                </Descriptions.Item>

                <Descriptions.Item label="Twitter">
                    {accounts[0]?.twitter ? accounts[0]?.twitter : "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Telegram">
                    {accounts[0]?.telegram ? accounts[0]?.telegram : "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="OneMes account">
                    <Button onClick={() => window.open(`${chain?.blockExplorers.default.url}/address/${accounts[0]?.onemes_account_address}`, "_blank")}>{getShortAddress(accounts[0]?.onemes_account_address)}</Button>
                </Descriptions.Item>
                <Descriptions.Item label="To receive token">
                    {accounts[0]?.use_wallet_address_to_receive ? "Use wallet address" : "Use OneMes account address"}
                </Descriptions.Item>
                <Descriptions.Item label="Connected">
                    <Button type="primary" onClick={() => disconnect()}>Disconnect</Button>
                </Descriptions.Item>
            </Descriptions>
            <Divider />
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
        </Card>
    )
}