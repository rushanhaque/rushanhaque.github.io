/* ==========================================================================
   PORTFOLIO CONTENT MANAGEMENT SYSTEM (CMS)
   ==========================================================================
   
   To update your certificates without coding:
   1. Create a Google Sheet
   2. Link it here
   
   Full instructions in SETUP_CMS.md
   ========================================================================== */

const CMS = {
    // PASTE YOUR GOOGLE SHEET CSV LINK BETWEEN THE QUOTES BELOW:
    sheetUrl: '',

    // Default/Fallback Data (These show if no sheet is linked)
    localCertificates: [
        { name: 'AI in Digital Marketing', file: 'AI in Digital Marketing.jpeg', icon: 'ph-brain' },
        { name: 'Campus Ambassador Internship', file: 'Campus ambassador internship.png', icon: 'ph-users-three' },
        { name: 'Cisco Python Basics', file: 'Cisco Python basics.png', icon: 'ph-code' },
        { name: 'Oracle Cloud Infrastructure', file: 'Oracle cloud infastructure.png', icon: 'ph-cloud-check' },
        { name: 'Oracle Fusion AI', file: 'Oracle fusion AI.png', icon: 'ph-brain' },
        { name: 'Python Training', file: 'Python training.png', icon: 'ph-terminal-window' },
        { name: 'Ethical Hacking Masterclass', file: 'Ethical hacking masterclass.png', icon: 'ph-shield-check' },
        { name: 'DUCAT Industrial Visit', file: 'DUCAT VISIT.png', icon: 'ph-factory' },
        { name: 'Fund Raising & Social Work', file: 'Fund raising social work-ex.png', icon: 'ph-hand-heart' },
        { name: 'The Imitation Game - 2nd Position', file: 'Screenshot 2026-01-28 132707.png', icon: 'ph-trophy' },
        { name: 'College Event Recognition', file: 'College event.png', icon: 'ph-medal' },
        { name: 'Academic Achievement', file: 'College event.jpeg', icon: 'ph-student' },
        { name: 'Campus Participation', file: 'College event (2).png', icon: 'ph-star' },
        { name: 'Extra-Curricular Excellence', file: 'college event (2).jpeg', icon: 'ph-certificate' },
        { name: 'Web Development Offer Letter', file: 'Web development offer letter.jpeg', icon: 'ph-code' }
    ],

    async getCertificates() {
        if (!this.sheetUrl) return this.localCertificates;

        try {
            // Add timestamp to prevent caching
            const url = this.sheetUrl + (this.sheetUrl.includes('?') ? '&' : '?') + 't=' + Date.now();
            const res = await fetch(url);
            if (!res.ok) throw new Error('Network response was not ok');
            const text = await res.text();
            return this.parseCSV(text);
        } catch (e) {
            console.warn('CMS: Could not fetch sheet. Using local backup.', e);
            return this.localCertificates;
        }
    },

    parseCSV(text) {
        const lines = text.split('\n').filter(l => l.trim());
        if (lines.length < 2) return []; // No data

        // Simple parser (Note: Avoid using commas inside your text values for now)
        const headers = lines[0].split(',').map(h => h.trim().toLowerCase());

        return lines.slice(1).map(line => {
            const values = line.split(',');
            const obj = {};
            headers.forEach((h, i) => {
                let val = values[i] ? values[i].trim() : '';
                // Remove quotes if present
                if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
                obj[h] = val;
            });

            // Map common header variations
            return {
                name: obj.title || obj.name || 'Untitled',
                file: obj.image || obj.file || obj.url || '',
                icon: obj.icon || 'ph-certificate'
            };
        });
    }
};
