import { prepareWriteContract, waitForTransaction, writeContract } from '@wagmi/core';
import { Button, Col, Form, Input, Modal, Row, Select } from "antd";
import { useCallback, useState } from "react";
import { useAppSelector } from "src/controller/hooks";
import { getWithdrawConfig } from "src/core/account";

export const Actions = () => {

    const { tokenList, selectedAccount } = useAppSelector(state => state.account);
    const [isWithdrawModalOpen, setIsWihtdrawModalOpen] = useState(false);
    const [isSendModalOpen, setIsSendModalOpen] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [isWithdrawing, setIsWithdrawing] = useState(false);

    const showWithdrawModal = () => {
        setIsWihtdrawModalOpen(true);
    };

    const showSendModal = () => {
        setIsSendModalOpen(true);
    }

    const handleSMCancel = () => {
        setIsSendModalOpen(false);
    };

    const onFinishWM = useCallback(async (values: any) => {
        try {
            setIsWithdrawing(true);
            setIsWihtdrawModalOpen(false);
            const config = getWithdrawConfig(values, selectedAccount.onemes_account_address);
            const { request } = await prepareWriteContract(config)
            const { hash } = await writeContract(request)
            await waitForTransaction({
                hash: hash,
            })
        } catch (e) {
            console.log(e);
        }

        setIsWithdrawing(false);
    }, []);

    const onFinishSM = useCallback(async (values: any) => {
        try {
            setIsSending(false);
        } catch (e) {
            console.log(e);
        }

        setIsSending(false);
    }, []);

    const handleWMCancel = () => {
        setIsWihtdrawModalOpen(false);
    };

    return (
        <>
            <Row gutter={8}>
                <Col span="8">
                    <Button onClick={showWithdrawModal} loading={isWithdrawing} style={{ width: "100%" }} type="primary">Withdraw</Button>
                </Col>
                <Col span="8">
                    <Button onClick={showSendModal} loading={isSendModalOpen} style={{ width: "100%" }} type="primary">Send</Button>
                </Col>

                <Col span="8">
                    <Button style={{ width: "100%" }} type="primary">Update account</Button>
                </Col>


            </Row>
            <Modal title="Withdraw token" open={isWithdrawModalOpen} footer={false} onCancel={handleWMCancel}>
                <Form onFinish={(values) => onFinishWM(values)} layout="vertical">
                    <Row gutter={12}>
                        <Col span={12}>
                            <Form.Item name={"token"} rules={[{ required: true, message: "Require token" }]}>
                                <Select size="large" value={"avax"} options={
                                    [
                                        ...(tokenList.map(t => ({ value: t.tokenAddress, label: t.tokenSymbol }))),
                                        { label: "AVAX", value: "avax" }
                                    ]
                                } />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Button loading={isWithdrawing} type="primary" size="large" htmlType="submit">Submit</Button>
                        </Col>
                    </Row>

                </Form>
            </Modal >

            <Modal title="Transfer token" open={isSendModalOpen} footer={false} onCancel={handleSMCancel}>
                <Form 
                onFinish={(values) => onFinishSM(values)} 
                layout="vertical"
                >
                    <Row gutter={12}>
                        <Col span={12}>
                            <Form.Item name={"transfer_type"} label={"Transfer"} rules={[{ required: true, message: "Require type" }]}>
                                <Select size="large" options={
                                    [
                                        { label: "Crosschain", value: "CTR" },
                                        { label: "On the same chain", value: "TR" }
                                    ]
                                } />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name={"to_address"} label={"To"} rules={[{ required: true, message: "Require amount" }]}>
                                <Input size="large" placeholder='receiver address' />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={12}>
                        <Col span={12}>
                            <Form.Item name={"token"} label="Token" rules={[{ required: true, message: "Require token" }]}>
                                <Select size="large" options={
                                    [
                                        ...(tokenList.map(t => ({ value: t.tokenAddress, label: t.tokenSymbol }))),
                                        { label: "AVAX", value: "avax" }
                                    ]
                                } />
                            </Form.Item>


                        </Col>
                        <Col span={12}>
                            <Form.Item name={"amount"} label={"Amount"} rules={[{ required: true, message: "Require amount" }]}>
                                <Input size="large" type='number' />
                            </Form.Item>

                        </Col>


                    </Row>


                    <Button loading={isSending} type="primary" size="large" htmlType="submit">Submit</Button>


                </Form>
            </Modal >

        </>

    )
}