import { AccountCircle } from "@mui/icons-material";
import "./ChatFeedProfilePanel.css";

interface ChatFeedProfilePanelProps {
    className?: string;
}

const ChatFeedProfilePanel: React.FC<ChatFeedProfilePanelProps> = ({ className }) => {
    return (
        <div className = {className ? `ChatFeedProfilePanel ${className}` : "ChatFeedProfilePanel"}>
            <AccountCircle id = "Profile-picture" />
            <h1 id = "Display-name">Abdul</h1>
            <hr />
            <h2>Shared Photos</h2>

            <img 
                className="SharedPhoto-image"
                src = "https://i.pinimg.com/736x/3d/cd/4a/3dcd4af5bc9e06d36305984730ab7888.jpg"
                alt = "Shared Media"
            />

            <img 
                className="SharedPhoto-image"
                src = "https://storage.googleapis.com/chatez-438923.firebasestorage.app/MessageFiles%2F56rolsj%40gmail.com-1731362731422-phoenix_cropped.png"
                alt = "Shared Media"
            />

            <img 
                className="SharedPhoto-image"
                src = "https://storage.googleapis.com/chatez-438923.firebasestorage.app/ProfilePhotos%2F56rolsj%40gmail.com-1731363038271-tenor.gif" 
                alt = "Shared Media"
            />

            <h2>Shared Files</h2>

            <p className="Document">DocumentExample1.docx</p>
            <p className="Document">DocumentExample2.pdf</p>

            <button
                id = "DeleteConversation-button"
            >
                Delete Convo
            </button>

            <button
                id = "RemoveFriend-button"
            >
                Remove Friend
            </button>

        </div>
    );
};

export default ChatFeedProfilePanel;