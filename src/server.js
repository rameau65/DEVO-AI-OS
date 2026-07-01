#!/usr/bin/env node

import http from 'http';
import { StdioClientTransport } from '@anthropic-ai/sdk/lib/resources/messages/streaming';

class DEVOAIOSMCPServer {
  constructor() {
    this.name = 'DEVO-AI-OS MCP Server';
    this.version = '2.0.0';
    this.mcpVersion = '2024-11-05';
    this.tools = this.initializeTools();
    this.resources = this.initializeResources();
    this.port = process.env.PORT || 3000;
    this.openaiApiKey = process.env.OPENAI_API_KEY;
  }

  initializeTools() {
    return [
      {
        name: 'story_engine',
        description: 'Convert a topic into a clear narrative structure',
        inputSchema: {
          type: 'object',
          properties: {
            topic: { type: 'string', description: 'Topic to convert' },
            audience: { type: 'string', description: 'Target audience' },
            duration: { type: 'string', enum: ['1min', '3min', '5min'], description: 'Story duration' },
            tone: { type: 'string', description: 'Narrative tone (educational, inspirational, entertaining)' }
          },
          required: ['topic', 'audience', 'duration']
        }
      },
      {
        name: 'visual_engine',
        description: 'Convert story elements into image-generation prompts optimized for MidJourney or similar tools',
        inputSchema: {
          type: 'object',
          properties: {
            concept: { type: 'string', description: 'Visual concept to describe' },
            style: { type: 'string', description: 'Visual style (cinematic, animation, poster, illustration)' },
            mood: { type: 'string', description: 'Mood or atmosphere (peaceful, dramatic, joyful, etc.)' }
          },
          required: ['concept', 'style']
        }
      },
      {
        name: 'seedance_engine',
        description: 'Create cinematic AI video sequences for professional quality video generation',
        inputSchema: {
          type: 'object',
          properties: {
            theme: { type: 'string', description: 'Video theme or narrative' },
            duration: { type: 'string', description: 'Video duration (1min, 3min, 5min, 10min)' },
            style_preset: { 
              type: 'string', 
              enum: ['MEDITATION_CINEMA', 'HANMAUM_DOCUMENTARY', 'AI_POETRY_FILM', 'YOUTUBE_SHORTS_CINEMA'],
              description: 'Predefined style preset'
            },
            music_mood: { type: 'string', description: 'Music mood or atmosphere' }
          },
          required: ['theme', 'duration']
        }
      },
      {
        name: 'music_engine',
        description: 'Create music and sound direction prompts for Suno and similar AI music tools',
        inputSchema: {
          type: 'object',
          properties: {
            mood: { type: 'string', description: 'Music mood (contemplative, energetic, peaceful, etc.)' },
            duration: { type: 'string', description: 'Music duration' },
            genre: { type: 'string', description: 'Music genre (ambient, electronic, orchestral, etc.)' },
            instruments: { type: 'array', items: { type: 'string' }, description: 'Suggested instruments' }
          },
          required: ['mood', 'duration']
        }
      },
      {
        name: 'meditation_engine',
        description: 'Create meditation scripts, visual structures, and accompanying materials',
        inputSchema: {
          type: 'object',
          properties: {
            theme: { type: 'string', description: 'Meditation theme (inner peace, healing, focus, etc.)' },
            emotion: { type: 'string', description: 'Target emotion to cultivate' },
            duration: { type: 'string', enum: ['1min', '3min', '5min', '10min'], description: 'Meditation duration' },
            audience: { type: 'string', description: 'Target audience (beginners, intermediate, advanced)' }
          },
          required: ['theme', 'duration']
        }
      },
      {
        name: 'quality_engine',
        description: 'Review and improve creative outputs with comprehensive quality assessment',
        inputSchema: {
          type: 'object',
          properties: {
            content: { type: 'string', description: 'Content to review' },
            content_type: { type: 'string', enum: ['story', 'script', 'visual', 'video', 'music'], description: 'Type of content' },
            target_audience: { type: 'string', description: 'Target audience for the content' }
          },
          required: ['content', 'content_type']
        }
      },
      {
        name: 'flow_engine',
        description: 'Design end-to-end production workflows integrating all creative engines',
        inputSchema: {
          type: 'object',
          properties: {
            project_goal: { type: 'string', description: 'Project goal or desired outcome' },
            output_format: { type: 'array', items: { type: 'string' }, description: 'Desired output formats (video, audio, document, etc.)' },
            available_tools: { type: 'array', items: { type: 'string' }, description: 'Available AI tools' },
            timeline: { type: 'string', description: 'Project timeline' }
          },
          required: ['project_goal']
        }
      }
    ];
  }

  initializeResources() {
    return [
      { name: 'engines', description: 'DEVO-AI-OS creative engines', path: 'engines/' },
      { name: 'workflows', description: 'Creative production workflows', path: 'workflows/' },
      { name: 'templates', description: 'Reusable production templates', path: 'templates/' },
      { name: 'world_bible', description: 'Project world bibles and philosophy', path: 'world_bible/' },
      { name: 'core_principles', description: 'Core DEVO-AI-OS principles and standards', path: 'core/' },
      { name: 'agents', description: 'Agent definitions and instructions', path: 'agents/' }
    ];
  }

  // OpenAI Function definitions for ChatGPT integration
  getOpenAITools() {
    return this.tools.map(tool => ({
      type: 'function',
      function: {
        name: tool.name,
        description: tool.description,
        parameters: tool.inputSchema
      }
    }));
  }

  // MCP Protocol compliant response
  getMCPToolResponse() {
    return {
      tools: this.tools.map(tool => ({
        name: tool.name,
        description: tool.description,
        inputSchema: tool.inputSchema
      }))
    };
  }

  async handleToolCall(toolName, toolInput) {
    console.log(`[Tool Call] ${toolName}`, toolInput);
    
    switch (toolName) {
      case 'story_engine':
        return this.handleStoryEngine(toolInput);
      case 'visual_engine':
        return this.handleVisualEngine(toolInput);
      case 'seedance_engine':
        return this.handleSeedanceEngine(toolInput);
      case 'music_engine':
        return this.handleMusicEngine(toolInput);
      case 'meditation_engine':
        return this.handleMeditationEngine(toolInput);
      case 'quality_engine':
        return this.handleQualityEngine(toolInput);
      case 'flow_engine':
        return this.handleFlowEngine(toolInput);
      default:
        return { error: `Unknown tool: ${toolName}` };
    }
  }

  handleStoryEngine(input) {
    return {
      engine: 'STORY_ENGINE',
      topic: input.topic,
      audience: input.audience,
      duration: input.duration,
      tone: input.tone || 'educational',
      output: {
        core_message: `Core message for: ${input.topic}`,
        logline: `One-line summary about ${input.topic}`,
        structure: `${input.duration} narrative structure`,
        scene_list: ['Scene 1: Setup', 'Scene 2: Development', 'Scene 3: Resolution'],
        storyboard_template: 'Ready for visual elements',
        narration_tips: 'Maintain consistent tone and pacing'
      }
    };
  }

  handleVisualEngine(input) {
    return {
      engine: 'VISUAL_ENGINE',
      concept: input.concept,
      style: input.style,
      mood: input.mood || 'neutral',
      output: {
        master_prompt: `${input.concept} in ${input.style} style, mood: ${input.mood}`,
        parameters: '--ar 16:9 --stylize 250 --v 8.1',
        negative_constraints: 'text artifacts, distorted hands, extra limbs, blurry',
        shot_list: ['Wide shot establishing scene', 'Medium shot for detail', 'Close-up for emotion'],
        color_palette: 'To be determined based on mood'
      }
    };
  }

  handleSeedanceEngine(input) {
    return {
      engine: 'SEEDANCE_ENGINE',
      theme: input.theme,
      duration: input.duration,
      style_preset: input.style_preset || 'MEDITATION_CINEMA',
      output: {
        scene_breakdown: 'Scene structure with emotional beats prepared',
        camera_motion_plan: 'Smooth cinematic movements with emotional pacing',
        transition_strategy: 'Natural dissolves and fades between scenes',
        color_script: 'Color palette defined based on mood and emotion',
        music_sync_notes: `Synchronized with ${input.music_mood || 'ambient'} music`,
        production_notes: 'Ready for Seedance/Hailuo/Kling video generation'
      }
    };
  }

  handleMusicEngine(input) {
    return {
      engine: 'MUSIC_ENGINE',
      mood: input.mood,
      duration: input.duration,
      genre: input.genre || 'ambient',
      output: {
        base_prompt: `${input.mood} ${input.genre} music for ${input.duration}`,
        versions: ['30-second trailer', '1-minute theme', '3-minute extended', '5-minute full composition'],
        instruments: input.instruments || ['synth pads', 'ambient strings', 'subtle percussion'],
        parameters: 'Instrumental, no vocals, no heavy drums, loop-friendly, emotional depth',
        suno_prompt: `Create ${input.mood} ${input.genre} music, ${input.duration} duration. No lyrics. ${(input.instruments || []).join(', ')}`
      }
    };
  }

  handleMeditationEngine(input) {
    return {
      engine: 'MEDITATION_ENGINE',
      theme: input.theme,
      emotion: input.emotion,
      duration: input.duration,
      audience: input.audience,
      output: {
        meditation_script: `${input.duration} guided meditation on ${input.theme} for ${input.audience}`,
        structure: ['Arrival & grounding', 'Breathing practice', 'Body observation', 'Letting go', 'Inner awareness', 'Return to daily life'],
        visual_prompts: 'Key meditation scenes identified',
        music_prompt: `${input.mood || 'calm'}, spacious ambient music supporting emotional journey`,
        narration_tone: 'Gentle, guiding, compassionate',
        pacing_guide: 'Slow, meditative pacing with intentional pauses'
      }
    };
  }

  handleQualityEngine(input) {
    return {
      engine: 'QUALITY_ENGINE',
      content_type: input.content_type,
      review: {
        clarity_score: 'A',
        narrative_flow: 'Coherent and engaging',
        emotional_consistency: 'Strong emotional arc',
        visual_feasibility: 'High - production ready',
        tool_readiness: 'Production-ready for AI tools',
        strengths: ['Clear structure', 'Strong emotional arc', 'Tool-agnostic design', 'Professional quality'],
        suggestions: ['Minor refinements in pacing', 'Enhanced descriptive details'],
        revision_strategy: 'Polish and enhance specific details for maximum impact',
        production_readiness: 'Ready for immediate production'
      }
    };
  }

  handleFlowEngine(input) {
    return {
      engine: 'FLOW_ENGINE',
      project_goal: input.project_goal,
      output_formats: input.output_format || ['video', 'audio', 'document'],
      workflow: {
        stages: [
          { stage: 1, name: 'Concept & Research', tool: 'STORY_ENGINE', duration: '1-2 days' },
          { stage: 2, name: 'Visual Direction', tool: 'VISUAL_ENGINE', duration: '1-2 days' },
          { stage: 3, name: 'Video Production', tool: 'SEEDANCE_ENGINE', duration: '2-3 days' },
          { stage: 4, name: 'Music & Sound', tool: 'MUSIC_ENGINE', duration: '1-2 days' },
          { stage: 5, name: 'Quality Review', tool: 'QUALITY_ENGINE', duration: '1 day' }
        ],
        timeline: input.timeline || 'Standard production',
        available_tools: input.available_tools || ['MidJourney', 'Seedance', 'Suno', 'ChatGPT'],
        total_timeline: '7-10 days',
        quality_checkpoints: 5,
        deliverables: input.output_format || ['Complete video', 'Audio composition', 'Supporting documents']
      }
    };
  }

  getToolDefinitions() {
    return this.tools;
  }

  getResourceDefinitions() {
    return this.resources;
  }
}

// Create HTTP server
const server = new DEVOAIOSMCPServer();

const requestListener = async (req, res) => {
  // CORS headers
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname;

  // Health check endpoint
  if (pathname === '/health' && req.method === 'GET') {
    res.writeHead(200);
    res.end(JSON.stringify({
      status: 'healthy',
      server: server.name,
      version: server.version,
      mcp_version: server.mcpVersion,
      timestamp: new Date().toISOString()
    }));
    return;
  }

  // Root endpoint
  if (pathname === '/' && req.method === 'GET') {
    res.writeHead(200);
    res.end(JSON.stringify({
      name: server.name,
      version: server.version,
      mcp_version: server.mcpVersion,
      description: 'Model Context Protocol implementation for DEVO-AI-OS with OpenAI integration',
      tools: server.getToolDefinitions().map(t => ({ name: t.name, description: t.description })),
      resources: server.getResourceDefinitions().map(r => ({ name: r.name, description: r.description })),
      endpoints: {
        health: '/health',
        tools: '/tools',
        resources: '/resources',
        call: '/call',
        mcp: '/mcp',
        openai: '/openai'
      }
    }));
    return;
  }

  // List tools endpoint (MCP compliant)
  if (pathname === '/tools' && req.method === 'GET') {
    res.writeHead(200);
    res.end(JSON.stringify(server.getMCPToolResponse()));
    return;
  }

  // List resources endpoint
  if (pathname === '/resources' && req.method === 'GET') {
    res.writeHead(200);
    res.end(JSON.stringify({
      resources: server.getResourceDefinitions()
    }));
    return;
  }

  // MCP Protocol endpoint (for Claude/MCP clients)
  if (pathname === '/mcp' && req.method === 'GET') {
    res.writeHead(200);
    res.end(JSON.stringify({
      type: 'tools/list',
      ...server.getMCPToolResponse()
    }));
    return;
  }

  // OpenAI Tools endpoint (for ChatGPT integration)
  if (pathname === '/openai' && req.method === 'GET') {
    res.writeHead(200);
    res.end(JSON.stringify({
      tools: server.getOpenAITools(),
      description: 'Tools formatted for OpenAI function calling'
    }));
    return;
  }

  // OpenAI ChatGPT endpoint
  if (pathname === '/openai/chat' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', async () => {
      try {
        const data = JSON.parse(body);
        const { messages, model = 'gpt-4' } = data;

        // Call OpenAI API with our tools
        const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${server.openaiApiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: model,
            messages: messages,
            tools: server.getOpenAITools(),
            tool_choice: 'auto'
          })
        });

        if (!openaiResponse.ok) {
          throw new Error(`OpenAI API error: ${openaiResponse.statusText}`);
        }

        const result = await openaiResponse.json();
        res.writeHead(200);
        res.end(JSON.stringify(result));
      } catch (error) {
        console.error('OpenAI Chat Error:', error);
        res.writeHead(400);
        res.end(JSON.stringify({ error: error.message }));
      }
    });
    return;
  }

  // Tool call endpoint
  if (pathname === '/call' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', async () => {
      try {
        const data = JSON.parse(body);
        const { tool, input } = data;
        const result = await server.handleToolCall(tool, input);
        res.writeHead(200);
        res.end(JSON.stringify(result));
      } catch (error) {
        res.writeHead(400);
        res.end(JSON.stringify({ error: error.message }));
      }
    });
    return;
  }

  // 404
  res.writeHead(404);
  res.end(JSON.stringify({ error: 'Not found' }));
};

const httpServer = http.createServer(requestListener);

httpServer.listen(server.port, () => {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`[${server.name}] v${server.version}`);
  console.log(`MCP Protocol Version: ${server.mcpVersion}`);
  console.log(`${'='.repeat(60)}`);
  console.log(`\n✅ Server running on: http://localhost:${server.port}`);
  console.log(`\n📋 Available Endpoints:`);
  console.log(`  GET  / - Server info & endpoints`);
  console.log(`  GET  /health - Health check`);
  console.log(`  GET  /tools - List all tools (MCP format)`);
  console.log(`  GET  /resources - List all resources`);
  console.log(`  GET  /mcp - MCP protocol endpoint`);
  console.log(`  GET  /openai - OpenAI tools format`);
  console.log(`  POST /call - Call a tool directly`);
  console.log(`  POST /openai/chat - ChatGPT integration\n`);
  console.log(`🔧 Available Tools (${server.tools.length}):`);
  server.getToolDefinitions().forEach(tool => {
    console.log(`  ✓ ${tool.name}: ${tool.description}`);
  });
  console.log(`\n📦 Available Resources (${server.resources.length}):`);
  server.getResourceDefinitions().forEach(resource => {
    console.log(`  ✓ ${resource.name}: ${resource.description}`);
  });
  console.log(`\n🔐 OpenAI Integration: ${server.openaiApiKey ? '✅ Enabled' : '⚠️  Disabled (set OPENAI_API_KEY)'}`);
  console.log(`\n${'='.repeat(60)}\n`);
});

export default httpServer;
