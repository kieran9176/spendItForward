import React from 'react'
import { connect } from 'react-redux'
import { Tag, Input, Icon, Button } from 'antd';
import { TweenOneGroup } from 'rc-tween-one';

@connect(({ profile }) => ({ profile }))
class SkillsForm extends React.Component {

  constructor(props) {
    super(props);
    const { skills }  = props.profile;
    const tags = skills.map(skill => skill.content);
    this.state = {
      tags,
      skills,
      inputVisible: false,
      inputValue: '',
    };
  }

  handleClose = removedTag => {
    let { tags, skills } = this.state
    tags = tags.filter(tag => tag !== removedTag);
    skills = skills.map(skill => {
      if (skill.content === removedTag) skill.action = "remove";
      return skill
    });
    this.setState({ tags, skills });
  };

  showInput = () => {
    // this.setState({ inputVisible: true }, () => this.input.focus());
    this.setState({ inputVisible: true });
  };

  handleInputChange = e => {
    this.setState({ inputValue: e.target.value });
  };

  handleInputConfirm = () => {
    const { inputValue, skills } = this.state;
    let { tags } = this.state;
    if (inputValue && tags.indexOf(inputValue) === -1) {
      tags = [...tags, inputValue];
      skills.push({ content: inputValue, id: null, action: "add"});
    }
    this.setState({
      tags,
      skills,
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
    const { tags, skills } = this.state;
    const { dispatch } = this.props;

    dispatch({
      type: 'profile/EDIT_PROFILE',
      payload: {
        mutation: "updateSkills",
        data: { skills }
      }
    });

    console.log("SKILLS", skills)
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

export default SkillsForm
