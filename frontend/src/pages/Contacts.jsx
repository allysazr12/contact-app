import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Contacts.css";

function Contacts() {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const username = localStorage.getItem("username");
    const token = localStorage.getItem("token");

    const handleUnauthorized = (response) => {
        if (response.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("username");

            window.location.href = "/";
            return true;
        }

        return false;
    }

    useEffect(() => {
        const fetchContacts = async () => {
            try {
                const response = await fetch("http://localhost:8080/api/contacts", {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (handleUnauthorized(response)) {
                    return;
                }

                if (!response.ok) {
                    throw new Error("Failed to fetch contacts");
                }

                const data = await response.json();
                setContacts(data);
            } catch (error) {
                console.error("Error:", error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchContacts();
    }, [token]);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this contact?")) {
            return;
        }

        try {
            const response = await fetch(
                `http://localhost:8080/api/contacts/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (handleUnauthorized(response)) {
                return;
            }

            if (!response.ok) {
                throw new Error("Failed to delete contact");
            }

            setContacts((prev) =>
                prev.filter((contact) => contact.id !== id)
            );

            alert("Contact deleted successfully!");
        } catch (error) {
            console.error("Delete contact error:", error);
            alert(error.message || "Failed to delete contact");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("username");

        window.location.href = "/";
    }

    return (
        <div className="contacts-page">
            <div className="contacts-container">

                <div className="contacts-header">
                    <div>
                        <h1>Contact App</h1>
                        <p>Welcome, {username}!</p>
                    </div>

                    <button
                        className="logout-button"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                </div>

                <div className="contact-card">

                    <div className="section-header">
                        <h2>Contacts ({contacts.length})</h2>

                        <button
                            className="primary-button"
                            onClick={() => navigate("/contacts/new")}
                        >
                            Add New Contact
                        </button>
                    </div>

                    {loading && <p>Loading contacts...</p>}

                    {error && <p>{error}</p>}

                    {!loading &&
                        !error &&
                        contacts.length === 0 && (
                            <div className="empty-state">
                                <p>No contacts found.</p>

                                <button
                                    className="primary-button"
                                    onClick={() => navigate("/contacts/new")}
                                >
                                    Add New Contact
                                </button>
                            </div>
                        )
                    }

                    {!loading && contacts.length > 0 && (
                        <div className="contacts-list">
                            {contacts.map((contact) => (
                                <div
                                    className="contact-item"
                                    key={contact.id}
                                >
                                    <h3>{contact.name}</h3>

                                    <div className="contact-info">
                                        <div>
                                            <strong>Email:</strong>{" "}
                                            {contact.email}
                                        </div>

                                        <div>
                                            <strong>Phone:</strong>{" "}
                                            {contact.phone || "-"}
                                        </div>

                                        <div>
                                            <strong>Subject:</strong>{" "}
                                            {contact.subject || "-"}
                                        </div>

                                        <div className="contact-message">
                                            <strong>Message:</strong>
                                            <br />
                                            {contact.message}
                                        </div>
                                    </div>

                                    <div className="contact-actions">
                                        <button
                                            className="edit-button"
                                            onClick={() =>
                                                navigate(`/contacts/edit/${contact.id}`)
                                            }
                                        >
                                            Edit
                                        </button>

                                        <button
                                            className="delete-button"
                                            onClick={() =>
                                                handleDelete(contact.id)
                                            }
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}

export default Contacts;