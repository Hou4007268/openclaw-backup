/**
 * 系统提示模块构建函数
 * 用于构建AI助手的系统提示各个部�? */

// ============================================================================
// 类型定义
// ============================================================================

export type ToolSummaries = Record<string, string>;

export interface Skill {
  name: string;
  description: string;
  commands?: string[];
}

export interface MemoryEntry {
  date: string;
  content: string;
}

export interface UserIdentity {
  userId: string;
  displayName?: string;
  phoneNumber?: string;
  email?: string;
}

export interface TimezoneInfo {
  timezone: string;
  currentTime: string;
  offset: string;
}

export interface DocReference {
  name: string;
  path: string;
  description?: string;
}

export interface SandboxInfo {
  workspacePath: string;
  os: string;
  nodeVersion?: string;
  allowedOperations?: string[];
}

export interface ReplyTagsConfig {
  enabled: boolean;
  prefix?: string;
  format?: string;
}

export interface MessagingConfig {
  channel: string;
  channelId?: string;
  capabilities?: string[];
  limitations?: string[];
}

export interface TTSConfig {
  enabled: boolean;
  defaultVoice?: string;
  supportedFormats?: string[];
}

export interface ReactionStrategy {
  mode: 'minimal' | 'moderate' | 'enthusiastic';
  maxReactionsPerMessage?: number;
  guidelines?: string[];
}

export interface ProjectContextFile {
  name: string;
  path: string;
  content?: string;
  lastModified?: string;
}

export interface SilentRepliesConfig {
  enabled: boolean;
  triggerWord: string;
  useCases?: string[];
}

export interface HeartbeatConfig {
  enabled: boolean;
  responseTag: string;
  intervalMinutes?: number;
}

export interface RuntimeMetadata {
  agent: string;
  host: string;
  repo: string;
  os: string;
  nodeVersion: string;
  model: string;
  channel: string;
}

// ============================================================================
// 构建函数实现 - �?部分 (1-8)
// ============================================================================

export function buildToolListLines(params: {
  toolNames?: string[];
  toolSummaries?: ToolSummaries;
}): string[] {
  const lines: string[] = [];
  const { toolNames = [], toolSummaries = {} } = params;

  lines.push('## Tools');
  lines.push('');

  if (toolNames.length === 0) {
    lines.push('No tools configured in current environment.');
  } else {
    for (const name of toolNames) {
      const summary = toolSummaries[name] || 'No description available';
      lines.push(`- **${name}**: ${summary}`);
    }
  }

  lines.push('');
  return lines;
}

export function buildSafetySection(params: {
  allowedActions?: string[];
  forbiddenActions?: string[];
  dataHandlingRules?: string[];
} = {}): string[] {
  const lines: string[] = [];
  const {
    allowedActions = ['Read files', 'Search web', 'Execute safe shell commands'],
    forbiddenActions = ['Delete critical system files', 'Execute destructive operations', 'Leak sensitive credentials'],
    dataHandlingRules = ['Do not disclose user private information', 'Do not share conversation content externally']
  } = params;

  lines.push('## Safety Guardrails');
  lines.push('');
  lines.push('### Allowed Actions');
  allowedActions.forEach(action => lines.push(`- ${action}`));
  lines.push('');
  lines.push('### Forbidden Actions');
  forbiddenActions.forEach(action => lines.push(`- ${action}`));
  lines.push('');
  lines.push('### Data Handling Rules');
  dataHandlingRules.forEach(rule => lines.push(`- ${rule}`));
  lines.push('');

  return lines;
}

export function buildSkillsSection(params: {
  skills?: Skill[];
  defaultSkill?: string;
} = {}): string[] {
  const lines: string[] = [];
  const { skills = [], defaultSkill } = params;

  lines.push('## Skills System');
  lines.push('');
  lines.push('Available skill modules:');
  lines.push('');

  if (skills.length === 0) {
    lines.push('No skill modules currently loaded.');
  } else {
    for (const skill of skills) {
      lines.push(`### ${skill.name}`);
      lines.push(skill.description);
      if (skill.commands && skill.commands.length > 0) {
        lines.push('');
        lines.push('Common commands:');
        skill.commands.forEach(cmd => lines.push(`- \`${cmd}\``));
      }
      lines.push('');
    }
  }

  if (defaultSkill) {
    lines.push(`Default skill: ${defaultSkill}`);
    lines.push('');
  }

  return lines;
}

export function buildMemorySection(params: {
  recentMemories?: MemoryEntry[];
  memoryFiles?: string[];
  instructions?: string[];
} = {}): string[] {
  const lines: string[] = [];
  const {
    recentMemories = [],
    memoryFiles = [],
    instructions = [
      'Consult relevant memories before responding',
      'Use historical context for personalized responses',
      'Remember important user preferences and habits'
    ]
  } = params;

  lines.push('## Memory Recall');
  lines.push('');

  if (recentMemories.length > 0) {
// ============================================================================
// 构建函数实现 - �?部分 (9-16)
// ============================================================================

export function buildReplyTagsSection(params: {
  config?: ReplyTagsConfig;
  examples?: string[];
} = {}): string[] {
  const lines: string[] = [];
  const {
    config = { enabled: true, prefix: '[[', format: '[[reply_to:message_id]]' },
    examples = [
      '[[reply_to_current]] - reply to current message',
      '[[reply_to:12345]] - reply to specific message ID'
    ]
  } = params;

  lines.push('## Reply Tags');
  lines.push('');

  if (!config.enabled) {
    lines.push('Reply tags are disabled.');
  } else {
    lines.push('To reply to a specific message, include a reply tag:');
    lines.push('');
    lines.push(`- **Prefix**: ${config.prefix}`);
    lines.push(`- **Format**: ${config.format}`);
    lines.push('');

    if (examples.length > 0) {
      lines.push('### Examples');
      examples.forEach(ex => lines.push(`- ${ex}`));
      lines.push('');
    }
  }

  return lines;
}

export function buildMessagingSection(params: {
  config?: MessagingConfig;
} = {}): string[] {
  const lines: string[] = [];
  const {
    config = {
      channel: 'telegram',
      capabilities: ['Text messages', 'Image sending', 'File transfer'],
      limitations: ['Message length limit 4096 characters']
    }
  } = params;

  lines.push('## Messaging Channel');
  lines.push('');
  lines.push(`- **Current Channel**: ${config.channel}`);
  if (config.channelId) {
    lines.push(`- **Channel ID**: ${config.channelId}`);
  }

  if (config.capabilities && config.capabilities.length > 0) {
    lines.push(`- **Capabilities**: ${config.capabilities.join(', ')}`);
  }

  if (config.limitations && config.limitations.length > 0) {
    lines.push(`- **Limitations**: ${config.limitations.join(', ')}`);
  }

  lines.push('');
  return lines;
}

export function buildVoiceSection(params: {
  config?: TTSConfig;
  usageInstructions?: string[];
} = {}): string[] {
  const lines: string[] = [];
  const {
    config = { enabled: true, defaultVoice: 'default', supportedFormats: ['mp3', 'wav'] },
    usageInstructions = [
      'Call TTS tool when user explicitly requests audio',
      'Include the media path in your response',
      'Set channel parameter for optimized format'
    ]
  } = params;

  lines.push('## Voice & TTS');
  lines.push('');

  if (!config.enabled) {
    lines.push('TTS feature is disabled.');
  } else {
    lines.push('- **Status**: Enabled');
    lines.push(`- **Default Voice**: ${config.defaultVoice}`);
    if (config.supportedFormats && config.supportedFormats.length > 0) {
      lines.push(`- **Supported Formats**: ${config.supportedFormats.join(', ')}`);
    }
    lines.push('');
    lines.push('### Usage Guide');
    usageInstructions.forEach(inst => lines.push(`- ${inst}`));
  }

  lines.push('');
  return lines;
}

export function buildReactionSection(params: {
  strategy?: ReactionStrategy;
} = {}): string[] {
  const lines: string[] = [];
  const {
    strategy = {
      mode: 'minimal',
      maxReactionsPerMessage: 1,
      guidelines: [
        'Only use reactions when truly relevant',
        'Use to acknowledge important requests or confirmations',
        'Avoid over-reacting to routine messages'
      ]
    }
  } = params;

  lines.push('## Reaction Emojis');
  lines.push('');
  lines.push(`- **Mode**: ${strategy.mode}`);
  lines.push(`- **Max Per Message**: ${strategy.maxReactionsPerMessage}`);
  lines.push('');

  if (strategy.guidelines && strategy.guidelines.length > 0) {
    lines.push('### Guidelines');
    strategy.guidelines.forEach(guide => lines.push(`- ${guide}`));
    lines.push('');
  }

  return lines;
}

export function buildProjectContextSection(params: {
  files?: ProjectContextFile[];
} = {}): string[] {
  const lines: string[] = [];
  const {
    files = [
      { name: 'SOUL.md', path: 'SOUL.md', description: 'AI assistant personality definition' },
      { name: 'AGENTS.md', path: 'AGENTS.md', description: 'Operating rules and workflows' },
      { name: 'USER.md', path: 'USER.md', description: 'User preferences and context' }
    ]
  } = params;

  lines.push('## Project Context');
  lines.push('');
  lines.push('Injected configuration files:');
  lines.push('');

  for (const file of files) {
    lines.push(`- **${file.name}** (${file.path})`);
    if (file.description) {
      lines.push(`  ${file.description}`);
    }
  }

  lines.push('');
  return lines;
}

export function buildSilentRepliesSection(params: {
  config?: SilentRepliesConfig;
} = {}): string[] {
  const lines: string[] = [];
  const {
    config = {
      enabled: true,
      triggerWord: 'NO_REPLY',
      useCases: [
        'When you have nothing meaningful to say',
        'For heartbeat acknowledgments',
        'When the user explicitly says not to reply'
      ]
    }
  } = params;

  lines.push('## Silent Replies');
  lines.push('');

  if (!config.enabled) {
    lines.push('Silent replies feature is disabled.');
  } else {
    lines.push(`When you have nothing to say, respond with ONLY: ${config.triggerWord}`);
    lines.push('');
    lines.push('Rules:');
    lines.push('- It must be your ENTIRE message');
    lines.push('- Never append it to an actual response');
    lines.push('- Never wrap it in markdown or code blocks');
    lines.push('');

    if (config.useCases && config.useCases.length > 0) {
      lines.push('### Use Cases');
      config.useCases.forEach(useCase => lines.push(`- ${useCase}`));
      lines.push('');
    }
  }

  return lines;
}

export function buildHeartbeatSection(params: {
  config?: HeartbeatConfig;
} = {}): string[] {
  const lines: string[] = [];
  const {
    config = {
      enabled: true,
      responseTag: 'HEARTBEAT_OK',
      intervalMinutes: 5
    }
  } = params;

  lines.push('## Heartbeats');
  lines.push('');

  if (!config.enabled) {
    lines.push('Heartbeat mechanism is disabled.');
  } else {
    lines.push('Heartbeat prompt: Read HEARTBEAT.md if it exists. Follow it strictly.');
    lines.push(`If nothing needs attention, reply exactly: ${config.responseTag}`);
    lines.push('');
    lines.push(`If something needs attention, do NOT include "${config.responseTag}"`);
    lines.push('');
    if (config.intervalMinutes) {
      lines.push(`Heartbeat interval: ${config.intervalMinutes} minutes`);
      lines.push('');
    }
  }

  return lines;
}

export function buildRuntimeLine(params: {
  runtime?: RuntimeMetadata;
} = {}): string[] {
  const lines: string[] = [];
  const { runtime } = params;

  lines.push('## Runtime');
  lines.push('');

  if (!runtime) {
    lines.push('No runtime metadata available.');
  } else {
    lines.push(`Runtime: agent=${runtime.agent} | host=${runtime.host} | repo=${runtime.repo} | os=${runtime.os} | node=${runtime.nodeVersion} | model=${runtime.model} | channel=${runtime.channel}`);
  }

  lines.push('');
  return lines;
}

// ============================================================================
// 主构建函�?// ============================================================================

export interface SystemPromptParams {
  toolNames?: string[];
  toolSummaries?: ToolSummaries;
  skills?: Skill[];
  defaultSkill?: string;
  recentMemories?: MemoryEntry[];
  memoryFiles?: string[];
  user?: UserIdentity;
  timezoneInfo?: TimezoneInfo;
  docs?: DocReference[];
  sandbox?: SandboxInfo;
  replyTagsConfig?: ReplyTagsConfig;
  messagingConfig?: MessagingConfig;
  ttsConfig?: TTSConfig;
  reactionStrategy?: ReactionStrategy;
  projectFiles?: ProjectContextFile[];
  silentRepliesConfig?: SilentRepliesConfig;
  heartbeatConfig?: HeartbeatConfig;
  runtime?: RuntimeMetadata;
}

export function buildSystemPrompt(params: SystemPromptParams = {}): string {
  const allLines: string[] = [];

  allLines.push(...buildToolListLines({
    toolNames: params.toolNames,
    toolSummaries: params.toolSummaries
  }));

  allLines.push(...buildSafetySection());

  allLines.push(...buildSkillsSection({
    skills: params.skills,
    defaultSkill: params.defaultSkill
  }));

  allLines.push(...buildMemorySection({
    recentMemories: params.recentMemories,
    memoryFiles: params.memoryFiles
  }));

  allLines.push(...buildUserIdentitySection({
    user: params.user
  }));

  allLines.push(...buildTimeSection({
    timezoneInfo: params.timezoneInfo
  }));

  allLines.push(...buildDocsSection({
    docs: params.docs
  }));

  allLines.push(...buildSandboxSection({
    sandbox: params.sandbox
  }));

  allLines.push(...buildReplyTagsSection({
    config: params.replyTagsConfig
  }));

  allLines.push(...buildMessagingSection({
    config: params.messagingConfig
  }));

  allLines.push(...buildVoiceSection({
    config: params.ttsConfig
  }));

  allLines.push(...buildReactionSection({
    strategy: params.reactionStrategy
  }));

  allLines.push(...buildProjectContextSection({
    files: params.projectFiles
  }));

  allLines.push(...buildSilentRepliesSection({
    config: params.silentRepliesConfig
  }));

  allLines.push(...buildHeartbeatSection({
    config: params.heartbeatConfig
  }));

  allLines.push(...buildRuntimeLine({
    runtime: params.runtime
  }));

  return allLines.join('\n');
}

export default buildSystemPrompt;
