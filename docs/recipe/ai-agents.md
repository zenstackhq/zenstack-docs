---
sidebar_position: 7
---

# Setting Up AI Agents

AI coding agents like Claude Code, Cursor, and GitHub Copilot can be tremendously productive with ZenStack — but only if they actually understand how it works. This guide shows you how to set up your agents so they generate correct, idiomatic ZenStack V3 code.

There are two complementary pieces to the setup:

1. **Skills** — installable, task-specific instructions that teach the agent how to perform common ZenStack workflows.
2. **Context7 MCP** — a documentation lookup tool that gives the agent access to the always-current ZenStack docs.

## Installing ZenStack Skills

[Agent Skills](https://www.skills.sh/) are structured instructions that teach AI agents how to work with a specific technology. ZenStack publishes an official skill collection at [zenstackhq/skills](https://github.com/zenstackhq/skills), covering schema modeling, access control, querying, migrations, CRUD server generation, and more.

The easiest way to install them is with the [`skills.sh`](https://www.skills.sh/) CLI. Run the following command in your project's root directory and use the `--all` flag to install every ZenStack skill at once:

```bash
npx skills add zenstackhq/skills --all
```

The CLI auto-detects the coding agents you have installed (Claude Code, Cursor, Copilot, and many others) and sets up the skills for each of them.
 
:::tip
You can also install globally so the skills are available across all your projects:

```bash
npx skills add zenstackhq/skills --all -g
```
:::

To preview what's included before installing, run:

```bash
npx skills add zenstackhq/skills --list
```

:::info
ZenStack and its skills evolve over time, so update your installed skills periodically to keep your agents in sync with new features and best practices:

```bash
npx skills update
```
:::

## Using Context7 for Live Documentation

Skills give the agent procedural know-how, but for the most up-to-date API details, configuration options, and edge cases, the agent should be able to consult the ZenStack documentation directly. The entire ZenStack documentation site is indexed by [Context7](https://context7.com/) under the [`websites/zenstack_dev`](https://context7.com/websites/zenstack_dev) project.

Context7 is available as an [MCP](https://modelcontextprotocol.io/) server. Once it's connected, your agent can pull relevant documentation snippets on demand instead of relying on (potentially stale) training data. Refer to [Context7's installation guide](https://github.com/upstash/context7) to add the MCP server to your agent.

Usually the agent will identify the correct Context7 project to use on its own. In case it picks the wrong one, you can explicitly point it at the `websites/zenstack_dev` library ID (the V3 documentation).

## Telling Your Agent to Use Them

Usually agents are smart enough to automatically utilize the installed skills and the Context7 documentation. However, it's more reliable to explicitly mention these resources in the project's memory. Most agents read project-level instruction files (`CLAUDE.md` for Claude Code, `AGENTS.md` for the broader convention) at the start of a session. Add a note there so the agent knows these resources exist and prefers them.

For example, add the following to your `CLAUDE.md` or `AGENTS.md`:

```markdown
## Working With ZenStack

This project uses ZenStack V3. When working on ZenStack-related tasks:

- Use the installed ZenStack skills (schema modeling, access control,
  querying, migrations, CRUD server, etc.) for guidance on the correct
  patterns and APIs.
- When you need authoritative API details or run into uncertainty, consult
  the ZenStack documentation via the Context7 MCP server (the `websites/zenstack_dev`
  project) rather than relying on prior knowledge — ZenStack V3 differs
  significantly from V2.
```

With skills installed, Context7 connected, and your instruction file in place, your AI agent will have everything it needs to be a productive ZenStack collaborator.
