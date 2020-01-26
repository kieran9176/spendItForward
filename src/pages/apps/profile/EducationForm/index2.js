import React from 'react'
import { connect } from 'react-redux'
import { Form, Cascader, Button, Input } from 'antd';

@Form.create()
@connect(({ profile }) => ({ profile }))
class EducationForm extends React.Component {

  options = [
    {
      value: 'Associate\'s Degree',
      label: 'Associate\'s Degree',
      children: [
        {
          value: 'Associate of Arts (A.A.)',
          label: 'Associate of Arts (A.A.)',
        },
        {
          value: 'Associate of Science (A.S.)',
          label: 'Associate of Science (A.S.)',
        },
        {
          value: 'Associate of Applied Science (AAS)',
          label: 'Associate of Applied Science (AAS)',
        },
      ],
    },
    {
      value: 'Bachelor\'s Degree',
      label: 'Bachelor\'s Degree',
      children: [
        {
          value: 'Bachelor of Arts (B.A.)',
          label: 'Bachelor of Arts (B.A.)',
        },
        {
          value: 'Bachelor of Science (B.S.)',
          label: 'Bachelor of Science (B.S.)',
        },
        {
          value: 'Bachelor of Fine Arts (BFA)',
          label: 'Bachelor of Fine Arts (BFA)',
        },
        {
          value: 'Bachelor of Applied Science (BAS)',
          label: 'Bachelor of Applied Science (BAS)',
        },
      ],
    },
    {
      value: 'Master\'s Degree',
      label: 'Master\'s Degree',
      children: [
        {
          value: 'Master of Arts (M.A.)',
          label: 'Master of Arts (M.A.)',
        },
        {
          value: 'Master of Science (M.S.)',
          label: 'Master of Science (M.S.)',
        },
        {
          value: 'Master of Business Administration (MBA)',
          label: 'Master of Business Administration (MBA)',
        },
        {
          value: 'Master of Fine Arts (MFA)',
          label: 'Master of Fine Arts (MFA)',
        },
      ],
    },
    {
      value: 'Doctoral Degree',
      label: 'Doctoral Degree',
      children: [
        {
          value: 'Doctor of Philosophy (Ph.D.)',
          label: 'Doctor of Philosophy (Ph.D.)',
        },
        {
          value: 'Juris Doctor (J.D.)',
          label: 'Juris Doctor (J.D.)',
        },
        {
          value: 'Doctor of Medicine (M.D.)',
          label: 'Doctor of Medicine (M.D.)',
        },
        {
          value: 'Doctor of Dental Surgery (DDS)',
          label: 'Doctor of Dental Surgery (DDS)',
        },
      ],
    },
  ];

  handleSubmit = e => {
    e.preventDefault();
    const { form } = this.props
    form.validateFields((err, values) => {
      console.log("VALUES", values)
    });
  };

  onChange = (value) => {
    console.log(value);
  };

  render() {

    const { form } = this.props
    const { getFieldDecorator } = form

    return (
      <Form onSubmit={this.handleSubmit}>
        <Form.Item label="Degree 1 Type">
          {getFieldDecorator('Degree 1', {
            rules: [
              {type: 'array', required: true, message: 'Please select your degree type!'},
            ],
          })(<Cascader options={this.options} expandTrigger="hover" style={{width: '60%', marginRight: 8}} />)}
        </Form.Item>
        <Form.Item label="Major 1">
          {getFieldDecorator('Major 1', {
            validateTrigger: ['onChange', 'onBlur'],
            rules: [
              {
                required: true,
                whitespace: true,
                message: "Please input additional experience or delete this field.",
              },
            ],
          })(<Input placeholder="e.g. EY" style={{width: '60%', marginRight: 8}} />)}
        </Form.Item>
        <Form.Item label="Major 2">
          {getFieldDecorator('Major 2', {
            validateTrigger: ['onChange', 'onBlur'],
            rules: [
              {
                required: false,
                whitespace: true,
                message: "Please input additional experience or delete this field.",
              },
            ],
          })(<Input placeholder="e.g. EY" style={{width: '60%', marginRight: 8}} />)}
        </Form.Item>
        <Form.Item label="Minor 1">
          {getFieldDecorator('Minor 1', {
            validateTrigger: ['onChange', 'onBlur'],
            rules: [
              {
                required: false,
                whitespace: true,
                message: "Please input additional experience or delete this field.",
              },
            ],
          })(<Input placeholder="e.g. EY" style={{width: '60%', marginRight: 8}} />)}
        </Form.Item>
        <Form.Item label="Minor 2">
          {getFieldDecorator('Minor 2', {
            validateTrigger: ['onChange', 'onBlur'],
            rules: [
              {
                required: false,
                whitespace: true,
                message: "Please input additional experience or delete this field.",
              },
            ],
          })(<Input placeholder="e.g. EY" style={{width: '60%', marginRight: 8}} />)}
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Save
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

export default EducationForm
