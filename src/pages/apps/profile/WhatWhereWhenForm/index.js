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

class WhatWhereWhenForm extends React.Component {

  state = {
    visible: false,
    k: null,
    index: null
  };

  getPayloads(type, values) {
    if (type === "Experience") {
      return this.createPayloads("updateExperience", values)
    }
    if (type === "Leadership") {
      return this.createPayloads("updateLeadership", values)
    }
    return null
  }

  remove = () => {
    const { form, dispatch, type, formAttributes } = this.props;
    const { k, index } = this.state;
    // can use data-binding to get
    // const { keys, titles, companies, companyLinks, IDs, startDates, endDates } = form.getFieldsValue();
    const { keys, positions, organizations, links, IDs, startDates, endDates } = form.getFieldsValue();
    const { deleteMutation } = this.getFormAttributes(type, formAttributes);

    // We need at least one passenger
    if (keys.length === 1) {
      return;
    }

    if (IDs[index]) {
      dispatch({
        type: 'profile/EDIT_PROFILE',
        payload: {
          mutation: deleteMutation,
          data: { id: IDs[index] }
        }
      });
    }

    // can use data-binding to set
    form.setFieldsValue({
      keys: keys.filter( (key) => {
        return key !== k
      }),
      positions: positions.filter( (position) => {
        return position !== positions[index]
      }),
      organizations: organizations.filter( (organization) => {
        return organization !== organizations[index]
      }),
      links: links.filter( (link) => {
        return link !== links[index]
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
    const payloads = [];

    console.log("values", values)

    switch (action) {
      case "updateExperience":
        for (let i = 0; i < values.keys.length; i += 1) {
          payloads.push({
            position: values.positions[i],
            company: values.organizations[i],
            start_date: moment(values.startDates[i]).format('YYYY-MM'),
            end_date: !values.checkboxes[i] ? moment(values.endDates[i]).format('YYYY-MM') : "Present",
            link: values.links[i],
            id: values.IDs[i],
            changed: values.changed[i]
          })
        }
        return { mutation: "updateExperience", data: { payloads } };
      case "updateLeadership":
        for (let i = 0; i < values.keys.length; i += 1) {
          payloads.push({
            position: values.positions[i],
            organization: values.organizations[i],
            start_date: moment(values.startDates[i]).format('YYYY-MM'),
            end_date: !values.checkboxes[i] ? moment(values.endDates[i]).format('YYYY-MM') : "Present",
            link: values.links[i],
            id: values.IDs[i],
            changed: values.changed[i]
          })
        }
        return { mutation: "updateLeadership", data: { payloads } };
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
    const {form, dispatch, type } = this.props;

    form.validateFields((err, values) => {
      if (!err) {
        const payload = this.getPayloads(type, values)

        console.log("payload", payload)

        dispatch({
          type: 'profile/EDIT_PROFILE',
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

  getFormAttributes = (type, formAttributes) => {
    switch (type) {
      case "Leadership":
        return formAttributes.leadership;
      case "Experience":
        return formAttributes.experience;
      case "Brags":
        return formAttributes.brags;
      default:
        return null
    }
  };

  getInitialValues = (type) => {
    const { profile } = this.props;
    const { leadership, experience } = profile;
    const initialValues = [];

    if (type === "Leadership") {
      return leadership
    }
    if (type === "Experience") {
      for (let i = 0; i < experience.length; i += 1) {
        initialValues.push({
          position: experience[i].position,
          organization: experience[i].company,
          link: experience[i].link,
          start_date: experience[i].start_date,
          end_date: experience[i].end_date,
          id: experience[i].id
        })
      }
      return initialValues
    }
    return initialValues
  };

  // if your form doesn't have the fields these you set, this error will appear!
  // https://github.com/ant-design/ant-design/issues/8880

  render() {
    const { form, formAttributes, type } = this.props;
    const { getFieldDecorator, getFieldsValue } = form;
    const { visible } = this.state;

    const { labels } = this.getFormAttributes(type, formAttributes);
    const initialValues = this.getInitialValues(type);

    getFieldDecorator('keys', { initialValue: initialValues.map((expObj, i) => i )});
    getFieldDecorator('IDs', { initialValue: initialValues.map((expObj) => expObj.id )});
    getFieldDecorator('changed', { initialValue: initialValues.map(() => false )});
    getFieldDecorator('checkboxes', { initialValue: initialValues.map ((expObj) => expObj.end_date === "Present")});

    const { keys, checkboxes } = getFieldsValue();

    const companyFormItem = keys.map((k, index) => {
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
          <Form.Item
            label={`${labels[0]} ${index + 1}`}
            required={false}
          >
            {getFieldDecorator(`organizations[${index}]`, {
              validateTrigger: ['onChange', 'onBlur'],
              initialValue: index < initialValues.length ? initialValues[index].organization : "",
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
            label={`${labels[1]} ${index + 1} Hyperlink`}
            required={false}
          >
            { getFieldDecorator(`links[${index}]`, {
              validateTrigger: ['onChange', 'onBlur'],
              initialValue: index < initialValues.length ? initialValues[index].link : "",
              rules: [
                {
                  required: true,
                  whitespace: true,
                  message: "Not a valid URL. Sample URL: https://chunesupply.com",
                  type: "url"
                },
              ],
            })(<Input
              placeholder="consulting.ey"
              style={{width: '60%', marginRight: 8}}
            />)}
          </Form.Item>
          <Form.Item
            label={`${labels[2]} ${index + 1}`}
            required={false}
          >
            {getFieldDecorator(`positions[${index}]`, {
              validateTrigger: ['onChange', 'onBlur'],
              initialValue: index < initialValues.length ? initialValues[index].position : "",
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
            required={false}
          >
            {getFieldDecorator(`startDates[${index}]`, {
              rules: [{
                type: 'object',
                required: true,
                message: 'Please select start date.',
              }],
              initialValue: index < initialValues.length ? moment(initialValues[index].start_date) : null
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
                required: true,
                message: "Please select end date.",
              }],
              initialValue: index < initialValues.length && initialValues[index].end_date !== "Present" ? moment(initialValues[index].end_date) : null
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
        {companyFormItem}
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

export default WhatWhereWhenForm
