import { useBalance } from "wagmi"

export const Balance = ({address, chainId}) => {
    const { data, isError, isLoading } = useBalance({
        address: address,
        chainId: chainId,
        watch: true,
        formatUnits: "ether"
    })
    if (isLoading) {
        return (<></>)
    }
    return (
        <span style={{fontSize: 12}}>
            {data?.formatted} {data?.symbol}
        </span>
    )
}