import { DisconnectOutlined, LinkOutlined } from "@ant-design/icons";
import { Button, Flex, Select } from "antd";
import { useAppDispatch, useAppSelector } from "src/controller/hooks";
import { useAddress } from "src/hooks/useAddress";
import { useAccount, useDisconnect, useNetwork } from "wagmi";
import { Balance } from "./Balance";
import { chainIds, networks } from "src/core/networks";
import { useState } from "react";
import { setSelectedAccount } from "src/controller/account/accountSlice";
export const GeneralInfo = () => {
    const [selectedChain, setSelectedChain] = useState("fuji");
    const { selectedAccount, accounts } = useAppSelector(state => state.account);
    const dispatch = useAppDispatch();
    const { address } = useAccount();
    const { chain } = useNetwork();
    const { disconnect } = useDisconnect()
    const { getShortAddress } = useAddress();
    const handleChangeChain = (chain) => {
        setSelectedChain(chain);
        dispatch(setSelectedAccount(accounts.filter(a => a.chain === chain)?.[0]))
    }
    return <>
        <Flex gap={5} align="center" justify="space-between">
            <Select value={selectedChain} size="small" onChange={handleChangeChain} options={
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
                onClick={() => window.open(`${networks[chainIds[selectedAccount.chain]].explorerUrl}/address/${selectedAccount.onemes_account_address}`, "_blank")}>
                {getShortAddress(selectedAccount.onemes_account_address)}
            </Button>
            {(chain?.id && address) ? <Balance address={selectedAccount.onemes_account_address} chainId={chainIds[selectedAccount.chain]} /> : <></>}
        </Flex>

        <br />
    </>
}