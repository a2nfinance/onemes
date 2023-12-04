import { Button, Card, Col, Divider, Form, Input, Row, Select } from "antd";
import { useState } from "react";
import QRCode from "react-qr-code";
import { useAppSelector } from "src/controller/hooks";
import { chainSelectors, networks } from "src/core/networks";
import { useNetwork } from "wagmi";
export const QRCodeGenerator = () => {
    const { selectedAccount, tokenList } = useAppSelector(state => state.account);
    const { chain } = useNetwork();
    const [qrValue, setQrValue] = useState(`TR AVAX 1 ${selectedAccount.onemes_name}`);
    const onFinish = (values: any) => {
        if (values["source"] && values["destination"]) {
            setQrValue(`CTR ${values["source"]} ${values["token"]} ${values["amount"]} ${values["destination"]} ${selectedAccount.onemes_name}`)
        } else {
            setQrValue(`TR ${values["token"]} ${values["amount"]} ${selectedAccount.onemes_name}`)
        }

    }
    return (
        <Card>
            <Form name="qr_form" layout="vertical" onFinish={onFinish}>
                <Row gutter={12}>
                    <Col span={12}>
                        <Form.Item label="Token" name={"token"} rules={[{ required: true, message: "Require token" }]}>
                            <Select options={

                                [
                                    ...(tokenList.map(t => ({ value: t.tokenAddress, label: t.tokenSymbol }))),
                                    { label: networks[chain?.id].nativeToken.toUpperCase(), value: networks[chain?.id].nativeToken }
                                ]
                            } />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Amount" name={"amount"} rules={[{ required: true, message: "Require amount" }]}>
                            <Input type="number" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={12}>
                    <Col span={12}>
                        <Form.Item label="Source chain" name={"source"}>
                            <Select options={chainSelectors.map(t => ({ label: t.name.toUpperCase(), value: t.name }))} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Destination chain" name={"destination"}>
                            <Select options={chainSelectors.map(t => ({ label: t.name.toUpperCase(), value: t.name }))} />
                        </Form.Item>
                    </Col>
                </Row>
                <Button htmlType="submit" style={{width: "100%"}} type="primary">Generate</Button>
            </Form>

            <Divider />
            <QRCode
                size={256}
                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                value={qrValue}
                viewBox={`0 0 256 256`}
            />
        </Card>
    )

}