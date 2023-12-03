import { List, Skeleton, Table } from "antd";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { setTokenList } from "src/controller/account/accountSlice";
import { useAppDispatch, useAppSelector } from "src/controller/hooks";
import { networks } from "src/core/networks";

export const TokenList = ({ chainId }) => {
    const { tokenList, selectedAccount } = useAppSelector(state => state.account);
    const [isLoading, setIsLoading] = useState(true);
    const dispatch = useAppDispatch();
    useEffect(() => {
        if (networks[chainId].name === "fuji") {
            fetch(`${process.env.NEXT_PUBLIC_ROUTER_API}/v2/network/testnet/evm/${chainId}/address/${selectedAccount.onemes_account_address}/erc20-holdings`)
                .then(data => data.json()).then(res => {
                    dispatch(setTokenList(res.items));
                    setIsLoading(false);
                })
                .catch(e => console.log(e));
        }

    }, [])
    return (
        <List
            className="demo-loadmore-list"
            itemLayout="horizontal"
            loading={isLoading}
            pagination={tokenList.length > 5 ? {
                onChange: (page) => {
                    console.log(page);
                },
                pageSize: 5,
                align: "center",

            } : false}
            dataSource={tokenList}
            renderItem={(item) => (
                <List.Item>
                    <Skeleton avatar title={false} loading={item.loading} active>
                        <List.Item.Meta
                            title={<a href="https://ant.design">{item.tokenSymbol}</a>}
                            description={item.tokenName}
                        />
                        <div>{ethers.utils.formatEther(item.tokenQuantity)}</div>
                    </Skeleton>
                </List.Item>
            )}
        />


    )
}