"use client"

import { TextToolLayout } from "@/components/text-tool-layout"
import { FileText } from "lucide-react"

const markdownExamples = [
  {
    name: "Basic Markdown",
    content: `# Heading 1
## Heading 2
### Heading 3

This is a paragraph with **bold text** and *italic text*.

- List item 1
- List item 2
- List item 3

1. Numbered item 1
2. Numbered item 2
3. Numbered item 3

[Link to example](https://example.com)

\`inline code\`

\`\`\`javascript
function hello() {
  console.log("Hello, World!");
}
\`\`\`

> This is a blockquote
> with multiple lines

| Column 1 | Column 2 | Column 3 |
|----------|----------|----------|
| Cell 1   | Cell 2   | Cell 3   |
| Cell 4   | Cell 5   | Cell 6   |`,
  },
  {
    name: "Documentation",
    content: `# API Documentation

## Overview
This API provides access to user management functionality.

### Authentication
All requests require an API key in the header:
\`Authorization: Bearer YOUR_API_KEY\`

### Endpoints

#### GET /users
Returns a list of all users.

**Parameters:**
- \`limit\` (optional): Maximum number of users to return
- \`offset\` (optional): Number of users to skip

**Response:**
\`\`\`json
{
  "users": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com"
    }
  ],
  "total": 100
}
\`\`\`

#### POST /users
Creates a new user.

**Request Body:**
\`\`\`json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "password": "secure_password"
}
\`\`\`

> **Note:** Passwords must be at least 8 characters long.

### Error Handling
The API returns standard HTTP status codes:
- \`200\` - Success
- \`400\` - Bad Request
- \`401\` - Unauthorized
- \`404\` - Not Found
- \`500\` - Internal Server Error`,
  },
  {
    name: "README File",
    content: `# Project Name

A brief description of what this project does and who it's for.

## Features

- ✅ Feature 1: Description of feature
- ✅ Feature 2: Description of feature  
- ✅ Feature 3: Description of feature
- 🚧 Feature 4: Coming soon

## Installation

\`\`\`bash
npm install project-name
\`\`\`

## Usage

\`\`\`javascript
import { ProjectName } from 'project-name';

const instance = new ProjectName({
  apiKey: 'your-api-key',
  environment: 'production'
});

// Use the instance
const result = await instance.doSomething();
console.log(result);
\`\`\`

## Configuration

Create a \`.env\` file in your project root:

\`\`\`env
API_KEY=your_api_key_here
DATABASE_URL=your_database_url
DEBUG=false
\`\`\`

## Contributing

1. Fork the repository
2. Create a feature branch (\`git checkout -b feature/amazing-feature\`)
3. Commit your changes (\`git commit -m 'Add amazing feature'\`)
4. Push to the branch (\`git push origin feature/amazing-feature\`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- 📧 Email: support@example.com
- 💬 Discord: [Join our community](https://discord.gg/example)
- 📖 Documentation: [docs.example.com](https://docs.example.com)`,
  },
]

const markdownOptions = [
  {
    key: "includeCSS",
    label: "Include CSS Styling",
    type: "checkbox" as const,
    defaultValue: true,
  },
  {
    key: "enableSyntaxHighlighting",
    label: "Syntax Highlighting",
    type: "checkbox" as const,
    defaultValue: true,
  },
  {
    key: "enableTables",
    label: "Enable Tables",
    type: "checkbox" as const,
    defaultValue: true,
  },
  {
    key: "enableTaskLists",
    label: "Enable Task Lists",
    type: "checkbox" as const,
    defaultValue: true,
  },
]

function processMarkdown(input: string, options: any = {}) {
  try {
    if (!input.trim()) {
      return { output: "", error: "Input cannot be empty" }
    }

    let html = input
      // Headers
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      
      // Bold and Italic
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      
      // Links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
      
      // Inline code
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      
      // Line breaks
      .replace(/\n/g, '<br>')

    // Code blocks
    if (options.enableSyntaxHighlighting) {
      html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
        return `<pre><code class="language-${lang || 'text'}">${code.trim()}</code></pre>`
      })
    } else {
      html = html.replace(/```[\s\S]*?```/g, (match) => {
        const code = match.replace(/```\w*\n?/, '').replace(/```$/, '')
        return `<pre><code>${code.trim()}</code></pre>`
      })
    }

    // Lists
    html = html.replace(/^\- (.+)(<br>|$)/gm, '<li>$1</li>')
    html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
    
    html = html.replace(/^\d+\. (.+)(<br>|$)/gm, '<li>$1</li>')
    html = html.replace(/(<li>.*<\/li>)/s, '<ol>$1</ol>')

    // Blockquotes
    html = html.replace(/^> (.+)(<br>|$)/gm, '<blockquote>$1</blockquote>')

    // Tables
    if (options.enableTables) {
      html = html.replace(/\|(.+)\|/g, (match, content) => {
        const cells = content.split('|').map((cell: string) => cell.trim())
        const cellTags = cells.map((cell: string) => `<td>${cell}</td>`).join('')
        return `<tr>${cellTags}</tr>`
      })
      html = html.replace(/(<tr>.*<\/tr>)/s, '<table>$1</table>')
    }

    // Task lists
    if (options.enableTaskLists) {
      html = html.replace(/- \[ \] (.+)/g, '<input type="checkbox" disabled> $1')
      html = html.replace(/- \[x\] (.+)/g, '<input type="checkbox" checked disabled> $1')
    }

    // Add CSS if requested
    if (options.includeCSS) {
      const css = `<style>
body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 20px; }
h1, h2, h3 { color: #2c3e50; margin-top: 24px; margin-bottom: 16px; }
h1 { border-bottom: 2px solid #3498db; padding-bottom: 8px; }
h2 { border-bottom: 1px solid #bdc3c7; padding-bottom: 4px; }
code { background: #f8f9fa; padding: 2px 4px; border-radius: 3px; font-family: 'Monaco', 'Consolas', monospace; }
pre { background: #f8f9fa; padding: 16px; border-radius: 6px; overflow-x: auto; }
blockquote { border-left: 4px solid #3498db; margin: 16px 0; padding-left: 16px; color: #7f8c8d; }
table { border-collapse: collapse; width: 100%; margin: 16px 0; }
th, td { border: 1px solid #bdc3c7; padding: 8px 12px; text-align: left; }
th { background: #ecf0f1; font-weight: bold; }
ul, ol { margin: 16px 0; padding-left: 24px; }
a { color: #3498db; text-decoration: none; }
a:hover { text-decoration: underline; }
</style>`
      html = css + html
    }

    const stats = {
      "Input Length": `${input.length} chars`,
      "Output Length": `${html.length} chars`,
      "Headers": `${(input.match(/^#+\s/gm) || []).length}`,
      "Links": `${(input.match(/\[.*?\]\(.*?\)/g) || []).length}`,
      "Code Blocks": `${(input.match(/```[\s\S]*?```/g) || []).length}`,
    }

    return { output: html, stats }
  } catch (error) {
    return {
      output: "",
      error: "Markdown processing failed",
    }
  }
}

function validateMarkdown(input: string) {
  if (!input.trim()) {
    return { isValid: false, error: "Input cannot be empty" }
  }
  return { isValid: true }
}

export default function MarkdownToHTMLPage() {
  return (
    <TextToolLayout
      title="Markdown to HTML Converter"
      description="Convert Markdown text to HTML with syntax highlighting, table support, and custom CSS styling options."
      icon={FileText}
      placeholder="Enter your Markdown content here..."
      outputPlaceholder="Generated HTML will appear here..."
      processFunction={processMarkdown}
      validateFunction={validateMarkdown}
      options={markdownOptions}
      examples={markdownExamples}
      fileExtensions={[".md", ".markdown", ".html"]}
    />
  )
}