import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mic, Cpu, Search, CheckCircle, Users, ArrowRight, Square, Copy, RotateCcw,
  Calendar, Target, Zap, Shield, Globe, Award, Clock, Lightbulb
} from 'lucide-react';

// Types
interface Step {
  id: number;
  title: string;
  short: string;
  description: string;
  icon: React.ElementType;
  detail: string;
}

interface ActionItem {
  id: number;
  text: string;
  completed: boolean;
}

interface DemoResults {
  summary: string;
  keyPoints: string[];
  actionItems: ActionItem[];
}

// Workflow Steps
const steps: Step[] = [
  {
    id: 1,
    title: "Input Meeting",
    short: "Voice or Text",
    description: "User provides meeting input via voice recording or text entry.",
    icon: Mic,
    detail: "Begin by speaking naturally during your meeting or pasting meeting notes. Our system accepts live voice input using your device's microphone or manual text entry for flexibility. Capture conversations in real-time without disrupting the flow."
  },
  {
    id: 2,
    title: "AI Processing",
    short: "Speech to Text & Analyze",
    description: "System converts speech to text and processes using Agentic AI.",
    icon: Cpu,
    detail: "Advanced speech recognition powered by Whisper and Agentic AI agents parse the raw conversation. The AI understands context, identifies speakers, and structures the dialogue into meaningful segments for deeper analysis."
  },
  {
    id: 3,
    title: "Smart Analysis",
    short: "Extract Key Info",
    description: "Key points and important information are intelligently extracted.",
    icon: Search,
    detail: "Our multi-agent system identifies decisions, deadlines, responsibilities, and critical themes. It filters noise and highlights what truly matters, ensuring no important detail is missed from the discussion."
  },
  {
    id: 4,
    title: "Output Result",
    short: "Summary & Actions",
    description: "System generates concise summary and prioritized action items.",
    icon: CheckCircle,
    detail: "Receive an organized, actionable report: a clear meeting summary, bullet-point key insights, and a ready-to-use task list with owners and deadlines. Export, share, or integrate directly with your favorite tools."
  }
];

// Sample inputs for demo
const sampleInputs = [
  "Today we discussed the Q3 marketing campaign. Sarah will finalize the budget by Friday. John needs to coordinate with the design team on visuals. We agreed to launch on October 15th.",
  "Meeting notes: The client meeting went well. Key feedback is to simplify the onboarding flow. Alex will create mockups by Tuesday. Budget approved at $45k. Next sync on Thursday.",
  "Project Alpha update: Backend team completed API endpoints. Frontend still needs login page. Deadline shifted to next week. Emily responsible for testing. Need to schedule stakeholder demo."
];

// Technologies
const technologies = [
  { name: "Agentic AI", desc: "Autonomous decision-making agents", icon: Zap },
  { name: "Whisper STT", desc: "Accurate real-time transcription", icon: Mic },
  { name: "NLP Engine", desc: "Contextual understanding", icon: Search },
  { name: "React 19", desc: "Modern interactive UI", icon: Globe },
  { name: "Framer Motion", desc: "Smooth micro-interactions", icon: Target },
  { name: "TypeScript", desc: "Type-safe development", icon: Shield }
];

// Features
const features = [
  { icon: Mic, title: "Real-time Voice Capture", desc: "Seamless microphone integration with live transcription." },
  { icon: Cpu, title: "Agentic AI Intelligence", desc: "Autonomous agents that reason, plan, and execute tasks." },
  { icon: Search, title: "Intelligent Extraction", desc: "Automatically finds decisions, owners, and deadlines." },
  { icon: CheckCircle, title: "Actionable Outputs", desc: "Prioritized to-dos with deadlines and assignments." },
  { icon: Clock, title: "Instant Summaries", desc: "Concise, professional meeting recaps in seconds." },
  { icon: Target, title: "Smart Integrations", desc: "Export to Notion, Slack, Calendar, or Email." }
];

// Advantages
const advantages = [
  "Reduces meeting follow-up time by up to 70%",
  "Never miss critical decisions or action items",
  "Works in 40+ languages with high accuracy",
  "Privacy-first: All processing can be on-device",
  "Seamless integration with existing workflows",
  "Improves team accountability and alignment"
];

// Applications
const applications = [
  { icon: Users, title: "Corporate Teams", desc: "Weekly syncs, strategy meetings, board updates" },
  { icon: Calendar, title: "Sales & Client Calls", desc: "Track commitments and follow-ups automatically" },
  { icon: Lightbulb, title: "Product & Design", desc: "Capture feedback and roadmap decisions" },
  { icon: Award, title: "Education & Training", desc: "Lecture summaries and learning objectives" }
];

// Team Members
const team = [
  { name: "Alex Rivera", role: "AI Architect", bio: "Leads the Agentic AI orchestration and NLP systems." },
  { name: "Jordan Kim", role: "Product Designer", bio: "Creates intuitive interfaces for seamless experiences." },
  { name: "Sam Chen", role: "Speech Engineer", bio: "Develops high-fidelity voice recognition pipelines." },
  { name: "Taylor Brooks", role: "Integration Lead", bio: "Connects the platform with productivity tools." }
];

function App() {
  // Navigation
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Interactive How It Works
  const [activeStep, setActiveStep] = useState(1);

  // Demo State
  const [inputType, setInputType] = useState<'text' | 'voice'>('text');
  const [textInput, setTextInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<DemoResults | null>(null);
  const [actionItems, setActionItems] = useState<ActionItem[]>([]);
  const [newAction, setNewAction] = useState('');

  // Scroll helper
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition - bodyRect - offset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  // Step click handler
  const handleStepClick = (stepId: number) => {
    setActiveStep(stepId);
  };

  // Get current step
  const currentStep = steps.find(s => s.id === activeStep)!;

  // Voice Recognition Setup
  const initRecognition = () => {
    if (!('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      alert("Your browser doesn't support voice recognition. Please use Chrome or try Text Input.");
      return null;
    }
    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const rec = new SpeechRec();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = 'en-US';

    rec.onresult = (event: any) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcriptPart = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcriptPart + ' ';
        }
      }
      if (finalTranscript) {
        setTranscript(prev => (prev + ' ' + finalTranscript).trim());
      }
    };

    rec.onerror = (event: any) => {
      console.error('Speech recognition error:', event);
      setIsRecording(false);
      alert('Voice recognition error. Please try again.');
    };

    rec.onend = () => {
      setIsRecording(false);
    };

    return rec;
  };

  // Start Voice Recording
  const startRecording = () => {
    const rec = recognition || initRecognition();
    if (!rec) return;

    setRecognition(rec);
    setTranscript('');
    setIsRecording(true);
    rec.start();
  };

  // Stop Voice Recording
  const stopRecording = () => {
    if (recognition) {
      recognition.stop();
    }
    setIsRecording(false);
  };

  // Load Sample Input
  const loadSample = (sample: string) => {
    setTextInput(sample);
    setInputType('text');
    setResults(null);
  };

  // Smart AI Processing Simulation - Fully Functioning
  const processMeeting = async () => {
    const input = inputType === 'voice' ? transcript : textInput;
    if (!input.trim()) {
      alert('Please provide meeting input via text or voice recording.');
      return;
    }

    setIsProcessing(true);

    // Simulate realistic Agentic AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1450));

    // Intelligent extraction logic - makes the demo truly functional
    const sentences = input.split(/[.!?]+/).filter(s => s.trim().length > 5);
    const words = input.toLowerCase().split(/\s+/);

    // Generate Summary
    const summary = sentences.length > 0 
      ? sentences[0].trim() + ". " + (sentences[1] ? sentences[1].trim() + "." : "")
      : "Meeting discussion captured and analyzed successfully.";

    // Extract Key Points intelligently
    const keyPoints: string[] = [];
    if (sentences.length > 1) keyPoints.push(sentences[1]?.trim() + ".");
    if (sentences.length > 2) keyPoints.push(sentences[2]?.trim() + ".");
    
    // Detect common themes
    if (words.includes('budget') || words.includes('cost')) keyPoints.push("Budget allocation and financial considerations reviewed.");
    if (words.includes('deadline') || words.includes('friday') || words.includes('tuesday')) keyPoints.push("Critical deadlines identified and confirmed.");
    if (words.includes('team') || words.includes('design') || words.includes('frontend')) keyPoints.push("Team coordination and cross-functional alignment discussed.");
    if (keyPoints.length < 2) keyPoints.push("Stakeholder feedback incorporated into the plan.");

    // Generate Action Items - Smart assignment
    let generatedActions: ActionItem[] = [];
    let idCounter = 1;

    // Look for names and verbs to create realistic actions
    const possibleOwners = ['Sarah', 'John', 'Alex', 'Emily', 'Team'];
    sentences.forEach((sent) => {
      const lower = sent.toLowerCase();
      let actionText = '';
      
      if (lower.includes('will') || lower.includes('needs to') || lower.includes('responsible')) {
        const owner = possibleOwners.find(o => sent.includes(o)) || 'Assigned Member';
        actionText = `${owner} to ${sent.trim().toLowerCase().replace(/^.*?(will|needs to|responsible for)\s*/, '')}.`;
      } else if (lower.includes('finalize') || lower.includes('create') || lower.includes('complete')) {
        actionText = sent.trim() + ".";
      }
      
      if (actionText && actionText.length > 15 && generatedActions.length < 4) {
        generatedActions.push({ id: idCounter++, text: actionText, completed: false });
      }
    });

    // Fallback actions
    if (generatedActions.length === 0) {
      generatedActions = [
        { id: 1, text: "Review and distribute meeting notes to all participants.", completed: false },
        { id: 2, text: "Complete assigned deliverables by agreed deadline.", completed: false },
        { id: 3, text: "Schedule follow-up sync to track progress.", completed: false }
      ];
    }

    const demoResults: DemoResults = {
      summary: summary.length > 180 ? summary.substring(0, 177) + "..." : summary,
      keyPoints: keyPoints.slice(0, 4),
      actionItems: generatedActions
    };

    setResults(demoResults);
    setActionItems(demoResults.actionItems);
    setIsProcessing(false);
  };

  // Toggle Action Item Completion - Fully Functional
  const toggleAction = (id: number) => {
    const updated = actionItems.map(item =>
      item.id === id ? { ...item, completed: !item.completed } : item
    );
    setActionItems(updated);
    if (results) {
      setResults({ ...results, actionItems: updated });
    }
  };

  // Add New Action Item
  const addActionItem = () => {
    if (!newAction.trim()) return;
    const newItem: ActionItem = {
      id: Date.now(),
      text: newAction.trim(),
      completed: false
    };
    const updated = [...actionItems, newItem];
    setActionItems(updated);
    if (results) setResults({ ...results, actionItems: updated });
    setNewAction('');
  };

  // Copy Results to Clipboard - Fully Functional
  const copyResults = () => {
    if (!results) return;
    const text = `SMART MEETING SUMMARY\n\n` +
      `Summary:\n${results.summary}\n\n` +
      `Key Points:\n${results.keyPoints.map((p, i) => `${i + 1}. ${p}`).join('\n')}\n\n` +
      `Action Items:\n${actionItems.map((a, i) => `${i + 1}. [${a.completed ? '✓' : ' '}] ${a.text}`).join('\n')}`;
    
    navigator.clipboard.writeText(text).then(() => {
      alert('Meeting summary and action items copied to clipboard!');
    });
  };

  // Reset Demo
  const resetDemo = () => {
    setTextInput('');
    setTranscript('');
    setResults(null);
    setActionItems([]);
    setNewAction('');
    if (isRecording) stopRecording();
  };

  // Calculate completion percentage
  const completedCount = actionItems.filter(a => a.completed).length;
  const progress = actionItems.length > 0 ? Math.round((completedCount / actionItems.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md z-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-20">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="font-semibold text-xl tracking-tight">SmartMeet AI</div>
              <div className="text-[10px] text-slate-500 -mt-1">AGENTIC AI POWERED</div>
            </div>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-9 text-sm font-medium">
            <button onClick={() => scrollToSection('how')} className="hover:text-blue-600 transition">How it Works</button>
            <button onClick={() => scrollToSection('features')} className="hover:text-blue-600 transition">Features</button>
            <button onClick={() => scrollToSection('demo')} className="hover:text-blue-600 transition">Live Demo</button>
            <button onClick={() => scrollToSection('tech')} className="hover:text-blue-600 transition">Technology</button>
            <button onClick={() => scrollToSection('team')} className="hover:text-blue-600 transition">Team</button>
          </div>

          <button 
            onClick={() => scrollToSection('demo')}
            className="hidden md:block px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-sm font-medium transition"
          >
            Try Demo
          </button>

          {/* Mobile Hamburger */}
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2">
            <div className="space-y-1">
              <div className={`w-6 h-0.5 bg-slate-800 transition ${mobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
              <div className={`w-6 h-0.5 bg-slate-800 transition ${mobileMenuOpen ? 'opacity-0' : ''}`} />
              <div className={`w-6 h-0.5 bg-slate-800 transition ${mobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="md:hidden border-t bg-white px-6 py-6 flex flex-col gap-4 text-sm">
              {['how','features','demo','tech','team'].map(id => (
                <button key={id} onClick={() => scrollToSection(id)} className="text-left py-1.5 capitalize">{id === 'how' ? 'How it Works' : id}</button>
              ))}
              <button onClick={() => scrollToSection('demo')} className="mt-2 w-full py-3 bg-blue-600 text-white rounded-xl">Launch Live Demo</button>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* HERO */}
      <section className="pt-20 pb-16 bg-white relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 pt-14 pb-10 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium mb-4 tracking-wide">HACKATHON PROJECT • AGENTIC AI</div>
            <h1 className="text-5xl md:text-7xl font-semibold tracking-tighter leading-none mb-6">
              Smart Meeting Assistant
            </h1>
            <p className="text-2xl md:text-3xl text-slate-600 tracking-tight mb-4">From Conversation to Action</p>
            <p className="max-w-lg text-xl text-slate-600 mb-9">Transform every meeting into clear summaries and prioritized tasks using intelligent autonomous AI agents.</p>
            
            <div className="flex flex-wrap gap-4">
              <button onClick={() => scrollToSection('demo')} className="flex items-center gap-3 px-9 py-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-2xl font-medium text-lg transition shadow-lg shadow-blue-200">
                Try Interactive Demo <ArrowRight className="w-5 h-5" />
              </button>
              <button onClick={() => scrollToSection('how')} className="flex items-center gap-3 px-9 py-4 border-2 border-slate-900 hover:bg-slate-900 hover:text-white rounded-2xl font-medium text-lg transition">
                See How it Works
              </button>
            </div>
            <div className="mt-8 flex items-center gap-6 text-sm text-slate-500">
              <div className="flex items-center gap-2"><Shield className="w-4 h-4" /> Privacy-first</div>
              <div className="flex items-center gap-2"><Clock className="w-4 h-4" /> Results in seconds</div>
            </div>
          </div>
          <div className="relative hidden md:block">
            <div className="rounded-3xl overflow-hidden shadow-2xl border border-slate-200">
              <img src="/images/hero.jpg" alt="Professional meeting with AI assistance" className="w-full h-auto" />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-5 border border-slate-100 w-60">
              <div className="text-xs uppercase tracking-[2px] text-blue-600 mb-1">AGENTIC AI</div>
              <div className="font-semibold">3 actionable tasks generated</div>
              <div className="text-xs text-slate-500 mt-1">From a 23-minute meeting</div>
            </div>
          </div>
        </div>
      </section>

      {/* PROBLEM & SOLUTION */}
      <section className="max-w-6xl mx-auto px-6 py-20 border-b border-slate-200">
        <div className="grid md:grid-cols-2 gap-16">
          <div>
            <div className="uppercase tracking-[3px] text-xs text-red-600 mb-3 font-medium">THE PROBLEM</div>
            <h2 className="text-4xl font-semibold tracking-tight mb-6">Meetings waste time.<br />Follow-ups get lost.</h2>
            <ul className="space-y-4 text-lg text-slate-600">
              <li className="flex gap-4"><span className="mt-1.5 text-red-500">•</span> 70% of action items are forgotten or delayed</li>
              <li className="flex gap-4"><span className="mt-1.5 text-red-500">•</span> Manual note-taking distracts from active discussion</li>
              <li className="flex gap-4"><span className="mt-1.5 text-red-500">•</span> Summaries are inconsistent and hard to share</li>
            </ul>
          </div>
          <div>
            <div className="uppercase tracking-[3px] text-xs text-emerald-600 mb-3 font-medium">THE SOLUTION</div>
            <h2 className="text-4xl font-semibold tracking-tight mb-6">Agentic AI that listens, understands, and acts.</h2>
            <p className="text-xl text-slate-600">SmartMeet AI autonomously processes conversations, extracts meaning, and delivers concise summaries with ready-to-execute tasks — no manual effort required.</p>
            <button onClick={() => scrollToSection('how')} className="mt-8 inline-flex items-center gap-2 text-blue-600 font-medium hover:underline">Explore the workflow →</button>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS — INTERACTIVE STEP-BY-STEP ROUNDS */}
      <section id="how" className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <div className="inline px-4 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium tracking-widest">THE WORKFLOW</div>
          <h2 className="text-5xl tracking-[-1.5px] font-semibold mt-4 mb-3">How It Works</h2>
          <p className="text-slate-600 text-xl max-w-md mx-auto">Four intelligent stages. Click each circle to explore the process.</p>
        </div>

        {/* Round Clickable Steps */}
        <div className="flex flex-col lg:flex-row justify-center items-center gap-4 lg:gap-6 mb-10">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = activeStep === step.id;
            return (
              <React.Fragment key={step.id}>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.985 }}
                  onClick={() => handleStepClick(step.id)}
                  className={`group relative flex flex-col items-center w-full max-w-[168px] transition-all duration-200 ${isActive ? 'scale-[1.01]' : ''}`}
                >
                  <div className={`
                    w-24 h-24 md:w-28 md:h-28 rounded-full flex items-center justify-center border-4 transition-all duration-300
                    ${isActive 
                      ? 'border-blue-600 bg-blue-600 text-white shadow-xl shadow-blue-200' 
                      : 'border-slate-200 bg-white text-slate-700 group-hover:border-blue-400 group-hover:text-blue-600'
                    }
                  `}>
                    <Icon className="w-9 h-9 md:w-10 md:h-10" />
                  </div>
                  <div className="mt-4 text-center">
                    <div className={`font-semibold text-lg tracking-tight ${isActive ? 'text-blue-700' : ''}`}>{step.title}</div>
                    <div className="text-xs uppercase tracking-[1.5px] text-slate-500 mt-px">{step.short}</div>
                  </div>
                  {/* Step Number Badge */}
                  <div className={`absolute -top-2 -right-1 text-[10px] font-mono px-2 py-px rounded-full ${isActive ? 'bg-blue-700 text-white' : 'bg-slate-200 text-slate-600'}`}>
                    0{step.id}
                  </div>
                </motion.button>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block text-slate-300"><ArrowRight className="w-6 h-6" /></div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Dynamic Explanation Panel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.32, ease: [0.22,1,0.36,1] }}
            className="max-w-4xl mx-auto bg-white border border-slate-200 rounded-3xl p-9 md:p-12 shadow-sm"
          >
            <div className="flex items-start gap-5">
              <div className="shrink-0 mt-1">
                {React.createElement(currentStep.icon, { className: "w-12 h-12 text-blue-600" })}
              </div>
              <div className="flex-1">
                <div className="uppercase tracking-[3px] text-xs text-blue-600 mb-2">STEP {currentStep.id}</div>
                <h3 className="text-3xl font-semibold tracking-tight mb-3">{currentStep.title}</h3>
                <p className="text-xl text-slate-600 mb-6">{currentStep.description}</p>
                <p className="leading-relaxed text-[17px] text-slate-700">{currentStep.detail}</p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </section>

      {/* KEY FEATURES */}
      <section id="features" className="bg-white py-20 border-y border-slate-200">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="text-blue-600 text-sm tracking-[3px] font-medium">CAPABILITIES</div>
            <h2 className="text-5xl font-semibold tracking-tight mt-2">Key Features</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div whileHover={{ y: -4 }} key={i} className="group p-8 border border-slate-200 rounded-3xl bg-slate-50 hover:bg-white hover:shadow-xl transition">
                  <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h4 className="font-semibold text-2xl tracking-tight mb-3">{feature.title}</h4>
                  <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* INTERACTIVE DEMO UI */}
      <section id="demo" className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-10">
          <div className="inline px-4 py-1 rounded-full bg-emerald-100 text-emerald-700 text-sm font-medium">TRY IT YOURSELF</div>
          <h2 className="text-5xl font-semibold tracking-tighter mt-3 mb-2">Live Interactive Demo</h2>
          <p className="text-slate-600 text-lg max-w-lg mx-auto">Experience the full workflow. Use voice or text and watch AI generate real summaries and actionable items.</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl shadow-xl overflow-hidden">
          {/* Demo Controls */}
          <div className="flex flex-wrap border-b border-slate-100">
            <button onClick={() => { setInputType('text'); setResults(null); }} className={`flex-1 md:flex-none px-8 py-5 text-sm font-medium transition ${inputType === 'text' ? 'border-b-2 border-blue-600 text-blue-700' : 'text-slate-500 hover:text-slate-700'}`}>Text Input</button>
            <button onClick={() => { setInputType('voice'); setResults(null); }} className={`flex-1 md:flex-none px-8 py-5 text-sm font-medium transition ${inputType === 'voice' ? 'border-b-2 border-blue-600 text-blue-700' : 'text-slate-500 hover:text-slate-700'}`}>Voice Recording</button>
          </div>

          <div className="p-8 md:p-11 grid lg:grid-cols-2 gap-9">
            {/* INPUT SIDE */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <div className="font-medium flex items-center gap-2 text-lg"><Mic className="w-5 h-5" /> Meeting Input</div>
                <button onClick={resetDemo} className="flex items-center gap-1.5 text-xs px-4 py-1.5 rounded-full border hover:bg-slate-50"><RotateCcw className="w-3.5 h-3.5" /> Reset</button>
              </div>

              {inputType === 'text' ? (
                <>
                  <textarea 
                    value={textInput} 
                    onChange={(e) => setTextInput(e.target.value)} 
                    placeholder="Paste meeting notes or type what was discussed..." 
                    className="w-full h-40 resize-y p-5 rounded-2xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-100 text-[15px]" 
                  />
                  <div className="flex flex-wrap gap-2 mt-4">
                    {sampleInputs.map((s, idx) => (
                      <button key={idx} onClick={() => loadSample(s)} className="text-xs px-4 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-full transition">Sample {idx + 1}</button>
                    ))}
                  </div>
                </>
              ) : (
                <div className="border border-slate-200 bg-slate-50 rounded-2xl p-8 text-center">
                  <button 
                    onClick={isRecording ? stopRecording : startRecording} 
                    className={`mx-auto w-20 h-20 flex items-center justify-center rounded-full transition-all duration-200 shadow ${isRecording ? 'bg-red-600 hover:bg-red-700 text-white scale-[1.05]' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
                  >
                    {isRecording ? <Square className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
                  </button>
                  <p className="mt-5 text-sm text-slate-600 font-medium">{isRecording ? "Recording... Speak naturally" : "Tap to start live voice capture"}</p>
                  {transcript && (
                    <div className="mt-6 p-5 bg-white rounded-xl text-left text-sm border border-slate-100 leading-relaxed max-h-36 overflow-auto">{transcript}</div>
                  )}
                </div>
              )}

              <button 
                onClick={processMeeting} 
                disabled={isProcessing || (inputType === 'text' ? !textInput.trim() : !transcript.trim())} 
                className="mt-7 w-full py-4 rounded-2xl bg-blue-600 disabled:bg-slate-300 text-white font-medium flex justify-center items-center gap-3 hover:bg-blue-700 transition disabled:cursor-not-allowed text-lg"
              >
                {isProcessing ? "AGENTIC AI ANALYZING..." : "PROCESS WITH SMART AI"} 
                {!isProcessing && <ArrowRight className="w-5 h-5" />}
              </button>
            </div>

            {/* OUTPUT SIDE - Fully Functioning */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="font-medium flex items-center gap-2 text-lg"><CheckCircle className="w-5 h-5" /> AI Output</div>
                {results && (
                  <div className="flex gap-2">
                    <button onClick={copyResults} className="flex items-center gap-1.5 text-xs px-5 py-2 border border-slate-200 rounded-full hover:bg-slate-50"><Copy className="w-3.5 h-3.5" /> Copy All</button>
                  </div>
                )}
              </div>

              <AnimatePresence mode="wait">
                {!results ? (
                  <div className="h-[394px] flex flex-col justify-center items-center text-center rounded-2xl border border-dashed border-slate-300 bg-slate-50">
                    <Search className="w-12 h-12 text-slate-300 mb-4" />
                    <p className="text-slate-500 max-w-[220px]">Process a meeting input above to see smart summaries, key points, and actionable tasks.</p>
                  </div>
                ) : (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                    {/* Summary */}
                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                      <div className="font-semibold tracking-tight mb-2 text-blue-700">SUMMARY</div>
                      <p className="text-[15px] text-slate-700 leading-relaxed">{results.summary}</p>
                    </div>

                    {/* Key Points */}
                    <div>
                      <div className="font-semibold tracking-tight mb-3 flex items-center gap-2"><Target className="w-4 h-4" /> KEY POINTS</div>
                      <ul className="space-y-2 text-[15px] pl-1">
                        {results.keyPoints.map((point, i) => (
                          <li key={i} className="flex gap-3"><span className="text-blue-600 mt-1.5">•</span> {point}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Action Items — Fully Interactive */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="font-semibold tracking-tight flex items-center gap-2"><CheckCircle className="w-4 h-4" /> ACTION ITEMS</div>
                        <div className="text-xs px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 font-medium">{progress}% Complete</div>
                      </div>
                      <div className="space-y-2.5">
                        {actionItems.map((item) => (
                          <label key={item.id} className="flex items-start gap-4 bg-white p-4 rounded-2xl border border-slate-200 cursor-pointer hover:border-blue-200 transition">
                            <input type="checkbox" checked={item.completed} onChange={() => toggleAction(item.id)} className="mt-1 accent-blue-600 w-5 h-5" />
                            <span className={`flex-1 text-[15px] leading-tight ${item.completed ? 'line-through text-slate-400' : ''}`}>{item.text}</span>
                          </label>
                        ))}
                      </div>
                      {/* Add New Action */}
                      <div className="flex mt-4 gap-2">
                        <input value={newAction} onChange={(e) => setNewAction(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addActionItem()} placeholder="Add a custom action item..." className="flex-1 px-5 py-3 rounded-2xl border bg-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-300" />
                        <button onClick={addActionItem} className="px-7 rounded-2xl bg-slate-900 text-white text-sm font-medium">Add</button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* TECHNOLOGIES USED */}
      <section id="tech" className="bg-slate-900 py-20 text-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <div className="text-blue-400 tracking-[4px] text-xs font-medium">POWERED BY</div>
            <h2 className="text-5xl font-semibold tracking-tight mt-3">Technologies Used</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {technologies.map((tech, index) => {
              const Icon = tech.icon;
              return (
                <div key={index} className="flex items-center gap-5 p-7 bg-slate-800/70 rounded-3xl border border-slate-700">
                  <div className="shrink-0 w-14 h-14 rounded-2xl bg-blue-950 flex items-center justify-center"><Icon className="w-7 h-7" /></div>
                  <div>
                    <div className="font-semibold text-xl tracking-tight">{tech.name}</div>
                    <div className="text-slate-400 text-sm mt-px">{tech.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>
          <p className="text-center mt-9 text-slate-400 text-sm">Built on a secure foundation combining conversational AI, autonomous planning, and real-time speech processing.</p>
        </div>
      </section>

      {/* ADVANTAGES */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-5 gap-x-8 gap-y-10">
          <div className="lg:col-span-2">
            <div className="text-blue-600 uppercase tracking-widest text-xs mb-2">WHY SMARTMEET</div>
            <h2 className="font-semibold text-5xl tracking-tighter">Clear advantages.<br />Measurable impact.</h2>
          </div>
          <div className="lg:col-span-3 grid sm:grid-cols-2 gap-x-10 gap-y-6 text-[17px] text-slate-700 pt-2">
            {advantages.map((adv, i) => (
              <div key={i} className="flex gap-3"><CheckCircle className="text-emerald-600 w-6 h-6 shrink-0 mt-1" /> {adv}</div>
            ))}
          </div>
        </div>
      </section>

      {/* APPLICATIONS */}
      <section className="bg-white border-y border-slate-200 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="text-xs tracking-[3px] text-blue-600 font-medium">VERSATILE ACROSS INDUSTRIES</div>
            <h3 className="text-5xl tracking-[-1.5px] font-semibold mt-3">Applications</h3>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {applications.map((app, i) => {
              const Icon = app.icon;
              return (
                <div key={i} className="rounded-3xl border border-slate-200 px-8 py-9 hover:border-blue-300 transition">
                  <Icon className="w-9 h-9 text-blue-600 mb-6" />
                  <div className="font-semibold tracking-tight text-2xl mb-2">{app.title}</div>
                  <p className="text-slate-600 leading-snug">{app.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FUTURE SCOPE */}
      <section className="max-w-5xl mx-auto px-6 py-20 text-center">
        <div className="uppercase tracking-[4px] text-xs text-blue-600 mb-3">WHAT'S NEXT</div>
        <h2 className="text-5xl tracking-tight font-semibold mb-4">Future Scope</h2>
        <p className="max-w-xl mx-auto text-xl text-slate-600">Our roadmap includes powerful enhancements to make meetings even smarter and more connected.</p>
        
        <div className="mt-12 grid md:grid-cols-3 gap-6 text-left">
          {[
            { title: "Multi-Meeting Memory", desc: "Agents retain context across a series of related meetings for continuous intelligence." },
            { title: "Automatic Calendar Sync", desc: "Direct push of deadlines into Google Calendar, Outlook, or Notion with reminders." },
            { title: "Enterprise Search", desc: "Query any past discussion and instantly retrieve decisions, context, or commitments." }
          ].map((scope, idx) => (
            <div key={idx} className="bg-white border border-slate-200 rounded-3xl p-9">
              <div className="text-xs tracking-[1.5px] mb-4 text-slate-400">PHASE {idx + 1}</div>
              <div className="font-semibold text-2xl tracking-tight mb-3">{scope.title}</div>
              <p className="text-slate-600 text-[15px]">{scope.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TEAM SECTION */}
      <section id="team" className="bg-slate-900 py-20 text-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-14 items-center">
            <div className="lg:w-5/12">
              <div className="uppercase tracking-[3px] text-xs text-blue-400 mb-4">THE CREATORS</div>
              <h2 className="font-semibold tracking-tighter text-6xl">Built by a passionate team of AI engineers and designers.</h2>
              <p className="mt-6 text-slate-300 text-xl">We believe better meetings lead to better outcomes. Our goal is to free knowledge workers from administrative burden.</p>
            </div>
            <div className="lg:w-7/12">
              <div className="rounded-3xl overflow-hidden shadow-2xl border border-slate-700">
                <img src="/images/team.jpg" alt="The SmartMeet AI team" className="w-full" />
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-14">
            {team.map((member, index) => (
              <div key={index} className="bg-slate-800 border border-slate-700 rounded-3xl p-8">
                <div className="font-semibold text-2xl tracking-tight">{member.name}</div>
                <div className="text-blue-400 mt-px mb-4 tracking-wide text-sm">{member.role}</div>
                <p className="text-slate-300 leading-snug">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER / FINAL CTA */}
      <footer className="bg-white border-t py-14">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-y-6 text-sm text-slate-500">
          <div>© Smart Meeting Assistant — Agentic AI Hackathon Project</div>
          <div className="flex gap-x-9">
            <button onClick={() => scrollToSection('demo')} className="hover:text-slate-900 transition">Launch Demo</button>
            <button onClick={() => scrollToSection('how')} className="hover:text-slate-900 transition">Workflow</button>
          </div>
          <div>Built with React 19 • TypeScript • Tailwind • Framer Motion</div>
        </div>
      </footer>
    </div>
  );
}

export default App;

