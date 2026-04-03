import { Link } from "react-router-dom";
import { RelativeTime } from "../../../lib/RelativeTime";
import { PATHS } from "../../../app/Routes";
import { getImageUrl } from "../../../lib/getImageUrl";

export default function RecentQuestionsCard({ post }) {
    const username = post.authorUsername || "Author Name";
    const initials = username.slice(0, 2).toUpperCase();

    return (
        <Link to={PATHS.POST(post._id)}
            className="flex w-full px-2 py-1 items-center justify-between bg-white border border-gray-300 rounded-lg 
            hover:cursor-pointer hover:border-gray-500 hover:-translate-x-0.5">
            <div className="flex flex-col">
                <span>
                    <span>
                        {post.category || "Category"}
                    </span>
                    <h1 className="font-bold text-xl">
                        {post.title || "Title"}
                    </h1>
                </span>

                <div className="flex items-center gap-3 mt-auto">
                    {post.authorProfileImage ? (
                        <img
                            src={getImageUrl(post.authorProfileImage)}
                            alt={`${username} profile`}
                            className="h-8 w-8 rounded-full border object-cover"
                        />
                    ) : (
                        <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-black text-xs text-white">
                            {initials}
                        </div>
                    )}
                    <span className="text-sm font-medium text-gray-800">
                        {username}
                    </span>
                </div>
            </div>

            <span>
                {RelativeTime(post.createdAt)}
            </span>
        </Link>
    )
}
