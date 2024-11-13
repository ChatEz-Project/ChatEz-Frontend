import "./ChatFeedFriendPanel.css";

interface ChatFeedFriendPanelProps {
    className?: string;
}

const ChatFeedFriendPanel: React.FC<ChatFeedFriendPanelProps> = ({ className }) => {
    return (
        <div className = {className ? `ChatFeedFriendPanel ${className}` : "ChatFeedFriendPanel"}>
            <h1>Friend Panel</h1>
        </div>
    );
};

export default ChatFeedFriendPanel;