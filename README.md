  
#  <img height="27px" src="https://github.com/user-attachments/assets/f96ecc14-bc29-4769-828e-c94cb3c87b9e" /> Faved

Faved is a simple self-hosted web application to store and organise web links. All data is stored locally on your computer.

100% free and open source. No ads, tracking, or data collection.

<div align="center">
  
  🧪 **[Try Live Demo](https://demo.faved.dev/)** | 🌐 **[Visit Website](https://faved.dev/)** | 📚 **[Read Blog](https://faved.dev/blog)** | 𝕏 **[Follow on X](https://x.com/FavedTool)**

</div>

<img width="1000" height="791" alt="screenshot-list-desktop-mobile-ff-small" src="https://github.com/user-attachments/assets/27a0f3bb-09fe-49bf-9ca6-94c8ebfd2fd2" />


## Features

- Save bookmarks with titles, descriptions, URLs and custom notes from any desktop browser using a bookmarklet.
- Organize bookmarks with color-styled nested tags. Pin important tags at the top for quick access.
- Super fast performance: loads full page with 2,000+ bookmarks in under 100ms.
- Import bookmarks from Pocket: easily migrate your saved links, tags, collections and notes from Pocket by uploading the exported ZIP file.

## Requirements

- Docker

## Installation
1. Pull the latest stable image from Docker Hub.
```
docker pull denho/faved
```

2. Start the Docker container:
```bash
docker run -d --name faved -p 8080:80 -v faved-data:/var/www/html/storage denho/faved
```
This command will:
* Run the container in the background (-d).
* Name the container faved (--name faved).
* Map port 8080 on your host to port 80 inside the container (-p 8080:80). You can change 8080 to any port you prefer.
* Create and mount a named volume called faved-data to application storage directory inside the container (-v faved-data:/var/www/html/storage).

3. Once the container is running, you can access the Faved application in your web browser at http://localhost:8080. 

\* The first time you visit, you'll be prompted to set up the database. Just click "Initialize Database" to proceed and finish installation.

### Using the Bookmarklet

<img width="731" height="914" alt="screenshot-add-ff-slack" src="https://github.com/user-attachments/assets/f50d32f9-2596-423b-8b8b-d8b9f86057a2" />

1. Navigate to Bookmarklet section in the application Settings. 
2. Look for the bookmarklet link "Add to Faved".
2. Drag the bookmarklet link to your browser's bookmarks bar.
3. When browsing the web, click the bookmarklet on any page you want to save.
4. The form to add the web page to Faved will open.
5. Add tags and notes as desired, then save.


## Project Structure

- `/controllers`: Application controllers
- `/frontend`: React frontend source files
- `/framework`: Core framework components
- `/models`: Data models
- `/public`: Web-accessible files
- `/storage`: Database storage
- `/utils`: Utility classes
- `/views`: HTML templates

## License

This project is licensed under the [MIT License](LICENSE).

## Credits

Faved uses only open source packages:

- React, Tailwind, Shadcn UI, Vite for the frontend
- Apache + PHP 8 + SQLite stack for the backend
