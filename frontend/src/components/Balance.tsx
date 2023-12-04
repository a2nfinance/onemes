import { useBalance } from "wagmi";
import {fetchBalance} from "@wagmi/core";

export const Balance = ({address, chainId}) => {
    const { data, isError, isLoading } = useBalance({
        address: address,
        chainId: chainId,
        watch: true,
        formatUnits: "ether"
    })

    // const [data, setData] = useState(null)
    // useEffect(() => {
    //     fetchBalance({ address: address,
    //         chainId: chainId,
    //         formatUnits: "ether"}).then(data => 
    //             {
    //                 setData(data)
    //             }
               
    //         );
    // }, [chainId])
    if (isLoading) {
        return (<></>)
    }
    return (
        <span style={{fontSize: 12}}>
            {data?.formatted} {data?.symbol}
        </span>
    )
}