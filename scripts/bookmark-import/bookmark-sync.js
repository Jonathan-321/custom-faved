#!/usr/bin/env node

/**
 * Automated Bookmark Sync for Faved
 * Syncs Chrome bookmarks to your Faved instance
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const http = require('http');

// Configuration
const FAVED_API = 'http://localhost:8000/public/api';
const CHROME_DIR = path.join(os.homedir(), 'Library/Application Support/Google/Chrome');

// Colors for terminal output
const colors = {
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  reset: '\x1b[0m'
};

class BookmarkSync {
  constructor() {
    this.existingUrls = new Set();
    this.imported = 0;
    this.duplicates = 0;
    this.errors = 0;
  }

  async checkConnection() {
    return new Promise((resolve) => {
      http.get(`${FAVED_API}/items`, (res) => {
        resolve(res.statusCode === 200);
      }).on('error', () => resolve(false));
    });
  }

  async loadExistingBookmarks() {
    return new Promise((resolve, reject) => {
      http.get(`${FAVED_API}/items`, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            const json = JSON.parse(data);
            if (json.data && json.data.items) {
              json.data.items.forEach(item => {
                this.existingUrls.add(item.url);
              });
            }
            console.log(`${colors.yellow}Found ${this.existingUrls.size} existing bookmarks${colors.reset}`);
            resolve();
          } catch (e) {
            reject(e);
          }
        });
      }).on('error', reject);
    });
  }

  async createBookmark(bookmark) {
    if (this.existingUrls.has(bookmark.url)) {
      this.duplicates++;
      process.stdout.write('.');
      return;
    }

    if (bookmark.url.startsWith('javascript:')) {
      return;
    }

    const postData = JSON.stringify({
      title: bookmark.name || bookmark.url,
      url: bookmark.url,
      description: '',
      comments: '',
      image: '',
      tags: []
    });

    return new Promise((resolve) => {
      const req = http.request({
        hostname: 'localhost',
        port: 8000,
        path: '/api/items',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData)
        }
      }, (res) => {
        if (res.statusCode === 200 || res.statusCode === 201) {
          this.imported++;
          this.existingUrls.add(bookmark.url);
          process.stdout.write(`${colors.green}+${colors.reset}`);
        } else {
          this.errors++;
          process.stdout.write(`${colors.red}x${colors.reset}`);
        }
        resolve();
      });

      req.on('error', () => {
        this.errors++;
        process.stdout.write(`${colors.red}x${colors.reset}`);
        resolve();
      });

      req.write(postData);
      req.end();
    });
  }

  async processBookmarks(items) {
    for (const item of items) {
      if (item.type === 'url') {
        await this.createBookmark(item);
      } else if (item.type === 'folder' && item.children) {
        await this.processBookmarks(item.children);
      }
    }
  }

  async syncChrome() {
    console.log(`${colors.green}\n=== Syncing Chrome Bookmarks ===${colors.reset}`);
    
    // Find all Chrome profiles
    const profiles = fs.readdirSync(CHROME_DIR)
      .filter(f => f.startsWith('Profile') || f === 'Default')
      .map(profile => path.join(CHROME_DIR, profile, 'Bookmarks'))
      .filter(f => fs.existsSync(f));

    if (profiles.length === 0) {
      console.log(`${colors.yellow}No Chrome profiles found${colors.reset}`);
      return;
    }

    for (const bookmarkFile of profiles) {
      const profileName = path.basename(path.dirname(bookmarkFile));
      const fileSize = fs.statSync(bookmarkFile).size;
      console.log(`\nProcessing ${profileName} (${Math.round(fileSize/1024)} KB)...`);

      try {
        const data = JSON.parse(fs.readFileSync(bookmarkFile, 'utf8'));
        
        for (const [rootName, root] of Object.entries(data.roots)) {
          if (root.children && Array.isArray(root.children)) {
            await this.processBookmarks(root.children);
          }
        }
      } catch (e) {
        console.error(`${colors.red}Error reading ${profileName}: ${e.message}${colors.reset}`);
      }
    }
  }

  showSummary() {
    console.log(`\n\n${colors.green}=== Sync Summary ===${colors.reset}`);
    console.log(`✅ Imported: ${colors.green}${this.imported}${colors.reset} new bookmarks`);
    console.log(`⚠️  Duplicates: ${colors.yellow}${this.duplicates}${colors.reset} (skipped)`);
    if (this.errors > 0) {
      console.log(`❌ Errors: ${colors.red}${this.errors}${colors.reset}`);
    }
    console.log(`\nTotal bookmarks: ${this.existingUrls.size}`);
  }

  async run() {
    console.log('🚀 Faved Bookmark Sync');
    console.log('======================\n');

    // Check connection
    if (!await this.checkConnection()) {
      console.error(`${colors.red}Error: Cannot connect to Faved at ${FAVED_API}${colors.reset}`);
      console.error('Make sure Docker containers are running:');
      console.error('  docker compose -f docker-compose.dev.yml up -d');
      process.exit(1);
    }

    // Load existing bookmarks
    await this.loadExistingBookmarks();

    // Sync Chrome bookmarks
    await this.syncChrome();

    // Show summary
    this.showSummary();

    console.log('\n✅ Sync complete!');
  }
}

// Auto-sync mode
if (process.argv.includes('--watch')) {
  console.log('📡 Watching for bookmark changes...\n');
  
  const sync = new BookmarkSync();
  
  // Run initial sync
  sync.run().then(() => {
    console.log('\nWatching for changes (press Ctrl+C to stop)...\n');
    
    // Watch Chrome bookmark files
    const profiles = fs.readdirSync(CHROME_DIR)
      .filter(f => f.startsWith('Profile') || f === 'Default')
      .map(profile => path.join(CHROME_DIR, profile, 'Bookmarks'))
      .filter(f => fs.existsSync(f));
    
    profiles.forEach(file => {
      fs.watchFile(file, { interval: 5000 }, async () => {
        console.log(`\n📚 Bookmark change detected in ${path.basename(path.dirname(file))}!`);
        const newSync = new BookmarkSync();
        await newSync.run();
      });
    });
  });
} else {
  // One-time sync
  const sync = new BookmarkSync();
  sync.run().catch(console.error);
}