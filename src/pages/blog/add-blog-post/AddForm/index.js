import React from 'react'
import { connect } from 'react-redux'
import { Link, withRouter } from 'react-router-dom'
import { injectIntl } from 'react-intl'
import { Form, Input, Icon } from 'antd'
import SimpleStaticToolbarEditor from "../../../../components/Editor/SimpleToolbarEditor"
import styles from './style.module.scss'

@withRouter
@Form.create()
@connect(({ profile }) => ({ profile }))
@injectIntl
class AddForm extends React.Component {

  state = {
    showSearch: true,
    // searchText: '',
  };

  showLiveSearch = () => {
    this.setState({
      showSearch: true,
    })
  };

  hideLiveSearch = () => {
    this.setState({
      showSearch: false,
    })
  };

  render() {

    const {
      intl: {formatMessage}
    } = this.props;

    const { showSearch } = this.state;
    const { form, match, dispatch } = this.props;
    const { params } = match;
    const { id, status } = params;

    console.log("addForm match", match);

    if (status === "true") {
      dispatch({
        type: 'profile/CREATE_POST',
        post: {
          id,
          html: '<p>Let&apos;s hear it.</p>',
          markdown: "Let's hear it.",
          url: '',
          title: 'Insert title ...',
          series: ''
        }
      });
    }

    dispatch({
      type: 'profile/CURRENT_POST',
      payload: { status, id, saved: "false" }
    });

    return (
      <div className="d-inline-block mr-4">
        <Input
          className={styles.extInput}
          placeholder={formatMessage({id: 'topBar.typeToSearch'})}
          prefix={<Icon type="search" style={{color: 'rgba(0,0,0,.25)'}} />}
          style={{width: 200}}
          onFocus={this.showLiveSearch}
        />
        <div
          className={`${
            showSearch ? `${styles.livesearch} ${styles.livesearchVisible}` : styles.livesearch
            }`}
          id="livesearch"
        >
          <button className={styles.close} type="button" onClick={this.hideLiveSearch}>
            <Link to='/blog/feed/'>
              <span className="utils__visibilityHidden">Закрыть</span>
              <i className="icmn-cross" />
            </Link>
          </button>
          <div className="container-fluid">
            <div className={styles.wrapper}>
              <div className={styles.logoContainer}>
                <img className={styles.logo} src="resources/images/logo.png" alt="" />
              </div>
              <div className={styles.bodyInput}>
                <SimpleStaticToolbarEditor form={form} match={match} />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default AddForm
