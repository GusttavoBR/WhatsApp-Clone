import "@/src/components/MessageList/MessageList.css"
import { Message, Usuario } from "../ChatWindown/ChatWindown"

type Props = {
    data: Message
    user: Usuario
}

export const MessageList = ({ data, user }: Props) => {
    return (
        <div className={`messageLine mb-2.5 flex ${user.id === data.author ? "justify-end" : "justify-start"}`}>
            <div className={`messageItem  rounded-sm shadow-sm flex flex-col p-0.5 max-w-4/5  ${user.id === data.author ? "bg-green-800" : "bg-muted"}`}>
                <div className="messageText text-sm my-3 mr-10 ml-1.5 text-white">
                    {data.body}
                </div>
                <div className="messageDate text-xs mr-1.5 text-right h-4 mt-[-15px] text-white">
                    {data.date}
                </div>
            </div>
        </div>
    )
}