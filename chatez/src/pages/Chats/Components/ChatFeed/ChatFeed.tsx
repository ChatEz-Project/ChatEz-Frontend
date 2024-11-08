import { IconButton } from "@mui/material";
import "./ChatFeed.css"
import MenuIcon from '@mui/icons-material/Menu';
import { AccountCircle, AttachFile, Image, Send } from "@mui/icons-material";
import { useState } from "react";
import { Message } from '../../../../Utils/Types'

const ChatFeed: React.FC = () => {

    // Test purposes
    const yourTestMessage: Message = {
        sender: "Jamie-Lee",
        recipient: "Abdul",
        message: "I'm good, thanks! How about you?",
        dateSent: new Date(),  // current date and time for test purposes 
        read: false,
        fileRef: null           
    };

    // Test purposes
    const recipientTestMessage: Message = {
        sender: "Jamie-Lee",
        recipient: "Abdul",
        message: "Hello, how are you?",
        dateSent: new Date(),  // current date and time for test purposes 
        read: false,
        fileRef: null           
    };

    // call endpoint to flood these arrays with the messages:

    // all of your messages which you have sent to this particular friend goes here:
    const [yourMessagesList, setYourMessagesList] = useState<Message[]>([yourTestMessage])

    // all of your messages which you have recieved from this particular friend goes here: 
    const [recipientMessagesList, setRecipientMessagesList] = useState<Message[]>([recipientTestMessage])

    // eslint-disable-next-line no-lone-blocks
    {/* NOTE:
        - all messages both from you and recipient, all merge in the same list
        - the new list will order them by date sent, so its all in order when rendered
        - the new list will also determine who sent what message
    */}
    const [allMessages, setAllMessages] = useState<string[]>([]) 

    const [message, setMesasge] = useState<string>("")

    const collapseRightPanel = () => {
        console.log("right panel has been collapsed")
    }

    const insertImage = () => {
        console.log("Image has been inserted")
    }
    const attachFile = () => {
        console.log("File has been attached")
    }
    const sendMessage = () => {
        console.log("Message has been sent")
        if (message !== "") {
            yourMessagesList.push({
                sender: "Username",          
                recipient: "Abdul",         
                message: message,         
                dateSent: new Date(),     
                read: false,              
                fileRef: null  
            })
        }
        setMesasge("")
    }

    return (
        <div className="Chat-feed">
            <div className="Top-panel">
                <h3> 
                    <AccountCircle id = "Profile-icon"/> 
                    Username
                </h3>
                <IconButton
                    id = "Collapse-button"
                    onClick = {collapseRightPanel}>
                    <MenuIcon id = "Collapse-icon"/>
                </IconButton>
            </div>

            <div className="Messages-container">
                <div className="Messages-area">
                    <p>21st October</p>
                    {/* NOTE:
                        - all messages both from you and recipient, all merge in the same list
                        - the new list will order them by date sent, so its all in order when rendered
                        - the new list will also determine who sent what message
                    */}
                    {recipientMessagesList.map((message, index) => (
                        <div className="Message-box-recipient-container" key={index}>
                            <div className="Message-box-recipient"> 
                                <p id="Message">{message.message}</p>
                            </div>
                            <div className="Metadata-section-recipient">
                                <p>{message.dateSent.toLocaleTimeString("en-US", {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        hour12: false
                                    })}
                                </p>
                            </div>
                        </div>
                    ))}

                    {yourMessagesList.map((message, index) => (
                        <div className="Message-box-you-container" key={index}>
                            <div className="Message-box-you"> 
                                <p id="Message">{message.message}</p>
                            </div>
                            <div className="Metadata-section-you">
                                <p>{message.dateSent.toLocaleTimeString("en-US", {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        hour12: false
                                    })}
                                </p>
                            </div>
                        </div>
                    ))}

                </div>
            </div>

            <div className="Bottom-panel">
                <IconButton
                    id = "Image-button"
                    onClick = {insertImage}>
                    <Image id = "Image-icon"/>
                </IconButton>
                <IconButton
                    id = "AttachFile-button"
                    onClick = {attachFile}>
                    <AttachFile id = "AttachFile-icon"/>
                </IconButton>
                <input
                    id = "Chat-input"
                    placeholder = "Enter Chat..." 
                    onChange = {(e) => setMesasge(e.target.value)}
                    value={message}
                    >                        
                </input>
                <IconButton
                    id = "Send-button"
                    onClick = {sendMessage}>
                    <Send id = "Send-icon" />
                </IconButton>
            </div>
        </div>
    )
}

export default ChatFeed;

