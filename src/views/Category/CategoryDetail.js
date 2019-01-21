import React, { Component } from 'react';
import {
  Card, CardBody, CardHeader, Col, Row,
  Form, FormGroup, Label, FormText, CardFooter, Button
} from 'reactstrap';
import SweetAlert from 'react-bootstrap-sweetalert'

import { fetchCategory, createCategory, updateCategory } from '../../api/Category'

class Category extends Component {
  state =  {
    id: undefined,
    name: '',
    slug: '',
    defaultData: {
      id: undefined,
      name: '',
      slug: '',
    },
    showSuccessDialog: false
  }

  componentDidMount() {
    let id = this.props.match.params.id
    if(id) {
      this.getDetail(id)
    }
  }

  submitData = async () => {
    let data = {
      name: this.state.name,
      slug: this.state.slug,
    }
    if(this.state.id!==undefined) {
      await updateCategory(this.state.id, data)
    } else {
      await createCategory(data)
    }
    this.setState({
      showSuccessDialog: true
    })
  }

  getDetail(slug) {
    fetchCategory(slug).then(response => {
      let resData = response.data || {}
      if(resData!==[]) {
        this.setState({
          defaultData: {
            id: resData.id,
            name: resData.name,
            slug: resData.slug,
          },
          id: resData.id,
          name: resData.name,
          slug: resData.slug,
        })
      }
    })
  }

  reset = () => {
    this.setState({...this.state.defaultData})
  }

  handleChange = (event) => {
    let category = {...{
      id: this.state.id,
      name: this.state.name,
      slug: this.state.slug,
    }}
    category[event.target.id] = event.target.value
    this.setState(category);
  }

  renderCardHeaderContent = () => {
    if(this.state.id) {
      return (<strong><i className="icon-info pr-1"></i>Category id: {this.state.id}</strong>)
    }
    return (<strong><i className="icon-info pr-1"></i>New Category</strong>)
  }

  updateSuccess = () => {
    this.setState({
      showSuccessDialog: false
    })
    if(this.state.id) {
      return true
    }
    this.props.history.push('/category')
  }

  renderSuccessDialog = () => {
    if(this.state.showSuccessDialog) {
      const msg = `Category has been ${(this.state.id)? 'updated' : 'created'}.`
      return (
        (<SweetAlert
          title='Success'
          success
          timeout={2000}
          onConfirm={this.updateSuccess}
        >
          {msg}
        </SweetAlert>)
      )
    }
  }

  render() {
    let category = {
      name: this.state.name,
      slug: this.state.slug
    }
    return (
      <div className="animated fadeIn">
        <Row>
          <Col lg={6}>
            <Card>
              <CardHeader>
                { this.renderCardHeaderContent() }
                { this.renderSuccessDialog() }
              </CardHeader>
              <CardBody>
                <Form>
                  <FormGroup>
                    <Label htmlFor="name">Name</Label>
                    <input className="form-control" type="text" id="name" placeholder="Enter Name.." value={category.name} onChange={this.handleChange}/>
                    <FormText className="help-block">Please enter category name</FormText>
                  </FormGroup>
                  <FormGroup>
                    <Label htmlFor="slug">Slug</Label>
                    <input className="form-control" type="text" id="slug" placeholder="Enter Slug.." value={category.slug} onChange={this.handleChange} />
                    <FormText className="help-block">Please enter category slug</FormText>
                  </FormGroup>
                </Form>
              </CardBody>
              <CardFooter>
                <Button size="sm" onClick={this.submitData} color="primary"><i className="fa fa-dot-circle-o"></i> Submit</Button>&nbsp;
                <Button size="sm" onClick={this.reset} color="danger"><i className="fa fa-ban"></i> Reset</Button>
              </CardFooter>
            </Card>
          </Col>
        </Row>
      </div>
    )
  }
}

export default Category;
