import { IconButton } from "@mui/material";
import "./ChatFeed.css"
import MenuIcon from '@mui/icons-material/Menu';
import { AccountCircle, AttachFile, Image, Send } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { Message } from '../../../../Utils/Types'
import ChatFeedProfilePanel from "../ChatFeedProfilePanel/ChatFeedProfilePanel";
import ChatFeedFriendPanel from "../ChatFeedFriendPanel/ChatFeedFriendPanel";

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
        sender: "Abdul",
        recipient: "Jamie-Lee",
        message: "Hello, how are you?",
        dateSent: new Date(),  // current date and time for test purposes 
        read: false,
        fileRef: null           
    };

    // eslint-disable-next-line no-lone-blocks
    {/* NOTE:
        - all messages both from you and recipient, all merge in the same list
        - the new list will order them by date sent, so its all in order when rendered
        - the new list will also determine who sent what message using sender and recipient 
    */}
    const [allMessages, setAllMessages] = useState<Message[]>([])

    // call endpoint to flood these arrays with the messages, instead of the test objects.
    useEffect(() => {
        setAllMessages([yourTestMessage, recipientTestMessage])
    }, []);

    const [isRightPanelCollapsed, setIsRightPanelCollapsed] = useState(true);
    const [isLeftPanelCollapsed, setIsLeftPanelCollapsed] = useState(true);

    const [message, setMessage] = useState<string>("")

    const collapseRightPanel = () => {
        setIsRightPanelCollapsed(!isRightPanelCollapsed);
        console.log("right panel has been collapsed")
    }

    const collapseLeftPanel = () => {
        setIsLeftPanelCollapsed(!isLeftPanelCollapsed);
        console.log("left panel has been collapsed")
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
            allMessages.push({
                sender: "Jamie-Lee",          
                recipient: "Abdul",         
                message: message,         
                dateSent: new Date(),     
                read: false,              
                fileRef: null  
            })
        }
        setMessage("")
    }

    return (
        <div className="Chat-feed-container">

            <ChatFeedFriendPanel
                className = {isLeftPanelCollapsed ? 
                    "ChatFeedFriendPanel" : 
                    "ChatFeedFriendPanel-Collapsed"} />

            <div className="Chat-feed">
                <div className="Top-panel">
                    <IconButton
                        id = "CollapseLeftPanel-button"
                        onClick = {collapseLeftPanel}>
                        <MenuIcon id = "Collapse-icon"/>
                    </IconButton>
                    <h3> 
                        <AccountCircle id = "Profile-icon"/> 
                        Username
                    </h3>
                    <IconButton
                        id = "CollapseRightPanel-button"
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
                        {allMessages.filter((message) => message.recipient === "Jamie-Lee")
                            .map((message, index) => (
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

                        {allMessages.filter((message) => message.recipient === "Abdul")
                            .map((message, index) => (
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
                        onChange = {(e) => setMessage(e.target.value)}
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

            <ChatFeedProfilePanel
                className = {isRightPanelCollapsed ? 
                    "ChatFeedProfilePanel" : 
                    "ChatFeedProfilePanel-Collapsed"} />

        </div>
    )
}

export default ChatFeed;

