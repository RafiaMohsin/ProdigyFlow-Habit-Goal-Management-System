import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';

function HabitNotes() {
  const [habitId, setHabitId] = useState('1');
  const [userId, setUserId] = useState('1');
  const [noteText, setNoteText] = useState('');
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchNotes = async () => {
    if (!habitId) return;
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/notes/history/${habitId}`);
      if (response.ok) {
        const data = await response.json();
        // Filter out Logs so we strictly only show Notes
        const notesOnly = data.filter(item => 
          item.ActivityDetails ? item.ActivityDetails.startsWith('Note: ') : true
        );
        setNotes(notesOnly);
      }
    } catch (error) {
      console.error('Error fetching habit notes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [habitId]);

  const handleAddNote = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ habitId, userId, noteText })
      });
      if (response.ok) {
        setNoteText('');
        fetchNotes();
      } else {
        console.error('Failed to add note');
      }
    } catch (error) {
      console.error('Error adding note:', error);
    }
  };

  const handleEditNote = async (noteId, currentText) => {
    const newText = prompt('Edit note:', currentText);
    if (newText && newText !== currentText) {
      try {
        const response = await fetch(`${API_BASE_URL}/notes/edit`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ noteId, userId, noteText: newText })
        });
        if (response.ok) {
          fetchNotes();
        }
      } catch (error) {
        console.error('Error editing note:', error);
      }
    }
  };

  const handleDeleteNote = async (noteId) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        const response = await fetch(`${API_BASE_URL}/notes/${noteId}/${userId}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          fetchNotes();
        }
      } catch (error) {
        console.error('Error deleting note:', error);
      }
    }
  };

  return (
    <div className="component-container">
      <h2>Habit Notes</h2>
      
      <div className="control-group">
        <label>View Notes for Habit ID: </label>
        <input 
          type="number" 
          value={habitId} 
          onChange={(e) => setHabitId(e.target.value)} 
          placeholder="Enter Habit ID"
        />
      </div>

      <hr />

      <form onSubmit={handleAddNote} className="add-form">
        <h3>Add a Note</h3>
        <input 
          type="number" 
          value={userId} 
          onChange={(e) => setUserId(e.target.value)} 
          placeholder="User ID" 
          required 
        />
        <textarea 
          placeholder="Write your note here..." 
          value={noteText} 
          onChange={(e) => setNoteText(e.target.value)} 
          required 
        />
        <button type="submit">Add Note</button>
      </form>

      <hr />

      <h3>Notes History</h3>
      {loading ? <p>Loading notes...</p> : (
        <ul className="item-list">
          {notes.map((note, index) => (
            <li key={index}>
              <strong>{new Date(note.ActivityDate).toLocaleString()}:</strong> {note.ActivityDetails || note.NoteText}
              {note.NoteID && (
                <div style={{marginTop: '5px'}}>
                  <button onClick={() => handleEditNote(note.NoteID, note.ActivityDetails || note.NoteText)} style={{marginRight: '10px'}}>Edit</button>
                  <button onClick={() => handleDeleteNote(note.NoteID)} style={{backgroundColor: '#e74c3c'}}>Delete</button>
                </div>
              )}
            </li>
          ))}
          {notes.length === 0 && <p>No notes found for this habit.</p>}
        </ul>
      )}
    </div>
  );
}

export default HabitNotes;
