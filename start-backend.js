import http from 'http';
import fs from 'fs';
import path from 'path';

// Local high-performance mock database arrays 
let expenses = [
  { id: "1", amount: 450, category: "Food", date: "2026-06-08", note: "Team lunch dinner" },
  { id: "2", amount: 1200, category: "Entertainment", date: "2026-06-09", note: "Match tickets" }
];

const server = http.createServer((req, res) => {
  // Safe CORS cross-origin header rules to talk seamlessly with Vite on 8081
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // API Router endpoints mapping
  if (req.url === '/api/expenses' || req.url === '/expenses') {
    if (req.method === 'GET') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(expenses));
    } else if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => { body += chunk.toString(); });
      req.on('end', () => {
        const data = JSON.parse(body);
        const newExpense = { id: Date.now().toString(), ...data };
        expenses.push(newExpense);
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(newExpense));
      });
    }
  } else if (req.url.startsWith('/api/expenses/') || req.url.startsWith('/expenses/')) {
    const id = req.url.split('/').pop();
    if (req.method === 'DELETE') {
      expenses = expenses.filter(e => e.id !== id);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true }));
    }
  } else {
    res.writeHead(404);
    res.end();
  }
});

server.listen(5000, () => {
  console.log('🚀 High-performance API storage engine running on http://localhost:5000');
});