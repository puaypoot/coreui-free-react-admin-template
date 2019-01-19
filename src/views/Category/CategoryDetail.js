import React, { Component } from 'react';
import { Card, CardBody, CardHeader, Col, Row, Table } from 'reactstrap';

import { fetchCategory } from '../../api/Category'

class Category extends Component {
  state =  {
    category: {
        id: null,
        name: '',
        slug: '',
    }
  }

  getDetail() {
    fetchCategory(this.props.slug).then(response => {
      let category = response.data || []
      if(category!==[]) {
        this.setState({
          category: {
            id: category.id,
            name: category.name,
            slug: category.slug,
          }
        })
      }
    })
  }

  componentDidMount() {
    this.getDetail(this.props.slug)
  }

  render() {
    let category = this.state
    return (
      <div className="animated fadeIn">
        <Row>
          <Col lg={6}>
            <Card>
              <CardHeader>
                <strong><i className="icon-info pr-1"></i>Category id: {this.state.id}</strong>
              </CardHeader>
              <CardBody>
                  <Table responsive striped hover>
                    <tbody>
                      {
                        Object.keys(category).forEach(function (key) {
                          return (
                            <tr key={key}>
                              <td>{`${key}:`}</td>
                              <td><strong>{category[key]}</strong></td>
                            </tr>
                          )
                       })
                      }
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

export default Category;
