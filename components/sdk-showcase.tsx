"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import { Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"

const codeExamples = {
  openai: `from aether import AgentTracer

tracer = AgentTracer()

with tracer.session("research-agent"):
    # Trace a thought step
    root = tracer.thought("Analyzing request")
    
    # Trace a tool call
    tool = tracer.tool_call("web_search", 
        query="AI observability best practices"
    )
    
    # Trace memory retrieval
    memory = tracer.memory_retrieve(
        query="previous research",
        results=3
    )
    
    # Detect potential hallucinations
    tracer.check_confidence(
        threshold=0.7,
        context=memory.results
    )
    
    # Generate output
    output = tracer.output("Final synthesis")`,
  langchain: `from aether.integrations import LangChainTracer
from langchain.agents import AgentExecutor

# Initialize Aether tracer for LangChain
tracer = LangChainTracer(
    project="my-agent",
    session_id="unique-session"
)

# Add to your LangChain agent
agent = AgentExecutor(
    agent=your_agent,
    tools=your_tools,
    callbacks=[tracer]
)

# Run with full observability
result = agent.run(
    "Analyze the latest AI research papers"
)

# Access replay data
replay = tracer.get_replay()
print(f"Steps: {replay.step_count}")
print(f"Tools used: {replay.tool_calls}")`,
  crewai: `from aether.integrations import CrewAITracer
from crewai import Agent, Task, Crew

# Initialize Aether for CrewAI
tracer = CrewAITracer(
    project="research-crew"
)

# Create traced agents
researcher = Agent(
    role="Research Analyst",
    goal="Find relevant data",
    callbacks=[tracer.agent_callback]
)

writer = Agent(
    role="Content Writer", 
    goal="Create clear summaries",
    callbacks=[tracer.agent_callback]
)

# Create crew with observability
crew = Crew(
    agents=[researcher, writer],
    tasks=[research_task, writing_task],
    callbacks=[tracer.crew_callback]
)

# Run and observe
result = crew.kickoff()`,
}

type TabKey = keyof typeof codeExamples

const tabs: { id: TabKey; label: string }[] = [
  { id: "openai", label: "OpenAI" },
  { id: "langchain", label: "LangChain" },
  { id: "crewai", label: "CrewAI" },
]

function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false)
  
  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Simple syntax highlighting
  const highlightCode = (code: string) => {
    return code
      .split("\n")
      .map((line, i) => {
        // Highlight comments
        if (line.trim().startsWith("#")) {
          return `<span class="text-muted-foreground">${line}</span>`
        }
        // Highlight strings
        line = line.replace(/"([^"]*)"/g, '<span class="text-chart-4">"$1"</span>')
        line = line.replace(/'([^']*)'/g, '<span class="text-chart-4">\'$1\'</span>')
        // Highlight keywords
        const keywords = ["from", "import", "with", "as", "def", "class", "return", "print"]
        keywords.forEach((kw) => {
          const regex = new RegExp(`\\b${kw}\\b`, "g")
          line = line.replace(regex, `<span class="text-accent">${kw}</span>`)
        })
        // Highlight function calls
        line = line.replace(/(\w+)\(/g, '<span class="text-primary">$1</span>(')
        // Highlight numbers
        line = line.replace(/\b(\d+\.?\d*)\b/g, '<span class="text-chart-3">$1</span>')
        return line
      })
      .join("\n")
  }

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        className="absolute top-3 right-3 text-muted-foreground hover:text-foreground z-10"
        onClick={handleCopy}
      >
        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
      </Button>
      
      <div className="bg-background/80 rounded-lg p-4 overflow-x-auto border border-border/30">
        <pre className="text-sm font-mono leading-relaxed">
          <code 
            dangerouslySetInnerHTML={{ __html: highlightCode(code) }}
          />
        </pre>
      </div>
    </div>
  )
}

export function SDKShowcase() {
  const [activeTab, setActiveTab] = useState<TabKey>("openai")

  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full glass-panel text-xs font-medium text-accent mb-4">
            Developer SDK
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Integrate in <span className="text-gradient-purple">Minutes</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Drop-in SDK for your favorite AI frameworks. Start observing cognition with just a few lines of code.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          <div className="glass-panel rounded-2xl overflow-hidden">
            {/* Terminal header */}
            <div className="flex items-center justify-between px-4 py-3 bg-card/80 border-b border-border/30">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-destructive/80" />
                <div className="w-3 h-3 rounded-full bg-chart-4/80" />
                <div className="w-3 h-3 rounded-full bg-chart-3/80" />
              </div>
              
              {/* Tabs */}
              <div className="flex items-center gap-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all ${
                      activeTab === tab.id
                        ? "bg-primary/20 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              
              <div className="w-20" /> {/* Spacer for balance */}
            </div>

            {/* Code content */}
            <div className="p-4">
              <CodeBlock code={codeExamples[activeTab]} />
            </div>

            {/* Footer */}
            <div className="px-4 py-3 bg-card/40 border-t border-border/30 flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                pip install aether-sdk
              </span>
              <div className="flex items-center gap-4">
                <a href="#" className="text-xs text-primary hover:underline">
                  View Documentation
                </a>
                <a href="#" className="text-xs text-muted-foreground hover:text-foreground">
                  See Examples
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
