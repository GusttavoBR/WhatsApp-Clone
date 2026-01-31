import { useEffect, useState } from "react"
import "@/src/components/MessageList/MessageList.css"
import { Message, Usuario } from "../ChatWindown/ChatWindown"

type Props = {
    data: Message
    user: Usuario
}

export const MessageList = ({ data, user }: Props) => {

    const [time, setTime] = useState('')

    useEffect(() => {
        if (data.date && (data.date as any).seconds) {
            let d = new Date((data.date as any).seconds * 1000);
            let hours = d.getHours();
            let minutes = d.getMinutes();
            let h = hours < 10 ? '0' + hours : hours;
            let m = minutes < 10 ? '0' + minutes : minutes;
            setTime(`${h}:${m}`);
        }
    }, [data.date]);

    return (
        <div className={`messageLine mb-2.5 flex ${user.id === data.author ? "justify-end" : "justify-start"}`}>
            <div className={`messageItem  rounded-sm shadow-sm flex flex-col p-0.5 max-w-4/5  ${user.id === data.author ? "bg-green-800" : "bg-muted"}`}>
                <div className="messageText text-md my-3 mr-10 ml-1.5 text-white">
                    {data.body}
                </div>
                <div className="messageDate text-xs mr-1.5 text-right h-4 mt-[-15px] text-white">
                    {time}
                </div>
            </div>
        </div>
    )
}
