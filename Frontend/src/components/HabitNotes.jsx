import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';

function HabitNotes() {
  const [userId] = useState(localStorage.getItem('userId') || '1');
  const [habitId, setHabitId] = useState('');
  const [userHabits, setUserHabits] = useState([]);
  const [noteText, setNoteText] = useState('');
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [editNoteText, setEditNoteText] = useState('');

  useEffect(() => {
    const fetchHabits = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/habits`, { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } });
        if (res.ok) {
          const habits = await res.json();
          setUserHabits(habits);
          if (habits.length > 0) setHabitId(habits[0].HabitID);
        }
      } catch (err) { console.error('Error fetching habits:', err); }
    };
    fetchHabits();
  }, [userId]);

  const fetchNotes = async () => {
    if (!habitId) return;
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/notes/history/${habitId}`, { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } });
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
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
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

  const handleEditNote = async (noteId) => {
    if (editNoteText.trim() !== '') {
      try {
        const response = await fetch(`${API_BASE_URL}/notes/edit`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
          body: JSON.stringify({ noteId, userId, noteText: editNoteText })
        });
        if (response.ok) {
          setEditingNoteId(null);
          setEditNoteText('');
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
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
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
    <div className="content">
      <div className="card">
        <h2>Habit Notes</h2>
        
        <div className="control-group" style={{ marginBottom: '24px' }}>
          <label style={{ fontWeight: '600', marginRight: '10px' }}>Select Habit: </label>
          <select 
            value={habitId} 
            onChange={(e) => setHabitId(e.target.value)} 
            style={{ width: '300px', display: 'inline-block', marginBottom: 0 }}
          >
            {userHabits.map(h => (
              <option key={h.HabitID} value={h.HabitID}>{h.HabitName}</option>
            ))}
            {userHabits.length === 0 && <option value="">No Habits Found</option>}
          </select>
        </div>

        <form onSubmit={handleAddNote} className="add-form" style={{ background: '#f8fafc', padding: '24px', borderRadius: '16px', marginBottom: '32px' }}>
          <h3>Add a Note</h3>
          <div style={{ marginBottom: '16px' }}>
            <input 
              type="text"
              placeholder="Write your note here..." 
              value={noteText} 
              onChange={(e) => setNoteText(e.target.value)} 
              required 
              style={{ marginBottom: 0 }}
            />
          </div>
          <button type="submit" className="submit-btn" style={{ width: '100%' }}>Save Note</button>
        </form>

        <h3>Notes History</h3>
        {loading ? <p>Loading notes...</p> : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {notes.map((note, index) => (
              <div key={index} style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '700', marginBottom: '8px' }}>
                    {new Date(note.ActivityDate).toLocaleString()}
                  </div>
                  {editingNoteId === note.NoteID ? (
                    <div style={{ marginTop: '8px' }}>
                      <textarea
                        value={editNoteText}
                        onChange={(e) => setEditNoteText(e.target.value)}
                        style={{ width: '100%', minHeight: '80px', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', marginBottom: '8px', fontFamily: 'inherit', fontSize: '14px' }}
                      />
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => handleEditNote(note.NoteID)} className="submit-btn" style={{ padding: '6px 16px', fontSize: '13px' }}>Save</button>
                        <button onClick={() => setEditingNoteId(null)} className="logout-btn" style={{ margin: 0, padding: '6px 16px', fontSize: '13px', width: 'auto' }}>Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <div style={{ fontSize: '15px', color: '#1e293b', lineHeight: '1.5' }}>
                      {(note.ActivityDetails || note.NoteText).replace(/^Note:\s*/, '')}
                    </div>
                  )}
                </div>
                {note.NoteID && editingNoteId !== note.NoteID && (
                  <div style={{ display: 'flex', gap: '8px', flexShrink: 0, marginLeft: '20px' }}>
                    <button onClick={() => {
                      setEditingNoteId(note.NoteID);
                      setEditNoteText((note.ActivityDetails || note.NoteText).replace(/^Note:\s*/, ''));
                    }} className="submit-btn" style={{ padding: '8px 16px', fontSize: '13px' }}>Edit</button>
                    <button onClick={() => handleDeleteNote(note.NoteID)} className="logout-btn" style={{ margin: 0, padding: '8px 16px', width: 'auto', fontSize: '13px' }}>Delete</button>
                  </div>
                )}
              </div>
            ))}
            {notes.length === 0 && <p style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>No notes found for this habit.</p>}
          </div>
        )}
      </div>
    </div>
  );
}

export default HabitNotes;
