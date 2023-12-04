import { Flex, List, Skeleton, Table } from "antd";
import { ethers } from "ethers";
import { useState, useEffect } from "react";
import { useAppSelector } from "src/controller/hooks";
import { getMumbaiTransactionHistory } from "src/core/mumbaiTransactionHistory";
import { chainIds, networks } from "src/core/networks";
import { getSepoliaTransactionHistory } from "src/core/sepoliaTransactionHistory";
import { useAddress } from "src/hooks/useAddress";
import { useNetwork } from "wagmi";
export const Activity = ({ address }) => {
    const { selectedAccount } = useAppSelector(state => state.account);
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
        if (selectedAccount.chain === "fuji") {
            fetch(`${process.env.NEXT_PUBLIC_ROUTER_API}/v2/network/testnet/evm/${chainIds["fuji"]}/address/${address}/transactions`)
                .then(data => data.json()).then(res => {
                    setTransactions(res.items);
                    setIsLoading(false);
                })
                .catch(e => console.log(e));
        }

        if (selectedAccount.chain === "sepolia") {
            getSepoliaTransactionHistory(selectedAccount.onemes_account_address).then(data => {
                setTransactions(data);
                setIsLoading(false);
            }).catch(e => console.log(e));
        }

        if (selectedAccount.chain === "mumbai") {
            getMumbaiTransactionHistory(selectedAccount.onemes_account_address).then(data => {
                setTransactions(data);
                setIsLoading(false);
            }).catch(e => console.log(e));
        }


    }, [selectedAccount.onemes_account_address, selectedAccount.chain])
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
                            title={<a href={`${networks[chainIds[selectedAccount.chain]].explorerUrl}/tx/${item.id}`} target="_blank">{getShortAddress(item.id)}</a>}
                            description={<span>{item.status ? "confirmed" : "pending"}</span>}
                        />
                        <div>{ethers.utils.formatEther(item.value)}</div>
                    </Skeleton>
                </List.Item>
            )}
        />
    )
}