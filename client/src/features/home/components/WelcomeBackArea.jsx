import { useAuth } from "../../../lib/AuthContext";

export default function WelcomeBackArea() {
    const { user } = useAuth();
    const username = user?.username || "Couldn't Load Username";

    return (
        <section className="flex flex-col gap-4">
            <h1 className="font-bold text-3xl">
                Welcome back, {username}!
            </h1>
        </section>
    )
}