import Api from "@/Api"
import { Button } from "../ui/button"
import { UserCredential } from 'firebase/auth'

type Props = {
    onReceive: (result: UserCredential) => void
}

export const Login = ({ onReceive }: Props) => {

    const handleFacebookLogin = async () => {
        let { result, error } = await Api.fbPopup()
        if (result) {
            onReceive(result)
        } else {
            alert(`Erro: ${error?.code || 'Desconhecido'}`)
        }
    }

    return (
        <div onClick={handleFacebookLogin} className="flex items-center justify-center h-screen ">
            <Button className="text-2xl p-4 cursor-pointer">
                Logar com Facebook
            </Button>
        </div>
    )
}