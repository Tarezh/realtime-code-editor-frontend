import React, { useEffect, useRef } from 'react'
import Codemirror from 'codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/addon/edit/closetag.js'
import 'codemirror/addon/edit/closebrackets.js'
import 'codemirror/mode/clike/clike.js'
import 'codemirror/theme/dracula.css'
import ACTIONS from '../Actions'

const Editor = ({socketRef, roomId, onCodeChange}) => {

  const editorRef = useRef(null)

    useEffect(() => {
        async function init(){
            editorRef.current = Codemirror.fromTextArea(document.getElementById('realtimeEditor'),{
                mode: { name: 'clike', json: true},
                theme: 'dracula',
                autoClodeTags: true,
                autoCloseBrackets: true,
                lineNumbers: true,
            })

            

            editorRef.current.on('change',(instance,changes)=>{
                const {origin} = changes;
                const code = instance.getValue();
                onCodeChange(code); 
                if(origin !== 'setValue')
                {
                  socketRef.current.emit(ACTIONS.CODE_CHANGE, {
                      roomId,
                      code,
                  })
                }
            })

            
        }
        init();
    },[]);

    useEffect(() => {
      if(socketRef.current)
      {
        socketRef.current.on(ACTIONS.CODE_CHANGE,({code}) => {
        if(code !== null)
        {
          editorRef.current.setValue(code)
        }
    })}
  
    return () => {
      socketRef.current.off(ACTIONS.CODE_CHANGE)
    }
    },[socketRef.current])

  return (
    <textarea id="realtimeEditor">
    </textarea>
  )
}

export default Editor
