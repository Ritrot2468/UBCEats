import React, { useState,  useEffect} from "react";
//import { Box, Typography, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import {fetchReviewContent, fetchUsersReviews, updateUserReview} from "../scripts";

const UserReviews = ({ userName, initialReviews }) => {
    const [reviews, setReviews] = useState(initialReviews || []);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [currentReview, setCurrentReview] = useState(null);
    const [editedComment, setEditedComment] = useState("");
    const [editedRating, setEditedRating] = useState(null);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await fetchUsersReviews(userName);
                const revIDs = response.result.map(item => Number(item[0]));

                const fetchedReviews = await Promise.all(
                    revIDs.map(async (id) => {
                        const reviewResponse = await fetchReviewContent(id);
                        if (reviewResponse.success) {
                            const [restaurantName, comment, rating, createdAt, updatedAt] = reviewResponse.result[0];
                            return {
                                id,
                                restaurantName,
                                comment,
                                rating,
                                createdAt,
                                updatedAt,
                            };
                        } else {
                            console.error(`Failed to fetch review with ID ${id}`);
                            return null;
                        }
                    })
                );

                setReviews(fetchedReviews.filter((review) => review !== null));
            } catch (error) {
                console.error("Error fetching reviews:", error);
            }
        };

        fetchReviews();
    }, [userName]);

    const handleEditOpen = (review) => {
        setCurrentReview(review);
        setEditedComment(review.comment);
        setEditedRating(review.rating);
        setEditDialogOpen(true);
    };

    const handleEditClose = () => {
        setEditDialogOpen(false);
        setCurrentReview(null);
        setEditedComment("");
        setEditedRating(null);
    };

    const handleEditSave = async () => {
        // Update the comment and rating
        await updateUserReview(editedComment, "CONTENT", currentReview.id);
        await updateUserReview(editedRating, "RATING", currentReview.id);

        const updatedReviews = reviews.map((review) =>
            review.id === currentReview.id
                ? { ...review, comment: editedComment, rating: editedRating }
                : review
        );
        setReviews(updatedReviews);
        handleEditClose();
    };

    const handleDelete = (reviewId) => {
        const updatedReviews = reviews.filter((review) => review.id !== reviewId);
        setReviews(updatedReviews);
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.heading}>Your Reviews</h2>
            {reviews.length > 0 ? (
                reviews.map((review) => (
                    <div key={review.id} style={styles.reviewCard}>
                        <h3 style={styles.restaurantName}>Restaurant: {review.restaurantName}</h3>
                        <p style={styles.comment}>Review: {review.comment}</p>
                        <p style={styles.rating}>Rating: {review.rating} / 5</p>
                        <div style={styles.actions}>
                            <button style={styles.button} onClick={() => handleEditOpen(review)}>
                                Edit
                            </button>
                            <button style={{ ...styles.button, backgroundColor: "red" }} onClick={() => handleDelete(review.id)}>
                                Delete
                            </button>
                        </div>
                    </div>
                ))
            ) : (
                <p>No reviews available.</p>
            )}

            {editDialogOpen && (
                <div style={styles.dialogOverlay}>
                    <div style={styles.dialog}>
                        <h3>Edit Review</h3>
                        <textarea
                            style={styles.textarea}
                            value={editedComment}
                            onChange={(e) => setEditedComment(e.target.value)}
                        ></textarea>
                        <input
                            type="number"
                            min="0"
                            max="5"
                            step="0.1"
                            style={styles.input}
                            value={editedRating}
                            onChange={(e) => setEditedRating(Number(e.target.value))}
                            placeholder="Rating (0-5)"
                        />
                        <div style={styles.dialogActions}>
                            <button style={styles.button} onClick={handleEditClose}>
                                Cancel
                            </button>
                            <button style={styles.button} onClick={handleEditSave}>
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <button style={{ ...styles.button, marginTop: "20px" }}>Add a Review</button>
        </div>
    );
};


const styles = {
    container: {
        maxWidth: "800px",
        margin: "auto",
        backgroundColor: "#f9f9f9",
        padding: "20px",
        borderRadius: "10px",
        textAlign: "center",
    },
    heading: {
        fontSize: "24px",
        marginBottom: "20px",
    },
    reviewCard: {
        backgroundColor: "#fff",
        padding: "15px",
        marginBottom: "15px",
        borderRadius: "8px",
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
        textAlign: "left",
    },
    restaurantName: {
        fontSize: "18px",
        fontWeight: "bold",
        marginBottom: "5px",
    },
    comment: {
        marginBottom: "5px",
    },
    rating: {
        color: "#555",
    },
    actions: {
        display: "flex",
        gap: "10px",
        marginTop: "10px",
    },
    button: {
        padding: "10px 20px",
        border: "none",
        borderRadius: "5px",
        backgroundColor: "#007BFF",
        color: "#fff",
        cursor: "pointer",
    },
    dialogOverlay: {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    dialog: {
        backgroundColor: "#fff",
        padding: "20px",
        borderRadius: "10px",
        maxWidth: "400px",
        width: "100%",
        textAlign: "center",
    },
    textarea: {
        width: "100%",
        height: "100px",
        marginBottom: "15px",
        borderRadius: "5px",
        border: "1px solid #ccc",
        padding: "10px",
    },
    dialogActions: {
        display: "flex",
        justifyContent: "space-around",
    },
};

export default UserReviews;