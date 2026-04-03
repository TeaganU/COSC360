import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { PATHS } from "../../../app/Routes";
import { apiClient } from "../../../lib/ApiClient";

const initialForm = {
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
};

export default function SignupPage() {
    const navigate = useNavigate();
    const [form, setForm] = useState(initialForm);
    const [profileImageFile, setProfileImageFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState("");
    const [errors, setErrors] = useState({});
    const [generalError, setGeneralError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    function handleChange(event) {
        const { name, value } = event.target;
        setForm((current) => ({ ...current, [name]: value }));
    }

    function handleFileChange(event) {
        const file = event.target.files?.[0] ?? null;
        setProfileImageFile(file);

        if (file) {
            setPreviewUrl(URL.createObjectURL(file));
        } else {
            setPreviewUrl("");
        }
    }

    function validateForm() {
        const nextErrors = {};

        if (!form.username.trim()) nextErrors.username = "Username is required";
        if (!form.email.trim()) nextErrors.email = "Email is required";
        if (!form.password) nextErrors.password = "Password is required";
        if (form.password && form.password.length < 8) {
            nextErrors.password = "Password must be at least 8 characters";
        }
        if (form.confirmPassword !== form.password) {
            nextErrors.confirmPassword = "Passwords do not match";
        }

        return nextErrors;
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setGeneralError("");

        const validationErrors = validateForm();
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) return;

        const formData = new FormData();
        formData.append("username", form.username);
        formData.append("email", form.email);
        formData.append("password", form.password);

        if (profileImageFile) {
            formData.append("profileImage", profileImageFile);
        }

        setIsSubmitting(true);

        try {
            await apiClient.post("/auth/signup", formData);
            navigate(PATHS.LOGIN);
        } catch (error) {
            const data = error?.data ?? {};
            setErrors(data);
            setGeneralError(data.general ?? "Could not create account");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <section className="mx-auto max-w-md px-4 py-10">
            <div className="rounded-2xl bg-white p-8 shadow">
                <h1 className="mb-6 text-2xl font-bold">Create Account</h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="mb-1 block text-sm font-medium">Username</label>
                        <input
                            name="username"
                            value={form.username}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2"
                        />
                        {errors.username && (
                            <p className="mt-1 text-sm text-red-600">{errors.username}</p>
                        )}
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium">Email</label>
                        <input
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2"
                        />
                        {errors.email && (
                            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                        )}
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium">Profile Image</label>
                        <label
                            htmlFor="profileImage"
                            className="flex w-full cursor-pointer items-center justify-between rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700"
                        >
                            <span className="truncate">
                                {profileImageFile ? profileImageFile.name : "Choose an image"}
                            </span>
                            <span className="ml-3 rounded bg-black px-3 py-1 text-white">
                                Browse
                            </span>
                        </label>
                        <input
                            id="profileImage"
                            name="profileImage"
                            type="file"
                            accept="image/png,image/jpeg,image/webp,image/gif"
                            onChange={handleFileChange}
                            className="hidden"
                        />
                    </div>

                    {previewUrl && (
                        <img
                            src={previewUrl}
                            alt="Profile preview"
                            className="h-20 w-20 rounded-full border object-cover"
                        />
                    )}

                    <div>
                        <label className="mb-1 block text-sm font-medium">Password</label>
                        <input
                            name="password"
                            type="password"
                            value={form.password}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2"
                        />
                        {errors.password && (
                            <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                        )}
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium">Confirm Password</label>
                        <input
                            name="confirmPassword"
                            type="password"
                            value={form.confirmPassword}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2"
                        />
                        {errors.confirmPassword && (
                            <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                        )}
                    </div>

                    {generalError && (
                        <p className="text-sm text-red-600">{generalError}</p>
                    )}

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full rounded-lg bg-black py-2 text-white"
                    >
                        {isSubmitting ? "Creating Account..." : "Sign Up"}
                    </button>
                </form>

                <p className="mt-4 text-sm">
                    Already have an account?{" "}
                    <Link to={PATHS.LOGIN} className="font-semibold hover:underline">
                        Login
                    </Link>
                </p>
            </div>
        </section>
    );
}
