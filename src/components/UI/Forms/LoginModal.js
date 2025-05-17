import { useState } from "react";

export default function LoginModal({ userIdRef, setIsLoginModalVisible, setIsRegisterModalVisible }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Login failed");

      userIdRef.current = data.user_id;
      setIsLoginModalVisible(false);
    } catch (error) {
      console.error("Login error:", error);
      setError(error.message);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded shadow-lg w-full max-w-sm">
        <h2 className="text-2xl mb-4">Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mb-4 p-2 border rounded"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mb-4 p-2 border rounded"
          />
          {error && <p className="text-red-600 mb-4">{error}</p>}
          <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full mb-2">Login</button>
        </form>
        <button onClick={() => {
          setIsLoginModalVisible(false);
          setIsRegisterModalVisible(true);
        }} className="text-blue-500 underline">Register</button>
      </div>
    </div>
  );
}
