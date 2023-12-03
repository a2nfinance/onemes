import { Button, Col, DatePicker, Divider, Form, Input, Radio, Card, Alert, Row, Select } from 'antd';
import { useCallback, useState } from 'react';
import { getWriteContractConfig, saveAccount } from 'src/core/account';
import countryCodes from "../data/CountryCodes.json";
import {
    usePrepareContractWrite,
    useContractWrite,
    useWaitForTransaction,
    useConnect,
    useAccount,
    useNetwork,
} from 'wagmi';
export const NewAccountForm = () => {
    const { isConnected, address } = useAccount();
    const { chain, chains } = useNetwork()
    const { variables } = useConnect()
    const [form] = Form.useForm();
    const [contractConfig, setContractConfig] = useState({});
    const {
        config,
        error: prepareError,
        isError: isPrepareError,
    } = usePrepareContractWrite(contractConfig)
    const { data, error, isError, write } = useContractWrite(config)

    const { isLoading, isSuccess } = useWaitForTransaction({
        hash: data?.hash,
        onSuccess(data) {
            console.log(data);
            saveAccount(data, {...form.getFieldsValue(), wallet_address: address}, chain?.id);
        },
        onError(data) {
            console.log(data);
            console.log(form.getFieldsValue());
        }
    })

    const onFinish = useCallback((values: any) => {
        setContractConfig(getWriteContractConfig(values, chain?.id));
        write?.()
    }, [contractConfig]);
    return (
        <Card title={"ACCOUNT REGISTER"}>
            <Form name={"new_account_form"} layout='vertical' onFinish={onFinish} form={form}>
                <Form.Item name='onemes_name' label={"Name"} rules={[{ required: true, message: 'Missing Name' }]}>
                    <Input size='large' addonAfter={".onemes"}/>
                </Form.Item>
                <Row gutter={10}>
                    <Col span={10}>
                        <Form.Item name='country' initialValue={"+1 United States"} label={"Country"} rules={[{ required: true, message: 'Missing country' }]}>
                            <Select size='large' options={
                                countryCodes.map(c => ({
                                    label: `(${c.dial_code}) ${c.name}`,
                                    value: `${c.dial_code} ${c.name}`
                                }))
                            } />
                        </Form.Item>
                    </Col>
                    <Col span={14}>
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
                {isSuccess && (
                    <div>
                        Successfully minted your NFT!
                        <div>
                            <a href={`https://etherscan.io/tx/${data?.hash}`}>Etherscan</a>
                        </div>
                    </div>
                )}

                {(isPrepareError || isError) && (
                    <div>Error: {(prepareError || error)?.message}</div>
                )}
                <Button loading={isLoading} htmlType='submit' type='primary' size='large' style={{ width: "100%" }}>SUBMIT</Button>
            </Form>
        </Card>
    )
}