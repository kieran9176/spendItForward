import React from 'react'
import { connect } from 'react-redux'
import { Tag, Input, Icon, Button } from 'antd';
import { TweenOneGroup } from 'rc-tween-one';

@connect(({ profile }) => ({ profile }))
class CourseworkForm extends React.Component {

  constructor(props) {
    super(props);
    const { coursework }  = props.profile;
    const tags = coursework.map(courseworkInstance => courseworkInstance.course_name);
    this.state = {
      tags,
      coursework,
      inputVisible: false,
      inputValue: '',
    };
  }

  handleClose = removedTag => {
    let { tags, coursework } = this.state
    tags = tags.filter(tag => tag !== removedTag);
    coursework = coursework.map(courseworkInstance => {
      if (courseworkInstance.course_name === removedTag) courseworkInstance.action = "remove";
      return courseworkInstance
    });
    this.setState({ tags, coursework });
  };

  showInput = () => {
    // this.setState({ inputVisible: true }, () => this.input.focus());
    this.setState({ inputVisible: true });
  };

  handleInputChange = e => {
    this.setState({ inputValue: e.target.value });
  };

  handleInputConfirm = () => {
    const { inputValue, coursework } = this.state;
    let { tags } = this.state;
    if (inputValue && tags.indexOf(inputValue) === -1) {
      tags = [...tags, inputValue];
      coursework.push({ course_name: inputValue, id: null, action: "add"});
    }
    this.setState({
      tags,
      coursework,
      inputVisible: false,
      inputValue: '',
    });
  };

  forMap = tag => {
    const tagElem = (
      <Tag
        closable
        onClose={e => {
          e.preventDefault();
          this.handleClose(tag);
        }}
      >
        {tag}
      </Tag>
    );
    return (
      <span key={tag} style={{ display: 'inline-block' }}>
        {tagElem}
      </span>
    );
  };

  saveInputRef = (input) => {
    this.input = input
  };

  handleSubmit = e => {
    e.preventDefault();
    // const { dispatch } = this.props
    const { tags, coursework } = this.state;
    const { dispatch } = this.props;

    dispatch({
      type: 'profile/EDIT_PROFILE',
      payload: {
        mutation: "updateCoursework",
        data: { coursework }
      }
    });

    console.log("COURSEWORK", coursework)
    console.log("TAGS", tags)

  };

  render() {
    const {tags, inputVisible, inputValue} = this.state;
    const tagChild = tags.map(this.forMap);

    return (
      <div>
        <div style={{marginBottom: 16}}>
          <TweenOneGroup
            enter={{
              scale: 0.8,
              opacity: 0,
              type: 'from',
              duration: 100,
              onComplete: e => {
                e.target.style = '';
              },
            }}
            leave={{opacity: 0, width: 0, scale: 0, duration: 200}}
            appear={false}
          >
            {tagChild}
          </TweenOneGroup>
        </div>
        <div style={{marginBottom: 16}}>
          {inputVisible && (
            <Input
              ref={this.saveInputRef}
              type="text"
              size="small"
              style={{width: 78}}
              value={inputValue}
              onChange={this.handleInputChange}
              onBlur={this.handleInputConfirm}
              onPressEnter={this.handleInputConfirm}
            />
          )}
          {!inputVisible && (
            <Tag onClick={this.showInput} style={{background: '#fff', borderStyle: 'dashed'}}>
              <Icon type="plus" /> New Tag
            </Tag>
          )}
        </div>
        <div>
          <Button type="primary" onClick={this.handleSubmit}>
            Submit
          </Button>
        </div>
      </div>
    )
  }
}

export default CourseworkForm
