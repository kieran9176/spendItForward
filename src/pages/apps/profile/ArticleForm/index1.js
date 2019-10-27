import React from 'react'
import { connect } from 'react-redux'
import {Form, Input, Select, Icon, Button } from 'antd';
// import moment from 'moment'

const { Option } = Select;

let id = 0;

@Form.create()
@connect(({ profile }) => ({ profile }))
class ArticleForm extends React.Component {

  remove = k => {
    const {form} = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    // We need at least one passenger
    if (keys.length === 1) {
      return;
    }

    // can use data-binding to set
    form.setFieldsValue({
      keys: keys.filter(key => key !== k),
    });
  };

  add = () => {
    const {form} = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    const nextKeys = keys.concat(id += 1);
    // can use data-binding to set
    // important! notify form to detect changes
    form.setFieldsValue({
      keys: nextKeys,
    });
  };

  // createPayloads = (array) => {
  //   const payloads = []
  //   for (let i = 0; i < array[0].length; i += 1) {
  //     payloads.push({
  //       type: 'profile/EDIT_PROFILE',
  //       payload: {
  //         mutation: "updateExperience",
  //         data: {
  //           experience:
  //             {
  //               id: "d7932c8a-f063-4dca-be48-a4eb3fc5804a",
  //               position: array[0][i],
  //               company: array[1][i],
  //               start_date: "2019-05-10",
  //               end_date: "2019-05-15",
  //               link: array[3][i]
  //             }
  //         }
  //       }
  //     })
  //   }
  //   return payloads
  // }

  handleSubmit = e => {
    e.preventDefault();
    const {form} = this.props

    // const { form } = this.props
    form.validateFields((err, values) => {
      if (!err) {
        console.log("VALUES", values)
      }
    });
  }

  // if your form doesn't have the fields these you set, this error will appear!
  // if your form doesn't have the fields these you set, this error will appear!
  // if your form doesn't have the fields these you set, this error will appear!
  // https://github.com/ant-design/ant-design/issues/8880


  render() {
    const { form } = this.props
    // const {form, profile } = this.props
    // const { experience } = profile
    const { getFieldDecorator, getFieldValue } = form;

    const selectBefore = (
      <Select defaultValue="https://" style={{ width: 90 }}>
        <Option value="https://">https://</Option>
        <Option value="http://">http://</Option>
      </Select>
    );
    const selectAfter = (
      <Select defaultValue=".com" style={{ width: 80 }}>
        <Option value=".com">.com</Option>
        <Option value=".io">.io</Option>
        <Option value=".org">.org</Option>
        <Option value=".gov">.gov</Option>
      </Select>
    );
    getFieldDecorator('keys', {initialValue: []});
    const keys = getFieldValue('keys');
    const companyFormItem = keys.map((k, index) => {
      const children = []
      children.push (
        <Form.Item
          label={`Article ${index + 1} Title`}
          required={false}
          key={k}
        >
          {getFieldDecorator(`articles[${k}]`, {
            validateTrigger: ['onChange', 'onBlur'],
            rules: [
              {
                required: true,
                whitespace: true,
                message: "Please input additional experience or delete this field.",
              },
            ],
          })(<Input placeholder="e.g. Lyft Off? The First Ride Sharing IPO!" style={{width: '60%', marginRight: 8}} />)}
        </Form.Item>,
        <Form.Item
          label={`Article ${index + 1} Link`}
          required={false}
          key={k+1}
        >
          {getFieldDecorator(`articleLinks[${k}]`, {
            validateTrigger: ['onChange', 'onBlur'],
            rules: [
              {
                required: true,
                whitespace: true,
                message: "Please input additional experience or delete this field.",
              },
            ],
          })(<Input addonBefore={selectBefore} addonAfter={selectAfter} placeholder="aswathdamodaran.blogspot" style={{width: '60%', marginRight: 8}} />)}
        </Form.Item>,
        <Form.Item
          label={`Article ${index + 1} Caption`}
          required={false}
          key={k+2}
        >
          {getFieldDecorator(`captions[${k}]`, {
            validateTrigger: ['onChange', 'onBlur'],
            rules: [
              {
                required: true,
                whitespace: true,
                message: "Please input additional experience or delete this field.",
              },
            ],
          })(<Input placeholder="e.g. FROM MUSINGS ON MARKETS - FINANCE PROFESSOR ASWATH DAMODARAN ON LYFT PRE-IPO" style={{width: '60%', marginRight: 8}} />)}
          {keys.length > 1 ? (
            <Icon
              className="dynamic-delete-button"
              type="minus-circle-o"
              onClick={() => this.remove(k)}
            />
          ) : null}
        </Form.Item>
      )
      return children
    });
    return (
      <Form onSubmit={this.handleSubmit}>
        {companyFormItem}
        <Form.Item>
          <Button type="dashed" onClick={this.add} style={{width: '60%'}}>
            <Icon type="plus" /> Add field
          </Button>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

export default ArticleForm
