import React, { useState, useEffect } from "react";
import styles from "./StudentProjectPage.module.css";
import { collection, query, where, onSnapshot, addDoc, serverTimestamp, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebase";

const StudentProjectPage = ({ currentUser }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [techStack, setTechStack] = useState("");
  const [link, setLink] = useState("");

  const userEmail = currentUser?.email?.toLowerCase() || "";

  useEffect(() => {
    if (!userEmail) {
      setLoading(false);
      return;
    }

    const q = query(collection(db, "student_projects"), where("userEmail", "==", userEmail));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProjects(fetched.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)));
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userEmail]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    setIsSubmitting(true);
    try {
      const stackArray = techStack.split(',').map(s => s.trim()).filter(s => s);
      
      await addDoc(collection(db, "student_projects"), {
        userEmail,
        studentName: currentUser?.name || "Student",
        title,
        description,
        techStack: stackArray,
        link,
        createdAt: serverTimestamp()
      });

      // Reset form & close modal
      setTitle("");
      setDescription("");
      setTechStack("");
      setLink("");
      setShowModal(false);
    } catch (err) {
      console.error("Error adding project:", err);
      alert("Failed to submit project.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        await deleteDoc(doc(db, "student_projects", id));
      } catch (err) {
        console.error("Error deleting project:", err);
      }
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <div>
          <h1>My Projects</h1>
          <p>Showcase your academic and personal engineering projects.</p>
        </div>
        <button className={styles.addBtn} onClick={() => setShowModal(true)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          Add Project
        </button>
      </div>

      {loading ? (
        <p>Loading projects...</p>
      ) : projects.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>🚀</div>
          <h3>No projects found</h3>
          <p>You haven't added any projects to your portfolio yet.</p>
          <button className={styles.addBtn} style={{margin: '0 auto'}} onClick={() => setShowModal(true)}>
            Add Your First Project
          </button>
        </div>
      ) : (
        <div className={styles.projectGrid}>
          {projects.map(proj => (
            <div key={proj.id} className={styles.projectCard}>
              <h3 className={styles.projectTitle}>{proj.title}</h3>
              <p className={styles.projectDesc}>{proj.description}</p>
              
              {proj.techStack && proj.techStack.length > 0 && (
                <div className={styles.techStack}>
                  {proj.techStack.map((tech, i) => (
                    <span key={i} className={styles.techTag}>{tech}</span>
                  ))}
                </div>
              )}

              <div className={styles.cardFooter}>
                {proj.link ? (
                  <a href={proj.link} target="_blank" rel="noopener noreferrer" className={styles.projLink}>
                    View Project <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                  </a>
                ) : <span style={{color: '#94a3b8', fontSize: '0.9rem'}}>No link provided</span>}
                
                <button className={styles.deleteBtn} onClick={() => handleDelete(proj.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Project Modal */}
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2>Add New Project</h2>
            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label>Project Title *</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Smart Irrigation System" 
                  required 
                />
              </div>
              <div className={styles.formGroup}>
                <label>Description *</label>
                <textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Briefly describe what your project does..." 
                  required 
                />
              </div>
              <div className={styles.formGroup}>
                <label>Technologies Used</label>
                <input 
                  type="text" 
                  value={techStack}
                  onChange={(e) => setTechStack(e.target.value)}
                  placeholder="e.g. React, Node.js, Arduino (comma separated)" 
                />
              </div>
              <div className={styles.formGroup}>
                <label>Project Link / Repo</label>
                <input 
                  type="url" 
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  placeholder="https://github.com/yourusername/repo" 
                />
              </div>
              
              <div className={styles.formActions}>
                <button type="button" className={styles.cancelBtn} onClick={() => setShowModal(false)} disabled={isSubmitting}>
                  Cancel
                </button>
                <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Save Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentProjectPage;
