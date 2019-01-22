import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardBody, CardHeader, Col, Row, Table, Button } from 'reactstrap';
import SweetAlert from 'react-bootstrap-sweetalert'

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
      <td>{post.slug}</td>
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
    showSuccessDialog: false
  }

  componentDidMount() {
    this.getList()
  }

  getList = () => {
    fetchList({}).then(response => {
      let list = response.data.data || []
      this.setState({
        list: list
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
                  {/* <Link to='post/create'>
                    <Button size="sm" color="primary" className="btn-pill"><i className="fa fa-plus"></i>&nbsp;Create Post</Button>
                  </Link> */}
                </div>
              </CardHeader>
              <CardBody>
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th scope="col">id</th>
                      <th scope="col">name</th>
                      <th scope="col">slug</th>
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
            </Card>
          </Col>
        </Row>
      </div>
    )
  }
}

export default Posts;
