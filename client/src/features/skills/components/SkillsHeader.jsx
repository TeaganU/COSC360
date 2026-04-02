import { Link } from "react-router-dom";
import { PATHS } from "../../../app/Routes";

export default function SkillsHeader({ searchText }) {
    return (
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
                <p className="text-sm text-gray-500">
                    <Link to="/" className="hover:underline">
                        Home
                    </Link>{" "}
                    &gt;{" "}
                    <Link to="/skills" className="hover:underline">
                        Skills
                    </Link>
                </p>
                <h1 className="mt-2 text-3xl font-semibold text-gray-900">
                    Browse Skills
                </h1>
                {searchText && (
                    <p className="mt-2 text-sm text-gray-600">
                        Search results for: {searchText}
                    </p>
                )}
            </div>

            <Link
                to={PATHS.CREATEPOST}
                className="inline-block bg-black px-4 py-2 text-white"
            >
                Create Post
            </Link>
        </div>
    );
}
