import { Flex, List, Skeleton, Table } from "antd";
import { ethers } from "ethers";
import { useState, useEffect } from "react";
import { networks } from "src/core/networks";
import { useAddress } from "src/hooks/useAddress";
import { useNetwork } from "wagmi";
export const Activity = ({ address, chainId }) => {
    const [transactions, setTransactions] = useState([1, 2, 3].map(i => ({
        id: "",
        loading: true,
        value: 0,
        status: true
    }))
    );
    const { chain } = useNetwork();
    const { getShortAddress } = useAddress();
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        if (networks[chainId].name === "fuji") {
            fetch(`${process.env.NEXT_PUBLIC_ROUTER_API}/v2/network/testnet/evm/${chainId}/address/${address}/transactions`)
                .then(data => data.json()).then(res => {
                    setTransactions(res.items);
                    setIsLoading(false);
                })
                .catch(e => console.log(e));
        }
    }, [address, chainId])
    return (
        <List
            className="demo-loadmore-list"
            itemLayout="horizontal"
            loading={isLoading}
            dataSource={transactions}
            pagination={transactions.length > 5 ? {
                onChange: (page) => {
                    console.log(page);
                },
                pageSize: 5,
                align: "center",

            } : false}
            renderItem={(item) => (
                <List.Item>
                    <Skeleton avatar title={false} loading={item.loading} active>
                        <List.Item.Meta
                            title={<a href={`${chain.blockExplorers.default.url}/tx/${item.id}`}>{getShortAddress(item.id)}</a>}
                            description={<span>{item.status ? "confirmed" : "pending"}</span>}
                        />
                        <div>{ethers.utils.formatEther(item.value)}</div>
                    </Skeleton>
                </List.Item>
            )}
        />
    )
}