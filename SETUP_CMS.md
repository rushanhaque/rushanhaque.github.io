# 🚀 How to Enable "No-Code" Updates

I have set up your website so you can update certificates **using a simple Google Sheet**. This means you don't need to touch the code anymore to add new credentials!

## Step 1: Create the Google Sheet
1. Create a new [Google Sheet](https://sheets.new).
2. Use the first row for headers. Enter these exactly:
   | A1 | B1 | C1 |
   |----|----|----|
   | **name** | **file** | **icon** |

3. Add your certificate data in the rows below.
   - **name**: The title of the certificate.
   - **file**: 
     - If using an image already in your `assets/cert_images/` folder, just type the filename (e.g. `cisco.png`).
     - If using a new image from the web, paste the full URL (e.g. `https://imgur.com/example.png`).
   - **icon**: The icon code from [Phosphor Icons](https://phosphoricons.com/). (e.g. `ph-scroll` or `ph-certificate`).

## Step 2: Publish Your Sheet
To let the website read your sheet, you must publish it:
1. Click **File** > **Share** > **Publish to web**.
2. Change "Web page" to **Comma-separated values (.csv)** (This is important!).
3. Click **Publish**.
4. Copy the link needed (it ends in `output=csv`).

## Step 3: Connect It (One-Time Setup)
1. Open the file `cms.js` in your website folder (or GitHub).
2. Paste your link into the quote marks at the top:
   ```javascript
   const CMS = {
       sheetUrl: 'PASTE_YOUR_LINK_HERE',
   // ...
   ```
3. Save the file.

🎉 **That's it!** Now, whenever you add a row to that Google Sheet, your website will automatically update when you refresh the page.
