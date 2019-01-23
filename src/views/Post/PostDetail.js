import React, { Component } from 'react'
import {
  Card, CardBody, CardHeader, Col, Row,
  Form, FormGroup, Label, FormText, CardFooter, Button,
  InputGroup, InputGroupAddon, InputGroupText,
} from 'reactstrap'
import _ from 'lodash';
import { AppSwitch } from '@coreui/react'
import { Researcher, Paper } from "yoastseo"
import SweetAlert from 'react-bootstrap-sweetalert'
import { Editor } from '@tinymce/tinymce-react';

import { fetchPost, createPost, updatePost } from '../../api/Post'
import { fetchList } from '../../api/Category'

const TINYMCE_API_KEY = 'q8einue2despggbo73kbx41ejpnxm3071dfgcv6s3i2ztxfc'
const FRONT_WEB_DETAIL_BASE_URL = 'http://localhost:3000/p/'

const tinymceSetting = {
  selector: 'textarea',
  height: 700,
  block_formats: 'Paragraph=p;Header 1=h1;Header 2=h2;Header 3=h3;Header 4=h4;Header 5=h5;Header 6=h6',
  toolbar1: "formatselect fontsizeselect fontselect | alignleft aligncenter alignright alignjustify | forecolor backcolor",
  toolbar2: "image charmap insertdatetime fullpage | link  | numlist bullist outdent indent ltr rtl | removeformat | fullscreen",
  plugins: "image imagetools charmap directionality media hr textcolor textpattern autolink link insertdatetime fullpage fullscreen lists",
  contextmenu: "link image table spellchecker",
  content_css: "https://firebasestorage.googleapis.com/v0/b/punpro-test.appspot.com/o/content-style.css?alt=media"
}

class PostDetail extends Component {
  state =  {
    id: undefined,
    formPostInput: {
      name: '',
      post_url_key: '',
      status: 2,
      content: ''
    },
    categories: [],
    defaultSelectedCategory: [],
    selectedCategory: [],
    defaultData: {
      name: '',
      post_url_key: '',
      status: 2,
      content: ''
    },
    renderState: {
      showSuccessDialog: false,
    },
    seoChecker: {
      urlLength: undefined,
      wordCountInText: undefined,
      findKeywordInPageTitle: undefined,
      calculateFleschReading: undefined,
      getLinkStatistics: undefined,
      getLinks: undefined,
      linkCount: undefined,
      imageCount: undefined,
      altTagCount: undefined,
      matchKeywordInSubheadings: undefined,
      keywordCount: undefined,
      getKeywordDensity: undefined,
      stopWordsInKeyword: undefined,
      stopWordsInUrl: undefined,
      metaDescriptionLength: undefined,
      keyphraseLength: undefined,
      keywordCountInUrl: undefined,
      firstParagraph: undefined,
      metaDescriptionKeyword: undefined,
      pageTitleWidth: undefined,
      wordComplexity: undefined,
      getParagraphLength: undefined,
      countSentencesFromText: undefined,
      countSentencesFromDescription: undefined,
      getSubheadingTextLengths: undefined,
      findTransitionWords: undefined,
      passiveVoice: undefined,
      getSentenceBeginnings: undefined,
      relevantWords: undefined,
      readingTime: undefined,
      getTopicDensity: undefined,
      topicCount: undefined,
      sentences: undefined,
      keyphraseDistribution: undefined,
      morphology: undefined,
      functionWordsInKeyphrase: undefined,
      h1s: undefined,
    }
  }

  updateSEOChecker = () => {
    const paper = new Paper( this.state.formPostInput.content, {
      keyword: "analyze",
    });
    const researcher = new Researcher( paper );
    let seoChecker = {...this.state.seoChecker}
    Object.keys(seoChecker).forEach((key) => {
      seoChecker[key] = researcher.getResearch(key)
    })
    this.setState({
      seoChecker: seoChecker
    })
  }

  componentDidMount() {
    let id = this.props.match.params.id
    if(id) {
      this.getDetail(id)
    }
    this.updateSEOChecker()
    this.getCategoryList()
  }

  submitData = async () => {
    let data = {...this.state.formPostInput}
    if(this.state.id!==undefined) {
      await updatePost(this.state.id, data)
    } else {
      await createPost(data)
    }
    let renderState = {...this.state.renderState}
    renderState.showSuccessDialog = true
    this.setState({
      renderState: renderState
    })
  }

  getCategoryList = () => {
    fetchList().then(response => {
      let resData = response.data || []
      if(resData!==[]) {
        this.setState({
          categories: [ ...resData.data]
        })
      }
    })
  }

  getDetail(slug) {
    fetchPost(slug).then(response => {
      let resData = response.data || {}
      if(!_.isEmpty(resData)) {
        let selectedCategory = resData.categories.map((category)=>{
          return category.id
        })
        this.setState({
          defaultData: resData,
          formPostInput: resData,
          defaultSelectedCategory: selectedCategory,
          selectedCategory: selectedCategory
        })
      }
      this.updateSEOChecker()
    })
  }

  reset = () => {
    this.setState({
      formPostInput: {...this.state.defaultData},
      selectedCategory: [...this.state.defaultSelectedCategory]
    })
  }

  handleChange = (event) => {
    let post = {...this.state.formPostInput}
    post[event.target.id] = event.target.value
    this.setState({
      formPostInput: post
    });
  }

  renderCardHeaderContent = () => {
    if(this.state.id) {
      return (<strong><i className="icon-info pr-1"></i>Post id: {this.state.id}</strong>)
    }
    return (<strong><i className="icon-info pr-1"></i>New Post</strong>)
  }

  updateSuccess = () => {
    this.setState({
      showSuccessDialog: false
    })
    if(this.state.id) {
      return true
    }
    this.props.history.push('/post')
  }

  renderSuccessDialog = () => {
    if(this.state.showSuccessDialog) {
      const msg = `Post has been ${(this.state.id)? 'updated' : 'created'}.`
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

  updatePostCategory = (event) => {
    let selectedCategory = [ ...this.state.selectedCategory]
    let targetId = parseInt(event.target.value)
    if(event.target.checked) {
      selectedCategory.push(targetId)
    } else {
      selectedCategory = selectedCategory.filter((categoryId) => {
        return categoryId !== targetId
      })
    }
    this.setState({
      selectedCategory: selectedCategory
    })
  }

  renderCategoryList = () => {
    return (
        <Row>
        { this.state.categories.map((category, index) => {
          return (
            <Col lg={12} key={index}>
              <AppSwitch
                onChange={this.updatePostCategory}
                value={category.id.toString()}
                className={'mx-1'}
                variant={'3d'}
                color={'primary'}
                checked={this.state.selectedCategory.includes(category.id)}
                label
                dataOn={'\u2713'}
                dataOff={'\u2715'}
              /> {category.name}
            </Col>
          )
        })
      }
      </Row>
    )
  }

  renderSeoCheckerRow = () => {
    return
  }

  renderSeoChecker = () => {
    return
  }

  render() {
    let post = this.state.formPostInput
    return (
      <div className="animated fadeIn">
        <Row>
          <Col lg={9}>
            <Card>
              <CardHeader>
                { this.renderCardHeaderContent() }
                { this.renderSuccessDialog() }
              </CardHeader>
              <CardBody>
                <Form>
                  <FormGroup>
                    <Label htmlFor="name">Name</Label>
                    <input className="form-control" type="text" id="name" placeholder="Enter Name.." value={post.name} onChange={this.handleChange}/>
                    <FormText className="help-block">Please enter post name</FormText>
                  </FormGroup>
                  <FormGroup>
                    <Label htmlFor="name">Post URL key</Label>
                    <InputGroup>
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>{FRONT_WEB_DETAIL_BASE_URL}</InputGroupText>
                      </InputGroupAddon>
                      <input className="form-control" type="text" id="post_url_key" placeholder="Enter Name.." value={post.post_url_key} onChange={this.handleChange}/>
                    </InputGroup>
                    <FormText className="help-block">Please enter post name</FormText>
                  </FormGroup>
                  <FormGroup>
                    <Label htmlFor="name">Content</Label>
                        <Editor
                          value={post.content}
                          apiKey={TINYMCE_API_KEY}
                          init={tinymceSetting}
                        />
                  </FormGroup>
                </Form>
              </CardBody>
              <CardFooter>
                <Button size="lg" onClick={this.submitData} color="primary"><i className="fa fa-dot-circle-o"></i> Submit</Button>&nbsp;
                <Button size="lg" onClick={this.reset} color="danger"><i className="fa fa-ban"></i> Reset</Button>
              </CardFooter>
            </Card>
          </Col>
          <Col lg={3}>
            <Card>
              <CardHeader>
                <strong><i className="icon-info pr-1"></i>Post Setting</strong>
              </CardHeader>
              <CardBody>
                <Form>
                  <FormGroup>
                    <Label htmlFor="select">Status</Label>
                    <select value={post.status} onChange={this.handleChange} id="status" className="form-control">
                      <option value="2">Draft</option>
                      <option value="1">Publish</option>
                      <option value="3">Delete</option>
                    </select>
                  </FormGroup>
                </Form>
                <Form>
                  <FormGroup>
                    <Label htmlFor="select">Category</Label>
                    {this.renderCategoryList()}
                  </FormGroup>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row>

        </Row>
      </div>
    )
  }
}

export default PostDetail;
