# How to Update Your Portfolio

Since your website is a static site (HTML/CSS/JS), adding new content involves editing the code files and uploading the changes. Here is a step-by-step guide on how to add Projects and Certificates.

## 1. Adding a New Project (Main Page)

Projects are manually defined in `index.html`. To add a new one:

### Step 1: Add HTML
1. Open `index.html`.
2. Scroll to the "Projects" section (`class="project-slider"`).
3. Copy an entire existing `project-card-3d` block (from `<div class="project-card-3d reveal">` to its closing `</div>`).
4. Paste it where you want the new project to appear.
5. Update the content:
   - Change the **Icon** class (e.g., `<i class="ph ph-brain"></i>`).
   - Update `data-i18n` attributes to new unique keys (e.g., `proj-6-name`, `proj-6-desc`).
   - Update links (Github/Live Demo) in the `<a>` tags.
   - Update badges (e.g., `<small class="badge">React • Node</small>`).

### Step 2: Add Translations
1. Open `script.js`.
2. Locate the `translations` object at the top.
3. Add your new keys (`proj-6-name`, etc.) to the `en`, `fr`, and `de` sections.

**Example:**
```javascript
// In script.js under 'en':
'proj-6-name': 'New Project Name',
'proj-6-desc': 'Description of the project',
```

---

## 2. Adding a New Certificate

The certificates page is dynamic, so adding a certificate is much easier!

1. **Add Image**: Save your certificate image (PNG/JPG) into the `assets/cert_images/` folder.
2. **Update Code**:
   - Open `certificates.html`.
   - Scroll to the bottom `<script>` section.
   - Find the `certificates` array:
     ```javascript
     const certificates = [
         { name: 'AI in Digital Marketing', file: 'AI in Digital Marketing.jpeg', icon: 'ph-brain' },
         // ... existing items
     ];
     ```
   - Add a new line for your certificate:
     ```javascript
     { name: 'Your Certificate Title', file: 'YourImage.png', icon: 'ph-certificate' },
     ```
   - **Note on Icons**: You can pick any icon from [Phosphor Icons](https://phosphoricons.com/). Use the name starting with `ph-`.

That's it! The grid layout and popup modal will automatically handle the new certificate.

---

## 3. Deploying Changes

After making these edits:
1. Save all files.
2. If you are using GitHub Pages / Vercel:
   - Commit and push your changes to GitHub.
   - The site will automatically update.
3. If using manual hosting:
   - Upload the modified `index.html`, `script.js`, and `certificates.html` (and any new images) to your server.
