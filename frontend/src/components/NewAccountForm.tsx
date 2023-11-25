import { Button, Col, DatePicker, Divider, Form, Input, Radio, Card } from 'antd';
export const NewAccountForm = () => {
    return (
        <Card>
            <Form layout='vertical'>
                <Form.Item label={"Phone number"} rules={[{ required: true, message: 'Missing phone number' }]}>
                    <Input size='large' name='phone_number' type='phone_number' />
                </Form.Item>
                <Form.Item label={"Email"} rules={[{ required: true, message: 'Missing phone number', type: "email" }]}>
                    <Input size='large' name='email' type='email' />
                </Form.Item>
                <Form.Item label={"Twitter Account"} rules={[{ required: true, message: 'Missing phone number', type: "email" }]}>
                    <Input size='large' name='twitter' placeholder='@levia2n'/>
                </Form.Item>
                <Form.Item label={"Telegram"} rules={[{ required: true, message: 'Missing phone number', type: "email" }]}>
                    <Input size='large' name='telegram' placeholder='levia2n'/>
                </Form.Item>
                <Button htmlType='submit' type='primary' size='large' style={{ width: "100%" }}>Create new OneMes account</Button>
            </Form>
        </Card>
    )
}