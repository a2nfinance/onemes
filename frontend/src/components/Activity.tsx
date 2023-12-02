import { Flex, Table } from "antd";
import { ethers } from "ethers";
import { useState, useEffect } from "react";
import { networks } from "src/core/networks";
import { useAddress } from "src/hooks/useAddress";
import { useNetwork } from "wagmi";
export const Activity = ({ address, chainId }) => {
    const [transactions, setTransactions] = useState([]);
    const {chain} = useNetwork();
    const {getShortAddress} = useAddress();
    useEffect(() => {
        if (networks[chainId].name === "fuji") {
            fetch(`${process.env.NEXT_PUBLIC_ROUTER_API}/v2/network/testnet/evm/${chainId}/address/${address}/transactions`)
                .then(data => data.json()).then(res => setTransactions(res.items))
                .catch(e => console.log(e));
        }
    }, [address, chainId])
    return (
        <Table showHeader={false} pagination={{
            pageSize: 4,
            position: ["bottomCenter"]
        }} dataSource={transactions} columns={[
            {
                key: "id",
                dataIndex: "id",
                render: (_, record) => (
                    <Flex justify="center" vertical>
                        <a href={`${chain.blockExplorers.default.url}/tx/${record.id}`} target="_blank">{getShortAddress(record.id)}</a>
                        <span>{record.status ? "confirmed" : "pending"}</span>
                    </Flex>
                   
                )
            },
            {
                key: "value",
                dataIndex: "value",
                render: (_, record) => (
                    <>{ethers.utils.formatEther(record.value)}</>
                )
            }
        ]} />
    )
}