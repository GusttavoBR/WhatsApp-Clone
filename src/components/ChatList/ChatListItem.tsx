import "@/src/components/ChatList/ChatListItem.css"
import { Chat } from "@/src/types/chat";

type Props = {
    onClick: () => void;
    active: boolean
    data: any
}

export const ChatListItem = ({ onClick, active, data }: Props) => {
    return (
        <div className={`chatListItem hover:bg-muted ${active ? 'bg-muted' : 'bg-card'}`} onClick={onClick}>
            <img src={data.image || data.avatar} alt="" className="chatListItem--avatar" />
            <div className="chatListItem--lines">
                <div className="chatListItem--line">
                    <div className="chatListItem--name">{data.title || data.name}</div>
                    <div className="chatListItem--date">
                        {data.lastMessageDate}
                    </div>
                </div>
                <div className="chatListItem--line">
                    <div className="chatListItem--lastMsg">
                        <p>
                            {data.lastMessage}
                        </p>
                    </div>
                </div>

            </div>
        </div>
    )
}