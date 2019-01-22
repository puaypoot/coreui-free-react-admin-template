import React, { Component } from 'react';
import {
  Card, CardBody, CardHeader, Col, Row,
  Form, FormGroup, Label, FormText, CardFooter, Button
} from 'reactstrap';
import SweetAlert from 'react-bootstrap-sweetalert'
// import YoastSEO from 'yoastseo'

import { fetchPost, createPost, updatePost } from '../../api/Post'
import { Researcher, Paper } from "yoastseo";

// urlLength: _urlIsTooLong2.default,
// wordCountInText: _wordCountInText2.default,
// findKeywordInPageTitle: _findKeywordInPageTitle2.default,
// calculateFleschReading: _calculateFleschReading2.default,
// getLinkStatistics: _getLinkStatistics2.default,
// getLinks: _getLinks2.default,
// linkCount: _countLinks2.default,
// imageCount: _imageCountInText2.default,
// altTagCount: _imageAltTags2.default,
// matchKeywordInSubheadings: _matchKeywordInSubheadings2.default,
// keywordCount: _keywordCount2.default,
// getKeywordDensity: _getKeywordDensity2.default,
// stopWordsInKeyword: _stopWordsInKeyword2.default,
// stopWordsInUrl: _stopWordsInUrl2.default,
// metaDescriptionLength: _metaDescriptionLength2.default,
// keyphraseLength: _keyphraseLength2.default,
// keywordCountInUrl: _keywordCountInUrl2.default,
// firstParagraph: _findKeywordInFirstParagraph2.default,
// metaDescriptionKeyword: _metaDescriptionKeyword2.default,
// pageTitleWidth: _pageTitleWidth2.default,
// wordComplexity: _getWordComplexity2.default,
// getParagraphLength: _getParagraphLength2.default,
// countSentencesFromText: _countSentencesFromText2.default,
// countSentencesFromDescription: _countSentencesFromDescription2.default,
// getSubheadingTextLengths: _getSubheadingTextLengths2.default,
// findTransitionWords: _findTransitionWords2.default,
// passiveVoice: _getPassiveVoice2.default,
// getSentenceBeginnings: _getSentenceBeginnings2.default,
// relevantWords: _relevantWords2.default,
// readingTime: _readingTime2.default,
// getTopicDensity: _getTopicDensity2.default,
// topicCount: _topicCount2.default,
// sentences: _sentences2.default,
// keyphraseDistribution: keyphraseDistribution,
// morphology: morphology,
// functionWordsInKeyphrase: _functionWordsInKeyphrase2.default,
// h1s: _h1s2.default

class PostDetail extends Component {
  state =  {
    formInput: {
      id: undefined,
      name: '',
      post_url_key: ''
    },
    defaultData: {
      id: undefined,
      name: '',
      post_url_key: ''
    },
    renderState: {
      showSuccessDialog: false
    }
  }

  handleContentChange = () => {
    const paper = new Paper( "Text to analyze", {
      keyword: "analyze",
    });
    const researcher = new Researcher( paper );

    console.log( researcher.getResearch( "wordCountInText" ) );
  }

  componentDidMount() {
    let id = this.props.match.params.id
    if(id) {
      this.getDetail(id)
    }

    this.handleContentChange()
  }

  submitData = async () => {
    let data = {
      name: this.state.name,
      slug: this.state.slug,
    }
    if(this.state.defaultData.id!==undefined) {
      await updatePost(this.state.defaultData.id, data)
    } else {
      await createPost(data)
    }
    this.setState({
      showSuccessDialog: true
    })
  }

  getDetail(slug) {
    fetchPost(slug).then(response => {
      let resData = response.data || {}
      if(resData!==[]) {
        this.setState({
          defaultData: resData,
          formInput: resData
        })
      }
    })
  }

  reset = () => {
    this.setState({
      inputForm: {...this.state.defaultData}
    })
  }

  handleChange = (event) => {
    let post = {...this.state.formInput}
    post[event.target.id] = event.target.value
    this.setState({
      formInput: post
    });
  }

  renderCardHeaderContent = () => {
    if(this.state.defaultData.id) {
      return (<strong><i className="icon-info pr-1"></i>Post id: {this.state.defaultData.id}</strong>)
    }
    return (<strong><i className="icon-info pr-1"></i>New Post</strong>)
  }

  updateSuccess = () => {
    this.setState({
      showSuccessDialog: false
    })
    if(this.state.defaultData.id) {
      return true
    }
    this.props.history.push('/post')
  }

  renderSuccessDialog = () => {
    if(this.state.showSuccessDialog) {
      const msg = `Post has been ${(this.state.defaultData.id)? 'updated' : 'created'}.`
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
    let post = this.state.formInput
    return (
      <div className="animated fadeIn">
        <Row>
          <Col lg={8}>
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
                    <input className="form-control" type="text" id="name" placeholder="Enter Name.." value={post.post_url_key} onChange={this.handleChange}/>
                    <FormText className="help-block">Please enter post url key</FormText>
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

export default PostDetail;
