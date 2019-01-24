import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import {
  Card, CardBody, CardHeader, CardFooter,
  Col, Row, Table, Button
} from 'reactstrap'
import SweetAlert from 'react-bootstrap-sweetalert'
import Select from 'rc-select'
import Pagination from 'rc-pagination'
import localeInfo from 'rc-pagination/lib/locale/en_US'
import 'rc-pagination/assets/index.css'
import 'rc-select/assets/index.css'

import { fetchList, deletePost } from '../../api/Post'

function PostRow(props) {
  const post = props.post
  const postLink = `/post/${post.id}/edit`
  const deletePost = () => {
    props.handleDelete(post)
  }

  return (
    <tr key={post.id.toString()}>
      <th scope="row"><Link to={postLink}>{post.id}</Link></th>
      <td><Link to={postLink}>{post.name}</Link></td>
      <td>
        <Link to={postLink}>
          <Button size="sm" color="warning" className="btn-pill"><i className="fa fa-edit"></i>&nbsp;Edit</Button>
        </Link>
        &nbsp;
        <Button onClick={deletePost} size="sm" color="danger" className="btn-pill"><i className="fa fa-edit"></i>&nbsp;Delate</Button>
      </td>
    </tr>
  )
}

class Posts extends Component {
  state = {
    list: [],
    focusingPost: undefined,
    showSuccessDialog: false,
    pagination: {
      total: 0
    },
    queryParams: {
      search: '',
      page: 1,
      limit: 40,
      category_slug: '',
      place_slug: ''
    }
  }

  componentDidMount() {
    this.getList()
  }

  getList = () => {
    fetchList(this.state.queryParams).then(response => {
      this.setState({
        list: response.data.data || [],
        pagination: {
          total: response.data.total || 0
        },
      })
    })
  }

  hideWarningDialog = () => {
    this.setState({
      focusingPost : undefined
    })
  }

  hideSuccessDialog = () => {
    this.setState({
      showSuccessDialog : false
    })
  }

  deletePost = async () => {
    await deletePost(this.state.focusingPost.id)
    this.setState({
      focusingPost : undefined,
      showSuccessDialog: true
    })
    this.getList()
  }

  handleDelete = (post) => {
    this.setState({
      focusingPost: post
    })
  }

  handlePaginationChange = async (current, pageSize) => {
    await this.setState({
      queryParams: {
        ...this.state.queryParams, ...{
          page: current,
          limit: pageSize
        }
      }
    })
    this.getList()
  }

  renderWarningDialog(){
    if(this.state.focusingPost) {
      return (<SweetAlert
        danger
        showCancel
        confirmBtnText="Yes, delete it!"
        confirmBtnBsStyle="danger"
        cancelBtnBsStyle="default"
        title="Delete Post?"
        onConfirm={this.deletePost}
        onCancel={this.hideWarningDialog}
      >
        You will not be able to recover this post!
      </SweetAlert>)
    }
  }

  renderSuccessDoalog(){
    if(this.state.showSuccessDialog) {
      return (<SweetAlert
        success
        title='Success'
        timeout={2000}
        onConfirm={this.hideSuccessDialog}
      >
        Post has been deleted.
      </SweetAlert>)
    }
  }

  render() {
    return (
      <div className="animated fadeIn">
        { this.renderWarningDialog() }
        { this.renderSuccessDoalog() }
        <Row>
          <Col xl={12}>
            <Card>
              <CardHeader>
                  <i className="fa fa-align-justify"></i> Posts
                <div className="card-header-actions">
                  <Link to='post/create'>
                    <Button size="sm" color="primary" className="btn-pill"><i className="fa fa-plus"></i>&nbsp;Create Post</Button>
                  </Link>
                </div>
              </CardHeader>
              <CardBody>
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th scope="col">id</th>
                      <th scope="col">name</th>
                      <th scope="col">action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.list.map((post, index) =>
                      <PostRow key={index} post={post} handleDelete={this.handleDelete}/>
                    )}
                  </tbody>
                </Table>
              </CardBody>
              <CardFooter>
                <Pagination
                  selectComponentClass={Select}
                  showSizeChanger
                  defaultPageSize={40}
                  onShowSizeChange={this.handlePaginationChange}
                  showQuickJumper
                  onChange={this.handlePaginationChange}
                  current={this.state.queryParams.page}
                  total={this.state.pagination.total}
                  showTotal={(total, range) => `${range[0]} - ${range[1]} of ${total} items`}
                  locale={localeInfo}
                />
              </CardFooter>
            </Card>
          </Col>
        </Row>
      </div>
    )
  }
}

export default Posts
