import React from 'react'
import { connect } from 'react-redux'
import {Form, Input, Icon, Button, DatePicker, Checkbox, Modal } from 'antd';
import moment from 'moment'
// import style from '../style.module.scss'

const { MonthPicker } = DatePicker;
// const { Option } = Select;

@connect(({ profile }) => ({ profile }))
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

class ExperienceForm extends React.Component {

  state = {
    visible: false,
    k: null,
    index: null
  };

  remove = () => {
    const { form, dispatch } = this.props;
    const { k, index } = this.state;
    // can use data-binding to get
    const { keys, titles, companies, companyLinks, IDs, startDates, endDates } = form.getFieldsValue();

    // We need at least one passenger
    if (keys.length === 1) {
      return;
    }

    // const experience = this.createPayloads("removeExperience", IDs[index]);

    // console.log("remove experience", experience)

    if (IDs[index]) {
      dispatch({
        type: 'profile/EDIT_PROFILE',
        payload: {
          mutation: "removeExperience",
          data: { id: IDs[index] }
        }
      });
    }

    // can use data-binding to set
    form.setFieldsValue({
      keys: keys.filter( (key) => {
        return key !== k
      }),
      titles: titles.filter( (title) => {
        return title !== titles[index]
      }),
      companies: companies.filter( (company) => {
        return company !== companies[index]
      }),
      companyLinks: companyLinks.filter( (companyLink) => {
        return companyLink !== companyLinks[index]
      }),
      IDs: IDs.filter( (ID) => {
        return ID !== IDs[index]
      }),
      startDates: startDates.filter( (startDate) => {
        return startDate !== startDates[index]
      }),
      endDates: endDates.filter( (endDate) => {
        return endDate !== endDates[index]
      }),
    });
  };

  add = () => {
    const { form } = this.props;
    // can use data-binding to get
    const { keys, checkboxes } = form.getFieldsValue();
    const nextKeys = keys.concat(keys[keys.length - 1] + 1);
    const nextCheckboxes = checkboxes.concat(false);

    // can use data-binding to set
    // important! notify form to detect changes
    form.setFieldsValue({
      keys: nextKeys,
      checkboxes: nextCheckboxes
    });
  };

  createPayloads = (action, values) => {
    const experience = [];
    switch (action) {
      case "updateExperience":
        for (let i = 0; i < values.keys.length; i += 1) {
          experience.push({
                position: values.titles[i],
                company: values.companies[i],
                start_date: moment(values.startDates[i]).format('YYYY-MM'),
                end_date: !values.checkboxes[i] ? moment(values.endDates[i]).format('YYYY-MM') : "Present",
                link: values.companyLinks[i],
                id: values.IDs[i],
                changed: values.changed[i]
              })
        }
        return experience;
      case "removeExperience":
        return { id: values };
      default:
        return "Could not update"
    }
  };

  toggleDisabled = (e, index) => {
    const { form } = this.props;
    const { checkboxes } = form.getFieldsValue();

    form.setFieldsValue({
      checkboxes: checkboxes.map((checked, i) => {
        if (i === index) return !checked;
        return checked
      })
    })
  };

  handleSubmit = e => {
    e.preventDefault();
    const {form, dispatch} = this.props;
    // const { form } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        console.log("VALUES", values)

        const experience = this.createPayloads("updateExperience", values);

        console.log("EXPERIENCE", experience)

        dispatch({
          type: 'profile/EDIT_PROFILE',
          payload: {
            mutation: "updateExperience",
            data: { experience }
          }
        });

        // reset changed to false for every field
        const { changed } = form.getFieldsValue();
        for (let i = 0; i < changed.length; i += 1) {
          changed[i] = false;
        }
        form.setFieldsValue({ changed })
      }
    })
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

  // if your form doesn't have the fields these you set, this error will appear!
  // https://github.com/ant-design/ant-design/issues/8880

  render() {
    const { form, profile } = this.props;
    const { experience } = profile;
    const { getFieldDecorator, getFieldsValue } = form;
    const { visible } = this.state;

    getFieldDecorator('keys', { initialValue: experience.map((expObj, i) => i )});
    getFieldDecorator('IDs', { initialValue: experience.map((expObj) => expObj.id )});
    getFieldDecorator('changed', { initialValue: experience.map(() => false )});
    getFieldDecorator('checkboxes', { initialValue: experience.map ((expObj) => expObj.end_date === "Present")});

    const { keys, checkboxes } = getFieldsValue();

    const companyFormItem = keys.map((k, index) => {
      return (
        <div key={k}>
          <h5>
            <strong style={{marginRight: 8}}>Experience {index + 1} </strong>
            {keys.length > 1 ? (
              <Icon
                className="dynamic-delete-button"
                type="minus-circle-o"
                onClick={() => this.showModal(k, index)}
              />
            ) : null}
          </h5>
          <Form.Item
            label={`Company ${index + 1}`}
            required={false}
          >
            {getFieldDecorator(`companies[${index}]`, {
              validateTrigger: ['onChange', 'onBlur'],
              initialValue: index < experience.length ? experience[index].company : "",
              rules: [
                {
                  required: true,
                  whitespace: true,
                  message: "Please input additional experience or delete this field.",
                },
              ],
            })(<Input placeholder="e.g. EY" style={{width: '60%', marginRight: 8}} />)
            }
          </Form.Item>
          <Form.Item
            label={`Company ${index + 1} Hyperlink`}
            required={false}
          >
            {getFieldDecorator(`companyLinks[${index}]`, {
              validateTrigger: ['onChange', 'onBlur'],
              initialValue: index < experience.length ? experience[index].link : "",
              rules: [
                {
                  required: true,
                  whitespace: true,
                  message: "Not a valid URL. Sample URL e.g. https://chunesupply.com",
                  type: "url"
                },
              ],
            })(<Input
              placeholder="consulting.ey"
              style={{width: '60%', marginRight: 8}}
            />)}
          </Form.Item>
          <Form.Item
            label={`Title ${index + 1}`}
            required={false}
          >
            {getFieldDecorator(`titles[${index}]`, {
              validateTrigger: ['onChange', 'onBlur'],
              initialValue: index < experience.length ? experience[index].position : "",
              rules: [
                {
                  required: true,
                  whitespace: true,
                  message: "Please input additional experience or delete this field.",
                },
              ],
            })(<Input placeholder="e.g. Senior Consultant" style={{width: '60%', marginRight: 8}} />)}
          </Form.Item>
          <Form.Item
            label={`Start Date ${index + 1}`}
          >
            {getFieldDecorator(`startDates[${index}]`, {
              rules: [{
                type: 'object',
                required: true,
                message: 'Please select start date.',
              }],
              initialValue: index < experience.length ? moment(experience[index].start_date) : null
            })(
              <MonthPicker />
            )}
          </Form.Item>
          <Form.Item>
            <Checkbox
              onClick={(e) => this.toggleDisabled(e, index)}
              checked={checkboxes[index]}
            >
              I currently work here.
            </Checkbox>
          </Form.Item>
          <Form.Item
            label={`End Date ${index + 1}`}
            required={false}
          >
            {getFieldDecorator(`endDates[${index}]`, {
              rules: [{
                type: 'object',
                required: false,
                message: "Please select end date.",
              }],
              initialValue: index < experience.length && experience[index].end_date !== "Present" ? moment(experience[index].end_date) : null
            })(
              <MonthPicker
                disabled={checkboxes[index]}
              />
            )}
          </Form.Item>
        </div>
      )
    });

    return (
      <Form onSubmit={this.handleSubmit}>
        { companyFormItem }
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
        <div>
          <Modal
            title="Remove Experience Item?"
            visible={visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
          >
            <p>Are you sure you want to remove this experience item? It will be deleted from your profile.</p>
            <p>If yes, click OK. Otherwise you can cancel.</p>
          </Modal>
        </div>
      </Form>
    );
  }
}

export default ExperienceForm
