import { Alert, Button, Card, Col, Form, Input, Radio, Row, Select } from 'antd';
import { useCallback, useState } from 'react';
import { getAccounts, getWriteContractConfig, saveAccount } from 'src/core/account';
import { WalletStyle } from 'src/styles/wallet';
import {
    useAccount,
    useNetwork,
} from 'wagmi';
import { prepareWriteContract, writeContract, waitForTransaction } from "@wagmi/core"
import countryCodes from "../data/CountryCodes.json";
import { useAppDispatch } from 'src/controller/hooks';
import { setAccounts } from 'src/controller/account/accountSlice';
export const NewAccountForm = () => {
    const { address } = useAccount();
    const { chain } = useNetwork()
    const [form] = Form.useForm();

    const [isCreating, setIsCreating] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const dispatch = useAppDispatch();

    const onFinish = useCallback(async (values: any) => {
        try {
            setErrorMessage("");
            setIsCreating(true);
            const config = getWriteContractConfig(values, chain?.id);
            const { request } = await prepareWriteContract(config)
            const data = await writeContract(request)
            const returnedData = await waitForTransaction({
                hash: data.hash,
            })
            await saveAccount(returnedData, { ...form.getFieldsValue(), wallet_address: address }, chain?.id);
            const accountsList = await getAccounts(address);
            dispatch(setAccounts(accountsList));
        } catch (e) {
            console.log(e);
            setErrorMessage(e.message);
        }

        setIsCreating(false);

    }, []);
    return (
        <Card title={"ACCOUNT REGISTER"} style={WalletStyle}>
            <Form name={"new_account_form"} layout='vertical' onFinish={onFinish} form={form}>
                <Form.Item name='onemes_name' label={"Name"} rules={[{ required: true, message: 'Missing Name' }]}>
                    <Input size='large' addonAfter={".onemes"} />
                </Form.Item>
                <Row gutter={10}>
                    <Col span={12}>
                        <Form.Item name='country' initialValue={"+1 United States"} label={"Country"} rules={[{ required: true, message: 'Missing country' }]}>
                            <Select size='large' options={
                                countryCodes.map(c => ({
                                    label: `(${c.dial_code}) ${c.name}`,
                                    value: `${c.dial_code} ${c.name}`
                                }))
                            } />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name='phone_number' label={"Phone number"} rules={[{ required: true, message: 'Missing phone number' }]}>
                            <Input size='large' type='phone_number' />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item name='email' label={"Email"} rules={[{ required: true, message: 'Missing email', type: "email" }]}>
                    <Input size='large' type='email' />
                </Form.Item>
                <Form.Item name='twitter' label={"Twitter"}>
                    <Input size='large' placeholder='@levia2n' />
                </Form.Item>
                <Form.Item name='telegram' label={"Telegram ID"}>
                    <Input size='large' placeholder='5123456767' />
                </Form.Item>
                <Form.Item name={"use_wallet_address_to_receive"} initialValue={true} label={"Receive token"}>
                    <Radio.Group>
                        <Radio value={true}>Use my wallet address</Radio>
                        <Radio value={false}>Use OneMes account address</Radio>
                    </Radio.Group>
                </Form.Item>
                {
                    errorMessage ? <Alert type='error' message={errorMessage} showIcon={true} /> : <></>
                }
                <Button loading={isCreating} htmlType='submit' type='primary' size='large' style={{ width: "100%" }}>SUBMIT</Button>
            </Form>
        </Card>
    )
}