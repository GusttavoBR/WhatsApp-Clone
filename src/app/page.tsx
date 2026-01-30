"use client"
import { Button } from '@/src/components/ui/button'
import './page.css'

import DonutLargeIcon from '@mui/icons-material/DonutLarge';
import ChatIcon from '@mui/icons-material/Chat';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { LockIcon, LockKeyhole, Search } from 'lucide-react';
import React, { ReactNode, useEffect, useState } from 'react';
import { ChatListItem } from '@/src/components/ChatList/ChatListItem';
import { ModeToggle } from '@/src/components/mode-toggle';
import { ChatIntro } from '@/src/components/ChatIntro/ChatIntro';
import { ChatWindown, Usuario } from '@/src/components/ChatWindown/ChatWindown';
import { Chat } from '../types/chat';
import { NewChat } from '@/src/components/NewChat/NewChat';
import { Login } from '../components/Login/Login';
import { User, UserCredential, getAdditionalUserInfo } from "firebase/auth";
import Api from '@/Api';


export default function Home() {
    const [chatlist, setChatList] = useState<Chat[]>([])

    const [activeChat, setActiveChat] = useState<Chat | undefined>(undefined)
    const [user, setUser] = useState<Usuario | null>(null)

    const [showNewChat, setShowNewChat] = useState(false)

    useEffect(() => {
        if (user !== null) {
            let unsub = Api.onChatList(user.id, setChatList)
            return unsub
        }
    }, [user])

    const handleNewChat = () => {
        setShowNewChat(true)
    }

    const handleLoginData = async (uc: UserCredential) => {
        const u = uc.user;
        const additionalInfo = getAdditionalUserInfo(uc);

        // Tenta pegar a URL da foto do profile retornado pelo Facebook
        const profilePhoto = (additionalInfo?.profile as any)?.picture?.data?.url;
        const photoURL = profilePhoto || u.photoURL;

        let newUser: Usuario = {
            id: u.uid,
            name: u.displayName,
            avatar: photoURL
        };
        await Api.addUser(newUser)
        setUser(newUser)
    }

    if (user === null) {
        return (<Login onReceive={handleLoginData} />)
    }

    return (
        <div className="app-window relative">
            <div className="sidebar border-r-2">
                {/* <p className='absolute top-2 right-2'>
                    <ModeToggle />
                </p> */}
                <NewChat
                    show={showNewChat}
                    setShow={setShowNewChat}
                    user={user}
                    chatlist={chatlist}
                />
                <header>
                    <img className='header--avatar' src={user.avatar ?? "https://www.w3schools.com/howto/img_avatar.png"} alt='' />
                    <div className="header--buttons">
                        <div className='header--btn'>
                            <DonutLargeIcon className='text-muted-foreground' />
                        </div>
                        <div className='header--btn' onClick={handleNewChat}>
                            <ChatIcon className='text-muted-foreground' />
                        </div>
                        <div className='header--btn'>
                            <MoreVertIcon className='text-muted-foreground' />
                        </div>
                    </div>
                </header>

                <div className='search'>
                    <div className='search--input'>
                        <Search className='text-muted-foreground w-5 h-5' />
                        <input className='placeholder:text-muted-foreground text-foreground' type="search" placeholder='Pergunte à Meta AI ou pesquise' />
                    </div>
                </div>

                <div className='chatList'>
                    {chatlist.map((item, key) => (
                        <ChatListItem
                            key={key}
                            data={item}
                            onClick={() => setActiveChat(chatlist[key])}
                            active={activeChat?.chatId === chatlist[key].chatId}
                        />
                    ))}
                    <p className='text-center text-xs my-4 text-muted-foreground'>
                        <LockKeyhole className='w-3 h-3 inline mb-0.5 mr-1' /> Suas mensagens pessoais são protegidas com a <br /><span className='text-green-400'>criptografia de ponta a ponta</span>
                    </p>
                </div>


            </div>
            <div className="contentarea">
                {activeChat !== undefined &&
                    <ChatWindown
                        user={user}
                        data={activeChat}
                    />
                }


                {activeChat === undefined &&
                    <ChatIntro />
                }
            </div>
        </div>
    )
}
