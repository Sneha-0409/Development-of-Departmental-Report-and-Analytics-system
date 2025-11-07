import React from "react";
import styles from "./BackButton.module.css";

export default function BackButton({ onBack }) {
    return (
        <button className={styles.backButton} onClick={onBack}>
            ← Back
        </button>
    );
}
