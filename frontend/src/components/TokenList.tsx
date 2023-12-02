import { Table } from "antd";
import { ethers } from "ethers";
import { useEffect } from "react";
import { setTokenList } from "src/controller/account/accountSlice";
import { useAppDispatch, useAppSelector } from "src/controller/hooks";
import { networks } from "src/core/networks";

export const TokenList = ({ chainId }) => {
    const { tokenList, selectedAccount } = useAppSelector(state => state.account);
    const dispatch = useAppDispatch();
    useEffect(() => {
        if (networks[chainId].name === "fuji") {
            fetch(`${process.env.NEXT_PUBLIC_ROUTER_API}/v2/network/testnet/evm/${chainId}/address/${selectedAccount.onemes_account_address}/erc20-holdings`)
                .then(data => data.json()).then(res => {
                    dispatch(setTokenList(res.items));
                })
                .catch(e => console.log(e));
        }

    }, [])
    return (
        <Table showHeader={false}
            pagination={{
                pageSize: 4,
                position: ["bottomCenter"]
            }}
            dataSource={tokenList}
            columns={[
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