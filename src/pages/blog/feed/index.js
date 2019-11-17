import React from 'react'
import { Link, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { Input, Icon, Pagination } from 'antd'
import { Helmet } from 'react-helmet'
import styles from './style.module.scss'
import data from './data.json'

const { Search } = Input

@withRouter
@connect(({ profile }) => ({ profile }))
class BlogFeed extends React.Component {
  state = {
    articlesCategories: data.articlesCategories,
    latestArticlesData: data.latestArticlesData,
  }

  render() {
    const { articlesCategories, latestArticlesData } = this.state;
    const { profile } = this.props;
    const { firstName, lastName, posts } = profile;

    return (
      <div>
        <Helmet title="Blog Feed" />
        <section className="card">
          <div className="card-header">
            <div className="utils__title">
              <strong>Blog Feed</strong>
            </div>
          </div>
          <div className="card-body">
            <div className={styles.blogFeed}>
              <div className="row">
                <div className="col-lg-8">
                  <main>
                    {posts.map( (article) => (
                      <article className={styles.article} key={article.title}>
                        <div className={styles.information}>
                          <div className={styles.title}>
                            <h1>
                              <a href="javascript: void(0);">{article.title}</a>
                            </h1>
                          </div>
                          <ul className={styles.meta}>
                            <li className={styles.metaInf}>
                              <span>
                                Post By <a href="javascript: void(0);">{firstName} {lastName}</a>
                              </span>
                            </li>
                            <li className={styles.metaInf}>
                              <span className={styles.articleDate}>{`On ${article.date_published}`}</span>
                            </li>
                          </ul>
                        </div>
                        <div className={styles.articleMedia}>
                          <a href="javascript: void(0);" className={styles.link}>
                            <img src={article.image_url} alt={article.title} />
                          </a>
                        </div>
                        <div className={styles.content}>
                          <p dangerouslySetInnerHTML={{ __html: article.caption }} />
                          <div className={styles.articleMore}>
                            <Link to={`/blog/edit-blog-post/${article.id}`}>
                              Edit
                              <i className="ml-2 fa fa-angle-right" aria-hidden="true" />
                            </Link>
                          </div>
                        </div>
                        <footer className={styles.footer}>
                          <div className="row">
                            <div className="col-8">
                              <div className={styles.hashtags}>
                                <a href="javascript: void(0);" key={article.series}>
                                  {article.series}
                                </a>
                              </div>
                            </div>
                            <div className="col-4">
                              <ul className={styles.share}>
                                <li className={styles.shareItem}>
                                  <a href="javascript: void(0);">
                                    <i className="fa fa-facebook" />
                                  </a>
                                </li>
                                <li className={styles.shareItem}>
                                  <a href="javascript: void(0);">
                                    <i className="fa fa-twitter" />
                                  </a>
                                </li>
                                <li className={styles.shareItem}>
                                  <a href="javascript: void(0);">
                                    <i className="fa fa-pinterest-p" />
                                  </a>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </footer>
                      </article>
                    ))}
                  </main>
                  <div className="mb-5">
                    <Pagination defaultCurrent={1} total={50} />
                  </div>
                </div>
                <div className="col-lg-4">
                  <aside className={styles.sidebar}>
                    <div className={styles.partition}>
                      <div className={styles.partitionHead}>
                        <span className={styles.partitionName}>Search</span>
                      </div>
                      <div className="input-group">
                        <Search
                          placeholder="Search ..."
                          enterButton={
                            <span>
                              <Icon type="search" /> Search
                            </span>
                          }
                        />
                      </div>
                    </div>
                    <div className={styles.partition}>
                      <div className={styles.partitionHead}>
                        <span className={styles.partitionName}>Categories</span>
                      </div>
                      <ul className={styles.categoriesList}>
                        {articlesCategories.map(category => (
                          <li className={styles.categoriesItem} key={category}>
                            <a className={styles.categoriesLink} href="javascript: void(0);">
                              {category}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className={styles.partition}>
                      <div className={styles.partitionHead}>
                        <span className={styles.partitionName}>Latest post</span>
                      </div>
                      {latestArticlesData.map(latestArticle => (
                        <article className={styles.latestPost} key={latestArticle.name}>
                          <div className={styles.latestImg}>
                            <a href="javascript: void(0);">
                              <img src={latestArticle.cover} alt={latestArticle.name} />
                            </a>
                          </div>
                          <div className={styles.latestData}>
                            <div className={styles.latestName}>
                              <h2>
                                <a href="javascript: void(0);">{latestArticle.name}</a>
                              </h2>
                            </div>
                            <ul className={`${styles.latestArticleMeta} ${styles.meta}`}>
                              <li className={styles.metaInf}>
                                <span className={styles.articleAuthor}>
                                  Post By <a href="javascript: void(0);">{latestArticle.author}</a>
                                </span>
                              </li>
                              <li className={styles.metaInf}>
                                <span className={styles.articleDate}>
                                  {`On ${latestArticle.date}`}
                                </span>
                              </li>
                            </ul>
                          </div>
                        </article>
                      ))}
                    </div>
                    <div className={styles.partition}>
                      <div className={styles.partitionHead}>
                        <span className={styles.partitionName}>Subscribe</span>
                      </div>
                      <div className="input-group">
                        <Input
                          addonBefore={<Icon type="mail" />}
                          placeholder="Email address"
                          size="default"
                        />
                      </div>
                    </div>
                  </aside>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    )
  }
}

export default BlogFeed
