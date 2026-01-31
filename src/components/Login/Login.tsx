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

    const handleGoogleLogin = async () => {
        let { result, error } = await Api.googlePopup()
        if (result) {
            onReceive(result)
        } else {
            alert(`Erro: ${error?.code || 'Desconhecido'}`)
        }
    }

    return (
        <div className="flex flex-col items-center justify-center h-screen gap-4">
            <Button onClick={handleFacebookLogin} className="text-xl p-6 cursor-pointer w-64 bg-[#1877F2] hover:bg-[#166fe5]">
                Logar com Facebook
            </Button>
            <Button onClick={handleGoogleLogin} className="text-xl p-6 cursor-pointer w-64 bg-[#db4437] hover:bg-[#c5392d]">
                Logar com Google
            </Button>
        </div>
    )

}