import { useState, useEffect, useRef } from 'react'
import Scene from './components/Scene'
import MatrixBackground from './components/MatrixBackground'
import { asciiArt } from './ascii'

function App() {
    // Helper to generate help content to reuse in initial state
    const getHelpContent = (onCmd) => (
        <div className="response-list">
            <div>Available commands:</div>
            <div>- <span className="cmd clickable" onClick={() => onCmd('projects')}>projects</span>: View my projects</div>
            <div>- <span className="cmd clickable" onClick={() => onCmd('about')}>about</span>: About me</div>
            <div>- <span className="cmd clickable" onClick={() => onCmd('contact')}>contact</span>: Contact info</div>
            <div>- <span className="cmd clickable" onClick={() => onCmd('clear')}>clear</span>: Clear terminal</div>
        </div>
    );

    const [history, setHistory] = useState([]);
    const [input, setInput] = useState('');
    const inputRef = useRef(null);
    const endRef = useRef(null);

    const focusInput = () => {
        inputRef.current?.focus();
    };

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [history]);

    const handleCommand = (cmd) => {
        const trimmedCmd = cmd.trim().toLowerCase();
        let response = null;

        switch (trimmedCmd) {
            case 'help':
                response = getHelpContent(handleCommand);
                break;
            case 'projects':
                response = (
                    <div className="response-list">
                        <div>My Projects:</div>
                        <div>1. <a href="https://github.com/lukepoley/Internetworking-Projects" target="_blank" rel="noopener noreferrer">Internetworking Projects</a> - A collection of computer networking projects exploring the Internet’s layered architecture, core protocols (TCP, UDP, IP, BGP, DNS), and real-world trade-offs through hands-on implementation and measurement. Includes: </div>
                        <div>
                            <div>▪ A Python-based implementation of the early gopher protocol for peer to peer file sharing</div>
                            <div>▪ Educational presentations on network topologies with discussion on bandwidth and latency and another
                                presentation on how TCP works with each step in Wireshark in relation to a website’s components
                            </div>
                            <div>▪ Blog-styled explainer on how BGP’s policy-based routing works between autonomous systems </div>
                        </div>
                        <div>2. <a href="https://github.com/lukepoley/Sales-Tax-Automation" target="_blank" rel="noopener noreferrer">Sales Tax Automation & Audit Preparation Tool</a> - A high-performance Python-based automation tool designed to streamline the extraction, filtering, and reporting of Joint Interest Billing (JIB) data for tax compliance</div>
                        <div>3. <a href="https://github.com/lukepoley/Internetworking-Projects/tree/main/network-detection-app" target="_blank" rel="noopener noreferrer">Network Detection App</a> - A powerful Kotlin app that helps you analyze your WiFi network, detect signal dead zones, measure connection speed, and identify potential bandwidth hogs.</div>
                        <div>4. <a href="https://github.com/lukepoley/Internetworking-Projects/tree/main/boardgame-databse-website" target="_blank" rel="noopener noreferrer">Board Game Search Website</a> - Developed a full stack website that shows data for thousands of board games in an itemized table using Flask.</div>
                        <div>5. <a href="https://github.com/lukepoley/rust-password-manager" target="_blank" rel="noopener noreferrer">Rust Password Manager</a> - A secure, CLI-based password manager written in Rust.</div>
                        <div>6. Check out my <a href="https://github.com/lukepoley/" target="_blank" rel="noopener noreferrer">Github</a> for more projects</div>
                    </div>
                );
                break;
            case 'about':
                response = (
                    <div>
                        <div>Hey there, I'm Luke Poley.</div>
                        <div>I am currently a Junior studying Computer Science at Carleton College, who is originally from Los Angeles. </div>
                        <div>Occasionally, I’ll read philosophy (for boredom), climb a 14er, play golf for the aura, come up with a cool new board game idea, or play sports to strength my agency.</div>
                        <p></p>
                        <div>Fun Facts!: </div>
                        <div> I daily drive a partition of CachyOS on my Asus G14</div>
                        <div> Two of my favorite books are Evidence and Agency by Berislav Marušić and Games: Agency As Art by C. Thi Nguyen</div>
                        <div> The two food groups are snacks and meals </div>
                        <p></p>
                        <div>Here is a ascii rendition of myself</div>
                        <pre style={{ fontSize: '6px', lineHeight: '6px' }}>
                            {asciiArt}
                        </pre>
                    </div>
                );
                break;
            case 'contact':
                response = (
                    <div>
                        Email: <a href="mailto:poleydev@gmail.com">poleydev@gmail.com</a><br />
                        GitHub: <a href="https://github.com/lukepoley">lukepoley</a>
                    </div>
                );
                break;
            case 'clear':
                setHistory([]);
                return;
            case '':
                break;
            default:
                response = `Command not found: ${trimmedCmd}`;
        }

        if (response || trimmedCmd === '') {
            setHistory(prev => [...prev,
            { type: 'command', content: cmd },
            { type: 'output', content: response }
            ]);
        } else {
            setHistory(prev => [...prev, { type: 'command', content: cmd }]);
        }
    };

    // Initial load effect
    useEffect(() => {
        setHistory([
            { type: 'output', content: "Welcome to lpoley terminal v1.0.0" },
            { type: 'output', content: getHelpContent(handleCommand) }
        ]);
    }, []);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleCommand(input);
            setInput('');
        }
    };

    return (
        <div className="app-container" onClick={focusInput}>
            <MatrixBackground />
            <div className="terminal-interface">
                <div className="history">
                    {history.map((item, index) => (
                        <div key={index} className={`line ${item.type}`}>
                            {item.type === 'command' && <span className="prompt">lpoley@website:~$ </span>}
                            {item.content}
                        </div>
                    ))}
                </div>
                <div className="input-line">
                    <span className="prompt">lpoley@website:~$</span>
                    <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="terminal-input"
                        autoFocus
                    />
                </div>
                <div ref={endRef} />
            </div>
            <Scene />
        </div>
    )
}

export default App
