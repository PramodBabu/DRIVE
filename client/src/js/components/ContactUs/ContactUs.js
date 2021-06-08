import React from 'react';
import { Form, Input, Button} from 'antd';

const { Item } = Form;

const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };
  
  /* eslint-disable no-template-curly-in-string */
  const validateMessages = {
    required: '${label} is required!',
    types: {
      email: '${label} is not a valid email!',
      number: '${label} is not a valid number!',
    },
    number: {
      range: '${label} must be between ${min} and ${max}',
    },
  };
const ContactUs = () => {

    const onFinish = (values) => {
        console.log(values);
    };

    return (
        <>
        <h2 className="mt-2">Contact Us</h2>
        <div className="container d-flex mt-5">
            <div
                className="col-md-9 p-2"
            >
                <Form {...layout} name="nest-messages" onFinish={onFinish} validateMessages={validateMessages}>
                    <Item name={['user', 'name']} label="Name" rules={[{ required: true }]}>
                        <Input />
                    </Item>
                    <Item name={['user', 'email']} label="Email" rules={[{ type: 'email', required: true }]}>
                        <Input />
                    </Item>
                    <Item name={['user', 'mobile']} label="Mobile" rules={[{ required: true }]}>
                        <Input />
                    </Item>
                    <Item name={['user', 'comments']} label="Comments" rules={[{ required: true }]}>
                        <Input.TextArea />
                    </Item>
                    <Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Item>
                </Form>
            </div>
        </div>
        </>
    );
}

export default ContactUs;