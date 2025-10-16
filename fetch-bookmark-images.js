#!/usr/bin/env node

/**
 * Fetch missing images for Faved bookmarks
 * This script updates bookmarks that don't have images
 */

const http = require('http');
const https = require('https');
const { URL } = require('url');

// Configuration
const FAVED_API_BASE = 'http://localhost:8000/public/api';

// Colors for terminal output
const colors = {
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

class ImageFetcher {
  constructor() {
    this.processed = 0;
    this.updated = 0;
    this.errors = 0;
  }

  async fetchItems() {
    console.log('📚 Fetching bookmarks from Faved...');
    
    return new Promise((resolve, reject) => {
      http.get(`${FAVED_API_BASE}/items`, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            const json = JSON.parse(data);
            if (json.data && json.data.items) {
              const itemsArray = Object.values(json.data.items);
              console.log(`Found ${itemsArray.length} bookmarks\n`);
              resolve(itemsArray);
            } else {
              reject(new Error('Invalid API response'));
            }
          } catch (e) {
            reject(e);
          }
        });
      }).on('error', reject);
    });
  }

  async fetchUrlMetadata(url) {
    return new Promise((resolve, reject) => {
      const params = new URLSearchParams({ url });
      
      http.get(`${FAVED_API_BASE}/url-metadata?${params}`, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            const json = JSON.parse(data);
            if (json.success && json.data) {
              resolve(json.data);
            } else {
              reject(new Error('Failed to fetch metadata'));
            }
          } catch (e) {
            reject(e);
          }
        });
      }).on('error', reject);
    });
  }

  async updateBookmark(item, imageUrl) {
    return new Promise((resolve, reject) => {
      const updateData = JSON.stringify({
        title: item.title,
        url: item.url,
        description: item.description || '',
        comments: item.comments || '',
        image: imageUrl,
        tags: item.tags || []
      });

      const req = http.request({
        hostname: 'localhost',
        port: 8000,
        path: `/public/api/items?id=${item.id}`,
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(updateData)
        }
      }, (res) => {
        if (res.statusCode === 200) {
          resolve();
        } else {
          reject(new Error(`Update failed: ${res.statusCode}`));
        }
      });

      req.on('error', reject);
      req.write(updateData);
      req.end();
    });
  }

  async processBookmarks(items) {
    const itemsWithoutImages = items.filter(item => !item.image || item.image === '');
    
    console.log(`${colors.yellow}Found ${itemsWithoutImages.length} bookmarks without images${colors.reset}\n`);
    
    if (itemsWithoutImages.length === 0) {
      console.log('All bookmarks already have images! 🎉');
      return;
    }

    console.log('🔍 Fetching images for bookmarks...\n');
    
    for (const item of itemsWithoutImages) {
      this.processed++;
      
      // Show progress
      const progress = `[${this.processed}/${itemsWithoutImages.length}]`;
      process.stdout.write(`${progress} ${item.title.substring(0, 50)}... `);
      
      try {
        // Skip certain URLs that won't have images
        if (item.url.startsWith('chrome://') || 
            item.url.startsWith('file://') || 
            item.url.startsWith('about:')) {
          process.stdout.write(`${colors.yellow}skipped${colors.reset}\n`);
          continue;
        }

        // Fetch metadata including image
        const metadata = await this.fetchUrlMetadata(item.url);
        
        if (metadata.image_url && metadata.image_url !== '') {
          // Update bookmark with image
          await this.updateBookmark(item, metadata.image_url);
          this.updated++;
          process.stdout.write(`${colors.green}✓ updated${colors.reset}\n`);
        } else {
          process.stdout.write(`${colors.yellow}no image${colors.reset}\n`);
        }
        
        // Small delay to avoid overwhelming the server
        await new Promise(resolve => setTimeout(resolve, 500));
        
      } catch (error) {
        this.errors++;
        process.stdout.write(`${colors.red}✗ error${colors.reset}\n`);
      }
    }
  }

  showSummary() {
    console.log(`\n${colors.green}=== Summary ===${colors.reset}`);
    console.log(`✅ Updated: ${colors.green}${this.updated}${colors.reset} bookmarks with images`);
    console.log(`⚠️  No image found: ${colors.yellow}${this.processed - this.updated - this.errors}${colors.reset} bookmarks`);
    if (this.errors > 0) {
      console.log(`❌ Errors: ${colors.red}${this.errors}${colors.reset}`);
    }
  }

  async run() {
    console.log('🖼️  Faved Image Fetcher');
    console.log('=======================\n');

    try {
      // Fetch all bookmarks
      const items = await this.fetchItems();
      
      // Process bookmarks without images
      await this.processBookmarks(items);
      
      // Show summary
      this.showSummary();
      
      console.log('\n✅ Done! Refresh Faved to see the images.');
      
    } catch (error) {
      console.error(`${colors.red}Error: ${error.message}${colors.reset}`);
      console.error('Make sure Faved is running on http://localhost:5173');
    }
  }
}

// Run the image fetcher
const fetcher = new ImageFetcher();
fetcher.run().catch(console.error);