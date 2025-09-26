  
#  <img height="27px" src="https://github.com/user-attachments/assets/f96ecc14-bc29-4769-828e-c94cb3c87b9e" /> Faved

Faved is a simple self-hosted web application to store and organise web links. All data is stored locally.

100% free and open source. No ads, tracking, or data collection.

<div align="center">
  
  🧪 **[Try Live Demo](https://demo.faved.dev/)** | 🌐 **[Visit Website](https://faved.dev/)** | 📚 **[Read Blog](https://faved.dev/blog)** | 𝕏 **[Follow on X](https://x.com/FavedTool)**

</div>

<img width="1000" height="791" alt="screenshot-list-desktop-mobile-ff-small-compressorio" src="https://github.com/user-attachments/assets/58987e97-5ed3-4628-aed6-0756d6404c81" />


## Features

- **Clean Interface**: A distraction-free UI to help you quickly find and manage your bookmarks.
- **Advanced tagging system**: Organize bookmarks with colored nested tags. Pin important tags at the top for quick access.
- **Browser bookmarklet**: Save bookmarks from any desktop or mobile browser without installing any extensions.
- **Lightweight and swift**: Built with efficiency in mind, Faved loads fast and runs with minimal resource usage.
- **One-click migration from Pocket**: easily move your saved links, tags, collections and notes from Pocket by uploading the exported ZIP file.
- **Open Source**: The code is open for you to inspect, modify, and contribute to.

## Requirements

- Docker

## Installation
### Installation with Docker (fastest way to run locally)
#### 1. Pull the latest stable image from Docker Hub

```bash
docker pull denho/faved
```

#### 2. Start the Docker container
```bash
docker run -d --name faved -p 8080:80 -v faved-data:/var/www/html/storage denho/faved
```
This command will:
* Run the container in the background (`-d`).
* Name the container `faved` (`--name faved`).
* Map port `8080` on your host to port `80` inside the container (`-p 8080:80`). You can change `8080` to any port you prefer.
* Create and mount a named volume called faved-data to application storage directory inside the container (`-v faved-data:/var/www/html/storage`).

#### 3. Access the application
Once the container is running, you can access the Faved application in your web browser at http://localhost:8080. 

The first time you visit, you'll be prompted to set up the database. Just click "Create Database" to proceed and finish the installation.

### Installation using Docker Compose (recommended for server deployment)
#### 1. Create a new directory for your Faved installation
```bash
mkdir faved-app
cd faved-app
```
#### 2. Copy the `docker-compose.yml` [file from this repository](/docker-compose.yml) to your new directory
```bash
curl -O https://raw.githubusercontent.com/denho/faved/refs/heads/main/docker-compose.yml
 ```
#### 3. Change the application default ports (optional)

By default, the application will run on port `8080`. When you are installing on a server, you probably want to use port 80.

If you want to change the default port, create an `.env` file with the corresponding environmental variables, like this (change the port to the desired one):
```bash
echo 'PORT=80' >> .env
```
If you are planning to use your own domain with an SSL, also add the following variable:
```bash
echo 'SSL_PORT=443' >> .env
```
#### 3. Start the Docker service 
```bash
docker compose up -d
```
#### 4. Enable SSL for your domain (optional)
If you are planning to use your own domain with an SSL, run the following command to install a Let\'s Encrypt certificate (replace `yourdomain.com` with your domain name):
```bash
docker compose exec -it apache-php sh -c "certbot --apache -d yourdomain.com"
```
#### 5. Access the application

Once the container is running, you can access the Faved application in your web browser under the local or remote address and the port you've set up. 

Typically, the URL will be: 
- http://localhost:8080 for a local installation (if you changed the default port number, replace `8080` with the port you've set)
- https://example.com for a server installation with a domain and SSL enabled
- http://206.189.108.11 for a server installation without a domain (replace `206.189.108.11` with your actual server IP address) 

The first time you visit, you'll be prompted to set up the database. Just click "Create Database" to proceed and finish the installation.

## Updating

### Updating with Docker

#### 1. Pull the latest stable image from Docker Hub

```bash
docker pull denho/faved
```

#### 2. Stop and remove the running container
```bash
docker stop faved
docker rm faved
```
If you changed the container name during installation, replace `faved` with the name you used.

#### Start a new Docker container
```bash
docker run -d --name faved -p 8080:80 -v faved-data:/var/www/html/storage denho/faved
```

### Updating using Docker Compose
#### 1. Pull the latest `docker-compose.yml` [file from this repository](/docker-compose.yml) to your Faved instance directory
```bash
cd faved-app
rm docker-compose.yml
curl -O https://raw.githubusercontent.com/denho/faved/refs/heads/main/docker-compose.yml
 ```

#### 2. Recreate the Docker service with the latest image pulled from Docker Hub
```bash
docker compose up --pull always -d
```

## Using the Bookmarklet

<img width="731" height="914" alt="screenshot-add-ff-slack-compressorio" src="https://github.com/user-attachments/assets/c7002582-d6f4-4716-a3d5-0c6cc1a4e5bb" />

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

- React, Tailwind, Shadcn UI and Vite for the frontend.
- PHP 8, SQLite and Apache for the backend.
