import { Editor } from 'slate-react';
import {Block, Value } from 'slate';
import Icon from 'react-icons-kit';
import styled from '@emotion/styled';
import imageExtensions from 'image-extensions';

import React, {Component} from 'react'
import initialValue from '../data/value.json'
import { isKeyHotkey } from 'is-hotkey'
import { Button, Toolbar } from '../components'
// icon import react toolkit
import { bold } from 'react-icons-kit/feather/bold';
import { italic } from 'react-icons-kit/feather/italic';
import {ic_list} from 'react-icons-kit/md/ic_list';
import {ic_code} from 'react-icons-kit/md/ic_code';
import {ic_format_underlined} from 'react-icons-kit/md/ic_format_underlined'
import {ic_format_list_numbered} from 'react-icons-kit/md/ic_format_list_numbered'
import {quoteSerifLeft} from 'react-icons-kit/iconic/quoteSerifLeft'
import {image} from 'react-icons-kit/iconic/image';
import {save} from 'react-icons-kit/entypo/save';
import {backward} from 'react-icons-kit/metrize/backward';


const DEFAULT_NODE = 'paragraph'


const isBoldHotkey = isKeyHotkey('mod+b')
const isItalicHotkey = isKeyHotkey('mod+i')
const isUnderlinedHotkey = isKeyHotkey('mod+u')
const isCodeHotkey = isKeyHotkey('mod+`')

// Update the initial content to be pulled from Local Storage if it exists.
const existingValue = JSON.parse(localStorage.getItem('content'));
const Image = styled('img')`
  display: block;
  max-width: 100%;
  max-height: 20em;
  box-shadow: ${props => (props.selected ? '0 0 0 2px blue;' : 'none')};
`
const TabIndent = styled('span')`
  margin-left: 30px;
`

function isImage(url) {
  return !!imageExtensions.find(url.endsWith)
}


function insertImage(editor, src, target) {
  // console.log(src, ' :: ', target, ' :: ', editor);
  if (target) {
    editor.select(target)
  }

  editor.insertBlock({
    type: 'image',
    data: { src },
  })
}

const schema = {
  document: {
    last: { type: 'paragraph' },
    normalize: (editor, { code, node, child }) => {
      switch (code) {
        case 'last_child_type_invalid': {
          const paragraph = Block.create('paragraph')
          return editor.insertNodeByKey(node.key, node.nodes.size, paragraph)
        }
      }
    },
  },
  blocks: {
    image: {
      isVoid: true,
    },
  },
}
//

class TextEditor extends Component {
  
  state ={
    value:Value.fromJSON(existingValue || initialValue),
  }
  


  hasMark = type => {
    const { value } = this.state
    return value.activeMarks.some(mark => mark.type == type)
  }

  /**
   * Check if the any of the currently selected blocks are of `type`.
   *
   * @param {String} type
   * @return {Boolean}
   */

  hasBlock = type => {
    const { value } = this.state
    return value.blocks.some(node => node.type == type)
  }
  ref = editor => {
    this.editor = editor
  }

  //image upload from local storage
  fileSelectHandler = event =>{
    // console.log(event.target.files[0]);
    let input = event.target;
    let editor = this.editor;

    let reader = new FileReader();
    
    reader.onload = function(){
      var src = reader.result;
     
      editor.insertBlock({
          type: 'image',
          data: { src },
        })
    };
    reader.readAsDataURL(input.files[0]);

  }
  

  render() {
    return (
      <div>
        <Toolbar>
          <input type="file" onChange= {this.fileSelectHandler}/>
          <Button onMouseDown={this.onClickImage}>
            <Icon icon={image}/>
          </Button>
          <Button onMouseDown={this.onClickSave}>
            {/* <Icon icon={save}/> */}
            Save
          </Button>
          <Button onMouseDown={this.onClickCancle}>
            {/* <Icon icon={backward}/> */}
            Cancle
          </Button>
          
          {/* <input type='file'/> */}
          {this.renderMarkButton('bold', bold)}
          {this.renderMarkButton('italic', italic)}
          {this.renderMarkButton('underlined', ic_format_underlined)}
          {this.renderMarkButton('code', ic_code)}
         
          {this.renderBlockButton('block-quote', quoteSerifLeft)}
          {/* //Note: order and unorder list */}
          {this.renderBlockButton('numbered-list', ic_list)}
          {this.renderBlockButton('bulleted-list', ic_format_list_numbered)}
        </Toolbar>
        <Editor
          spellCheck
          autoFocus
          placeholder="Enter some rich text..."
          ref={this.ref}
          schema={schema}
          value={this.state.value}
          onChange={this.onChange}
          onKeyDown={this.onKeyDown}
          renderNode={this.renderNode}
          renderMark={this.renderMark}
        />
      </div>
    )
  }

  
  renderMarkButton = (type, icon) => {
    const isActive = this.hasMark(type)

    return (
      <Button
        active={isActive}
        onMouseDown={event => this.onClickMark(event, type)}
      >
      <Icon icon={icon}/>
      </Button>
    )
  }

  

  renderBlockButton = (type, icon) => {
    let isActive = this.hasBlock(type)

    if (['numbered-list', 'bulleted-list'].includes(type)) {
      const { value: { document, blocks } } = this.state

      if (blocks.size > 0) {
        const parent = document.getParent(blocks.first().key)
        isActive = this.hasBlock('list-item') && parent && parent.type === type
      }
    }

    return (
      <Button
        active={isActive}
        onMouseDown={event => this.onClickBlock(event, type)}
      >
      <Icon icon={icon}/>
      </Button>
    )
  }

  /**
   * Render a Slate node.
   *
   * @param {Object} props
   * @return {Element}
   */

  renderNode = (props, editor, next) => {
    const { attributes, children, node } = props

    switch (node.type) {
      case 'block-quote':
        return <blockquote {...attributes}>{children}</blockquote>
      case 'bulleted-list':
        return <ul {...attributes}>{children}</ul>
      case 'heading-one':
        return <h1 {...attributes}>{children}</h1>
      case 'heading-two':
        return <h2 {...attributes}>{children}</h2>
      case 'list-item':
        return <li {...attributes}>{children}</li>
      case 'numbered-list':
        return <ol {...attributes}>{children}</ol>
      case 'image': {
        const src = node.data.get('src');
        // console.log('src', src);
        return <Image src={src} {...attributes} />
      }
      default:
        return next()
    }
  }

  /**
   * Render a Slate mark.
   *
   * @param {Object} props
   * @return {Element}
   */

  renderMark = (props, editor, next) => {
    const { children, mark, attributes } = props

    switch (mark.type) {
      case 'bold':
        return <strong {...attributes}>{children}</strong>
      case 'code':
        return <code {...attributes}>{children}</code>
      case 'italic':
        return <em {...attributes}>{children}</em>
      case 'underlined':
        return <u {...attributes}>{children}</u>
      default:
        return next()
    }
  }

  /**
   * On change, save the new `value`.
   *
   * @param {Editor} editor
   */

  onChange = ({ value }) => {
    // const content = JSON.stringify(value.toJSON())
    // localStorage.setItem('content', content)
    this.setState({ value })
  }
  onClickSave = ()=>{
    let content = JSON.stringify(this.state.value);
    localStorage.setItem('content', content)
  }

  onClickCancle = (event)=>{
    let localValue = JSON.parse(localStorage.getItem('content'));
    let value = Value.fromJSON(localValue);
    this.setState({
       value:value 
      })
  }


  onKeyDown = (event, editor, next) => {
    let mark

    if (isBoldHotkey(event)) {
      mark = 'bold'
    } else if (isItalicHotkey(event)) {
      mark = 'italic'
    } else if (isUnderlinedHotkey(event)) {
      mark = 'underlined'
    } else if (isCodeHotkey(event)) {
      mark = 'code'
    } else {
      return next()
    }

    event.preventDefault()
    editor.toggleMark(mark)
  }

  /**
   * When a mark button is clicked, toggle the current mark.
   *
   * @param {Event} event
   * @param {String} type
   */

  onClickMark = (event, type) => {
    event.preventDefault()
    this.editor.toggleMark(type)
  }

  /**
   * When a block button is clicked, toggle the block type.
   *
   * @param {Event} event
   * @param {String} type
   */

  onClickBlock = (event, type) => {
    event.preventDefault()

    const { editor } = this
    const { value } = editor
    const { document } = value

    // Handle everything but list buttons.
    if (type != 'bulleted-list' && type != 'numbered-list') {
      const isActive = this.hasBlock(type)
      const isList = this.hasBlock('list-item')

      if (isList) {
        editor
          .setBlocks(isActive ? DEFAULT_NODE : type)
          .unwrapBlock('bulleted-list')
          .unwrapBlock('numbered-list')
      } else {
        editor.setBlocks(isActive ? DEFAULT_NODE : type)
      }
    } else {
      // Handle the extra wrapping required for list buttons.
      const isList = this.hasBlock('list-item')
      const isType = value.blocks.some(block => {
        return !!document.getClosest(block.key, parent => parent.type == type)
      })

      if (isList && isType) {
        editor
          .setBlocks(DEFAULT_NODE)
          .unwrapBlock('bulleted-list')
          .unwrapBlock('numbered-list')
      } else if (isList) {
        editor
          .unwrapBlock(
            type == 'bulleted-list' ? 'numbered-list' : 'bulleted-list'
          )
          .wrapBlock(type)
      } else {
        editor.setBlocks('list-item').wrapBlock(type)
      }
    }
  }

  onClickImage = event => {
    event.preventDefault()
    const src = window.prompt('Enter the URL of the image:')
    if (!src) return
    this.editor.command(insertImage, src)
  }
  


}


export default TextEditor;