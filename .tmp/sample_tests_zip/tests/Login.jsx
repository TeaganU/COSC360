import { useState } from "react";
import React from "react";

export default function Login() {
  const [form, setForm] = useState({
    username: "",
    password: ""
  });

  const [message, setMessage] = useState("");

  // simpler change handlers
  const handleUsernameChange = (e) => {
    setForm({
      username: e.target.value,
      password: form.password
    });
  };

  const handlePasswordChange = (e) => {
    setForm({
      username: form.username,
      password: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      const data = await res.json();
      setMessage(data.message);

    } catch (err) {
      setMessage("Error connecting to server");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>

      <input
        type="text"
        placeholder="Username"
        value={form.username}
        onChange={handleUsernameChange}
      />

      <input
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={handlePasswordChange}
      />

      <button type="submit">Login</button>

      <p>{message}</p>
    </form>
  );
}