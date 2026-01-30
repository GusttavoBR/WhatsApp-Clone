"use client"
import '@/src/components/ChatWindown/ChatWindown.css'
import SearchIcon from '@mui/icons-material/Search';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Mic, Plus, Sticker } from 'lucide-react';
import { ReactNode, useEffect, useRef, useState } from 'react';
import SendIcon from '@mui/icons-material/Send';
import EmojiPicker, { Theme, EmojiClickData } from 'emoji-picker-react'
import { MessageList } from '../MessageList/MessageList';
import { Chat } from '@/src/types/chat';


export interface Message {
    id: string;
    author: string;
    body: string;
    date: string;
}

export type Usuario = {
    id: string,
    avatar: string | null,
    name: string | null;
}


export const ChatWindown = ({ user, data }: { user: Usuario, data: Chat }) => {


    const [listening, setListening] = useState(false)
    const [showEmoji, setShowEmoji] = useState<boolean | null>(false)
    const [text, setText] = useState('')
    const body = useRef<HTMLDivElement>(null)
    const [list, setList] = useState<Message[]>([
        { id: "1", author: "123", body: 'Olá! Como você está?', date: '19:00' },
        { id: "2", author: "1", body: 'Estou bem, obrigado! E você?', date: '19:01' },
        { id: "3", author: "123", body: 'Também estou bem! Vamos marcar algo?', date: '19:02' },
        { id: "4", author: "123", body: 'Olá! Como você está?', date: '19:00' },
        { id: "5", author: "1", body: 'Estou bem, obrigado! E você?', date: '19:01' },
        { id: "6", author: "123", body: 'Também estou bem! Vamos marcar algo?', date: '19:02' },
        { id: "7", author: "123", body: 'Olá! Como você está?', date: '19:00' },
        { id: "8", author: "1", body: 'Estou bem, obrigado! E você?', date: '19:01' },
        { id: "9", author: "123", body: 'Também estou bem! Vamos marcar algo?', date: '19:02' },
        { id: "10", author: "123", body: 'Olá! Como você está?', date: '19:00' },
        { id: "11", author: "1", body: 'Estou bem, obrigado! E você?', date: '19:01' },
        { id: "12", author: "123", body: 'Também estou bem! Vamos marcar algo?', date: '19:02' },
        { id: "13", author: "123", body: 'Olá! Como você está?', date: '19:00' },
        { id: "14", author: "1", body: 'Estou bem, obrigado! E você?', date: '19:01' },
        { id: "15", author: "123", body: 'Também estou bem! Vamos marcar algo?', date: '19:02' },
        { id: "16", author: "123", body: 'Olá! Como você está?', date: '19:00' },
        { id: "17", author: "1", body: 'Estou bem, obrigado! E você?', date: '19:01' },
        { id: "18", author: "123", body: 'Também estou bem! Vamos marcar algo?', date: '19:02' },
        { id: "19", author: "123", body: 'Olá! Como você está?', date: '19:00' },
        { id: "20", author: "1", body: 'Estou bem, obrigado! E você?', date: '19:01' },
        { id: "21", author: "123", body: 'Também estou bem! Vamos marcar algo?', date: '19:02' },
        { id: "22", author: "123", body: 'Olá! Como você está?', date: '19:00' },
        { id: "23", author: "1", body: 'Estou bem, obrigado! E você?', date: '19:01' },
        { id: "24", author: "123", body: 'Também estou bem! Vamos marcar algo?', date: '19:02' },
        { id: "25", author: "123", body: 'Olá! Como você está?', date: '19:00' },
        { id: "26", author: "1", body: 'Estou bem, obrigado! E você?', date: '19:01' },
        { id: "27", author: "123", body: 'Também estou bem! Vamos marcar algo?', date: '19:02' },
    ])

    useEffect(() => {
        if (body.current && body.current.scrollHeight > body.current.offsetHeight) {
            body.current.scrollTop = body.current.scrollHeight - body.current.offsetHeight;
        }
    }, [list])

    const recognitionRef = useRef<any>(null)

    const startListening = () => {
        if (!("webkitSpeechRecognition" in window)) {
            alert("Seu navegador não suporta reconhecimento de voz");
            return;
        }

        if (!recognitionRef.current) {
            const SpeechRecognition =
                (window as any).SpeechRecognition ||
                (window as any).webkitSpeechRecognition;

            const recognition = new SpeechRecognition();
            recognition.lang = "pt-BR";
            recognition.interimResults = false;
            recognition.continuous = false;
            recognition.onstart = () => setListening(true)
            recognition.onend = () => setListening(false)

            recognition.onresult = (event: any) => {
                const transcript = event.results[0][0].transcript;
                setText(prev => prev + transcript);
            };

            recognition.onerror = () => {
                recognition.stop();
            };

            recognitionRef.current = recognition;
        }

        recognitionRef.current.start();
    };

    const handleEmojiClick = (emojiData: EmojiClickData) => {
        setText(prev => prev + emojiData.emoji)
    }

    const handleMicClick = () => {
        startListening()
    }

    const handleSendClick = () => {

    }

    return (
        <div className='chatWindow flex flex-col h-full overflow-hidden relative'>
            <div className="chatWindow--header h-16 border-b border-gray-300/30 flex justify-between items-center">

                <div className="chatWindow--headerInfo flex items-center cursor-pointer">
                    <img className='chatWindow--avatar w-10 h-10 rounded-full ml-4 mr-4' src={data.image || "https://www.w3schools.com/howto/img_avatar.png"} alt="" />
                    <div className="chatWindow--name text-lg" > {data.title}</div >
                </div >



                <div className="chatWindow--headerButtons flex items-center mr-4">

                    <div className="chatWindow--btn">
                        <SearchIcon style={{ color: '#919191' }} />
                    </div>
                    <div className="chatWindow--btn">
                        <MoreVertIcon style={{ color: '#919191' }} />
                    </div>

                </div>

            </div >
            <div ref={body} className="chatWindow--body flex-1 overflow-y-auto bg-[url('/whatsapp-bg-dark-large.png')] py-5 px-7">
                {list.map((item, key) => (
                    <MessageList
                        key={key}
                        data={item}
                        user={user}
                    />
                ))}
            </div>

            {
                showEmoji &&
                <div className='chatWindow--emojiArea w-full absolute bottom-18 left-10 transition-all duration-300 ease-in-out'>
                    <EmojiPicker
                        onEmojiClick={handleEmojiClick}
                        theme={Theme.DARK}
                        height={450}
                        searchPlaceholder="Buscar emoji..."
                        previewConfig={{
                            showPreview: false
                        }}
                        style={{ width: "600px", }}
                    />
                </div>
            }

            <div className="chatWindow--footer flex p-3 items-center">
                <div className='flex bg-secondary rounded-full flex-1 mx-5 '>
                    <div className='chatWindow--pre flex ml-2 items-center gap-3 h-[50px]'>
                        <div className="chatWindow--btn hover:bg-white/10">
                            <Plus className='' style={{ color: '#fff' }} />
                        </div>
                        <div className="chatWindow--btn hover:bg-white/10">
                            <Sticker onClick={() => setShowEmoji(prev => !prev)} className='' style={{ color: '#fff' }} />
                        </div>
                    </div>

                    <div className='chatWindow--inputarea flex-1 items-center flex'>
                        <input
                            type="text"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            className='chatWindow--input bg-secondary w-full text-md rounded-full pl-4 focus:outline-none'
                            placeholder='Digite uma mensagem'
                        />
                    </div>

                    <div className='chatWindow--pos flex mr-2 items-center '>
                        <div className="chatWindow--btn hover:bg-white/10">
                            {text.trim() === "" ? (
                                <Mic
                                    onClick={!listening ? handleMicClick : undefined}
                                    className={`
    ${listening ? "text-green-500" : "text-white cursor-pointer"}
  `}
                                />
                            ) : (
                                <SendIcon onClick={handleSendClick} className="send-button" />
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </div >
    )
}