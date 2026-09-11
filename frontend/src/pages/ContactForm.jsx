import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./Contacts.css";

function ContactForm() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
    });

    const [loading, setLoading] = useState(false);

    const token = localStorage.getItem("token");

    const isEditMode = Boolean(id);

    const handleUnauthorized = (response) => {
        if (response.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("username");

            window.location.href = "/";
            return true;
        }

        return false;
    };

    useEffect(() => {
        if (!isEditMode) {
            return;
        }

        const fetchContact = async () => {
            try {
                setLoading(true);

                const response = await fetch(
                    `http://localhost:8080/api/contacts/${id}`,
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (handleUnauthorized(response)) {
                    return;
                }

                if (!response.ok) {
                    throw new Error("Failed to fetch contact");
                }

                const contact = await response.json();

                setForm({
                    name: contact.name || "",
                    email: contact.email || "",
                    phone: contact.phone || "",
                    subject: contact.subject || "",
                    message: contact.message || "",
                });
            } catch (error) {
                console.error("Fetch contact error:", error);
                alert("Failed to load contact");
                navigate("/contacts");
            } finally {
                setLoading(false);
            }
        };

        fetchContact();
    }, [id, isEditMode, navigate, token]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);

            const url = isEditMode
                ? `http://localhost:8080/api/contacts/${id}`
                : "http://localhost:8080/api/contacts";

            const method = isEditMode ? "PUT" : "POST";

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(form),
            });

            if (handleUnauthorized(response)) {
                return;
            }

            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(
                    errorData ||
                        `Failed to ${
                            isEditMode ? "update" : "create"
                        } contact`
                );
            }

            alert(
                isEditMode
                    ? "Contact updated successfully!"
                    : "Contact created successfully!"
            );

            navigate("/contacts");
        } catch (error) {
            console.error("Contact form error:", error);
            alert(error.message || "Failed to save contact");
        } finally {
            setLoading(false);
        }
    };

    if (loading && isEditMode) {
        return (
            <div className="contacts-page">
                <div className="contacts-container">
                    <div className="contact-card">
                        <p>Loading contact...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="contacts-page">
            <div className="contacts-container">
                <div className="contacts-header">
                    <div>
                        <h1>Contact App</h1>
                        <p>
                            {isEditMode
                                ? "Edit Contact"
                                : "Add New Contact"}
                        </p>
                    </div>
                </div>

                <div className="contact-card">
                    <h2>
                        {isEditMode
                            ? "Edit Contact"
                            : "Add New Contact"}
                    </h2>

                    <form
                        className="contact-form"
                        onSubmit={handleSubmit}
                    >
                        <div className="form-group">
                            <label>Name</label>
                            <input
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Phone</label>
                                <input
                                    type="text"
                                    name="phone"
                                    value={form.phone}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-group">
                                <label>Subject</label>
                                <input
                                    type="text"
                                    name="subject"
                                    value={form.subject}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Message</label>
                            <textarea
                                name="message"
                                value={form.message}
                                onChange={handleChange}
                                maxLength={2000}
                                required
                            />

                            <small>
                                {form.message.length}/2000
                            </small>
                        </div>

                        <div className="form-actions">
                            <button
                                type="submit"
                                className="primary-button"
                                disabled={loading}
                            >
                                {loading
                                    ? "Saving..."
                                    : isEditMode
                                    ? "Update Contact"
                                    : "Add Contact"}
                            </button>

                            <button
                                type="button"
                                className="secondary-button"
                                onClick={() => navigate("/contacts")}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ContactForm;