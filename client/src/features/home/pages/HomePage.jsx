import RecentQuestions from "../components/RecentQuestions";
import TrendingSkills from "../components/TrendingSkills";
import WelcomeArea from "../components/WelcomeArea";
import { useAuth } from "../../../lib/AuthContext";
import WelcomeBackArea from "../components/WelcomeBackArea";

export default function HomePage() {
    const { isLoggedIn } = useAuth();

    return (
        <main className="flex flex-col gap-5 px-8 py-4">
            {!isLoggedIn ? <WelcomeArea /> : <WelcomeBackArea />}
            <TrendingSkills />
            <RecentQuestions />
        </main>
    )
}