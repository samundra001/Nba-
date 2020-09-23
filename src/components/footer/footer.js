import React from 'react';
import styles from './footer.module.css';
import {Link} from 'react-router-dom';

import {CURRENT_YEAR} from '../../config' // since CURRENT_YEAR is object we need to use curly braces


const Footer = () => {
    return(
        <div className={styles.footer}>
            <Link to = "/" className={styles.logo}>
            <img alt = "nba logo" src="/images/nba_logo.png"/>
            
            </Link>
            <div className={styles.right} >
                @NBA {CURRENT_YEAR} ALL  rights reservered
            </div>
        </div>
    )
}

export default Footer;