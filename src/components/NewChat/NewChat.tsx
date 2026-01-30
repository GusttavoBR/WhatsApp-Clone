import { ArrowLeft } from "lucide-react"
import "@/src/components/NewChat/NewChat.css"
import { useEffect, useState } from "react"
import { Chat } from "@/src/types/chat";

import { Usuario } from "../ChatWindown/ChatWindown";
import Api from "@/Api";

type Props = {
    show: boolean;
    setShow: (show: boolean) => void;
    user: Usuario;
    chatlist: Chat[]
}

export const NewChat = ({ show, setShow, user, chatlist }: Props) => {

    const [list, setList] = useState<Usuario[]>([])

    useEffect(() => {
        const getList = async () => {
            if (user !== null) {
                let results = await Api.getContactList(user.id)
                setList(results)
            }
        }
        getList()
    }, [user])

    const handleClose = () => {
        setShow(!show)
    }

    const addNewChat = async ({ user2 }: { user2: Usuario }) => {
        let chatExists = chatlist.find(chat => chat.with === user2.id);

        if (!chatExists) {
            await Api.addNewChat(user, user2)
        }

        handleClose()
    }


    return (
        <div className={`w-[35%] max-w-[415px] fixed  top-0 bottom-0 bg-muted flex flex-col border-r border-gray-500/10 transition-all ease-in-out ${show ? "left-0" : "left-[-415]"}`}>

            <div className={`flex bg-[#00bfa5] items-center pt-16 px-4 pb-4 `}>
                <div className="w-10 h-10 flex justify-center items-center cursor-pointer rounded-full hover:bg-muted/20" onClick={handleClose}>
                    <ArrowLeft className="" />
                </div>
                <div className="text-xl h-10 leading-10 flex-1 font-bold ml-5">
                    Nova Conversa
                </div>
            </div>

            <div className="newChat--list flex-1 overflow-y-auto">
                {list.map((item, key) => (
                    <div onClick={() => addNewChat({ user2: item })} className="flex items-center p-3.5 cursor-pointer hover:bg-gray-500/20" key={key}>
                        <img src={item.avatar ?? ""} alt="" className="w-12 h-12 rounded-full mr-3.5" />
                        <div className="text-xl">
                            {item.name}
                        </div>
                    </div>
                ))}
            </div>

        </div>
    )
}