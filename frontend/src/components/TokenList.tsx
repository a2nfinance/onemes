import { Table } from "antd";
import { ethers } from "ethers";
import { useEffect, useState } from "react"
import { networks } from "src/core/networks";

export const TokenList = ({ address, chainId }) => {
    const [tokens, setTokens] = useState([])
    useEffect(() => {
        if (networks[chainId].name === "fuji") {
            fetch(`${process.env.NEXT_PUBLIC_ROUTER_API}/v2/network/testnet/evm/${chainId}/address/${address}/erc20-holdings`)
                .then(data => data.json()).then(res => setTokens(res.items))
                .catch(e => console.log(e));
        }

    }, [])
    return (
            <Table showHeader={false} pagination={{
                pageSize: 4,
                position: ["bottomCenter"]
            }} dataSource={tokens} columns={[
                {
                    key: "tokenSymbol",
                    dataIndex: "tokenSymbol",
                    render: (_, record) => (
                        <a href="">{record.tokenSymbol}</a>
                    )
                },
                {
                    key: "tokenQuantity",
                    dataIndex: "tokenQuantity",
                    render: (_, record) => (
                        <>{ethers.utils.formatEther(record.tokenQuantity)}</>
                    )
                },
            ]} />
    )
}