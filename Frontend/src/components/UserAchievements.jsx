import React, { useState } from 'react';

const ROOT_URL = 'http://localhost:3000';

const UserAchievements = () => {
    // User achievements state
    const [userIdForList, setUserIdForList] = useState('');
    const [userAchievements, setUserAchievements] = useState([]);
    
    // Award achievement state
    const [awardUserId, setAwardUserId] = useState('');
    const [awardAchievementId, setAwardAchievementId] = useState('');

    const fetchUserAchievements = async () => {
        if (!userIdForList) return;
        try {
            const res = await fetch(`${ROOT_URL}/user-achievements/${userIdForList}`);
            const data = await res.json();
            setUserAchievements(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error(err);
        }
    };

    const awardBadge = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${ROOT_URL}/user-achievements/award`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: awardUserId, achievementId: awardAchievementId })
            });
            if (res.ok) {
                alert('Achievement awarded successfully!');
                setAwardUserId('');
                setAwardAchievementId('');
                if (userIdForList === awardUserId) fetchUserAchievements();
            } else {
                const errorText = await res.text();
                alert('Error awarding achievement: ' + errorText);
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <h2>User Achievements Management</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ padding: '15px', background: '#f8f9fa', borderRadius: '8px' }}>
                    <h3>Award Achievement</h3>
                    <form onSubmit={awardBadge} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                        <input type="number" placeholder="User ID" value={awardUserId} onChange={e => setAwardUserId(e.target.value)} required />
                        <input type="number" placeholder="Achievement ID" value={awardAchievementId} onChange={e => setAwardAchievementId(e.target.value)} required />
                        <button type="submit">Award</button>
                    </form>
                </div>

                <div style={{ padding: '15px', background: '#f8f9fa', borderRadius: '8px' }}>
                    <h3>View User Achievements</h3>
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                        <input type="number" placeholder="User ID" value={userIdForList} onChange={e => setUserIdForList(e.target.value)} />
                        <button onClick={fetchUserAchievements}>Fetch</button>
                    </div>
                    <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid #ccc' }}>
                                <th>Title</th>
                                <th>Description</th>
                                <th>Earned Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {userAchievements.length > 0 ? userAchievements.map((ua, idx) => (
                                <tr key={idx} style={{ borderBottom: '1px solid #eee' }}>
                                    <td>{ua.Title}</td>
                                    <td>{ua.Description}</td>
                                    <td>{new Date(ua.EarnedDate).toLocaleDateString()}</td>
                                </tr>
                            )) : (
                                <tr><td colSpan="3">No earned achievements.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default UserAchievements;
