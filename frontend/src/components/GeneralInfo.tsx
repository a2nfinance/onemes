import { DisconnectOutlined, LinkOutlined } from "@ant-design/icons";
import { Button, Flex, Select } from "antd";
import { useAppSelector } from "src/controller/hooks";
import { useAddress } from "src/hooks/useAddress";
import { useAccount, useDisconnect, useNetwork } from "wagmi";
import { Balance } from "./Balance";
export const GeneralInfo = () => {
    const { selectedAccount, accounts } = useAppSelector(state => state.account);
    const { address } = useAccount();
    const { chain } = useNetwork();
    const { disconnect } = useDisconnect()
    const { getShortAddress } = useAddress();
    const handleChangeChain = (chain) => {
        console.log(chain.value);
        // Set selected account here
    }
    return <>
        <Flex gap={5} align="center" justify="space-between">
            <Select value={"fuji"} size="small" onChange={handleChangeChain} options={
                accounts.map(a => ({ value: a.chain, label: a.chain.toUpperCase() }))
            } />
            <div><strong>{selectedAccount.onemes_name}</strong></div>
            <Button icon={<DisconnectOutlined />} onClick={() => disconnect()} title="disconnect"></Button>
        </Flex>
        <br />
        <Flex gap={5} align="center" vertical style={{ paddingTop: 40, paddingBottom: 40, borderRadius: 16, backgroundColor: "#1677FF", backgroundImage: "url('/wallet_background.jpg')" }}>
            <Button
                type="primary"
                icon={<LinkOutlined />}
                onClick={() => window.open(`${chain?.blockExplorers.default.url}/address/${accounts[0]?.onemes_account_address}`, "_blank")}>
                {getShortAddress(accounts[0]?.onemes_account_address)}
            </Button>
            {(chain?.id && address) ? <Balance address={selectedAccount.onemes_account_address} chainId={chain?.id} /> : <></>}
        </Flex>

        <br />
    </>
}