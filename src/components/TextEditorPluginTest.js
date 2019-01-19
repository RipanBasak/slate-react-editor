// Import the `Value` model.
import React, {Component} from 'react'
import InsertImages from 'slate-drop-or-paste-images'
import { Editor } from 'slate-react';
import { Value } from 'slate';
import CollapseOnEscape from './collapse-on-escape'
import SoftBreak from './soft-break'
import WordCount from './word-count'


// Create our initial value...
const initialValue = Value.fromJSON({
    document: {
      nodes: [
        {
          object: 'block',
          type: 'paragraph',
          nodes: [
            {
              object: 'text',
              leaves: [
                {
                  text: 'A line of text in a paragraph.',
                },
              ],
            },
          ],
        },
      ],
    },
})
  //components
// Define a React component renderer for our code blocks.
function CodeNode(props) {
    return (
      <pre {...props.attributes}>
        <code>{props.children}</code>
      </pre>
    )
  }
  function BoldMark(props) {
    return (
        <strong>{props.children}</strong>
    )
  }
  function ItalicMark(props) {
    return (
        <i>{props.children}</i>
    )
  }
  function MarkHotkey(options){
      //grab optoin that pass in
      const { key, type } = options;
      return {
          // if it doesnot match our key let other plugin handle it
        onKeyDown(event, editor, next){
            if (!event.ctrlKey || event.key != key) {return next();}
            event.preventDefault()
            editor.toggleMark(type)
        }
      }
  }

//   const boldPlugin = MarkHotkey({
//       type: 'bold',
//       key:'b'
//   })
  //create array of plugin

  const plugin = [
      CollapseOnEscape(), SoftBreak(), WordCount(),
      MarkHotkey({  key: 'b', type: 'bold'}),
      MarkHotkey({  key: 'i', type: 'italic'}),
      MarkHotkey({  key: '`', type: 'code'}),
      MarkHotkey({  key: '~', type: 'strikethrough'}),
      MarkHotkey({  key: 'u', type: 'underline'}),
      
     
  ];


  class TextEditorPluginTest extends Component{
    //need to implement editorial stuff
    state = {
        value: initialValue,
    }

    render(){
        //add plugin propery to editor
        return(
            <Editor 
                plugins={plugin}
                value={this.state.value}
                onChange={this.onChange}
                renderNode ={this.renderNode}
                renderMark= {this.renderMark}
            />
        );
    }
    // all the functions
    onChange=(change) =>{

        let {value} = change;
        this.setState({ value })
        
        //return next();
    }
    onKeyDown = (event, editor, next)=>{
        if (!event.ctrlKey) {return next();}
        // console.log(event.key);
        switch (event.key) {
            case 'b': {
                event.preventDefault()
                editor.toggleMark('bold')
            }
            case 'i': {
                event.preventDefault()
                editor.toggleMark('italic')
            }
            case '`': {
                const isCode = editor.value.blocks.some(block => block.type == 'code');
                event.preventDefault();
                // Otherwise, set the currently selected blocks type to "code".
                editor.setBlocks(isCode ? 'paragraph' : 'code');
            }
            default:{
                return next();
            }
        }


         //
    }
    renderNode = (props, editor, next)=>{
        switch(props.node.type){
            case 'code':
                return(
                    <CodeNode {...props}/>
                );
            default:
                    return next();
        }
        
        
    }
    //mark
    
    renderMark = (props, editor, next) => {
        switch (props.mark.type) {
          case 'bold':
            return <strong>{props.children}</strong>
          // Add our new mark renderers...
          case 'code':
            return <code>{props.children}</code>
          case 'italic':
            return <em>{props.children}</em>
          case 'strikethrough':
            return <del>{props.children}</del>
          case 'underline':
            return <u>{props.children}</u>
          default:
            return next()
        }
      }
  }
  export default TextEditorPluginTest;