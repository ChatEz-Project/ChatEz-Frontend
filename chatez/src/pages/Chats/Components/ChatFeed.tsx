import { IconButton } from "@mui/material";
import "../Styles/ChatFeed.css"
import MenuIcon from '@mui/icons-material/Menu';
import { AccountCircle, AttachFile, Image, Send } from "@mui/icons-material";
import { useEffect, useState } from "react";

const ChatFeed: React.FC = () => {

    const [message, setMesasge] = useState<string>("")

    // Has a sample message
    const [yourMessagesList, setYourMessagesList] = useState<string[]>(["I'm good, thanks! How about you?"])
    const [recipientMessagesList, setRecipientMessagesList] = useState<string[]>(["Hey, how are you?"])

    // eslint-disable-next-line no-lone-blocks
    {/* NOTE:
        - all messages both from you and recipient, all merge in the same list
        - the new list will order them by date sent, so its all in order when rendered
        - the new list will also determine who sent what message
    */}
    const [allMessages, setAllMessages] = useState<string[]>([]) 

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
            yourMessagesList.push(message)
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
                                <p id="Message">{message}</p>
                            </div>
                            <div className="Metadata-section-recipient">
                                <p>16:21</p>
                            </div>
                        </div>
                    ))}

                    {yourMessagesList.map((message, index) => (
                        <div className="Message-box-you-container" key={index}>
                        <div className="Message-box-you"> 
                            <p id="Message">{message}</p>
                        </div>
                        <div className="Metadata-section-you">
                            <p>19:21</p>
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

