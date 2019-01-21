import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardBody, CardHeader, Col, Row, Table, Button } from 'reactstrap';

import { fetchList } from '../../api/Category'

function CategoryRow(props) {
  const category = props.category
  const categoryLink = `/category/${category.id}/edit`
  const deleteCategory = () => {
    console.log('delete')
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
    list: []
  }

  componentDidMount() {
    this.getList()
  }

  getList() {
    fetchList({}).then(response => {
      let list = response.data.data || []
      this.setState({
        list: list
      })
    })
  }

  render() {
    return (
      <div className="animated fadeIn">
        <Row>
          <Col xl={12}>
            <Card>
              <CardHeader>
                <i className="fa fa-align-justify"></i> Categories
                <div className="card-header-actions">
                  <Link to='category/create'>
                    <i className="fa fa-plus"></i>&nbsp;Create Category
                  </Link>
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
                      <CategoryRow key={index} category={category}/>
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
