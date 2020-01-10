import React from 'react'
import { connect } from 'react-redux'
import { Tooltip, Checkbox, notification } from 'antd'
// import data from './data.json'
import styles from './style.module.scss'

@connect(({ profile }) => ({ profile }))
class ProductCard extends React.Component {

  constructor(props) {
    super(props);
    const { profile } = props;
    const { siteMetadata } = profile;

    this.state = {
      selectedTheme: {
        themeID: siteMetadata[0].themeID,
        themeName: siteMetadata[0].themeName
      }
    }
  }

  isProductSelected = (id) => {
    const {selectedTheme} = this.state;
    const {themeID} = selectedTheme;
    return id === themeID
  };

  onChange = (e, themeID, themeName) => {

    const {dispatch} = this.props;

    if (e.target.checked === false) notification.error({
      message: "Theme Already Selected",
      description: "To select a new theme, check its corresponding box."
    });
    else {
      dispatch({
        type: 'profile/SELECT_THEME',
        payload: {
          mutation: "selectTheme",
          data: {themeID, themeName}
        }
      });
      notification.success({
        message: `"${themeName}" Theme Selected`,
        description: "Your profile has been updated accordingly."
      });
      this.setState({
        selectedTheme: {
          themeID,
          themeName
        }
      });
    }
  };

  render() {

    const { profile } = this.props;
    const { themeOptions } = profile;

    const productCardItems = themeOptions.map((theme) => {

      const {
        id,
        productStatus,
        productImg,
        productName,
        productPrice,
        productOldPrice,
        productNote,
        productDemo
      } = theme;

      const isProductSelected = this.isProductSelected(id);

      return (
        <div className="col-xl-4 col-lg-6 col-md-12" key={Math.random()}>
          <div key={id} className={styles.productCard}>
            <div className={styles.img}>
              {productStatus === 'new' && (
                <div className={styles.status}>
                  <span className={styles.statusTitle}>New</span>
                </div>
              )}
              <a href={productDemo} target="_blank" rel="noopener noreferrer">
                <img src={productImg} alt="" />
              </a>
            </div>
            <div className={styles.title}>
              <a href={productDemo} target="_blank" rel="noopener noreferrer">{productName}</a>
              <div className={styles.price}>
                {productPrice}
                <div className={styles.oldPrice}>{productOldPrice}</div>
                <Checkbox onChange={(e) => this.onChange(e, id, productName)} checked={isProductSelected}>Select</Checkbox>
              </div>
            </div>
            <div className={styles.descr}>
              <div className={styles.sizes}>
                <Tooltip placement="top" title="Intro">
                  <span>I</span>
                </Tooltip>
                <Tooltip placement="top" title="Professional Experience">
                  <span title="Professional Experience">P</span>
                </Tooltip>
                <Tooltip placement="top" title="Education">
                  <span>E</span>
                </Tooltip>
              </div>
              {productNote}
            </div>
          </div>
        </div>)
    });
    return ([productCardItems])
  }
}

export default ProductCard
