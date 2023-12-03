import { Button, Card, Descriptions, Divider, Space } from "antd";
import { useAppSelector } from "src/controller/hooks";

export const Account = () => {
    const { selectedAccount, accounts } = useAppSelector(state => state.account);
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
            <Divider />
            <Space direction="vertical" style={{width: "100%"}}>
                {!(accounts.filter(a => a.chain === "mumbai").length) && <Button style={{ width: "100%" }} type="primary">New account on Polygon Mumbai</Button>}
                {!(accounts.filter(a => a.chain === "sepolia").length) && <Button style={{ width: "100%" }} type="primary">New account on Etherum Sepolia</Button>}
            </Space>

        </Card>
    )
}