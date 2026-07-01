#!/usr/bin/env node

import fetch from 'node-fetch';

const API_URL = process.env.MCP_SERVER_URL || 'http://localhost:3000';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

class MCPClient {
  constructor() {
    this.apiUrl = API_URL;
    this.openaiKey = OPENAI_API_KEY;
  }

  async callTool(toolName, input) {
    try {
      const response = await fetch(`${this.apiUrl}/call`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tool: toolName, input })
      });
      return await response.json();
    } catch (error) {
      console.error('Tool call failed:', error);
      throw error;
    }
  }

  async chatWithChatGPT(messages, model = 'gpt-4') {
    if (!this.openaiKey) {
      throw new Error('OPENAI_API_KEY not set');
    }

    try {
      const response = await fetch(`${this.apiUrl}/openai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages, model })
      });
      return await response.json();
    } catch (error) {
      console.error('ChatGPT integration failed:', error);
      throw error;
    }
  }

  async getTools() {
    try {
      const response = await fetch(`${this.apiUrl}/tools`);
      return await response.json();
    } catch (error) {
      console.error('Failed to get tools:', error);
      throw error;
    }
  }
}

export default MCPClient;
