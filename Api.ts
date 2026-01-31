import { initializeApp } from 'firebase/app';
import { addDoc, arrayUnion, collection, doc, getDoc, getDocs, getFirestore, onSnapshot, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { getAuth, FacebookAuthProvider, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

import { Usuario } from './src/components/ChatWindown/ChatWindown';
import { Chat } from './src/types/chat';

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);

export default {
    fbPopup: async () => {
        const provider = new FacebookAuthProvider();
        provider.addScope('public_profile');
        try {
            let result = await signInWithPopup(auth, provider);
            return { result };
        } catch (error: any) {
            console.error("Facebook Login Error:", error);
            return { error };
        }
    },

    googlePopup: async () => {
        const provider = new GoogleAuthProvider();
        try {
            let result = await signInWithPopup(auth, provider);
            return { result };
        } catch (error: any) {
            console.error("Google Login Error:", error);
            return { error };
        }
    },


    addUser: async (u: Usuario) => {
        try {
            const userRef = doc(db, 'users', u.id);
            await setDoc(userRef, {
                name: u.name,
                avatar: u.avatar
            }, { merge: true })
        } catch (error) {
            console.error("Erro ao salvar usuário: ", error)
        }
    },

    getContactList: async (userId: string) => {
        try {
            let list: any[] = []
            const querySnapshot = await getDocs(collection(db, 'users'));
            querySnapshot.forEach(doc => {
                let data = doc.data()
                if (doc.id !== userId) {
                    list.push({
                        id: doc.id,
                        name: data.name,
                        avatar: data.avatar
                    })
                }
            })
            return list;
        } catch (error) {
            console.error("Erro ao pegar lista de contatos:", error);
            return [];
        }
    },

    addNewChat: async (user: Usuario, user2: any) => {
        try {
            const chatRef = await addDoc(collection(db, 'chats'), {
                messages: [],
                users: [user.id, user2.id],
            });

            const userRef = doc(db, 'users', user.id);
            const user2Ref = doc(db, 'users', user2.id);

            const chatData1 = {
                chatId: chatRef.id,
                title: user2.name || 'Usuário',
                image: user2.avatar || '',
                with: user2.id,
                lastMessage: '',
                lastMessageDate: '',
                users: [user.id, user2.id]
            };

            const chatData2 = {
                chatId: chatRef.id,
                title: user.name,
                image: user.avatar,
                with: user.id,
                lastMessage: '',
                lastMessageDate: '',
                users: [user.id, user2.id]
            };

            await updateDoc(userRef, { chats: arrayUnion(chatData1) });
            await updateDoc(user2Ref, { chats: arrayUnion(chatData2) });

        } catch (error) {
            console.error("Erro ao criar chat:", error);
        }
    },

    onChatList: (userId: string, setChatList: Function) => {
        return onSnapshot(doc(db, "users", userId), (doc) => {
            if (doc.exists()) {
                let data = doc.data();
                if (data.chats) {
                    let uniqueChats: any[] = [];
                    let chatIds = new Set();
                    for (let chat of data.chats) {
                        if (!chatIds.has(chat.with)) {
                            chatIds.add(chat.with);
                            uniqueChats.push(chat);
                        }
                    }
                    let chats = [...uniqueChats]
                    chats.sort((a, b) => {
                        if (a.lastMessageDate === undefined || a.lastMessageDate === '') {
                            return 1;
                        }
                        if (b.lastMessageDate === undefined || b.lastMessageDate === '') {
                            return -1;
                        }

                        let aTime = a.lastMessageDate.seconds ? a.lastMessageDate.seconds : new Date(a.lastMessageDate).getTime() / 1000;
                        let bTime = b.lastMessageDate.seconds ? b.lastMessageDate.seconds : new Date(b.lastMessageDate).getTime() / 1000;

                        return bTime - aTime;
                    });

                    setChatList(chats);
                }
            }
        });
    },

    onChatContent: (chatId: string, setList: Function) => {
        return onSnapshot(doc(db, 'chats', chatId), (doc) => {
            if (doc.exists()) {
                let data = doc.data();
                if (data.messages) {
                    setList(data.messages);
                }
            }
        });
    },

    sendMessage: async (chatData: Chat, userId: string, type: string, body: string) => {
        try {
            const now = new Date();
            const chatRef = doc(db, 'chats', chatData.chatId);

            await updateDoc(chatRef, {
                messages: arrayUnion({
                    type,
                    author: userId,
                    body,
                    date: now
                })
            });

            const usersToUpdate = chatData.users || [userId, chatData.with];

            for (let uId of usersToUpdate) {
                const uRef = doc(db, 'users', uId);
                const uDoc = await getDoc(uRef);

                if (uDoc.exists()) {
                    let data = uDoc.data();
                    let chats = data.chats ? [...data.chats] : [];

                    for (let i in chats) {
                        if (chats[i].chatId === chatData.chatId) {
                            chats[i].lastMessage = body;
                            chats[i].lastMessageDate = now;
                        }
                    }

                    await updateDoc(uRef, { chats });
                }
            }
        } catch (error) {
            console.error("Erro ao enviar mensagem:", error);
        }
    }
}
