import "@/src/components/ChatList/ChatListItem.css"
import { Chat } from "@/src/types/chat";
import { useEffect, useState } from "react";

type Props = {
    onClick: () => void;
    active: boolean
    data: any
}

export const ChatListItem = ({ onClick, active, data }: Props) => {

    const [time, setTime] = useState("")

    useEffect(() => {
        if (data.lastMessageDate && data.lastMessageDate.seconds) {
            let d = new Date(data.lastMessageDate.seconds * 1000)
            let hours = d.getHours()
            let minuts = d.getMinutes()
            let h = hours < 10 ? "0" + hours : hours
            let m = minuts < 10 ? "0" + minuts : minuts
            setTime(`${h}:${m}`)
        }
    }, [data])


    return (
        <div className={`chatListItem hover:bg-muted ${active ? 'bg-muted' : 'bg-card'}`} onClick={onClick}>
            <img src={data.image || data.avatar} alt="" className="chatListItem--avatar" referrerPolicy="no-referrer" />

            <div className="chatListItem--lines">
                <div className="chatListItem--line">
                    <div className="chatListItem--name">{data.title || data.name}</div>
                    <div className="chatListItem--date">
                        {time}
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
