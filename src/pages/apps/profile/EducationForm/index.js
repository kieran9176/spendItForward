import React from 'react'
import { connect } from 'react-redux'
import { Form, Cascader, Button, Input, Icon, Modal, notification } from 'antd';

@Form.create({
  onFieldsChange(props, changedFields) {

    const { form } = props;
    const { changed } = form.getFieldsValue();

    const fieldArr = Object.keys(changedFields);
    if (fieldArr[0] !== "changed" && fieldArr.length === 1) { // makes sure we're ignoring 2 events: 1. when the 'changed' field is updated, 2. form submit (sends all fields)
      for (let i = 0; i < changedFields[fieldArr[0]].length; i += 1) {
        if (changedFields[fieldArr[0]][i]) {
          changed[i] = true;
          form.setFieldsValue({ changed })
        }
      }
    }
  }
})
@connect(({ profile }) => ({ profile }))
class EducationForm extends React.Component {

  state = {
    visible: false,
    k: null,
    index: null
  };

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

  getPayloads = (type, values) => {
    const payloads = [];

    console.log('type', type);
    console.log('values', values);

    switch (type) {
      case "Education":
        for (let i = 0; i < values.keys.length; i += 1) {
          if (values.changed[i] === true) {
            payloads.push({
              degreeType: values.degrees[i][0],
              degreeSubtype: values.degrees[i][1],
              majorOne: values.majors[i],
              majorTwo: values.secondMajors[i] || null,
              minorOne: values.minors[i] || null,
              minorTwo: values.secondMinors[i] || null,
              id: values.IDs[i] || null,
            })
          }
        }
        return payloads;
      default:
        return null;
    }
  };

  handleSubmit = e => {
    e.preventDefault();
    const { form, dispatch } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        const payload = this.getPayloads("Education", values);
        console.log("payload", payload);

        dispatch({
          type: 'profile/EDIT_EDUCATION',
          payload
        });

        // reset changed to false for every field
        const { changed } = form.getFieldsValue();
        for (let i = 0; i < changed.length; i += 1) {
          changed[i] = false;
        }
        form.setFieldsValue({ changed })
      }
      else console.log("error", err)
    })
  };

  remove = () => {
    const { form, dispatch } = this.props;
    const { k, index } = this.state;
    // can use data-binding to get
    // const { keys, titles, companies, companyLinks, IDs, startDates, endDates } = form.getFieldsValue();
    const { keys, degrees, majors, secondMajors, minors, secondMinors, IDs } = form.getFieldsValue();

    // We need at least one passenger
    if (keys.length === 1) {
      return;
    }

    if (IDs[index]) {
      dispatch({
        type: 'profile/DELETE_EDUCATION',
        data: { id: IDs[index] }
      });
    }

    // can use data-binding to set
    form.setFieldsValue({
      keys: keys.filter( (key) => {
        return key !== k
      }),
      degrees: degrees.filter( (degree) => {
        return degree !== degrees[index]
      }),
      majors: majors.filter( (major) => {
        return major !== majors[index]
      }),
      secondMajors: secondMajors.filter( (secondMajor) => {
        return secondMajor !== secondMajors[index]
      }),
      IDs: IDs.filter( (ID) => {
        return ID !== IDs[index]
      }),
      minors: minors.filter( (minor) => {
        return minor !== minors[index]
      }),
      secondMinors: secondMinors.filter( (secondMinor) => {
        return secondMinor !== secondMinors[index]
      }),
    });
  };

  getFormAttributes = (type) => {
    switch (type) {
      case "Education":
        return {
          title: "Education", createMutation: "createEducation", deleteMutation: "removeEducation",
          labels: ["Degree", "Major", "Second Major", "Minor", "Second Minor", "Concentration"]
        };
      default:
        notification.error({
          message: "Could not get form attributes.",
          description: "Attributes of specified type not found."
        });
        return null
    }
  };

  getInitialValues = (type) => {
    const { profile } = this.props;
    const { education } = profile;

    switch (type) {
      case "Education":
        return education;
      default:
        notification.error({
          message: "Could not get initial values.",
          description: "Values of specified type not found."
        });
        return null
    }
  };

  add = () => {
    const { form } = this.props;
    // can use data-binding to get
    const { keys } = form.getFieldsValue();
    const nextKeys = keys.concat(keys[keys.length - 1] + 1);

    // can use data-binding to set
    // important! notify form to detect changes
    form.setFieldsValue({
      keys: nextKeys,
    });
  };

  showModal = (k, index) => {
    this.setState({
      visible: true,
      k,
      index
    });
  };

  handleOk = (e) => {
    e.preventDefault();
    this.setState({
      visible: false,
    });
    this.remove()
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  onChange = (value) => {
    console.log(value);
  };

  render() {

    const { form, type } = this.props;
    const { getFieldDecorator, getFieldsValue } = form;
    const { visible } = this.state;

    const initialValues = this.getInitialValues(type);
    const { labels } = this.getFormAttributes(type);

    getFieldDecorator('keys', { initialValue: initialValues.map((expObj, i) => i )});
    getFieldDecorator('IDs', { initialValue: initialValues.map((expObj) => expObj.id )});
    getFieldDecorator('changed', { initialValue: initialValues.map(() => false )});

    const { keys } = getFieldsValue();

    const educationFormItem = keys.map((k, index) => {
      return (
        <div key={k}>
          <h5>
            <strong style={{marginRight: 8}}>{type} {index + 1} </strong>
            {keys.length > 1 ? (
              <Icon
                className="dynamic-delete-button"
                type="minus-circle-o"
                onClick={() => this.showModal(k, index)}
              />
            ) : null}
          </h5>
          <Form.Item label={`${labels[0]} Type`}>
            {getFieldDecorator(`degrees[${index}]`, {
              initialValue: index < initialValues.length ? [initialValues[index].degreeType, initialValues[index].degreeSubtype] : ["", ""],
              rules: [
                {type: 'array', required: true, message: 'Please select your degree type!',}
              ],
            })(<Cascader options={this.options} expandTrigger="hover" style={{width: '60%', marginRight: 8}} />)}
          </Form.Item>
          <Form.Item label={`${labels[1]}`}>
            {getFieldDecorator(`majors[${index}]`, {
              validateTrigger: ['onChange', 'onBlur'],
              initialValue: index < initialValues.length ? initialValues[index].majorOne : "",
              rules: [
                {
                  required: true,
                  whitespace: true,
                  message: "Please input additional experience or delete this field.",
                },
              ],
            })(<Input placeholder="e.g. Biology" style={{width: '60%', marginRight: 8}} />)}
          </Form.Item>
          <Form.Item label={`${labels[2]}`}>
            {getFieldDecorator(`secondMajors[${index}]`, {
              validateTrigger: ['onChange', 'onBlur'],
              initialValue: index < initialValues.length ? initialValues[index].majorTwo : "",
              rules: [
                {
                  required: false,
                  whitespace: true,
                  message: "Please input additional experience or delete this field.",
                },
              ],
            })(<Input placeholder="e.g. EY" style={{width: '60%', marginRight: 8}} />)}
          </Form.Item>
          <Form.Item label={`${labels[3]}`}>
            {getFieldDecorator(`minors[${index}]`, {
              validateTrigger: ['onChange', 'onBlur'],
              initialValue: index < initialValues.length ? initialValues[index].minorOne : "",
              rules: [
                {
                  required: false,
                  whitespace: true,
                  message: "Please input additional experience or delete this field.",
                },
              ],
            })(<Input placeholder="e.g. Art History" style={{width: '60%', marginRight: 8}} />)}
          </Form.Item>
          <Form.Item label={`${labels[4]}`}>
            {getFieldDecorator(`secondMinors[${index}]`, {
              validateTrigger: ['onChange', 'onBlur'],
              initialValue: index < initialValues.length ? initialValues[index].minorTwo : "",
              rules: [
                {
                  required: false,
                  whitespace: true,
                  message: "Please input additional experience or delete this field.",
                },
              ],
            })(<Input placeholder="e.g. Philosophy" style={{width: '60%', marginRight: 8}} />)}
          </Form.Item>
        </div>
      )
    });

    return (
      <Form onSubmit={this.handleSubmit}>
        {educationFormItem}
        <Form.Item>
          <Button type="dashed" onClick={this.add} style={{width: '60%'}}>
            <Icon type="plus" /> Add field
          </Button>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Save
          </Button>
        </Form.Item>
        <Modal
          title="Remove Entry?"
          visible={visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <p>Are you sure you want to remove this item? It will be deleted from your profile.</p>
          <p>If yes, click OK. Otherwise you can cancel.</p>
        </Modal>
      </Form>
    );
  }
}

export default EducationForm
