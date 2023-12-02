import { Descriptions } from "antd";
import { useAppSelector } from "src/controller/hooks";

export const Account = () => {
    const { selectedAccount } = useAppSelector(state => state.account);
    return (
        <Descriptions layout="vertical" column={2}>
                <Descriptions.Item label="Frienly Name">
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
    )
}