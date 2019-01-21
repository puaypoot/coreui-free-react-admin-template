import React, { Component } from 'react';
import {
  Card, CardBody, CardHeader, Col, Row,
  Form, FormGroup, Label, FormText, CardFooter, Button
} from 'reactstrap';

import { fetchCategory } from '../../api/Category'

class Category extends Component {
  state =  {
    id: null,
    name: '',
    slug: '',
    defaultData: {
      id: null,
      name: '',
      slug: '',
    }
  }

  componentDidMount() {
    let id = this.props.match.params.id
    if(id) {
      this.getDetail(id)
    }
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
                <Button size="sm" color="primary"><i className="fa fa-dot-circle-o"></i> Submit</Button>&nbsp;
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
