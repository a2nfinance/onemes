import { Tabs, TabsProps } from "antd";
import { NewAccountForm } from "src/components/NewAccountForm";

export default function Index() {
    const items: TabsProps['items'] = [
        {
            key: '1',
            label: `New Account`,
            children: <NewAccountForm />,
        },
        {
            key: '2',

            label: `Account`,
            children: <></>,
        },
        {
            key: '5',
            label: `Transactions`,
            children: <></>
        }
    ];
    return (
        <div style={{ maxWidth: 600, marginRight: "auto", marginLeft: "auto", marginTop: 40, marginBottom: 40, padding: 20 }}>
            <Tabs defaultActiveKey="1" items={items} onChange={() => { }} />
        </div>
    )
}