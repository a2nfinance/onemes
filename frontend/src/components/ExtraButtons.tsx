import { QuestionCircleOutlined } from "@ant-design/icons"
import { FloatButton } from "antd"

export const ExtraButtons = () => {
    return (<>
        <FloatButton.Group shape="circle" style={{ right: 24 }}>
            <FloatButton tooltip={"Help"} onClick={() => window.open("https://github.com/a2nfinance/onemes/GUIDE.md", "_blank")} icon={<QuestionCircleOutlined />} />
            <FloatButton onClick={() => window.open("https://github.com/a2nfinance/onemes/issues", "_blank")} tooltip={"Report an issue"} />
            <FloatButton.BackTop visibilityHeight={0} />
        </FloatButton.Group>
        {/* <FloatButton.Group shape="square" style={{ right: 94 }}>
            <FloatButton icon={<QuestionCircleOutlined />} />
            <FloatButton />
            <FloatButton icon={<SyncOutlined />} />
            <FloatButton.BackTop visibilityHeight={0} />
        </FloatButton.Group> */}
    </>
    )
}