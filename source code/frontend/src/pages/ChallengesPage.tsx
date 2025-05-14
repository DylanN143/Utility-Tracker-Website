import React, { useState, useEffect } from 'react';
import '../components/Header.css'
import '../components/Banner.css'
import Challenges from '../components/Challenges';
import myImage from '../images/forest.jpg';

function ChallengesPage() {
    const [username, setUsername] = useState("");

    // Get username from sessionStorage (set by AuthLayout)
    useEffect(() => {
        const storedUsername = sessionStorage.getItem('username');
        if (storedUsername) {
            setUsername(storedUsername);
        }
    }, []);

    return (
        <div style={{ padding: '20px' }}>
            <div className="banner">
                <img className='banner-img' src={myImage} alt="Forest landscape"/>
            </div>

            {username && <Challenges username={username} />}
        </div>
    );
}

export default ChallengesPage;