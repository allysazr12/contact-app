import {useState} from 'react';
import {useNavigate} from 'react-router-dom';

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        try {
            const response = await fetch("http://localhost:8080/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ 
                    username: username, 
                    password: password 
                })
            });

            const data = await response.json();

            console.log("Status: ", response.status);
            console.log("Response: ", data);

            if (response.ok) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("username", data.username);

                console.log("Login berhasil!");
                console.log("Token saved");

                navigate("/contacts");
            }
        } catch (error) {
            console.error("Login Error:", error);
        }
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <h1>Contact App</h1>
                <p className="login-subtitle">Please login to continue</p>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            placeholder="Enter your username"
                            value={username}
                            onChange={(event) => setUsername(event.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                        type="password"
                        id="password"
                        name="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        />
                    </div>

                    <button type="submit">Login</button>
                </form>
            </div>
        </div>
    )
}

export default Login