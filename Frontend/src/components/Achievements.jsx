import React, { useState, useEffect } from 'react';

const ROOT_URL = 'http://localhost:3000';

const Achievements = () => {
    const [allAchievements, setAllAchievements] = useState([]);

    useEffect(() => {
        fetchAllAchievements();
    }, []);

    const fetchAllAchievements = async () => {
        try {
            const res = await fetch(`${ROOT_URL}/achievements/all`);
            const data = await res.json();
            setAllAchievements(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <h2>System Achievements</h2>
            
            <div style={{ padding: '15px', background: '#f8f9fa', borderRadius: '8px' }}>
                <h3>All Available Achievements</h3>
                <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid #ccc' }}>
                            <th>ID</th>
                            <th>Title</th>
                            <th>Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allAchievements.length > 0 ? allAchievements.map((a) => (
                            <tr key={a.AchievementID} style={{ borderBottom: '1px solid #eee' }}>
                                <td>{a.AchievementID}</td>
                                <td>{a.Title}</td>
                                <td>{a.Description}</td>
                            </tr>
                        )) : (
                            <tr><td colSpan="3">No achievements found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Achievements;
