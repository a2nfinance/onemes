import { Button, Divider, Flex, Select } from "antd";
import { useAppSelector } from "src/controller/hooks"
import { DisconnectOutlined } from "@ant-design/icons";
import { useAccount, useNetwork } from "wagmi";
import { Balance } from "./Balance";
import { useAddress } from "src/hooks/useAddress";
export const GeneralInfo = () => {
    const { selectedAccount, accounts } = useAppSelector(state => state.account);
    const { address } = useAccount();
    const { chain } = useNetwork();
    const { getShortAddress } = useAddress();
    const handleChangeChain = (chain) => {
        console.log(chain.value);
    }
    return <>
        <Flex gap={5} align="center" justify="space-between">
            <Select value={"fuji"} onChange={handleChangeChain} options={
                accounts.map(a => ({ value: a.chain, label: a.chain.toUpperCase() }))
            } />
            <div>{selectedAccount.onemes_name}</div>
            <Button icon={<DisconnectOutlined />} title="disconnect"></Button>
        </Flex>
        <Divider />
        <Flex gap={5} align="center" vertical>
            <Button onClick={() => window.open(`${chain?.blockExplorers.default.url}/address/${accounts[0]?.onemes_account_address}`, "_blank")}>{getShortAddress(accounts[0]?.onemes_account_address)}</Button>
            {(chain?.id && address) ? <Balance address={selectedAccount.onemes_account_address} chainId={chain?.id} /> : <></>}
        </Flex>

        <Divider />
    </>
}