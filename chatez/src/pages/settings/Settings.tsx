import {User} from "../../backend/types";

interface SettingsPanelProps {
    user?: User | null;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ user }) => {

    return (
        <div className="SettingsPanel">
            <h1 className="bd-title d-flex justify-content-center" id="page-title">
                Settings
            </h1>

            <div className="container">
                <div className="row">
                    <div className="col">
                        <img
                            id="Profile-picture"
                            src={user?.photoUrl || "https://i.pinimg.com/736x/3d/cd/4a/3dcd4af5bc9e06d36305984730ab7888.jpg"}
                            alt="Display icon"
                        />
                    </div>
                    <div className="col">
                        <button id="update-profile-photo-button" >
                            Change Profile Photo
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SettingsPanel;