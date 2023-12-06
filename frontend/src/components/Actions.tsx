import { prepareWriteContract, switchNetwork, waitForTransaction, writeContract } from '@wagmi/core';
import { Alert, Button, Col, Divider, Flex, Form, Input, Modal, Radio, Row, Select, Typography } from "antd";
import { useCallback, useState } from "react";
import { GrUpgrade } from "react-icons/gr";
import { MdOutlineGeneratingTokens, MdOutlineSavings } from "react-icons/md";
import { setAccounts } from 'src/controller/account/accountSlice';
import { useAppDispatch, useAppSelector } from "src/controller/hooks";
import { getAccounts, getTransferConfig, getUpdateConfig, getWithdrawConfig, updateAccount } from "src/core/account";
import { chainIds, chainSelectors, nativeTokenAddress, networks } from 'src/core/networks';
import { useNetwork } from 'wagmi';
import countryCodes from "../data/CountryCodes.json";
const { Text } = Typography;
export const Actions = () => {
    const { chain } = useNetwork();
    const { tokenList, selectedAccount } = useAppSelector(state => state.account);
    const [isWithdrawModalOpen, setIsWihtdrawModalOpen] = useState(false);
    const [isSendModalOpen, setIsSendModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [isWithdrawing, setIsWithdrawing] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isShowGuideModal, setIsShowGuideModal] = useState(false);
    const dispatch = useAppDispatch();

    const showWithdrawModal = () => {
        setIsWihtdrawModalOpen(true);
    };

    const handleWMCancel = () => {
        setIsWihtdrawModalOpen(false);
    };

    const showSendModal = () => {
        setIsSendModalOpen(true);
    }

    const handleSMCancel = () => {
        setIsSendModalOpen(false);
    };

    const showUpdateModal = () => {
        setIsUpdateModalOpen(true);
    }

    const handleUMCancel = () => {
        setIsUpdateModalOpen(false);
    }

    const showGuideModal = () => {
        setIsShowGuideModal(true);
    }

    const handleCancelGuideModal = () => {
        setIsShowGuideModal(false);
    }

    const onFinishWM = useCallback(async (values: any) => {
        try {
            console.log(chain?.id, chainIds[selectedAccount.chain]);
            if (chain?.id !== chainIds[selectedAccount.chain]) {
                await switchNetwork({ chainId: chainIds[selectedAccount.chain] });
            }
            setIsWithdrawing(true);
            setIsWihtdrawModalOpen(false);
            const config = getWithdrawConfig(values, selectedAccount);
            const { request } = await prepareWriteContract(config)
            const { hash } = await writeContract(request)
            await waitForTransaction({
                hash: hash,
            })
        } catch (e) {
            console.log(e);
        }

        setIsWithdrawing(false);
    }, [selectedAccount.chain, chain?.id]);

    const onFinishSM = useCallback(async (values: any) => {
        try {
            if (chain?.id !== chainIds[selectedAccount.chain]) {
                await switchNetwork({ chainId: chainIds[selectedAccount.chain] });
            }
            setIsSending(true);
            setIsSendModalOpen(false);
            const config = getTransferConfig(values, selectedAccount);
            const { request } = await prepareWriteContract(config)
            const { hash } = await writeContract(request)
            await waitForTransaction({
                hash: hash,
            })
        } catch (e) {
            console.log(e);
        }

        setIsSending(false);
    }, [selectedAccount.chain, chain?.id]);


    const onFinishUM = useCallback(async (values: any) => {
        try {
            if (chain?.id !== chainIds[selectedAccount.chain]) {
                await switchNetwork({ chainId: chainIds[selectedAccount.chain] });
            }
            setIsUpdating(true);
            setIsUpdateModalOpen(false);
            const config = getUpdateConfig(values, selectedAccount);
            const { request } = await prepareWriteContract(config)
            const { hash } = await writeContract(request)
            await waitForTransaction({
                hash: hash,
            })
            await updateAccount(values, selectedAccount);
            const accountsList = await getAccounts(selectedAccount.wallet_address);
            dispatch(setAccounts(accountsList));
        } catch (e) {
            console.log(e);
        }

        setIsUpdating(false);
    }, [selectedAccount.chain, chain?.id]);

    const actionsStyle = { width: 80, height: 80, backgroundColor: "#272626", padding: 10, borderRadius: 16 };
    const subtitleFont = { fontSize: 12 };
    return (
        <>
            <Alert type='info' message={
                <Text>To initiate token transfers, whether offline or online through messaging, <a onClick={showGuideModal}>click here.</a></Text>
            } showIcon />
            <br />
            <Flex justify='space-between'>
                <Flex align="center" justify='center' vertical style={actionsStyle}>
                    <Button icon={<MdOutlineSavings style={{ fontSize: "20" }} />} onClick={showWithdrawModal} loading={isWithdrawing} type="primary" />
                    <span style={subtitleFont}>Withdraw</span>
                </Flex>
                <Flex align="center" justify='center' vertical style={actionsStyle}>
                    <Button icon={<MdOutlineGeneratingTokens style={{ fontSize: "20" }} />} onClick={showSendModal} loading={isSending} type="primary" />
                    <span style={subtitleFont}>Send</span>
                </Flex>

                <Flex align="center" justify='center' vertical style={actionsStyle}>
                    <Button icon={<GrUpgrade style={{ fontSize: "20" }} />} onClick={showUpdateModal} loading={isUpdating} type="primary" />
                    <span style={subtitleFont}>Update</span>
                </Flex>


            </Flex>
            <Modal style={{ maxWidth: 350 }} title="Withdraw token" open={isWithdrawModalOpen} footer={false} onCancel={handleWMCancel}>
                <Form onFinish={(values) => onFinishWM(values)} layout="vertical">

                    <Form.Item name={"token"} rules={[{ required: true, message: "Require token" }]}>
                        <Select size="large" value={nativeTokenAddress} options={
                            [
                                ...(tokenList.map(t => ({ value: t.tokenAddress, label: t.tokenSymbol }))),
                                { label: networks[chainIds[selectedAccount.chain]].nativeToken.toUpperCase(), value: nativeTokenAddress }
                            ]
                        } />
                    </Form.Item>

                    <Button loading={isWithdrawing} type="primary" size="large" htmlType="submit">Submit</Button>



                </Form>
            </Modal >

            <Modal style={{ maxWidth: 350 }} title="Send token" open={isSendModalOpen} footer={false} onCancel={handleSMCancel}>
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
                                        { label: networks[chainIds[selectedAccount.chain]].nativeToken.toUpperCase(), value: nativeTokenAddress }
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

            <Modal style={{ maxWidth: 350 }} title="Update account info" open={isUpdateModalOpen} footer={false} onCancel={handleUMCancel}>
                <Form name={"update_account_form"} layout='vertical' onFinish={onFinishUM}>
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
                    <Button loading={isUpdating} htmlType='submit' type='primary' size='large' style={{ width: "100%" }}>SUBMIT</Button>
                </Form>
            </Modal>


            <Modal style={{ maxWidth: 350 }} title="How to use messaging" open={isShowGuideModal} footer={false} onCancel={handleCancelGuideModal}>
                <Text>
                    If you're using SMS, send a message to the number {process.env.NEXT_PUBLIC_TWILIO_GLOBAL_NUMBER}.
                </Text>
                <p>To transfer tokens on Avalanche Fuji:  </p>
                <p>- <i>TR token_name token_amount receiver_info</i></p>
                <p>To transfer tokens between chains:</p>
                <p>- <i>CTR source_chain crosschain_token_name crosschain_token_amount destination_chain receiver_info</i></p>
                <Text>
                If you're using the Telegram chatbot, send a message to <a href='http://t.me/Onemes_a2n_bot' target='_blank'>Onemes</a> and follow the provided guides.
                </Text>
                <Divider />
                <Text>Notes:</Text>
                <p>
                    - The source chain and destination chain can be one of Fuji, Sepolia, or Mumbai.
                </p>
                <p>
                    -The token name can be one of the native token, Link token, USDT, USDC, and so on.
                </p>
                <p>
                    - The crosschain token name can be one of CCIP-BnM or CCIP-LnM.
                </p>
                <p>
                    - The receiver info can be a friendly name (abc.onemes), email, phone number, Twitter, or Telegram ID.
                </p>
            </Modal>

        </>

    )
}