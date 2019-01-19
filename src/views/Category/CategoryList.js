import React, { Component } from 'react';
import { Link } from 'react-router-dom';
// import { Badge, Card, CardBody, CardHeader, Col, Row, Table } from 'reactstrap';
import { Card, CardBody, CardHeader, Col, Row, Table } from 'reactstrap';

import { fetchList } from '../../api/Category'

function CategoryRow(props) {
  const category = props.category
  const categoryLink = `/category/${category.slug}`

  // const getBadge = (status) => {
  //   return status === 'Active' ? 'success' :
  //     status === 'Inactive' ? 'secondary' :
  //       status === 'Pending' ? 'warning' :
  //         status === 'Banned' ? 'danger' :
  //           'primary'
  // }

  return (
    <tr key={category.id.toString()}>
      <th scope="row"><Link to={categoryLink}>{category.id}</Link></th>
      <td><Link to={categoryLink}>{category.name}</Link></td>
      <td>{category.slug}</td>
      {/* <td>
        <Link to={categoryLink}>
          <Badge color={getBadge(category.status)}>{category.status}</Badge>
        </Link>
      </td> */}
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
                <i className="fa fa-align-justify"></i> Categories <small className="text-muted">....</small>
              </CardHeader>
              <CardBody>
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th scope="col">id</th>
                      <th scope="col">name</th>
                      <th scope="col">slug</th>
                      {/* <th scope="col">action</th> */}
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
