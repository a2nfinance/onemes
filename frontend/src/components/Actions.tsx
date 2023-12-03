import { prepareWriteContract, waitForTransaction, writeContract } from '@wagmi/core';
import { Button, Col, Flex, Form, Input, Modal, Row, Select } from "antd";
import { useCallback, useState } from "react";
import { useAppSelector } from "src/controller/hooks";
import { getTransferConfig, getWithdrawConfig } from "src/core/account";
import { chainSelectors, nativeTokenAddress, networks } from 'src/core/networks';
import { useNetwork } from 'wagmi';
import { MdOutlineSavings, MdOutlineGeneratingTokens } from "react-icons/md";
import { BsSend } from "react-icons/bs";
import { GrUpgrade } from "react-icons/gr";
export const Actions = () => {
    const { chain } = useNetwork();
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
            setIsSending(true);
            setIsWihtdrawModalOpen(false);
            const config = getTransferConfig(values, selectedAccount.onemes_account_address, chain?.id);
            const { request } = await prepareWriteContract(config)
            const { hash } = await writeContract(request)
            await waitForTransaction({
                hash: hash,
            })
        } catch (e) {
            console.log(e);
        }

        setIsSending(false);
    }, []);

    const handleWMCancel = () => {
        setIsWihtdrawModalOpen(false);
    };
    const actionsStyle = { width: 80, height: 80, backgroundColor: "#272626", padding: 10, borderRadius: 16 };
    const subtitleFont = { fontSize: 12 };
    return (
        <>
            <Flex justify='space-between'>
                <Flex align="center" justify='center' vertical style={actionsStyle}>
                    <Button icon={<MdOutlineSavings style={{ fontSize: "20" }} />} onClick={showWithdrawModal} loading={isWithdrawing} type="primary" />
                    <span style={subtitleFont}>Withdraw</span>
                </Flex>
                <Flex align="center" justify='center' vertical style={actionsStyle}>
                    <Button icon={<MdOutlineGeneratingTokens style={{ fontSize: "20" }} />} onClick={showSendModal} loading={isSendModalOpen} type="primary" />
                    <span style={subtitleFont}>Send</span>
                </Flex>

                <Flex align="center" justify='center' vertical style={actionsStyle}>
                    <Button icon={<GrUpgrade style={{ fontSize: "20" }} />} type="primary" />
                    <span style={subtitleFont}>Update</span>
                </Flex>


            </Flex>
            <Modal style={{maxWidth: 350}} title="Withdraw token" open={isWithdrawModalOpen} footer={false} onCancel={handleWMCancel}>
                <Form onFinish={(values) => onFinishWM(values)} layout="vertical">
                    
                            <Form.Item name={"token"} rules={[{ required: true, message: "Require token" }]}>
                                <Select size="large" value={nativeTokenAddress} options={
                                    [
                                        ...(tokenList.map(t => ({ value: t.tokenAddress, label: t.tokenSymbol }))),
                                        { label: networks[chain?.id].nativeToken.toUpperCase(), value: nativeTokenAddress }
                                    ]
                                } />
                            </Form.Item>

                            <Button loading={isWithdrawing} type="primary" size="large" htmlType="submit">Submit</Button>
                        
                    

                </Form>
            </Modal >

            <Modal style={{maxWidth: 350}} title="Send token" open={isSendModalOpen} footer={false} onCancel={handleSMCancel}>
                <Form
                    onFinish={(values) => onFinishSM(values)}
                    layout="vertical"
                >
                    <Row gutter={12}>
                        <Col span={12}>
                            <Form.Item name={"chain"} label={"Destination chain"} initialValue={"14767482510784806043"} rules={[{ required: true, message: "Require type" }]}>
                                <Select size="large" options={
                                    chainSelectors.map(cs => ({ label: cs.name.toUpperCase(), value: cs.chainSelector }))
                                } />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name={"receiver"} label={"Receiver"} rules={[{ required: true, message: "Require amount" }]}>
                                <Input size="large" placeholder='receiver address' />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={12}>

                        <Col span={12}>
                            <Form.Item name={"token"} initialValue={nativeTokenAddress} label="Token" rules={[{ required: true, message: "Require token" }]}>
                                <Select size="large" options={
                                    [
                                        ...(tokenList.map(t => ({ value: t.tokenAddress, label: t.tokenSymbol }))),
                                        { label: networks[chain?.id].nativeToken.toUpperCase(), value: nativeTokenAddress }
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