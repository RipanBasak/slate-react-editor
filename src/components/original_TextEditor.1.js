import React , { Component, Fragment } from 'react';
import { Editor } from 'slate-react';
import { Value } from 'slate';
import Icon from 'react-icons-kit';
import { bold } from 'react-icons-kit/feather/bold';
import { italic } from 'react-icons-kit/feather/italic';
import {ic_list} from 'react-icons-kit/md/ic_list';
import {ic_code} from 'react-icons-kit/md/ic_code';
import {ic_format_underlined} from 'react-icons-kit/md/ic_format_underlined'
import {ic_format_list_numbered} from 'react-icons-kit/md/ic_format_list_numbered'
import {image} from 'react-icons-kit/iconic/image';
// import imageExtensions from 'image-extensions'
import isUrl from 'is-url'


import styled from '@emotion/styled'




import initialValue from '../data/value.json'
// import { italic} from 'react-icons-kit/feather/italic';
import {BoldMark, 
    FormatToolbar, 
    ItalicMark,
    CodeMark,
    UnderlineMark,
    UnOrdernListMark} from './index';

// Update the initial content to be pulled from Local Storage if it exists.
const existingValue = JSON.parse(localStorage.getItem('content'));
function insertImage(editor, src, target) {
    if (target) {
      editor.select(target)
    }
  
    editor.insertBlock({
      type: 'image',
      data: { src },
    })
  }
  const Image = styled('img')`
    display: block;
    max-width: 100%;
    max-height: 20em;
    box-shadow: ${props => (props.selected ? '0 0 0 2px blue;' : 'none')};`


class TextEditor extends Component{
    state ={
        value:Value.fromJSON(existingValue || initialValue),
    }
    /**
   * Store a reference to the `editor`.
   *
   * @param {Editor} editor
   */

  ref = (editor) => {
    this.editor = editor
  }
  hasBlock = type => {
    const { value } = this.state
    return value.blocks.some(node => node.type == type)
  }
    
    

    render(){
        return (
            <Fragment>
                <FormatToolbar>
                    <button onPointerDown={this.onClickImage}>
                        <Icon icon={image}/>
                    </button>
                    <button 
                        onPointerDown={event => this.onClickMark(event, 'bold')}>
                        <Icon icon={bold}/>
                    </button>
                    <button 
                        onPointerDown={event => this.onClickMark(event, 'italic')}>
                        <Icon icon={italic}/>
                    </button>
                    <button
                        onPointerDown={event => this.onClickMark(event, 'code')} >
                        <Icon icon={ic_code}/>
                    </button>
                    <button
                        onPointerDown={event => this.onClickMark(event, 'underline')} >
                        <Icon icon={ic_format_underlined}/>
                    </button>
                    {/* Block code */}
                    <button
						onPointerDown={(e) => this.onClickMark(e, 'list')}
						className="tooltip-icon-button">
						<Icon icon={ ic_list} />
					</button>
                   
                    <button
                        onPointerDown={event => this.onClickMark(event, 'order-list')}>
                        <Icon icon={ic_format_list_numbered}/>
                    </button>
                    
                </FormatToolbar>
                <Editor 
                ref={this.ref}
                value={this.state.value} 
                onChange={this.onChange} 
                onKeyDown = {this.onKeyDown}
                renderMark = {this.renderMark}
                renderNode={this.renderNode}/>
            </Fragment>
            
        )
    }
    // all the methods
    onChange= ({ value })=>{
        // Save the value to Local Storage.
        const content = JSON.stringify(value.toJSON())
        localStorage.setItem('content', content)

        this.setState({ value });
    }
    onKeyDown=(event, editor, next)=>{
        // console.log(e, change);
        let mark = '';
        if(!event.ctrlKey){
            return next();
        }
        // event.preventDefault();
        switch(event.key){
            case 'b': 
                    mark= 'bold';
                    break;
            case 'i': 
                    mark= 'italic';
                    break;
            case 'u': 
                    mark= 'underline';
                    break;
            case 'c': 
                    mark= 'code';
                    break;
            case 'l': 
                mark= 'list';
                return true;
            
            default: next();
        }

        event.preventDefault()
        editor.toggleMark(mark)
    }
    renderMark = (props, editor, next)=>{
        const { children, mark, attributes,node } = props
        console.log(props);

        switch(mark.type){
            case 'bold':
                return <BoldMark {...props}/>;
            case 'italic':
                return <ItalicMark {...props}/>;
            case 'code':
                return <CodeMark {...props}/>;
            case 'underline':
                return <UnderlineMark {...props}/>;
            case 'list':
                return <UnOrdernListMark {...props}/>;
            case 'image': {
                const src = node.data.get('src')
                return <Image src={src} {...attributes} />
                }
            default: next();
        }
    }
    onClickMark = (event, type) => {
        // console.log(type);
        event.preventDefault();
        const change =this.editor.toggleMark(type);
        /* calling the  onChange method we declared */
        this.onChange(change);
    };
    //render node
    renderNode = (props, editor, next) => {
        const { attributes, node, isFocused } = props
    
        switch (node.type) {
          case 'image': {
            const src = node.data.get('src')
            return <Image src={src} selected={isFocused} {...attributes} />
          }
    
          default: {
            return next()
          }
        }
      }
    
    onClickImage = (event, editor, next) => {
        event.preventDefault()
        const src = window.prompt('Enter the URL of the image:')
        if (!src){
            return;
        } 
        this.editor.command(insertImage, src)
    }
    
 

}
export default TextEditor;