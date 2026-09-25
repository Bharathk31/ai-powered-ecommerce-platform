import { useState} from 'react'
import { ChatInput } from './components/ChatInput';
import ChatMessages from './components/ChatMessages';
import './App.css'

       function App(){
         const [chatMessages , setChatMessages] =  useState([{
           message : 'hello chatbot',
              sender  : 'user',
              id      : 'id1'
            } ,{
              message : 'hello! how can i help you?',
              sender  : 'robot',
              id      : 'id2'
            }, {
              message : 'can you get  me todays date ?',
              sender  : 'user',
              id      : 'id3'
            },{
              message : 'Today is September 21',
              sender  : 'robot',
              id      : 'id4'
              }]) ;
      //  const [chatMessages , setChatMessages] = array;
      //  const chatMessages = array[0];
      //  const setChatMessages = array[1];

        return(
          <div className="app-container">
           
      
            <ChatMessages
              chatMessages = {chatMessages}
              setChatMessages = {setChatMessages}
            />
             <ChatInput
               chatMessages = {chatMessages}
               setChatMessages = {setChatMessages}
               />
           
          </div> 
        );
      } 

export default App
