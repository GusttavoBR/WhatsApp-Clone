import { initializeApp } from 'firebase/app';
import { addDoc, arrayUnion, collection, doc, getDocs, getFirestore, onSnapshot, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { getAuth, FacebookAuthProvider, signInWithPopup } from 'firebase/auth';
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

    addUser: async (u: any) => {
        try {
            const userRef = doc(db, 'users', u.id);

            await setDoc(userRef, {
                name: u.name,
                avatar: u.avatar
            }, { merge: true })

            console.log('Usuário salvo no banco de dados!')
        } catch (error) {
            console.error("Erro ao salvar usuário: ", error)
        }
    },

    getContactList: async (userId: any) => {
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
            console.log('ERROR' + error)
            return [];
        }
    },

    addNewChat: async (user: any, user2: any) => {
        try {
            // 1. Criar o chat e obter a referência já gravada (Equivalente ao .add() da imagem)
            const chatRef = await addDoc(collection(db, 'chats'), {
                messages: [],
                users: [user.id, user2.id],
            });

            // 2. Referências dos usuários
            const userRef = doc(db, 'users', user.id);
            const user2Ref = doc(db, 'users', user2.id);

            // 3. Atualizar User 1 (adiciona o User 2 na lista de chats dele)
            await updateDoc(userRef, {
                chats: arrayUnion({
                    chatId: chatRef.id,
                    title: user2.name || 'Usuário',
                    image: user2.avatar || '',
                    with: user2.id,
                    lastMessage: '',
                    lastMessageDate: ''

                })

            });

            // 4. Atualizar User 2 (adiciona o User 1 na lista de chats dele)
            await updateDoc(user2Ref, {
                chats: arrayUnion({
                    chatId: chatRef.id,
                    title: user.name,
                    image: user.avatar,
                    with: user.id,
                    lastMessage: '',
                    lastMessageDate: ''

                })
            });

            console.log("Novo chat criado com sucesso!");

        } catch (error) {
            console.error("Erro ao criar chat:", error);
        }
    },

    onChatList: (userId: string, setChatList: Function) => {
        const docRef = doc(db, "users", userId)

        return onSnapshot(docRef, (doc) => {
            if (doc.exists()) {
                let data = doc.data()
                if (data.chats) {
                    // Deduplica por contato (campo 'with') para limpar a interface
                    let uniqueChats: any[] = []
                    let chatIds = new Set()

                    for (let chat of data.chats) {
                        if (!chatIds.has(chat.with)) {
                            chatIds.add(chat.with)
                            uniqueChats.push(chat)
                        }
                    }

                    setChatList(uniqueChats)
                }
            }
        })


    }
}
