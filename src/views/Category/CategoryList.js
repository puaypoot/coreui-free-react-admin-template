import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardBody, CardHeader, Col, Row, Table, Button } from 'reactstrap';
import SweetAlert from 'react-bootstrap-sweetalert'

import { fetchList, deleteCategory } from '../../api/Category'

function CategoryRow(props) {
  const category = props.category
  const categoryLink = `/category/${category.id}/edit`
  const deleteCategory = () => {
    props.handleDelete(category)
  }

  return (
    <tr key={category.id.toString()}>
      <th scope="row"><Link to={categoryLink}>{category.id}</Link></th>
      <td><Link to={categoryLink}>{category.name}</Link></td>
      <td>{category.slug}</td>
      <td>
        <Link to={categoryLink}>
          <Button size="sm" color="warning" className="btn-pill"><i className="fa fa-edit"></i>&nbsp;Edit</Button>
        </Link>
        &nbsp;
        <Button onClick={deleteCategory} size="sm" color="danger" className="btn-pill"><i className="fa fa-edit"></i>&nbsp;Delate</Button>
      </td>
    </tr>
  )
}

class Categories extends Component {
  state = {
    list: [],
    focusingCategory: undefined,
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
      focusingCategory : undefined
    })
  }

  hideSuccessDialog = () => {
    this.setState({
      showSuccessDialog : false
    })
  }

  deleteCategory = async () => {
    await deleteCategory(this.state.focusingCategory.id)
    this.setState({
      focusingCategory : undefined,
      showSuccessDialog: true
    })
    this.getList()
  }

  handleDelete = (category) => {
    this.setState({
      focusingCategory: category
    })
  }

  renderWarningDialog(){
    if(this.state.focusingCategory) {
      return (<SweetAlert
        danger
        showCancel
        confirmBtnText="Yes, delete it!"
        confirmBtnBsStyle="danger"
        cancelBtnBsStyle="default"
        title="Delete Category?"
        onConfirm={this.deleteCategory}
        onCancel={this.hideWarningDialog}
      >
        You will not be able to recover this category!
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
        Category has been deleted.
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
                  <i className="fa fa-align-justify"></i> Categories
                <div className="card-header-actions">
                  {/* <Link to='category/create'>
                    <Button size="sm" color="primary" className="btn-pill"><i className="fa fa-plus"></i>&nbsp;Create Category</Button>
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
                    {this.state.list.map((category, index) =>
                      <CategoryRow key={index} category={category} handleDelete={this.handleDelete}/>
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

export default Categories;
